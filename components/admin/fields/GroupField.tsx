"use client";

import { useState } from "react";
import type { RepeaterItemField } from "@/lib/admin/config";

function parseObj(v: unknown, fields: RepeaterItemField[]): Record<string, string> {
  let o: unknown = v;
  if (typeof v === "string" && v.trim()) {
    try {
      o = JSON.parse(v);
    } catch {
      o = {};
    }
  }
  const out: Record<string, string> = {};
  for (const f of fields) out[f.name] = String((o as Record<string, string>)?.[f.name] ?? "");
  return out;
}

export function GroupField({
  name,
  defaultValue,
  itemFields,
}: {
  name: string;
  defaultValue?: unknown;
  itemFields: RepeaterItemField[];
}) {
  const [obj, setObj] = useState<Record<string, string>>(parseObj(defaultValue, itemFields));
  const allEmpty = itemFields.every((f) => !obj[f.name]?.trim());
  const serialized = allEmpty ? "" : JSON.stringify(obj);
  return (
    <div className="rounded-lg border border-border bg-surface2 p-3">
      <input type="hidden" name={name} value={serialized} />
      <div className="grid gap-2 sm:grid-cols-2">
        {itemFields.map((f) => (
          <label key={f.name} className="block text-xs">
            <span className="mb-1 block text-muted">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                rows={2}
                value={obj[f.name] ?? ""}
                onChange={(e) => setObj((o) => ({ ...o, [f.name]: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            ) : (
              <input
                type="text"
                value={obj[f.name] ?? ""}
                onChange={(e) => setObj((o) => ({ ...o, [f.name]: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
