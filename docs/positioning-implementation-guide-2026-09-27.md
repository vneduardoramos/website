# Positioning implementation guide: a data + AI company, Snowflake for data, Anthropic for AI

**Written:** 2026-09-27. **For:** the agent implementing this (Opus). **Owner:** Eduardo Ramos, CEO.

Read the whole file before touching anything. Work the steps in order. One commit per step, on `main`, never pushed: the owner pushes. Each step must leave the site shippable on its own.

---

## 0. The one-paragraph brief

Make viewnear.com read as a professional data + AI company that builds on Snowflake for data and Anthropic's Claude for AI, **without making either partner the headline**. The tagline states the problem Viewnear solves. Snowflake and Claude appear in several places at low weight (subhead, credential line, case study chips, footer, one "how we build" section, the partnership pages) as the *how* and the *proof*, never as the *promise*.

This is the second attempt. The first (2026-09-16 to 09-19, 70 commits) was reverted in full on 2026-09-27 because the owner disliked much of the execution, not the strategy. Section 2 lists what was rejected. Do not rebuild it.

---

## 1. Where things stand

### Repository state

```
main                     d0cbced   = origin/main = what Render serves       ← you work here
pre-revert-2026-09-27    009b6ef   the reverted attempt, complete           ← reference only
web-design-up            69e61ad   same, plus six home-page concepts        ← ignore
```

The local Postgres matches `prisma/content-snapshot.json` at `d0cbced` (verified with `npm run content:status`). `npm run dev` is expected to stay up on :3000 for the whole session; prod checks go on :3100.

### How to reuse the reverted work

Do **not** `git cherry-pick` from `pre-revert-2026-09-27`. The commits there are entangled (a site-wide card refactor sits under half of them). Lift individual files instead:

```bash
git show pre-revert-2026-09-27:config/partners.ts > config/partners.ts
git show pre-revert-2026-09-27:"app/[locale]/(marketing)/partnership/claude/page.tsx"
git diff d0cbced pre-revert-2026-09-27 -- components/marketing/ui.tsx   # see what a change did
```

Files on that branch worth lifting, by step, are listed in section 6. Everything else there is reference at most.

### What the published site says today (the thing you are changing)

- Hero H1 (`messages/en/heroUi.json` → `hero.title`): "From data strategy to AI in production, on Snowflake." Snowflake is in the tagline. That is the first thing to fix.
- Hero subhead is **overridden at runtime** by `prisma/seed/data.ts` → `siteSettings.hero.subhead` (the JSON file's `hero.subhead` is a fallback). The live subhead ends "then hand over the keys", which is a banned handover claim.
- Hero credential line (`heroUi.json` → `hero.credential`): "Snowflake Premier & CoCo Preferred Partner · SnowPro-certified · The Americas". No Anthropic anywhere on the site.
- `components/marketing/PartnerBadges.tsx` holds a hard-coded `CERTIFICATIONS` list of three Snowflake images. There is no `config/partners.ts`.
- `CaseStudyCard` in `components/marketing/ui.tsx` draws a hashed SVG sparkline per card. Every case study already has a real `heroImage` in the seed; the cards ignore it.
- Home page order (`app/[locale]/(marketing)/page.tsx`): Hero → logo band → `CustomersFeature` (one card, `insurance-claims-cortex-ai`) → foundation split → press → `ServicesGrid` → `IndustriesStrip` → outcomes → de-risk → proof/trust band → FAQ → `CtaBand`. Twelve sections.
- `/partnership` is a single page about Snowflake. No `/partnership/snowflake` or `/partnership/claude`.
- The Magnolia Doors case study (`magnolia-doors-installation-scheduling`) exists and is published. It is the **only** agentic engagement. It is not featured on the home page.

---

## 2. Rejected in the first attempt. Do not rebuild.

| Rejected | Owner's words | What to do instead |
|---|---|---|
| A full home page redesign (8-beat story, 7-block preview) | "disregard, didn't like it" | Keep the current home structure. Change copy, the hero, the case cards, add one section at most. |
| Everything built around cards | "I hate you based everything around cards and they're disproportionate, there's no symmetry" | No new card grids. Where a list is needed, ruled columns (hairlines) rather than tiles. Equal columns, aligned baselines. |
| The site-wide "Rails" card refactor (14 grids) | rejected with the rest | Do not touch existing grids outside the home page. |
| Badge showcase iterations (plates, tints, floating rectangle, breakout) | eight rounds, all dropped | Badges shown **bare**, official artwork, legible size (Snowflake seal ≥ 104px, Claude lockup ≥ 80px tall). No plate, no frame, no tint. |
| The customer stories carousel (arrows, autoplay, counters) | many rounds | Leave `CustomersFeature` as it is except for adding Magnolia as a second story if it fits without new chrome. |
| Six home-page concept pages under `/newhome` | "I'm done with new designs" | Never recreate. |
| Any "AI look": aurora mesh hero, gradient text span, blurred orbs | audit called them generic | Do not add any. Removing existing ones is in scope only if the owner asks. |

The one design change the owner explicitly liked and kept: **real photographs on case study cards** (commit `fe3f8a2`). Reuse it.

---

## 3. Hard rules. Every one of these has been enforced by the owner at least once.

Copy

1. **No em dashes.** Anywhere. Use commas, colons, periods. (`docs/content-style-guide.md`)
2. **"Consulting", "consultancy", "consultant" are banned** in all copy. One exception: `/snowflake-consulting-services`, which targets the search term.
3. **No handover promises.** Never "hand over the keys", "handover", "transition plan", "we step back", "your team runs it alone". Say: the build is documented as it is made, and Viewnear can keep operating and improving it. (Recorded 2026-09-16.)
4. **Don't call the deliverable "the platform"** or "your platform". Snowflake is the platform. Viewnear delivers governed, AI-ready data and agents.
5. **No "you own it / no lock-in" filler.** Owning their instance is obvious. Sell service quality.
6. **Never frame a fact as a caveat.** No "to be fair", "the honest version", "one caveat". Promise, then mechanism.
7. **No overclaiming.** Don't claim auto-learning, self-improving AI, or things not delivered as standard.
8. **Don't promise senior-only staffing.** Promise Snowflake and enterprise depth at every level.
9. **Magnolia Doors is the only published agentic engagement.** Never write "our agentic engagements", "clients we've put Claude on" (plural), or imply a portfolio. One case, named with permission.
10. **Never name a client's ERP vendor.** "System of record", "the ERP", never the brand.
11. **Human-in-the-loop is a feature, not a hedge.** "A person approves what matters" is a selling point; don't write it as a limitation.
12. **Snowflake and Anthropic are a team effort, not competitors.** Snowflake is the agentic control plane (Cortex AI, Cortex Agents, Cortex AI Gateway, Snowflake Intelligence, Snowflake CoWork). Claude runs inside it and alongside it. Never frame them as alternatives or as "Snowflake for X, Claude instead for Y".
13. **Claude does not only run inside Snowflake.** Viewnear also builds agents around and alongside client data (which is usually in Snowflake). Context for you; don't write it literally.
14. **Don't name the Big Four / large SIs.** "Alongside the global systems integrators and Big Four firms" is the approved phrasing.
15. **Spanish is impersonal.** No `usted`, no reader-directed `su/sus`, no `usted`-imperatives. Infinitives on CTAs ("Hablar con un arquitecto"). Mexican professional register. Every EN string change needs its ES twin in the same commit.

Design

16. **No colored accent bars/rails on cards.** Neutral hairlines only.
17. **Tailwind opacities in this project are 5-step only.** `/10 /20 /30 ...` render; `/12`, `/15`, `/35` render transparent.
18. **Badges bare** (see section 2). Official artwork, never redrawn, never in a colored box.

Process

19. **Never `git add -A` blindly.** Stage named paths. A stray staged deletion once produced a commit with only a file removal.
20. **Nothing is pushed by the agent.** The owner pushes.
21. **Keep `npm run dev` running on :3000.** Don't start a second dev server on that port.
22. **One commit per step**, with a message that says what changed and why, in the repo's existing voice (see `git log`).

---

## 4. Facts

### Verified facts you may state

| Fact | Source |
|---|---|
| Snowflake Partner Network: **Premier Services Partner** | badge `public/assets/images/certs/premier.webp`; directory listing `https://www.snowflake.com/en/why-snowflake/partners/all-partners/viewnear/` |
| **CoCo Preferred Partner**; named in Snowflake's CoCo Global Partner Momentum lineup at Summit 2026 (41 partners of 14,000+) | `coco-preferred.png`, `coco-momentum-summit-2026.png`, `PartnershipHighlight.tsx` |
| **SnowPro-certified** team | `snowpro-core.png` |
| Offices: **Austin, TX** and **Monterrey, MX**, both Central Time (Monterrey has no DST, so the clock differs from US Central March to November; don't write "same clock") | `lib/offices.ts` |
| First production value in **8 to 16 weeks** | site-wide, `home.json` |
| Magnolia Doors: 13 to 17 hrs/week → **15 to 19 hrs/week back**; scheduling 23 to 35 min → **~3 min**; **20 jobs per approval**; five disconnected systems; San Antonio, TX; built with Claude + Claude Code + a custom MCP connector | seed `caseStudies`, slug `magnolia-doors-installation-scheduling` |
| Insurance claims processor: classification **60% → 95%**, **4 sec/document**, **40%** of discarded documents recovered, 88% fewer errors; Snowflake Cortex AI (`AI_EXTRACT`) | slug `insurance-claims-cortex-ai` |
| University group: **20,000+ students**, Miami and LATAM, real-time pipeline live in **7 weeks** | slug `real-time-student-data-pipeline` |
| 7 real, named client logos on the home bands (H-E-B, Starbucks, Banregio, Laureate, Hussmann, Lendz, Difrenosa) + Magnolia Doors | `lib/client-bands.ts` |
| Press quote (CRN, Eduardo Ramos): "Viewnear has been building enterprise-grade production AI systems with governed Snowflake data anchored on Anthropic Claude." Verbatim, untranslated, attributed. | `lib/press.ts` |

### Facts to confirm with the owner before stating

| Claim | Status | If unconfirmed |
|---|---|---|
| **Claude Partner Network: Select Services Partner** | Owner said on 09-16 the badge "comes Monday" (09-21). Not verified since. | Ask before step 1. If not yet official, the credential line carries Snowflake only and step 5's Claude page says "Anthropic partner" without a tier. |
| The Claude badge artwork with the cream card keyed out (`claude-partner-network-select.png` on the parked branch; original preserved as `-original.png`) | Brand-guideline question never answered. | Prefer the original artwork unless the owner confirms the keyed version is acceptable. |
| An Anthropic partner directory URL | None known. | Omit the "Verify listing" link on the Claude side. |
| "Claude Certified Architects" on the team | Owner supplied this wording on 09-17. | Use as given; don't quantify. |

---

## 5. Technical notes and known traps

- **next-intl rich text:** `t.rich()` throws at runtime on an unknown tag. Legal tags in this codebase: `art br cases dataai hl hlCyan link mark migrations months nearshore privacyLink prod strong weeks`. Don't invent one.
- **EN/ES parity is absolute.** A key in `messages/en/*.json` missing from `messages/es/*.json` throws at runtime on `/es`.
- **Hero subhead override:** `prisma/seed/data.ts` → `siteSettings.hero` is upserted into the DB and wins over `heroUi.json`. Change both, keep the `headline` field mirroring the H1, then reseed.
- **Reseeding:** run `npx prisma db seed` (upserts). Do **not** run `npm run db:reset` casually: it ends with `content-sync import` from the snapshot, which would overwrite what you just seeded. After content changes: seed → `npm run ship` (exports the snapshot and stages it) → commit. `npm run content:status` must say "database matches the snapshot" before you commit.
- **Snapshot is what prod imports.** `prisma/content-snapshot.json` is committed; Render's build runs `content-sync import`. If a row isn't in the snapshot it gets pruned on deploy (except `imageOverride`, which is `neverPrune`).
- **Client namespaces:** a message namespace reaches client components only if it's in `CLIENT_NS` in `app/[locale]/layout.tsx`. `heroUi` is already there.
- **Next image cache:** replacing a file at the same path needs `rm -rf .next/cache/images` or the dev server keeps serving the old one.
- **JSX comments inside `.map()` callbacks** create two sibling returns and break the render silently. Put the comment above the map.
- **Scroll-snap + WebKit:** programmatic `scrollTo({behavior:"smooth"})` inside a mandatory scroll-snap container is unreliable in Safari. Irrelevant unless you touch the carousel; don't.
- **Verification tooling available:** `npm run typecheck`, `npm run lint`, `npm run content:status`, Playwright (`node_modules/.bin/playwright`, `chromium` installed). Screenshot at 1440 and 390 and *look at the image*; DOM measurements have lied before (a white-on-white overhang measured fine and was invisible).
- **Fonts:** `lib/fonts.ts` (Space Grotesk, Inter, JetBrains Mono). Don't change typography; the owner is done with design changes.

---

## 6. The steps

Each step: goal, files, what to lift, acceptance, verification, commit. Stop after each and let the owner look at :3000.

### Step 1: Hero. The tagline states the problem; partners move to the subhead and credential line.

**Goal.** Replace the Snowflake-led tagline with a problem-led one. Both partners named once each in the subhead. Both tiers in the credential line. Remove the handover claim.

**Files.**
- `messages/en/heroUi.json`, `messages/es/heroUi.json` → `hero.title`, `hero.subhead`, `hero.credential`, and the three `hero.pills`.
- `prisma/seed/data.ts` → `siteSettings.hero.headline` and `.subhead` (the runtime override).
- `components/marketing/home/MeshHeroSlide.tsx` renders the H1 via `t.rich("hero.title", { hl })`. Keep the `<hl>` span for one phrase, or drop it; owner's audit flagged gradient spans as generic, so prefer plain weight.

**Copy (recommended; alternates in the 09-27 conversation).**

EN
- title: `AI on the work your team still does by hand.`
- subhead: `We build the trusted data it runs on, with Snowflake, and the agents that do the work, with Claude, with a person approving what matters. Austin and Monterrey, first production value in 8 to 16 weeks.`
- credential: `Snowflake Partner Network Premier Services Partner · Claude Partner Network Select Services Partner · SnowPro-certified and Claude Certified team` (if the Select tier is confirmed; otherwise drop the Claude clause and keep "SnowPro-certified team").
- pills: keep the current three or retire them; if kept, the third becomes `Put agents on the work`.

ES (impersonal, Mexican professional register)
- title: `IA en el trabajo que el equipo todavía hace a mano.`
- subhead: `Construimos los datos confiables sobre los que corre, con Snowflake, y los agentes que hacen el trabajo, con Claude, con una persona aprobando lo que importa. Austin y Monterrey, primer valor en producción en 8 a 16 semanas.`
- credential: `Snowflake Partner Network Premier Services Partner · Claude Partner Network Select Services Partner · Equipo certificado SnowPro y Claude`

**Lift from the parked branch.** Nothing wholesale. `git show pre-revert-2026-09-27:messages/en/heroUi.json` shows the last accepted shape (`credentialCert` key) for reference.

**Acceptance.** The H1 contains neither "Snowflake" nor "Claude". Subhead contains each once. Credential line lists both networks with their level. No "hand over". `/` and `/es` render. The H1 is the same string in `heroUi.json` and `siteSettings.hero.headline`.

**Verify.** `npx prisma db seed && npm run ship && npm run content:status`; `npm run typecheck`; screenshot `/` and `/es` at 1440 and 390; `grep -rn "hand over\|handover" messages/en/heroUi.json prisma/seed/data.ts` returns nothing for the hero.

### Step 2: Proof band. The three numbers, set large, directly under the hero.

**Goal.** A data company with no data above the fold argues against itself. Put the three measured results in one ruled band between the hero and the logo band: three equal columns, hairline top rule, hairline dividers, number in display type, one-line label, one-line source, link to the case study. **Not cards.** No background, no radius, no shadow.

**Files.** New `components/marketing/home/ProofBand.tsx` (server component), inserted in `app/[locale]/(marketing)/page.tsx` right after `<Hero />`. Strings in `messages/en/home.json` + `messages/es/home.json` under a new `proof` key. Numbers are data, not translation: keep `15 to 19 hrs`, `60 to 95%`, `7 weeks` as values and translate only the labels.

**Content.**
| value | label | source | href |
|---|---|---|---|
| 15 to 19 hrs | Administrative hours back every week | Magnolia Doors, installation scheduling | `/case-studies/magnolia-doors-installation-scheduling` |
| 60 to 95% | Claims classification accuracy | An insurance claims processor | `/case-studies/insurance-claims-cortex-ai` |
| 7 weeks | To one live view of 20,000+ students | A multi-campus university group | `/case-studies/real-time-student-data-pipeline` |

**Acceptance.** Three columns identical in structure; baselines of the three numbers align; the section has no card chrome. Reads on 390 as a stacked list with rules.

**Verify.** Screenshot 1440 + 390. Measure the three value elements' `top` in Playwright: they must be equal at 1440.

### Step 3: "How we build". The one place the partners are prominent.

**Goal.** Below the proof band (replacing the current "foundation split" section at `page.tsx` ~L95 if the owner agrees, otherwise added after it), a two-column section: left **Governed data, on Snowflake**, right **Agents that reach the work, built with Claude**. Same structure both sides: badge bare at the top (equal fixed-height row so headings align), heading, one paragraph, four one-line points as a ruled list, one link (`/partnership/snowflake`, `/partnership/claude`). A single closing line under both: it is one engagement, one team.

**Files.** New `components/marketing/home/HowWeBuild.tsx`; strings under `home.build` in both locales; `config/partners.ts` (step 5 dependency: lift it now, see below); `components/marketing/PartnerBadgeRow.tsx` for `PartnerBadgeMark`.

**Lift from the parked branch, now.**
```bash
git show pre-revert-2026-09-27:config/partners.ts > config/partners.ts
git show pre-revert-2026-09-27:components/marketing/PartnerBadgeRow.tsx > components/marketing/PartnerBadgeRow.tsx
git show pre-revert-2026-09-27:public/assets/images/certs/claude-partner-network-select-original.png > public/assets/images/certs/claude-partner-network-select.png
```
`config/partners.ts` exports `SNOWFLAKE`, `ANTHROPIC`, `PARTNERS`, `credentialLine()`. Check `ANTHROPIC.badge.src` points at the file you just wrote and adjust `displayScale` (the keyed version used `0.78`; the original card artwork is a different shape, re-measure). `PartnerBadgeRow.tsx` imports `AnthropicMark` from `components/marketing/ProviderMark`; that file exists at `d0cbced`. `PartnerBadgeMark` sizes: `sm 80 / md 104 / lg 128` px base × `displayScale`.

**Copy.** Points must be matched in length across the two columns (owner: "make bullet points the same length for symmetry"). Snowflake side: migration off the legacy warehouse; pipelines kept fresh, tested and traceable; Horizon governance and one shared business context; Cortex AI, Cortex Agents and Snowflake Intelligence on top. Claude side: MCP connectors into the systems the work lives in; a person approves before anything is written back; built with Claude and Claude Code; measured against the baseline it was meant to beat. Closing line: `Snowflake is the agentic control plane. Claude is the model that runs inside it and around it. One team builds both.`

**Acceptance.** Two headings at identical `y` at 1024, 1280, 1440. No card borders around columns; one vertical hairline between them. Both badges legible.

### Step 4: Case study cards show the engagement's photograph, and a stack chip.

**Goal.** Replace the hashed sparkline in `CaseStudyCard` with the case's own `heroImage` (16:10, `object-cover`), and add a small mono chip naming the stack: `Snowflake · Cortex AI` or `Claude · MCP`, derived from `cs.stack`. Magnolia's chip reads "Built with Claude"; a case whose stack contains Snowflake reads the Snowflake chip. Classify by stack *contents*, not by presence of a stack array (a past bug).

**Files.** `components/marketing/ui.tsx` (`CaseStudyCard`; delete `SPARK_HUES`, `SPARK_PATHS`, `hashIndex`). Optional: `app/globals.css` `.card-hover` lift removal is *design* work; leave it.

**Lift.** `git diff d0cbced pre-revert-2026-09-27 -- components/marketing/ui.tsx` shows exactly the accepted change (`fe3f8a2`). Reapply by hand; the rest of that diff is the Rails refactor and must not come along.

**Acceptance.** `/case-studies`, `/industries/*`, `/partnership` cards show photos; no sparkline anywhere (`grep -rn SPARK components` empty). Alt text is `${sector}: ${title}`.

### Step 5: Partnership pages and footer badges.

**Goal.** `/partnership` becomes a hub with two columns (photographic, not cards) linking to `/partnership/snowflake` and `/partnership/claude`. Each subpage tells one network's story in the same shape. Footer shows both badges bare with network and level. `PartnerBadges.tsx` reads from `config/partners.ts` instead of its own list.

**Lift wholesale (these were accepted as-is, then only their hero badge sizing changed).**
```
app/[locale]/(marketing)/partnership/page.tsx
app/[locale]/(marketing)/partnership/snowflake/page.tsx
app/[locale]/(marketing)/partnership/claude/page.tsx
components/marketing/partnership/PartnerPageBlocks.tsx
messages/en/partnershipSnowflake.json  messages/es/partnershipSnowflake.json
messages/en/partnershipClaude.json     messages/es/partnershipClaude.json
```
Then read them. `PartnerPageBlocks.tsx` imports `RailGrid` from `components/marketing/Rails` (the rejected refactor). Either lift `Rails.tsx` too and use it **only** inside these pages, or replace `RailGrid` there with a plain ruled two/three-column list. Do not use `Rails` anywhere else. The Claude page passes no `partner` to `PartnerHero` (owner: "this page doesn't need the Claude badge"); the Snowflake page's proof block shows Snowflake credentials only (`badges="snowflake"` on `PartnershipHighlight`, which needs the `only` prop from `git diff d0cbced pre-revert-2026-09-27 -- components/marketing/PartnerBadges.tsx components/marketing/PartnershipHighlight.tsx`).

Also lift the last accepted `components/marketing/Footer.tsx` badge block (uses `PartnerBadgeRow size="sm"`), the `messages/*/nav.json` entries that add both partnership pages under Company, and the two new routes in `config/routes.ts` (the sitemap derives from it): `git diff d0cbced pre-revert-2026-09-27 -- components/marketing/Footer.tsx messages/en/nav.json messages/es/nav.json config/routes.ts`.

Schema: the parked `app/[locale]/layout.tsx` (around L105 to L130) adds `memberOf` for both networks from `PARTNERS` and `knowsAbout` entries with Wikidata `sameAs` links. IDs: Snowflake Inc. **Q65141064**, Anthropic **Q116758847** (an earlier draft used a wrong ID for Anthropic; use this one), Claude **Q118876059**. Lift that block by hand: `git diff d0cbced pre-revert-2026-09-27 -- "app/[locale]/layout.tsx"`.

**Acceptance.** `/partnership`, `/partnership/snowflake`, `/partnership/claude`, and `/es/` twins all 200. Footer shows both badges with readable type. No page shows the Claude badge more than once. `/partnership/claude` hero has no badge. Sitemap lists the two new routes in both locales.

### Step 6: Blog post.

**Goal.** Publish Eduardo's "Why Snowflake and Claude Are Becoming the Enterprise AI Stack", both locales.

**Lift wholesale.**
```
prisma/seed/content/blog/snowflake-claude-enterprise-ai-stack.md
prisma/seed/content/blog/snowflake-claude-enterprise-ai-stack.es.md
public/assets/images/blog/snowflake-claude-enterprise-ai-stack.jpg
```
plus the `blogPosts` entry from `prisma/seed/data.ts` and the `blogPostsEs` entry from `prisma/seed/es/blog.ts` (`git diff d0cbced pre-revert-2026-09-27 -- prisma/seed/data.ts prisma/seed/es/blog.ts`, take only the new blog entries). Date it the day you publish. Author `eduardo-ramos`.

The post's body states the Select tier and links to `/partnership/snowflake` and `/partnership/claude`, so it depends on steps 1 and 5.

**Verify.** `npx prisma db seed && npm run ship && npm run content:status`. `/blog` lists it first; the GFM table renders; all internal links 200 in both locales; no em dashes (`grep -n "—" prisma/seed/content/blog/snowflake-claude*`).

---

## 7. Final checklist before handing back

- [ ] `npm run typecheck` and `npm run lint` clean
- [ ] `npm run content:status`: database matches the snapshot
- [ ] Every EN key changed has its ES twin; `/es/` twin of every touched route returns 200
- [ ] `grep -rniE "consult(ing|ancy|ant)" messages app components | grep -v snowflake-consulting` returns nothing new
- [ ] `grep -rn "—" messages prisma/seed/content` returns nothing you wrote
- [ ] `grep -rniE "hand over|handover|hands? the work over" messages prisma/seed/data.ts` returns only the pre-existing lines outside your steps (list them for the owner; retiring them site-wide is `da9b71b` on the parked branch, 34 files, do it only if asked)
- [ ] The word "Snowflake" does not appear in the H1; "Claude" does not appear in the H1
- [ ] No new card grids, plates, tints, gradients, orbs, carousels
- [ ] Screenshots at 1440 and 390 of `/`, `/partnership`, `/partnership/snowflake`, `/partnership/claude`, `/case-studies`, viewed by eye, not just measured
- [ ] Nothing pushed; `git log origin/main..main` lists exactly your step commits
- [ ] Open questions from section 4 written down for the owner, not resolved by assumption

---

## Appendix A: commit map of the parked branch

Reference for `git show` and `git diff`. **Lift** = safe to copy from. **Ref** = read for intent only. **Skip** = rejected.

| Commit | What | Use |
|---|---|---|
| `050c630` | `docs/agentic-positioning-audit-2026-09-16.md`: page-by-page audit and plan | Ref |
| `3aec099`, `6918979` | two-pillar copy rebalance across messages + seed (Snowflake counts went up, Claude from 0) | Ref for wording; do not apply wholesale |
| `d24b4e1` | FAQ: attribute the training-data statement to the vendors | Lift (3 files, safe) |
| `da9b71b` | retire the handover promise site-wide (34 files) | Lift only if the owner asks for site-wide |
| `f225ab8`, `4b8bdf9`, `53753d8` | `config/partners.ts`, Select tier as fact, credential on every surface | Lift `config/partners.ts`; Ref the rest |
| `32b37ff` | "class of company, not the companies" (Big Four wording) | Lift |
| `749688e`, `314c0f1` | partnership hub + two pages | Lift (step 5) |
| `75b9d3f`, `df9877d` | badges bare, sized legible | Lift `PartnerBadgeRow.tsx` |
| `fe3f8a2` | case cards show the real photograph | Lift (step 4) |
| `05978a9`, `1004700`, `a4e7f73` | partnership hero badge size; Claude page drops its badge; Snowflake page shows Snowflake creds only | Lift (step 5) |
| `e78ac17` | blog post, both locales | Lift (step 6) |
| `54b07c0`, `f124adf`, `6c87e2e` | hero copy iterations ending at "The agentic enterprise, built on data it can trust." | Ref; superseded by the step 1 tagline |
| `fc3326e`, `d0a0b10`, `26a6607` | home redesign preview and its removal | Skip |
| `2919ba1` … `48f7ead`, `447659c`, `b75ceba` | carousel / spotlight / stories iterations | Skip |
| `087383f`, `4f289b7`, `3692490`, `95abcd3`, `fdcb95e`, `b5c9dc8` … `35912fa` | badge plates, tints, floating rectangle, breakout | Skip |
| `8818bde`, `b9dfd21` | site-wide Rails card refactor and its fix | Skip (lift `Rails.tsx` only if step 5 needs it inside the partnership pages) |
| `c209c3d`, `009b6ef` | `/newhome` concepts and their removal | Skip |

## Appendix B: where the house rules come from

`docs/content-style-guide.md` (voice, no caveats, Spanish register), the project memory in `~/.claude/projects/-Users-eduardoramos-Documents-VN/memory/` (one file per rule), and the owner's messages of 2026-09-16 to 09-19. When this guide and the style guide disagree, the style guide wins; when either disagrees with the owner in the room, the owner wins.
