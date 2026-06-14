# 0028: Launch-readiness hardening (audit remediation)

- **Status:** Active
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

A full site audit (SEO, UX/a11y, engineering/CMS/security) found the site well-architected but short of launch-grade in five areas. This records the remediation. Real client content remains owned by the user and out of scope (the site should stay pre-launch/noindex until it lands).

## Decision

**1. Resilience & error UX.** Added `app/not-found.tsx` (branded 404 with nav/footer), `app/error.tsx` + `app/global-error.tsx` (self-contained boundaries), and `app/loading.tsx`. Added a `safe(promise, fallback)` helper (`lib/queries.ts`) wrapping the multi-query home and resources pages so a DB blip degrades to empty sections instead of a 500.

**2. SEO & social.** Root metadata gained `twitter` (summary_large_image) and a `themeColor` viewport; dynamic OG images via `next/og` (`lib/og.tsx` + `app/opengraph-image.tsx` + per-segment for blog/news/case-study/industry). JSON-LD via `components/JsonLd.tsx`: Organization + WebSite (root layout), Article/NewsArticle (blog/news detail), FAQPage (faq). Added `app/manifest.ts` + 192/512/apple icons (from the 1500px favicon). Strengthened the generic page titles.

**3. CMS completeness.** FAQ is now DB-driven: seed `faqs` is a flat `{category,q,a}` list; `/faq` reads `getSetting("faqs")`, groups by category, and emits FAQPage JSON-LD (home/services still read q/a). New **Settings admin** (`/admin/settings` + `setSetting` action) edits hero/contact/partnership/stats/faqs as validated JSON. Added `client` and `tag` to `ADMIN_MODELS` (config-driven CRUD auto-generates). Media delete: `StorageAdapter.delete()` + a `deleteMedia` action + per-item button (removes row **and** file).

**4. Hardening & infra.** In-memory rate limiter (`lib/ratelimit.ts`) on `/api/contact|careers|upload` (429 over limit; note: per-instance — Upstash for durable serverless). try/catch around API DB writes; upload rolls back the stored file if the DB write fails. Fixed the middleware to redirect unauthenticated `/admin` to the custom `/admin/login` (was NextAuth's default `/api/auth/signin`, which 500s). Production guard in `lib/auth.ts` throws on a default `NEXTAUTH_SECRET`. Implemented the S3/R2 storage adapter (`lib/storage/s3.ts`, lazy-loaded). Added ESLint config + `typecheck`/`test` scripts, Vitest unit tests (`lib/*.test.ts`), and a CI workflow (`.github/workflows/ci.yml`). Fixed `db:reset` (`prisma db push --force-reset && db seed`). Deleted the unused `DashboardMockup`. Fleshed out `.env.example`.

**5. Consent + analytics.** `components/ConsentBanner.tsx` (records choice in localStorage, links to /privacy) + `components/Analytics.tsx` (GA4 via `NEXT_PUBLIC_GA_ID`, GA Consent Mode default-denied → granted only on accept; provider-agnostic, Plausible is a drop-in). Both mounted in the root layout.

## Consequences

- New dev deps: `vitest`, `eslint`, `@typescript-eslint/eslint-plugin`, `playwright` (the screenshot harness needs it); new dep: `@aws-sdk/client-s3` (lazy-loaded, only bundled when `STORAGE_DRIVER=s3`).
- `next build` not switched off ESLint (lint now passes); CI gates lint + typecheck + tests + build.
- Production requires a real `NEXTAUTH_SECRET` (guard throws otherwise) and `STORAGE_DRIVER=s3` (local FS is ephemeral on serverless).
- Verified: branded 404; OG images (default + per-segment) return PNGs; Org/Article/FAQPage JSON-LD present; manifest/icons served; `/faq` DB-driven; authenticated admin Settings/Clients/Tags render; rate limit returns 429 on the 6th request; `tsc --noEmit`, `npm test` (12), and `npm run lint` all green; consent banner renders and gates GA.

## Out of scope
Real client/case-study/testimonial content (user-owned); Postgres migration is documented but not executed (dev stays on SQLite/`db push`).
