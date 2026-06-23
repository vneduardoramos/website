import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`pexels-select:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  let url: string;
  try {
    const body = await req.json();
    url = body?.url;
    if (typeof url !== "string" || !url) throw new Error("missing url");
  } catch {
    return NextResponse.json({ error: "Body must be JSON with a url field" }, { status: 400 });
  }

  // SSRF guard
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const hostname = parsed.hostname;
  const isAllowedHost =
    hostname === "images.pexels.com" ||
    hostname.endsWith(".pexels.com");
  if (parsed.protocol !== "https:" || !isAllowedHost) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  // Fetch the image from Pexels
  let imgRes: Response;
  try {
    imgRes = await fetch(url);
  } catch (e) {
    console.error("[pexels/select] fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  if (!imgRes.ok) {
    return NextResponse.json({ error: `Image fetch failed: ${imgRes.status}` }, { status: 502 });
  }

  const contentType = imgRes.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!contentType.startsWith("image/") || !ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json({ error: "Response is not a supported image type" }, { status: 400 });
  }

  const arrayBuffer = await imgRes.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8 MB limit" }, { status: 413 });
  }

  const buffer = Buffer.from(arrayBuffer);
  const ext = extFromMime(contentType);
  const filename = `pexels-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;

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
    console.error("[pexels/select] failed to record media:", e);
    return NextResponse.json({ error: "Failed to save image. Please try again." }, { status: 500 });
  }
}
