import { notFound } from "next/navigation";
import { getModel } from "@/lib/admin/config";
import { EntityForm } from "@/components/admin/EntityForm";
import { createEntity } from "@/app/admin/actions";
import { loadFormExtras } from "@/lib/admin/relations";

export const dynamic = "force-dynamic";

export default async function NewEntityPage({ params }: { params: { model: string } }) {
  const model = getModel(params.model);
  if (!model) notFound();
  const { options, media } = await loadFormExtras(model);
  const action = createEntity.bind(null, model.key);
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">New {model.label}</h1>
      <div className="mt-6">
        <EntityForm model={model} values={{}} action={action} submitLabel={`Create ${model.label}`} options={options} media={media} />
      </div>
    </div>
  );
}
