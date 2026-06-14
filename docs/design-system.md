# Design System: "Glacier"

> Living reference. Update when tokens/components/conventions change. Source of truth for tokens is `config/theme.ts` + `app/globals.css`. ([0005](decisions/0005-glacier-theming.md))

Bright, airy, white-canvas system with a Snowflake-sky-blue primary and a tightly reserved coral accent.

## Color tokens

Defined as `"R G B"` triplets in `config/theme.ts`, emitted as CSS vars in `app/globals.css` `:root`, exposed to Tailwind via `rgb(var(--color-x) / <alpha-value>)` in `tailwind.config.ts`. Use semantic Tailwind classes (`bg-primary/20`, `text-primaryDeep`), never raw hex.

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#FFFFFF` | page canvas |
| `surface` | `#F6FAFD` | cards / bands |
| `surface2` | `#EAF4FB` | tinted bands, hover fills |
| `border` | `#E0EBF4` | hairlines |
| `foreground` | `#0F2530` | text |
| `muted` | `#5C7385` | secondary text |
| `primary` | `#29B5E8` | signature sky-blue, CTAs, links, accents |
| `primaryDeep` | `#0B6E99` | legible blue for small text/links |
| `accent` | `#FF8A4C` | **warm coral, reserved ~5%** (stat pops, single highlights) |
| `secondary` / `cyan` | `#22D3EE` | gradients, data-flow lines, status dots |
| `amber` | `#FFA000` | flavor hue |
| `orange` | `#FFA000` | legacy (earlier button iteration; alias of amber) |
| `pastel` / `pastel-deep` | `#C4E4F7` / `#ADD8F2` | primary button fill + hover (globals-only vars) |
| `purple` | `#7C3AED` | mesh third hue / flavor hue |
| `success` `warning` `danger` | n/a | states / flavor hues |

**Coral discipline:** the accent is reserved for ~5% of the UI. Don't use it for large fills or routine elements.

## Typography

- Display: **Space Grotesk** (`--font-space-grotesk`, `font-display`), headings **and UI chrome**: the nav menu (`Nav` header carries `font-display`) and all `.btn` buttons use it, so the chrome matches the headline brand voice. Weights 400/500/600/700 are loaded so lighter menu items render.
- Body: **Inter** (`--font-inter`, `font-sans`), paragraphs and long-form copy.
- Mono: **JetBrains Mono** (`--font-jetbrains`, `font-mono`), code, eyebrows, kickers

(The Brand page documents these; it was corrected from a stale "Montserrat" reference, [0017](decisions/0017-security-why-pages.md).)

## Logo & brand assets ([0022](decisions/0022-single-logo-lockup.md))

A single official lockup, "viewnear | data + ai" (mark + wordmark + slogan), navy for light surfaces, at `public/assets/viewnear-logo.png`, rendered by `components/marketing/Logo.tsx` (`height` prop; width derives from the ~8:1 ratio). The old `viewnear-logo-{dark,light}.png` / `viewnear-mark.png` were removed. Nav uses `height={25}`, Footer `32`, admin `24`.

## Core components (`components/marketing/`)

- `ui.tsx`, `Section` (`.section` padding + `.container-page`), `SectionHeading` (eyebrow + title + intro, `center?`), `Pill`, `CaseStudyCard`, `TestimonialCard`, `IndustryCard`, `CtaBand`.
- `FeatureSplit.tsx`, alternating text/`FramedShot` rows (`reverse?`), reveal-animated.
- `Blocks.tsx`, `LogoStrip` (marquee), `MetricBand` (big gradient numerals + labels), `InlineCta`.
- `PageHero.tsx`, standard inner-page hero (wave background, centered/left).
- `Decor.tsx`, `SectionDecor` variants `blobs | dots | grid | swoosh | mesh | flow`; `WaveDivider`.
- `Motion.tsx`, `Reveal` (IntersectionObserver fade/slide; pairs with `.reveal`/`.is-visible` in globals).
- `CoverCard.tsx`, image/gradient-placeholder card (`featured?`); fills height in grids.
- `ShowcaseBand.tsx`, full-bleed background-image section with content overlaid on a brand navy scrim (`image`, `eyebrow`, `title`, `body?`, `bullets?`, `cta?`, `align?`, `tintClass?`, `scrim?: "default" | "light"`). `scrim="light"` lowers the navy overlay so a bright/colorful photo shows through while white text stays legible (used on `/life-at-viewnear` for the Monterrey HQ photos). One immersive, slightly darker moment per page; white text with `text-secondary` (cyan) emphasis; CTA uses `.btn-light`. See [0019](decisions/0019-showcase-band.md).
- `home/*`, `Hero`, `ServicesGrid`, `Methodology`, `DashboardMockup` (synthetic console mockup, currently unused), `Icons` (shared inline SVGs).
- `Breadcrumbs.tsx`, accessible breadcrumb trail (`items: {label, href?}[]`, last = current) + `BreadcrumbList` JSON-LD; used only on 2-level detail pages (`industries`/`case-studies`/`blog`/`news` `[slug]`).
- `PartnerBadges.tsx`, Snowflake certification badges (single source: `CERTIFICATIONS`). Variants: `chips` (text pill row), `cards` (text cards), and **`logos`** (the official badge artwork, Premier circle + CoCo shield from `public/assets/images/certs/`; `size="sm"|"lg"`), small in the footer.
- `PartnershipHighlight.tsx`, prominent partnership proof section: the official badges (large `logos` variant), the facts, three stat tiles, and the **Snowflake Summit 2026 "CoCo Global Partner Momentum" keynote slide** (`certs/coco-momentum-summit-2026.png`, framed). `title?` overrides the heading; `showCta?` adds an "Explore our partnership →" link. Used on home, About (both `showCta`), and `/partnership`.
- `home/HeroDiagram.tsx`, the hero's right-side visual: a branded, in-code "governed Snowflake platform" data-flow diagram (sources → one governed Snowflake platform → analytics & Cortex AI), themeable via the Glacier palette, with a gentle `animate-float`. Takes an optional `team` prop and renders a floating "Real people. Senior delivery." / "SnowPro-certified team" card overhanging the panel. Replaced the earlier product-screenshot hero, which implied a proprietary product ViewNear doesn't sell ([0029](decisions/0029-hero-platform-diagram.md)).

## Eyebrow / kicker ([0027](decisions/0027-eyebrow-tag.md))

`.eyebrow` and `.chip` (in `app/globals.css`) are a **cut-corner tag**: monospace caps with one clipped corner (`clip-path`), a faint accent-tint fill, and a 1px accent hairline (an `inset` box-shadow the clip crops). Themed by the `--eyebrow-accent` custom property (default `--color-primary-deep`); set it on any ancestor to retint every eyebrow inside. `.eyebrow--invert` is the dark-scrim variant (`ShowcaseBand`). Industry `[slug]` pages set `--eyebrow-accent` from the sector's `flavor.accentVar`, so all eyebrows there take the sector hue.

The cut-corner silhouette extends to two sibling utilities so the whole UI shares one shape language: **`.pill-tag`** (hero capability row — neutral surface fill, sentence-case, larger) and **`.pill-chip`** (the `Pill` component + the blog tag cloud — compact, accent-tinted, mono). Both drop the old `rounded-full` pill and any leading dots.

## Layout conventions ([0012](decisions/0012-layout-conventions.md))

- **Headings** use `.text-balance` (utility in `globals.css`) to avoid orphaned words / ragged wraps. Apply to new headings.
- **Equal-height card grids:** add `auto-rows-fr` at the multi-column breakpoint and make cards `flex h-full flex-col`. `CoverCard`/`CaseStudyCard`/`TestimonialCard` already fill height.
- Sections alternate white / `section-tint`; use `WaveDivider` between background shifts.
- `MetricBand` values are large gradient numerals, **keep values short** (`60%`, `8–16 wks`, `2 hrs`); put phrasing in the label.

## Motion & animation

Keyframes/utilities in `tailwind.config.ts`, all collapsing under the global `prefers-reduced-motion` rule in `globals.css`:

- `Reveal` (`Motion.tsx`), scroll-reveal fade/slide via IntersectionObserver (`.reveal` → `.is-visible`).
- `animate-float`, gentle vertical drift; the hero visual (`HeroDiagram` wrapper).
- `animate-marquee`, `LogoStrip` ticker; `animate-drift`, decor blobs; `animate-pulse-dot`, status/live dots.
- Buttons lift/brighten on hover, press on active (see Buttons).

## Buttons ([0018](decisions/0018-button-system.md))

Defined once in `app/globals.css`; used everywhere via class.

| Class | Use |
|-------|-----|
| `btn-primary` | primary action, **soft pastel-sky** fill (`#C4E4F7`) with **deep-blue text** (`primaryDeep`, not black) + faint primary hairline; rounded rectangle; deepens + lifts on hover, presses on active ([0024](decisions/0024-flat-orange-buttons-mega-menu.md)) |
| `btn-ghost` | secondary, `surface` fill + hairline border that firms to `foreground/35` on hover (neutral, not blue) |
| `btn-light` | on-dark variant, white pill, ink text; for CTAs over dark imagery (`ShowcaseBand`) |
| `btn-lg` | size modifier for hero / `CtaBand` CTAs (`px-8 py-4`, `text-base`) |
| `btn-sm` | compact size modifier (`px-4 py-2`, `text-sm`) |

All buttons are **rounded rectangles**, base `rounded-xl`, `btn-lg` `rounded-2xl`, `btn-sm` `rounded-lg` (default `px-6 py-3`, `text-[0.95rem]`). The **primary CTA is a soft pastel-sky fill (`#C4E4F7`) with deep-blue (`primaryDeep`) text** + a faint primary hairline ([0024](decisions/0024-flat-orange-buttons-mega-menu.md)); sky-blue remains the link/accent color.

## Navigation: mega-menu ([0024](decisions/0024-flat-orange-buttons-mega-menu.md))

`components/marketing/Nav.tsx` desktop nav is a **full-width mega-menu**: parents (Company, Industries, Services, Resources) open a large panel (`absolute left-0 right-0`, anchored via a `static` `li` in the `relative` nav) with a `lg:grid-cols-3` grid of link cards (label + one-line `NAV_DESCRIPTIONS`) and a featured tile (`NAV_FEATURED`). Opens on hover + focus-within; childless items (Home, Platform) are plain links; the mobile `<details>` overlay is unchanged. Keep `NAV_DESCRIPTIONS`/`NAV_FEATURED` in sync with `theme.nav`. Combine a variant with a size, e.g. `class="btn-primary btn-lg"`. Motion respects the global `prefers-reduced-motion` rule. Small admin utility buttons (delete, leads "Update", nav toggles, sign-out) are deliberately outside this system.

## Industry flavor system ([0011](decisions/0011-industry-flavor.md))

`components/marketing/industries/flavor.tsx` maps each industry slug → `{ icon, pattern, compliance, decor, tile, bar, glow, text, metrics, bullets }`. Hues are palette tokens written as **full static class strings** (Tailwind JIT). Each sector gets a distinct icon + accent hue + decor texture while the rest of the page stays neutral Glacier. `getFlavor(slug)` returns the entry or `DEFAULT_FLAVOR`.

| Sector | Hue | Icon | Decor |
|--------|-----|------|-------|
| Construction and Real Estate | `amber` | building | `grid` |
| Education | `secondary` | graduation-cap | `mesh` |
| Financial Services | `primaryDeep` | bank | `grid` |
| Manufacturing | `success` | factory | `flow` |
| Media, Entertainment & Advertising | `accent` | broadcast | `swoosh` |
| Retail & CPG | `purple` | bag | `dots` |
| Technology and Telco | `primary` | chip | `blobs` |

The 7 sectors are the final set ([0026](decisions/0026-final-industries-and-case-study-spotlight.md)); hardcoded industry nav lists in `config/theme.ts`, `Nav.tsx`, `Footer.tsx`, and `solutions/page.tsx` must stay in sync with the seed. Each industry has **one** case study, shown in a prominent two-column **spotlight** on the detail page (sector image + `flavor` tint, client·region, title, summary, a 2×2 `metrics` grid, pull-quote, CTA), not the old `CaseStudyCard` grid.

## Screenshot harness ([0010](decisions/0010-screenshot-harness.md))

`node .design/shoot.js <outDir>` captures every route at 1440 (desktop) and 390 (mobile), scrolling first so `Reveal` content is visible. Diff `current` against `baseline`. Dev-only.
