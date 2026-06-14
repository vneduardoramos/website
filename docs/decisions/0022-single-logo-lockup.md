# 0022: Single official logo lockup

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The logo was a set of three PNG variants (`viewnear-logo-dark.png`, `viewnear-logo-light.png`, `viewnear-mark.png`) selected via a `variant` prop. The admin sidebar called the default (white) variant on a light surface, so its logo was effectively invisible. The brand provided one official lockup, "viewnear | data + ai" (mark + wordmark + slogan).

## Decision

Use a **single lockup** at `public/assets/viewnear-logo.png` (navy, intrinsic 1998×251 ≈ 8:1) for all placements. `components/marketing/Logo.tsx` renders just this asset:

- `height` prop drives size; width derives from the ratio. `variant` is kept in the prop type for backwards compatibility but no longer changes the asset.
- The three old PNGs were deleted; `config/theme.logo` repointed to the new file.
- Used in Nav (`height 25`), Footer (`32`), admin sidebar (`24`).

## Consequences

- One asset to maintain; the navy lockup works on every (light) surface the site uses.
- Fixes the previously-invisible admin sidebar logo.
- No dark-background logo placement exists today; if one is added, a light/white version would be needed.

## Alternatives considered

- **Keep light/dark/mark variants**, rejected: unused complexity; the site is uniformly light and the brand supplied one lockup.
