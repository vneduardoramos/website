# Credibility & Messaging Audit — 2026-06-08

Audience: mixed (economic CFO/COO + technical Head of Data/Eng). Goal: credibility/brand.
Rubric lenses: 1) 5-sec value prop 2) dual-reader 3) real proof 4) trust at decisions 5) differentiation 6) narrative & CTA.
Method: 3 Opus rubric readers (13 pages) + 2 Opus skeptical-persona reads (5 critical pages).

## Headline takeaway

The site is **well-designed and well-structured**, but **evidence-light and, in places, presents fabricated placeholder content as real** — the single biggest credibility risk. Both personas independently flagged the same things: fake client logos/case studies/testimonials shown as real, headline numbers that don't reconcile across pages, an "Elite Tier" vs "Premier" partner contradiction, and a security page that quietly reveals ViewNear holds none of its *own* attestations. The **/partnership** and **/faq** pages are the credibility high-water mark (lean entirely on verifiable proof); **/security** is honest but under-sells ViewNear's own posture.

## Scoreboard

| Page | 1 VP | 2 Dual | 3 Proof | 4 Trust | 5 Diff | 6 Narr | Priority |
|------|----|----|----|----|----|----|----------|
| `/` home | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | ✅ | **P0** |
| `/about` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | **P0** |
| `/case-studies` | ✅ | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | **P0** |
| `/industries/[slug]` | ✅ | ✅ | ❌ | ✅ | ⚠️ | ✅ | **P0** |
| `/contact` | ⚠️ | ⚠️ | ❌ | ✅ | ⚠️ | ✅ | **P0** |
| `/services` | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | P1 |
| `/solutions` | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | P1 |
| `/approach` | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | ✅ | P1 |
| `/industries` | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | P1 |
| `/platform` | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | P1 |
| `/security` | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | P1 |
| `/pricing` | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | P2 |
| `/faq` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | P2 |

## Cross-cutting P0s (fix once, helps everywhere)

1. **Placeholder proof presented as real.** Fake named clients/case studies/testimonials render as genuine across home (`LogoStrip`, case-study grid, testimonials), `/about` (a *second, different* fake logo wall), `/services` ("Proof" testimonials), `/case-studies` (`Client: <name>` + "Real outcomes" meta), `/industries/[slug]` ("Proof" section + named client quote + "12+ clients"), `/contact` (alt text "collaborating with a client"). **Stance: lean on real (Premier/CoCo, SnowPro, Summit keynote), and relabel/soften every placeholder so nothing reads as a real engagement** until real proof lands. See slot map below.
2. **Stat reconciliation.** Home "50+ clients / 15 years / 5 countries" vs `/about` "120+ engagements / 15+ years / 90+ NPS" vs DB stats "50+ clients / 25+ specialists." Pick ONE canonical, defensible set (ties to ADR 0014 "canonical metrics"). The **"90+ NPS"** is the least believable single claim — drop or substantiate. Reconcile the "15 years" vs the news-seed "Snowflake partner in just four years" tension.
3. **"Elite Tier Partner" fallback** in `app/(marketing)/page.tsx` `whyPoints` (~L59-63) contradicts the real **Premier Partner** brand everywhere else. Fix the fallback string.
4. **ViewNear's own trust signals are missing where buyers decide.** `/platform`, `/solutions`, `/industries`, `/case-studies`, `/contact` make strong claims with NO Premier/CoCo/SnowPro signal nearby. Surface the verifiable badge/cert band on these.

## Per-page findings (top fixes)

**`/` home — P0.** ❌ proof. P0: remove/relabel the placeholder `LogoStrip` + case-study + testimonial sections; move `PartnershipHighlight` (real keynote/badges) above them so real proof carries credibility. P1: reconcile stat band; fix "Elite Tier" fallback. P2: tighten the vague hero H1 ("do more") to name the outcome; split the 40-word subhead; add a one-line "why us, not a generalist/in-house" block.

**`/about` — P0.** ❌ proof. P0: remove/relabel the second fake logo wall ("Northwind Capital, Andes Logistics…" — doesn't even match the seed); reconcile "120+ engagements / 90+ NPS / 15+ years" to the canonical set or drop the unverifiable ones. P1: confirm seed team bios ("(Placeholder team member.)") never ship; add SnowPro cert counts/levels; add an explicit "vs build in-house" line.

**`/case-studies` — P0.** ❌ proof, ❌ differentiation. P0: drop the `Client: <name>` line for placeholder studies and the "Real outcomes" metadata; relabel cards "Illustrative engagement" until real. P1: add a Premier/SnowPro differentiator strip; add per-card tech tags for the technical reader.

**`/industries/[slug]` — P0.** ❌ proof (template-level, affects all 7). P0: the "Proof" section renders a named placeholder client + quote + "N+ clients" stat as real — relabel illustrative or replace with verifiable proof until real references exist. P1: add SnowPro/Premier wording to the engagement copy ("senior practitioners" → "certified specialists").

**`/contact` — P0.** ❌ proof (subtle). P0: image alt "The Viewnear team collaborating with a client" implies a real client on a stock photo — reword to "Viewnear consultants collaborating." P1: add a trust strip (Premier/CoCo + SnowPro) + a response-time commitment beside the form; generic "Let's build something remarkable" hero → offer-specific; add a role/project-type field.

**`/services` — P1.** ⚠️ proof. P1: the "Proof — what our clients say" testimonials are placeholders, and the "What engagements deliver" metrics (60% / 3x / 40% / 90+ NPS, "Representative results") are unsourced and trace to fake case studies — relabel clearly as illustrative/target and remove/soften placeholder quotes. (Engagement-models section recently expanded — keep it.)

**`/solutions` — P1.** ⚠️ dual-reader/trust/diff. Add a business-outcome line per solution (CFO has nothing today); add a Premier/CoCo band near the FINRA/HIPAA/PCI claims; add a "why ViewNear" beat before the CTA.

**`/approach` — P1.** ⚠️ dual-reader/proof/diff. Add a technical strip (semantic layer, Horizon lineage, hand-over artifacts); anchor one phase claim to verifiable proof; name the in-house/generalist alternative. **Note:** uses a 6-step model, not THINK·BUILD·GROW — reconcile the canonical methodology name with `/services`.

**`/industries` (index) — P1.** Add a verifiable proof chip + a /security link near the sector grid; add the SnowPro/Premier "certified depth" angle so "domain-led" isn't just a tagline.

**`/platform` — P1.** ⚠️ dual-reader/trust. Strongest technical/differentiation page, but a pure product matrix — add a "what this means for the business" band and surface Premier/CoCo + SnowPro to substantiate the mastery claim.

**`/security` — P1.** ✅ honest (explicitly states certs are Snowflake's, inherited). Gaps: shows none of **ViewNear's own** posture — add SnowPro/Premier/CoCo here; add a self-serve security/vendor-review artifact at the CTA; "aligned/aware/ready" are weasel words a technical buyer flags.

**`/pricing` — P2.** Anchor the horizon claims to the methodology + the "8–16 wks / POC-first" facts; add a trust line at the estimate CTA; state what the buyer owns at the end (IP/code/enablement).

**`/faq` — P2.** ✅ strongest proof page. Add an empty-state guard (a DB miss currently ships a blank page); add FAQs referencing the Summit 2026 keynote + methodology.

## Dual-persona reads (5 critical pages)

**CFO/COO (skeptical economic buyer).** "Evidence-light. The named clients/testimonials/metrics are confirmed fabricated placeholders, so nothing can be reference-checked. The partner tier contradicts itself (Elite vs Premier); track-record numbers don't reconcile (50+/120+ clients, 15/15+/4 years); 90+ NPS is implausibly high and unsourced; and /security quietly admits ViewNear holds none of the certs it displays. Would not commit significant spend without: named callable references, a verifiable Snowflake partner-directory listing, ViewNear's own security attestation (SOC 2 / DPA / cyber insurance), and one real client-validated case study." Strongest pages for this reader: /partnership (comparison table), /pricing ("a price you can take to the board").

**Head of Data / VP Eng (skeptical technical buyer).** "Lots of 'governance/lineage/AI force-multiplier' sloganeering with no substance. No reference architecture, no ingestion-pattern specifics (Snowpipe vs Openflow vs batch), no warehouse-sizing/cost-governance method, no CI/CD or IaC. 'SnowPro-certified' with no count/levels/names; partner tier with no directory link. /services' stack list is the only real Snowflake signal but it's a logo wall with no opinion (when Snowpark vs dbt? Iceberg vs native? Cortex guardrails?). /security is the high-water mark for honesty but omits ViewNear's own access controls / Tri-Secret Secure / cross-border personnel access / BAA. Would earn trust with: a real reference architecture, one substantiated metric tied to the levers used, named engineers with verifiable cert IDs, and a 'how we decide' section showing engineering judgment."

## Real-proof slot map

Each spot where placeholder content currently implies a real engagement → softened framing now → real asset to slot later.

| Location | Now (placeholder implied real) | Soften to (now) | Real asset to slot later |
|---|---|---|---|
| Home `LogoStrip` (`home/Hero`/`Blocks`) | Named client logo wall | Remove, or replace with Premier/CoCo + SnowPro badges + Summit keynote | Real client logos (with permission) |
| Home case-study grid + testimonials | "Northwind Bank…" studies + "Marcus T., COO" quotes as real | Label section "Illustrative engagements" / move real `PartnershipHighlight` above; soften "Trusted by"/"Outcomes that speak…" headings | Real case studies + named testimonials |
| `/about` second logo wall + "120+ / 90+ NPS" | Fake roster + unverifiable stats | Remove logo wall; reconcile to canonical stats or drop NPS/120+ | Real roster + measured NPS/CSAT |
| `/case-studies` cards | `Client: <name>` + "Real outcomes" meta | Drop client name line; relabel "Illustrative"; remove "Real outcomes" | Real client-validated studies |
| `/industries/[slug]` "Proof" block | Named client quote + "N+ clients" stat | Relabel "Illustrative scenario"; replace stat with capability/cert proof | Real per-sector references |
| `/contact` image alt | "collaborating with a client" | "Viewnear consultants collaborating" | Authentic team/client photo |
| `/services` "Proof" testimonials + metric band | Placeholder quotes + unsourced 60%/3x/40%/90 NPS under "Proof" | Relabel "Representative/illustrative targets"; remove placeholder quotes | Real metrics + quotes |

## Recommended rework-scope adjustment (vs. the original plan)

The approved plan set rework = **home, about, services, partnership, security** (chosen pre-audit). The audit shows: **partnership is already an exemplar** (minimal work) and the **real P0s also live on `/case-studies`, the `/industries/[slug]` template, and `/contact`** — none of which were in the rework set, but several are P0. Recommend reworking by **P0 priority**: home, about, case-studies, industries/[slug] template, contact, services — driving the cross-cutting fixes (placeholder framing, stat reconciliation, Elite→Premier, trust-signal placement) through the shared components so they propagate. Confirm scope with the user before changing live brand copy.
