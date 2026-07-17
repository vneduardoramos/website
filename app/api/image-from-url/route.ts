import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { lookup } from "node:dns/promises";
import { Agent } from "undici";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function extFromMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg": return "jpg";
    case "image/png":  return "png";
    case "image/webp": return "webp";
    case "image/gif":  return "gif";
    case "image/avif": return "avif";
    default:           return "jpg";
  }
}

/**
 * True for loopback / private / link-local / reserved IPs that an authenticated
 * admin should never be able to make the server fetch (SSRF guard). Handles
 * IPv4, IPv6, and IPv4-mapped IPv6.
 */
function isBlockedIp(ip: string): boolean {
  const v4Mapped = ip.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
  if (v4Mapped) return isBlockedIpv4(v4Mapped[1]);
  if (ip.includes(".") && !ip.includes(":")) return isBlockedIpv4(ip);

  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;        // loopback / unspecified
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true;          // fc00::/7 unique-local
  if (/^fe[89ab][0-9a-f]:/.test(lower)) return true;          // fe80::/10 link-local
  if (/^ff[0-9a-f]{2}:/.test(lower)) return true;             // ff00::/8 multicast
  return false;
}

function isBlockedIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return true; // malformed: block
  }
  const [a, b] = parts;
  if (a === 0) return true;                              // 0.0.0.0/8
  if (a === 10) return true;                             // 10.0.0.0/8 private
  if (a === 127) return true;                            // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true;              // 169.254.0.0/16 link-local (incl. cloud metadata)
  if (a === 172 && b >= 16 && b <= 31) return true;     // 172.16.0.0/12 private
  if (a === 192 && b === 168) return true;              // 192.168.0.0/16 private
  if (a === 100 && b >= 64 && b <= 127) return true;    // 100.64.0.0/10 CGNAT
  if (a >= 224) return true;                             // 224.0.0.0/3 multicast + reserved
  return false;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`image-from-url:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  let url: string;
  try {
    const body = await req.json();
    url = body?.url;
    if (typeof url !== "string" || !url) throw new Error("missing url");
  } catch {
    return NextResponse.json({ error: "Body must be JSON with a url field" }, { status: 400 });
  }

  // Validate URL shape + scheme
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only http and https URLs are allowed" }, { status: 400 });
  }

  // SSRF guard: resolve the host and reject if any address is private/loopback/etc.
  const host = parsed.hostname.replace(/^\[|\]$/g, "");
  let addrs: { address: string; family: number }[];
  try {
    addrs = await lookup(host, { all: true });
    if (addrs.length === 0 || addrs.some((a) => isBlockedIp(a.address))) {
      return NextResponse.json({ error: "URL host is not allowed" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Could not resolve URL host" }, { status: 400 });
  }

  // Fetch the image, pinned to one of the addresses just validated above.
  // Without this, fetch() would re-resolve DNS on its own right before
  // connecting; an attacker controlling the DNS record could serve a benign
  // address to our lookup() check and then a private/metadata address to the
  // actual connection (DNS rebinding TOCTOU). A custom `connect.lookup` on an
  // undici Agent, passed as the fetch `dispatcher`, forces the real TCP/TLS
  // connection to use only the address we already vetted, while still
  // connecting by hostname (so TLS servername/verification is unaffected).
  const validatedAddr = addrs[0]!;
  const pinnedDispatcher = new Agent({
    connect: {
      lookup: (
        _hostname: string,
        _options: unknown,
        callback: (err: Error | null, address: string, family: number) => void
      ) => {
        callback(null, validatedAddr.address, validatedAddr.family);
      },
    },
  });

  let imgRes: Response;
  try {
    imgRes = await fetch(parsed.toString(), {
      redirect: "error",
      dispatcher: pinnedDispatcher,
    } as RequestInit & { dispatcher: unknown });
  } catch (e) {
    console.error("[image-from-url] fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  if (!imgRes.ok) {
    return NextResponse.json({ error: `Image fetch failed: ${imgRes.status}` }, { status: 502 });
  }

  const contentType = imgRes.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!contentType.startsWith("image/") || !ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json({ error: "That URL is not a supported image (jpg, png, webp, gif, avif)" }, { status: 400 });
  }

  const declaredLength = Number(imgRes.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8 MB limit" }, { status: 413 });
  }

  // Stream with a hard size cap so an arbitrary URL can't buffer an unbounded body.
  let buffer: Buffer;
  try {
    const reader = imgRes.body?.getReader();
    if (!reader) throw new Error("no body");
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_BYTES) {
          await reader.cancel().catch(() => {});
          return NextResponse.json({ error: "Image exceeds 8 MB limit" }, { status: 413 });
        }
        chunks.push(value);
      }
    }
    buffer = Buffer.concat(chunks);
  } catch (e) {
    console.error("[image-from-url] read error:", e);
    return NextResponse.json({ error: "Failed to read image" }, { status: 502 });
  }

  if (buffer.byteLength === 0) {
    return NextResponse.json({ error: "Image was empty" }, { status: 400 });
  }

  const ext = extFromMime(contentType);
  const filename = `url-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;

  const storage = getStorage();
  const stored = await storage.save(buffer, filename, contentType);

  try {
    const media = await prisma.media.create({
      data: {
        filename,
        url: stored.url,
        mimeType: contentType,
        storageKey: stored.storageKey,
        alt: null,
      },
    });
    return NextResponse.json({ ok: true, url: media.url });
  } catch (e) {
    await storage.delete(stored.storageKey).catch(() => {});
    console.error("[image-from-url] failed to record media:", e);
    return NextResponse.json({ error: "Failed to save image. Please try again." }, { status: 500 });
  }
}
