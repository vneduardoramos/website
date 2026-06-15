import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notify";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";
import { getStorage } from "@/lib/storage";

const schema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email(),
  message: z.string().max(5000).optional().or(z.literal("")),
  linkedinUrl: z.string().url().max(300).optional().or(z.literal("")),
  openingTitle: z.string().max(200).optional(),
  openingId: z.string().optional(),
  website: z.string().optional(), // honeypot
});

// Resume uploads: documents only, capped at 8 MB.
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const RESUME_MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const rl = rateLimit(`careers:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse({
    name: String(form.get("name") || ""),
    email: String(form.get("email") || ""),
    message: String(form.get("message") || ""),
    linkedinUrl: String(form.get("linkedinUrl") || ""),
    openingTitle: String(form.get("openingTitle") || "") || undefined,
    openingId: String(form.get("openingId") || "") || undefined,
    website: String(form.get("website") || ""),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const data = parsed.data;

  // Honeypot: silently accept bots without persisting.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Optional resume upload via the configured storage adapter.
  let resumeUrl: string | null = null;
  const resume = form.get("resume");
  if (resume instanceof File && resume.size > 0) {
    if (!RESUME_TYPES.has(resume.type)) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document." },
        { status: 415 },
      );
    }
    if (resume.size > RESUME_MAX_BYTES) {
      return NextResponse.json({ error: "Resume is too large (max 8 MB)." }, { status: 413 });
    }
    try {
      const buffer = Buffer.from(await resume.arrayBuffer());
      const stored = await getStorage().save(buffer, resume.name || "resume", resume.type);
      resumeUrl = stored.url;
    } catch (e) {
      console.error("[careers] resume upload failed:", e);
      return NextResponse.json(
        { error: "Could not upload your resume. Please try again." },
        { status: 500 },
      );
    }
  }

  try {
    const application = await prisma.jobApplication.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message || null,
        linkedinUrl: data.linkedinUrl || null,
        resumeUrl,
        openingId: data.openingId || null,
      },
    });

    await notify({
      subject: `New Viewnear job application: ${data.name}${
        data.openingTitle ? `: ${data.openingTitle}` : ""
      }`,
      text: [
        `${data.name} <${data.email}>`,
        data.linkedinUrl ? `LinkedIn: ${data.linkedinUrl}` : null,
        resumeUrl ? `Resume: ${resumeUrl}` : null,
        "",
        data.message || "(no message)",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    }).catch((e) => console.error("[careers] notify failed:", e));

    return NextResponse.json({ ok: true, id: application.id });
  } catch (e) {
    console.error("[careers] failed to save application:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
