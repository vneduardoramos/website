# Nearshore Advantage page

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation

## Purpose

A standalone marketing page that adapts ViewNear's existing nearshore positioning
into a dedicated story: SnowPro-certified Snowflake delivery from Monterrey, Mexico,
in the US Central time zone. Reframes a previous-company "nearshore software
development" page around data + AI on Snowflake. Lives at `/nearshore` under the
Company nav group.

## Placement and nav

- New route: `app/(marketing)/nearshore/page.tsx`.
- Add to Company children in `config/theme.ts`:
  `{ label: "Nearshore Advantage", href: "/nearshore" }` placed after Partnership
  (About, Partnership, Nearshore Advantage, Life at Viewnear, Security & Trust).
- `Nav.tsx`: add `NAV_DESCRIPTIONS["/nearshore"] = "Nearshore Snowflake delivery, your time zone"`
  and a representative icon in `NAV_ICONS` (map-pin style line icon, same 24x24 / 1.8 stroke family).
- Add `/nearshore` to `app/sitemap.ts`.

## Page structure

Reuse the existing component kit. Sections top to bottom:

1. **Hero** (`PageHero`)
   - Headline: "Nearshore data & AI delivery, in sync with your team."
   - Subhead: SnowPro-certified Snowflake experts who work your business hours in the
     US Central time zone, so delivery moves at the pace of a team down the hall.
   - Chips: `US Central time zone`, `SnowPro-certified`, `Snowflake Premier Partner`,
     `CoCo Preferred Partner`.
   - No "from Monterrey" in the headline; Monterrey appears in the body (section 5/6).

2. **Client logo strip** (`ClientLogos`) - reuse the 7 real clients for trust.

3. **Why nearshore with ViewNear** (`BenefitsGrid` or a card grid) - 6 cards adapted
   from the source page's "why choose" list, reframed for data + AI:
   - Same time zone: shared business hours, no overnight handoffs.
   - Snowflake depth at every level (not senior-only).
   - Clear bilingual communication (English and Spanish), no offshore delays.
   - Dedicated, boutique team.
   - Consistent communication cadence.
   - Agile delivery for faster timelines.

4. **By the numbers** (`MetricBand`) - verified facts only:
   - `Premier` - Snowflake Premier + CoCo Preferred Partner
   - `SnowPro` - SnowPro-certified across the team
   - `15+` - Years building data and enterprise AI
   - `5` - Countries across the Americas

5. **What we deliver nearshore** - maps the source page's "OS / Cloud / Mobile / Web
   apps" to ViewNear service areas: Data Modernization and Migration, AI and Cortex,
   Governance and Horizon, Data Apps and Snowpark. Plus a Snowflake-stack competency
   line (Cortex, Snowpark, Iceberg, dbt, Openflow, Horizon). This is where Monterrey
   delivery is stated plainly.

6. **Three deep-dive benefit blocks** (`FeatureSplit`, alternating):
   - Same-time-zone collaboration.
   - Senior nearshore Snowflake talent, depth at every level.
   - Clear, transparent communication (regular cadence, full visibility).

7. **Partner credibility** (`PartnerBadges`) - Premier / CoCo, replacing the source
   page's Microsoft / Inc-5000 awards.

8. **Contact CTA** - link to `/contact` (no duplicate inline form).

## SEO

- `pageMeta({ title, description, path: "/nearshore" })` following the `/about` pattern.
- Title and description center on nearshore Snowflake delivery, US Central time zone,
  SnowPro-certified.

## Copy rules (from style memories)

- No em dashes anywhere. Use real punctuation.
- No "you own the platform / no lock-in" filler.
- No overclaiming AI or auto-learning we do not deliver as standard.
- Snowflake is "the platform"; our deliverable is "governed, AI-ready data".
- Promise Snowflake and enterprise depth at every level, not senior-only.

## Out of scope (YAGNI)

- No new inline contact form (reuse `/contact`).
- No awards/certifications carousel beyond `PartnerBadges`.
- No CMS-backed content; copy is static in the page file, consistent with peer
  Company pages (`/about`, `/partnership`).
