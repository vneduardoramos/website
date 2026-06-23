# In-Place Image Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a logged-in CMS admin replace, reposition, zoom/crop, and re-alt any image on the marketing site in place, with edits persisting for all visitors, including images whose `src` is hardcoded in TSX.

**Architecture:** A new `ImageOverride` table is loaded once per request (cached) in the marketing layout and handed to a client `ImageOverrideProvider`. The shared `<Img>` wrapper becomes override-aware: it resolves its override by key (`editKey ?? src`) and applies a replacement `src` + `object-position`/`scale` within the existing fixed slot, so the responsive layout never changes. An auth-gated `EditModeProvider` shows an "Edit images" toggle and a per-image editor (upload/replace, drag focal point, zoom, alt) that writes overrides via an authed API.

**Tech Stack:** Next.js App Router (server + client components), Prisma + Postgres (Neon on prod), NextAuth, Tailwind, Vitest. Reuses `app/api/upload/route.ts`, `Media`, `lib/storage.ts`, `lib/auth.ts`, `lib/ratelimit.ts`.

## Global Constraints

- Anonymous behavior must be byte-identical to today: no toggle, no edit buttons, no override UI; an image with no override renders exactly as now.
- Prod schema ships via `prisma db push` in the build (no migrations); locally use `npx prisma db push`.
- All write endpoints require `getServerSession(authOptions)` (`lib/auth.ts`) and use `rateLimit`/`clientIp`/`tooMany` from `lib/ratelimit.ts`, mirroring `app/api/upload/route.ts`.
- No em dashes in any user-facing copy (use real punctuation).
- Tailwind opacity only in 5-step increments (`/10`, `/20`, ... ); other steps render transparent in this project.
- Pure, client-safe logic must not import Prisma (keeps server code out of the client bundle).

---

### Task 1: `ImageOverride` model + schema push

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: Prisma model `ImageOverride` with unique `key`; fields `mediaUrl String?`, `focalX Float @default(50)`, `focalY Float @default(50)`, `zoom Float @default(1)`, `alt String?`, `updatedBy String?`, `updatedAt DateTime @updatedAt`.

- [ ] **Step 1: Add the model** to `prisma/schema.prisma`:

```prisma
model ImageOverride {
  id        String   @id @default(cuid())
  key       String   @unique
  mediaUrl  String?
  focalX    Float    @default(50)
  focalY    Float    @default(50)
  zoom      Float    @default(1)
  alt       String?
  updatedBy String?
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 2: Generate client + push schema**

Run: `npx prisma db push`
Expected: "Your database is now in sync with your Prisma schema." and Prisma Client regenerated.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(images): add ImageOverride model"
```

---

### Task 2: Pure override logic (client-safe)

**Files:**
- Create: `lib/image-overrides.ts`
- Test: `lib/image-overrides.test.ts`

**Interfaces:**
- Produces:
  - `type ImageOverrideData = { key: string; mediaUrl: string | null; focalX: number; focalY: number; zoom: number; alt: string | null }`
  - `type OverrideMap = Record<string, ImageOverrideData>`
  - `applyOverride(src: string, ov: ImageOverrideData | null): { src: string; style?: import("react").CSSProperties; alt?: string }`
  - `parseOverrideInput(body: unknown): { key: string; data: { mediaUrl?: string | null; focalX?: number; focalY?: number; zoom?: number; alt?: string | null } } | null`
- No Prisma import in this file.

- [ ] **Step 1: Write failing tests** in `lib/image-overrides.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { applyOverride, parseOverrideInput } from "./image-overrides";

describe("applyOverride", () => {
  it("returns the base src untouched when no override", () => {
    expect(applyOverride("/a.jpg", null)).toEqual({ src: "/a.jpg", style: undefined, alt: undefined });
  });
  it("swaps src when mediaUrl is set", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: "/uploads/b.jpg", focalX: 50, focalY: 50, zoom: 1, alt: null });
    expect(r.src).toBe("/uploads/b.jpg");
  });
  it("applies object-position only when focal differs from center", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 30, focalY: 70, zoom: 1, alt: null });
    expect(r.style?.objectPosition).toBe("30% 70%");
    expect(r.style?.transform).toBeUndefined();
  });
  it("applies scale only when zoomed in", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 50, focalY: 50, zoom: 1.5, alt: null });
    expect(r.style?.transform).toBe("scale(1.5)");
  });
  it("passes alt through", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 50, focalY: 50, zoom: 1, alt: "Hi" });
    expect(r.alt).toBe("Hi");
  });
});

describe("parseOverrideInput", () => {
  it("rejects non-objects and missing key", () => {
    expect(parseOverrideInput(null)).toBeNull();
    expect(parseOverrideInput({})).toBeNull();
    expect(parseOverrideInput({ key: "" })).toBeNull();
  });
  it("accepts a key and clamps numeric fields", () => {
    const r = parseOverrideInput({ key: "/a.jpg", focalX: 200, focalY: -5, zoom: 9 });
    expect(r?.key).toBe("/a.jpg");
    expect(r?.data.focalX).toBe(100);
    expect(r?.data.focalY).toBe(0);
    expect(r?.data.zoom).toBe(3);
  });
  it("keeps mediaUrl null and trims alt", () => {
    const r = parseOverrideInput({ key: "/a.jpg", mediaUrl: null, alt: "  hi  " });
    expect(r?.data.mediaUrl).toBeNull();
    expect(r?.data.alt).toBe("hi");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run lib/image-overrides.test.ts`
Expected: FAIL (module/exports not found).

- [ ] **Step 3: Implement** `lib/image-overrides.ts`:

```ts
import type { CSSProperties } from "react";

export type ImageOverrideData = {
  key: string;
  mediaUrl: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  alt: string | null;
};

export type OverrideMap = Record<string, ImageOverrideData>;

/** Pure: compute the effective src/style/alt for an image given its override. */
export function applyOverride(
  src: string,
  ov: ImageOverrideData | null,
): { src: string; style?: CSSProperties; alt?: string } {
  if (!ov) return { src, style: undefined, alt: undefined };
  const style: CSSProperties = {};
  if (ov.focalX !== 50 || ov.focalY !== 50) style.objectPosition = `${ov.focalX}% ${ov.focalY}%`;
  if (ov.zoom > 1) style.transform = `scale(${ov.zoom})`;
  return {
    src: ov.mediaUrl || src,
    style: Object.keys(style).length ? style : undefined,
    alt: ov.alt ?? undefined,
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Pure: validate/normalize the POST body for the override API. */
export function parseOverrideInput(
  body: unknown,
): { key: string; data: { mediaUrl?: string | null; focalX?: number; focalY?: number; zoom?: number; alt?: string | null } } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.key !== "string" || b.key.length === 0) return null;
  const data: { mediaUrl?: string | null; focalX?: number; focalY?: number; zoom?: number; alt?: string | null } = {};
  if ("mediaUrl" in b) data.mediaUrl = typeof b.mediaUrl === "string" ? b.mediaUrl : null;
  if (typeof b.focalX === "number") data.focalX = clamp(b.focalX, 0, 100);
  if (typeof b.focalY === "number") data.focalY = clamp(b.focalY, 0, 100);
  if (typeof b.zoom === "number") data.zoom = clamp(b.zoom, 1, 3);
  if ("alt" in b) data.alt = typeof b.alt === "string" ? b.alt.trim() : null;
  return { key: b.key, data };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run lib/image-overrides.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add lib/image-overrides.ts lib/image-overrides.test.ts
git commit -m "feat(images): pure override apply + input validation"
```

---

### Task 3: Override API route (save / reset)

**Files:**
- Create: `app/api/image-overrides/route.ts`

**Interfaces:**
- Consumes: `parseOverrideInput` (Task 2); `authOptions` (`lib/auth.ts`); `rateLimit/clientIp/tooMany` (`lib/ratelimit.ts`); `prisma` (`lib/db`).
- Produces: `POST` upserts an `ImageOverride` and returns `{ ok: true }`; `DELETE ?key=` removes one. Both call `revalidateTag("image-overrides")`.

- [ ] **Step 1: Implement** `app/api/image-overrides/route.ts`:

```ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";
import { parseOverrideInput } from "@/lib/image-overrides";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rl = rateLimit(`imgov:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = parseOverrideInput(await req.json().catch(() => null));
  if (!parsed) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updatedBy = session.user?.email ?? null;
  await prisma.imageOverride.upsert({
    where: { key: parsed.key },
    create: { key: parsed.key, ...parsed.data, updatedBy },
    update: { ...parsed.data, updatedBy },
  });
  revalidateTag("image-overrides");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  await prisma.imageOverride.deleteMany({ where: { key } });
  revalidateTag("image-overrides");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Verify auth gating (server running on :3005)**

Run: `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3005/api/image-overrides -H 'content-type: application/json' -d '{"key":"/x.jpg"}'`
Expected: `401`.

- [ ] **Step 4: Commit**

```bash
git add app/api/image-overrides/route.ts
git commit -m "feat(images): authed image-override save/reset API"
```

---

### Task 4: Cached server loader, wired into the marketing layout

**Files:**
- Modify: `app/(marketing)/layout.tsx`

**Interfaces:**
- Consumes: `prisma`, `OverrideMap` (Task 2).
- Produces: `getImageOverrides(): Promise<OverrideMap>` (module-scope in the layout), passed to the provider in Task 10. Uses `unstable_cache(..., ["image-overrides"], { tags: ["image-overrides"] })` so the API's `revalidateTag` refreshes it.

- [ ] **Step 1: Add the loader** near the top of `app/(marketing)/layout.tsx` (below imports). Add imports `import { unstable_cache } from "next/cache"; import { prisma } from "@/lib/db"; import type { OverrideMap } from "@/lib/image-overrides";`

```ts
const getImageOverrides = unstable_cache(
  async (): Promise<OverrideMap> => {
    const rows = await prisma.imageOverride.findMany();
    const map: OverrideMap = {};
    for (const r of rows) {
      map[r.key] = { key: r.key, mediaUrl: r.mediaUrl, focalX: r.focalX, focalY: r.focalY, zoom: r.zoom, alt: r.alt };
    }
    return map;
  },
  ["image-overrides"],
  { tags: ["image-overrides"] },
);
```

- [ ] **Step 2: Load it in the component** (do not render with it yet; that is Task 10). In `MarketingLayout`, after `const navData = await getNavData();` add:

```ts
  const overrides = await getImageOverrides();
  void overrides; // wired into the provider in Task 10
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/layout.tsx"
git commit -m "feat(images): cached image-overrides loader in marketing layout"
```

---

### Task 5: `ImageOverrideProvider` + hook

**Files:**
- Create: `components/marketing/ImageOverrideProvider.tsx`

**Interfaces:**
- Consumes: `OverrideMap`, `ImageOverrideData` (Task 2).
- Produces: `<ImageOverrideProvider value={OverrideMap}>`; `useImageOverride(key: string): ImageOverrideData | null`.

- [ ] **Step 1: Implement** `components/marketing/ImageOverrideProvider.tsx`:

```tsx
"use client";
import { createContext, useContext } from "react";
import type { OverrideMap, ImageOverrideData } from "@/lib/image-overrides";

const Ctx = createContext<OverrideMap>({});

export function ImageOverrideProvider({ value, children }: { value: OverrideMap; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useImageOverride(key: string): ImageOverrideData | null {
  return useContext(Ctx)[key] ?? null;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/ImageOverrideProvider.tsx
git commit -m "feat(images): image-override context provider + hook"
```

---

### Task 6: `EditModeProvider` (session + edit toggle + editor host)

**Files:**
- Create: `components/marketing/EditModeProvider.tsx`

**Interfaces:**
- Consumes: NextAuth `useSession` (requires a `SessionProvider` ancestor, added in Task 10).
- Produces:
  - `<EditModeProvider>` mounting the floating toggle (admins only) and hosting the editor.
  - `useEditMode(): { isAdmin: boolean; editMode: boolean; openEditor: (req: EditRequest) => void }`
  - `type EditRequest = { key: string; baseSrc: string; alt: string }`
  - Renders `<ImageEditOverlay>` (Task 9) when an edit request is active.

- [ ] **Step 1: Implement** `components/marketing/EditModeProvider.tsx`:

```tsx
"use client";
import { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ImageEditOverlay } from "@/components/marketing/ImageEditOverlay";

export type EditRequest = { key: string; baseSrc: string; alt: string };
type Ctx = { isAdmin: boolean; editMode: boolean; openEditor: (r: EditRequest) => void };

const EditModeCtx = createContext<Ctx>({ isAdmin: false, editMode: false, openEditor: () => {} });
export const useEditMode = () => useContext(EditModeCtx);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAdmin = status === "authenticated";
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState<EditRequest | null>(null);

  return (
    <EditModeCtx.Provider value={{ isAdmin, editMode, openEditor: setActive }}>
      {children}
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className="fixed bottom-5 left-5 z-[90] rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white shadow-soft-lg"
        >
          {editMode ? "Done editing" : "Edit images"}
        </button>
      )}
      {active && <ImageEditOverlay request={active} onClose={() => setActive(null)} />}
    </EditModeCtx.Provider>
  );
}
```

- [ ] **Step 2: Create a temporary stub** for `ImageEditOverlay` so this compiles before Task 9. Create `components/marketing/ImageEditOverlay.tsx`:

```tsx
"use client";
import type { EditRequest } from "@/components/marketing/EditModeProvider";
export function ImageEditOverlay({ request, onClose }: { request: EditRequest; onClose: () => void }) {
  return null; // replaced in Task 9
}
```

(Note: the `EditRequest` type is exported from `EditModeProvider`; Task 9 imports it from there.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/EditModeProvider.tsx components/marketing/ImageEditOverlay.tsx
git commit -m "feat(images): edit-mode provider with admin-only toggle"
```

---

### Task 7: Override-aware `<Img>` with edit affordance

**Files:**
- Modify: `components/marketing/Img.tsx`

**Interfaces:**
- Consumes: `useImageOverride` (Task 5), `useEditMode` (Task 6), `applyOverride` (Task 2).
- Produces: `<Img>` accepts an optional `editKey?: string`; default key is `String(src)`. Applies override src/style; renders a hover Edit button only when `isAdmin && editMode`; calls `openEditor`. Anonymous/no-override path is unchanged.

- [ ] **Step 1: Rewrite** `components/marketing/Img.tsx` (now a client component):

```tsx
"use client";
import Image, { type ImageProps } from "next/image";
import blur from "@/lib/blur-manifest.json";
import { applyOverride } from "@/lib/image-overrides";
import { useImageOverride } from "@/components/marketing/ImageOverrideProvider";
import { useEditMode } from "@/components/marketing/EditModeProvider";

const MANIFEST = blur as Record<string, string>;
const FALLBACK_BLUR =
  "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAwCdASoUABQAPxGCuVWsKKWjKAgBgCIJaQDH5BhwXgAA/u8T3uP1gtQAAA==";

export function Img({ src, alt, placeholder, blurDataURL, editKey, style, ...props }: ImageProps & { editKey?: string }) {
  const key = editKey ?? (typeof src === "string" ? src : "");
  const override = useImageOverride(key);
  const { isAdmin, editMode, openEditor } = useEditMode();

  const baseSrc = typeof src === "string" ? src : "";
  const resolved = applyOverride(baseSrc, override);
  const effSrc = typeof src === "string" ? resolved.src : src;
  const effAlt = resolved.alt ?? alt;
  const mergedStyle = { ...resolved.style, ...(style as object) };

  const isSvg = typeof effSrc === "string" && effSrc.toLowerCase().endsWith(".svg");
  const img = isSvg ? (
    <Image src={effSrc} alt={effAlt} style={mergedStyle} {...props} />
  ) : (
    <Image
      src={effSrc}
      alt={effAlt}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? (typeof effSrc === "string" ? MANIFEST[effSrc] : undefined) ?? FALLBACK_BLUR}
      style={mergedStyle}
      {...props}
    />
  );

  if (!(isAdmin && editMode) || !key) return img;
  return (
    <span className="group/imgedit relative block">
      {img}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); openEditor({ key, baseSrc, alt: typeof effAlt === "string" ? effAlt : "" }); }}
        className="absolute right-2 top-2 z-20 rounded-md bg-royal/90 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover/imgedit:opacity-100"
      >
        Edit
      </button>
    </span>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Verify anonymous render is unchanged (server on :3005)**

Run a Playwright check (no login): load `/`, assert no element with text "Edit images" and no `button` text "Edit" over images, and that the hero image still renders. Compare a full-page screenshot against a pre-change capture for no layout shift.
Expected: identical to before; zero console errors.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Img.tsx
git commit -m "feat(images): override-aware Img with admin edit affordance"
```

---

### Task 8: The editor overlay

**Files:**
- Modify: `components/marketing/ImageEditOverlay.tsx` (replace the Task 6 stub)

**Interfaces:**
- Consumes: `EditRequest` (Task 6); existing `POST /api/upload` (returns `{ ok, media: { url } }`); `POST/DELETE /api/image-overrides` (Task 3).
- Produces: a modal that edits one image: replace/upload, drag focal point, zoom slider (1–3), alt; Save (POST), Reset (DELETE), Cancel. On success it reloads the route so the override applies authoritatively.

- [ ] **Step 1: Implement** `components/marketing/ImageEditOverlay.tsx`:

```tsx
"use client";
import { useRef, useState } from "react";
import type { EditRequest } from "@/components/marketing/EditModeProvider";

export function ImageEditOverlay({ request, onClose }: { request: EditRequest; onClose: () => void }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [alt, setAlt] = useState(request.alt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const previewSrc = mediaUrl || request.baseSrc;

  async function upload(file: File) {
    setBusy(true); setError(null);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setMediaUrl(json.media.url);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  }

  function onDrag(e: React.MouseEvent) {
    if (e.buttons !== 1 || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    setFocalX(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    setFocalY(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
  }

  async function save() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/image-overrides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: request.key, mediaUrl, focalX, focalY, zoom, alt }),
      });
      if (!res.ok) throw new Error("Save failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); setBusy(false); }
  }

  async function reset() {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/image-overrides?key=${encodeURIComponent(request.key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      window.location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Reset failed"); setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-soft-lg">
        <h2 className="font-display text-lg font-bold text-foreground">Edit image</h2>
        <div
          ref={frameRef}
          onMouseMove={onDrag}
          className="relative mt-4 aspect-[16/10] w-full cursor-move overflow-hidden rounded-xl border border-border bg-surface2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: `${focalX}% ${focalY}%`, transform: zoom > 1 ? `scale(${zoom})` : undefined }}
          />
          <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-white">
            Drag to reposition
          </span>
        </div>

        <label className="mt-4 block text-sm font-medium text-foreground">Zoom
          <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
        </label>

        <label className="mt-3 block text-sm font-medium text-foreground">Alt text
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </label>

        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="mt-3 block text-sm" />

        {error && <p className="mt-3 text-sm text-red">{error}</p>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={reset} disabled={busy} className="btn-ghost btn-sm">Reset to default</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="btn-ghost btn-sm">Cancel</button>
            <button type="button" onClick={save} disabled={busy} className="btn-primary btn-sm">{busy ? "Saving..." : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/ImageEditOverlay.tsx
git commit -m "feat(images): in-place image editor overlay"
```

---

### Task 9: Wire providers into the marketing layout

**Files:**
- Modify: `app/(marketing)/layout.tsx`

**Interfaces:**
- Consumes: `getImageOverrides` (Task 4), `ImageOverrideProvider` (Task 5), `EditModeProvider` (Task 6), NextAuth `SessionProvider` (reuse `components/admin/SessionProvider.tsx`'s `AuthProvider`, which wraps `next-auth/react` `SessionProvider`).

- [ ] **Step 1: Update** `app/(marketing)/layout.tsx` to wrap the tree. Add imports:

```ts
import { AuthProvider } from "@/components/admin/SessionProvider";
import { ImageOverrideProvider } from "@/components/marketing/ImageOverrideProvider";
import { EditModeProvider } from "@/components/marketing/EditModeProvider";
```

Replace the `void overrides;` line (Task 4) and the returned JSX body so the inner content is wrapped (keep the existing skip-link, `<Nav>`, `<main>`, `<Footer>`):

```tsx
  const overrides = await getImageOverrides();
  return (
    <AuthProvider>
      <ImageOverrideProvider value={overrides}>
        <EditModeProvider>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primaryDeep focus:px-4 focus:py-2 focus:text-white focus:shadow-soft-lg"
            >
              Skip to main content
            </a>
            <Nav navData={navData} />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </EditModeProvider>
      </ImageOverrideProvider>
    </AuthProvider>
  );
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/layout.tsx"
git commit -m "feat(images): wire override + edit-mode providers into marketing layout"
```

---

### Task 10: End-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Confirm anonymous parity.** Dev server on :3005. As a logged-out visitor, full-page screenshot `/` and `/data-ai`; compare to pre-feature captures: no "Edit images" toggle, no per-image Edit buttons, no layout shift. `POST /api/image-overrides` (no auth) returns 401 (re-run Task 3 Step 3).

- [ ] **Step 2: Admin replace flow.** Log in at `/admin/login`, return to `/`. Confirm the "Edit images" toggle appears; enable it; hover the hero image; click Edit; upload a new image; Save. After reload, the hero shows the new image. Open `/` in a fresh incognito (logged out): the new image shows, with no edit UI.

- [ ] **Step 3: Admin reposition/zoom flow.** Edit a FeatureSplit image: drag the focal point and set zoom to ~1.4; Save. Reload: the image is repositioned/zoomed within its slot, with the slot box unchanged (no layout shift in surrounding content).

- [ ] **Step 4: Reset flow.** Edit the same image; click "Reset to default"; reload: the image reverts to the code default (no `ImageOverride` row remains for that key).

- [ ] **Step 5: Regression + types.** `npx tsc --noEmit` exit 0; `npx vitest run` all green; Playwright console-error check on `/` (logged out and logged in) reports none.

- [ ] **Step 6: Commit** any verification fixes, then finish.

```bash
git add -A && git commit -m "test(images): in-place editing end-to-end verification"
```

---

## Notes for the implementer
- `editKey` lets two slots that reuse the same asset path diverge. Add it only where a repeated asset needs independent control (none required for launch).
- Crop = zoom + focal within the fixed slot. Do not add box move/resize, freeform re-crop, or server-side re-encoding (explicitly out of scope).
- `Media`/`lib/storage` already handle local (dev) vs S3 (prod) storage. The prod build runs `prisma db push`, so the `ImageOverride` table ships automatically.
