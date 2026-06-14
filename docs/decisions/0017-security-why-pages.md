# 0017: New pages: Security & Trust, Why ViewNear; brand-page fix

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

Two CXO buying signals had no home on the site: **security/governance/compliance** (especially for regulated sectors) and **competitive differentiation** (build in-house vs hire a global consultancy vs partner with us). Separately, the Brand page documented the wrong fonts.

## Decision

Two new marketing pages, built from the existing page shape (`PageHero` + `Section` + `FeatureSplit`/`MetricBand` + `CtaBand` + `SectionDecor`):

- **`/security`, Security & Trust** (`app/(marketing)/security/page.tsx`): governance model; compliance posture framed **honestly as inherited from Snowflake's certified platform** (SOC 2, ISO 27001, HIPAA, PCI DSS, FedRAMP), no fake ViewNear certs; delivery practices (RBAC, lineage, PII classification, data residency, secrets); vertical compliance (FINRA/HIPAA/PCI).
- **`/why-viewnear`, Why ViewNear** (`app/(marketing)/why-viewnear/page.tsx`): differentiators + a **build-vs-partner comparison** (In-house vs Global consultancy vs ViewNear; responsive table → stacked cards) + canonical proof metrics.

Both added to the **Company** dropdown in `config/theme.ts` and the footer (`components/marketing/Footer.tsx`). Per-industry pages link to `/security` via the governance callout ([0011](0011-industry-flavor.md)).

Also: the **Brand page** (`/brand`) was corrected, it documented **Montserrat** and used a non-existent `--font-montserrat`; the real fonts are **Space Grotesk** (display) + **Inter** (body), and the accent description "orange-red" → "warm coral (reserved ~5%)".

## Consequences

- Regulated-sector buyers and "why you" objections are addressed with dedicated pages.
- Compliance claims are defensible (platform-inherited, explicitly labeled).
- The Brand page now matches the real `config/theme.ts` ([0005](0005-glacier-theming.md)).

## Alternatives considered

- **Claim ViewNear-held certifications**, rejected: untrue; we frame them as inherited from Snowflake and configured per engagement.
- **Fold differentiation into Services/About**, rejected: it's a distinct buyer question that warrants its own page and comparison.
