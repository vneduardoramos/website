# Services pages: SEO long-form content (design)

Date: 2026-07-22. Status: approved for implementation (autonomous session; user review after delivery).

## Goal

Make each of the 6 `/services/<slug>` pages findable for commercial search queries a US
buyer (and a Mexican buyer on `/es`) actually types: Snowflake service terms plus the
nearshore / LATAM / outsourcing vocabulary the user asked to target. Today each page has
a 1-paragraph body: too thin to rank for anything beyond the brand name.

## Approach (chosen)

Expand the seeded `Service.body` markdown into structured long-form content
(~550–850 words per service, en + es), and refresh `seoTitle` / `seoDescription`
to carry the commercial keywords. No schema change, no new routes.

- **Detail page** (`services/[slug]/page.tsx`) already renders `body` as full
  markdown inside the Overview section: the long-form lands there with zero code change.
- **Index page** (`services/page.tsx`) currently renders the *entire* body inside each
  card. Change: render only the first paragraph of `body` in the card, so the card look
  is unchanged while detail pages grow. Convention: **paragraph 1 of every body is the
  short card pitch** (roughly the current one-paragraph body).
- **Structure per body:** P1 card pitch → `##` what we deliver (bulleted, keyword-bearing)
  → `##` how the engagement runs (8–16 weeks with mechanism) → a service-specific
  nearshore/LATAM section (heading varies per service to avoid 6x duplicate blocks)
  → 2–3 question-formatted `###` FAQs capturing long-tail queries → internal links woven
  in (`/nearshore`, `/migrations`, `/data-ai`, `/industries`, `/case-studies`,
  `/partnership`, sibling services; `/es/...` prefixes in Spanish bodies, matching the
  blog-content precedent).
- **Keyword division of labor:** `/nearshore` keeps the head terms ("nearshore Snowflake
  team"); each service page owns service-specific long-tail ("nearshore data engineering
  services", "Snowflake migration partner LATAM", "data engineering outsourcing" etc.)
  and links up to `/nearshore` rather than competing with it.
- **"Outsourcing" handling:** it is a search term buyers use, so it appears, but framed
  on-positioning (nearshore delivery vs. classic outsourcing; a practice you keep), never
  as our self-description.

## Alternatives considered

1. **New landing pages per keyword** (e.g. `/nearshore-data-engineering`): rejected for
   now; cannibalizes `/nearshore`, multiplies maintenance, and the service pages already
   sit in the internal-link mesh and sitemap.
2. **New structured fields/sections on Service** (deliverables[], faqs[] + JSON-LD):
   rejected; schema churn with no ranking benefit over rendered markdown. Revisit if we
   later want FAQPage structured data.

## Constraints (binding, from docs/content-style-guide.md and memory)

- No em dashes anywhere; en dashes for numeric ranges stay.
- "consultancy/consulting/consultant/consultative" banned in copy, metadata, SEO strings
  (Spanish too: no "consultoría/consultor").
- Snowflake is the substrate, not the subject; deliverable is never "the/your platform".
- Only Snowflake-native product names (plus dbt); no Matillion/Fivetran/Tableau/etc.;
  no "Snowflake Intelligence"/"Cortex Code"/"Document AI"; consumption-based, never seats.
- Canonical metrics only: 8–16 weeks (with mechanism attached), 60% / 3× / 40% delivery
  band, 15+ years, 5 countries. No invented numbers.
- No self-labeled caliber, no senior-only promises, no AI auto-learning overclaims,
  no ownership/lock-in filler.
- American English; slugs never change (`data-visualisation` stays).
- Spanish = Mexican professional register (usted, English tech terms kept, "IA" generic,
  "Data + AI" pairing stays English).

## Verification

Guard greps from the style guide (em dash, spelling, banned brands/terms) + a banned-word
grep over the new copy; `npm run typecheck`; reseed (`npm run db:seed`) and spot-render
`/services` and each detail page en + es.
