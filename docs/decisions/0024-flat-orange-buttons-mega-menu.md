# 0024: Pastel buttons + mega-menu navigation

- **Status:** Superseded in part (button fill); see Update below
- **Date:** 2026-06-07   **Last updated:** 2026-07-05 (button fill: pastel → solid royal-blue)

> **Update (2026-07-05):** the pastel-sky button fill described below was superseded by a **solid royal-blue `#2C53C8` fill with white text** (≈6.6:1 AA); see `docs/CHANGELOG.md` and `docs/design-system.md`. The `--color-pastel*` tokens were removed. The mega-menu decision still stands; this record is kept for history.

## Context

Two requests: rework the primary button look and adopt a **"big menu"** for the nav. Built via a multi-agent workflow; the button treatment then iterated once more on feedback.

## Decision

**Buttons, soft pastel, rounded rectangle, deep-blue label.** `.btn-primary` is a **flat pastel-sky fill** (`--color-pastel` `#C4E4F7`) with **deep-blue text** (`text-primaryDeep`, not black) and a faint primary hairline (`border rgb(primary/0.28)`) so it reads as a button on the white canvas. Shape moved from a **full pill → rounded rectangle**: base `.btn` is `rounded-xl`, `.btn-lg` `rounded-2xl`, `.btn-sm` `rounded-lg`. Hover deepens the pastel (`--color-pastel-deep` `#ADD8F2`) + 1px lift; active presses in. No gradient. Pastel tokens live in `globals.css` `:root` only (button-specific; not Tailwind utilities). This **supersedes the navy-gradient fill from [0018](0018-button-system.md)**; `btn-ghost`/`btn-light` are unchanged but now share the rounded-rectangle radius.

**Nav, full-width mega-menu.** `components/marketing/Nav.tsx` desktop dropdowns became a **full-width mega-menu**: parents (`Company`, `Industries`, `Services`, `Resources`) open a large panel (`absolute left-0 right-0`, anchored via a `static` `li` in the now-`relative` `nav`; rounded-2xl, `bg-surface/95`, shadow, backdrop-blur) with a `sm:grid-cols-2 lg:grid-cols-3` grid of link cards (label + one-line `NAV_DESCRIPTIONS`) and a featured tile (`NAV_FEATURED`: Company→Partnership, Services→Platform, Industries→Financial Services, Resources→Case Studies). The panel is **state-controlled** (`openMenu` in `Nav.tsx`): opens on hover/focus, closes on mouse-leave (with a **~180ms close-delay** so moving the cursor across the gap onto the full-width panel doesn't dismiss it), Escape, link click, and **on route change** (`usePathname` effect), CSS `:hover`/`:focus-within` alone kept it open after client-side navigation. Childless items (Home, Platform) stay plain links; mobile `<details>` overlay unchanged.

## Consequences

- Primary CTAs are soft, light, and on-brand (sky-blue family) with a legible deep-blue label; buttons are rounded rectangles, not pills.
- The pastel relies on its hairline + shadow to separate from the white background (a flat tint alone would disappear).
- `--color-orange` token remains (unused legacy alias of amber) from the earlier orange iteration.
- Keep `NAV_DESCRIPTIONS`/`NAV_FEATURED` in sync with `theme.nav`.
- Verified: `tsc` clean, build green (80 pages), screenshots confirm pastel rounded-rect buttons (legible) and the mega-menu panel.

## Alternatives considered

- **Flat logo-orange (`#FFA000`) pill, navy-ink text**, built first, then rejected (too loud; wanted a softer pastel and a rectangle).
- **Near-black/navy text**, rejected for the pastel; deep-blue (`primaryDeep`) is softer and still legible (~4:1 on the pastel).
- **Full pill**, replaced by a rounded rectangle per the brief.
- **Overlay/hamburger desktop menu**, not chosen; the full-width mega-menu keeps top-level items visible.
