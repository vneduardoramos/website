# 0029: Hero visual → branded "governed Snowflake platform" diagram

- **Status:** Active (supersedes [0021](0021-hero-visual.md))
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

The hero's right-side visual ([0021](0021-hero-visual.md)) was a screenshot of a generic AI-chat UI inside a browser frame labeled `app.viewnear.io/analytics`. That implied ViewNear ships a **proprietary analytics product** — but ViewNear is a **Snowflake services consultancy, not a product company**. It misrepresented the offering (the same "presenting something as ours when it isn't" issue the credibility audit, [0028], fixed in the content), wasn't recognizably ViewNear's or Snowflake-specific, and gave the technical reader nothing.

## Decision

Replace `HeroScreenshot` with **`components/marketing/home/HeroDiagram.tsx`** — a branded, in-code data-flow diagram (no external asset):

A genuine connected-node **flow visualization** (not card rows): three circular icon source nodes (Warehouses, Apps & APIs, Files) fan via **curved gradient connectors** into a **glowing Snowflake hub** (mark + ring + "One governed platform" / "Governance · Lineage · Security"), then fan out to three output nodes (Dashboards, Cortex AI, Data apps). A subtle animated **current** (`.hero-flow` dashed-stroke keyframe in `globals.css`, auto-disabled under reduced motion) runs along the paths. Implemented as a **single viewBox-scaled `<svg>`** (`viewBox="0 0 440 380"`) so geometry stays aligned and crisp and the whole diagram scales proportionally on mobile rather than reflowing. Reuses the icon set in `home/Icons.tsx` (rendered as nested `<svg>`) and the Glacier palette via `rgb(var(--color-*))` gradients + Tailwind `fill-*`/`stroke-*`. Keeps the soft glow, the wrapper's `animate-float`, and the honest "Real people. Senior delivery. / SnowPro-certified" team-card overhang.

Deleted `components/marketing/HeroScreenshot.tsx` and `public/assets/images/hero-app.png`.

## Consequences

- The hero is **honest for a services firm** (shows the approach they deliver, native on Snowflake) and finally serves the technical reader.
- Pure presentational/SVG-and-HTML; themeable, no image to source, crisp at any DPI.
- Tuning knobs: node labels (`SOURCES`/`OUTPUTS` arrays), the center node copy, connector style, team-card placement.

## Alternatives considered

- **Real Snowflake-native screenshots** (Snowsight/Streamlit/Cortex) — most concrete, but needs real assets to source.
- **People/delivery photography** — warmer but less specific to the offering.
- **Keep a screenshot, drop the fake `app.viewnear.io` chrome** — lighter, but still a screenshot to source and less differentiating than the diagram.
