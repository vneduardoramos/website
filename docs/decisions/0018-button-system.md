# 0018: Refreshed button system

- **Status:** Active, button *fill* superseded by [0024](0024-flat-orange-buttons-mega-menu.md) (flat logo-orange); the shape/size/`btn-ghost`/`btn-light` system here is unchanged
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The original buttons looked dated: full-pill shape, a flat **vertical** sky→deep gradient, and a large soft **glow** shadow. Iterating on feedback: a diagonal sky→deep gradient read **too blue**; a flat solid-navy version was liked for its **dark color** but its `rounded-xl` corners looked "squared," and it wanted **some gradient in ViewNear's colors**.

Buttons are defined once in `app/globals.css` (`.btn`, `.btn-primary`, `.btn-ghost`) and used everywhere (Hero, `CtaBand`, `FeatureSplit`, Nav, forms, admin login), so a single CSS change restyles the whole site.

## Decision

A crafted button system: **dark base, brand-blue gradient, fully rounded.**

- **Primary fill:** **dark navy base** (`rgb(var(--color-foreground))`, `#0F2530`) with a **ViewNear-blue gradient** layered on top, a sky-blue radial sheen in the top-left (`radial-gradient(125% 125% at 0% 0%, primary/0.45, transparent 55%)`) fading into a navy→deep-blue diagonal (`linear-gradient(135deg, foreground, primary-deep)`). Reads dark, with the brand color present rather than a loud all-blue fill. White text.
- **Shape:** **fully rounded pill** (`rounded-full`) at every size, smooth, not squared.
- **Bigger:** default `px-6 py-3` / `text-[0.95rem]`; `.btn-lg` `px-8 py-4` / `text-base` (Hero + `CtaBand`); `.btn-sm` `px-4 py-2` / `text-sm`. Sizes inherit the pill radius (padding/text only).
- **Depth:** 1px **inset top highlight** + **layered low shadows** (no soft glow). Hover lifts 1px + `brightness(1.22)` with a deep-blue-tinted shadow; **active** presses in.
- **Ghost:** quiet `surface` pill with a hairline that firms to `foreground/35` on hover, neutral, not blue.
- **Typography:** `.btn` uses `font-display` (Space Grotesk), and the `Nav` header carries `font-display` too, so the menu and buttons match the headings' brand voice (they were Inter, like body copy). Space Grotesk weight 400 was added so lighter menu items render.
- Focus ring `ring-primary/50` with `ring-offset-background`.

## Consequences

- Every CTA updates from one place; no per-component button styles.
- CTAs read **dark** with a recognizable ViewNear-blue gradient; the palette's sky-blue still carries links/accents.
- Motion respects the global `prefers-reduced-motion` rule in `globals.css`.
- Reference/usage in [`design-system.md`](../design-system.md) (Buttons).
- Small admin utility buttons (delete link, leads "Update", Nav dropdown toggles, `SignOutButton`) are intentionally **not** part of `.btn`.

## Alternatives considered

- **Vertical / diagonal all-blue sky→deep gradient**, rejected: too blue.
- **Flat solid navy, no gradient, `rounded-xl`**, rejected: corners read squared and it lacked brand color; this decision keeps its dark base but adds the brand gradient and a pill radius.
- **Solid deep brand blue (`primaryDeep`)**, rejected: still predominantly blue.
- **Animated sheen via a `::before` overlay**, rejected: risks painting over the label given arbitrary children; a layered `background-image` is safe.
