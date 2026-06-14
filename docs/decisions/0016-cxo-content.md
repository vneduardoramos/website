# 0016: CXO content on Services + About

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The site read feature-led where a C-level buyer evaluates outcomes, risk, and commercials. Gaps: no value-by-horizon framing, no view of how an engagement is run/de-risked, thin engagement-model/commercial detail, and no surfacing of team credentials.

## Decision

Enhance existing pages (no new top-level pages here; see [0017](0017-security-why-pages.md) for those):

- **Services** (`app/(marketing)/services/page.tsx`):
 - "**What changes, and when**", value by horizon (first 90 days / 6–12 months / 18+ months).
 - "**Delivery you can govern**", the engagement is de-risked: fixed 8–16 week arc, steering & transparency, POC-before-build gates, built-to-hand-over; with an inline link to `/security`.
  - Engagement models gained a "best for" line each and a "**what drives cost**" note.
  - An inline link to `/why-viewnear`.
- **About** (`app/(marketing)/about/page.tsx`): `trackRecord` reconciled per [0014](0014-canonical-metrics.md); team framed as senior / SnowPro-certified with a credentials chip row (Select-tier partner, certified engineers, partner-of-the-year award).

## Consequences

- Services answers the executive's "what do I get, when, and how is the buy de-risked?" questions.
- About leads with credibility signals a CXO scans before shortlisting.
- Copy follows the outcome-led voice in [`content-style-guide.md`](../content-style-guide.md).

## Alternatives considered

- **Publish hard pricing**, rejected: engagements are scoped per client; a qualitative "what drives cost" note is honest without committing to numbers.
- **Leave methodology on the home page only**, rejected: the Services page is where a buyer looks for delivery detail.
