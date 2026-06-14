# 0023: Partnerships, certifications & IA expansion

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

ViewNear's partner story was scattered (a home section, About chips, a footer line, an FAQ) and used the outdated **"Select-tier Services Partner"** wording. The real status is two certifications, **Snowflake Premier Partner** and **Snowflake CoCo Preferred Partner**, with no page that owns the partnership narrative. Several conventional consultancy pages were also missing.

## Decision

**Certifications:** replace "Select-tier Services Partner" everywhere with **Snowflake Premier Partner** and add **Snowflake CoCo Preferred Partner**. A new `components/marketing/PartnerBadges.tsx` is the single source (`CERTIFICATIONS`), with `chips` and `cards` variants; used on home (Why-Snowflake band), About, the Partnership page, and Team. Seed copy (`prisma/seed/data.ts`: `partnership` points, the partner news item, the partner FAQ), `why-viewnear`, `about` credentials, the Hero chip, and the footer line were updated.

**Eight new pages** (`app/(marketing)/…`, reusing the component kit):
- **/partnership**, certs centerpiece (`PartnerBadges cards`), "what it unlocks" (co-sell, procure Snowflake, consumption-based, not licenses, priority roadmap, certified delivery), certified-vs-generalist split, award.
- **/solutions**, outcome use-cases (Migrate, Cortex AI & agents, Governance, Embedded analytics) as alternating `FeatureSplit`s + a sector chip row.
- **/approach**, reuses the `Methodology` component + engagement-governance + value-by-horizon (de-risking).
- **/team**, `getTeam()` + `TeamCard` + `PartnerBadges` + "how we staff" note.
- **/pricing**, engagement models + "what drives cost" + value-by-horizon (no published sticker pricing).
- **/faq**, grouped FAQ (partnership, delivery, commercials, security).
- **/terms**, Terms of Service prose (mirrors `privacy`).
- **/resources**, hub aggregating latest Case Studies / Blog / News + Videos & Learning callouts.

**Nav/footer (no new top-level items → no 1024px overflow):** Company gained **Team** + **Partnership**; **Services became a dropdown** (Overview · Solutions · Approach · Pricing); Resources gained **All resources** + **FAQ**; the footer is now four columns (Company · Services · Industries · Resources) + a **Terms** link in the legal row.

## Consequences

- The partnership/certs story is consolidated and consistent; "Select-tier" is gone (grep-verified), both certs appear site-wide.
- Page count up to 80 static routes; `tsc` clean, build green.
- Services is now a hover-dropdown (parent isn't a link; "Services overview" is the `/services` child), consistent with Company/Industries/Resources.
- Per-solution detail pages (`/solutions/[slug]`) and per-cert detail are deferred.

## Alternatives considered

- **Keep certs as scattered sections**, rejected: no canonical home; inconsistent wording.
- **New top-level nav items for the pages**, rejected: would overflow the bar at 1024px; grouped into existing dropdowns and made Services a dropdown instead.
- **Publish fixed pricing**, rejected: engagements are scoped per client; `/pricing` explains models + cost drivers instead.
