# 0031: Reusable CMS field types (WYSIWYG, image, relation, repeater, group)

- **Status:** Active
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

The config-driven admin ([0004](0004-config-driven-cms.md)) covered CRUD but the *editing experience* was weak. Long-form body copy was a plain `<textarea>` of raw Markdown; there was no way to set a cover/hero image except hand-typing a URL; structured data (metrics, agendas, client quotes) and SEO were edited as raw JSON strings; and relations (a post's author, its tags, a case study's client/industry) had no UI at all. Editors needed a real authoring surface without abandoning the single generic form.

## Decision

Extend the config-driven admin with a small set of reusable **field types**, each a client component that renders an authoring UI and writes a **hidden `<input>`** the existing server-action form already reads. This preserves the `<form action={serverAction}>` model — no client-side fetch plumbing, no per-model screens.

- New `type`s in `lib/admin/config.ts` + `EntityForm`: **`markdown`** (WYSIWYG via `@uiw/react-md-editor`), **`image`** (upload to `/api/upload` or pick from the Media library; stores a URL string), **`repeater`** (JSON array of rows), **`group`** (single JSON object), and **`relation`** (a `<select>` — single FK, or `multiple` for M2M). Field editors live in `components/admin/fields/`; relation options are loaded server-side via `lib/admin/relations.ts`.
- The server actions build the Prisma payload through `lib/admin/build-data.ts`: `buildEntityData` handles scalars (image URL, single-FK relation, repeater/group JSON strings); `m2mConnections` handles multiple relations — **`connect` on create, `set` on update** (Prisma rejects `set` on create).
- **Blog author = `TeamMember`.** Added `BlogPost.authorTeamId` → `authorTeam` (and `TeamMember.authoredPosts`) so a post's byline reuses the real team profile (photo, title, LinkedIn).
- Exposed fields per model: blog → cover image / author / tags; case study → hero image / client / industry / challenge·solution·results (markdown) / metrics (repeater) / quote (group) / SEO; news → cover image / event date / agenda (repeater) / SEO.
- Public pages render the new data: blog listing + detail use `coverImageUrl ?? coverFor(slug)`, show a `TeamMember` author block, and emit Article JSON-LD `author` as a `Person` with `sameAs: [linkedinUrl]`.

## Consequences

- Every model gets these field types for free by declaring them in config — no new screens, consistent with [0004](0004-config-driven-cms.md).
- The new cover field is **`coverImageUrl`** (a plain string) rather than reusing the existing `BlogPost.coverImage` Media relation, which was already taken; the old `coverImage`/`authorId` FKs are left in the schema, unused.
- No `sharp` / image-dimension capture — the image field stores only a URL; sizing is handled by CSS at render time.
- `m2mConnections` is now create/update-aware; callers must pass `isCreate`. (A bug where it always emitted `set` 500'd every blog create — fixed and covered by `build-data.test.ts`.)

## Alternatives considered

- **Keep raw textarea/JSON editing**, rejected: high error rate, no image/relation UX, poor for non-technical editors.
- **A separate rich client form per editorial model**, rejected: reintroduces the per-model drift [0004](0004-config-driven-cms.md) exists to avoid.
- **Off-the-shelf block editor**, rejected: heavier dependency than the project needs; Markdown + a few structured fields cover the content shapes.
