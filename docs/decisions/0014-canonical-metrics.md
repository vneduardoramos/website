# 0014: Canonical metric set (single source of truth)

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The numbers shown across the site contradicted each other: the home stats said **5 countries / 50+ clients**, while About's track record said **9 countries / 120+ engagements**; "40%" was used for two different metrics; NPS "90+" appeared only on Services. A CXO reading two pages would catch the inconsistency.

## Decision

Define one reconciled, non-contradictory metric story and use it consistently, with each page showing a sensible subset. Firm-level vs delivery-level bands are kept distinct so no two metrics collide:

| Metric | Value |
|---|---|
| Clients served | **50+** |
| Engagements delivered | **120+** (only ever labeled "engagements", never "clients") |
| Years in business / senior experience | **15** / **15+** |
| Specialists | **25+** |
| Countries (Americas) | **5** (Canada, USA, Mexico, LATAM, Caribbean) |
| Time to first value | **8–16 weeks** |
| NPS | **90+** |
| Faster time to first insight | **60%** (Services delivery band) |
| Pipeline reliability | **3×** (Services delivery band) |
| Lower platform run cost | **40%** (Services delivery band) |

Concrete edits: About `9 → 5` countries and the duplicate `40%` slot replaced with **NPS 90+**. The authoritative table lives in [`content-style-guide.md`](../content-style-guide.md); pages and case studies cite it.

## Consequences

- Pages no longer contradict each other; numbers are placeholders but internally coherent.
- Per-case-study outcome metrics ([0015](0015-outcome-led-case-studies.md)) are separate, study-specific figures and don't feed this firm-level set.
- When the real numbers are known, update the table in the style guide and the few pages that hardcode bands (About `trackRecord`, Services delivery band, home metric band).

## Alternatives considered

- **Leave numbers as-is**, rejected: visible contradictions undermine credibility with the exact audience the site targets.
- **Pull every band from `siteSettings`**, deferred: most bands are page-specific; a documented canonical table plus consistent hardcoded values is enough for now.
