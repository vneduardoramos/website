import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notify";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional().or(z.literal("")),
  role: z.string().max(100).optional().or(z.literal("")),
  message: z.string().min(1).max(5000),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const rl = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
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

  // Honeypot: silently accept bots without persisting.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company || null,
        message: data.message,
        source: "contact",
      },
    });

    // Notification failure shouldn't fail the submission (lead is already saved).
    await notify({
      subject: `New Viewnear lead: ${data.firstName} ${data.lastName}`,
      text: `${data.firstName} ${data.lastName} <${data.email}>${
        data.company ? ` (${data.company})` : ""
      }${data.role ? `\nEnquiry type: ${data.role}` : ""}\n\n${data.message}`,
    }).catch((e) => console.error("[contact] notify failed:", e));

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("[contact] failed to save lead:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
