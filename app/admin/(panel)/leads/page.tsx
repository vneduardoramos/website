import { prisma } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/enums";
import { updateLeadStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Leads</h1>
      <p className="mt-1 text-sm text-muted">Contact form submissions.</p>

      <div className="mt-6 space-y-3">
        {leads.length === 0 && <p className="text-muted">No leads yet.</p>}
        {leads.map((lead) => (
          <div key={lead.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {lead.firstName} {lead.lastName}{" "}
                  {lead.company && <span className="text-muted">· {lead.company}</span>}
                </p>
                <a href={`mailto:${lead.email}`} className="text-sm text-primary hover:underline">
                  {lead.email}
                </a>
                <p className="mt-2 text-sm text-muted">{lead.message}</p>
                <p className="mt-2 text-xs text-muted">{lead.createdAt.toLocaleString()}</p>
              </div>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await updateLeadStatus(lead.id, String(formData.get("status")));
                }}
                className="flex items-center gap-2"
              >
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-lg border border-border bg-surface2 px-3 py-1.5 text-sm"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
