# Home page redesign: people-first spine

Date: 2026-06-14

## Context
The home page today is 15 stacked sections telling a *platform-and-methodology*
story (data chaos → governed Snowflake foundation → AI → method → certified
partner). It is long and repetitive in the credibility register: partner badges
and "Premier · CoCo · SnowPro" restate across the hero, a "de-risk" card block,
a "Proof & Trust" panel, and a metric band. The team as high-caliber *people*
barely appears, and the thing the business most wants to sell, two kinds of
expert on one team (consultants who know the vertical + engineers deeply versed
in Snowflake and its ecosystem), is absent.

This redesign re-centers the narrative on the team as the second beat, shows
technical strength concretely, keeps the credibility badges, and lightens the
page by consolidating the three overlapping trust sections.

Approved direction: **Approach C** (rebuild the spine around people) with the
**team section laid out as "B — stacked"** (full-width faces band on top, a
technical-strength strip below).

## New page spine
1. **Hero** — keep (badges stay).
2. **The problem / Why now** — keep ("Execution got cheap. Knowing what to build didn't." + 3 stalls).
3. **🆕 Who you work with (team beat)** — ADD. New core section, layout B (see below).
4. **Build-vs-buy** — MOVE up from old position ~#11 to right after the team beat. Reframed as a team argument: a ready, certified team in 8–16 weeks vs. 6–12 months hiring one in-house.
5. **What we build — Foundation** — keep (FeatureSplit).
6. **What we build — Applied AI** — keep (FeatureSplit).
7. **Services grid** — keep.
8. **Industries strip** — keep (reinforces the vertical-consultant half).
9. **How we work, de-risked** — MERGE: fold the 4 "de-risk" cards into the Methodology section so there is one engagement/low-risk block instead of two.
10. **Proof — featured case study + client logo bands** — keep.
11. **Proof & credentials (consolidated)** — MERGE the indigo "Proof & Trust" panel and the standalone metric band into ONE block: badges + key stats + the few "why Snowflake" points, stated once.
12. **Transformation — Horizons** — keep (trim if it reads long).
13. **FAQ → Latest posts → Final CTA** — keep.

Net: adds the team beat yet gets shorter (three trust sections → ~two).

## The new team section (layout B)
A new component (e.g. `components/marketing/home/TeamBeat.tsx`), placed as beat #3.

- **Eyebrow / heading:** "Who you work with" / "Two kinds of expert, one team."
- **Faces band (top, full width):** the leadership headshots from `getTeam()`
  (`lib/queries.ts:146`; same source as `/about`), rendered as a centered row;
  links to `/about` for the full team. Reuse the existing color headshot
  treatment (see `components/marketing/TeamCard.tsx` / `LeadershipStrip.tsx`).
- **Pairing statement:** consultants who know your industry, paired with
  engineers deeply versed in Snowflake; the people who scope it deliver it.
- **Technical-strength strip (below, on the dark `panel-dark`/indigo treatment):**
  - Snowflake-native ecosystem mastery: Cortex, Horizon, Openflow, Snowpark,
    Iceberg, dbt, Streamlit (chips/labels; reuse the stack content added to the
    services page for consistency).
  - Credentials: SnowPro-certified, Snowflake **Data Superhero** (real, see
    `prisma/seed/data.ts` / news), Premier + CoCo Catalyst badge artwork from
    `public/assets/images/certs/`.
- Mobile: faces wrap/scale to a tidy grid; the strip stacks under the band.

## Merges / removals (the de-bloat)
- De-risk cards → absorbed into `components/marketing/home/Methodology.tsx`.
- Old indigo Proof & Trust panel + `MetricBand` → one consolidated proof block
  (keep badges + the strongest stats + a trimmed set of "why" points).
- No credibility content is lost; it is stated once instead of three times.

## Critical files
- `app/(marketing)/page.tsx` — reorder sections, mount the new team beat, move build-vs-buy, replace the two trust sections with the consolidated block, fold de-risk out.
- `components/marketing/home/TeamBeat.tsx` — NEW (layout B).
- `components/marketing/home/Methodology.tsx` — absorb the de-risk points.
- Reuse: `getTeam()` (`lib/queries.ts`), `TeamCard`/`LeadershipStrip`, the certs in `public/assets/images/certs/`, `MetricBand` (`components/marketing/Blocks.tsx`) inside the consolidated block.

## Constraints (house style)
- No em dashes in copy. No overclaiming (describe the iterative delivery model; don't claim auto-learning AI). Don't call the deliverable "the platform" (Snowflake is the platform). Sell service quality and Snowflake/enterprise depth at every level (don't promise senior-only).

## Verification
- `npm run typecheck` and `next lint` clean.
- Home page renders 200; new team beat shows leadership faces + ecosystem + Data Superhero.
- Mobile (390px) screenshot: faces band and technical strip read cleanly; badges still present.
- Confirm the three old trust sections are now one and the page scroll is shorter.
