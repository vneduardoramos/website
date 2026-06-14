# 0027: Cut-corner "tag" shape language (eyebrows, pills, chips)

- **Status:** Active
- **Date:** 2026-06-08   **Last updated:** 2026-06-08

## Context

The section eyebrow / kicker (the small label above headings, e.g. "WHAT WE OFFER", "PROOF") used the generic AI/SaaS-template look (`font-mono uppercase tracking-[0.2em] text-primaryDeep`), the hero variant `.chip` was a plain rounded pill (with a colored dot), and the `Pill` component + various chip rows (tools, sector filter, blog tags, hero capability row) were the equally generic `rounded-full` pill — several with leading dots. The brand wanted these to feel bespoke. The text is unchanged.

## Decision

Restyle the eyebrow as a **cut-corner tag**: a small inline shape with one clipped corner (`clip-path`), a faint accent-tint fill, and a 1px accent hairline. Implemented once in `app/globals.css` so every consumer updates together.

- **`.eyebrow` and `.chip`** share one rule (kept monospace caps). The hairline is an `inset` box-shadow, which `clip-path` crops along the notch, so the whole thing is a single element with no extra markup.
- **Themeable** via a `--eyebrow-accent` custom property (default `--color-primary-deep`). Set it on any ancestor to retint all eyebrows inside.
- **`.eyebrow--invert`** modifier for dark scrims (white fill/hairline/label), used by `ShowcaseBand`.
- **Per-sector hue:** `IndustryFlavor` gained an `accentVar` (e.g. `--color-amber`); `app/(marketing)/industries/[slug]/page.tsx` wraps its body in `style={{ "--eyebrow-accent": "var(<accentVar>)" }}`, so every eyebrow on an industry page (including the hero `pattern`) takes the sector hue. Hues match the [design-system flavor table](../design-system.md).

Extend the same clipped-corner silhouette to the rest of the chip family so the whole UI shares one shape language (all defined in `app/globals.css`):

- **`.pill-tag`** — the hero capability row (`home/Hero.tsx`): neutral `surface2` fill, sentence-case, larger padding, no dot.
- **`.pill-chip`** — the `Pill` component (`ui.tsx`, used for tools, the case-studies sector filter, blog tags, the news `kind`, life-at-viewnear skills) and the blog-listing tag cloud: compact, accent-tinted, mono. Fixed brand-blue accent (not `--eyebrow-accent`), so chips read consistently across all pages.
- **Dots removed:** the hero credential chip's leading dot and the capability-pill dots are gone.

## Consequences

- One CSS rule re-skins ~32 `.eyebrow` consumers + the 4 `.chip` kickers (PageHero, home Hero/ServicesGrid/Methodology); `.pill-chip` re-skins all 6 `Pill` usages + the blog tag cloud; `.pill-tag` the hero capability row. No more `rounded-full` pills or leading dots anywhere in the marketing chrome.
- Pure CSS/markup; no DB or build change. Tailwind JIT is not involved (raw CSS in `@layer components`).
- The eyebrow is now inline-level (shrink-to-fit tag) rather than full-width text; centered headings still center it (inline-level honors `text-align`).
- Known trade-off: `.pill-chip` stays brand-blue even on industry pages where eyebrows take the sector hue (chips read consistently site-wide); point it at `--eyebrow-accent` if sector-tinted chips are wanted later.

## Alternatives considered

Accent rule + caps, mono code-marker (`//`/`›`), and dot + trailing hairline were presented; the cut-corner tag was chosen as the most distinctive "object" without changing the wording.
