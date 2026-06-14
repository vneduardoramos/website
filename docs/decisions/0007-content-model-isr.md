# 0007: Content model: seeded, Americas rebrand, placeholders, ISR

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

The site's structure and initial content were cloned from a scraped reference site (an EMEA Snowflake partner, "DataLab"). ViewNear targets **the Americas** and must not ship any real third-party client/team data.

## Decision

- All seed content lives in `prisma/seed/data.ts` and is loaded by `prisma/seed/seed.ts` (idempotent **upserts** by slug/key; testimonials are `deleteMany` + recreate). Leads and Media are never touched by seeding.
- Transforms applied to the scraped source: brand → ViewNear, EMEA/South Africa → the Americas (Canada, USA, Mexico, LATAM, Caribbean), and **all clients/team/testimonials replaced with clearly generic placeholders**. The raw scrape stays in `content-source/` (input only, not shipped).
- Public pages use **ISR** with `export const revalidate = 60`, so CMS edits propagate without a redeploy. Admin pages are `dynamic = "force-dynamic"`.

## Consequences

- `npm run db:seed` reloads content safely at any time (won't wipe leads/media).
- Placeholders are intentional and called out in the README and [`content-style-guide.md`](../content-style-guide.md); they're editable in the CMS.
- Region/positioning copy is Americas-wide. Spelling/terminology standardized later, see [0013](0013-american-english-terminology.md).

## Alternatives considered

- **Author all content by hand**, rejected: the scrape gave a complete, realistic structure to rebrand from, much faster.
- **No revalidation / full static**, rejected: editors expect changes to appear without a deploy; ISR at 60s is the balance.
