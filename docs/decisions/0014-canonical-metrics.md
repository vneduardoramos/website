# 0014: Canonical metric set (single source of truth)

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The numbers shown across the site contradicted each other: the home stats said **5 countries / 50+ clients**, while About's track record said **9 countries / 120+ engagements**; "40%" was used for two different metrics; NPS "90+" appeared only on Services. A CXO reading two pages would catch the inconsistency.

## Decision

Define one reconciled, non-contradictory metric story and use it consistently, with each page showing a sensible subset. Firm-level vs delivery-level bands are kept distinct so no two metrics collide:

| Metric | Value |
|---|---|
| ~~Clients served~~ | ~~50+~~ **withdrawn 2026-07-26, invented** |
| ~~Engagements delivered~~ | ~~120+~~ **withdrawn 2026-07-26, invented** |
| Years of combined data & AI experience | **15+** (team experience, not company age) |
| ~~Specialists~~ | ~~25+~~ **withdrawn 2026-07-26, invented** |
| ~~Countries (Americas)~~ | ~~5~~ **withdrawn 2026-07-26**; the site publishes 2 delivery offices instead |
| Time to first value | **8–16 weeks**, as what an engagement is *scoped to* |
| ~~NPS~~ | ~~90+~~ **withdrawn 2026-07-26, invented** |
| ~~Faster time to first insight~~ | ~~60%~~ **withdrawn 2026-07-26, invented** |
| ~~Pipeline reliability~~ | ~~3×~~ **withdrawn 2026-07-26, invented** |
| ~~Lower platform run cost~~ | ~~40%~~ **withdrawn 2026-07-26, invented** |

Concrete edits: About `9 → 5` countries and the duplicate `40%` slot replaced with **NPS 90+**. The authoritative table lives in [`content-style-guide.md`](../content-style-guide.md); pages and case studies cite it.

## Consequences

- Pages no longer contradict each other. **Superseded in part on 2026-07-26:** "placeholders but internally coherent" was the mistake. Coherent placeholders read as measured results and got quoted as facts, so a claim audit deleted every invented figure rather than harmonizing it. See the canonical table in [`content-style-guide.md`](../content-style-guide.md).
- Per-case-study outcome metrics ([0015](0015-outcome-led-case-studies.md)) are separate, study-specific figures and don't feed this firm-level set.
- When the real numbers are known, update the table in the style guide and the few pages that hardcode bands (About `trackRecord`, Services delivery band, home metric band).

## Alternatives considered

- **Leave numbers as-is**, rejected: visible contradictions undermine credibility with the exact audience the site targets.
- **Pull every band from `siteSettings`**, deferred: most bands are page-specific; a documented canonical table plus consistent hardcoded values is enough for now.
