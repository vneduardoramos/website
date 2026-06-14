# 0026: Final 7 industries, one case study each, prominent spotlight

- **Status:** Active
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

The industry set was carried over from the old datalabsolutions.ai scrape (Financial Services, Healthcare, Agriculture, Retail, Food & Beverage, Charity & Non-profit). The business settled on a **final set of 7** sector verticals. Separately, the per-industry case studies were unevenly distributed (3, 4, 2, 1…) and the industry detail page rendered them as a small `CaseStudyCard` grid, so a single card looked weak.

## Decision

**1. Replace the industry taxonomy with the final 7** (alphabetical `order`):

| # | Name | Slug |
|---|------|------|
| 1 | Construction and Real Estate | `construction-real-estate` |
| 2 | Education | `education` |
| 3 | Financial Services | `financial-services` |
| 4 | Manufacturing | `manufacturing` |
| 5 | Media, Entertainment & Advertising | `media-entertainment-advertising` |
| 6 | Retail & CPG | `retail-cpg` |
| 7 | Technology and Telco | `technology-telco` |

- Financial Services kept as-is. Retail renamed **Retail & CPG** with Food & Beverage folded into its copy. Healthcare, Agriculture, and Charity **removed**. The 5 new sectors got **scaffolded draft copy** (headline, intro, challenges, deliverables, tools, stats) in the existing shape, refine later; stats/metrics are representative placeholders, not verified client numbers.
- Source of truth is the `industries` array in `prisma/seed/data.ts`. Supporting updates: `INDUSTRY_FLAVOR` + 5 new SVG icons in `components/marketing/industries/flavor.tsx` (one palette hue each, written as full static classes), `SECTOR_IMAGE` in `lib/covers.ts`, and 7 slug-named cover images in `public/assets/images/industries/` (placeholders from the photo pool until real photography).
- **Hardcoded industry nav lists must stay in sync** with the seed in four places: `config/theme.ts` (mega-menu), `components/marketing/Nav.tsx` (`NAV_DESCRIPTIONS`), `components/marketing/Footer.tsx`, and `app/(marketing)/solutions/page.tsx` (by-sector chips). These are not DB-driven.

**2. One case study per industry** (supersedes the "all 13" count in [0015](0015-outcome-led-case-studies.md)). Reduced the seed `caseStudies` 13 → **7**, keeping each industry's featured study (or lowest `order` where none was featured), all set `featured: true`, `order` 1–7 mirroring the industry list. The 6 now-orphaned demo `clients` were removed too (`getClients` is never called in `app/`/`components/`; clients only surface via case-study includes).

**3. Prominent case-study spotlight** on `app/(marketing)/industries/[slug]/page.tsx`. Replaced the `CaseStudyCard` grid with a full-width two-column band: sector image (case-study `heroImage` ?? sector image) with the per-sector `flavor.glow` tint + a sector chip, and a content side with client·region, title, summary, a 2×2 grid of the study's `metrics`, the pull-`quote` (gracefully omitted when absent), and a "Read the full case study →" CTA. Reuses `next/image`, `parseJson`/`asObjectArray`, and `flavor` accent classes.

## Consequences

- `/industries` lists 7; `/case-studies` lists 7 (one per sector); each industry page shows exactly one, prominently. Old slugs (`/industries/healthcare`, `/case-studies/andespay-edw`, …) now 404.
- Reseed required after pulling: the seed only upserts, so run **`npx prisma db push --force-reset && npm run db:seed`** (the `db:reset` npm script is broken, no `prisma/migrations/` dir). Confirm `industries: 7`, `caseStudies: 7`.
- New-industry copy and the spotlight image are placeholders; swapping in real copy/photos needs no code change.

## Alternatives considered

- **Display-limit only** (keep 13 in the DB, show one per page): rejected, the client wanted the index reduced too.
- **Keep the small card grid:** rejected, a lone card reads as an afterthought; the spotlight makes the proof point land.
