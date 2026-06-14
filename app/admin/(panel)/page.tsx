import Link from "next/link";
import { prisma } from "@/lib/db";
import { ADMIN_MODELS } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const entries = await Promise.all(
    Object.values(ADMIN_MODELS).map(async (m) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const count = await (prisma as any)[m.key].count();
      return { model: m, count };
    })
  );
  const leadCount = await prisma.lead.count();
  const mediaCount = await prisma.media.count();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Manage Viewnear content.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(({ model, count }) => (
          <Link key={model.key} href={`/admin/${model.key}`} className="card card-hover">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">{model.plural}</span>
              <span className="font-mono text-2xl text-primary">{count}</span>
            </div>
          </Link>
        ))}
        <Link href="/admin/leads" className="card card-hover">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold">Leads</span>
            <span className="font-mono text-2xl text-accent">{leadCount}</span>
          </div>
        </Link>
        <Link href="/admin/media" className="card card-hover">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold">Media</span>
            <span className="font-mono text-2xl text-accent">{mediaCount}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
