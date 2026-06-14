"use client";

import { useState } from "react";
import type { RepeaterItemField } from "@/lib/admin/config";

type Row = Record<string, string>;

function parseRows(v: unknown, fields: RepeaterItemField[]): Row[] {
  let arr: unknown = v;
  if (typeof v === "string" && v.trim()) {
    try {
      arr = JSON.parse(v);
    } catch {
      arr = [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr.map((o) => {
    const row: Row = {};
    for (const f of fields) row[f.name] = String((o as Row)?.[f.name] ?? "");
    return row;
  });
}

export function RepeaterField({
  name,
  defaultValue,
  itemFields,
}: {
  name: string;
  defaultValue?: unknown;
  itemFields: RepeaterItemField[];
}) {
  const [rows, setRows] = useState<Row[]>(parseRows(defaultValue, itemFields));
  // Drop all-whitespace rows from the persisted value (keeps them visible while editing).
  const kept = rows.filter((r) => itemFields.some((f) => (r[f.name] ?? "").trim() !== ""));
  const serialized = kept.length ? JSON.stringify(kept) : "";

  const update = (i: number, key: string, val: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const add = () =>
    setRows((rs) => [...rs, Object.fromEntries(itemFields.map((f) => [f.name, ""]))]);
  const remove = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serialized} />
      {rows.map((row, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface2 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {itemFields.map((f) => (
              <label key={f.name} className="block text-xs">
                <span className="mb-1 block text-muted">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={row[f.name] ?? ""}
                    onChange={(e) => update(i, f.name, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={row[f.name] ?? ""}
                    onChange={(e) => update(i, f.name, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                  />
                )}
              </label>
            ))}
          </div>
          <button type="button" onClick={() => remove(i)} className="mt-2 text-xs font-semibold text-red-600">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-ghost btn-sm">
        + Add row
      </button>
    </div>
  );
}
