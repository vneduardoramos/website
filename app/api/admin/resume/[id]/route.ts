import { NextResponse } from "next/server";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";

/**
 * Authenticated-admin-only download of an applicant resume. Resumes are stored
 * privately (never web-served); the bytes are streamed through the server, so
 * the underlying storage key is never exposed. Legacy rows that only have the
 * old public `resumeUrl` (no `resumeKey`) 404 here and keep their old link.
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: params.id },
  });
  if (!application || !application.resumeKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let file;
  try {
    file = await getStorage().readPrivate(application.resumeKey);
  } catch (e) {
    console.error("[admin/resume] read failed:", e);
    return NextResponse.json({ error: "Could not read resume." }, { status: 500 });
  }

  const ext = path.extname(application.resumeKey);
  return new Response(new Uint8Array(file.body), {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="resume-${application.id}${ext}"`,
      "Content-Length": String(file.body.length),
      "Cache-Control": "private, no-store",
    },
  });
}
