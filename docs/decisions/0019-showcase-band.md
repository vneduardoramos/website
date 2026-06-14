# 0019: Full-bleed image showcase band

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

Services and the Industries pages were typographic and card-heavy, with no immersive, image-led moment. We wanted one **full-bleed background-image section with content overlaid** per page, a deliberate, slightly darker beat against the otherwise light "Glacier" system. No existing component did this: `FeatureSplit` puts a *framed* image beside text, and the case-study hero is full-bleed but carries no overlaid text.

## Decision

A reusable **`ShowcaseBand`** component (`components/marketing/ShowcaseBand.tsx`):

- Full-width `<section>` (the marketing `<main>` doesn't constrain width, so it's edge-to-edge with no breakout hacks); background `next/image` `fill` + `object-cover`.
- **Brand scrim** for legibility: an inline `linear-gradient` of `--color-foreground` (navy), 90°, heavy on the content side fading out, plus an optional per-instance `tintClass` overlay (`mix-blend-soft-light`) and a faint `primary` blur. White text; emphasis words use `text-secondary` (cyan), which pops on dark.
- Props: `image`, `imageAlt`, `eyebrow?`, `title`, `body?`, `bullets?`, `cta?`, `align?` (left/center), `tintClass?`. `min-h-[420px] md:min-h-[480px]`; content in `.container-page`; entrance via `Reveal`.

**On-dark button, `.btn-light`** (`app/globals.css`): the standard primary is a dark navy pill ([0018](0018-button-system.md)) that would vanish on the scrim, so the band's CTA uses a white pill with ink text (reuses the `.btn` base → same pill shape, size, and display font).

**Placements (one per page):**
- **Services** (`services/page.tsx`), after the platform `FeatureSplit`, framed as the "why now" beat (image `photos/network.jpg`).
- **Industries listing** (`industries/page.tsx`), after the card grid (image `photos/analytics.jpg`).
- **Each industry detail** (`industries/[slug]/page.tsx`), before the governance callout, background = that sector's photo `industries/${slug}.jpg`, eyebrow/`tintClass` from the [flavor](0011-industry-flavor.md) (`flavor.pattern` / `flavor.glow`). The engagement `FeatureSplit` on that page was repointed to a generic photo (`photos/analytics.jpg`) so the sector photo isn't shown twice.

## Consequences

- One immersive, on-brand image moment per page; reusable for future pages.
- Introduces a **darker** section into a light system, intentional and bounded to one band per page; the navy scrim guarantees text contrast over any photo.
- Added `.btn-light` to the button system (documented in [`design-system.md`](../design-system.md)).
- Verified: `tsc` clean, `npm run build` green (70 static pages), and the band reads legibly edge-to-edge on desktop + mobile across Services, Industries, and industry-detail pages.

## Alternatives considered

- **Edge-to-edge split / contained image card**, rejected: the user chose the full-bleed background treatment for maximum impact.
- **Reuse the sector photo in both the FeatureSplit and the band on detail pages**, rejected: the same image twice looks lazy; the FeatureSplit now uses a generic shot.
- **Keep the dark navy button on the scrim**, rejected: poor contrast; added `.btn-light` instead.
