# 0004: Config-driven CMS (one generic CRUD)

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

The CMS manages nine content types (Blog, Case Studies, News, Services, Industries, Team, Jobs, Videos, Testimonials). Hand-building list/create/edit/delete screens for each would be repetitive and drift over time.

## Decision

Drive all content types from a single declarative config, `lib/admin/config.ts`. Each `AdminModel` declares its Prisma delegate `key`, `fields` (with `type`, `label`, `required`, `options`), `listFields`, and whether it `hasStatus` (publish workflow).

- One generic list page (`app/admin/(panel)/[model]/page.tsx`), one create (`[model]/new`), one edit (`[model]/[id]`).
- A single `EntityForm` renders inputs by field `type` (`components/admin/EntityForm.tsx`).
- Generic server actions (`app/admin/actions.ts`), `createEntity` / `updateEntity` / `deleteEntity` / `setStatus`, build the Prisma payload from the config via `buildData`.
- Field types include `jsonList` / `jsonObjects` (validated JSON stored as strings), supporting the SQLite JSON-string approach from [0002](0002-prisma-sqlite-dev.md).

Separate bespoke screens exist only for **Leads** (inbox) and **Media** (uploads), which don't fit the generic CRUD shape.

## Consequences

- Adding a content type ≈ adding a Prisma model + one `ADMIN_MODELS` entry; no new screens.
- `buildData` only writes fields declared in the config, no mass-assignment beyond the schema.
- The publish workflow (`status` + `publishedAt`) is centralized here; see [0008](0008-publish-workflow-fix.md) for its correctness fix.

## Alternatives considered

- **Per-model hand-written admin screens**, rejected: repetitive, drift-prone.
- **Off-the-shelf admin (e.g. AdminJS)**, rejected: heavier dependency and less control over the look/UX than a small bespoke generic layer.
