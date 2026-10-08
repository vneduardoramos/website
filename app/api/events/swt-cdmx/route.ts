import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notify";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

/**
 * Lead capture for one dated event: Snowflake World Tour Mexico City,
 * October 13, 2026. Saved as a `Lead` (source "event-swt-cdmx-2026") so it
 * shows up in whatever already reads that table, and emailed via Resend
 * (lib/notify) the same way /api/contact does, so a submission during the
 * show reaches the team immediately rather than waiting on someone to check
 * the database.
 */
const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

const SOURCE = "event-swt-cdmx-2026";
const DEFAULT_MESSAGE = "Would like to connect at the Snowflake World Tour Mexico City booth.";

export async function POST(req: Request) {
  const rl = rateLimit(`events:swt-cdmx:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
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

  const message = data.message?.trim() || DEFAULT_MESSAGE;

  try {
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company || null,
        message,
        source: SOURCE,
      },
    });

    await notify({
      subject: `Snowflake World Tour CDMX: ${data.firstName} ${data.lastName} wants to connect`,
      text: `${data.firstName} ${data.lastName} <${data.email}>${
        data.company ? ` (${data.company})` : ""
      }\n\n${message}`,
    }).catch((e) => console.error("[events/swt-cdmx] notify failed:", e));

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("[events/swt-cdmx] failed to save lead:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
