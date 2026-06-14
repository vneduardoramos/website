import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notify";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

const schema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email(),
  message: z.string().max(5000).optional().or(z.literal("")),
  openingTitle: z.string().max(200).optional(),
  openingId: z.string().optional(),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const rl = rateLimit(`careers:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const data = parsed.data;

  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  try {
    const application = await prisma.jobApplication.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message || null,
        openingId: data.openingId || null,
      },
    });

    await notify({
      subject: `New Viewnear job application: ${data.name}${
        data.openingTitle ? `: ${data.openingTitle}` : ""
      }`,
      text: `${data.name} <${data.email}>\n\n${data.message || "(no message)"}`,
    }).catch((e) => console.error("[careers] notify failed:", e));

    return NextResponse.json({ ok: true, id: application.id });
  } catch (e) {
    console.error("[careers] failed to save application:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
