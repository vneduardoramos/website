# 0010: Design screenshot harness with scroll-reveal

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

We needed a repeatable way to review the visual state of every page (desktop + mobile) during design work. A naive full-page Playwright capture showed large **empty bands**: most sections are wrapped in `Reveal` (`components/marketing/Motion.tsx`), which starts at `opacity: 0` and only animates in when its `IntersectionObserver` fires on scroll. A full-page screenshot never scrolls, so below-fold content stayed invisible, making the harness blind to most of every page.

## Decision

`.design/shoot.js` (Playwright + Chromium) captures all routes at desktop (1440) and mobile (390). Before each `fullPage` screenshot it **scrolls the page top-to-bottom in steps, then back to top**, so every `Reveal` triggers and the capture reflects what a real user sees. Output goes to `.design/<outDir>` (e.g. `baseline`, `current`).

Usage: `node .design/shoot.js current` (dev server must be running on :3000).

## Consequences

- Screenshots are now a trustworthy review/diff tool against `.design/baseline`.
- `.design/` is a dev-only tool directory (not shipped, not imported by the app).
- The empty-band artifact is understood: if a future capture shows one, it's a reveal-timing edge, not a real layout bug, verify with a focused viewport clip.

## Alternatives considered

- **Disable `Reveal` for screenshots**, rejected: then the capture wouldn't match production rendering.
- **Per-element waits**, rejected: scroll-through is simpler and covers every section uniformly.
