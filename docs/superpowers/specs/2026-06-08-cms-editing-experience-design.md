# Design: CMS editing experience for blog, news & case studies

- **Date:** 2026-06-08
- **Status:** Approved (brainstorm); pending implementation plan
- **Project:** ViewNear marketing site (`/Users/eduardoramos/Documents/VN`)

## Context

The config-driven admin ([0004](../../decisions/0004-config-driven-cms.md)) drives all CRUD from `lib/admin/config.ts` via a single generic `EntityForm` + server actions. Editing the three editorial content types (blog, news, case studies) is currently weak: the body is a plain monospace `<textarea>` (no WYSIWYG), there's no image picker or relation picker, and many fields aren't exposed at all (cover/hero images, author, tags, case-study metrics/quote, news eventDate/externalUrl, SEO). Authors show as a bare name (the `User` model has no photo/bio/LinkedIn), even though the **`TeamMember` model already has `photo`/`headshot`, `bio`, `title`, `linkedinUrl`**. Images are inconsistent (blog `coverImageId` FK — unused by the page; news/case-study string paths), and the **blog page ignores its cover entirely**, using a hash fallback.

Goal: make CRUD for these types WYSIWYG and easy, support images/excerpts/permalinks/author-with-LinkedIn, and tie each field through to the public page.

## Decisions (confirmed)

- **Editor:** Markdown **WYSIWYG** (`@uiw/react-md-editor`) — keeps Markdown storage + the existing `react-markdown` render pipeline.
- **Author:** a **`TeamMember`** relation, **blog only** (not news, not case studies).
- **Images:** one `image` field type (upload or pick from the media library), stored as a **URL string**, consistent across all three types.
- **Coverage:** expose all currently-uneditable fields, with friendly **repeater** UIs for structured data (metrics, quote, agenda).
- Leave blog's now-redundant `coverImageId` FK in the schema **unused** (no migration).

## Approach

Extend the config-driven admin with **new reusable field types** rather than bespoke per-type forms or a headless-CMS swap. `EntityForm` + `buildData` + the server actions remain the single source of CRUD; each new field type is a self-contained unit any model can use.

## Units of work

### 1. New field types (`FieldType` in `lib/admin/config.ts`, render in `EntityForm.tsx`, handle in `actions.ts`)
All new editors are **client components that write a hidden input**, so the existing progressive-enhancement `<form action={serverAction}>` keeps submitting via `FormData`.

- **`markdown` → WYSIWYG.** Replace the textarea branch with a client `MarkdownEditor` wrapping `@uiw/react-md-editor` (dynamic import, `ssr:false`; toolbar + live preview). Value still a Markdown string → `buildData` default (string) path unchanged.
- **`image`.** New `ImageField` client component: shows current value (preview), an **Upload** control (POST `/api/upload`, which returns a `Media` with `url`), and a **Pick from library** modal listing existing `Media`. Writes the chosen **URL** to a hidden input. `buildData`: treat `image` as a string.
- **`relation`.** Config adds `relation?: { model: string; labelField: string; multiple?: boolean }`. `EntityForm` renders a `<select>` (single) or multi-select (M2M) from options passed in by the page. `buildData`/actions map the value: single → set the FK scalar (e.g. `authorId`); `multiple` (tags) → `{ set: ids.map(id => ({ id })) }` on update/create. Empty single → `null` (disconnect).
- **`repeater`.** Config adds `itemFields: { name, label, type }[]`. `RepeaterField` client component edits an array of objects (add/remove/reorder rows), serializes to the **same JSON string** the DB stores. `buildData`: validate JSON like `jsonObjects`. Used for case-study `metrics` ([{value,label}]) and news `agenda` ([{time,item}]); the case-study `quote` is a single-object group (one fixed row).

### 2. Relation-option loading
The admin edit/new pages (`app/admin/(panel)/[model]/[id]/page.tsx`, `.../new/page.tsx`) inspect the model's `relation` fields and fetch options server-side (e.g. published `TeamMember`s for blog author; `Tag`s for blog tags) and pass an `options` map into `EntityForm`. Add a small `getRelationOptions(model)` helper in `lib/admin/` (or queries) keyed by relation model + labelField.

### 3. Author = TeamMember (blog only)
- Schema: add `authorTeamId String?` + `authorTeam TeamMember? @relation(...)` to `BlogPost` (keep the existing `authorId → User` FK untouched/unused). Add the inverse relation field on `TeamMember`.
- Config: blog gets `{ name: "authorTeamId", type: "relation", relation: { model: "teamMember", labelField: "name" } }`.
- Public render (`blog/[slug]/page.tsx` + `blog/page.tsx`): an **author block** — `headshot`/`photo`, `name`, `title`, and "Connect on LinkedIn →" (`linkedinUrl`); listing meta shows author photo+name. Article JSON-LD: `author` = Person with `name` + `sameAs: [linkedinUrl]` when present. Fall back to the org when no author set.

### 4. Images unified
- Schema: add `coverImage String?` to `BlogPost` (news/case-study already have a string image field — `coverImage` / `heroImage`).
- Config: add an `image` field to all three (blog `coverImage`, news `coverImage`, case-study `heroImage`).
- Fix `blog/[slug]/page.tsx` + `blog/page.tsx` to render `post.coverImage ?? coverFor(slug)` (currently they ignore the cover).
- `/api/upload`: unchanged — leave `Media.width`/`height` null as today (no `sharp`/native dependency; pages use fixed aspect-ratio containers and `next/image` doesn't require stored dimensions).

### 5. Field coverage (config additions)
- **Blog:** `coverImage` (image), `authorTeamId` (relation→TeamMember), `tags` (relation multiple→Tag), `seoTitle`, `seoDescription`. *(`ogImage` optional.)*
- **News:** `coverImage` (image), `eventDate` (date), `externalUrl` (text), `readMinutes` (number), `seoTitle`, `seoDescription`. *(agenda already present — switch to `repeater`.)*
- **Case study:** `heroImage` (image), `metrics` (repeater → JSON array `[{value,label}]`), `quote` (**group**: fixed `text`/`author`/`role` inputs serialized to a JSON **object** `{text,author,role}`, reusing the repeater row UI but pinned to one object, not an array), `challenge`/`solution`/`results` (markdown), `clientId` (relation→Client), `industryId` (relation→Industry), `seoTitle`, `seoDescription`.

### 6. Admin ergonomics
- Add a "View live ↗" link to the edit page header (`/{type-route}/{slug}`) so editors can jump to the public page.
- Slugs stay the editable permalink (auto-from-title when blank, as today).

## Out of scope
- Authors on news/case studies. Switching news/case-study images to a Media FK (kept as URL strings). Replacing real client content (user-owned). Versioning/drafts-preview beyond the existing DRAFT/PUBLISHED status.

## Verification
- `npx tsc --noEmit`, `npm run lint`, build clean.
- Reseed (`prisma db push --force-reset && npm run db:seed`) after schema additions.
- **Authenticated admin walkthrough** (log in, the seeded admin): create a blog post — type body in the **WYSIWYG**, **upload + pick** a cover image, select a **TeamMember author**, add **tags**; edit a case study's **metrics/quote** via the **repeater**. Save.
- Public check: the blog detail renders the chosen cover, an author block with a working **LinkedIn** link, and Article JSON-LD with `sameAs`; the case-study spotlight/detail reflects the edited metrics/quote; news shows its cover + eventDate.
- Confirm the generic CRUD still works for the other (non-editorial) models (no regressions from the new field-type branches).
