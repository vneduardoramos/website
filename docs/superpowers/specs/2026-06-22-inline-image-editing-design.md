# In-place image editing for logged-in CMS users

**Date:** 2026-06-22
**Status:** Approved (design), pending implementation plan

## Context

Editors want to manage every image on the marketing site from the live site itself, not the code or the admin CRUD. When a CMS admin is logged in, each image should expose an Edit affordance to **replace/upload** a new image, **reposition** it (focal point), **zoom/crop** within its slot, and set **alt text**. Edits must persist and apply for anonymous visitors, including for images whose `src` is hardcoded in TSX.

Constraints settled in brainstorming:
- **Scope:** every image (hardcoded + CMS-backed), via the shared `<Img>` wrapper.
- **Editing model:** frame *within the existing fixed slot* (replace, focal point, zoom). The responsive layout is never altered. No moving/resizing the layout box; no freeform re-crop to a new aspect ratio.
- **Trigger:** an "Edit images" toggle visible only to logged-in admins (not always-on).
- **Apply:** saves go live immediately (no draft/publish in v1).

Reuses existing infra: `<Img>` (`components/marketing/Img.tsx`), the authed uploader (`app/api/upload/route.ts` → `Media` + `lib/storage.ts`), NextAuth (`lib/auth.ts`, `getServerSession`), Prisma. Prod schema ships via `prisma db push` in the build (no migrations on prod) per project deploy norms.

## Data model (Prisma)

```prisma
model ImageOverride {
  id        String   @id @default(cuid())
  key       String   @unique          // editKey; defaults to the image's src path
  mediaUrl  String?                    // replacement image URL (from Media); null = keep code src
  focalX    Float    @default(50)      // object-position X, 0-100 (%)
  focalY    Float    @default(50)      // object-position Y, 0-100 (%)
  zoom      Float    @default(1)       // scale within the slot, >= 1
  alt       String?
  updatedBy String?                    // admin email
  updatedAt DateTime @updatedAt
}
```
Add to `prisma/schema.prisma`. Local: `prisma db push`. Prod: picked up by the build's `prisma db push`.

## Architecture: how an override reaches an image

1. **Server load (cached):** `lib/image-overrides.ts` exports `getImageOverrides()` returning `Record<key, Override>`, wrapped in `unstable_cache` with tag `"image-overrides"`. Called once in `app/(marketing)/layout.tsx`.
2. **Provider:** the marketing layout wraps `{children}` in a client `ImageOverrideProvider` given the serializable overrides map. Because Next renders client components (and their context) during SSR, the override is applied in the initial HTML — **no flash, no CLS** (focal/zoom never change the slot box).
3. **`<Img>` becomes override-aware** (converted to `"use client"`): it resolves its override by `editKey ?? String(src)`. If `mediaUrl` is set, it renders that as the `src`; it always applies `style={{ objectPosition: \`${focalX}% ${focalY}%\`, transform: zoom>1 ? \`scale(${zoom})\` : undefined }}` inside an `overflow-hidden` wrapper. It also stamps `data-editkey` and, when edit mode is on, renders the hover Edit button. Default behavior (no override, not logged in) is byte-identical to today.

**Keying:** `editKey` defaults to `src`. If the same asset path is used in two slots that need independent control, pass an explicit `editKey` at those call sites (cheap, done as needed; not required for v1 launch).

## Auth-gated edit overlay

- `app/(marketing)/layout.tsx` adds a client `EditModeProvider` that reads the session (extend NextAuth `SessionProvider` to the marketing tree, or fetch `/api/auth/session`). It exposes `{ isAdmin, editMode, setEditMode }`.
- When `isAdmin`, render a floating **"Edit images"** toggle (fixed, bottom-left, clear of the cookie banner). Anonymous visitors get no provider session → no toggle, no Edit buttons, no overlay code paths.
- `<Img>`'s Edit button renders only when `isAdmin && editMode`.
- **Security:** the overlay is a client convenience only. Authority lives in the API, which checks `getServerSession`. A forged client cannot write overrides.

## The editor

Clicking Edit opens a panel (client) framed to the image's real slot aspect, with a live preview:
- **Replace / upload:** file input → `POST /api/upload` (existing) → `media.url` becomes the working `mediaUrl`.
- **Reposition:** drag the preview (or a focal handle) → updates `focalX/Y`.
- **Zoom:** slider (1x–3x) → `zoom`; combined with focal point this selects the visible region (the "crop").
- **Alt text:** input.
- Actions: **Save**, **Cancel**, **Reset** (revert to code default).

## API

`app/api/image-overrides/route.ts` (auth required via `getServerSession`, rate-limited like `/api/upload`):
- `POST` — body `{ key, mediaUrl?, focalX?, focalY?, zoom?, alt? }`; `prisma.imageOverride.upsert({ where: { key }, ... })`; set `updatedBy`; `revalidateTag("image-overrides")` so `getImageOverrides()` refreshes.
- `DELETE` — `?key=`; delete the row (Reset); `revalidateTag("image-overrides")`.

The editor optimistically applies changes client-side on save; the tag revalidation makes them authoritative for all future requests.

## Out of scope (YAGNI)
Moving/resizing the layout box; freeform crop to new aspect ratios; server-side image re-encoding (crop is CSS framing only); draft/publish workflow; edit history/versioning; per-breakpoint overrides; SVG editing (uploader already excludes SVG).

## Verification
- Local dev (`PORT=3005 npm run dev`); `prisma db push` to add `ImageOverride`.
- Logged out: site identical to today; no toggle, no Edit buttons; `/api/image-overrides` POST returns 401.
- Logged in as admin: "Edit images" toggle appears; enable it; edit (a) a hardcoded image (home hero / a FeatureSplit) and (b) a CMS image (a blog cover): replace, drag focal point, zoom, set alt, Save. Reload → persists. Open as anon → override applied, no edit UI.
- Reset reverts to the code default.
- `npx tsc --noEmit` clean; Playwright: no console errors, no layout shift/flash when overrides apply (compare against pre-change screenshots).
