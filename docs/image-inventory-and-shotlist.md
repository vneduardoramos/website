# ViewNear — image inventory & photography shot list

## 1. Current image inventory

### Home (`/`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| HeroMesh (inline SVG) | bespoke SVG | Hero | No | Full-bleed animated mesh, nodes converging on hub. **Keep.** |
| certs/premier.webp | badge | Hero overlay | No | Official Snowflake Premier badge (triangle overlay, desktop). |
| certs/coco-preferred.png | badge | Hero overlay | No | Official CoCo Preferred 2026 badge. |
| certs/snowpro-core.png | badge | Hero overlay | No | Official SnowPro Core badge. |
| certs/coco-momentum-summit-2026.png | photo | PartnershipHighlight featured | Yes | Real Summit 2026 keynote screenshot. |
| FoundationVisual / AiVisual | bespoke SVG | Feature splits | No | Source-consolidation + Cortex visuals. **Keep.** |
| DataStackIcon / DocIcon | bespoke icon | Hero mesh packets | No | Glacier-palette packet icons. **Keep.** |
| ServicesGrid area chart + Icons.tsx suite | icon | Services/methodology | No | Stroke SVG icon library. **Keep.** |
| HeroDiagram (inline SVG) | bespoke SVG | Methodology timeline | No | Sources → hub → outputs flow diagram. **Keep.** |
| HeroDiagram avatars (`member.photo`) | photo | Diagram avatars | Yes (dynamic) | Falls back to initials; pulls seeded team headshots. |
| HeroBackground / hero-wash / bg-grid | gradient/SVG | Backgrounds | No | Decorative sky-wash + dot grid. **Keep.** |
| CoverCard placeholder gradient | gradient | Case study fallback | No | Hash-seeded gradient + wave motif. |

### About (`/about`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/team-meeting.jpg | photo | "Our origin" hero | Yes | 140K JPG, full-width 16:9. Generic stock-feel. |
| photos/datacenter.jpg | photo | "Our mission" band | Yes | 183K JPG, 4:3 with gradient overlay. Generic infra. |
| team/alex.jpg, jordan.jpg, sam.jpg, taylor.jpg | photo | Headshots | Yes | ~3–7K JPGs, 96×96 circular. **Only 4, seeded/generic.** |
| certs/premier · coco-preferred · snowpro-core | badge | Certifications | No | Official badges, PartnerBadges logos variant. |
| certs/coco-momentum-summit-2026.png | photo | Partnership highlight | Yes (screenshot) | Keynote slide, bordered + figcaption. |
| Value/credential checkmarks, SnowflakeMark | icon | Values/creds | No | Bespoke SVG. **Keep.** |
| HeroBackground / SectionDecor / panel-dark | SVG/gradient | Backgrounds | No | Decorative. **Keep.** |

### Services & Solutions (`/services`, `/solutions`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/datacenter.jpg | photo | FeatureSplit (Built on Snowflake / Governance) | Yes | Reused generic infra. |
| photos/network.jpg | photo | ShowcaseBand (Why now) / Migrate split | Yes | Generic network. |
| photos/circuit.jpg | photo | Cortex AI split | Yes | Generic circuit. |
| photos/dashboard.jpg | photo | Embedded analytics split | Yes | Generic dashboard. |
| Compass/Database/Pipeline/Chart/Cpu/Rocket/Snowflake icons | icon | Service cards | No | Icons.tsx. **Keep.** |
| Quote / check / decor SVGs, WaveDivider, HeroBackground, ShowcaseBand scrim, CtaBand | SVG/gradient | Decorative | No | **Keep.** |

### Industries (`/industries`, `/industries/[slug]`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/analytics.jpg | photo | FeatureSplit (listing + detail engagement) | Yes | Generic dashboard, reused twice. |
| industries/*.jpg (8 sectors) | photo | Sector cover cards + ShowcaseBands | Yes | Stock-feel sector imagery, tinted per sector. |
| Sector icons (Bank/Building/GradCap/Bag/Factory/Broadcast/Chip) | icon | Sector badges | No | **Keep.** |
| CoverCard placeholder + wave, check/shield/arrow SVGs | SVG | Decoration | No | **Keep.** |
| `caseStudies[0].heroImage` | photo | Detail Spotlight | Yes (dynamic) | Falls back to sector image. |
| HeroBackground / SectionDecor / WaveDivider / scrims | SVG | Backgrounds | No | **Keep.** |

### Case studies (`/case-studies`, `/case-studies/[slug]`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/analytics.jpg | photo | Detail hero fallback (21:9) | Yes | Generic. |
| photos/dashboard.jpg | photo | Sticky sidebar (4:5) | Yes | Hard-coded generic. |
| industries/*.jpg | photo | Sector covers (lib/covers.ts) | Yes | Deterministic by sector. |
| photos/{code,collaboration,datacenter,network,team-meeting,circuit}.jpg | photo | Cover fallback pool | Yes | Generic stock pool. |
| certs/* badges | logo | Verified proof section | No | Official. |
| Quote/arrow/wave/grid/check SVGs, CoverCard gradient, mesh blobs | SVG/gradient | Decorative | No | **Keep.** |

### Blog (`/blog`, `/blog/[slug]`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/{dashboard,analytics,datacenter,network,code,collaboration,team-meeting,circuit}.jpg | photo | `coverFor()` fallback pool | Yes | Generic stock. |
| `author.photo` (DB) | photo | Author headshot | Yes (dynamic) | Real if set in CMS. |
| `post.coverImageUrl` (DB) | photo | Feature image | Yes (dynamic) | Falls back to pool. |
| viewnear-logo.png | logo | JSON-LD publisher | No | Not rendered. |
| `/blog/{slug}/opengraph-image` | generated | OG fallback | No | Dynamic text OG. |
| CoverCard placeholder, decor/wave/check/arrow SVGs, HeroBackground | SVG | Decorative | No | **Keep.** |

### News (`/news`, `/news/[slug]`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/* pool (8) | photo | `coverFor()` fallback | Yes | Generic stock. |
| `item.coverImage` (CMS) | photo | Cover + full-bleed hero | Yes (dynamic) | Overrides pool. |
| Markdown `<img>` in body | photo | Article body | Yes (varies) | From markdown source. |
| CoverCard placeholder, decor/wave/check/quote SVGs, HeroBackground, CtaBand | SVG | Decorative | No | **Keep.** |

### Partnership & Platform

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| certs/coco-momentum-summit-2026.png | photo | Hero / proof | Yes (screenshot) | 1500×1500 keynote slide. |
| certs/premier · coco-preferred · snowpro-core | badge | Certification logos | No | Official. |
| photos/collaboration.jpg | photo | Partnership FeatureSplit ("Certified vs generalist") | Yes | Generic, browser-chrome framed. |
| photos/datacenter.jpg | photo | Platform FeatureSplit ("Why native") | Yes | Generic infra. |
| SnowflakeMark, WaveDivider, SectionDecor, gradients | SVG | Decorative | No | **Keep.** |

### Approach & Pricing (`/approach`, `/pricing`)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| HeroBackground, SectionDecor (flow/grid), WaveDivider | SVG | Backgrounds | No | **Keep.** |
| Methodology icons (Compass/Pen/Pipeline/Rocket/Shield/Gauge/Check) | icon | Methodology steps | No | **Keep.** |
| Quote SVG, panel-dark, CtaBand | SVG/gradient | Decorative | No | **Keep.** No real photos on these pages today. |

### Life at ViewNear (Careers)

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| life/austin.jpg | photo | Hero | Yes | Austin HQ exterior (Quarry Oaks II). |
| life/monterrey.jpg | photo | Hero | Yes | Monterrey office (Pueblo Serena). |
| life/lounge.jpg | photo | Card | Yes | Open lounge/café. |
| ~20 badge icons (Target/Sparkles/Users/Heart/Shield/etc.) | icon | Benefit/value badges | No | **Keep.** |
| HeroBackground / SectionDecor / WaveDivider / mesh-soft | SVG | Backgrounds | No | **Keep.** |

### Security · FAQ · Contact · Resources · Brand

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| photos/datacenter.jpg | photo | Security governance FeatureSplit | Yes | Generic infra. |
| photos/collaboration.jpg | photo | Contact left-column hero | Yes | Generic collaboration. |
| industries/*.jpg, photos/* pool | photo | Resources case/blog covers | Yes | Generic. |
| certs/* badges | logo | Contact badges | No | Official. |
| SectionDecor (grid/dots/flow/blobs/swoosh), WaveDivider, HeroDiagram, shield/check/arrow SVGs | SVG | Decorative | No | **Keep.** |

### Shared chrome & OG

| Image/ref | Kind | Context | Real photo? | Notes |
|---|---|---|---|---|
| viewnear-logo.png | logo | Nav + Footer | No | Official lockup, 1998×251. **Keep.** |
| certs/* (premier, coco-preferred, snowpro-core, coco-momentum) | badge/photo | Partnership components | No / Yes (momentum) | Official. **Keep badges.** |
| photos/* pool (8) | photo | Cover fallback pool (lib/covers.ts) | Yes | Generic stock — upgrade candidate. |
| industries/*.jpg (8) | photo | Sector covers | Yes | Stock-feel. |
| team/{alex,jordan,sam,taylor}.jpg | photo | TeamCard + HeroDiagram | Yes | Seeded, generic. |
| life/{austin,monterrey,lounge}.jpg | photo | Culture | Yes | Real office imagery. |
| snowflake-mark.png | logo | Branding | No | Asset present. |
| Icons.tsx suite, CoverCard gradient, Decor SVGs, scrims, og.tsx layout | SVG | Decorative/system | No | **Keep.** |

### Asset files on disk

`public/assets/images/**` summary by folder:

| Folder | Files | Dimensions (range) | Status |
|---|---|---|---|
| `industries/` | 8 sector JPGs | 1280×800 to 1600×1067 | Used dynamically in sector cards. |
| `photos/` | analytics, circuit, code, collaboration, dashboard, datacenter, network, team-meeting (8 JPGs) | 1200×673 to 1280×800 | Used widely as shared cover/feature pool. Generic stock. |
| `team/` | alex, jordan, sam, taylor (4 JPGs) | 128×128 each | **Flagged UNUSED** in scan, though referenced by TeamCard/HeroDiagram — small/seeded. |
| `certs/` | premier.webp (460×460), coco-preferred.png (1910×1572), snowpro-core.png (487×402), coco-momentum-summit-2026.png (1500×1500) | as noted | Official Snowflake badges + keynote slide. |
| `life/` | austin (1536×1024), monterrey (2000×1197), lounge (1519×1036) | as noted | Real office/culture photos. |
| `covers/` | c1–c12, event1, event2 (14 JPGs) | ~1200×675 to 1200×900 | **All UNUSED.** |
| root | snowflake-mark.png (640×640) | — | **UNUSED.** |

**Unused assets** (referenced nowhere in code):
- `images/snowflake-mark.png` (640×640)
- `images/team/alex.jpg`, `jordan.jpg`, `sam.jpg`, `taylor.jpg` (128×128) — flagged unused in the disk scan; note these are tiny and are the seeded placeholder headshots regardless.
- `images/covers/c1.jpg` … `c12.jpg` (12 files)
- `images/covers/event1.jpg`, `event2.jpg`

That's **19 unused files** total. The `covers/` pool (14 files) and the orphan `snowflake-mark.png` are safe-to-delete dead weight once real photography lands; the `team/` headshots should be replaced rather than deleted.

---

## 2. What's real vs placeholder vs bespoke

**Real photography (authentic, keep/expand):**
- `life/austin.jpg`, `life/monterrey.jpg`, `life/lounge.jpg` — genuine office/culture shots and the strongest real assets we have.
- `certs/coco-momentum-summit-2026.png` — a real Snowflake Summit 2026 keynote screenshot (proof artifact, not a "photo" to reshoot).

**Bespoke on-brand SVG (keep — do not replace):**
- HeroMesh, HeroDiagram, FoundationVisual, AiVisual (SplitVisuals), DataStackIcon/DocIcon, the full Icons.tsx suite, SnowflakeMark, SectionDecor variants, WaveDivider, HeroBackground, CoverCard gradient system, og.tsx layout. These carry the Glacier brand and are high quality.

**Official brand assets (keep — do not reshoot):**
- The Snowflake certification badges (`premier.webp`, `coco-preferred.png`, `snowpro-core.png`) and the ViewNear logo lockup.

**Generic stock — upgrade candidates:**
- The shared `photos/` pool (analytics, circuit, code, collaboration, dashboard, datacenter, network, team-meeting) — generic tech/dashboard/collaboration stock used across home, services, solutions, industries, case studies, blog, news, partnership, platform, security, contact. Highest-volume, lowest-authenticity imagery on the site.
- The 8 `industries/*.jpg` sector images — serviceable but stock-feel; industry-authentic shots would lift the sector pages.

**Illustrative / placeholder:**
- The seeded `team/` headshots — only 4, generic, 128×128, and flagged unused. These are placeholders, not real ViewNear people.
- The `covers/` pool (c1–c12, event1–2) — entirely unused placeholder stock.
- CoverCard hash-seeded gradients — intentional fallback when no image exists.

**Honest summary:** the only genuinely authentic ViewNear photography on the site is the three `life/` office shots. Everything else photographic is generic stock or seeded placeholders. The brand SVG system is excellent and should be preserved; the real gap is people, offices-in-use, and delivery moments.

---

## 3. Photography shot list (what to capture)

Notes for the photographer: shoot in real ViewNear environments (Austin HQ / Quarry Oaks II and Monterrey / Pueblo Serena). Favor natural light, candid working moments over posed stock. Keep a consistent look (color temperature, depth of field) across a session. Where screens appear, ensure real Snowflake dashboards/IDE are visible (not lorem-ipsum). Capture both the framed crop and a wider safe-area version so we can re-crop for different aspect ratios.

### Team & people

**T1 — Individual team headshots (full roster).** Relaxed-professional headshots of every team member, consistent neutral office/lounge background and lighting. Replaces the 4 seeded generic `team/*.jpg` and feeds the HeroDiagram avatars.
- Placement: About → TeamCard grid (96×96 circular); Home/Security HeroDiagram floating avatars; Blog author headshots.
- Orientation/AR: portrait, square 1:1 (tight crop survives the circular mask).
- Variations: 1 per person, whole team. Shoot a couple of expressions each.
- Priority: **P0.**

**T2 — Small-group candid (3–5 people).** A natural cluster of staff in conversation at a desk or coffee area — relatable, not a lineup.
- Placement: Home hero carousel / HeroDiagram team representation; Careers hero; CoverCard fallbacks.
- Orientation/AR: portrait 4:5 and a landscape 16:9 alt.
- Variations: 3–4 different groupings/locations.
- Priority: **P1.**

### Office & spaces

**O1 — Open workspace in use.** Wide interior of the open desk area with people working and natural light; show focus corners and lounge seating occupied.
- Placement: Careers "Office showcase" grid (alongside austin/monterrey/lounge); PageHero contextual backdrops.
- Orientation/AR: landscape 16:9.
- Variations: 2 (Austin + Monterrey).
- Priority: **P0.**

**O2 — Office exterior / entrance hero.** Striking shot of the Quarry Oaks II and Pueblo Serena buildings/entrances.
- Placement: Careers hero (portrait slot beside CTA); About backgrounds; News event covers.
- Orientation/AR: portrait 4:5 + landscape 16:9.
- Variations: 2 (one per office).
- Priority: **P1.**

**O3 — Lounge / culture corners.** Café bar, plant-filled common areas, breakout nooks — empty and with people.
- Placement: Careers benefits/culture cards; CoverCard pool.
- Orientation/AR: landscape 16:9 + square 1:1.
- Variations: 3–4.
- Priority: **P2.**

### Delivery & collaboration

**D1 — Whiteboard / strategy session.** Team mid-discussion at a whiteboard with architecture diagrams or sticky notes visible; genuine engagement.
- Placement: Home PartnershipSlide featured area + new section between ServicesGrid and Methodology; About "Our origin" hero (16:9); Services THINK/ai-data-strategy card; Approach discovery hero; Partnership "Certified vs generalist".
- Orientation/AR: landscape 16:9 (primary) + landscape wide for hero crop.
- Variations: 3–4 (different angles/rooms).
- Priority: **P0.**

**D2 — Engineer at workstation (real screens).** Close-to-mid shot of a team member at a multi-monitor desk with a live Snowflake query/dashboard or IDE on screen.
- Placement: About "Our mission" card (4:3); Case study sticky sidebar (4:5); Services BUILD/data-engineering card; Solutions Migrate & Cortex splits; Platform "Why native"; Security governance split (showing access/lineage UI); Blog/news covers.
- Orientation/AR: portrait 4:5 (sidebar) + landscape 16:9 (splits). Shoot both crops.
- Variations: 3–4 (different people/roles, governance vs build vs analytics screens).
- Priority: **P0.**

**D3 — Client/working presentation.** Team presenting findings to a cross-functional group in a conference room — laptop demo or screen share.
- Placement: Case study hero (21:9); Industries ShowcaseBand + engagement FeatureSplit; Partnership below-hero; News full-bleed hero.
- Orientation/AR: landscape 16:9 / wide 21:9 (leave headroom for the scrim + white text on ShowcaseBand).
- Variations: 3.
- Priority: **P1.**

**D4 — Pair programming / code review.** Two people reviewing code on one screen.
- Placement: Services BUILD card alt; Resources blog covers ("From the lab"); CoverCard pool.
- Orientation/AR: landscape 16:9.
- Variations: 2.
- Priority: **P1.**

**D5 — Mentoring / knowledge transfer.** A consultant teaching a client teammate at a desk, reviewing dashboards together.
- Placement: Services GROW/capability-development card; Approach methodology accents.
- Orientation/AR: landscape 16:9.
- Variations: 2.
- Priority: **P2.**

### Culture & careers

**C1 — Team social / informal moment.** Candid gathering — café, outdoor space, or team event — showing genuine connection.
- Placement: Careers benefits grid + "stands apart" section; CoverCard pool replacements.
- Orientation/AR: landscape 16:9.
- Variations: 3.
- Priority: **P1.**

**C2 — Industry-context shots (optional set).** Where feasible, location shots that read for a sector (e.g. a job-site walkthrough, retail floor, trading desk) with a ViewNear person present.
- Placement: Industries sector CoverCards + detail hero; replaces generic `industries/*.jpg`.
- Orientation/AR: landscape 16:9 + square 1:1 (detail hero).
- Variations: as opportunistically available across sectors.
- Priority: **P2.**

---

## 4. Top priorities

1. **T1 — Full team headshots (P0):** the only 4 headshots are seeded/generic placeholders; real faces are the single highest-trust upgrade and feed About, HeroDiagram avatars, and blog authors.
2. **D2 — Engineer at workstation with real Snowflake screens (P0):** reused in the most places (About mission, case study sidebar, services/solutions/platform/security splits) and most credibly demonstrates the actual work.
3. **D1 — Whiteboard/strategy session (P0):** anchors the About origin hero, the proposed home culture section, and multiple delivery-themed splits; shows real people and process.
4. **O1 — Open workspace in use (P0):** turns the Careers office showcase from building exteriors into a lived-in environment and supplies authentic page backdrops.
5. **D3 — Client/working presentation (P1):** powers the high-impact case-study and ShowcaseBand heroes that currently lean on generic stock.
6. **C1 — Team social/culture moment (P1):** the heart of the Careers narrative and a strong, authentic replacement for the generic `photos/` cover pool.
7. **O2 — Office exterior/entrance hero (P1):** distinctive Austin/Monterrey identity for the Careers hero and event/news covers.
8. **T2 — Small-group candid (P1):** relatable team representation for the home hero and CoverCard fallbacks, reducing reliance on stock.

Keep as-is: the bespoke brand SVGs (HeroMesh, SplitVisuals, HeroDiagram, Icons suite) and the official Snowflake certification badges — these do not need photography.
