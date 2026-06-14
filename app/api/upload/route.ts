import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

// Raster image types only. SVG is deliberately excluded: it can carry inline
// <script>, and files are served from /uploads on the same origin as the admin.
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`upload:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or AVIF image." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 8 MB)." },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const stored = await storage.save(buffer, file.name, file.type);

  try {
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url: stored.url,
        mimeType: file.type,
        storageKey: stored.storageKey,
        alt: (form.get("alt") as string) || null,
      },
    });
    return NextResponse.json({ ok: true, media });
  } catch (e) {
    // Roll back the stored file so a failed DB write doesn't orphan it.
    await storage.delete(stored.storageKey).catch(() => {});
    console.error("[upload] failed to record media:", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
