# Home page, cards to rows: audit and implementation guide

**Written:** 2026-10-11. **For:** the agent implementing this (Opus). **Owner:** Eduardo Ramos, CEO.

Read the whole file before touching anything. Work the steps in order. One commit per step, on `main`, never pushed: the owner pushes. Each step leaves the home page shippable on its own, so the owner can stop after any of them.

---

## 0. The one-paragraph brief

The owner's ask, verbatim: "now, can you audit the use of cards and start thinking on more rows and hairlines? home page to start with. give me an audit so opus can implement." The home page today draws twenty card-like boxes across seven sections (one featured-story frame, one framed photograph, six service cards, four plates plus one warm panel, three cover cards, one role card plus three booking pills), plus one tinted label pill. Two of the twenty are objects a reader picks up on their own, the featured story with its photograph and the Summit photograph in Recognition, and they stay framed. The other eighteen are lists of equals, or a statement with a CTA, and they become ruled rows: one hairline above the list, one under every row, shared column tracks so every row and its footer start on one left edge, no fill, no radius, no shadow. The vocabulary already exists on the page, in `components/marketing/home/Recognition.tsx` (shipped today) and in the engagement footer of `components/marketing/home/ServicesGrid.tsx`; nothing here invents a third one. This is the opposite move from the site-wide "Rails" refactor the owner reverted in September: fewer boxes, home page only, section by section, nothing shared except two additive, default-preserving props at the very end. Copy changes: zero. `messages/en/*.json` and `messages/es/*.json` stay byte-identical through every step.

---

## 1. Where things stand

### Repository state

```
main        a64ce09   = origin/main = what Render serves       <- you work here
```

Clean tree. `npm run dev` stays up on :3000 for the whole session; never start a second one there, prod checks go on :3100. The home route exports `revalidate = 60`, so after a source change the HTML on :3000 can lag by up to a minute: wait, or confirm the fetched HTML already carries your markup before measuring.

The last three commits set the voice and the pattern this guide extends:

```
a64ce09 fix(home): move the press footnote under the photo, away from the partnership CTA
1cb823a feat(home): one-line press footnote under the Recognition ledger
da61694 feat(home): rebuild Recognition as a Snowflake credentials ledger, drop the CRN quote
```

### The home page in DOM order (`app/[locale]/(marketing)/page.tsx`)

| # | Section | Files | Card-like surfaces today | Verdict | Steps |
|---|---|---|---|---|---|
| 1 | Hero | `components/marketing/home/Hero.tsx` (+ `HeroAurora.tsx`, `HeroMesh.tsx`, `MeshHeroSlide.tsx`) | none (three `.pill-tag` chips, two buttons, a mono credential line) | out of scope, owner said do not touch | none |
| 2 | Logo band | `page.tsx:72-76`, `components/marketing/home/ClientLogos.tsx` | 0 | keep | none |
| 3 | Customers | `components/marketing/home/CustomersFeature.tsx`, `CustomerStories.tsx`, `ClientLogos.tsx` | 1 framed featured story (keep), 1 tinted label pill (remove); the four arrow buttons and the two metric left rules are not cards (keep: section 8, step 6) | mixed, owner-gated | 6, 7 |
| 4 | Recognition | `components/marketing/home/Recognition.tsx` | 1 framed photograph (keep) | keep, tune proportion | 3, 4 |
| 5 | Services | `components/marketing/home/ServicesGrid.tsx` | 6 | convert | 1 |
| 6 | De-risk (inline in `page.tsx:89-133`) | `components/marketing/Cards.tsx` (PlateCard x4), `.panel-warm` with `FaceStack` from `components/marketing/LeadershipStrip.tsx` | 5 | convert | 5 |
| 7 | Insights | `components/marketing/home/Insights.tsx`, `RandomThree.tsx`, `components/marketing/CoverCard.tsx` | 3 | convert | 2 |
| 8 | Careers | `components/marketing/home/CareersTeaser.tsx`, `components/marketing/BookACall.tsx`, `components/marketing/BookingPills.tsx` | 4 (1 role card, 3 booking pills) | convert | 8, 9 |

Section bounds at 1280 (page y / height, px): hero 118/672, logo band 790/68, customers 858/1035, recognition 1893/954, services 2848/1202, de-risk 4050/887, insights 4936/829, careers 5765/675. Page height 7183 at 1280, 13114 at 375. `.container-page` is `mx-auto w-full max-w-[1280px] px-6`, so content is 1232px wide at 1280, 976 at 1024, 720 at 768, 327 at 375; the container's left edge is x 24 at every width.

### What counted as a card-like surface

Any element combining two or more of: a border (`border-border` or any `border-*`), a radius (`rounded-lg/xl/2xl/3xl`), a fill distinct from the section ground (`bg-surface`, `bg-surface2`, `bg-background` on a tinted band, any `.panel-*`), a shadow (`shadow-soft`, `shadow-soft-lg`), box padding (`p-5/p-6/p-8` on the same element). Buttons (`.btn-*`) are not cards. `.eyebrow` and `.chip` are 25px cut-corner tags, not surfaces. A framed photograph is a framed object, not a card. Everything below was checked in source and in computed styles at 1280 and 375 (and 768 and 1024 where it mattered).

### Global utilities, as they actually render (`app/globals.css`)

- `.section` (line 80): `py-14 md:py-20 lg:py-24`, no visual.
- `.section-tint` (272-279): surface2 `#EAF4FB` under two faint radial glows, 1px top and bottom borders `rgb(border/0.7)`. De-risk only.
- `.section-warm` (283-291): cream `rgb(255 248 240)` under gold/accent glows, 1px top and bottom borders `rgb(accent/0.18)`, and sets `--eyebrow-accent` to accent-deep. Customers, Services, Careers.
- `.panel-warm` (320-325): `position: relative; overflow: hidden`, 1px border `rgb(accent/0.22)`, warm linear-gradient fill. No radius and no shadow of its own; `page.tsx:106` adds `rounded-2xl shadow-soft`. A card by the test above.
- `.eyebrow`, `.chip` (89-97): `inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em]`, accent fill at 0.12, inset 1px hairline, cut corner. 25px tall. Note `inline-flex`: inside a `display: grid` parent it blockifies and stretches (step 8 handles this).
- `.card` (120-122) and `.card-hover` (138): used by `CaseStudyCard`/`IndustryCard` in `ui.tsx`; neither renders on home.
- `.pill-chip`: zero on the rendered home page. `.pill-tag`: three, in the hero only.
- Shadows (`tailwind.config.ts`): `shadow-soft` = `0 1px 2px rgb(16 24 40/.04), 0 8px 24px rgb(16 24 40/.06)`; `shadow-soft-lg` = `0 2px 4px .05, 0 16px 40px .10`.
- Colors: background `#FFFFFF`, surface `#F6FAFD`, surface2 `#EAF4FB`, border `#E0EBF4`, primary-deep `#0B6E99`, accent `#FFA000`, accent-deep `#B45309`, gold `#FBBF24`.
- Motion: `.reveal-stagger > *:nth-child(n)` delays 0/70/140/210/280ms (526-530); the reduced-motion reset (1007-1012) forces every `.reveal` and `.reveal-stagger > *` to opacity 1, which is why Playwright runs with `reducedMotion: "reduce"` show every list fully. `RevealGroup` (`components/marketing/Motion.tsx:74-95`) renders the container element itself (`as="div" | "ul" | "ol"`), so its direct children are the staggered items; `Reveal` (line 55-67) forwards `className` and takes `delay`.

### Measurement artifacts (read-only reference, never committed)

All in `/private/tmp/claude-501/-Users-eduardoramos-Documents-VN/4e3b4ac3-5f40-4478-92aa-b05086d72200/scratchpad/`:

- `shot-recognition.mjs`: the working Playwright example (launch chromium against :3000, set viewport, scroll so IntersectionObserver reveals fire, read `getBoundingClientRect` / `getComputedStyle`). Copy its shape for every measurement below.
- `home-1280.png`, `home-375.png`, `home-measure.json` (from `measure-home-cards.mjs`): the whole page before any change.
- Per section: `measure-logoband.mjs` + `logoband-measure.json`; `measure-customers.mjs` + `customers-measure.json`; `measure-recognition.mjs`, `audit-sim-recognition.mjs` + `audit-sim-*.png` (the simulated steps 3 and 4); `measure-derisk.mjs` + `derisk-measure.json`, `mock-derisk.mjs` + `derisk-mock-*.png` + `derisk-mock-measure.json` (the simulated step 5), `derisk-before-en-768.png`; `measure-insights.mjs` + `insights-*.png`; `measure-careers.mjs` + `careers-measure.json`.
- Before crops to compare against: `services-1280-crop.png`, `derisk-1280-crop.png`, `insights-crop-1280.png`, `careers-1280-crop.png`, `cust-1280-crop.png`, `logoband-1280-crop.png`.

Screenshots you take go in that directory, never in the repo. The owner's rule from the last guide stands: DOM measurements have lied before, so look at the image.

---

## 2. Rejected before. Do not rebuild.

Every row below was enforced by the owner at least once (September 2026, `docs/positioning-implementation-guide-2026-09-27.md` sections 2 and 3, and the Rails revert).

| Rejected | Owner's words | What this guide does instead |
|---|---|---|
| Everything built around cards | "I hate you based everything around cards and they're disproportionate, there's no symmetry" | Fewer boxes. Lists of equals become ruled rows with hairlines or ruled columns with equal tracks and aligned baselines. |
| The site-wide "Rails" card refactor (14 grids) | reverted in full | Home page only. No new shared row primitive in `ui.tsx` either: a site-wide row system is the same move as a site-wide card system. Row markup stays local to each home component. |
| A full home page redesign | "disregard, didn't like it" | Section order, headings, copy, hero, nav, footer untouched. Each step changes the geometry inside one section. |
| Badge showcase iterations (plates, tints, floating rectangle, breakout) | eight rounds, all dropped | Badges and client logos bare. No plate, disc, tint or frame behind any mark. |
| The customer stories carousel (arrows, autoplay, counters) | many rounds; "leave CustomersFeature as it is" | The frame, photo, arrows, header and crossfade are not touched. Three small in-slide fixes are offered as owner-gated steps (6, 7); a "no" costs nothing. |
| Six concept pages under `/newhome` | "I'm done with new designs" | No concept pages, no alternates, no mockups in the repo. Simulations live in the scratchpad only. |
| "AI look": aurora mesh, gradient text spans, blurred orbs | "generic" | None added. Existing ones (hero, `text-gradient` spans in two h2s, `text-gradient-bold` metric values) are left alone. |
| Colored accent bars or rails on cards | banned site-wide | Hairlines are `border-border` only, horizontal, 1px. |

The one design change the owner explicitly liked and kept: **real photographs on case study cards** (`fe3f8a2`). Step 2 keeps the photograph in every Insights row for that reason.

---

## 3. Hard rules

Copy

1. **No em dashes.** Anywhere, including commit messages and code comments. Commas, colons, periods. Two catalog strings carry an **en dash** (`15–19 hrs`, `8–16 weeks`); they are data, leave them exactly as they are.
2. **No copy changes in this guide.** No message key is added, renamed, moved or deleted in any step. If an edit seems to need one, stop and ask the owner; do not improvise.
3. "consulting / consultancy / consultant" stay banned in copy (not a concern here, since no copy changes).
4. Spanish stays impersonal (same: no copy changes, so nothing to do, but every step is verified on `/es` as well as `/`).

Design

5. **Cards only for a separate object a reader picks up on its own:** a photograph, a form, a modal, a single featured story. Lists of equals are rows with hairlines or ruled columns with equal tracks.
6. **Hairlines:** `border-border`, 1px, horizontal (`border-t` on the list, `border-b` on every row). Vertical rules only between equal columns (the Careers split, the two metric blocks in Customers), never between unequal tracks.
7. **No plates, discs, tints or frames behind badges or logos.** No new gradients, aurora, orbs. No colored rails.
8. **Symmetry and proportion:** equal tracks where columns are equals, aligned baselines, a recurring element in the same place on every row, nothing stretched over dead space, nothing alone in a row.
9. **Rows are sized by their content.** Do not add `min-h-*` to force equal rows in a text ledger; equal rows are earned by `auto-rows-fr` only where the rows are badge-driven (Recognition).
10. **Tailwind here emits 5-step opacities only** (`/5 /10 ... /95`); `/12`, `/15`, `/35` render transparent. Nested color tokens are hyphenated in class names (`text-primaryDeep` is the flat token; `text-accent-fg` style for nested).
11. **Don't touch:** the hero and its helpers, Nav, Footer, ChatWidget, EventAnnouncementBar, ConsentBanner (global, not home); the photo frame in Recognition; forms and modals; the carousel chrome in `CustomerStories.tsx` (frame, arrows, header, crossfade).
12. **Don't edit shared primitives to get a home-page result:** `components/marketing/ui.tsx`, `Cards.tsx`, `CoverCard.tsx`, `Icons.tsx`, `Motion.tsx`, `Decor.tsx`, `PartnerBadgeRow.tsx`, `Img.tsx`, `app/globals.css`, `tailwind.config.ts` are not edited by any step. The two exceptions are additive props with the current behavior as default: `LogoRow` (`centerOrphan`, step 7) and `BookingPills`/`BookACall` (`layout` / `pillsLayout`, step 9).

Process

13. **Never `git add -A`.** Stage named paths.
14. **Nothing is pushed by the agent.** The owner pushes.
15. **Keep `npm run dev` running on :3000.**
16. **One commit per step,** message in the repo's voice (`feat(home): ...`, `fix(home): ...`), saying what changed and why.
17. **Stop after each step** and let the owner look at :3000 at 1440 and 390, both locales.
18. **JSX comments inside `.map()` callbacks** create two sibling returns and break the render silently. Put comments above the map.

---

## 4. Pattern reference: the vocabulary to reuse

Two components on the page already draw rows the right way. Copy them. Do not create a new primitive.

### 4.1 `components/marketing/home/Recognition.tsx` (the ruled ledger)

```tsx
// line 17-19: one shared track string, module-level, file-local
const ROW_GRID =
  "grid grid-cols-[6.25rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[8.125rem_minmax(0,1fr)] sm:gap-x-6";

// line 143: the list opens with one hairline
<RevealGroup as="ul" className="border-t border-border">
  // line 145: every row closes with one hairline, on the shared tracks
  <li className={cn(ROW_GRID, "items-center border-b border-border py-5 lg:py-4 xl:py-5")}>
    <div className="flex items-center justify-center">{badge}</div>       // bare official badge
    <div className="min-w-0 max-w-xl">
      <p className="font-display text-lg font-bold leading-snug text-foreground">{name}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{meaning}</p>
    </div>
  </li>
</RevealGroup>

// line 165-178: the footer row reuses the tracks with an empty first cell,
// so the link shares the content column's left edge; no border of its own,
// the last row's border-b is its rule
<Reveal delay={210}>
  <div className={cn(ROW_GRID, "pt-5 lg:pt-4 xl:pt-5")}>
    <span aria-hidden="true" />
    <Link className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primaryDeep">
      <span className="link-underline">{cta}</span>
      <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
    </Link>
  </div>
</Reveal>
```

What makes it work: one track string shared by every row and the footer; `border-t` once, `border-b` per row, `#E0EBF4`, no gaps between rows so the rules touch; no fill, radius, shadow or vertical rule anywhere in the list; the recurring element (the badge) is centered in a fixed first track on every row; the text is `text-lg font-bold` name over `text-sm text-muted` meaning; the whole list is the staggered `RevealGroup`, and the footer `Reveal` follows at the next delay step (210ms after three rows, 280ms after four). The only framed object in the section is the photograph (line 100: `rounded-2xl border border-border shadow-soft-lg`), which is a deliberate keep.

### 4.2 `components/marketing/home/ServicesGrid.tsx` lines 104-132 (the footer under a list, on the ground)

```tsx
<div className="mt-12 border-t border-border pt-8">
  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
  <h3 className="mt-3 text-balance font-display text-lg font-semibold leading-snug text-foreground md:text-xl">{title}</h3>
  <Link className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-primaryDeep">
    <span className="link-underline">{label}</span>
    <span className="transition-transform group-hover:translate-x-0.5">→</span>
  </Link>
  <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
    <li className="flex items-start gap-2.5 text-sm leading-snug text-muted">
      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" /><span>{point}</span>
    </li>
  </ul>
</div>
```

A statement plus actions under a list, with no box: that is what the de-risk footer (step 5) and the services engagement footer (step 1) become.

### 4.3 The type scale every row uses

| Role | Class string |
|---|---|
| Row title | `font-display text-lg font-bold leading-snug text-foreground` |
| Row body / meaning | `text-sm leading-relaxed text-muted` (with `mt-1.5` when stacked under the title) |
| Mono index or kicker | `font-mono text-xs tracking-wider text-muted` (`№ 01`) or `font-mono text-xs uppercase tracking-[0.14em] text-muted` |
| Mono spec line (de-risk) | `font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em]` |
| Text link | `group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep` + `<span className="link-underline">` + arrow `<span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>` |
| Hairline | `border-t border-border` (list), `border-b border-border` (row) |
| Row padding | `py-5` (ledgers), `py-5 md:py-6` (de-risk, taller type) |

### 4.4 Track rules

- Declare the track string once per file as a module constant (`ROW_GRID`, `TRACKS`, `LIST_ROW`), like Recognition does. Never export it; never promote it to `ui.tsx` or a utility class. Duplicate the literal with a comment pointing at Recognition when two files share a measure (the `8.125rem` spec column in step 5).
- A fixed first track for the recurring element (badge, index, photo, spec), `minmax(0,1fr)` for text, `auto` for a trailing link or glyph.
- The footer under a list reuses the same track string with an empty `aria-hidden` first cell.
- `items-baseline` when the row is text in every track (steps 1, 5); `items-center` when the first track holds an image (Recognition, step 2, step 9).

---

## 5. Do not

- Do not add a card grid, a `.card`, a `.panel-*`, `shadow-*`, `rounded-*` or a fill to anything in a list. The only framed objects on the page after these steps: the featured story in Customers and the photograph in Recognition (both pre-existing), the 36/40px avatars, the `.btn-*` buttons.
- Do not build a shared `RowList` / `Ledger` / `Rails` primitive. Rows are local JSX in each home component.
- Do not touch `CoverCard.tsx`, `Cards.tsx`, `ui.tsx`, `Icons.tsx`, `Motion.tsx`, `globals.css`, `tailwind.config.ts`. Nine other files render `CoverCard`; six other pages render `PlateCard`; a change there is the Rails move.
- Do not edit `Recognition.tsx` beyond steps 3 and 4 (five class edits on five lines: one in step 3, four in step 4). Do not export `ROW_GRID` from it. Do not touch its photo frame.
- Do not touch the carousel chrome in `CustomerStories.tsx` (frame at line 174, arrows 124-128 and 257-290, header 135-152, crossfade). Steps 6 and 7 are inside the slide copy and the logo row only, and only with the owner's yes.
- Do not add a hairline to the top logo band (`page.tsx:72-76`), or change its padding. Its vertical rhythm is a content nudge (`dy: -38` in the `clientBands` setting, committed in `prisma/content-snapshot.json`), not Tailwind. A `border-t` would paint through the translated logos; a `border-b` would double the Customers band's own top border 1px away.
- Do not put plates, discs, tints, rings or frames behind badges or logos. The `ring-4 ring-background` on the Snowflake stacked badge and the `ring-2 ring-background` on FaceStack avatars are separators inside overlapping artwork, pre-existing, untouched.
- Do not use `min-h-*` to equalize text rows, `outline-none` on row links, `variant="pop"` or `variant="fold"` on a row list (card entrances), `RevealGroup` stagger on two side-by-side lists (step 8), vertical rules between unequal tracks.
- Do not change copy, keys, Spanish register, or the hero. Do not touch Nav, Footer, ChatWidget, the event bar, the cookie banner.
- Do not `git add -A`, do not push, do not start a second dev server on :3000, do not commit screenshots.

---

## 6. The steps

Each step: purpose, files, the exact edit (current line and replacement, every class removed and added, every prop with its default), before and after, desktop, mobile, motion, a11y, copy impact, effort, risk, verification, commit. Stop after each and let the owner look at :3000 at 1440 and 390, both locales. Measurements are page coordinates at the stated viewport unless marked container-relative (add 24 for page x).

Every verification block assumes: `npm run dev` on :3000; Playwright from node, copying `shot-recognition.mjs` (chromium, viewport set, scroll so the IntersectionObserver fires, `reducedMotion: "reduce"` unless the step says otherwise); the home route's `revalidate = 60`, so after a source change confirm `curl -s http://localhost:3000/` already carries the new markup before measuring. Static checks are `npx tsc --noEmit`, `npx eslint <touched files>`, `npx vitest run` (`npm run typecheck`, `npm run lint`, `npm test` are the same three).

---

### Step 1: Services. Six cards become a ruled ledger on four shared tracks.

**Purpose.** Replace the 3x2 grid of white boxes on the cream band with one six-row ledger: index, title, summary and arrow on four tracks shared by every row and by the engagement footer, so the offer reads as one downward scan the way the Recognition ledger does three rows above it.

**Why now.** Six borders, six radii, six fills, six dotted accent rules, six icons, six numbers, six "Learn more" links, repeated around roughly two lines of text each. The boxes are equal only because `lg:auto-rows-fr` plus `line-clamp-4` stretch them: at 1280 five of the six cards hold 63.5px of text (three lines) in a 95.8px box, so a blank fourth line of air sits above "Learn more" everywhere except card 02 (`services-1280-crop.png`). At 375 the equal-height rule stops applying and the cards measure 259.5 / 287 / 259.5 / 259.5 / 236.8 / 259.5, so the set is no longer a set. The dotted `border-primary/40` rule inside each card is a second rule vocabulary (dotted, colored) that nothing else on the page uses; Recognition and the engagement footer directly below use solid neutral `border-border`. The clamp is a hazard: the longest Spanish summary is 157 characters and fills all four clamp lines at 375 (text 86.3px in a 91px box), so one more word would cut. A 3x2 grid asks the eye to jump across three columns and two rows to read six titles; a ledger puts the six titles in one column.

**Keeps.** The `.section-warm` band (the ground, not a card). The `.chip` kicker. The `№ 01` index and the whole-row link to `/services/<slug>` (the accepted change of 2026-09-27). The engagement block's content and its check icons. `components/marketing/home/Icons.tsx` untouched: its other consumers are `app/[locale]/(marketing)/nearshore/page.tsx`, `app/[locale]/(marketing)/about/page.tsx`, `components/marketing/home/SplitVisuals.tsx`, `Methodology.tsx` and `HeroMesh.tsx`; only ServicesGrid's imports shrink.

**Owner decision inside this step, state it in the commit message.** The six service marks (stroke icons) are dropped from the home ledger: they were card chrome introduced on 2026-09-27 to tell boxes apart, and in a ledger the index and the title do that; an icon also has no baseline to align. Default here: drop them. If the owner wants them back, they go in a fifth `1.5rem` track between the index and the title with `self-center`, never inline with the title. Ask before the step if the owner is at hand; otherwise ship without and say so.

**Files.** `components/marketing/home/ServicesGrid.tsx` only. Its sole consumer is `page.tsx:86`, unchanged.

**Edit.**

Imports, lines 3-12. Current:
```tsx
import {
  CheckIcon,
  ChartIcon,
  CompassIcon,
  CpuIcon,
  DataStackIcon,
  PipelineIcon,
  RocketIcon,
  type IconProps,
} from "./Icons";
```
Replacement:
```tsx
import { CheckIcon } from "./Icons";
import { cn } from "@/lib/utils";
```

Lines 17-28 (doc comment): rewrite to describe the ledger (six rows on four shared tracks, Recognition's pattern extended with a second text column; the engagement footer on the same tracks). Comment only.

Lines 30-37 (`const MARKS = ...`): delete. Line 71 (`const Mark = MARKS[svc.slug];`): delete.

Add once, under the imports:
```tsx
// Four shared tracks: index, title, summary, arrow. Every row and the
// engagement footer share these left edges, the same move as ROW_GRID in
// Recognition.tsx, with two text columns instead of one.
const TRACKS = "lg:grid-cols-[3rem_minmax(0,2fr)_minmax(0,3fr)_1.5rem] lg:gap-x-6";
```

Line 44: keep `services.slice(0, 6)`; `cards` may become `rows`, no behavior change.

Lines 66-102 (the RevealGroup and its cards). Current opener, lines 66-69:
```tsx
<RevealGroup
  variant="fold"
  className="mt-14 grid gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3"
>
```
Replacement of the whole block:
```tsx
<RevealGroup as="ul" className="mt-12 border-t border-border">
  {rows.map((svc, i) => (
    <li key={svc.slug} className="border-b border-border">
      <Link
        href={`/services/${svc.slug}`}
        className={cn("group grid gap-y-2 py-5 lg:items-baseline lg:gap-y-0", TRACKS)}
      >
        <span className="font-mono text-xs tracking-wider text-muted">
          № {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primaryDeep">
          {svc.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{svc.summary}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep lg:justify-self-end">
          <span className="link-underline lg:sr-only">{t("servicesGrid.learnMore")}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </Link>
    </li>
  ))}
</RevealGroup>
```
Keep `№ {String(i + 1).padStart(2, "0")}` verbatim. The clamp comment at lines 87-91 goes with the clamp.

Lines 104-132 (engagement block). Current line 106: `<div className="mt-12 border-t border-border pt-8">`; line 107: `<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">`; line 108: `<div className="lg:max-w-sm">`; line 123: `<ul className="grid flex-1 gap-x-10 gap-y-3 sm:grid-cols-2">`. Replacement:
```tsx
<div className={cn("grid gap-6 pt-8 lg:items-start lg:gap-y-0 lg:pt-10", TRACKS)}>
  <div className="lg:col-start-2">
    {/* eyebrow p, h3, pricing Link: unchanged, lines 109-121 */}
  </div>
  <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:col-start-3 lg:col-span-2">
    {/* li markup unchanged, lines 124-129 */}
  </ul>
</div>
```
The inner wrapper (line 107) is deleted and its two children promoted. The footer has no border of its own: the last row's `border-b` is the rule above it, exactly as Recognition's CTA row.

Classes removed: on the six links `flex h-full flex-col rounded-[10px] border border-border bg-background px-5 pb-5 pt-4 transition-colors hover:border-primary/50`; the whole head div `flex items-center justify-between border-b border-dotted border-primary/40 pb-3 text-primaryDeep` with the `<Mark className="h-6 w-6" />` and its `h-6 w-6` fallback span; on the h3 `mt-4 text-xl`; on the summary `mt-2.5 line-clamp-4 flex-1`; on the link span `mt-5`; on the RevealGroup `mt-14 grid gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3` and `variant="fold"`; on the engagement outer div `mt-12 border-t border-border`; the engagement inner wrapper; `lg:max-w-sm` on the text block; `flex-1` on the checklist.

Classes added: `TRACKS` (above); RevealGroup `as="ul"` with `mt-12 border-t border-border`; li `border-b border-border`; link `group grid gap-y-2 py-5 lg:items-baseline lg:gap-y-0` + TRACKS; h3 `text-lg transition-colors group-hover:text-primaryDeep`; link cell `lg:justify-self-end`, label `lg:sr-only`, arrow `aria-hidden="true"`; engagement outer `grid gap-6 pt-8 lg:items-start lg:gap-y-0 lg:pt-10` + TRACKS; text block `lg:col-start-2`; checklist `lg:col-start-3 lg:col-span-2`.

Props: none added. No other file changes.

**Before (1280).**
```
                 [WHAT WE OFFER]
       Every layer of the stack, one accountable team
       From migrations off legacy systems ... on Snowflake.

+---------------+ +---------------+ +---------------+
| (icon)   N 01 | | (icon)   N 02 | | (icon)   N 03 |
| . . . . . . . | | . . . . . . . | | . . . . . . . |   dotted primary/40
| Title         | | Title that    | | Title         |
| summary x3    | | wraps to two  | | summary x3    |
|               | | summary x3    | |               |   <- blank fourth line
| Learn more -> | | Learn more -> | | Learn more -> |
+---------------+ +---------------+ +---------------+   397x264 each, white on cream
+---------------+ +---------------+ +---------------+
| (icon)   N 04 | | (icon)   N 05 | | (icon)   N 06 |
+---------------+ +---------------+ +---------------+

----------------------------------------------------   border-t (engagement)
HOW WE ENGAGE                 v point      v point
Three ways to buy ...         v point      v point
How pricing works ->
```

**After (1280).**
```
                 [WHAT WE OFFER]
       Every layer of the stack, one accountable team
       From migrations off legacy systems ... on Snowflake.

--------------------------------------------------------------------------  border-t (ul)
N 01   AI Analytics on Snowflake       Put governed AI to work: Cortex Analyst ...   ->
                                       Agents and Snowflake CoWork turn ...
--------------------------------------------------------------------------  border-b (li)
N 02   Cloud Architecture & Data       The AI-ready foundation: governed, built ...  ->
       Foundation                      Snowflake, and ready to scale ...
--------------------------------------------------------------------------
N 03   Data Engineering & Pipelines    Always-current, trusted data ...               ->
--------------------------------------------------------------------------
N 04   Embedded Analytics              Differentiate the product ...                  ->
--------------------------------------------------------------------------
N 05   Capability Development          Compound the advantage ...                     ->
--------------------------------------------------------------------------
N 06   Data & AI Strategy              A board-ready roadmap ...                      ->
--------------------------------------------------------------------------
       HOW WE ENGAGE                   v Fixed cost ...        v Time & materials ...
       Three ways to buy the same      v Team augmentation ... v Discovery fixes ...
       accountable delivery.
       How pricing works ->
|3rem|  |<------ 2fr ------>|          |<-------------- 3fr ---------------->| |1.5rem|

375:
--------------------------
N 01
AI Analytics on Snowflake
Put governed AI to work: Cortex
Analyst, Cortex Agents and ... (full)
Learn more ->
--------------------------
N 02
...
```

**Desktop.** Tracks with three 24px gaps inside the 1232px container at 1280: 48 | 435 | 653 | 24 (fr = 217.6). Recurring elements per row, container-relative: index at x 0, title at 72, summary at 531, arrow right edge at 1232 (page x 24 / 96 / 555 / 1256). At 1024 (976px container): 48 | 333 | 499 | 24 (fr = 166.4); title at 72, summary at 429 (page x 96 / 453). `lg:items-baseline` puts the index, the title's first line, the summary's first line and the arrow on one baseline in every row; the two text columns are proportional (2:3) and identical on every row, so they form two straight left edges down the ledger. Summaries run two lines at 1280 (`text-sm leading-relaxed`, 45.5px), so rows are about 87px (45.5 + `py-5` 40 + 1) and the ledger about 520px plus the top rule, against today's 548px grid. At 1024 summaries stay at two lines in the 499px track (three only if a 157-character Spanish summary spills), so rows stay about 87px. Titles fit on one line at 1280 in both locales; at 1024 the longest Spanish title (`Arquitectura en la Nube y Base Gobernada`) wraps to two, and `items-baseline` keeps the first lines aligned. Hover: the title turns `primaryDeep`, the arrow nudges 2px; no fill, no border change. Below the ledger the engagement eyebrow aligns with the title column (`lg:col-start-2`) and the checklist with the summary column (`lg:col-start-3 lg:col-span-2`, 677px at 1280, about 326px per checklist column).

**Mobile.** Below lg each row stacks inside the same `<a>`: index on its own line top-left (the recurring element in the same place on every row), title, the full summary (no clamp, so Spanish never cuts), then "Learn more →" as a visible line (`lg:sr-only` only hides the label at lg). `gap-y-2` between the four, `py-5` on the row, `border-b` on every li. About 200 to 230px per row at 375, roughly 1,300px for six against today's 1,584px (six cards plus five 20px gaps), and the rows are sized by their own content, so the 259.5 / 287 / 259.5 / 259.5 / 236.8 / 259.5 inequality disappears as a concept. At 768 the rows stay stacked (no third tier) and summaries run one or two lines on the 720px container. The engagement block stacks as today: text, then the checklist, two-up from sm.

**Motion.** `RevealGroup as="ul"`, default `fade-up` (the `fold` variant is a 3D card entrance written for a deck; Recognition uses the default). The six li cascade at 0 to 350ms via the existing nth-child delays. Below 1024 the CSS already flattens fold to a fade (`globals.css` 727-735), so mobile motion is unchanged. Hover per row: title color transition, 2px arrow nudge, and the `.link-underline` sweep on the visible label below lg (the sweep is driven by `.group:hover`, so it fires from anywhere on the row). The engagement block keeps no Reveal, as today. Reduced motion: unchanged.

**A11y.** The six rows become a real `<ul>`/`<li>` list (announced as a list of six) instead of a div of anchors. Heading outline unchanged: the section h2, six h3 inside their links (an h3 inside an `<a>` is valid; a's content model is transparent), then the engagement h3. The arrow becomes `aria-hidden` (today it is read aloud). "Learn more" stays in every link's accessible name via `lg:sr-only`, so each link still ends with the same call to action. Removing the clamp makes the visible text equal the accessible text. Keep the browser's `focus-visible` outline on the row `<a>` (no `outline-none`); the row is a block, so the outline traces the whole row. Title hover `#0B6E99` on cream, the same as today's links.

**Copy impact.** none. Every `servicesGrid.*` key stays used with its current string: `chip`, `title`, `body` (with the `migrations` rich tag), `learnMore` (visible below lg, sr-only at lg), `engageEyebrow`, `engageTitle`, `engagePoints`, `pricingLink`. Titles and summaries come from the database via `getServices`, rendered in full. Both locale files untouched.

**Effort.** S (one file, about 60 lines).

**Risk.** Low to medium. Technically trivial. The taste risk is that the owner accepted this exact six-card grid on 2026-09-27 ("the offer reads as a menu"); the ledger changes the geometry from 3x2 to 6x1, which is the move he asked for, but he has not seen six services as rows yet. One commit, reverts cleanly. Watch at implementation: the longest Spanish title at 1024 must stay at two lines, not three; the cool `#E0EBF4` hairlines on the cream band are fine because the engagement rule already uses them in this section. Dropping the icons is the one judgment call, reversible with a fifth track.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/ServicesGrid.tsx`, `npx vitest run` clean. `grep -n 'MARKS\|line-clamp\|rounded-\[10px\]\|border-dotted\|variant="fold"' components/marketing/home/ServicesGrid.tsx` returns nothing.
- After revalidate, `curl -s http://localhost:3000/` and `/es`: the services section has exactly one `<ul class="reveal-stagger ... mt-12 border-t border-border">` with six `<li class="border-b border-border">`, each with one `<a href="/services/...">` (or `/es/services/...`), one h3, one p; "Learn more" / "Más información" appears six times inside the ledger.
- Playwright at 1280, 1024, 768, 375, both locales, screenshots to the scratchpad. At lg+: all six index spans share one left x (24), all six h3 one left x (96 at 1280), all six p one left x (about 555 at 1280, 453 at 1024), all six arrow spans one right x (1256 at 1280). The engagement eyebrow's left x equals the h3 x; the checklist's left x equals the p x.
- Baselines at 1280 and 1024: in each row the index span's `getBoundingClientRect().bottom` and the bottom of a `Range` over the h3's first line and over the p's first line agree within 1px; `getComputedStyle(row).alignItems === "baseline"`.
- No clipping: every summary `<p>` has `scrollHeight === clientHeight` in both locales at all four widths; the longest ES title occupies at most two lines at 1024 (h3 height <= 2 x 24.75 + 1).
- No boxes left: inside the services `<section>`, no element other than `.chip` has a non-zero border-radius, a box-shadow, or a background-color other than transparent; the only borders are the ul top and six li bottoms, all 1px `rgb(224,235,244)`; the engagement block has `border-top-width: 0px`.
- 375: `document.documentElement.scrollWidth === 375`; each row stacks index / title / summary / Learn more in that order; no row taller than its own content plus `py-5`.
- Proportion: section height at 1280 at or below today's 1201.8px and the ledger about 520px; row heights differ only by summary line count.
- Hover and focus in a headed run: hovering a row turns its h3 to `rgb(11,110,153)` and translates the arrow; tabbing to a row shows the default focus outline around the whole row; clicking anywhere in the row navigates.
- Heading outline: one h2 and seven h3 in the section (six services plus engagement), both locales; the `.chip` still renders centered above the h2.
- Compare `services-1280-crop.png` with the after crop at the same bounds: dotted rules, white fills, radii and the blank fourth line are gone.
- Both locales: `git diff -- messages/` is empty.

**Commit.** Stage `components/marketing/home/ServicesGrid.tsx` by name. Message: `feat(home): the six service cards become a ruled ledger on Recognition's tracks`, body saying the 3x2 grid of white boxes on the cream band was equal only by stretching (blank fourth line above every Learn more, unequal at 375), that six rows on four shared tracks read as one scan, that the service marks were dropped as card chrome (fifth track if wanted back), and that no copy changed. Do not push.

---

### Step 2: Insights. Three cover cards become a ruled ledger with a thumbnail track.

**Purpose.** Replace the three `CoverCard` boxes with three rows on Recognition's pattern plus a third track: a 16:10 thumbnail in a fixed first track, kicker and meta on one baseline, the title as the row's link, the excerpt, and a trailing label. `CoverCard.tsx` is not edited; the row is local to `Insights.tsx`.

**Why now.** A reader who reaches Insights has already seen the featured story (framed, 1232x659 at 1280, per the Customers measurement) and the Recognition photograph (framed, 584x438). Three more frames (395x511, `rounded-2xl`, 1px border, `#F6FAFD` fill on white, `shadow-soft`, `p-6`) give a random blog post the same chrome as the featured story and flatten the page's hierarchy. The box costs the reader the thing this section exists for, scanning titles: at 1280 the body is 347px wide and titles clamp at two lines; at 1024 the cards are 309px and titles truncate; at 768 the grid still runs three-up at 224px per card and every title is a fragment. At 375 the section is 1765px tall, 1455px of it three stacked 469px cards, the tallest section on the page for the least important content. The content is a set of equals (same fields: photo, kicker, title, excerpt, meta). These are the identical card grids `/blog`, `/case-studies`, `LatestPosts` and `FeaturedCaseStudies` use, so the home page reads like an archive index.

**Keeps.** The photograph per item, smaller and bare (real photographs on case cards are the one card change the owner kept, `fe3f8a2`). The heading row exactly as it is. `RandomThree`'s client-side pick and deterministic first paint. The kicker as the recurring element (first line, left) paired with the meta (first line, right). Not touched: `CoverCard.tsx`, `ui.tsx`, `Cards.tsx`, `Img.tsx`, `Motion.tsx`.

**Files.** `components/marketing/home/Insights.tsx`, `components/marketing/home/RandomThree.tsx`. `git diff --stat` must show only those two.

**Edit.**

`Insights.tsx`. Imports: delete `import { CoverCard } from "@/components/marketing/CoverCard";`; add `import { Img as Image } from "@/components/marketing/Img";` and change the utils import to `import { cn, formatDate } from "@/lib/utils";`. Add, module-level:
```tsx
// Three tracks: photograph, text, trailing label. Recognition's ROW_GRID with
// a third track; module-level and file-local, like there.
const ROW_GRID =
  "grid grid-cols-[6.25rem_minmax(0,1fr)_auto] items-center gap-x-4 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-x-6 lg:grid-cols-[12rem_minmax(0,1fr)_auto]";
```
Add a local row component (not exported):
```tsx
function InsightRow({
  href, image, kicker, title, excerpt, meta, readMore,
}: {
  href: string; image: string; kicker: string; title: string;
  excerpt?: string | null; meta: string; readMore: string;
}) {
  return (
    <li className={cn(ROW_GRID, "group relative border-b border-border py-5")}>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 100px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">{kicker}</p>
          <p className="font-mono text-xs tabular-nums text-muted">{meta}</p>
        </div>
        <h3 className="mt-1.5 line-clamp-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primaryDeep sm:line-clamp-2">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="mt-1.5 hidden text-sm leading-relaxed text-muted sm:line-clamp-2">{excerpt}</p>
        )}
      </div>
      <span aria-hidden="true" className="hidden items-center gap-1 self-center text-sm font-semibold text-primaryDeep sm:inline-flex">
        {readMore}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
      <span aria-hidden="true" className="self-center text-muted transition-transform group-hover:translate-x-0.5 sm:hidden">→</span>
    </li>
  );
}
```
`image` is always a string (`coverFor` / `coverForSector` always return one, `lib/covers.ts:35, 40`), so no placeholder path is needed. In `Insights()`: add `const ui = await getTranslations("sharedUi");`. Replace both `<CoverCard .../>` nodes (lines 36-44 and 50-58) with `<InsightRow .../>` carrying the same values: blog rows `href={`/blog/${post.slug}`}`, `image={post.coverImageUrl ?? coverFor(post.slug)}`, `kicker={t("kickerBlog")}`, `title={post.title}`, `excerpt={post.excerpt}`, `meta={formatDate(post.publishedAt, locale)}`, `readMore={ui("coverCard.readMore")}`; case rows `href={`/case-studies/${cs.slug}`}`, `image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}`, `kicker={t("kickerCase")}`, `title={cs.title}`, `excerpt={cs.summary}`, `meta={`${cs.sector} · ${cs.region}`}`, same `readMore`. Keys stay `blog-${slug}` / `case-${slug}`. The `imageAlt` prop is dropped (see A11y). Lines 86-98: delete the `cards.length <= 3` branch and both grid wrappers; render `<div className="mt-12"><RandomThree cards={cards} /></div>` after the heading row, and close the heading `<Reveal>` before it (the heading alone is wrapped in `Reveal`, as Recognition does). Deleting the branch is safe: `RandomThree` already handles a pool of three or fewer (`RandomThree.tsx:32`, `if (cards.length <= count) return;` leaves the deterministic first `count` keys visible), so a pool of one to three items renders all of them as rows.

`RandomThree.tsx`. Line 3: `import { Fragment, useEffect, useState } from "react";` plus `import { RevealGroup } from "@/components/marketing/Motion";` (Motion.tsx is `"use client"`, so this import is safe). Lines 40-50, current:
```tsx
<div className="grid gap-6 md:auto-rows-fr md:grid-cols-3">
  {cards
    .filter((c) => visible.includes(c.key))
    .map((c) => (
      <div key={c.key} className="h-full">
        {c.node}
      </div>
    ))}
</div>
```
Replacement:
```tsx
<RevealGroup as="ul" className="border-t border-border">
  {cards
    .filter((c) => visible.includes(c.key))
    .map((c) => (
      <Fragment key={c.key}>{c.node}</Fragment>
    ))}
</RevealGroup>
```
The Fragment keeps React keys without adding a DOM wrapper, so each li is a direct child of the ul and the `.reveal-stagger > *` delays apply. Update the doc comment to say it renders the ledger. State, effect and the deterministic first paint are unchanged.

Classes removed: list container `grid gap-6 md:auto-rows-fr md:grid-cols-3` (both files); item wrapper `div.h-full` (deleted). No longer rendered in this section because `CoverCard` is no longer used here: `group flex h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg flex-col`, the full-width `aspect-[16/10]` media with its `from-deep/30` hover gradient, the `p-6` body, `line-clamp-2 text-lg` title, `line-clamp-3` excerpt, `mt-4 text-xs` meta, `mt-auto pt-4` Read more.

Classes added: ul `border-t border-border`; li `ROW_GRID` + `group relative border-b border-border py-5`; photo wrapper `relative aspect-[16/10] w-full overflow-hidden rounded-lg`; img `object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`; text `min-w-0`; line 1 `flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`; kicker `font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep`; meta `font-mono text-xs tabular-nums text-muted`; h3 `mt-1.5 line-clamp-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primaryDeep sm:line-clamp-2`; title link `after:absolute after:inset-0 after:content-['']`; excerpt `mt-1.5 hidden text-sm leading-relaxed text-muted sm:line-clamp-2`; label `hidden items-center gap-1 self-center text-sm font-semibold text-primaryDeep sm:inline-flex`; arrow `self-center text-muted transition-transform group-hover:translate-x-0.5 sm:hidden`.

Props: none added to any shared component. `InsightRow` is file-local.

**Before (1280).**
```
INSIGHTS
Recent thinking, and the proof behind it.          All articles ->   All case studies ->

+------------------+   +------------------+   +------------------+
|   photo 16:10    |   |   photo 16:10    |   |   photo 16:10    |
+------------------+   +------------------+   +------------------+
|  ARTICLE         |   |  ARTICLE         |   |  CASE STUDY      |
|  Title (2 lines) |   |  Title (2 lines) |   |  Title (2 lines) |
|  excerpt 3 lines |   |  excerpt 3 lines |   |  excerpt 3 lines |
|  July 15, 2026   |   |  June 13, 2026   |   |  Education ...   |
|  Read more ->    |   |  Read more ->    |   |  Read more ->    |
+------------------+   +------------------+   +------------------+
 395x511 each: rounded-2xl, 1px border, bg-surface, shadow-soft, p-6
 768: three 224px cards, titles cut. 375: three 469px cards, section 1765px.
```

**After (1280).**
```
INSIGHTS
Recent thinking, and the proof behind it.          All articles ->   All case studies ->

------------------------------------------------------------------------------- border-t (ul)
+---------+  ARTICLE                                               July 15, 2026
| 192x120 |  What a Snowflake Migration Actually Costs ...                       Read more ->
|  photo  |  Anyone who quotes a firm migration price before seeing ...
+---------+  is guessing. But the cost is not unknowable ...
------------------------------------------------------------------------------- border-b (li)
+---------+  ARTICLE                                               June 13, 2026
| 192x120 |  Snowflake Is Now the Control Plane for the Agentic Enterprise       Read more ->
|  photo  |  Snowflake began as a data platform, but the rise of agentic AI ...
+---------+
------------------------------------------------------------------------------- border-b (li)
+---------+  CASE STUDY                                  Education · Miami & LATAM
| 192x120 |  Real-time insight into 20,000+ students across campuses ...         Read more ->
|  photo  |  A group of universities serving 20,000+ students ...
+---------+
------------------------------------------------------------------------------- border-b (li)
 tracks [12rem photo] [minmax(0,1fr) text] [auto label], gap-x-6, py-5, items-center

375:
------------------------------ border-t
+-----+ ARTICLE
|100x | July 15, 2026
| 62  | What a Snowflake Migration
+-----+ Actually Costs (And What...     ->
------------------------------ border-b
 (excerpt hidden, title clamps at 3 lines, bare arrow)
```

**Desktop.** 1280: three rows under a hairline, each about 160px (120px photo + `py-5`; rows with a two-line title run a little taller, which is the ledger's nature, as in Recognition). Kicker and meta on one baseline across the top of the text track; titles start at x 240 (24 + 192 + 24) in every row; the "Read more" label is pinned to the container's right edge (1256), vertically centered, identical width on every row. List about 480px against today's 511px card row, with zero chrome. 1024: same tracks, photo 192px, text track about 650px, titles mostly one line. Heading row untouched.

**Mobile.** Below 640 the rows compress instead of stacking: photo track `6.25rem` (100x62), `gap-x-4`, text track about 180px (327 minus 100, two 16px gaps and a 14px arrow), arrow track about 14px. Line 1 wraps when kicker plus meta exceed the width (ES `CASO DE ÉXITO` plus `Manufactura · Mexico` will: the meta drops to its own line, left-aligned, 4px below, acceptable ledger behavior); the title clamps at three lines; the excerpt is hidden; the bare arrow replaces the label. Each row about 120 to 140px, the list about 400px, the section about 700px against 1765px today. 640 to 1023: photo `10rem` (160x100), excerpt visible at two lines, title at two, label shown; at 768 the text track is about 430px, so titles that were fragments in 224px cards read whole or nearly. No horizontal scroll at any width (`min-w-0` on the text track, clamps on title and excerpt).

**Motion.** `RevealGroup as="ul"`, default `fade-up`: the three li cascade at 0 / 70 / 140ms; the heading keeps its own `<Reveal>`. Hover: title to `primaryDeep`, thumbnail `scale-105` over 500ms with the motion-reduce guards, arrow nudge. No lift, no shadow change, no border change. `RandomThree`'s post-mount swap happens before the ul enters view on a normal scroll, so the stagger runs once on the final three. Reduced motion: unchanged.

**A11y.** A `<ul>` of three `<li>`, the section h2 unchanged, each row title an `<h3>` holding the one `<Link>`. The link is stretched over the whole row by `after:absolute after:inset-0` on a `relative` li, so the accessible name of every row is just the title (today it is kicker + title + excerpt + meta + "Read more" concatenated). Kicker and meta are plain `<p>` text in reading order before the title. The label and the bare arrow are `aria-hidden` decoration since the link already names the row; the thumbnail is `alt=""` because the title sits beside it (an alt equal to the title would be read twice). Keep the default `focus-visible` ring on the title link. Both locales render the same structure.

**Copy impact.** none. `home.insights.eyebrow/title/kickerBlog/kickerCase/viewBlog/viewCases` and `sharedUi.coverCard.readMore` ("Read more" / "Leer más") are used exactly as today; `readMore` is now also read in `Insights.tsx` and stays in use by `CoverCard` elsewhere. Two layout-only decisions to flag in the commit message, not change copy for: the excerpt is hidden below 640 (it is clamped to a fragment there anyway) and the thumbnail alt becomes empty because the title is the adjacent link text.

**Effort.** S (two home-only files).

**Risk.** Low. Specifics: (1) the photographs shrink from 395px to 192px wide, the visible trade the owner must accept; the page keeps its two big framed photographs above, so this is hierarchy, not loss; (2) rows with a two-line title are taller than rows with a one-line title, which is how Recognition behaves too; do not "fix" with min-heights; (3) `hidden sm:line-clamp-2` relies on the responsive variant winning `display`, standard Tailwind order, but verify the excerpt shows at 640+; (4) the stretched link's `::after` escapes the h3's `line-clamp` `overflow: hidden` only because its containing block is the `relative` li; do not add `relative`, `transform` or `overflow-hidden` to the h3 or the text div, or the pseudo-element gets clipped to the clamped heading and the row stops being clickable outside the title; forgetting `relative` on the li makes it cover the whole section; (5) `RandomThree` must keep li as direct children of the ul (Fragment, not div) or the stagger and the hairline rhythm break; (6) on ES at 375 the kicker + meta line wraps in case-study rows, accepted, not a bug.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/Insights.tsx components/marketing/home/RandomThree.tsx`, `npx vitest run` clean; `git diff --stat` touches only those two files; `grep -n "CoverCard" components/marketing/home/Insights.tsx` returns nothing; `git diff -- messages/` empty.
- Playwright at 1280 (en and es), section scrolled into view: the ul has `border-top: 1px rgb(224,235,244)`; every li `border-bottom: 1px` same; no element inside the ul has a box-shadow other than `none`, a background-color other than transparent, or a border-radius other than 0 except the three photo wrappers at 8px. Check background-color only: the `Img` wrapper defaults to `placeholder="blur"`, which next/image renders as an inline `background-image` on the img until it loads, so a background-image assertion would fail intermittently unless taken after `await img.evaluate((i) => i.complete)`.
- 1280: three photo wrappers 192x120 at x 24; kicker, h3 and excerpt in all three rows share one left x (240); within each row kicker and meta share a bottom y; the three "Read more" labels share one right x (1256) and one width; rows have 20px top and bottom padding.
- 1024: photo 192x120, text track about 650px. 768: photo 160x100, excerpt visible at two lines, label visible. 640: photo 160x100. 375: photo 100x62, excerpt `display: none`, title clamps at 3 lines, label hidden, bare arrow visible; `document.documentElement.scrollWidth === 375`.
- Section height, before and after: expect about 829 to about 790 at 1280 and 1765 to about 700 at 375.
- Stagger (`reducedMotion: "no-preference"`): scroll the ul into view and read `transitionDelay` on the three li (0ms, 70ms, 140ms); all reach opacity 1; the ul carries `reveal-stagger is-visible`; `ul.children.length === 3`, all `LI`.
- `RandomThree` still works: load the home page three times and confirm the set of three hrefs changes between loads; the pre-hydration HTML (`curl`) carries exactly three li with the first three blog hrefs; no hydration warning in the console.
- A11y: each li contains exactly one `<a>`; `page.getByRole("link", { name: <title> })` resolves per row; label spans and arrows are `aria-hidden`; thumbnail alt is `""`; the h2 and three h3 are the only headings in the section; tab to a title shows a visible focus ring; clicking the excerpt or the photo navigates (the stretched link covers the li and only the li).
- Hover at 1280: title to `primaryDeep`, photo scales to 1.05, arrow nudges; the li's bounding box does not move and no shadow appears.
- `/es`: `Artículo` / `Caso de éxito` kickers, `Leer más` labels; case rows at 375 wrap the kicker + meta line without overflowing the text track.
- Screenshots at 1280, 1024, 768, 375, en and es, into the scratchpad, compared by eye against `insights-en-1280.png`, `insights-en-1024.png`, `insights-en-768.png`, `insights-es-375.png`.

**Commit.** Stage `components/marketing/home/Insights.tsx` and `components/marketing/home/RandomThree.tsx` by name. Message: `feat(home): Insights as a ruled ledger of rows, not three cards`, body naming the thumbnail track, the stretched title link, the hidden excerpt below 640 and the empty thumbnail alt as deliberate, `CoverCard` untouched. Do not push.

---

### Step 3: Recognition. Equal rows in the ledger.

**Purpose.** Make the three ledger rows the same height so the three hairlines fall at equal intervals and the badge sits at the same height within every row. One class edit.

**Why now.** The section already is the target pattern (one framed photograph, one ruled ledger, bare badges). What it costs the reader is proportion: the rows measure 171 / 137 / 140px at 1280 and 163 / 132 / 154.8 at 1024 (both locales), because the Snowflake Premier + Select composite is 130px tall where the two shields are 96, and row 1 also carries the Verify link. The first rule-to-rule interval is 25 percent taller than the next two, and the row name starts at a different distance below its hairline in every row (31.9 / 29.9 / 20.0 at 1280). The simulation (`audit-sim-recognition.mjs`, `audit-sim-*.png`) gives 171 x 3 at 1280 and 163 x 3 at 1024.

**Keeps.** Everything else in the file: the framed photograph (line 100, deliberate keep), `ROW_GRID` (file-local, not exported), the bare badges and their sizes, the CTA row, the press footnote, `SectionDecor` (28 files use it), the `.eyebrow` and the `text-gradient` span, figure and list semantics, `items-center` on the rows (the badge axis is the right axis for a badge ledger; `items-start` was simulated and leaves 54px of air under the shields in rows 2 and 3).

**Files.** `components/marketing/home/Recognition.tsx`, line 143.

**Edit.** Line 143, current:
```tsx
<RevealGroup as="ul" className="border-t border-border">
```
Replacement:
```tsx
<RevealGroup as="ul" className="grid grid-cols-1 border-t border-border lg:auto-rows-fr">
```
Classes removed: none. Classes added: `grid grid-cols-1 lg:auto-rows-fr`. Props: none. Nothing else in the file changes. `RevealGroup` renders the ul itself (`Motion.tsx:74-95`), so the li stay its direct children and the nth-child delays still address the three rows; the CTA keeps its own `Reveal delay={210}`.

**Before / after (1280, right column).**
```
before                                    after
------------------------------- (ul top)  ------------------------------- (ul top)
[ (o) ]  Premier & Select ...             [ (o) ]  Premier & Select ...
         meaning, 2 lines                          meaning, 2 lines
         Verify listing                            Verify listing
------------------------------- 171       ------------------------------- 171
[shield] CoCo Preferred Partner           [shield] CoCo Preferred Partner
         meaning, 2 lines                          meaning, 2 lines
------------------------------- 137       ------------------------------- 171
[shield] SnowPro-certified team           [shield] SnowPro-certified team
         meaning, 3 lines                          meaning, 3 lines
------------------------------- 140       ------------------------------- 171
         See the partnership ->                    See the partnership ->
```

**Desktop.** `lg:auto-rows-fr` on a grid with indefinite height sizes every row to the tallest row's max-content, the mechanism `ServicesGrid.tsx:68` relies on today. 171 / 171 / 171 at 1280 (both locales), 163 / 163 / 163 at 1024. Hairlines stay where they are drawn (`border-t` on the ul, `border-b` on each li). The CoCo row gains 34px of air at 1280 (76px text block in a 130px content box), the visible cost of equal rows and the intended look. The row name stays vertically centered with its badge, so its offset below the rule reads 31.9 / 46.9 / 35.5 at 1280. Right column total 554 at 1280 (ul 514 + CTA 40), 526 at 1024.

**Mobile.** Nothing changes below lg: `grid grid-cols-1` is visually identical to the block list (single column, no gaps, borders unchanged). Rows stay content-driven: 217.5 / 162.8 / 210.3 (en 375), 240.3 / 185.5 / 233 (es 375), 171 / 137 / 137 (en 768).

**Motion.** Unchanged. The ul's direct children are still the three li, so the 0 / 70 / 140ms cascade and the CTA at 210ms are identical.

**A11y.** No change. `display: grid` on a ul does not alter its list role in Chromium or Safari (list-style is already none via the global reset, so the status quo holds either way). Row names stay `<p>`; the section keeps its one h2.

**Copy impact.** none.

**Effort.** S.

**Risk.** Low. One class, confirmed by simulation.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/Recognition.tsx`, `npx vitest run` clean.
- Playwright at 1280 (en and es): the three li heights equal (171 x 3); the ul top rule y equals the frame top y within 1px (both 2215.8 today); the three badge center x values match within 0.5px (737); the CTA link x equals the first row's content-cell x (826, delta 0).
- 1024 (en and es): li heights 163 x 3.
- 375 and 768 (en and es): row heights unchanged from the before numbers above; name offset 20px below every rule at 375.
- `getComputedStyle` on each li: `border-top: 0`, `border-bottom: 1px rgb(224,235,244)`, background transparent, box-shadow none, border-radius 0.
- Once without `reducedMotion: reduce`: the three rows still cascade and the CTA follows at 210ms.
- `git diff -- messages/` empty.

**Commit.** Stage `components/marketing/home/Recognition.tsx` by name. Message: `feat(home): equal rows in the Recognition ledger`, body: the three rows were 171 / 137 / 140 because the Snowflake composite is taller than the shields; `lg:auto-rows-fr` makes the hairlines fall at equal intervals; below lg nothing changes. Do not push.

---

### Step 4: Recognition. The two columns close on one line.

**Purpose.** Make the right column (ledger + CTA) and the left column (photo + caption + press footnote) end on the same pixel at lg, so "See the partnership" and the press footnote, the two columns' closing lines, sit at one height instead of floating 47px apart.

**Why now.** The columns start on one line (ledger top rule and frame top both at y 2215.8 at 1280) but never end on one: at 1280 the right column ends 47px above the left in English and 63px in Spanish (the Spanish caption wraps to two lines); at 1024 the right column ends 30.5px below the left. Simulated (`audit-sim-*.png`): both column bottoms at the same pixel, 2769.8 / 2769.8 at 1280 en, 2894.1 / 2894.1 at 1280 es, 2778 / 2778 at 1024.

**Keeps.** As step 3. The press footnote stays under the photo (moved there deliberately in `a64ce09`); this step only lets it sit at the column floor at lg.

**Files.** `components/marketing/home/Recognition.tsx`, lines 97, 98, 99, 119. Four class edits, nothing else.

**Edit.**

Line 97, current: `<div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">`. Replacement: `<div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">` (removed: `lg:items-start`; grid's default `align-items: stretch` takes over so both column wrappers fill the row).

Line 98, current: `<Reveal variant="left">`. Replacement: `<Reveal variant="left" className="lg:flex lg:flex-col">` (`Reveal` forwards `className` onto its div, `Motion.tsx:61`).

Line 99, current: `<figure className="m-0">`. Replacement: `<figure className="m-0 lg:mb-5">` (the minimum caption-to-footnote gap when `mt-auto` resolves to 0).

Line 119, the press `<p>`: change the leading `mt-5` to `mt-5 lg:mt-auto`; keep `flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4` and the mono type classes exactly as they are.

Classes removed: `lg:items-start` (line 97). Classes added: `lg:flex lg:flex-col` (98), `lg:mb-5` (99), `lg:mt-auto` (119). Props: none. The `{outlet && ...}` guard stays; when `PRESS` is empty the left column has no floor line and this step is a no-op there.

**Before / after (1280).**
```
before                                           after
+------------------+  ---------------- (ul)      +------------------+  ---------------- (ul)
|   photograph     |  rows x3 (171 each)         |   photograph     |  rows x3 (171 each)
|                  |  ...                        |                  |  ...
+------------------+  ----------------           +------------------+  ----------------
CAPTION 2 LINES       See the partnership ->     CAPTION 2 LINES
----------------        ^ ends 47px above                           (mt-auto pushes down)
CRN quoted ... Read ->    the left column        ----------------
                                                 CRN quoted ... Read -> See the partnership ->
                                                 ^ both columns end on this line, delta 0
```

**Desktop.** Left column stretches to the grid row and becomes a flex column at lg; the figure keeps its size (584x438 at 1280, 456x342 at 1024), the figcaption follows at `mt-3`, and the footnote is pushed to the column floor. Left bottom = right bottom to the pixel; the CTA text bottom and the footnote bottom coincide (delta 0.0 at 1280 en, 1280 es, 1024 en). Caption-to-footnote gap: 38px at 1280 en, 22px at 1280 es, about 90px at 1024 en (the 1024 frame is only 342px tall, so the footnote sits well below the caption there; it reads as the column's footer line under its own hairline, which is the intent, but show the owner before committing). Section height 954.5 to 972.5 at 1280 en, 905.3 to 944.5 at 1024.

**Mobile.** Nothing changes below lg: every added utility is lg-prefixed. Stack order stays photo, caption, press footnote (`mt-5`, directly under the caption), 40px gap, ledger, CTA.

**Motion.** Unchanged: heading `Reveal` fade-up, left column `Reveal variant="left"` (the added className only adds flex at lg), ledger stagger, CTA at 210ms.

**A11y.** No change. Figure and figcaption stay, reading order unchanged, external Verify link keeps `target="_blank" rel="noopener"`.

**Copy impact.** none.

**Effort.** S.

**Risk.** Low. The one visible trade is the 1024 gap under the caption; if the owner dislikes it, revert this commit only and keep step 3.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/Recognition.tsx`, `npx vitest run` clean.
- Playwright at 1280 (en and es) and 1024 (en): the left column wrapper's bottom equals the right column wrapper's bottom (delta 0); the CTA text bottom equals the press footnote bottom (delta 0); the ul top rule still equals the frame top; row heights still 171 x 3 (1280) and 163 x 3 (1024). Record the caption-to-footnote gap (expect 38 / 22 / about 90) and screenshot 1024 for the owner.
- 375 and 768 (en and es): nothing moves; the press footnote is still 20px under the caption (`mt-5`, not `mt-auto`).
- Hover the photo in a headed run: the zoom to the logo still works; the figcaption hover hint shows on a pointer device.
- `git diff -- messages/` empty; `git diff --stat` shows one file.

**Commit.** Stage `components/marketing/home/Recognition.tsx` by name. Message: `feat(home): Recognition columns close on one line`, body: the right column ended 47px above the left at 1280 (63 in es, 30 below at 1024); the left column is now a flex column at lg with the press footnote at its floor, so the CTA and the footnote share a baseline; below lg unchanged. Do not push.

---

### Step 5: De-risk. Four plates and the warm panel become one ruled ledger with a footer on the ground.

**Purpose.** Move the inline de-risk section out of `page.tsx` into a local `Derisk.tsx` that renders the four points as a ruled ledger on an `8.125rem` spec column (the same measure Recognition uses from sm) and the build-vs-buy statement, the three faces and the two buttons as a footer row on the same tracks, on the section ground, with no box.

**Why now.** Five framed objects in one tinted band, none of them a separate object a reader picks up on its own: the four plates are a numbered set of equals and the panel is a statement plus a CTA. Measured (`derisk-measure.json`): (1) the plates are "equal" only because `md:auto-rows-fr` stretches three of them to the tallest; the fill below the body text is 76 / 76 / 53 / 25px at 1280 en, 99 / 71 / 48 / 25 at 1024 en, 75 / 24 / 75 / 24 at 1280 es, the owner's exact complaint, boxes stretched over dead space. (2) Body baselines do not align across the row: at 1280 en the fourth title wraps so its body starts 28px lower (y 4469 vs 4441). (3) Below md the plates are 182 / 182 / 182 / 232 at 375. (4) The plate fill `#F6FAFD` on the surface2 ground `#EAF4FB` is a second surface that says nothing; the corner ticks brighten on hover on a non-interactive element. (5) The panel is broken at every tablet width: `md:flex-row` fires at 768 while the right block is `shrink-0` at 501px (536 es), so the text column collapses to 130px (134 es), the headline wraps to 11 lines (12 es), the body to 14 (18 es), and the panel is 745px tall (868 es): `derisk-before-en-768.png`. At 1024 the same squeeze leaves 385px for a 24px headline. (6) It is the only warm surface inside a cool band; the warm/cool rhythm is set at section level (Customers warm, Recognition plain, Services warm, de-risk cool, Insights plain, Careers warm), so three warm bands already satisfy "one warm moment above the CTA" and the panel is not needed for it. If Insights also converts (step 2), the page reads Recognition (ledger), Services (ledger), de-risk (ledger), Insights (ledger), Careers (ruled columns); the argument for de-risk does not depend on alternation.

**Keeps.** `FaceStack` (`LeadershipStrip.tsx:77-120`, three 40px photographs with a 2px ring separator, home is its only consumer), untouched and kept beside the primary button because the code comment says why ("The CTA promises a person; show the actual people"). The two CTAs (`btn-primary` to `/contact`, `btn-ghost` to `/partnership`): buttons, same markup, order and hrefs. `<Section className="section-tint">` and `SectionHeading` exactly as rendered. The headline's emphasis spans (`text-primaryDeep`, `text-red`) and the `/nearshore` link in the body.

**Files.** New `components/marketing/home/Derisk.tsx`; `app/[locale]/(marketing)/page.tsx`. Not touched: `Cards.tsx` (PlateCard keeps its six other consumers: `snowflake-consulting-services/page.tsx:181`, `security/page.tsx:119`, `industries/[slug]/page.tsx:310`, `approach/page.tsx:115`, `about/page.tsx:156`, `services/page.tsx:263`), `LeadershipStrip.tsx`, `globals.css` (`.panel-warm` keeps `case-studies/page.tsx:138`, `services/page.tsx:352`, `pricing/page.tsx:89`, `BookACall.tsx:113`), `Recognition.tsx` (do not export `ROW_GRID`; duplicate the measure), both `home.json` files.

**Edit.**

New file `components/marketing/home/Derisk.tsx`:
```tsx
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { Reveal, RevealGroup } from "@/components/marketing/Motion";
import { FaceStack } from "@/components/marketing/LeadershipStrip";
import { cn } from "@/lib/utils";

// The 8.125rem spec column is the measure Recognition.tsx uses for its badge
// track from sm, so the two ledgers on the page share one spec column. The
// literal is duplicated on purpose: ROW_GRID is file-local there and stays so.
const ROW_GRID = "grid grid-cols-1 gap-x-6 sm:grid-cols-[8.125rem_minmax(0,1fr)] lg:gap-x-10";
// List rows add a third track at lg so title and body sit side by side.
const LIST_ROW = cn(ROW_GRID, "lg:grid-cols-[8.125rem_minmax(0,1fr)_minmax(0,2fr)]");

/**
 * "Low-risk by design": four points as a ruled ledger, then the build-vs-buy
 * case as a footer on the same tracks. The ledger pattern is Recognition's;
 * the footer-under-a-list is ServicesGrid's engagement block.
 */
export async function Derisk() {
  const t = await getTranslations("home");
  const cards = t.raw("derisk.cards") as { label: string; title: string; body: string }[];

  return (
    <Section className="section-tint">
      <SectionHeading
        eyebrow={t("derisk.heading.eyebrow")}
        title={t("derisk.heading.title")}
        intro={t("derisk.heading.intro")}
      />

      <RevealGroup as="ul" className="mt-12 border-t border-border">
        {cards.map((d, i) => (
          <li key={d.title} className={cn(LIST_ROW, "items-baseline border-b border-border py-5 md:py-6")}>
            <p className="flex items-baseline gap-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em]">
              <span className="font-normal tabular-nums text-muted">{`0${i + 1}`}</span>
              <span className="text-primaryDeep">{d.label}</span>
            </p>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground sm:mt-0">{d.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted sm:col-start-2 lg:col-start-3 lg:row-start-1 lg:mt-0 lg:max-w-2xl">
              {d.body}
            </p>
          </li>
        ))}
      </RevealGroup>

      {/* The build-vs-buy case: same risk-reduction beat, now carrying the
          speed/cost contrast against hiring in-house, so the whole "safe bet"
          story lands in one place. No border of its own: the last row's
          border-b is its rule, as in Recognition's CTA row. */}
      <Reveal delay={280}>
        <div className={cn(ROW_GRID, "pt-8 md:pt-10")}>
          <span aria-hidden="true" className="hidden sm:block" />
          <div>
            <p className="max-w-3xl text-balance font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
              {t.rich("derisk.panel.headline", {
                weeks: (c) => <span className="text-primaryDeep">{c}</span>,
                months: (c) => <span className="text-red">{c}</span>,
              })}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t.rich("derisk.panel.body", {
                nearshore: (c) => (
                  <Link href="/nearshore" className="link-underline font-medium text-primaryDeep">
                    {c}
                  </Link>
                ),
              })}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* The CTA promises a person; show the actual people. */}
              <FaceStack slugs={["eduardo-ramos", "jc-rodriguez", "rene-trevino"]} />
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">{t("derisk.panel.ctaPrimary")}</Link>
                <Link href="/partnership" className="btn-ghost">{t("derisk.panel.ctaGhost")}</Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
```
The spec line is PlateCard's spec-line typography (`Cards.tsx:33`) minus `justify-between`, plus `tabular-nums` on the ref, ordered ref-first so the numbers form a column at x 24 on every row. The footer spacer is modelled on Recognition's CTA-row spacer (`Recognition.tsx:167` is a bare `<span aria-hidden="true" />`); `hidden sm:block` is added here because this `ROW_GRID` is single-column below sm, so the spacer must not occupy a row there. The ref code `0${i + 1}` is generated in the map as `page.tsx:97` does today.

`app/[locale]/(marketing)/page.tsx`: delete line 40 (`const t = await getTranslations("home");`; every use of `t` is inside the deleted block, `getTranslations` stays imported for `generateMetadata`); delete line 48 (`const derisk = t.raw(...)`); delete lines 89-133 (the whole `<Section className="section-tint">` block) and put `<Derisk />` directly under the `{/* 3) HOW TO BUY IT: quiet the "big bet" fear */}` comment, keeping the comment. Delete the now-unused imports: line 8 (`Section, SectionHeading`), line 9 (`Link`), line 12 (`RevealGroup`), line 16 (`PlateCard`), line 17 (`FaceStack`). Add `import { Derisk } from "@/components/marketing/home/Derisk";` beside the other home imports. Lines 68-76 (the logo band) and every other section call stay byte-identical.

Classes removed (no longer rendered on home): `page.tsx:95` `mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4` and `variant="pop"`; `page.tsx:106` `panel-warm mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 shadow-soft md:flex-row md:items-center md:p-8`; `page.tsx:124` `shrink-0`; PlateCard's `group relative h-full overflow-hidden border border-border bg-surface p-6`, its four tick spans and its label-then-ref order.

Classes added: ul `mt-12 border-t border-border`; li `LIST_ROW` + `items-baseline border-b border-border py-5 md:py-6`; spec p `flex items-baseline gap-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em]`, ref `font-normal tabular-nums text-muted`, label `text-primaryDeep`; h3 `mt-2 font-display text-lg font-bold leading-snug text-foreground sm:mt-0`; body `mt-1.5 text-sm leading-relaxed text-muted sm:col-start-2 lg:col-start-3 lg:row-start-1 lg:mt-0 lg:max-w-2xl`; footer div `ROW_GRID` + `pt-8 md:pt-10`; spacer `hidden sm:block`; headline adds `max-w-3xl` to today's classes; body p, CTA row and button group unchanged.

Props: `Derisk` takes none. No shared primitive gains a prop.

**Before (1280).**
```
[LOW-RISK BY DESIGN]
A big bet that doesn't feel like one
intro ..........................................

+-------------+ +-------------+ +-------------+ +-------------+
|PROOF      01| |CONTROL    02| |PACE       03| |RUN        04|
|Prove it     | |The sponsor  | |Value from   | |Documented,  |
|first        | |stays in ctl | |sprint one   | |then kept    |
|body 3 lines | |body 3 lines | |body 4 lines | |improving    |
|             | |             | |             | |body 4 lines |
|   76px fill | |   76px fill | |   53px fill | |   25px fill |
+-------------+ +-------------+ +-------------+ +-------------+
  (bg-surface plates on the surface2 ground, 1px border, corner ticks)

+-----------------------------------------------------------------+
| 8-16 weeks to production with the      (o)(o)(o) [Talk] [See]   |
| team already in place, instead of ...                           |
| body 3 lines ..............                                     |
+-----------------------------------------------------------------+
  (panel-warm, rounded-2xl, shadow-soft, p-8; at 768-1023 the text column is 130px)
```

**After (1280).**
```
[LOW-RISK BY DESIGN]
A big bet that doesn't feel like one
intro ..........................................

--------------------------------------------------------------------------  border-t
01 PROOF     Prove it first                 A focused proof of concept before the full build.
                                            The decision to scale rests on evidence ...
--------------------------------------------------------------------------  border-b
02 CONTROL   The sponsor stays in control   Regular steering, a shared backlog, and clear
                                            decision gates keep scope, budget ...
--------------------------------------------------------------------------
03 PACE      Value from sprint one          Use-case-driven sprints reach production in
                                            8-16 weeks, with working software demoed ...
--------------------------------------------------------------------------
04 RUN       Documented, then kept          Documentation and runbooks ship with the build.
             improving                      From there the team runs it, or Viewnear ...
--------------------------------------------------------------------------
             8-16 weeks to production with the team already
             in place, instead of hiring and ramping one first.
             A nearshore team with SnowPro-certified engineers ... (max-w-2xl)
             (o)(o)(o)  [Talk to an architect]  [See the comparison]
|<-8.125rem->|<--------- 1fr --------->|<----------------- 2fr ----------------->|

below sm:
----------------------------
01 PROOF
Prove it first
A focused proof of concept ...
----------------------------
02 CONTROL
...
----------------------------
8-16 weeks to production ...
body
(o)(o)(o)
[Talk to an architect]
[See the comparison]
```
The sketches are illustrative: the real copy reads `8–16 weeks` with an en dash (`home.json` `derisk.panel.headline` and `cards[2].body`) and is read unchanged; nobody normalizes that dash while implementing.

**Desktop.** lg and up: three tracks. At 1280 the spec column starts at x 24, titles at 194, bodies at 575 with a 672px measure (`max-w-2xl`); at 1024 titles at 194, bodies at 489, 511px wide. Rows in the mock (`derisk-mock-measure.json`): 74 / 74 / 97 / 97 at 1280 en (ledger 342px, was a 232px grid plus up to 76px of fill per plate), 97 x 4 at 1280 es (387px), 97 to 99 at 1024 en, 97 to 119 at 1024 es. Titles that wrap (row 4 at 1024, rows 2 and 4 in es) wrap inside their own track without moving the body, so the four bodies start on one x and the first lines of all three cells sit on one baseline in every row (mock: first-character rect bottoms 4399 / 4402 / 4400, the 1 to 3px being descender differences between 10 / 18 / 14px type). The footer's headline and CTA row start at x 194, the titles' left edge, with the spec column left empty above the faces exactly like Recognition's CTA row. Footer 253px from md up. Section at 1280: about 995px en (887 today), about 1115px es (1039 today). The 1024 squeeze disappears because the actions sit under the text, never beside it.

**Mobile.** sm to lg (640-1023): two tracks, the spec column then the title with the body stacked under it (`sm:col-start-2`), `gap-x-6`; Recognition's layout at the same widths. At 768 the rows are 125px, titles and bodies at x 178, and the footer text runs 566px wide instead of today's 130px. The longest spec, es `04 OPERACIÓN`, measures about 98px and fits the 130px track on one line. Below sm (375): one column per row, spec line, title (`mt-2`), body (`mt-1.5`), hairline; rows 163px en (186 for the wrapping es row 4), everything at x 24. Footer below sm: headline, body, then faces above the two stacked buttons, as today minus the box. Section at 375: about 1508px en (1784 today), about 1610px es (1955 today).

**Motion.** `RevealGroup as="ul"`, default `fade-up`, so the four li cascade at 0 / 70 / 140 / 210ms; `variant="pop"` (a scale-0.95 overshoot, a card entrance) is dropped. Footer `Reveal delay={280}` continues the cascade after the fourth row (Recognition uses 210 after three). Reduced motion: the existing override covers it. No hover states: the rows are not links, and the tick-brightening hover disappears with the plates. Buttons keep their own `.btn` hover.

**A11y.** A real list, `ul > li x4`. Each row keeps one h3, so the outline keeps the same four h3 under the section h2 from `SectionHeading`. The ref code stays visible text (not a list marker, not aria-hidden). The footer's empty first cell is `aria-hidden`. The headline stays a `<p>`, the body keeps its `/nearshore` link, the two CTAs stay Links with their current text. Nothing is carried by color alone: label and number are text; the weeks/months spans are emphasis on copy that reads correctly in black. Smallest text is the `0.64rem` mono spec, the size PlateCard renders today.

**Copy impact.** none. `home.derisk.heading.eyebrow/title/intro`, `home.derisk.cards[].label/title/body`, `home.derisk.panel.headline` (weeks and months tags), `home.derisk.panel.body` (nearshore tag), `home.derisk.panel.ctaPrimary`, `home.derisk.panel.ctaGhost` are read unchanged. The `01` to `04` codes are generated in code, as today. Neither `home.json` is touched.

**Effort.** M (one new file of about 80 lines, one page edit).

**Risk.** Low to medium. (1) Hairline legibility: `border-border` (`#E0EBF4`) on the section-tint ground (`#EAF4FB`) is a 3-point lightness step; it reads in `derisk-mock-en-1280.png` but is fainter than on Recognition's white ground. If the owner finds it faint, raise it with him before touching anything: hairlines on this page are neutral `border-border` only (rule 6 here, rule 16 in the positioning guide: neutral hairlines only), so the answer is not a tinted or colored rule on one section, and never a fill or a box. If he wants every rule darker, that is a `--color-border` token decision outside this guide. (2) Page length: at 1280 the section grows about 108px en / 76px es; at 375 it shrinks 276 / 345. (3) The warm moment inside the cool band disappears on purpose; the page keeps three warm bands. (4) The blueprint plates were a house primitive the owner has not explicitly rejected; they remain on six other pages, so this is a one-section removal reversible by one revert. (5) Tablet widths (768-1023) are the clearest win and a reviewer looking only at 1280 under-sees it: show `derisk-before-en-768.png` beside the after.

**Verify.**
- `npx tsc --noEmit`; `npx eslint "components/marketing/home/Derisk.tsx" "app/[locale]/(marketing)/page.tsx"` (no unused imports left in page.tsx: `Section`, `SectionHeading`, `Link`, `RevealGroup`, `PlateCard`, `FaceStack`, and the home `t`); `npx vitest run`.
- `git diff -- "app/[locale]/(marketing)/page.tsx"` shows no change to lines 68-76 (the PROOF EARLY comment and the `pt-2 pb-2 md:pt-4 md:pb-3` wrapper) or to any other section call; `git diff --stat` touches only `page.tsx` and the new `Derisk.tsx`.
- Both locales, 375 / 768 / 1024 / 1280, Playwright with `reducedMotion: reduce`, reusing the measurement block of `mock-derisk.mjs`; the expected numbers below come from it.
- Structure: `section.section-tint` contains exactly one ul with 4 li and 4 h3; no element has a non-zero computed border-radius except the 3 FaceStack imgs and the 2 `.btn` links. Inside the ul, every li, the footer div and their descendant p / h3 / span elements: background-color transparent, background-image none, box-shadow none. The only painted elements in the section are the section itself, the `.eyebrow` (its 0.12 fill and inset hairline are pre-existing, `globals.css:89-97`), the two `.btn` links and the three FaceStack imgs (their `ring-2` is a box-shadow). Hairlines: ul `border-top: 1px rgb(224,235,244)`; each li `border-bottom: 1px` same; zero elements with a left or right border.
- Alignment at 1280 (en and es): every li's spec p at x 24, h3 at 194, body p at 575 with width 672; footer headline, body and CTA row at x 194. At 1024: 24 / 194 / 489 (body 511 wide). First-line baselines per li: spec, h3 and p first-character rect bottoms within 3px.
- Row heights at 1280 within a few px of 74 / 74 / 97 / 97 en and 97 x 4 es; no li taller than 120px; ul about 342px en / 387px es; footer 253px from md up; section about 995px en / 1115px es (was 887 / 1039).
- 768: two tracks; h3 and p both at x 178, p under h3; the footer headline at least 560px wide (today 130) and 2 lines en, 3 es; no horizontal scroll; the es spec `04 OPERACIÓN` on one line at 640, 768 and 1024.
- 375: every spec, h3 and p at x 24, width 327; rows about 163 (es row 4 about 186); footer stacks headline, body, faces, then the two buttons; section about 1508 en / 1610 es (was 1784 / 1955).
- Motion (`no-preference`): the four li reach opacity 1 after scrolling into view and the footer `.reveal` gets `is-visible`; under `reduce` everything is opacity 1 immediately.
- Visual: screenshot the section at 1280 en, 1280 es, 768 en, 375 en and compare with `derisk-mock-*.png` (same composition expected) and with `derisk-1280-crop.png` / `derisk-before-en-768.png` (the before). Confirm the hairlines are visible on the tint at 1x; if not, raise it before touching color.
- Regression: `/approach`, `/about`, `/security`, `/services` still render their PlateCard grids unchanged (spot-check one); `/case-studies`, `/pricing` still render `.panel-warm`.
- `git diff -- messages/` empty.

**Commit.** Stage `components/marketing/home/Derisk.tsx` and `app/[locale]/(marketing)/page.tsx` by name. Message: `feat(home): the de-risk plates and the warm panel become one ruled ledger`, body: four plates were equal only by stretching (up to 76px of fill), the panel collapsed its text column to 130px at tablet widths, both now rows and a footer on the section ground on the 8.125rem spec column Recognition uses; PlateCard and `.panel-warm` untouched for their other pages; no copy changed. Do not push.

---

### Step 6: Customers, owner-gated. The engagement label joins the meta line; the metrics stack below sm.

**Ask first.** `CustomersFeature` is on the guide's section 2 leave-as-is list ("Leave CustomersFeature as it is except for adding Magnolia as a second story if it fits without new chrome"). The frame, photo, arrows, header and crossfade are not touched here, and nothing adds chrome, but the identity row is something the owner has looked at many times. Present this step as an opt-in; a "no" skips steps 6 and 7 with nothing lost. Ship it alone so a later "no" costs one revert.

**Purpose.** Remove the one tinted plate in the section, the `rounded-full bg-surface2` label pill, by folding its text into the existing mono meta line, so both slides have the same row structure at every width; and stack the two metric blocks below sm so the English value never breaks its baseline.

**Why now.** Three things inside the section cost something (`customers-measure.json`). (1) The engagement label is a tinted rounded pill (`rounded-full bg-surface2 px-2.5 py-1`, 132x22, fill `#EAF4FB`): the only `rounded-full` pill on the rendered home page, a plate behind a label in a section whose client logos and the Magnolia mark are otherwise bare, and the one surface in the section that meets the card test (fill plus radius plus box padding). It also moves: beside the logo at 1280 (x 324.5, y 1167), under the logo on its own line at 375 (y 1673), and on slide 2 at 1024 it wraps under the client name (pill y 1174 vs name y 1130), so the recurring element is not in the same place on every slide or width. (2) At 375 on the EN first slide the value `15–19 hrs` (26.4px display bold in a 122.5px track) breaks onto two lines: value bottoms 1929.9 vs 1890.3, value heights 79.2 vs 39.6, so the two metric labels start 40px apart. The ES value `15–19 h` fits, so the break is locale-dependent today. (3) The closing LogoRow orphan is step 7. Everything else already follows the rules: equal metric tracks (212px each at 1280), header bottoms aligned (h2 and ghost button both end at y 1017), three logos on one baseline, no colored rails, no plates behind logos.

**Keeps.** The split frame (`CustomerStories.tsx:174`: `rounded-3xl border border-border bg-background shadow-soft-lg`, 1232x659 at 1280, 327x694 at 375): a single featured story with its photograph filling half the object, the deliberate keep like Recognition's photo frame. The four arrows (`arrowBase` 123-128, placed at 257 / 266 / 281 / 290): buttons, fought over many rounds. The metric left rules (`border-l border-border pl-4`): a vertical hairline between two equal tracks, allowed. The header row (135-152). The bottom LogoRow logos themselves. The `.section-warm` band and its padding (`CustomersFeature.tsx:94`).

**Files.** `components/marketing/home/CustomerStories.tsx` only (one consumer: `CustomersFeature.tsx`; no other file references it; `FeaturedCaseStudies.tsx:12` mentions `CustomersFeature` in a comment only).

**Edit.**

Lines 194-203, current:
```tsx
<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
  {s.logo ? (
    <Image ... className="h-7 w-auto md:h-8" />
  ) : (
    <span className="font-display text-xl font-bold text-foreground md:text-2xl">{s.client}</span>
  )}
  <span className="rounded-full bg-surface2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
    {s.badge}
  </span>
</div>
```
Replacement: the wrapper becomes `<div className="flex items-center">`; the badge `<span>` (lines 200-202) is deleted; the logo `Image` and the client-name span stay as they are.

Lines 204-206, current:
```tsx
<p className="mt-4 font-mono text-xs uppercase tracking-wider text-primaryDeep">
  {s.sector} · {s.region}
</p>
```
Replacement: same classes, text `{s.sector} · {s.region} · {s.badge}` (the middle dot and spacing the line already uses). The `CustomerStory` type keeps `badge: string`; `CustomersFeature.tsx` keeps passing `t("customersFeature.badgeAgentic")` and `t("customersFeature.badge")` unchanged.

Line 211, current: `<div className="mt-8 grid max-w-md grid-cols-2 gap-6">`. Replacement: `<div className="mt-8 grid max-w-md gap-6 sm:grid-cols-2">`. The metric block at line 213 and its two children are unchanged.

No docblock change is needed (lines 8-15 describe the split card, logo-or-description, headline, two stat blocks and the read link; no chip is mentioned).

Classes removed: wrapper `flex-wrap gap-x-4 gap-y-3`; the whole badge span `rounded-full bg-surface2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted`; metrics grid `grid-cols-2` (unprefixed). Classes added: metrics grid `sm:grid-cols-2`. Props: none.

If the owner wants only one of the two hunks, they are independent: drop hunk A (pill) and ship hunk B (metrics stack) alone as `fix(home)`, or the reverse.

**Before / after.**
```
1280, before (copy column)                   1280, after
[Magnolia Doors logo] (AGENTIC ENGAGEMENT)   [Magnolia Doors logo]
MANUFACTURING . SAN ANTONIO, TX              MANUFACTURING . SAN ANTONIO, TX . AGENTIC ENGAGEMENT
Installation scheduling                      Installation scheduling
from 17 hours a week to under two            from 17 hours a week to under two
summary paragraph                            summary paragraph
| 15–19 hrs        | ~3 min                  | 15–19 hrs        | ~3 min
| label            | label                   | label            | label
Read the case study ->                       Read the case study ->

375, before (after the photo)                375, after
[Magnolia Doors logo]                        [Magnolia Doors logo]
(AGENTIC ENGAGEMENT)     <- own line         MANUFACTURING . SAN ANTONIO,
MANUFACTURING . SAN ANTONIO                  TX . AGENTIC ENGAGEMENT
| 15–19     | ~3 min    <- value wraps,      | 15–19 hrs             <- one metric per row
| hrs       | label        labels 40px apart | label
| label     |                                | ~3 min
                                             | label
```
(The values are written as the catalog strings read, with the en dash: `15–19 hrs` en, `15–19 h` es; neither string is touched.)

**Desktop.** 1280: frame unchanged. Row 1 is the identity alone (Magnolia logo `h-7 md:h-8`, or the client name at `text-xl md:text-2xl`, both 28px below md and 32px from md, so row 1 has the same height on both slides). Row 2 is one mono line on both slides at 1280 (slide 1 is 51 characters at about 7.8px per character in JetBrains Mono 12px with `tracking-wider`, about 398px in a 503px column; slide 2 is 45 characters). Metric tracks 212px each, gap 24, values on one baseline. 1024: the copy column offers 391px; slide 1's meta line (about 398px) may wrap to two lines while slide 2's stays on one, so the h3 on slide 1 starts 16px lower than today at that one width. This is inside existing behavior (content heights already differ by 48px between slides and the column is `justify-center`). If the owner dislikes it, the fallback is the label as its own bare line above the identity row using the class string ServicesGrid uses for its engage eyebrow (`font-mono text-xs uppercase tracking-[0.2em] text-muted`) with `mt-3` on the identity row; that never wraps (19 characters) and sits in the same place on every slide at every width.

**Mobile.** 375: photo on top (327x204), copy below with `p-7`. Row 1 is the logo (28px) or the client name (today the two-word name wraps to 56px, unchanged). Row 2 wraps to two lines on both slides (51 and 45 characters against 269px), which costs 16px where the pill's own line cost 34px today (22px pill plus 12px `gap-y-3`), so the column gets about 18px shorter. Metrics stack one per row below sm: each block keeps `border-l border-border pl-4`, full 269px wide, `gap-6` between them, values on one line each; the stack is about 136px tall against 118px today. 768: copy column 638px, meta line one line on both slides, metrics two tracks of 299px.

**Motion.** No `Reveal` in this section today and none is added; the carousel's own 300ms crossfade (`transition-opacity`, `motion-reduce:transition-none`) is unchanged.

**A11y.** Region and slide semantics unchanged (`role=region`, `aria-roledescription=carousel`, slides as `role=group` with `aria-hidden` on the inactive one, the live region). The engagement label moves from a span in the identity row into the kicker `<p>`, so a screen reader still hears identity, then one meta line with sector, region and engagement type, then the headline; the middle dots are already in the read text. Metrics stay two divs; stacking does not change reading order. Focus rings and the inactive-slide `tabIndex` handling untouched.

**Copy impact.** none. `customersFeature.badge`, `badgeAgentic`, `agentic.sector`, `agentic.region`, `featured.sector`, `featured.region` are consumed exactly as today, only composed on one line in JSX. Both `homeServer.json` files untouched.

**Effort.** S.

**Risk.** Low to medium, for one reason: the component is on the owner's leave-as-is list. Technical risk is small: plain utilities, no arbitrary variants, no copy keys. One visual trade-off to check by eye: slide 1's meta line at 1024 to about 1040 (fallback above).

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/CustomerStories.tsx`, `npx vitest run` clean; `git diff --stat` shows one file; `git diff -- messages/` empty.
- Playwright at 375, 768, 1024, 1280, both locales, after revalidate: `document.querySelectorAll('[role="region"][aria-roledescription="carousel"] span.rounded-full').length === 0`; the active slide's `p.font-mono` contains the badge text (`Agentic Engagement` / `Snowflake Cortex AI`, and the ES twins).
- Identity row height equal on both slides at a given width: measure the first child of the copy column on slide 1 and, after clicking the visible Next button, on slide 2: 28px below md, 32px from md.
- 375 EN, slide 1: the two metric value elements have equal bottoms (today 1929.9 vs 1890.3); the two blocks share x (53), are stacked with a 24px gap, each 269 wide.
- 1280 and 1024: the region rect is unchanged (1232x659 at x 24 at 1280; 976x695 at 1024), border 1px `#E0EBF4`, radius 24px, bg `#FFFFFF`, `shadow-soft-lg`; the two lg arrows still at x 12 and 1220 (1280) and vertically centered on the card.
- 1024, slide 1: the kicker p height. 16px: done. 32px (wrapped): screenshot both slides for the owner and apply the fallback only if asked.
- Screenshots at 1440 and 390, both locales, both slides, viewed by eye.

**Commit.** Stage `components/marketing/home/CustomerStories.tsx` by name. Message: `fix(home): the engagement label joins the meta line; metrics stack below sm`, body: the surface2 pill was the one tinted plate in the section and sat in a different place on every slide and width; the EN value broke its baseline at 375; frame, photo, arrows, header and crossfade untouched. Do not push.

---

### Step 7: Customers, owner-gated. The odd logo centers under the pair on mobile.

**Ask first.** Same gate as step 6, plus one more: this is one logo alone on its row by design. Below md, three logos cannot form equal rows (Difrenosa at `h-9` is 211px wide; a third of 327 is 97px, so a 3-up is impossible). Today the third logo fills the left cell with the right cell empty; the proposal spans it across both tracks and centers it so the mobile band reads as a deliberate 2 plus 1. If the owner prefers, leave `LogoRow` untouched and accept today's left-filled cell: that is a valid "no".

**Purpose.** An opt-in prop on `LogoRow` so that, when the count is odd at mobile, the last logo spans both columns and centers under the pair. Only `CustomersFeature` passes it; every other consumer renders byte-identical markup.

**Why now.** At 375 the closing LogoRow is a 2-column grid with three logos: Hussmann and Lendz on row one, Difrenosa alone in the left cell of row two (x 24, w 147.5, right cell empty), the exact "nothing alone in a row" case, in a band whose top twin (four logos, 2x2) has no orphan.

**Keeps.** Everything in `LogoRow`'s default output. The top band (`page.tsx:72-76`) and the other five consumers are not touched: `nearshore/page.tsx:96`, `snowflake-consulting-services/page.tsx:140`, `TrustBar.tsx:31` (via `TrustLogos`, used on `/about` and `/services`), `components/admin/ClientBandsEditor.tsx:195` (admin live preview; import at line 5).

**Files.** `components/marketing/home/ClientLogos.tsx`, `components/marketing/home/CustomersFeature.tsx` line 104.

**Edit.**

`ClientLogos.tsx`: add to the props (with a one-line doc comment: odd count at mobile, the last logo spans both columns so it centers under the pair; flex at md+ ignores `grid-column`):
```tsx
centerOrphan = false,
...
centerOrphan?: boolean;
```
In the map, line 46, current: `className="h-9 w-auto md:h-10"`. Replacement:
```tsx
className={cn(
  "h-9 w-auto md:h-10",
  centerOrphan && logos.length % 2 === 1 && i === logos.length - 1 && "col-span-2",
)}
```
`cn` is already imported in this file (`lib/utils.ts` `cn` is a plain join, not tailwind-merge, which is why this is additive rather than an override of `grid-cols-2`). `place-items-center` on the grid already centers the spanning logo.

`CustomersFeature.tsx` line 104, current: `<LogoRow logos={bottomLogos} className="mt-12 md:mt-14" />`. Replacement: `<LogoRow logos={bottomLogos} className="mt-12 md:mt-14" centerOrphan />`.

Classes removed: none. Classes added: `col-span-2`, conditionally, on the last img only when `centerOrphan` is true and the count is odd. Props added: `LogoRow.centerOrphan?: boolean`, default `false`.

**Before / after (375, bottom band).**
```
before                      after
HUSSMANN        LENDZ       HUSSMANN        LENDZ
DIFRENOSA                           DIFRENOSA
(x 24, right cell empty)    (spans both tracks, centered at x about 187)
```

**Desktop.** No change: at md and up the row is `flex` and `col-span-2` has no effect; three logos on one row, `justify-between` (gaps 335 / 336 at 1280), bottoms on one baseline (1828).

**Mobile.** 375: Hussmann and Lendz on row one as today (36px tall, bottoms about 2140); Difrenosa spans both columns and centers at x about 187 (today its center is at 98). The grid stays `grid-cols-2` at this width. The condition stays correct if the admin changes the bottom band to an even count.

**Motion.** None today, none added.

**A11y.** The orphan logo keeps its alt and its DOM position. No semantic change.

**Copy impact.** none. The band has no copy.

**Effort.** S.

**Risk.** Low. A shared primitive gains an opt-in prop with the current behavior as default; `cn` filters the `false` branch so the five other consumers render the same class string. Keep it as its own commit so it can be reverted alone.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/ClientLogos.tsx components/marketing/home/CustomersFeature.tsx`, `npx vitest run` clean; `git diff --stat` shows the two files; `git diff -- messages/` empty.
- 375 (en and es): the third bottom logo (alt Difrenosa) has its horizontal center at about 24 + 327/2 = 187; the first two stay on one row with equal heights of 36; the row computes `display: grid` with `grid-template-columns` of two tracks.
- md and up: the bottom LogoRow computes `display: flex`, three logos on one row, bottoms equal.
- The top band at 375 is unchanged (four logos, 2x2, no `col-span-2` on any img); re-run `measure-logoband.mjs` and compare with `logoband-measure.json`.
- Spot-check one other consumer at 375 (`/nearshore` or `/about`): no `col-span-2` anywhere in its logo row.

**Commit.** Stage `components/marketing/home/ClientLogos.tsx` and `components/marketing/home/CustomersFeature.tsx` by name. Message: `fix(home): center the odd logo under the pair on the mobile customers band`, body: an opt-in `centerOrphan` prop on `LogoRow`, default off, passed only from `CustomersFeature`; the other five consumers render unchanged. Do not push.

---

### Step 8: Careers. The open roles as a ruled ledger; both columns on four shared rows.

**Purpose.** Turn the single role card (and its two unrendered sibling branches) into one ruled ledger that reads the same with 0, 1 or 3 roles, and put the two columns on four shared rows with CSS subgrid so the eyebrow, the two h2s, the two bodies and the two lists each start on one y across the vertical rule.

**Why now.** The page's close has four boxes and no shared baseline. Left: the one open role sits in a white `rounded-2xl` box on the cream band, framing one entry of a list as a featured object, with the only royal `btn-primary` in the section competing with the booking action the page closes on. Right: three `BookingPills` are bordered, filled, shadowed, lift-on-hover cards capped at `max-w-sm` (384px) inside a 519px content column, so each pill drops to its own row with 135px of empty column to its right (26 percent of the content width, three times), at 12px gaps, loose tiles rather than a roster of three equals (step 9 handles those). The two columns are equal tracks (584 / 584 at 1280, 456 / 456 at 1024) but their headings do not pair: the left h2 is 30px and starts at y 5900 because the eyebrow row sits above it; the right h2 is 28px at y 5862, so the pair is 38px and 2px apart. Fills differ across the split (`#FFF` left, `#F6FAFD` right), shadows differ. The exact "disproportionate, no symmetry" complaint, at the last thing a reader sees.

**Keeps.** The two-column split (lines 34 and 108): equal `lg:grid-cols-2` tracks with a 1px `border-border` vertical rule on the right column (`border-l` + `pl-16`, rule at x 672 at 1280) that becomes `border-t` + `pt-10` below lg; rule structure, not a box, already Recognition's vocabulary. The `section section-warm` ground. The `.eyebrow` kicker. Both h2s: two independent asks with two headings is the documented intent and correct a11y; only the left h2's md size changes so the pair matches. `BookACall`'s render-nothing guard, the Calendly wiring, the warm-up, the GA4 event: behavior, untouched.

**Files.** `components/marketing/home/CareersTeaser.tsx` only. (`BookACall`'s existing `className` prop is used; no prop is added in this step.)

**Edit.** Replace the return block (lines 30-115) with:
```tsx
<section className="section section-warm">
  <div className="container-page">
    <Reveal>
      <div className="grid gap-12 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-16 lg:gap-y-0">
        {/* Left: the roles. Four subgrid rows: eyebrow, h2, body, ledger. */}
        <div className="lg:grid lg:grid-rows-subgrid lg:row-span-4">
          <p className="eyebrow mb-3 lg:justify-self-start">{t("eyebrow")}</p>
          <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
            {t("title")}
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{t("body")}</p>

          {/* mt-14 (56px) lands the ledger's top rule on the same y as the
              booking list on the right: mt-6 (24) + label (16) + mt-4 (16). */}
          <div className="mt-14">
            <ul className="border-t border-border">
              {roles.length === 0 ? (
                <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-border py-5 max-sm:grid-cols-1 max-sm:gap-y-2">
                  <p className="leading-relaxed text-muted">{t("empty")}</p>
                  <Link href="/careers" className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                    <span className="link-underline">{t("emptyCta")}</span>
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </Link>
                </li>
              ) : (
                roles.map((job) => (
                  <li
                    key={job.slug}
                    className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-border py-5 max-sm:grid-cols-1 max-sm:gap-y-2"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                        {job.employment}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-foreground">
                        <Link href={`/careers/${job.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{job.description}</p>
                    </div>
                    <span aria-hidden="true" className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                      <span className="link-underline">{t("viewRole")}</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </li>
                ))
              )}
            </ul>
            {roles.length > 0 && (
              <Link
                href="/careers#open-roles"
                className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
              >
                <span className="link-underline">{t("viewAll")}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right: talk to the team, own heading built into BookACall. The
            aria-hidden span fills row 1 (the eyebrow row) so the h2s pair;
            lg:contents lets BookACall's h2, body and pills become rows 2-4. */}
        <div className="border-t border-border pt-10 lg:grid lg:grid-rows-subgrid lg:row-span-4 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <span aria-hidden="true" className="hidden lg:block" />
          <BookACall variant="inline" className="lg:contents" />
        </div>
      </div>
    </Reveal>
  </div>
</section>
```
No JSX comment inside the `.map()` callback (rule 18). The `See all open roles` Link keeps `group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep` exactly as today (lines 97-103) and moves inside the row-4 div after the ul, still gated on `roles.length > 0`. Update the file's header comment (lines 8-24) to describe the ledger: the per-count layouts (featured card, stacked list, empty card) no longer exist.

Classes removed: line 44 (empty state) `mt-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-background p-6` and `btn-ghost shrink-0` on its Link; line 53 (one role) `mt-8 rounded-2xl border border-border bg-background p-6`; line 62 `btn-primary group mt-5 inline-flex` on View role (the string stays, as a text span in the trailing track); line 71 (2+ roles) `mt-8 space-y-3`; line 76 `group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/50`; line 38 `md:text-3xl` on the left h2.

Classes added: parent grid `lg:grid-rows-[auto_auto_auto_auto] lg:gap-y-0` (mandatory: subgrid inherits the parent's row gap, and today's `gap-12` would put 48px between every row inside each column); left column `lg:grid lg:grid-rows-subgrid lg:row-span-4`; eyebrow `lg:justify-self-start` (confirmed by DOM probe: once the left column is `display: grid`, the `inline-flex` eyebrow is blockified to `flex` and stretches from 138px to the full 584px column, turning the cut-corner tag into a full-width bar with the notch at the far right; `justify-self: start` returns it to 138px); left h2 `md:text-[1.75rem]` (BookACall inline's h2 size, line 87); row-4 wrapper `mt-14`; ul `border-t border-border`; li `group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-border py-5 max-sm:grid-cols-1 max-sm:gap-y-2`; title Link `after:absolute after:inset-0 after:content-['']`; description `mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted`; trailing span `inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep` with `link-underline` on the text and the arrow nudge; right column `lg:grid lg:grid-rows-subgrid lg:row-span-4` (existing border and padding classes kept); spacer `hidden lg:block`; BookACall `className="lg:contents"`.

Props: none added. Tailwind 3.4.15 ships `grid-rows-subgrid`, `contents` and the `max-*` variants (the config only customizes the container plugin's screens, so the default breakpoints apply).

**Before (1280).**
```
[JOIN THE TEAM]                               |  Rather just ask someone?        (h2 28px, y 5862)
Certified people, growing this practice.      |  Book 30 minutes with the person who would own
(h2 30px, y 5900)                             |  the work ...
Snowflake architects, engineers and ...       |
                                              |  BOOK TIME WITH
+------------------------------------------+  |  +----------------------------+
| FULL-TIME . REMOTE (USA, LATAM)           |  |  |(o) Eduardo Javier Ramos  [c]|  <- 135px empty
| Senior Data & AI Engineer                 |  |  |    CEO                      |
| Design, build, and scale modern data ...  |  |  |    Strategy, roadmap ...    |
| (full description)                        |  |  +----------------------------+
| [ View role -> ]  (btn-primary)           |  |  +----------------------------+
+------------------------------------------+  |  |(o) JC Rodriguez          [c]|
(white box, rounded 16, border, p-6)          |  |  ...                        |
                                              |  +----------------------------+
See all open roles ->                         |  +----------------------------+
                                              |  |(o) Rene Trevino          [c]|
                                              |  +----------------------------+
```

**After (1280, after step 8; the right list is still pills until step 9).**
```
row1  [JOIN THE TEAM]                              |  (empty spacer)
row2  Certified people, growing this practice.     |  Rather just ask someone?        (both h2 28px, same y)
row3  Snowflake architects, engineers and ...      |  Book 30 minutes with the person who would own
                                                   |  the work ...
row4                                               |  BOOK TIME WITH
      ---------------------------------------------|  (pills, until step 9; their top is on this y)
      FULL-TIME . REMOTE (USA, LATAM)              |
      Senior Data & AI Engineer     View role ->   |
      Design, build, and scale modern data and     |
      AI solutions on Snowflake, turning ... (2 l) |
      ---------------------------------------------|
      See all open roles ->                        |
```

**Desktop.** 1280: tracks 584 / 64 gap / 584, rule at x 672, right content from x 737, unchanged. Both h2 at 28px with tops equal via subgrid row 2; both bodies start on one y via row 3; both lists start on one y via row 4 (left `mt-14` = 56; right `mt-6` 24 + label 16 + `mt-4` 16 = 56, label measured 16px tall). Role row: kicker, title, two-line description, `View role →` vertically centered at the row's right edge. 1024: tracks 456 / 64 / 456; same structure; the description still clamps to two lines. ES at 1280: the left h2 wraps to two lines (72px), the right h2 one line, row 2 takes the taller; the right body is three lines, the left two, row 3 takes the taller; both ledgers still start on one y, which is the point of the subgrid.

**Mobile.** Below lg the parent is a single column with `gap-12` between the two blocks, as today: left block (eyebrow, h2 at `text-2xl`, body, roles ledger 327px wide, See all link), then the right block with its horizontal `border-t border-border pt-10` hairline preserved, h2, body, label, pills. Every subgrid, row-span, contents and spacer class is lg-only, so nothing changes structurally under lg beyond the card becoming rows. Below sm the li is `max-sm:grid-cols-1 max-sm:gap-y-2`, mandatory: measured at 327 the two-track main column is 224px while the mono kicker is 275px, so without the stack the kicker breaks to two lines; stacked, kicker, title, description and the arrow link each take the full 327px on one left edge.

**Motion.** Unchanged at the section level: the single `<Reveal>` wrapping the grid stays (its div sits between `.container-page` and the grid, so the subgrid is unaffected). Do not add `RevealGroup` stagger to either ledger: two side-by-side lists with different row counts (1 vs 3) and two independent staggers finishing at different times would read as jitter across the rule. Row hover: `.link-underline` sweep (driven by `.group:hover` on the li, so it fires from anywhere on the row) and the arrow nudge; nothing lifts.

**A11y.** Roles: `<ul>` with one `<li>` per role; the `<h3>` inside each row keeps the heading outline under the left `<h2>`; the row's one link is the title (stretched via `after:absolute after:inset-0` on a `relative` li), so the accessible name is the job title and there is one tab stop per role; the trailing `View role →` span is `aria-hidden` so screen readers do not hear two links to the same URL. Empty state: one `<li>` with the paragraph and a real `<Link>` (Send a resume) as the only link. The spacer `<span>` is `aria-hidden` and `hidden lg:block`. `display: contents` is applied only to BookACall's root `<div>`, which has no role, so no semantics are lost (the known `display: contents` a11y bug concerns elements with roles such as ul, button, table). Two `<h2>` in one section is current behavior and intended. `focus-visible` on the title link outlines the title text only, as any inline link.

**Copy impact.** none. `home.careers.{eyebrow,title,body,viewAll,viewRole,empty,emptyCta}` render from the same keys; `View role` and `Send a resume` change from button to text link but the strings, keys and destinations are identical. Both locale files untouched.

**Effort.** M.

**Risk.** Low to moderate. (1) First use of CSS subgrid and `display: contents` in this repo; browser support is universal in 2026. If Opus prefers not to put `lg:contents` on BookACall's root, the one-class fallback is `lg:pt-[2.3125rem]` on the right column (eyebrow 25px + `mb-3` 12px = 37px, measured), which aligns the h2 tops but not the bodies or the ledger rules; the subgrid is the version that stays aligned when the ES heading wraps. (2) Forgetting `lg:gap-y-0` inserts 48px between every row inside both columns. (3) The 0-role and 2+-role branches do not render on the current dev data (one published opening), so they must be exercised deliberately. (4) The stretched-link `after:` pseudo-element needs `relative` on the li and no other positioned wrapper inside the row, and `after:content-['']` is required for it to paint. (5) Hairlines are the cool `border-border` on the warm cream band; already the case for the section's vertical rule, the current role card and ServicesGrid's rule on the same band.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/home/CareersTeaser.tsx`, `npx vitest run` clean (no test references `CareersTeaser`, `BookingPills` or `BookACall`); `git diff --stat` shows one file; `git diff -- messages/` empty.
- Playwright at 1280 and 1024, en and es, reveals fired, on the last `<section>`: left h2 top y === right h2 top y (within 1px) and both computed font-size 28px at >= md; left body p top y === right body p top y; the roles ul `border-top` y === the top of the right column's row-4 content plus 56px (after step 9: === the booking ul `border-top` y); `grid-template-columns` still 584px 584px at 1280 and 456px 456px at 1024, column-gap 64px, row-gap 0px at lg; the right column still has `border-left-width: 1px` and `padding-left: 64px`; eyebrow width unchanged from today (138px en, 155px es at 1280).
- Inside the left column, count elements with `rounded-2xl`, `shadow-soft`, `bg-surface` or `bg-background`: 0.
- Role row at 1280 / 1024 / 375: the description has `-webkit-line-clamp: 2` and does not overflow; at lg the View role span sits in the trailing track vertically centered (center y within 2px of the li center y); hovering the li over the description (not the title) turns the arrow nudge and the link-underline on, proving the stretched link covers the row; clicking the description navigates to `/careers/senior-data-ai-engineer`.
- 375: `document.documentElement.scrollWidth === 375`; the right block still shows a 1px `border-top` and 40px `padding-top`; the roles ledger is 327px wide; the li computes one column track; the kicker is 16px tall (one line).
- Branch coverage: via the admin (or toggling `JobOpening.published` in the dev DB, then restoring), render with 0 roles (one hairline row: empty text left, Send a resume link right, no See all link) and with 3 roles (three rows, equal `py-5`, kicker / title / clamped description aligned, arrow link on every row at the same x, See all link under the ul). Remember `revalidate = 60`.
- a11y snapshot: the section exposes two h2, one h3 per role, a list of N roles; the spacer span and the View role span are not announced.
- Both locales visually at 1440 and 390: ES left h2 wraps to two lines at 584 and the right h2 still starts on the same y. Screenshots to the scratchpad; compare with `careers-1280-crop.png`.

**Commit.** Stage `components/marketing/home/CareersTeaser.tsx` by name. Message: `feat(home): the open roles as a ruled ledger, both careers columns on shared rows`, body: the one role card, its two sibling branches and the empty-state card collapse into one ruled list; the two columns sit on four subgrid rows so the eyebrow, h2s, bodies and lists pair across the rule; `View role` becomes a text link so the booking action keeps the only primary button. Do not push.

---

### Step 9: Careers. Booking people as ruled rows, through an additive prop on `BookingPills` and `BookACall`.

**Purpose.** The three booking pills become three full-width rows under a hairline (36px photo, name and title and topics, calendar glyph, on three tracks), with the current pill output left byte-identical for every other host, via `layout?: "pills" | "rows"` on `BookingPills` (default `"pills"`) and `pillsLayout?: "pills" | "rows"` on `BookACall` (default `"pills"`, forwarded only in the inline branch). Last step, because it is the only shared-code change beyond step 7's prop.

**Why now.** See step 8: three bordered, filled, shadowed, lift-on-hover cards capped at 384px in a 519px content column, each alone on its row with 135px of empty column to its right (26 percent, three times), at 12px gaps. After step 8 the left column is a ledger and the right is still tiles, so the split is asymmetric until this ships; steps 8 and 9 are best shipped in one sitting.

**Keeps.** The avatars (36px, `h-9 w-9 rounded-full object-cover`, no ring, no plate): a photograph of a real person is the recurring object of each row and stays bare in the first track. The anchors' href, `target`, `rel`, `onClick`, `aria-label`; the Calendly popup wiring, the IntersectionObserver and hover warm-up, the GA4 event (`BookingPills.tsx:77-141`). The label p. The `size` and `tone` branches and the default `"pills"` output.

**Files.** `components/marketing/BookingPills.tsx`, `components/marketing/BookACall.tsx`, `components/marketing/home/CareersTeaser.tsx` (one attribute).

**Edit.**

`BookingPills.tsx`. Props (lines 50-76): add `layout = "pills"` to the destructuring and to the type:
```tsx
/**
 * "rows" is a hairline ledger for a column that is only this list (the home
 * careers close): full-width rows under a border-t, no card chrome. "pills"
 * stays for the band, compact and dark-scrim hosts.
 */
layout?: "pills" | "rows";
```
Render (line 168 onward): before the existing `<div className={size === "lg" ? ... : ...}>`, add a branch so the existing div and its contents stay byte-identical:
```tsx
{layout === "rows" && hasPeople ? (
  <ul className="mt-4 border-t border-border">
    {people.map((p) => (
      <li key={p.slug}>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={open(p.url)}
          aria-label={p.ariaLabel}
          className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-border py-5 text-left transition-colors"
        >
          {p.photo ? (
            <Image src={p.photo} alt="" width={36} height={36} sizes="36px" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span aria-hidden="true" className="h-9 w-9" />
          )}
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-sm font-semibold text-foreground group-hover:text-primaryDeep">{p.name}</span>
            <span className="block text-xs text-muted">{p.title}</span>
            {p.topics && <span className="mt-1 block text-xs leading-snug text-muted/90">{p.topics}</span>}
          </span>
          <CalendarIcon />
        </a>
      </li>
    ))}
  </ul>
) : (
  <div className={size === "lg" ? "mt-5 flex flex-col gap-3" : "mt-4 flex flex-wrap gap-3"}>
    {/* existing contents, lines 169-248, unchanged */}
  </div>
)}
```
The text span is today's `span.min-w-0.flex-1.leading-tight` (line 207); `flex-1` is inert in a grid and may stay. The photo-less placeholder keeps the text track from shifting. `layout === "rows"` with no bookable people falls through to today's `btn-primary` fallback inside the existing div (a button, not a card).

`BookACall.tsx`. Props (lines 26-47): add `pillsLayout = "pills"` and
```tsx
/** Layout of the pills in the "inline" variant only; the band and compact variants ignore it. */
pillsLayout?: "pills" | "rows";
```
In the inline branch (lines 97-103) add `layout={pillsLayout}` to the `<BookingPills ... />` call. Nothing else in the file changes; the inline h2 keeps `md:text-[1.75rem]`.

`CareersTeaser.tsx`: `<BookACall variant="inline" className="lg:contents" />` becomes `<BookACall variant="inline" pillsLayout="rows" className="lg:contents" />`.

Classes removed (rows layout only, not from the default path): line 168 `mt-4 flex flex-wrap gap-3`; lines 182-185 `border border-border bg-surface py-2 pl-2 pr-5 shadow-soft hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-soft-lg` and the conditional `max-w-sm rounded-2xl` / `rounded-full`. Classes added (rows layout): ul `mt-4 border-t border-border`; anchor `group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-border py-5 text-left transition-colors`; placeholder `h-9 w-9`. Props added: `BookingPills.layout?: "pills" | "rows"` default `"pills"`; `BookACall.pillsLayout?: "pills" | "rows"` default `"pills"`.

**Before / after (1280, right column).**
```
before                                      after
BOOK TIME WITH                              BOOK TIME WITH
+----------------------------+              -------------------------------------------  <- same y as the roles rule
|(o) Eduardo Javier Ramos [c]|  135px empty (o)  Eduardo Javier Ramos                [c]
|    CEO                     |                   CEO
|    Strategy, roadmap ...   |                   Strategy, roadmap sequencing, ...
+----------------------------+              -------------------------------------------
+----------------------------+              (o)  JC Rodriguez                        [c]
|(o) JC Rodriguez         [c]|                   Head of Service Delivery
+----------------------------+                   Delivery model, team shape, ...
+----------------------------+              -------------------------------------------
|(o) Rene Trevino         [c]|              (o)  Rene Trevino                        [c]
+----------------------------+                   Head of Document Intelligence
(3 x 384x91, bg #F6FAFD, shadow-soft)            Unstructured documents, ...
                                            -------------------------------------------
(o) = bare 36px photo, same x on every row.  [c] = calendar glyph, same right edge on every row.
```

**Desktop.** 1280: three full-width rows (519px, not 384), avatar left edge at x 737 on every row, calendar glyph right edge at x 1256 on every row, `py-5`. Rows about 92 to 110px depending on whether the topics line wraps in the about 431px text track (at 1024 the text track is about 303px and topics wrap, giving rows nearer 110px); all three rows within one text line (about 16px) of each other. With step 8's `mt-14` on the left, the booking ul's top hairline lands on the same y as the roles ul's top hairline. No border, fill, radius, shadow or lift on the anchor.

**Mobile.** Below lg the right block stacks under the left as today with its `border-t pt-10`; the rows run the full 327px: 36px avatar + text (about 240px) + glyph fit; topics wrap to two lines as they do today inside the 327px pills.

**Motion.** Row hover: name and glyph recolor to `primaryDeep` (existing classes); the pills' `hover:-translate-y-0.5` and `hover:shadow-soft-lg` are not carried over (nothing lifts in a ledger). No stagger (see step 8). Reduced motion: no new transitions beyond color.

**A11y.** `<ul>` / `<li>` around the existing anchors, which keep `aria-label` ("Book 30 minutes with {name}" / "Agendar 30 minutos con {name}"), the `target="_blank"` fallback and the Calendly `onClick`. The section exposes a list of 3 booking links. The avatar stays `alt=""` (the aria-label names the person).

**Copy impact.** none. `booking.compact.{title,body}`, `booking.pills.{label,aria}`, `booking.cta` render from the same keys in both locales.

**Effort.** S for the code, M for the regression pass across hosts.

**Risk.** Low to moderate: a new code path in a shared client component. The default path is untouched by construction (the new branch wraps the existing div), but every `BookACall` host must be eyeballed once; the regression screenshot pass below is mandatory, not optional. The rows layout uses `border-border` hairlines and is only specified for tone `"light"`; `ServiceClose` keeps pills on its dark scrim, so no dark-hairline variant is needed. Do not promote the roles or booking ledger to a shared `RowList` in `ui.tsx`; the careers page (`careers/page.tsx:153-176`) keeps its own `LedgerCard` list, out of scope.

**Verify.**
- `npx tsc --noEmit`, `npx eslint components/marketing/BookingPills.tsx components/marketing/BookACall.tsx components/marketing/home/CareersTeaser.tsx`, `npx vitest run` clean; `git diff --stat` shows the three files; `git diff -- messages/` empty.
- `git diff components/marketing/BookingPills.tsx` shows the existing `<div className={size === "lg" ...}>` block unchanged apart from indentation inside the new conditional; no class string in the default path differs.
- Playwright at 1280, en and es: 3 anchors, each width === right column content width (584 minus 65 = 519px); every avatar img left x identical (737); every CalendarIcon svg right edge identical; row heights within 16px of each other; no anchor narrower than its li; the booking ul `border-top` y === the roles ul `border-top` y (within 1px).
- Inside the section, count elements with `rounded-2xl`, `rounded-full` (excluding img), `shadow-soft`, `bg-surface` or `bg-background`: 0 (the only rounded element allowed is a `.btn-*` in the no-bookable fallback, which does not render with the seeded team).
- 375: rows 327px wide, `document.documentElement.scrollWidth === 375`.
- Calendly in a headed run: clicking a row with widget.js loaded opens the popup (`window.Calendly.initPopupWidget` called, no navigation); cmd/ctrl-click opens the href in a new tab; each anchor keeps its aria-label.
- Regression screenshots of every other BookingPills host before and after, expect pixel-identical: `/contact`, `/pricing`, `/snowflake-consulting-services` (band); `/nearshore`, `/nearshore/monterrey`, `/migrations` (compact); one `/services/[slug]` close (inline, dark, `ServiceClose.tsx:116`); the nav "Let's talk" modal (`BookingModal.tsx:118`, `size="lg"`).
- a11y snapshot: a list of 3 booking links in the section; axe (if installed) reports no new violations.
- Both locales at 1440 and 390 by eye; compare with `careers-1280-crop.png`.

**Commit.** Stage `components/marketing/BookingPills.tsx`, `components/marketing/BookACall.tsx`, `components/marketing/home/CareersTeaser.tsx` by name. Message: `feat(home): booking people as ruled rows in the careers close`, body: an additive `layout="rows"` on `BookingPills` and `pillsLayout` on `BookACall`, both defaulting to the current pills, passed only from the home close; the three pills sat 384px wide in a 519px column with 135px of air each; every other host renders unchanged. Do not push.

---

## 7. Recommended order and stopping points

1. **Step 1, Services.** Smallest change with the highest visibility: one file, the largest mass of cards on the page, and it proves the ledger reads at six rows. Stop; the owner looks at 1440 and 390, both locales. If he dislikes six rows, stop entirely and nothing else has moved.
2. **Step 2, Insights.** Two home-only files, no shared code. Stop and look.
3. **Steps 3 and 4, Recognition.** Five class edits in one file, two commits. Stop after 3 and after 4; step 4's 1024 gap is the one thing to show before committing.
4. **Step 5, De-risk.** The new local component and the page edit. Stop and look, including 768 where the before is visibly broken.
5. **Step 8, Careers roles and subgrid.** One file. Stop and look; then go straight to step 9 if the owner is at hand, because the split is asymmetric between the two.
6. **Ask about steps 6 and 7** before touching `CustomerStories.tsx` or `LogoRow`. Ask early in the session (at the start, or after step 1) so the answer is in hand; do not start either without a yes. If yes: step 6 first, alone; then step 7, alone.
7. **Step 9, booking rows.** Last, because it is the only edit to shared components beyond step 7's prop, and it needs the regression pass across eight hosts.

Every step is one commit and reverts alone. The owner can stop after any of them; the page is coherent at every stopping point except between steps 8 and 9, where the left column is a ledger and the right is still tiles, so treat 8 and 9 as one sitting when possible.

---

## 8. Left alone, and why

- **Hero** (`Hero.tsx`, `HeroAurora.tsx`, `HeroMesh.tsx`, `MeshHeroSlide.tsx`): owner said do not touch. Three `.pill-tag` chips, two buttons and a mono credential line; no card-like surface in it.
- **Logo band** (`page.tsx:72-76`, `LogoRow`): already a row of equals on the ground. Four bare logos, no border, fill, radius or shadow on the section, the row or any img (computed at 375 / 768 / 1024 / 1280). All logos 40px tall at md+ on a shared baseline; the first logo's left edge (x 24) is the Customers h2's left edge; the mobile 2x2 has two equal 147.5px tracks with nothing alone in a row. Its vertical rhythm is the `dy: -38` content nudge in the `clientBands` setting (committed in `prisma/content-snapshot.json`, imported on deploy), so the logos paint at y 768-808 at 1280, 22px above their own section box; the code's `pt-4 pb-3` does not describe what you see and must not be "corrected". A `border-t` would paint at y 790, through the translated logos; a `border-b` at 858 would double the Customers band's own top rule 1px away. The hero scrim already fades to the page background above; the warm band's rule is the rule below. After every later commit, `git diff -- "app/[locale]/(marketing)/page.tsx"` must show no change to lines 68-76, and `measure-logoband.mjs` must reproduce `logoband-measure.json` (imgs at x 24 / 333.5 / 741.5 / 1062.8, y 767.8, h 40, transform `matrix(1,0,0,1,0,-38)` at 1280; y 950.4 and 1018.4, h 36 at 375).
- **Recognition photo frame** (`Recognition.tsx:100`): a framed photograph, the one framed object in its section, with the hover zoom to Viewnear's logo. Deliberate keep; steps 3 and 4 do not touch its border, radius or shadow.
- **The featured story frame** (`CustomerStories.tsx:174`): a single featured story with its photograph as half the object; the guide's leave-as-is instruction. Deliberate keep.
- **Carousel chrome** (`CustomerStories.tsx`: arrows 123-128 and 257-290, header 135-152, the 300ms crossfade, the live region, the swipe handling): fought over many rounds; buttons are excluded by the card test; untouched even if steps 6 and 7 are approved.
- **Shared primitives** (`ui.tsx`, `Cards.tsx`, `CoverCard.tsx`, `Icons.tsx`, `Motion.tsx`, `Decor.tsx`, `PartnerBadgeRow.tsx`, `Img.tsx`, `globals.css`, `tailwind.config.ts`): not edited by any step. Nine other files render `CoverCard`, six other pages render `PlateCard`, 28 files use `SectionDecor`; a change there is the Rails move. The two exceptions are additive props with the current behavior as default (`LogoRow.centerOrphan`, `BookingPills.layout` / `BookACall.pillsLayout`).
- **Nav, Footer, ChatWidget, EventAnnouncementBar, ConsentBanner**: global, not home. Two observations for the record, both out of scope: the fixed ChatWidget launcher can overlap the right end of the Laureate wordmark at 1280 depending on scroll position, and the cookie banner lands over the logo band in full-page screenshots only because it is `position: fixed`.
- **Forms and modals** (`BookingModal.tsx`, the contact form): excluded by the brief; the booking modal keeps `BookingPills size="lg"` on the default pills path.
- **The `.eyebrow` / `.chip` tags and the two `text-gradient` spans**: site-wide utilities and pre-existing gradients; changing them is site-wide or a design change the owner has not asked for.

---

## 9. Final verification after all steps

Run after the last step the owner accepted (not necessarily step 9).

- [ ] `npm run typecheck`, `npm run lint`, `npm run test` all clean from a clean tree.
- [ ] `git diff a64ce09..HEAD -- messages/` is empty (both locales byte-identical through every step).
- [ ] `git diff a64ce09..HEAD --stat` lists only: `components/marketing/home/ServicesGrid.tsx`, `Insights.tsx`, `RandomThree.tsx`, `Recognition.tsx`, `Derisk.tsx` (new), `app/[locale]/(marketing)/page.tsx`, and, if their steps shipped, `CustomerStories.tsx`, `ClientLogos.tsx`, `CustomersFeature.tsx`, `CareersTeaser.tsx`, `components/marketing/BookingPills.tsx`, `BookACall.tsx`. Nothing under `ui.tsx`, `Cards.tsx`, `CoverCard.tsx`, `Icons.tsx`, `Motion.tsx`, `Decor.tsx`, `PartnerBadgeRow.tsx`, `Img.tsx`, `app/globals.css`, `tailwind.config.ts`, `prisma/`, `docs/` (beyond this file).
- [ ] `git diff a64ce09..HEAD -- "app/[locale]/(marketing)/page.tsx"` shows no change to lines 68-76 (the logo band) and no change to the Hero, CustomersFeature, Recognition, ServicesGrid, Insights or CareersTeaser calls.
- [ ] `grep -rnP '\x{2014}' components/marketing/home components/marketing/BookingPills.tsx components/marketing/BookACall.tsx "app/[locale]/(marketing)/page.tsx" docs/home-cards-to-rows-audit-2026-10-11.md` returns nothing (the pattern is the em dash as a code point, so this file stays free of the character itself); `git log a64ce09..HEAD --format=%B | grep -nP '\x{2014}'` returns nothing.
- [ ] Framed objects left on the rendered home page, both locales, counted in Playwright at 1280 as elements with a non-zero border-radius plus a border or a box-shadow: exactly the featured story frame (`rounded-3xl`, Customers), the Recognition photograph (`rounded-2xl`), the avatars (36px booking photos, 40px FaceStack, the hero's and the carousel's round buttons) and the `.btn-*` buttons. The three Insights thumbnails have a radius and no border or shadow and are not frames. Zero `.panel-*`, zero `shadow-soft` outside the two frames and the carousel arrows, zero `bg-surface` / `bg-surface2` fills inside any list.
- [ ] Hairline inventory at 1280: Services ul top + 6 li bottoms; Recognition ul top + 3 li bottoms (+ the press footnote's top rule); De-risk ul top + 4 li bottoms; Insights ul top + 3 li bottoms; Careers roles ul top + N li bottoms, booking ul top + 3 li bottoms, plus the one vertical rule between the two equal columns; Customers' two metric left rules. All `1px rgb(224,235,244)`. No vertical rule between unequal tracks anywhere.
- [ ] Full-page screenshots of `/` and `/es` at 1280 and 375 into the scratchpad (`home-after-{en,es}-{1280,375}.png`), compared by eye against `home-1280.png`, `home-375.png` and the per-section before crops (`services-1280-crop.png`, `derisk-1280-crop.png`, `insights-crop-1280.png`, `careers-1280-crop.png`, `cust-1280-crop.png`, `logoband-1280-crop.png`). Also 1440 and 390 for the owner's own look. DOM measurements have lied before; the image is the check.
- [ ] Section bounds at 1280 recorded before and after (hero 118/672, logo band 790/68, customers 858/1035, recognition 1893/954, services 2848/1202, de-risk 4050/887, insights 4936/829, careers 5765/675): the hero and logo band are unchanged in y and height; every later section's y shifts only by the height changes above it.
- [ ] `measure-logoband.mjs` reproduces `logoband-measure.json` (the logo band did not move).
- [ ] Regression on other pages, by eye: `/approach` or `/about` (PlateCard grid unchanged), `/blog` or `/case-studies` (CoverCard grid unchanged), `/nearshore` (LogoRow and compact BookACall unchanged), one `/services/[slug]` close (inline dark pills unchanged), the nav "Let's talk" modal.
- [ ] Reduced motion once in each direction: with `reduce`, every ledger is fully visible on load; without it, each ledger staggers in once and the footers follow at their delay (210ms after three rows in Recognition, 280ms after four in De-risk).
- [ ] `/` and `/es` both return 200; `npm run content:status` reports the database matches the snapshot (no content was touched, so this is a sanity check).
- [ ] Nothing pushed; `git log origin/main..main` lists exactly the step commits, one per step, in the repo's voice, no em dashes.
- [ ] Open questions written down for the owner, not resolved by assumption: the service marks (dropped in step 1, fifth track if wanted back); the 1024 caption-to-footnote gap in Recognition (step 4); the hairline color on the tinted de-risk band if it reads faint (step 5); steps 6 and 7 if he has not answered yet.
