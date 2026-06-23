import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";
import { parseOverrideInput } from "@/lib/image-overrides";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rl = rateLimit(`imgov:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = parseOverrideInput(await req.json().catch(() => null));
  if (!parsed) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updatedBy = session.user?.email ?? null;
  await prisma.imageOverride.upsert({
    where: { key: parsed.key },
    create: { key: parsed.key, ...parsed.data, updatedBy },
    update: { ...parsed.data, updatedBy },
  });
  revalidateTag("image-overrides");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rl = rateLimit(`imgov:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  await prisma.imageOverride.deleteMany({ where: { key } });
  revalidateTag("image-overrides");
  return NextResponse.json({ ok: true });
}
