import Link from "next/link";
import type { AdminModel } from "@/lib/admin/config";
import { MarkdownEditor } from "@/components/admin/fields/MarkdownEditor";
import { ImageField } from "@/components/admin/fields/ImageField";
import { RepeaterField } from "@/components/admin/fields/RepeaterField";
import { GroupField } from "@/components/admin/fields/GroupField";
import type { Option } from "@/lib/admin/relations";

const inputCls =
  "w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function jsonPretty(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

export function EntityForm({
  model,
  values,
  action,
  submitLabel,
  options = {},
  media = [],
}: {
  model: AdminModel;
  values: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any> | void;
  submitLabel: string;
  options?: Record<string, Option[]>;
  media?: { url: string; alt: string | null }[];
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      {model.fields.map((field) => {
        const v = values[field.name];
        const id = `f-${field.name}`;
        return (
          <div key={field.name}>
            <label htmlFor={id} className="mb-1 block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-danger"> *</span>}
            </label>

            {field.type === "textarea" && (
              <textarea id={id} name={field.name} rows={4} defaultValue={(v as string) ?? ""} className={inputCls} />
            )}

            {field.type === "markdown" && (
              <MarkdownEditor name={field.name} defaultValue={(v as string) ?? ""} />
            )}

            {(field.type === "jsonList" || field.type === "jsonObjects") && (
              <textarea
                id={id}
                name={field.name}
                rows={5}
                defaultValue={jsonPretty(v)}
                className={`${inputCls} font-mono`}
              />
            )}

            {field.type === "select" && (
              <select id={id} name={field.name} defaultValue={(v as string) ?? field.options?.[0]} className={inputCls}>
                {field.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}

            {field.type === "boolean" && (
              <input id={id} name={field.name} type="checkbox" defaultChecked={Boolean(v)} className="h-4 w-4 accent-[rgb(var(--color-primary))]" />
            )}

            {field.type === "number" && (
              <input id={id} name={field.name} type="number" defaultValue={(v as number) ?? 0} className={inputCls} />
            )}

            {field.type === "date" && (
              <input
                id={id}
                name={field.name}
                type="date"
                defaultValue={v ? new Date(v as string).toISOString().slice(0, 10) : ""}
                className={inputCls}
              />
            )}

            {field.type === "text" && (
              <input id={id} name={field.name} type="text" defaultValue={(v as string) ?? ""} className={inputCls} />
            )}

            {field.type === "image" && (
              <ImageField name={field.name} defaultValue={(v as string) ?? ""} library={media} />
            )}

            {field.type === "repeater" && field.itemFields && (
              <RepeaterField name={field.name} defaultValue={v} itemFields={field.itemFields} />
            )}

            {field.type === "group" && field.itemFields && (
              <GroupField name={field.name} defaultValue={v} itemFields={field.itemFields} />
            )}

            {field.type === "relation" && field.relation && (
              field.relation.multiple ? (
                <select
                  id={id}
                  name={field.name}
                  multiple
                  defaultValue={Array.isArray(v) ? (v as { id: string }[]).map((x) => x.id) : []}
                  className={`${inputCls} h-32`}
                >
                  {(options[field.name] ?? []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <select id={id} name={field.name} defaultValue={(v as string) ?? ""} className={inputCls}>
                  <option value="">(none)</option>
                  {(options[field.name] ?? []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )
            )}

            {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
          </div>
        );
      })}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <Link href={`/admin/${model.key}`} className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
