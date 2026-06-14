# 0012: Heading `text-balance` + equal-height card grids

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

Two recurring layout defects: headings wrapped awkwardly on mobile (orphaned single words, ragged display headings, reported as "titles overflowing"), and card grids went ragged (cards of unequal height within a row) on list pages.

## Decision

Two site-wide conventions:

1. **Balanced headings.** `.text-balance { text-wrap: balance }` and `.text-pretty { text-wrap: pretty }` utilities added to `app/globals.css`, with `text-balance` applied to the heading elements of the shared components: `SectionHeading`, `PageHero`, `home/Hero`, `FeatureSplit`, and the industry/case-study detail `h1`s. New headings should follow suit.
2. **Equal-height cards.** Multi-column card grids use `auto-rows-fr` (at the breakpoint where they become multi-column) and the cards fill their cell with `flex h-full flex-col`. Shared cards (`CoverCard`, `CaseStudyCard`) carry `h-full`; inline card grids add `md:auto-rows-fr` + `h-full`.

## Consequences

- Mobile heroes no longer orphan words; list grids align cleanly.
- The convention is documented in [`design-system.md`](../design-system.md) so new pages stay consistent.
- Explicit utilities (rather than relying on Tailwind's built-in `text-balance`) ensure the behavior applies to the custom display sizes regardless of Tailwind version.

## Alternatives considered

- **Manual `<br>`/non-breaking hints per heading**, rejected: brittle and per-string; `text-wrap: balance` is automatic.
- **Fixed card min-heights**, rejected: breaks at different content lengths/breakpoints; `auto-rows-fr` adapts.
