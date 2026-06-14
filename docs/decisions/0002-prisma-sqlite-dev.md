# 0002: Prisma + SQLite for dev, Postgres-portable schema

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

We need a database for the CMS. The local machine had no Docker/Postgres, and we wanted zero-friction local dev. Production will eventually run Postgres on a host like Vercel.

## Decision

Use **Prisma** as the ORM with **SQLite** for local dev (`DATABASE_URL="file:./dev.db"`). Keep the schema **Postgres-portable**:

- `Json`/enum/array-shaped data is stored as **JSON-encoded strings** (e.g. `Service.tools`, `CaseStudy.metrics`, `SiteSetting.value`), decoded via helpers in `lib/utils` (`parseJson`, `asObjectArray`, `asStringArray`).
- Status fields are plain `String` columns with app-level enums in `lib/enums.ts` (`PUBLISH_STATUSES`, `LEAD_STATUSES`, etc.).
- The switch to Postgres is documented in `prisma/schema.prisma` and the README "Going to production" section.

## Consequences

- `npx prisma db push && npx prisma db seed && npm run dev` is the entire setup.
- No native DB infra needed locally; the Prisma client is a hot-reload-safe singleton in `lib/db.ts`.
- Going to prod: set `provider = "postgresql"`, point `DATABASE_URL` at hosted Postgres; JSON-string/`status` fields can optionally be promoted to real `Json`/enums/scalar lists later.

## Alternatives considered

- **Postgres locally via Docker**, rejected: no Docker on the box, and unnecessary for dev.
- **Native Prisma `Json`/enum/`String[]` types now**, rejected: not supported on SQLite; would block local dev. Deferred to the Postgres cutover.
