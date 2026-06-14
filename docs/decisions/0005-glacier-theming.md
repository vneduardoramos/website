# 0005: Central "Glacier" theming via CSS variables

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

We want to rebrand or retune the whole site from one place, and keep color usage disciplined rather than scattering hex values through components.

## Decision

A single brand source of truth in `config/theme.ts` (brand name, tagline, nav, socials, and the color palette as `"R G B"` triplets). The palette is emitted as **CSS variables** in `app/globals.css` (`:root`) and consumed by `tailwind.config.ts` via `rgb(var(--color-x) / <alpha-value>)`, so Tailwind alpha utilities work (`bg-primary/20`).

The **"Glacier"** system: bright white canvas, sky-blue primary (`#29B5E8`), deep-blue for legible small text (`#0B6E99`), cyan secondary, a **reserved warm-coral accent** (`#FF8A4C`, ~5% of UI), violet as a third mesh hue. Display font **Space Grotesk**, body **Inter**, mono **JetBrains Mono**.

## Consequences

- Rebrand = edit `config/theme.ts` + the mirrored `:root` block in `globals.css`.
- Components reference semantic tokens (`primary`, `primaryDeep`, `accent`, `secondary`, `success`, `purple`, `amber`), never raw hex.
- Full token/usage reference lives in [`design-system.md`](../design-system.md).
- The Brand page (`/brand`) documents the palette/fonts; it was corrected to match the real fonts in [0017](0017-security-why-pages.md).

## Alternatives considered

- **Hardcoded Tailwind colors**, rejected: no single rebrand point, no runtime theming path.
- **CSS-in-JS theme**, rejected: unnecessary; CSS vars + Tailwind cover it with zero runtime cost.
