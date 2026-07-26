# SQLite → PostgreSQL migration (stay on Prisma)

> **Completed and cleaned up, 2026-07-26.** The migration ran; Postgres is the only
> database now. `prisma/data-export.json`, `scripts/export-sqlite.ts` and
> `scripts/import-postgres.ts` have been **deleted**. The dump was the last copy in
> the repo of the fabricated `newsEvent` rows a claim audit removed (see
> `docs/CHANGELOG.md`), so keeping it around meant keeping fabricated content
> committed for a migration that can never run again. Content now moves between
> environments through `scripts/content-sync.ts` and `prisma/content-snapshot.json`.



Date: 2026-06-14

## Goal
Move the ViewNear CMS database from SQLite to a local PostgreSQL instance,
migrating all existing data. Stay on Prisma (Prisma Migrate); drizzle-kit is
not used.

## Decisions
- ORM/migrations: **Prisma** (`prisma migrate`). Provider switches `sqlite` → `postgresql`.
- Single schema source of truth: edit `prisma/schema.prisma` to be the Postgres
  schema, keep the **default** client output (`@prisma/client`) and the existing
  `DATABASE_URL` env var. Delete the redundant `prisma/schema.postgres.prisma`
  (it used a custom output `./generated/pg-client` + `POSTGRES_URL`, which would
  force import changes in `lib/db.ts` and `seed.ts`).
- Local Postgres via Homebrew `postgresql@16`, run as a brew service.
- Real data copy (not reseed): runtime-only rows (Leads, JobApplications,
  admin-edited SiteSettings) are not reproduced by the seed.

## Steps
1. **Postgres**: `brew install postgresql@16`, start service, create DB
   `viewnear_dev` owned by the macOS user.
   URL: `postgresql://<user>@localhost:5432/viewnear_dev?schema=public`.
2. **Dump SQLite** (before switching the client): `scripts/export-sqlite.ts`
   reads every model → `prisma/data-export.json`.
3. **Switch Prisma**: edit `schema.prisma` provider, delete `schema.postgres.prisma`,
   `prisma generate`, `prisma migrate dev --name init`. (Superseded: the
   generated migrations were later removed; the live schema path is
   `prisma db push` everywhere, and a full local reset is `npm run db:reset`,
   which runs `prisma db push --force-reset && prisma db seed`.)
4. **Import**: `scripts/import-postgres.ts` loads the JSON, inserts in FK-safe
   order, reconnects BlogPost↔Tag m2m.
5. **Verify**: per-model row-count parity, `npm run typecheck`, `next dev` smoke.

## FK-safe insert order
User, Media, Client, Tag → TeamMember, Industry, Service → CaseStudy,
Testimonial, BlogPost(+tags connect), NewsEvent, Lead, JobOpening →
JobApplication, SiteSetting.

## Rollback
Keep `prisma/dev.db` (untracked) until the Postgres copy is verified; delete later.
