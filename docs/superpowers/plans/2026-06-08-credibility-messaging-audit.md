# Credibility & Messaging Audit + Rework — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit the ViewNear site's copy against a credibility rubric (with dual-persona reads), then rework the five credibility-critical pages so they earn trust from both economic and technical buyers, leaning all proof on verifiable assets.

**Architecture:** Two phases. **Audit** — Opus 4.8 subagents read/score the ~13 key pages against a 6-lens rubric, plus two skeptical-persona reads over the 5 critical pages; results synthesized into a prioritized findings report. **Rework** — apply the report's P0/P1 fixes to home, about, services, partnership, security, softening placeholder-client claims and flagging where real proof slots in. Then verify.

**Tech Stack:** Next.js 14 App Router (TSX page files under `app/(marketing)/`), Tailwind, the existing design system (cut-corner eyebrow tags `.eyebrow`/`.pill-chip`, `.btn-*`, `Section`/`SectionHeading`/`PageHero`), `next/og`, Playwright (screenshots), Vitest/ESLint/tsc (verification). Spec: `docs/superpowers/specs/2026-06-08-credibility-messaging-audit-design.md`.

**Conventions for this plan:**
- **Model:** every `Agent`/subagent call uses `model: "opus"` (Opus 4.8). This is mandatory.
- **No git:** the project is not a git repository, so "commit" steps are replaced by **Checkpoint** steps (verify state, then continue). Do not run `git` unless the user initializes a repo.
- **Dev server:** assume `npm run dev` is running on `http://localhost:3000`. Do not run `next build` while it runs (shared `.next/`); use `tsc`/`lint`/curl/screenshots, or stop dev before a build.

---

## Files

**Created:**
- `docs/credibility-audit-2026-06-08.md` — the findings report (rubric scores per page, prioritized recommendations, real-proof slot map).

**Modified (rework targets only):**
- `app/(marketing)/page.tsx` — home
- `app/(marketing)/about/page.tsx`
- `app/(marketing)/services/page.tsx`
- `app/(marketing)/partnership/page.tsx`
- `app/(marketing)/security/page.tsx`
- Supporting components only if a finding requires it (e.g. `components/marketing/home/Hero.tsx`); list the exact file in the rework task when it arises.

**Read-only during audit (not all modified):** home, about, services, solutions, approach, industries, industries/[slug], case-studies, partnership, security, pricing, platform, contact, faq.

---

## The rubric (shared by all audit tasks)

Score each page **✅ pass / ⚠️ weak / ❌ fail** on each lens, with one line of evidence and one recommendation:

1. **5-second value prop** — is the page's point clear almost immediately?
2. **Dual-reader** — concrete substance for the economic buyer (CFO/COO) *and* the technical evaluator (Head of Data/Eng)?
3. **Real, specific proof** — claims backed by verifiable assets; nothing implies a placeholder client is a real engagement?
4. **Trust at decision points** — certifications / partnership / security / governance signals sit near the claims and CTAs that need them?
5. **Differentiation** — "why ViewNear vs. a generalist / vs. build in-house" explicit and convincing?
6. **Narrative & CTA** — flows logically to one clear, brand-appropriate next step?

**Verifiable proof assets (the only ones safe to lean on):** Snowflake **Premier Partner** + **CoCo Preferred Partner**; **SnowPro**-certified team; **Snowflake Summit 2026 "CoCo Global Partner Momentum" keynote** (`public/assets/images/certs/coco-momentum-summit-2026.png`); the delivery methodology (THINK · BUILD · GROW); governance/security posture; Americas coverage. **Placeholder (NOT real):** all named clients/case studies/testimonials in the seed (Northwind Bank, AndesPay, Maple Retail, Summit Asset Mgmt, Meridian, Vista, Campo Verde, Harvest, Costera, Brava, Pacific Stores, Lumina, Open Signal).

---

## Task 1: Create the findings-report skeleton

**Files:**
- Create: `docs/credibility-audit-2026-06-08.md`

- [ ] **Step 1: Write the report skeleton**

Create `docs/credibility-audit-2026-06-08.md` with this exact content:

```markdown
# Credibility & Messaging Audit — 2026-06-08

Audience: mixed (economic CFO/COO + technical Head of Data/Eng). Goal: credibility/brand.
Rubric lenses: 1) 5-sec value prop 2) dual-reader 3) real proof 4) trust at decisions 5) differentiation 6) narrative & CTA.

## Scoreboard

| Page | 1 | 2 | 3 | 4 | 5 | 6 | Priority |
|------|---|---|---|---|---|---|----------|
| _(filled in Task 4)_ | | | | | | | |

## Per-page findings
_(filled in Task 4: for each page — scores, evidence, recommendations tagged P0/P1/P2)_

## Dual-persona reads (home, about, services, partnership, security)
_(filled in Task 4: CFO/COO doubts; Head of Data/Eng doubts)_

## Real-proof slot map
_(filled in Task 4: each spot where a placeholder claim was softened + what real asset should replace it later)_
```

- [ ] **Step 2: Verify the file exists**

Run: `test -f docs/credibility-audit-2026-06-08.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Checkpoint** — report skeleton in place.

---

## Task 2: Rubric pass — score the ~13 pages (3 Opus subagents)

**Files:** read-only (all in-scope pages). Output captured for Task 4.

- [ ] **Step 1: Dispatch three rubric-reader subagents in parallel (model: opus)**

Send all three `Agent` calls in one message. Each gets this prompt template (substitute the page list):

> You are auditing pages of the ViewNear marketing site at `/Users/eduardoramos/Documents/VN` (Next.js App Router; page files at `app/(marketing)/<route>/page.tsx`). Read ONLY these pages: `<PAGES>`. For EACH page, score it ✅/⚠️/❌ on these six credibility lenses and give one line of evidence + one concrete recommendation per lens:
> 1) 5-second value prop 2) dual-reader (CFO/COO + Head of Data/Eng) 3) real/specific proof (no placeholder client implied as real) 4) trust signals at decision points 5) differentiation vs generalist/in-house 6) narrative & CTA.
> Audience is mixed economic + technical; site goal is credibility/brand. Verifiable proof = Snowflake Premier + CoCo Preferred, SnowPro certs, Summit 2026 keynote, methodology, governance. Placeholder (treat as NOT real) = all named clients/case studies/testimonials. Flag any copy that presents a placeholder client as a real engagement.
> Return markdown: a `### <route>` heading per page, the six scored lenses, and a short "Top fixes (P0/P1/P2)" list. Be specific and quote the offending copy. Do not modify any files.

Set `model: "opus"` and `subagent_type: "Explore"` on each. Page splits:
- Agent A: `/` (home), `/about`, `/services`, `/solutions`
- Agent B: `/approach`, `/industries`, `/industries/financial-services`, `/case-studies`, `/partnership`
- Agent C: `/security`, `/pricing`, `/platform`, `/contact`, `/faq`

- [ ] **Step 2: Verify all three returned structured scores**

Confirm each agent returned a `###` heading per assigned page with six lenses scored. If an agent missed a page, re-dispatch (opus) for the missing page only.

- [ ] **Step 3: Checkpoint** — paste/retain the three results for Task 4 synthesis.

---

## Task 3: Dual-persona reads of the 5 critical pages (2 Opus subagents)

**Files:** read-only (`/`, `/about`, `/services`, `/partnership`, `/security`). Output captured for Task 4.

- [ ] **Step 1: Dispatch two persona subagents in parallel (model: opus)**

Send both `Agent` calls in one message (`model: "opus"`, `subagent_type: "Explore"`).

CFO/COO prompt:
> Read these ViewNear pages as a skeptical CFO/COO evaluating a significant data & AI engagement: `/`, `/about`, `/services`, `/partnership`, `/security` (files at `app/(marketing)/<route>/page.tsx` in `/Users/eduardoramos/Documents/VN`). You care about risk, business outcomes, ROI, and "can I trust this firm with a big bet?" For each page list: what makes you doubt or distrust, what's missing that you need, and what would make you confident. Be blunt and specific; quote copy. Note any proof that looks unverifiable. Do not modify files.

Head of Data/Eng prompt:
> Read these ViewNear pages as a skeptical Head of Data / VP Engineering: `/`, `/about`, `/services`, `/partnership`, `/security`. You care about Snowflake/architecture depth, governance, security, certifications, and the absence of fluff/marketing hand-waving. For each page list: what reads as shallow or hand-wavy, what technical proof is missing, and what would earn your trust. Be blunt and specific; quote copy. Do not modify files.

- [ ] **Step 2: Verify both returned per-page doubts/missing/confidence**

Confirm both covered all five pages. Re-dispatch (opus) for any gap.

- [ ] **Step 3: Checkpoint** — retain both persona reports for Task 4.

---

## Task 4: Synthesize the prioritized findings report

**Files:**
- Modify: `docs/credibility-audit-2026-06-08.md`

- [ ] **Step 1: Fill the Scoreboard table**

One row per audited page with the six ✅/⚠️/❌ marks (from Task 2) and an overall Priority (P0 = blocks credibility / false-proof risk; P1 = weak; P2 = polish).

- [ ] **Step 2: Fill Per-page findings**

For each page: the six lens scores with evidence, then a tagged fix list (P0/P1/P2). Merge Task 2 scores with Task 3 persona doubts where they overlap.

- [ ] **Step 3: Fill Dual-persona reads**

Summarize the CFO/COO and Head-of-Data doubts per the 5 critical pages (from Task 3).

- [ ] **Step 4: Fill the Real-proof slot map**

List every place a placeholder client/case-study/testimonial currently implies a real engagement on the 5 rework pages, what softened framing to use now, and what real asset should replace it later.

- [ ] **Step 5: Verify no placeholder sections remain in the report**

Run: `grep -nE "_\(filled|_\(Task|TBD|TODO" docs/credibility-audit-2026-06-08.md || echo CLEAN`
Expected: `CLEAN`

- [ ] **Step 6: Checkpoint** — findings report complete. This report is the source of truth for Tasks 5–9.

---

## Tasks 5–9: Rework the credibility-critical pages

> For each page, the **specific edits come from that page's P0/P1 findings + slot map in `docs/credibility-audit-2026-06-08.md`** (produced in Task 4). Apply only P0/P1 in this pass (P2 is optional polish). Honor the proof stance: lean on verifiable assets; soften/reframe any placeholder-client claim so it doesn't read as a real engagement; reuse existing components and the design system (`Section`, `SectionHeading`, `PageHero`, `.eyebrow`, `.pill-chip`, `.btn-*`). Keep copy truthful and dual-audience.

Each task follows the same shape (shown fully for Task 5; Tasks 6–9 repeat it for their page + that page's findings).

### Task 5: Rework home (`app/(marketing)/page.tsx`)

**Files:**
- Modify: `app/(marketing)/page.tsx` (and `components/marketing/home/*` only if a P0/P1 finding names it)

- [ ] **Step 1: Re-read the page and its home findings**

Read `app/(marketing)/page.tsx` and the `### /` (home) section of `docs/credibility-audit-2026-06-08.md`.

- [ ] **Step 2: Apply the P0/P1 edits**

Make the copy/structure edits the report specifies for home — e.g. tighten the value prop for both readers, move verifiable trust signals (Premier/CoCo, SnowPro, Summit keynote) up to where decisions are made, and reframe the featured **case-studies/testimonials** sections (DB-driven placeholder names) so they read as illustrative/representative rather than named real clients (per the slot map). Use existing components; do not fabricate proof.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Proof-integrity check for this page**

Run: `curl -s http://localhost:3000/ | grep -oE "Northwind Bank|AndesPay|Maple Retail|Meridian|Campo Verde|Harvest|Costera|Brava|Pacific Stores|Lumina|Open Signal" | sort -u`
Expected: either no matches, OR every match sits inside a section the slot map marks as clearly illustrative (verify visually in Step 5). Record the outcome in the slot map.

- [ ] **Step 5: Screenshot desktop + mobile and review**

Use Playwright (already a devDep) to capture `http://localhost:3000/` at 1280×900 and 390×844 to `/tmp/audit-home.{desktop,mobile}.png`; open both and confirm the page reads credibly for both audiences and shows no false-proof claim.

- [ ] **Step 6: Checkpoint** — home reworked; findings for home marked done in the report.

### Task 6: Rework about (`app/(marketing)/about/page.tsx`)
Repeat Task 5's steps for `/about` using the `### /about` findings. Proof-integrity curl target: `http://localhost:3000/about`. Screenshot to `/tmp/audit-about.*`.

### Task 7: Rework services (`app/(marketing)/services/page.tsx`)
Repeat for `/services` using `### /services` findings. (Note: the "Engagement models" section was recently expanded — keep it, fix only what the report flags.) Curl `http://localhost:3000/services`; screenshot `/tmp/audit-services.*`.

### Task 8: Rework partnership (`app/(marketing)/partnership/page.tsx`)
Repeat for `/partnership` using `### /partnership` findings. This page carries the strongest real proof (Premier/CoCo, Summit keynote) — ensure it's front-and-center. Curl `http://localhost:3000/partnership`; screenshot `/tmp/audit-partnership.*`.

### Task 9: Rework security (`app/(marketing)/security/page.tsx`)
Repeat for `/security` using `### /security` findings — the page the technical evaluator scrutinizes most (governance, certifications, data residency). Curl `http://localhost:3000/security`; screenshot `/tmp/audit-security.*`.

---

## Task 10: Global verification

**Files:** none (verification only).

- [ ] **Step 1: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean ("No ESLint warnings or errors").

- [ ] **Step 2: Route smoke test**

Run a curl status check over `/ /about /services /partnership /security` (and the other in-scope routes); expect all `200`.

- [ ] **Step 3: Proof-integrity sweep across all 5 reworked pages**

For each of `/ /about /services /partnership /security`, run the placeholder-name grep from Task 5 Step 4. Expected: no placeholder name appears as a named real engagement; any remaining mention is inside a slot-map-approved illustrative section. Record final results in the slot map.

- [ ] **Step 4: Build (optional, only if dev server stopped)**

If a full build is wanted: stop `next dev`, run `npm run build`, expect success, then restart `npm run dev`.

- [ ] **Step 5: Final review of screenshots**

Open the 10 screenshots (`/tmp/audit-*.{desktop,mobile}.png`) and confirm each reworked page reads credibly for both the economic and technical reader and matches the rubric intent.

- [ ] **Step 6: Update docs**

Add a `docs/CHANGELOG.md` entry summarizing the audit + page reworks (link the findings report). If warranted, add an ADR for the credibility/messaging rework.

- [ ] **Step 7: Checkpoint** — audit + rework complete; findings report fully filled and all P0/P1 addressed.

---

## Self-review (author check, completed)

- **Spec coverage:** rubric (Tasks 2/4) ✓; dual-persona Opus reads (Task 3) ✓; ~13-page scope (Task 2) ✓; findings report in docs/ (Tasks 1/4) ✓; rework 5 pages leaning on real proof + softening placeholders (Tasks 5–9) ✓; verify tsc/lint/build + screenshots + proof-integrity (Tasks 5/10) ✓; all subagents `model: opus` (Tasks 2/3) ✓.
- **Placeholders:** the report template's `_(filled in Task N)_` markers are intentional and removed/verified in Task 4 Step 5 — not plan placeholders. Rework copy is intentionally sourced from the Task 4 report (a produced artifact), not pre-written.
- **Consistency:** report path `docs/credibility-audit-2026-06-08.md` and the 5 rework files are referenced identically throughout.
- **Dependency:** real client proof remains user-owned; the slot map (Task 4 Step 4) makes later swap-in turnkey.
