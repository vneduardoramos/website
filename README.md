# ViewNear: Marketing Site + CMS

A data & AI consultancy website (Snowflake partner serving the Americas) with a full
content-managed backend. Built with **Next.js 14 (App Router) · TypeScript · Tailwind ·
Prisma · NextAuth**. The design and content structure were cloned from a scraped reference
site and rebranded to ViewNear (anonymized clients/team/testimonials, Americas positioning).

## Stack & decisions

- **Next.js 14 App Router + React 18**: public marketing pages + protected `/admin` CMS in one app.
- **Prisma + SQLite** for local dev (zero external infra). The schema is Postgres-portable;
  see `prisma/schema.prisma` header for the switch. (Local box had no Docker/Postgres, so
  SQLite was chosen; `Json`/enum/array fields are stored as JSON-encoded strings.)
- **NextAuth (Credentials)**: single seeded admin, `role` field for future multi-user.
- **bcryptjs** (pure JS) for password hashing; no native build step required.
- **Central theming** via `config/theme.ts` → CSS variables → Tailwind. Swap the palette/logo
  in one place. Dark-first.

## Getting started

```bash
cp .env.example .env        # defaults work for local SQLite dev
npm install
npx prisma db push          # create the SQLite database from the schema
npx prisma db seed          # load ViewNear content + seeded admin user
npm run dev                 # http://localhost:3000
```

Admin: **http://localhost:3000/admin**, sign in with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` from `.env` (default `admin@viewnear.com` / `changeme123`).

## Structure

```
app/(marketing)/   public pages (home, about, services, industries, case-studies,
                   blog, news, contact, brand, privacy)
app/admin/         CMS: login (open) + (panel) route group (auth-guarded chrome)
app/api/           auth, contact, careers, upload
components/        marketing/ (Nav, Footer, StatCounter, cards…), admin/ (EntityForm, …)
lib/               db, auth, queries, content (markdown), storage/, notify, admin/config
config/theme.ts    brand tokens (the one place to rebrand)
prisma/            schema + seed/ (data.ts content, seed.ts orchestrator)
content-source/    the original scraped reference data (seed input; not shipped)
```

## Documentation

Architecture, design system, content style guide, and the full decision log (ADRs)
live in [`docs/`](docs/README.md). Start there for the *why* behind any choice and the
authoritative reference for the design tokens and the canonical site metrics.

## CMS

Config-driven admin (`lib/admin/config.ts`): one generic list/create/edit/delete + publish
workflow drives all content types (Blog, Case Studies, News, Services, Industries, Team,
Jobs, Testimonials). Plus a **Leads** inbox (contact submissions) and a **Media**
library (uploads to `public/uploads` in dev via the `lib/storage` abstraction; swap to S3/blob
for prod). Content edits revalidate the public pages (ISR, `revalidate = 60`).

## Going to production (Postgres + Vercel)

1. In `prisma/schema.prisma` set `provider = "postgresql"`; point `DATABASE_URL` at hosted Postgres.
2. Optionally promote the JSON-string/`status` fields to real `Json`/enums/scalar lists.
3. Set `STORAGE_DRIVER=s3` and implement the S3 adapter in `lib/storage` (Vercel's FS is ephemeral).
4. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY` (email notifications) in the host env.

## Notes / placeholders

- Clients, team members, and testimonials are **anonymized**; edit them in the CMS.
- No binary brand assets shipped: the logo is a text wordmark and there are no real photos.
  Drop real assets into `public/assets/` and update `config/theme.ts`.
- Region/positioning copy targets the **Americas** (Canada, USA, Mexico, LATAM, Caribbean).
```
