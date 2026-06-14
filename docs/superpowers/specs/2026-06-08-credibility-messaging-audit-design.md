# Design: Credibility & Messaging Audit + Rework

- **Date:** 2026-06-08
- **Status:** Approved (brainstorm); pending implementation plan
- **Project:** ViewNear marketing site (`/Users/eduardoramos/Documents/VN`)

## Context

The site's technical/SEO/CMS/security gaps were already closed this session (see ADRs 0028 and the 2026-06-08 changelog). The remaining high-leverage gap is **content, messaging, and credibility**. This audit evaluates and reworks the site's copy and structure so a sophisticated buyer trusts ViewNear's expertise and track record.

## Goals & constraints

- **Primary site goal:** credibility / brand (authority-first). The inquiry is a downstream effect, not the focus; CTAs stay confident and low-pressure.
- **Audience (mixed):** the economic buyer (CFO/COO/CEO) **and** the technical evaluator (Head of Data, VP Analytics/Eng, CTO). Every credibility-critical page must serve both.
- **Proof stance — lean on what's real.** Build credibility on verifiable assets: Snowflake **Premier** + **CoCo Preferred** partner status, **SnowPro** certifications, the **Snowflake Summit 2026 "CoCo Global Partner Momentum" keynote**, the delivery methodology, and governance/security posture. The named clients, case studies, and testimonials are currently **placeholders (user-owned, to be replaced)** — restructure or soften those sections so **nothing reads as a false claim**, and flag each spot where real proof should later slot in.
- **Out of scope:** fabricating proof; technical/SEO re-audit (already done); funnel/conversion-rate optimization mechanics (goal is brand, not lead-gen tuning).

## The credibility rubric

Each in-scope page is scored ✅ / ⚠️ / ❌ on six lenses:

1. **5-second value prop** — is the page's point instantly clear?
2. **Dual-reader** — concrete substance for the economic buyer *and* the technical evaluator.
3. **Real, specific proof** — claims backed by verifiable assets; no implication that a placeholder client is a real engagement.
4. **Trust at decision points** — certifications, partnership, security/governance signals sit near the claims and CTAs that need them.
5. **Differentiation** — "why ViewNear vs. a generalist / vs. build-in-house" is explicit and convincing.
6. **Narrative & CTA** — the page flows logically to one clear, brand-appropriate next step.

## Dual-persona reads (Opus 4.8)

Over the five credibility-critical pages, run two skeptical readers as subagents:

- **CFO/COO lens:** risk, outcomes, ROI framing, "can I trust this firm with a significant bet?"
- **Head of Data/Eng lens:** architecture credibility, Snowflake depth, governance, certifications, absence of fluff.

Each captures what its reader **doubts, distrusts, or finds missing**.

**Model directive:** all agents and subagents in this work run on **Opus 4.8** (`model: "opus"` on every Agent/subagent call).

## Scope

- **Rubric pass (read + score, ~13 pages):** home, about, services, solutions, approach, industries (+ one industry detail), case-studies, partnership, security, pricing, platform, contact, faq.
- **Deep persona reads (5 pages):** home, about, services, partnership, security.
- **Rework (5 pages):** home, about, services, partnership, security — copy + structure for P0/P1 findings.

## Process

1. Read the in-scope pages (and reuse existing project context).
2. Run the two persona subagents (Opus 4.8) over the 5 credibility-critical pages.
3. Score every in-scope page against the rubric.
4. Write a **prioritized findings report** to `docs/` (page-by-page: score, gaps, recommendations, P0/P1/P2).
5. Rework the 5 credibility-critical pages for the P0/P1 findings, honoring the proof stance.
6. Verify.

## Deliverables

- **Findings report** (`docs/`) — page-by-page rubric scores + prioritized recommendations + a "real-proof slot map" (where to drop real assets later).
- **Reworked copy/structure** on home, about, services, partnership, security.
- This design spec; then a writing-plans implementation plan.

## Verification

- `npx tsc --noEmit` and `npm run lint` clean; `npm run build` (or dev-server route checks) green.
- Screenshot each reworked page (1280 desktop + 390 mobile) and confirm the messaging reads correctly for both audiences.
- **Proof-integrity check:** grep/scan the reworked pages to confirm no placeholder client is presented as a real, named engagement; every softened spot is logged in the slot map.
- Reworked pages still serve both the economic and technical reader (spot-check against the rubric).

## Open items / dependencies

- Real proof (client logos, case studies, named testimonials, quantified outcomes) is **user-owned** and blocks full credibility; the slot map makes swapping it in turnkey.
- Keep the site noindex until real proof lands (carried over from ADR 0028).
