# Credibility plan — closing the proof gap

**Date:** 2026-06-12
**Context:** The site audit found the structure, messaging, and SEO are strong, but the dominant weakness is **proof**: case studies and testimonials are all illustrative, the team page shows few people, and some headline stats overclaimed. This doc records what was fixed and what still needs real content from the business.

## Already done (this pass)

- **Stats softened.** The About page no longer renders the vanity band ("50+ clients · 15 years in business · 25+ specialists · 5 countries"). It now relies on the credible `trackRecord` band (Premier + CoCo · 5 countries across the Americas · SnowPro-certified · 15+ yrs senior experience). The seeded `stats` setting default was reframed to those credible values too. This also resolves the contradiction with the news item "…became a Snowflake partner in just four years."

## The core gap: no real proof

Everything that would convince a buyer they're not the first client is currently illustrative:

| Asset | Current state | Why it matters |
|---|---|---|
| Case studies (7) | Invented clients ("Northwind Bank", "Maple Retail"), labeled illustrative | A buyer sees a *scenario*, not evidence of delivery |
| Testimonials (3) | Invented names/quotes | Zero third-party voice on the site |
| Industry pages (7) | Each ends in an illustrative case | Sector buyers see no sector proof |
| Team (About) | A handful of bios vs. "senior, certified team" positioning | Reads as a small shop; undercuts the "25+ specialists" story |

The honest "illustrative" labeling is the right interim move (and should stay until real references replace it), but it's a ceiling on credibility.

## What we need from the business (priority order)

1. **One real, named case study** (with client permission). Even anonymized-but-real ("a top-5 Canadian credit union") beats invented names. Provide: sector, the problem, what we built (Snowflake-native specifics), and 2–4 *real* metrics (use real, slightly-uneven numbers — "report prep 3 days → ~4 hours", not a round "40%"). This single asset moves credibility more than anything else.
2. **One or two real testimonials** — a name, title, company, and a specific quote tied to an outcome. Replace the invented `testimonials` seed entries.
3. **Real team bios.** Add the actual delivery team (name, title, 1-line focus, LinkedIn) via the admin (TeamMember). Target 6–10 to match the "senior, certified" positioning. If the team is genuinely small, *say so* and lean into "senior-only, no hand-offs" rather than implying scale.
4. **Verify remaining quantitative claims** before launch: countries served, years of practitioner experience, SnowPro certification count, partner tier/dates. Anything not verifiable should be reframed (as the stats were) or dropped.

## How to land it (mechanics)

- **Case studies & testimonials** are CMS-managed — add/replace via `/admin/caseStudy` and `/admin/testimonial`. When a real one is published, remove that item's "illustrative" caption (see `case-studies/page.tsx` and `industries/[slug]/page.tsx`).
- **Team** via `/admin/teamMember` (photo, title, bio, LinkedIn already supported).
- **Case-study metrics**: when replacing illustrative figures, use real, specific numbers and time ranges — round numbers (40%, 2×, 12 pts) read as invented.
- Keep the illustrative labeling on anything still illustrative; mixing labeled-illustrative with one real, named reference is credible and honest.

## Definition of "launch-credible"

- ≥1 named (or convincingly anonymized-real) case study with real metrics.
- ≥2 real testimonials.
- Team page reflects the real delivery team.
- Every standing numeric claim is verifiable.
- All remaining placeholder content stays clearly labeled illustrative.
