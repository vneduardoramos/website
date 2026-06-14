# 0011: Per-industry "flavor" system

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The industry detail page (`app/(marketing)/industries/[slug]/page.tsx`) was fully generic, every sector rendered identical hardcoded metrics, the same engagement bullets, and the same copy. We wanted each industry page to have its **own subtle, on-brand identity** reflecting its nature, plus sector-specific content.

## Decision

A config-driven "flavor" map keyed by slug in `components/marketing/industries/flavor.tsx` (`INDUSTRY_FLAVOR` + `DEFAULT_FLAVOR`, accessed via `getFlavor(slug)`), mirroring the `tierMeta` pattern on the Services page. Each flavor declares:

- a **sector icon** (inline SVG defined in the same file),
- an **accent hue** drawn from the existing palette (`primaryDeep`, `secondary`, `success`, `purple`, `amber`, `accent`), full static Tailwind class strings (`tile`/`bar`/`glow`/`text`) so JIT keeps them,
- a **decor texture** echoing the sector (`grid` ledger, `flow` vitals, `swoosh` fields, `dots` SKUs, `blobs` warmth, `mesh` human) via `SectionDecor`,
- **tailored `metrics` and `bullets`**, and a one-line **`compliance`** note.

The detail page consumes the flavor for a custom hero (icon + sub-sector eyebrow + glow), the engagement `FeatureSplit` bullets, the metric band, accent bars on challenge cards, and the per-industry governance callout.

## Consequences

- Six visually distinct, on-brand industry pages with no per-page bespoke code.
- "Subtle" is enforced by keeping the rest of the page neutral Glacier, hue appears only on the icon tile, eyebrow, glow, accent bars, and the compliance note.
- The `compliance` field feeds the governance callout linking to `/security` ([0017](0017-security-why-pages.md)).
- Adding/retuning a sector = edit one flavor entry. Reference in [`design-system.md`](../design-system.md).

## Alternatives considered

- **Recolor the whole page per industry**, rejected: breaks the disciplined Glacier palette and the reserved-coral rule.
- **Store flavor in the DB**, rejected: it's presentational config, not editorial content; code keeps it type-safe and Tailwind-JIT-friendly.
