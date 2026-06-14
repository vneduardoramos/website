# 0021: Hero visual: product screenshot in a browser frame + team card

- **Status:** Superseded by [0029](0029-hero-platform-diagram.md)
- **Date:** 2026-06-07   **Last updated:** 2026-06-08

> The product-screenshot hero implied a proprietary product ViewNear doesn't sell; replaced with a branded platform diagram in [0029](0029-hero-platform-diagram.md). The float + team-card patterns described below carry over.

## Context

The home hero originally used a synthetic, all-CSS analytics mockup (`DashboardMockup`). We wanted the hero to show a **real product screenshot**, feel more substantial, and signal that **real people** stand behind the work.

## Decision

`components/marketing/HeroScreenshot.tsx` is the hero's right-side visual (swapped in for `DashboardMockup`, which is retained in the repo, unused):

- **Browser-window frame** (soft glow, rounded border, top bar with three dots + `app.viewnear.io/analytics`) around a real screenshot at `public/assets/images/hero-app.png`, cropped to fill via `object-cover` + a slight `scale`.
- **Front-facing** (the earlier `perspective/rotateY` tilt was removed) and **enlarged** (wider hero image column, larger max-width).
- **Gentle float**, `animate-float` (new keyframe in `tailwind.config.ts`) on the wrapper; respects reduced motion.
- **Team-presence card** overhanging the frame: overlapping team headshots (from `getTeam()`, monogram fallback) + the label **"Real people. Senior delivery."** / "SnowPro-certified team". No live/online cue (a pulsing "· LIVE" dot was tried and removed, it implied live agents).
- `team` is threaded `page.tsx` → `Hero` → `HeroScreenshot`.

## Consequences

- The hero shows a concrete product + a human team, more credible than a synthetic chart.
- Reusable: the frame/float pattern can host other screenshots; `team` is optional.
- Tuning knobs are one-liners: crop (`scale-[…]`/`object-position`), float distance/speed, card placement/copy.

## Alternatives considered

- **Keep the synthetic mockup**, rejected: less credible than a real screenshot.
- **Angled/tilted screenshot**, tried, then changed to front-facing per preference.
- **"Live agents" presence (pulsing dot + "LIVE")**, rejected: implied real-time online agents; replaced with a neutral credential line.
- **Crop vs. show-whole**, chose fill/crop so it reads as the app running in a browser.
