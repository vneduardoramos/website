# 0015: Outcome-led case studies via DB fields

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-08

> The "13 case studies" below was reduced to **7 (one per industry)** by [0026](0026-final-industries-and-case-study-spotlight.md); the outcome-led field approach here still holds.

## Context

Case studies are the strongest credibility signal for a CXO buyer, but summaries led with activity ("we built…", "gave visibility") rather than measurable outcomes, and the detail page's quantified metrics/quote were generic fallbacks.

## Decision

Make every case study **lead with the result**, using fields the `CaseStudy` model **already had** (`metrics`, `quote`, `body`, `challenge`, `solution`, `results`), the detail page (`app/(marketing)/case-studies/[slug]/page.tsx`) already renders `metrics`/`quote` with fallbacks. So this was a **seed-data change, not a schema migration**:

- All 13 case studies in `prisma/seed/data.ts` got 3–4 quantified `metrics` (`[{value,label}]`), a named placeholder client `quote` (`{text,author,role}`), and a result-led rewritten `summary`; the 6 featured also got a Challenge/Solution/Results `body`.
- `prisma/seed/seed.ts` was updated to map `metrics`/`quote`/`body` (JSON-encoded) into the upsert, it previously dropped them.
- A `CaseStudySeed` type makes the new fields optional.
- Metric **values are kept short** (e.g. `2 hrs`, `−18%`, `5→1`, `12 wks`) to match the existing convention and avoid the heading/overflow problems from [0012](0012-layout-conventions.md).

## Consequences

- Each case study detail page shows a real outcome band, a quote, and (for featured) a narrative.
- Client names/quotes are placeholders (per [0007](0007-content-model-isr.md)); per-study metrics are study-specific and separate from the canonical firm metrics ([0014](0014-canonical-metrics.md)).
- Reload with `npm run db:seed` (idempotent upsert).

## Alternatives considered

- **Add new schema columns**, unnecessary: the fields already existed; only the seed mapping was missing.
- **Long descriptive metric values**, rejected: they overflow the large `MetricBand` numerals; phrasing goes in the label instead.
