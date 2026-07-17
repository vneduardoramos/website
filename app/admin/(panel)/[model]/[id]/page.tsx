import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getModel } from "@/lib/admin/config";
import { EntityForm } from "@/components/admin/EntityForm";
import { updateEntity } from "@/app/admin/actions";
import { loadFormExtras, relationInclude } from "@/lib/admin/relations";

export const dynamic = "force-dynamic";

export default async function EditEntityPage({ params }: { params: { model: string; id: string } }) {
  const model = getModel(params.model);
  if (!model) notFound();

  const include = relationInclude(model);
  const record = await (prisma as any)[model.key].findUnique({
    where: { id: params.id },
    ...(Object.keys(include).length ? { include } : {}),
  });
  if (!record) notFound();

  const { options, media } = await loadFormExtras(model);
  const action = updateEntity.bind(null, model.key, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Edit {model.label}</h1>
      <div className="mt-6">
        <EntityForm model={model} values={record} action={action} submitLabel="Save changes" options={options} media={media} />
      </div>
    </div>
  );
}
