import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getModel } from "@/lib/admin/config";
import { deleteEntity } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  if (value == null) return "-";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

export default async function ModelListPage({
  params,
}: {
  params: { model: string };
}) {
  const model = getModel(params.model);
  if (!model) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await (prisma as any)[model.key].findMany({
    orderBy: model.defaultOrderBy ?? { id: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{model.plural}</h1>
        <Link href={`/admin/${model.key}/new`} className="btn-primary">
          + New {model.label}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              {model.listFields.map((f) => (
                <th key={f} className="px-4 py-3 font-medium">
                  {f}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={model.listFields.length + 1} className="px-4 py-8 text-center text-muted">
                  No {model.plural.toLowerCase()} yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {model.listFields.map((f) => (
                  <td key={f} className="px-4 py-3">
                    {f === "status" ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          row[f] === "PUBLISHED"
                            ? "bg-success/15 text-success"
                            : row[f] === "ARCHIVED"
                            ? "bg-muted/15 text-muted"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {cell(row[f])}
                      </span>
                    ) : (
                      cell(row[f])
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/${model.key}/${row.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <form action={deleteEntity.bind(null, model.key, row.id)}>
                      <button className="text-danger hover:underline" type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
