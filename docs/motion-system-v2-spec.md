# ViewNear — Signature Motion System (v2)

## North star — the felt experience in 3 sentences

Scrolling ViewNear should feel like *watching scattered data resolve into one governed platform* — a calm, conducted narrative where the page reacts to you, not at you. The motion is overwhelmingly cool and quiet (sky-blue → cyan flows, soft draws, sticky focus), with coral appearing only at the single emotional peak so it actually lands. Nothing bounces for attention; every movement either reinforces hierarchy (what to read next) or the brand metaphor (data converging, the platform assembling), and on a phone or with reduced-motion it reads as a fast, clean, fully-legible page with zero jank.

This v2 keeps the four shipped pillars (Reveal/RevealGroup/ScrollHighlight, sticky HorizonScene, drawing Methodology line, card-hover) and elevates them with **one new scroll-linked engine** plus a small set of unforgettable set-pieces. We deliberately *reject* the magnetic card-tilt and cursor spotlight from the tactile concept (off-brand fidgetiness, perf cost, weak mobile story) and keep coral rare.

---

## Signature moments — the set-pieces we WILL build

### 1. Hero Mesh "data converges as you scroll" — P0
- **Location:** `components/marketing/home/HeroMesh.tsx` (home hero background, behind `HeroCarousel`).
- **Behavior (scroll-linked):** On load the mesh drifts/twinkles ambiently (existing `mesh-drift`/`mesh-travel`). As the user scrolls the first ~80vh, a single scroll-progress value `0→1` (driven by `useHeroConverge`) does two compositor-only things: (a) damps the drift via a CSS var `--mesh-energy` mapped onto `animation-duration`/opacity of the drift layers so motion *settles*, and (b) pulls the traveling data-packets' `--mesh-energy` toward the hub so by the "Where this takes you" section the mesh is **still and converged** — the data has "arrived." No JS per-frame transforms on hundreds of nodes; we drive *one CSS var on the SVG root* and let existing keyframes read it.
- **Why P0:** It's the thesis statement, on the most-seen surface, and reuses the bespoke `HeroMesh` we already shipped.

### 2. "Knowing what to build didn't" — the coral peak — P0
- **Location:** `app/(marketing)/page.tsx` line ~130, existing `ScrollHighlight` on that phrase.
- **Behavior (scroll-linked):** Keep the existing coral marker-sweep but make it the *designated coral moment of the entire site*. It is the only place the accent highlight fires on home. Tune `--hl` easing so the sweep completes right as the phrase hits reading center.
- **Why P0:** Restraint *is* the brand. One coral sweep on the emotional line ("execution got cheap; knowing what to build didn't") is worth more than ten.

### 3. Methodology line-draw → scroll-conducted, with node glow — P0
- **Location:** `components/marketing/home/Methodology.tsx` (also reused on `approach`).
- **Behavior:** Replace the one-shot `drawn` boolean + 1400ms width transition with a **scroll-linked draw**: a `useScrollProgress`-style `0→1` fills the connecting line via `clip-path: inset(0 calc((1-p)*100%) 0 0)` (a gradient cyan→primary, reading as "current flowing"). Each of the 6 step icons crosses an activation threshold (`p > i/6`) and gets a one-time settle: number badge goes `text-primary/30 → text-primary` and a soft `drop-shadow` glow ticks on. Cascade stays via the existing `Reveal delay={i*60}`.
- **Why P0:** Turns a decorative draw into a *conducted* read of the 6-step method — the single most narrative section on the site.

### 4. HorizonScene — focus + beacon refinement — P1
- **Location:** `components/marketing/home/HorizonScene.tsx`.
- **Behavior:** Keep the sticky pin + filling rail. Add: (a) active card gains a subtle `scale(0.99→1)` settle (compositor-only) on activation alongside the existing ring/shadow; (b) a small **progress beacon** (a glowing dot, `--color-secondary`) rides the rail at `left: progress*100%`; (c) the active card's *number* (01/02/03), not its body text, picks up a cyan `ScrollHighlight`-style underline tied to the same `progress` so the eye links rail → card. Mobile/reduced-motion: unchanged static 3-up grid.
- **Why P1:** The pin already wows; these are taste upgrades, not new risk.

### 5. Platform stack "assembles layer by layer" — P1
- **Location:** `app/(marketing)/platform/page.tsx` (the 6 `LAYERS`). New `components/marketing/platform/PlatformStack.tsx`.
- **Behavior (scroll-linked, NOT pinned):** As each layer scrolls into view, its surface fills bottom-to-top via `clip-path: inset(calc((1-p)*100%) 0 0 0)` over ~700ms, its product cards cascade in (`RevealGroup`), and each status badge (GA/Preview) gets a one-time soft glow. Layers stagger ~120ms so they visually *stack*. **Explicitly no sticky pin here** — six stacked pins on a long page is janky on laptops and a phone disaster; a draw-on-enter delivers 90% of the wow with none of the risk.
- **Why P1:** "The platform builds itself as you read" is the strongest product-page metaphor, and `LAYERS` data already exists.

### 6. MetricBand count-up + single shimmer — P2
- **Location:** `components/marketing/Blocks.tsx` (`MetricBand`), used on home/services/approach. Extend existing `StatCounter.tsx`.
- **Behavior:** Numbers tick `0→target` on enter (StatCounter already does this — *extend it, don't rebuild*), plus one cyan shimmer sweeps left→right behind the number band, lagging the count slightly; labels fade-up `4px`.
- **Why P2:** Lovely, low-risk, but not a thesis moment — ships last.

---

## Primitive library to build

All vanilla (IntersectionObserver + requestAnimationFrame + CSS). Single shared scroll-position engine so we never attach more than necessary; each effect maps a `0→1` to a compositor-only prop or a CSS custom property.

### Hooks — add to `components/marketing/Motion.tsx` (EXTENDS existing file)

- **`useElementProgress<T>(opts?: { start?: number; end?: number; clamp?: boolean })` → `{ ref, progress }`** *(NEW; generalizes the math already inside `useScrollProgress` + `ScrollHighlight`)*
  Returns `0→1` for an element's travel through the viewport, where `start`/`end` are viewport fractions (default `start:0.85`, `end:0.35`, matching `ScrollHighlight`'s current 0.8/0.45 window). Returns `1` immediately under reduced-motion. *Impl: one rAF-throttled scroll/resize listener computing `getBoundingClientRect`; this is the engine `ScrollHighlight`, Methodology, and PlatformStack all consume.* Refactor the existing `ScrollHighlight` to call this internally (no API change to `ScrollHighlight`).

- **`useHeroConverge<T>()` → `{ ref, energy }`** *(NEW)*
  Thin wrapper over `useElementProgress` returning `energy = 1 - progress` over the first ~80vh; consumer writes `--mesh-energy` onto the SVG root. Returns `energy: 0` (settled) under reduced-motion. Desktop-gated via `matchMedia("(min-width:1024px)")` (mobile = ambient loop, no scroll coupling).

- **`useStepThresholds<T>(count: number)` → `{ ref, progress, activeUpTo }`** *(NEW; tiny)*
  Wraps `useElementProgress`; returns `activeUpTo = floor(progress*count)` for timeline/stack activation. Under reduced-motion `activeUpTo = count` (all active).

- **Extend `StatCounter` (`components/marketing/StatCounter.tsx`)** *(EXTEND existing)*
  Add optional `shimmer?: boolean` prop; when true and in-view, toggles a `.count-shimmer` overlay sibling once. Keep its existing IO + rAF count-up — do **not** introduce a separate `useCountUp`.

### Components

- **`<PlatformStack layers={LAYERS} />`** — `components/marketing/platform/PlatformStack.tsx` *(NEW)*
  Client component. Each layer = `useStepThresholds`-driven `clip-path` fill + a `RevealGroup` of product cards. Desktop draws on enter; mobile/reduced-motion renders fully open. *Impl note: one `useElementProgress` per layer is fine (6 listeners, rAF-throttled) — measured cheaper than one pinned scene.*

- **`<ProgressBeacon progress orientation="horizontal" color="secondary" />`** — inline in `HorizonScene.tsx` (small, not worth its own file) *(NEW)*
  Absolutely-positioned glowing dot at `left/top: progress*100%`, `will-change: transform`. Hidden under reduced-motion.

### CSS utilities/keyframes — add to `app/globals.css` (EXTENDS existing)

- **`.line-draw`** — `clip-path: inset(0 calc((1 - var(--draw,0)) * 100%) 0 0)`; consumer sets `--draw`. (Methodology line.)
- **`.layer-fill`** — `clip-path: inset(calc((1 - var(--fill,0)) * 100%) 0 0 0)`. (PlatformStack.)
- **`.node-active`** — `color:` token swap + `filter: drop-shadow(0 0 6px rgb(var(--color-secondary)/.5))`; one-time via class toggle. (Methodology badges, status badges.)
- **`@keyframes count-shimmer`** + `.count-shimmer` — translateX(-100%→100%) cyan gradient, `opacity` peak 0.5, `forwards`, single run. (MetricBand.)
- **`@keyframes beacon-pulse`** + `.beacon` — `scale(1→1.25→1)`, opacity 1→0.65, 3s. (HorizonScene beacon.)
- **`--mesh-energy`** read inside existing `mesh-drift`/`mesh-travel`/`mesh-glow` rules (multiply durations/opacity by the var) so HeroMesh settles without new keyframes.

**Reduced-motion guard additions** (append to the existing block at `globals.css:558`): force `--draw:1`, `--fill:1`, `--mesh-energy:0` with `!important`, and `.count-shimmer{display:none}`, `.beacon{animation:none}`. This guarantees every new effect renders its end-state instantly.

---

## Per-surface application

| Surface | Effects (primitives) | Priority |
|---|---|---|
| **Home — hero** (`page.tsx`, `HeroMesh`, `HeroCarousel`) | Mesh convergence (`useHeroConverge` → `--mesh-energy`); existing carousel fade + RevealGroup intro | P0 |
| **Home — "Why now" line** (`page.tsx:130`) | The one coral `ScrollHighlight` (the site's coral peak) | P0 |
| **Home — problem cards / de-risk cards** | `RevealGroup variant="pop"` (existing) + `.card-hover` | P0 (in place) |
| **Home — FeatureSplit (Foundation/AI)** | `FeatureSplit` left/right Reveal; cyan `ScrollHighlight` on the AI section phrase only | P1 |
| **Home + Approach — Methodology** | Scroll-conducted `.line-draw` (`useStepThresholds`) + `.node-active` badge glow; existing icon cascade | P0 |
| **Home — MetricBand** | `StatCounter` count-up + `.count-shimmer` | P2 |
| **Home — HorizonScene** | Sticky pin (existing) + `<ProgressBeacon>` + active-card scale settle + cyan number underline | P1 |
| **Home — case studies / testimonials** | `RevealGroup variant="fade-up"` + `.card-hover` (no pop — calm) | P0 (in place) |
| **Platform — 6-layer stack** | `<PlatformStack>`: `.layer-fill` draw + per-layer `RevealGroup` + status-badge `.node-active` glow | P1 |
| **Services — THINK/BUILD/GROW** | `RevealGroup variant="pop"` per tier + `.card-hover`; cyan `ScrollHighlight` on one tier phrase | P1 |
| **Services / Approach — MetricBand** | `StatCounter` + shimmer | P2 |
| **Approach — methodology + run phases** | Reuse Methodology scroll-draw; phases via `RevealGroup variant="pop"` | P1 |
| **Industries (+[slug])** | `RevealGroup` (alternating left/right per row) + `.card-hover` | P2 |
| **Partnership** | `RevealGroup` for build-vs-partner cards; cyan `ScrollHighlight` on "Premier Partner"; momentum via fade-up | P2 |
| **About** | `RevealGroup fade-up` team (no pop — people get calm), `pop` values; one cyan `ScrollHighlight` | P2 |
| **All landing pages — PageHero** | Headline + subhead Reveal cascade (existing); **no** cursor spotlight, **no** tilt | P0 (in place) |

Coral budget: **home line #2 only.** Everywhere else "highlight" = cyan. Coral may also tint the HorizonScene beacon at most — decide during build, default cyan.

---

## Guardrails — every effect must follow

**Reduced-motion (`prefers-reduced-motion: reduce`):**
- The global guard at `globals.css:558` stays authoritative; we *extend* it (force `--draw/--fill=1`, `--mesh-energy=0`, kill shimmer/beacon).
- Every hook returns its **end-state** under reduced-motion: `useElementProgress`/`useStepThresholds` → `progress=1`/`activeUpTo=count`; `useHeroConverge` → settled. (Mirrors how `useScrollProgress` already returns `1`.)
- No information is ever conveyed by motion alone — all text/structure is in the DOM at rest.

**Mobile (`< 1024px`):**
- No new sticky pins. HorizonScene already degrades to a static grid; PlatformStack renders fully open (no draw); HeroMesh runs the ambient loop only (scroll coupling desktop-gated via `matchMedia`).
- Directional left/right Reveals collapse to plain fade-up on narrow screens (existing behavior — keep).
- All `matchMedia` listeners use the add/removeEventListener pattern already in `HorizonScene` (responds to rotation/resize).

**Perf / CLS:**
- Animate **only** `transform`, `opacity`, `clip-path`, `filter` — never width/height/top/left in keyframes (the current Methodology `transition-[width]` gets replaced by `clip-path`).
- One rAF-throttled scroll/resize listener *per effect instance*, each `cancelAnimationFrame` on cleanup and `disconnect()` on observers — the exact pattern already in `Motion.tsx`. No unthrottled scroll handlers.
- `will-change` only on actively-animating beacon/mesh-root, removed when idle; never blanket-applied.
- Zero layout shift: all reveal start-states use `transform`/`opacity` (no reflow), elements occupy final space at rest, count-up reserves width via the formatted target. Target 60fps; budget the mesh `--mesh-energy` so it touches one SVG-root var, not per-node style writes.
- `IntersectionObserver` for one-shot reveals (cheap); `useElementProgress` (continuous) reserved for the ~5 scroll-linked set-pieces only — don't put continuous listeners on every card.

---

## Build order

**Phase 0 — Shared engine (blocks everything; one PR):**
1. Add `useElementProgress` to `Motion.tsx`; refactor `ScrollHighlight` to consume it (no public API change — verify home line #2 still sweeps).
2. Add `useStepThresholds` + `useHeroConverge` (thin wrappers).
3. Add CSS utilities/keyframes to `globals.css` (`.line-draw`, `.layer-fill`, `.node-active`, `count-shimmer`, `beacon-pulse`) **and** extend the reduced-motion guard block.
*Gate: confirm reduced-motion + a 360px viewport render clean before any page work.*

**Phase 1 — P0 home set-pieces (sequential within home, share `page.tsx`/home files):**
4. Methodology scroll-conducted draw + node glow (`Methodology.tsx`).
5. HeroMesh convergence (`HeroMesh.tsx` + wire `--mesh-energy` from `page.tsx`).
6. Confirm the single coral `ScrollHighlight` peak (`page.tsx`) — tuning only.

**Phase 2 — P1, parallelizable (disjoint files, no shared edits):**
- 7a. HorizonScene beacon + active settle (`HorizonScene.tsx`) — *one owner.*
- 7b. PlatformStack (`platform/PlatformStack.tsx` + `platform/page.tsx`) — *independent owner.*
- 7c. Services tier reveals + cyan highlight (`services/page.tsx`) — *independent owner.*
These touch three disjoint file sets and can run concurrently after Phase 0 lands.

**Phase 3 — P2 polish (parallelizable):**
- 8a. Extend `StatCounter` with shimmer + apply in `Blocks.tsx` MetricBand (home/services/approach inherit automatically).
- 8b. Industries, Partnership, About reveal/highlight passes — each its own page file, fully parallel.

**Critical path:** Phase 0 → Phase 1 (home is the showcase) → Phase 2 in parallel → Phase 3 in parallel. Only Phase 0 is a true blocker; everything after fans out by file ownership.

---

Grounding notes (real files verified): existing APIs are `Reveal`/`RevealGroup`/`ScrollHighlight`/`useScrollProgress` in `/Users/eduardoramos/Documents/VN/components/marketing/Motion.tsx`; reduced-motion guard at `/Users/eduardoramos/Documents/VN/app/globals.css:558`; mesh keyframes (`mesh-drift`/`mesh-travel`/`mesh-glow`) at `globals.css:470-554`; the 6-entry `LAYERS` array exists in `/Users/eduardoramos/Documents/VN/app/(marketing)/platform/page.tsx`; `MetricBand` lives in `/Users/eduardoramos/Documents/VN/components/marketing/Blocks.tsx`; and `/Users/eduardoramos/Documents/VN/components/marketing/StatCounter.tsx` already implements IO+rAF count-up (extend, don't duplicate). Methodology currently uses a one-shot `drawn` boolean + `transition-[width]` (`Methodology.tsx:78-85`) — v2 replaces that width transition with a scroll-linked `clip-path` to stay compositor-only.
