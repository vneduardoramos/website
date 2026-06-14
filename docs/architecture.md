# Architecture

> Living reference. Update when the structure changes. For *why*, see [`decisions/`](decisions/).

ViewNear is a single **Next.js 14 (App Router) + TypeScript** app serving a public marketing site and a content-managed `/admin` CMS. Stack: React 18, Tailwind, Prisma, NextAuth, bcryptjs. ([0001](decisions/0001-stack-next-app-router.md))

## Directory layout

```
app/
  (marketing)/        public pages (route group)
    page.tsx          home
    services/ about/ industries/ industries/[slug]/
    case-studies/ case-studies/[slug]/ blog/ blog/[slug]/
    news/ news/[slug]/ contact/
    brand/ privacy/ terms/ security/ why-viewnear/ platform/
    partnership/ solutions/ approach/ team/ pricing/ faq/ resources/
    layout.tsx        marketing chrome (Nav + Footer)
  admin/
    login/            open
    (panel)/          auth-guarded chrome (sidebar, header)
      page.tsx        dashboard
      [model]/        generic list / new / [id] edit  (config-driven CMS)
      leads/ media/ settings/   bespoke screens
    actions.ts        server actions (CRUD/setStatus, leads, setSetting, deleteMedia)
  api/                auth/[...nextauth], contact, careers, upload
  layout.tsx globals.css sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
  not-found.tsx error.tsx global-error.tsx loading.tsx opengraph-image.tsx
  (opengraph-image.tsx also per blog/news/case-study/industry [slug])
components/marketing/  Nav, Footer, ui.tsx, FeatureSplit, Blocks, PageHero,
                      Decor, Motion, CoverCard, home/*, industries/flavor.tsx …
components/            JsonLd, Analytics, ConsentBanner (root-level)
components/admin/      EntityForm, MediaUploader, MediaDeleteButton, SignOutButton, SessionProvider
config/theme.ts        brand source of truth (palette, fonts, nav, socials)
lib/                   db, auth, queries (+ safe()), content (markdown), utils, enums,
                      notify, covers, ratelimit, og.tsx, storage/ (local + s3), admin/config.ts
prisma/                schema.prisma, seed/ (data.ts, seed.ts, generated.json)
content-source/        original scraped reference (seed input; not shipped)
.design/               screenshot harness (shoot.js) + baselines (dev-only)
docs/                  this documentation
```

## Data & content

- **Prisma + SQLite** in dev; schema is Postgres-portable. JSON-shaped data is stored as JSON-encoded strings and decoded via `lib/utils` (`parseJson`, `asObjectArray`, `asStringArray`). App enums are plain strings (`lib/enums.ts`). ([0002](decisions/0002-prisma-sqlite-dev.md))
- Read queries live in `lib/queries.ts` (published-only filters, includes). The Prisma client is a hot-reload-safe singleton in `lib/db.ts`.
- Content is seeded from `prisma/seed/data.ts` via idempotent upserts (`prisma/seed/seed.ts`); placeholders, Americas rebrand. ([0007](decisions/0007-content-model-isr.md))
- Public pages use ISR `export const revalidate = 60`; admin pages are `dynamic = "force-dynamic"`.

## CMS

Config-driven: `lib/admin/config.ts` declares each content type's fields; one generic list/new/edit set + `EntityForm` + the server actions in `app/admin/actions.ts` handle all of them. Publish workflow stamps `publishedAt` once on first publish. ([0004](decisions/0004-config-driven-cms.md), [0008](decisions/0008-publish-workflow-fix.md))

Field types (declared by `type` in config, rendered by `EntityForm`): `text` · `textarea` · `markdown` (WYSIWYG, `@uiw/react-md-editor`) · `image` (upload / pick from Media, stores a URL) · `select` · `boolean` · `number` · `date` · `relation` (single FK or `multiple` M2M `<select>`) · `repeater` (JSON array) · `group` (single JSON object) · `jsonList` / `jsonObjects` (raw JSON). The rich editors live in `components/admin/fields/` as client components that write a hidden input the server-action form reads; relation options load via `lib/admin/relations.ts`, and the Prisma payload is assembled by `lib/admin/build-data.ts`. ([0031](decisions/0031-cms-field-types.md))

## Auth

NextAuth Credentials (JWT) in `lib/auth.ts`; `bcryptjs` hashing; single seeded admin; `middleware.ts` guards `/admin` except `/admin/login`; server actions re-check the session. ([0003](decisions/0003-nextauth-credentials.md))

## Storage & media

`lib/storage/` exposes a `StorageAdapter`; `getStorage()` selects by `STORAGE_DRIVER` and fails loudly for unimplemented drivers. Uploads are validated (image MIME allowlist, 8 MB cap) in `app/api/upload/route.ts`. ([0006](decisions/0006-storage-abstraction.md), [0009](decisions/0009-upload-hardening.md))

## Notifications

`lib/notify.ts` sends via Resend if `RESEND_API_KEY` is set; otherwise logs to console (dev no-op). Used by the contact and careers API routes.

## Dev workflow

```bash
cp .env.example .env        # SQLite defaults work locally
npm install
npx prisma db push          # create the DB from the schema
npm run db:seed             # load content + seed admin (idempotent upsert)
npm run dev                 # http://localhost:3000
```

Admin: `/admin` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
Visual review: `node .design/shoot.js current` (dev server running) → compare to `.design/baseline`. ([0010](decisions/0010-screenshot-harness.md))

## Production path (Postgres + Vercel)

1. `prisma/schema.prisma`: set `provider = "postgresql"`; point `DATABASE_URL` at hosted Postgres.
2. Optionally promote JSON-string / `status` fields to real `Json` / enums / scalar lists.
3. Set `STORAGE_DRIVER=s3` and implement the S3 adapter in `lib/storage/` (Vercel FS is ephemeral).
4. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY` in host env.
