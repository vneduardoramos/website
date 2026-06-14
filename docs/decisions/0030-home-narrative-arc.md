# 0030: Home page narrative arc (customer = hero, ViewNear = guide)

- **Status:** Active
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

The home page was a strong **capability tour** ("here's everything we build, on Snowflake") but flat as a *story*: ViewNear was the hero of every sentence, there was no problem/stakes or "why now" tension, no before→after transformation, and the "governed platform + Cortex" message repeated ~4× (hero diagram, two FeatureSplits, Why-Snowflake band) rather than progressing. For a credibility/brand goal and a mixed economic + technical audience, the page should make the **customer the hero** and ViewNear the **guide**.

## Decision

Restructure the home page into a narrative arc, reusing copy that already existed on About (the thesis) and Services (de-risk + value-by-horizon):

1. **Hero** — hook (unchanged copy; the platform-diagram visual from [0029]).
2. **Problem / "why now"** (new) — "Execution got cheap. Knowing what to build didn't." + three "where it stalls" cards (vendor sprawl, data you can't trust, AI stuck in pilots). Promotes the About origin thesis; supplies the missing tension.
3. **The path** — the two FeatureSplits reframed **customer-first** ("Data your whole company can trust" / "AI your teams actually use") instead of "we build…".
4. **What we do** (ServicesGrid) → **How we do it** (Methodology).
5. **De-risked by design** (new) — POC-first, you stay in control, value from sprint one, you own it. Quiets the economic buyer's "big bet" fear (from Services `runPhases`).
6. **Why Snowflake** + **Partnership** + **metrics** — the guide's credibility (kept).
7. **Where this takes you** (new) — the transformation, by horizon (First 90 days → 6–12 months → 18+ months), from Services `impactByPhase`.
8. **Proof** (illustrative case studies + testimonials) → **FAQ**.
9. **Stakes CTA** — "Make this the quarter your data starts paying off." (was a generic close).

New beat data lives in `app/(marketing)/page.tsx` (`STALLS`, `DERISK`, `HORIZONS`); all sections reuse existing primitives (`Section`, `SectionHeading`, `.pill-chip`, cards) and the Glacier palette.

## Consequences

- The page reads as an arc — hook → problem → path → plan → de-risk → credibility → transformation → proof → close — serving the CFO/COO (problem/stakes/transformation) and the technical evaluator (platform/method/de-risk) at different beats.
- The page is longer; each added beat is compact and on a distinct background for rhythm. "Why Snowflake" is now the most trimmable section if length becomes an issue (it overlaps the reframed path beats).
- Copy is truthful and consistent with the credibility rework ([0028]); proof stays illustrative until real content lands.

## Alternatives considered

- **High-impact beats only** (problem + transformation) — lighter, but left the "we build…" framing and repetition.
- **Copy reframe only** — no new beats; would not add the missing tension or payoff.
