import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`pexels:${clientIp(req)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, configured: false });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
  }
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const upstreamUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=24&page=${page}`;
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      headers: { Authorization: apiKey },
    });
  } catch (e) {
    console.error("[pexels/search] fetch error:", e);
    return NextResponse.json({ ok: false, error: "Upstream fetch failed" }, { status: 502 });
  }

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: `Pexels API error: ${upstreamRes.status} ${text}` },
      { status: 502 }
    );
  }

  const data = await upstreamRes.json();
  const photos = (data.photos ?? []).map((photo: Record<string, unknown>) => {
    const src = (photo.src ?? {}) as Record<string, string>;
    return {
      id: photo.id as number,
      thumb: src.medium ?? "",
      full: src.large2x ?? src.large ?? "",
      alt: (photo.alt as string) || "",
      photographer: (photo.photographer as string) || "",
    };
  });

  return NextResponse.json({ ok: true, configured: true, photos });
}
