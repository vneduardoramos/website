import { prisma } from "@/lib/db";
import type { AdminModel } from "@/lib/admin/config";

export type Option = { value: string; label: string };

export async function loadFormExtras(model: AdminModel): Promise<{
  options: Record<string, Option[]>;
  media: { url: string; alt: string | null }[];
}> {
  const options: Record<string, Option[]> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation) {
      const rows: any[] = await (prisma as any)[f.relation.model].findMany({
        select: { id: true, [f.relation.labelField]: true },
        orderBy: { [f.relation.labelField]: "asc" },
      });
      options[f.name] = rows.map((r) => ({ value: r.id, label: String(r[f.relation!.labelField] ?? r.id) }));
    }
  }
  const hasImage = model.fields.some((f) => f.type === "image");
  const media = hasImage
    ? await prisma.media.findMany({ orderBy: { createdAt: "desc" }, select: { url: true, alt: true } })
    : [];
  return { options, media };
}

export function relationInclude(model: AdminModel): Record<string, boolean> {
  const include: Record<string, boolean> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation?.multiple) include[f.name] = true;
  }
  return include;
}
