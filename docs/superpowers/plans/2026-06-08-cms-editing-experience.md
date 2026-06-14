# CMS Editing Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CRUD for blog, news, and case studies WYSIWYG and easy — Markdown WYSIWYG body, image upload/pick, a TeamMember author (with LinkedIn) for blog, friendly repeater UIs for structured fields, and full field coverage — by extending the config-driven admin with reusable field types, then wiring it through to the public pages.

**Architecture:** Extend the existing config-driven admin (`lib/admin/config.ts` + `components/admin/EntityForm.tsx` + `app/admin/actions.ts`) with new field types (`image`, `relation`, `repeater`) and a WYSIWYG upgrade to `markdown`. New interactive editors are **client components that write a hidden input**, so the server-action `<form>` keeps submitting via `FormData`. Relation/media options load server-side in the edit/new pages and pass into the form.

**Tech Stack:** Next.js 14 App Router (server + client components), Prisma/SQLite, Tailwind, `@uiw/react-md-editor` (new dep), Vitest (unit tests for `buildData`).

**Conventions:**
- **No git** — the project isn't a repo; "Checkpoint" replaces "Commit" (verify, then continue). Don't run `git`.
- **Dev server** runs on `http://localhost:3000`. Don't run `next build` while it's up (shared `.next/`); use `tsc`/`lint`/curl/screenshots. Reseed with `npx prisma db push --force-reset && npm run db:seed`.
- All subagents/agents for this work run on **Opus 4.8** (`model: opus`) if dispatched.

---

## File map

**Create:**
- `components/admin/fields/MarkdownEditor.tsx` — client WYSIWYG (wraps `@uiw/react-md-editor`)
- `components/admin/fields/ImageField.tsx` — client image preview + upload + library picker → hidden input
- `components/admin/fields/RepeaterField.tsx` — client add/remove rows for a JSON array → hidden input
- `components/admin/fields/GroupField.tsx` — client fixed-key object editor (the case-study quote) → hidden input
- `lib/admin/relations.ts` — `loadFormExtras(model, record)` → `{ options, media }` for the form
- `lib/admin/fields.test.ts` — Vitest unit tests for the new `buildData` branches

**Modify:**
- `lib/admin/config.ts` — extend `FieldType` + `AdminField`; expose fields on `blogPost`/`newsEvent`/`caseStudy`
- `components/admin/EntityForm.tsx` — render the new field types; accept `options`/`media`
- `app/admin/actions.ts` — `buildData` handles `image`/`relation`/`repeater`/`group`; relation/M2M writes
- `app/admin/(panel)/[model]/[id]/page.tsx` and `.../new/page.tsx` — load `options`/`media`, include M2M relations, pass to form; add "View live ↗"
- `prisma/schema.prisma` — `BlogPost.coverImage String?`, `BlogPost.authorTeamId` + `authorTeam TeamMember?`, inverse on `TeamMember`
- `app/(marketing)/blog/[slug]/page.tsx`, `app/(marketing)/blog/page.tsx` — real cover + author block + JSON-LD `sameAs`
- `package.json` — add `@uiw/react-md-editor`

---

## Task 1: Add the WYSIWYG editor dependency

**Files:** `package.json` (via npm)

- [ ] **Step 1: Install**

Run: `npm install @uiw/react-md-editor@4`
Expected: adds to `dependencies`, no peer-dep errors (React 18).

- [ ] **Step 2: Verify it resolves**

Run: `node -e "require.resolve('@uiw/react-md-editor'); console.log('ok')"`
Expected: `ok`

- [ ] **Step 3: Checkpoint** — dependency present.

---

## Task 2: Extend the field-type config

**Files:** Modify `lib/admin/config.ts` (lines 8–26)

- [ ] **Step 1: Extend `FieldType` and `AdminField`**

Replace the `FieldType` union and `AdminField` interface with:

```ts
export type FieldType =
  | "text"
  | "textarea"
  | "markdown"      // now rendered as a WYSIWYG editor
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "jsonList"      // JSON-encoded string[]
  | "jsonObjects"   // JSON-encoded [{...}]
  | "image"         // URL string, set via upload/library picker
  | "relation"      // FK (single) or M2M (multiple) to another model
  | "repeater"      // JSON-encoded array of objects with fixed itemFields
  | "group";        // JSON-encoded single object with fixed itemFields

export interface RepeaterItemField {
  name: string;
  label: string;
  type: "text" | "textarea";
}

export interface AdminField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
  /** For type "relation": the related prisma model + the field to show as the label. */
  relation?: { model: string; labelField: string; multiple?: boolean };
  /** For type "repeater"/"group": the per-row/object fields. */
  itemFields?: RepeaterItemField[];
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (existing configs still valid; new optional props).

- [ ] **Step 3: Checkpoint.**

---

## Task 3: Markdown WYSIWYG field

**Files:** Create `components/admin/fields/MarkdownEditor.tsx`; modify `components/admin/EntityForm.tsx`

- [ ] **Step 1: Create the client editor**

`components/admin/fields/MarkdownEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

// SSR-disabled: the editor touches `window`/`navigator` on load.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div data-color-mode="light">
      {/* Hidden input carries the value to the server-action FormData. */}
      <input type="hidden" name={name} value={value} />
      <MDEditor value={value} onChange={(v) => setValue(v ?? "")} height={420} preview="live" />
    </div>
  );
}
```

- [ ] **Step 2: Wire into EntityForm**

In `components/admin/EntityForm.tsx`, add the import at the top:

```tsx
import { MarkdownEditor } from "@/components/admin/fields/MarkdownEditor";
```

Replace the existing `markdown` branch (lines 47–56) with:

```tsx
{field.type === "markdown" && (
  <MarkdownEditor name={field.name} defaultValue={(v as string) ?? ""} />
)}
```

- [ ] **Step 3: Verify (authed)**

Log into `/admin` (seeded admin), open `/admin/blogPost/new`. The Body field shows a toolbar + live-preview editor. Type `**bold**` → preview shows bold. Save a draft → no error.

- [ ] **Step 4: Typecheck/lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 5: Checkpoint.**

---

## Task 4: Image field (upload + library picker)

**Files:** Create `components/admin/fields/ImageField.tsx`; modify `EntityForm.tsx`. (Uses existing `POST /api/upload`, which returns `{ media: { url, ... } }`.)

- [ ] **Step 1: Create the client image field**

`components/admin/fields/ImageField.tsx`:

```tsx
"use client";

import { useState } from "react";

type MediaItem = { url: string; alt: string | null };

export function ImageField({
  name,
  defaultValue,
  library,
}: {
  name: string;
  defaultValue?: string;
  library: MediaItem[];
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return;
    }
    setUrl(json.media.url);
  }

  return (
    <div className="rounded-lg border border-border bg-surface2 p-3">
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mb-3 aspect-video w-full max-w-sm rounded-md object-cover" />
      ) : (
        <p className="mb-3 text-sm text-muted">No image set.</p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="btn-ghost btn-sm cursor-pointer">
          {busy ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} />
        </label>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setPicking((p) => !p)}>
          Pick from library
        </button>
        {url && (
          <button type="button" className="text-xs font-semibold text-red-600" onClick={() => setUrl("")}>
            Clear
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {picking && (
        <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {library.length === 0 && <p className="text-xs text-muted">No media uploaded yet.</p>}
          {library.map((m) => (
            <button
              key={m.url}
              type="button"
              onClick={() => {
                setUrl(m.url);
                setPicking(false);
              }}
              className="overflow-hidden rounded-md border border-border hover:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt ?? ""} className="aspect-video w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into EntityForm**

In `EntityForm.tsx`, import:

```tsx
import { ImageField } from "@/components/admin/fields/ImageField";
```

Add to the form props (Task 6 finalizes the signature) and add this branch alongside the others:

```tsx
{field.type === "image" && (
  <ImageField name={field.name} defaultValue={(v as string) ?? ""} library={media} />
)}
```

(`media` comes from the new `media` prop added in Task 6.)

- [ ] **Step 3: Checkpoint** (full verification after Task 6 wires `media`).

---

## Task 5: Repeater + Group fields (structured JSON)

**Files:** Create `components/admin/fields/RepeaterField.tsx` and `components/admin/fields/GroupField.tsx`; modify `EntityForm.tsx`.

- [ ] **Step 1: Create RepeaterField (JSON array of objects)**

`components/admin/fields/RepeaterField.tsx`:

```tsx
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
  const serialized = JSON.stringify(rows);

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
```

- [ ] **Step 2: Create GroupField (single JSON object)**

`components/admin/fields/GroupField.tsx`:

```tsx
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
  // Empty object when all fields blank, so buildData stores null.
  const allEmpty = itemFields.every((f) => !obj[f.name]);
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
```

- [ ] **Step 3: Wire both into EntityForm**

In `EntityForm.tsx`, import both and add branches:

```tsx
import { RepeaterField } from "@/components/admin/fields/RepeaterField";
import { GroupField } from "@/components/admin/fields/GroupField";
```

```tsx
{field.type === "repeater" && field.itemFields && (
  <RepeaterField name={field.name} defaultValue={v} itemFields={field.itemFields} />
)}
{field.type === "group" && field.itemFields && (
  <GroupField name={field.name} defaultValue={v} itemFields={field.itemFields} />
)}
```

- [ ] **Step 4: Typecheck/lint** — `npx tsc --noEmit && npm run lint` → clean.
- [ ] **Step 5: Checkpoint.**

---

## Task 6: Relation rendering + form `options`/`media` plumbing

**Files:** Modify `components/admin/EntityForm.tsx` (signature + relation branch); create `lib/admin/relations.ts`; modify both `[model]` pages.

- [ ] **Step 1: Add the relations/extras loader**

`lib/admin/relations.ts`:

```ts
import { prisma } from "@/lib/db";
import type { AdminModel } from "@/lib/admin/config";

export type Option = { value: string; label: string };

/** Load relation <select> options + media-library list for a model's form. */
export async function loadFormExtras(model: AdminModel): Promise<{
  options: Record<string, Option[]>;
  media: { url: string; alt: string | null }[];
}> {
  const options: Record<string, Option[]> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/** Build the Prisma `include` so M2M relation defaults can render their current ids. */
export function relationInclude(model: AdminModel): Record<string, boolean> {
  const include: Record<string, boolean> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation?.multiple) include[f.name] = true;
  }
  return include;
}
```

- [ ] **Step 2: Update EntityForm signature + relation branch**

In `EntityForm.tsx`, change the props and add the relation branch. New signature:

```tsx
import type { AdminModel } from "@/lib/admin/config";
import type { Option } from "@/lib/admin/relations";

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
```

Add the relation branch (single = `<select>`, multiple = `<select multiple>`). For `multiple`, the current value is the included relation array (`values[field.name]` = `[{id,...}]`); for single it's the scalar FK (`values[field.name]` = id string):

```tsx
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
      <option value="">— none —</option>
      {(options[field.name] ?? []).map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
)}
```

- [ ] **Step 3: Pass extras from the edit page**

Rewrite `app/admin/(panel)/[model]/[id]/page.tsx` body to load extras + include M2M relations:

```tsx
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
```

- [ ] **Step 4: Pass extras from the new page**

Rewrite `app/admin/(panel)/[model]/new/page.tsx` to be `async` and load extras:

```tsx
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
```

- [ ] **Step 5: Typecheck/lint** → clean.
- [ ] **Step 6: Checkpoint.**

---

## Task 7: Server-action handling for the new field types

**Files:** Modify `app/admin/actions.ts` (`buildData` + create/update relation writes); create `lib/admin/fields.test.ts`.

- [ ] **Step 1: Write failing unit tests for buildData mapping**

`lib/admin/fields.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildEntityData } from "@/app/admin/actions";
import type { AdminModel } from "@/lib/admin/config";

const model = {
  key: "blogPost",
  label: "Blog",
  plural: "Blog",
  hasStatus: true,
  listFields: [],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "coverImage", label: "Cover", type: "image" },
    { name: "authorTeamId", label: "Author", type: "relation", relation: { model: "teamMember", labelField: "name" } },
    { name: "metrics", label: "Metrics", type: "repeater", itemFields: [{ name: "value", label: "V", type: "text" }] },
  ],
} as AdminModel;

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

describe("buildEntityData", () => {
  it("passes image URL through as a string", () => {
    const d = buildEntityData(model, fd({ title: "T", coverImage: "/uploads/x.jpg" }), true);
    expect(d.coverImage).toBe("/uploads/x.jpg");
  });
  it("maps a single relation to a connect on the scalar FK, null when blank", () => {
    expect(buildEntityData(model, fd({ title: "T", authorTeamId: "tm1" }), true).authorTeamId).toBe("tm1");
    expect(buildEntityData(model, fd({ title: "T", authorTeamId: "" }), true).authorTeamId).toBeNull();
  });
  it("stores a repeater as a JSON string, null when empty array", () => {
    expect(buildEntityData(model, fd({ title: "T", metrics: '[{"value":"9"}]' }), true).metrics).toBe('[{"value":"9"}]');
    expect(buildEntityData(model, fd({ title: "T", metrics: "[]" }), true).metrics).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test`
Expected: FAIL — `buildEntityData` is not exported yet.

- [ ] **Step 3: Refactor `buildData` → exported `buildEntityData` and add branches**

In `app/admin/actions.ts`, rename `buildData` to an exported `buildEntityData` (keep a `const buildData = buildEntityData` alias if other call sites use it), and extend the `switch`. Add these cases **before** the `default`:

```ts
      case "image":
        // URL string from the picker; empty → null.
        {
          const s = String(raw ?? "").trim();
          data[field.name] = s === "" ? null : s;
        }
        break;
      case "relation":
        if (field.relation?.multiple) {
          // M2M handled after create/update (needs `set`); skip scalar here.
        } else {
          const s = String(raw ?? "").trim();
          data[field.name] = s === "" ? null : s; // scalar FK id (e.g. authorTeamId)
        }
        break;
      case "repeater":
      case "group": {
        const s = String(raw ?? "").trim();
        if (s === "" || s === "[]" || s === "{}") {
          data[field.name] = null;
        } else {
          try {
            JSON.parse(s);
            data[field.name] = s;
          } catch {
            throw new Error(`Field "${field.label}" must be valid JSON`);
          }
        }
        break;
      }
```

Note: the existing function signature is `buildData(model, form, isCreate)`; keep it. `FormData.get` returns only the first value, so for multi-select relations read all values separately (Step 4).

- [ ] **Step 4: Handle M2M (tags) writes in create/update**

Add a helper and call it in `createEntity`/`updateEntity`. In `app/admin/actions.ts`:

```ts
function m2mConnections(model: AdminModel, form: FormData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rel: Record<string, any> = {};
  for (const f of model.fields) {
    if (f.type === "relation" && f.relation?.multiple) {
      const ids = form.getAll(f.name).map(String).filter(Boolean);
      rel[f.name] = { set: ids.map((id) => ({ id })) };
    }
  }
  return rel;
}
```

In `createEntity`, change the create to merge relations:

```ts
  const data = buildEntityData(model, form, true);
  await delegate(model).create({ data: { ...data, ...m2mConnections(model, form) } });
```

In `updateEntity`, likewise:

```ts
  const data = buildEntityData(model, form, false);
  await stampPublishedAt(model, id, data);
  await delegate(model).update({ where: { id }, data: { ...data, ...m2mConnections(model, form) } });
```

(`m2mConnections` returns `{}` for models without multiple relations, so existing models are unaffected.)

- [ ] **Step 5: Run — expect PASS**

Run: `npm test`
Expected: the 3 new tests + existing tests pass.

- [ ] **Step 6: Typecheck/lint** → clean.
- [ ] **Step 7: Checkpoint.**

---

## Task 8: Schema — blog cover + TeamMember author

**Files:** Modify `prisma/schema.prisma`; reseed.

- [ ] **Step 1: Add fields to `BlogPost`**

In the `BlogPost` model add (keep the existing `authorId`/`author` User relation untouched/unused):

```prisma
  coverImage     String?
  authorTeamId   String?
  authorTeam     TeamMember? @relation("BlogAuthor", fields: [authorTeamId], references: [id])
```

- [ ] **Step 2: Add the inverse relation on `TeamMember`**

In the `TeamMember` model add:

```prisma
  authoredPosts BlogPost[] @relation("BlogAuthor")
```

- [ ] **Step 3: Push schema + regenerate + reseed**

Run: `npx prisma db push && npx prisma generate`
Then: `npm run db:seed`
Expected: push succeeds (additive, nullable — no data loss needed), seed completes.

- [ ] **Step 4: (Seed wiring, optional)** In `prisma/seed/data.ts`, set `authorTeamId`/`coverImage` on a couple of blog posts if convenient (look up a team member slug→id at seed time), so the author block has data to show. If skipped, set them via the admin in Task 11.

- [ ] **Step 5: Typecheck** → clean (Prisma client now has the new fields).
- [ ] **Step 6: Checkpoint.**

---

## Task 9: Expose the fields in admin config

**Files:** Modify `lib/admin/config.ts` (the `blogPost`, `newsEvent`, `caseStudy` entries).

- [ ] **Step 1: blogPost fields**

Set the `blogPost.fields` array to:

```ts
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (permalink)", type: "text", help: "Auto-generated from title if blank" },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "excerpt", label: "Excerpt / blurb", type: "textarea" },
      { name: "body", label: "Body", type: "markdown", required: true },
      { name: "authorTeamId", label: "Author", type: "relation", relation: { model: "teamMember", labelField: "name" } },
      { name: "tags", label: "Tags", type: "relation", relation: { model: "tag", labelField: "name", multiple: true } },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      statusField,
    ],
```

- [ ] **Step 2: newsEvent fields**

```ts
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (permalink)", type: "text" },
      { name: "kind", label: "Kind", type: "select", options: ["announcement", "event", "press"] },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "excerpt", label: "Excerpt / blurb", type: "textarea" },
      { name: "body", label: "Body", type: "markdown", required: true },
      { name: "eventDate", label: "Event date", type: "date" },
      { name: "venue", label: "Venue (events)", type: "text" },
      { name: "agenda", label: "Agenda", type: "repeater", itemFields: [
        { name: "time", label: "Time", type: "text" },
        { name: "item", label: "Item", type: "text" },
      ] },
      { name: "externalUrl", label: "External URL", type: "text" },
      { name: "readMinutes", label: "Read minutes", type: "number" },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      statusField,
    ],
```

- [ ] **Step 3: caseStudy fields**

```ts
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (permalink)", type: "text" },
      { name: "heroImage", label: "Hero image", type: "image" },
      { name: "summary", label: "Summary / blurb", type: "textarea", required: true },
      { name: "body", label: "Body", type: "markdown" },
      { name: "sector", label: "Sector", type: "text", required: true },
      { name: "region", label: "Region", type: "text", required: true },
      { name: "clientId", label: "Client", type: "relation", relation: { model: "client", labelField: "name" } },
      { name: "industryId", label: "Industry", type: "relation", relation: { model: "industry", labelField: "name" } },
      { name: "metrics", label: "Metrics", type: "repeater", itemFields: [
        { name: "value", label: "Value", type: "text" },
        { name: "label", label: "Label", type: "text" },
      ] },
      { name: "quote", label: "Pull quote", type: "group", itemFields: [
        { name: "text", label: "Quote", type: "textarea" },
        { name: "author", label: "Author", type: "text" },
        { name: "role", label: "Role", type: "text" },
      ] },
      { name: "challenge", label: "Challenge", type: "markdown" },
      { name: "solution", label: "Solution", type: "markdown" },
      { name: "results", label: "Results", type: "markdown" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
      { name: "seoTitle", label: "SEO Title", type: "text" },
      { name: "seoDescription", label: "SEO Description", type: "textarea" },
      statusField,
    ],
```

- [ ] **Step 4: Typecheck/lint** → clean.
- [ ] **Step 5: Verify (authed)** — `/admin/caseStudy/<id>` shows the metrics repeater (add/remove rows) + quote group + image picker + client/industry selects. `/admin/blogPost/new` shows cover image, author select, tags multi-select.
- [ ] **Step 6: Checkpoint.**

---

## Task 10: Public pages — blog cover, author block, JSON-LD

**Files:** Modify `app/(marketing)/blog/[slug]/page.tsx`, `app/(marketing)/blog/page.tsx`. Add "View live" to the admin edit page.

- [ ] **Step 1: Blog detail — render the real cover**

In `app/(marketing)/blog/[slug]/page.tsx`, the cover currently uses `coverFor(post.slug)` only. Change the image `src` to prefer the chosen cover:

```tsx
src={post.coverImage ?? coverFor(post.slug)}
```

(Both branches of the existing `{coverFor(...) ? (...) : null}` guard can stay; `coverFor` always returns a string, so the cover always renders — now using the real image when set.)

- [ ] **Step 2: Blog detail — author block + JSON-LD `sameAs`**

`getBlogPostBySlug` must include the author. In `lib/queries.ts`, update the blog getters to `include: { author: true, tags: true, authorTeam: true }` (add `authorTeam`). Then replace the author line (currently `{post.author?.name ?? "Viewnear"}`) with an author block that prefers `authorTeam`:

```tsx
{post.authorTeam ? (
  <div className="mt-8 flex items-center gap-3">
    {post.authorTeam.photo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.authorTeam.photo} alt={post.authorTeam.name} className="h-11 w-11 rounded-full object-cover" />
    ) : null}
    <div className="text-sm">
      <p className="font-semibold text-foreground">{post.authorTeam.name}</p>
      <p className="text-muted">
        {post.authorTeam.title}
        {post.authorTeam.linkedinUrl ? (
          <>
            {" · "}
            <a href={post.authorTeam.linkedinUrl} className="text-primaryDeep underline" target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </>
        ) : null}
      </p>
    </div>
  </div>
) : null}
```

Update the existing `articleLd.author` to use the team author + LinkedIn `sameAs`:

```ts
author: post.authorTeam
  ? { "@type": "Person", name: post.authorTeam.name, ...(post.authorTeam.linkedinUrl ? { sameAs: [post.authorTeam.linkedinUrl] } : {}) }
  : { "@type": "Organization", name: theme.brand.name },
```

- [ ] **Step 3: Blog listing — real cover + author meta**

In `app/(marketing)/blog/page.tsx`, ensure the listing query includes `authorTeam` (via the shared getter from Step 2) and update the `CoverCard` `image`/`meta`:

```tsx
image={featured.coverImage ?? coverFor(featured.slug)}
meta={`${featured.authorTeam?.name ?? "Viewnear"} · ${formatDate(featured.publishedAt)}`}
```

(Apply the same `image=`/`meta=` change to the non-featured cards in that file.)

- [ ] **Step 4: "View live ↗" on the admin edit page**

In `app/admin/(panel)/[model]/[id]/page.tsx`, after computing `record`, derive the public path for the editorial types and render a link in the header:

```tsx
const liveBase: Record<string, string> = { blogPost: "/blog", newsEvent: "/news", caseStudy: "/case-studies" };
const livePath = liveBase[model.key] && record.slug ? `${liveBase[model.key]}/${record.slug}` : null;
```

```tsx
<div className="flex items-center justify-between">
  <h1 className="font-display text-2xl font-bold">Edit {model.label}</h1>
  {livePath && (
    <a href={livePath} target="_blank" rel="noopener noreferrer" className="text-sm text-primaryDeep underline">
      View live ↗
    </a>
  )}
</div>
```

- [ ] **Step 5: Typecheck/lint** → clean.
- [ ] **Step 6: Checkpoint.**

---

## Task 11: End-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: tsc + lint + unit tests**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all clean/green.

- [ ] **Step 2: Reseed**

Run: `npx prisma db push --force-reset && npm run db:seed`
Expected: completes; `industries: 7`, `caseStudies: 7`, blog/news seeded.

- [ ] **Step 3: Authenticated admin walkthrough** (cookie-jar login as the seeded admin, or in a browser)

- Create a blog post: type the body in the **WYSIWYG**; **Upload** a cover image and confirm the preview; **Pick from library** an existing image; select a **TeamMember author**; select one or more **tags**; Save. Re-open → values persist (cover preview shows, author/tags selected).
- Edit a case study: change a **metric** row, add a row, edit the **quote** group; Save → re-open shows the changes.

- [ ] **Step 4: Public checks**

- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/blog` and `/news`, `/case-studies` → 200.
- Open the edited blog post's `/blog/<slug>`: the **chosen cover** renders, the **author block** shows photo/title and a working **LinkedIn ↗**, and the page source contains `"@type":"Person"` with `"sameAs"`.
- Open the edited case study's `/case-studies/<slug>`: the **metrics/quote** reflect the admin edits.
- The admin edit page shows **View live ↗** for blog/news/case-study.

- [ ] **Step 5: Regression check** — open `/admin/service/<id>` (or another non-editorial model) and confirm its form still renders/saves (the new field-type branches don't affect models that don't use them).

- [ ] **Step 6: Docs** — add a `docs/CHANGELOG.md` entry and an ADR (extends [0004](decisions/0004-config-driven-cms.md)) describing the new field types + TeamMember author. Update `docs/design-system.md` admin notes if relevant.

- [ ] **Step 7: Checkpoint** — feature complete.

---

## Self-review (author check)

- **Spec coverage:** WYSIWYG (T3) ✓; image field + picker (T4) ✓; repeater/group (T5); relation + options plumbing (T6); buildData + M2M (T7); schema author+cover (T8); field exposure incl. excerpts/permalinks/SEO (T9); public cover + author block + LinkedIn + JSON-LD sameAs, blog-cover fix (T10); author blog-only (T8/T9 — no author field on news/caseStudy) ✓; leave User authorId FK unused (T8) ✓; no sharp (no upload change) ✓.
- **Placeholders:** none — every code step has full code. Optional seed-wiring (T8 S4) is explicitly optional with a fallback (set via admin in T11).
- **Type consistency:** `buildEntityData` (T7) is the renamed/exported `buildData`; `Option`/`loadFormExtras`/`relationInclude` (T6) used consistently; `RepeaterItemField` (T2) used by RepeaterField/GroupField (T5) and config (T9); `authorTeam`/`authorTeamId`/`coverImage` (T8) used in queries + pages (T10) and config (T9).
- **Dependency note:** `@uiw/react-md-editor` is the only new package; `next test`/lint already configured.
