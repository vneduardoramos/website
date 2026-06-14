# 0008: Publish workflow: stamp `publishedAt` once; add `JobOpening.publishedAt`

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

Two correctness bugs in the config-driven publish workflow (`app/admin/actions.ts`):

1. `buildData` did `data.publishedAt = data.publishedAt ?? new Date()` whenever `status === "PUBLISHED"`. But `publishedAt` is **never a form field**, so it was `undefined` on every update → **re-stamped to "now" on every edit**. Since Blog/News order by `publishedAt desc`, fixing a typo on an old post jumped it to the top and changed its displayed date.
2. `JobOpening` had `hasStatus: true` but **no `publishedAt` column**, the one model missing it. Because `buildData` set `publishedAt` for any published entity, **saving a published job opening threw** a Prisma "Unknown argument `publishedAt`" error. The code everywhere assumes `hasStatus ⇒ publishedAt exists`.

## Decision

- `buildData` stamps `publishedAt` **only on create** when born published.
- A `stampPublishedAt(model, id, data)` helper sets `publishedAt` on update/`setStatus` **only if the existing row's `publishedAt` is null** (first publish), preserving it thereafter.
- Added `publishedAt DateTime?` to `JobOpening` in `prisma/schema.prisma` (nullable add, no data loss) to restore the `hasStatus ⇒ publishedAt` invariant.

## Consequences

- Editing a published entity no longer changes its publish date or reorders lists.
- Publishing a job opening works.
- Verified against the live DB: job-opening publish accepted; an already-published post's `publishedAt` is preserved across an edit.

## Alternatives considered

- **Guard `publishedAt` per-model instead of adding the column**, rejected: the invariant `hasStatus ⇒ publishedAt` is assumed across the codebase; adding the column keeps it clean and consistent with the other five status models.
