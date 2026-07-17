import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await prisma.jobApplication.findMany({
    include: { opening: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Applications</h1>
      <p className="mt-1 text-sm text-muted">Job application submissions.</p>

      <div className="mt-6 space-y-3">
        {applications.length === 0 && <p className="text-muted">No applications yet.</p>}
        {applications.map((app) => (
          <div key={app.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {app.name}{" "}
                  <span className="text-muted">· {app.opening?.title ?? "General"}</span>
                </p>
                <p className="text-sm">
                  <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                    {app.email}
                  </a>
                  {app.linkedinUrl && (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    </>
                  )}
                </p>
                {app.message && <p className="mt-2 text-sm text-muted">{app.message}</p>}
                <p className="mt-2 text-xs text-muted">{app.createdAt.toLocaleString()}</p>
              </div>
              <div className="text-sm">
                {app.resumeKey ? (
                  <a
                    href={`/api/admin/resume/${app.id}`}
                    className="rounded-lg border border-border px-3 py-1.5 hover:border-primary"
                  >
                    Resume
                  </a>
                ) : app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border px-3 py-1.5 hover:border-primary"
                  >
                    Resume
                  </a>
                ) : (
                  <span className="text-muted">No resume</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
