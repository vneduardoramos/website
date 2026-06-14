import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeBands } from "@/lib/client-bands";

/**
 * Save the home-page client-logo bands config.
 *
 * A route handler (not a server action) on purpose: a plain fetch from the
 * editor does not trigger Next's post-action router refresh, so the editor's
 * client state and its "Saved" confirmation survive the save. The public site
 * is revalidated so the change goes live immediately.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Server-side sanitize (clamps offsets/scale, drops invalid logos).
  const value = JSON.stringify(sanitizeBands(body));
  await prisma.siteSetting.upsert({
    where: { key: "clientBands" },
    update: { value },
    create: { key: "clientBands", value },
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
