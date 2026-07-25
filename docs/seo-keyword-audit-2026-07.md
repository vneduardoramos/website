# SEO keyword audit: data & AI vocabulary + the Monterrey nearshore asset

**Date:** 2026-07-25
**Scope:** on-site term coverage for a data & AI engineering practice with a nearshore delivery team in Monterrey, Mexico. Companion to `docs/seo-offsite-checklist.md` (off-site, still open).

---

## Method

Every English string the site can render was pulled into one corpus and counted:

| Source | What it covers |
| --- | --- |
| `messages/en/*.json` (47 files) | all page copy, headings, meta titles and descriptions |
| `prisma/seed/data.ts` | services, industries, case studies, FAQ, press, team |
| `prisma/seed/content/**/*.md` (19 posts) | blog longform |

Corpus: **330,897 characters** of English copy. **318 target terms** across 17 clusters were counted on three surfaces separately: `<title>`/description metadata, headings, and body prose. Word boundaries and plurals were handled so `APIs` counts for `API` and `foundation` does not count for `NDA`.

**Result: 201 of 318 terms present (63%).**

Not measured here: search volume, difficulty, and current rank. Those need Search Console (still unverified, per the off-site checklist) plus a keyword tool. This audit answers a different question: *which words are on the site at all, and where.*

---

## Scorecard

| Cluster | Coverage | Read |
| --- | --- | --- |
| Travel / flights / visits | **4/21 (19%)** | the proximity asset is unwritten |
| Nearshore delivery model | **6/20 (30%)** | you own "nearshore," not the commercial vocabulary around it |
| QA / testing | 2/6 (33%) | out of positioning, fine |
| Software engineering | 9/26 (35%) | mostly deliberate, one real gap (see Gap D) |
| Time zone / overlap | 8/15 (53%) | the claim is made, never proven with detail |
| Cloud / DevOps | 9/16 (56%) | deliberate: Snowflake-native stance |
| Industry verticals | 16/24 (67%) | matches the 7 industry pages |
| Geography / proximity | 13/19 (68%) | count is misleading, see below |
| ML / data science | 11/16 (69%) | ops vocabulary missing |
| Snowflake ecosystem | 11/16 (69%) | strong; a few 2026 product names missing |
| Analytics / BI | 9/13 (69%) | one head term missing entirely |
| Security / compliance | 12/17 (71%) | solid |
| Culture / language | 6/8 (75%) | thin but present |
| Data governance / quality | 12/16 (75%) | strong |
| AI / GenAI | **26/32 (81%)** | strong |
| Data engineering | **22/25 (88%)** | strongest cluster |
| Commercial / buyer intent | 25/28 (89%) | strong |

The Snowflake, data engineering, governance and AI vocabulary is genuinely good. Everything weak sits in one place: **the words that turn "we are nearshore" into "we are 2 hours from your office."**

---

## Gap A: the proximity asset is unwritten (highest value, lowest effort)

Monterrey proximity is the differentiator you named, and it is the emptiest part of the site. Counts across the entire corpus:

| Term | Occurrences |
| --- | --- |
| flight / flights | **0** |
| nonstop, non-stop | **0** |
| airport, MTY | **0** |
| onsite, on-site | **0** |
| "delivery center", "development center" | **0** |
| USMCA, NAFTA | **0** |
| visa | **0** |
| CST, CDT | **0** |
| "United States" (spelled out) | **0** |
| Nuevo León | 1 |
| proximity | 1 |
| miles | 2 |
| visit | 2 |
| distance | 4 |
| travel | 5 |
| Monterrey | 14 |

Supporting findings:

1. **The homepage carries zero geography.** `messages/en/home.json` contains "nearshore" 3 times and **Monterrey 0, Mexico 0, Americas 0, "time zone" 0**. The highest-authority URL on the domain gives Google no location signal at all.
2. **No title tag contains Monterrey or Mexico.** Across 23 page titles, geography appears only in the `/nearshore` *description*. Titles are the strongest on-page element you control.
3. **`/nearshore` is thin: roughly 700 words**, with one outbound internal link (`/approach`). For a commercial term with well-funded competitors (Softtek is headquartered in Monterrey; Azumo, ScienceSoft, BEON, nCube, Alcor all run dedicated Mexico landing pages), 700 words with no geographic detail will not compete.
4. **No location page exists.** No `/monterrey`, no `/locations`, no `/nearshore/mexico`. Both office addresses appear in visible copy only as fragments on `/contact` ("Monterrey, MX · Valle Alto") and in schema only on `/life-at-viewnear`, a culture page.
5. **The two-office `ProfessionalService` schema is on the wrong page.** `app/[locale]/(marketing)/life-at-viewnear/page.tsx:171-200` carries both `PostalAddress` blocks. Neither `/nearshore` nor `/contact` emits an address, and the site-wide `Organization` JSON-LD (`app/[locale]/layout.tsx:50-79`) has `areaServed` but **no `address` and no `location`**.

### Terms to add, and where

Group these into a real proximity section on `/nearshore` plus a new location page. Suggested phrasings (verify every fact before publishing, see the caution below):

- nearshore delivery center, nearshore development center, delivery hub in Monterrey
- Monterrey, Nuevo León, Mexico; Monterrey International Airport (MTY)
- nonstop flights, direct flights, same-day travel, two-hour flight, quick onsite visits
- US Central time zone, CST, CDT, overlapping business hours, same-day answers
- onsite workshops, quarterly onsite, in-person discovery, sprint reviews in your office
- USMCA, bilingual team, English-proficient engineers, cultural alignment
- Tecnológico de Monterrey and the regional engineering talent pool

**Caution on facts.** Route maps change and the no-overclaiming rule applies. Directflights.com currently lists MTY with nonstop service to 67 destinations across 11 countries; confirm the specific US routes you name (Houston, Dallas, Austin, Chicago, Atlanta) against current airline schedules before publishing, and prefer durable phrasing ("nonstop to major Texas hubs in under two hours") over a route list that goes stale. Do not publish a cost-savings percentage; competitors quote "up to 75%" and it is unverifiable for you.

---

## Accuracy issue found while auditing: the "same clock" claim

Mexico abolished daylight saving time in 2022. **Monterrey stays on CST (UTC-6) year round; US Central switches to CDT (UTC-5) from mid-March to early November.** Checked live while writing this:

```
Austin/Chicago: 08:45 CDT
Monterrey:      07:45 CST
```

The `TwoClocks` component (`components/marketing/nearshore/TwoClocks.tsx:14-15`) uses real IANA zones, so it correctly renders that one-hour difference. But it sits directly under copy that says **"US Central time zone"** (hero chip), **"The same time zone, not a handoff"** and **"on the same clock"** (`messages/en/nearshore.json:13,27,28`). For roughly eight months a year the widget visibly contradicts the caption on the page.

Fix the copy, not the clocks. The honest version is stronger anyway because it is specific:

> Monterrey holds CST all year, so we are on your clock in winter and one hour behind US Central in summer. Either way the working day overlaps end to end: a blocker raised at 10am gets answered before lunch, not overnight.

That single correction also earns you `CST`, `CDT` and "overlapping business hours," three of the zero-count terms.

---

## Gap B: nearshore commercial vocabulary (30%)

You own the word "nearshore" (58 occurrences in prose, 32 in headings, 6 in metadata). You do not own the phrases buyers pair with it:

| Term | Occurrences | Note |
| --- | --- | --- |
| "nearshore software development" | **0** | the category head term |
| "nearshore delivery center" | **0** | |
| "dedicated team" | **0** | standard engagement-model term |
| "team extension", "extension of your team" | **0** | |
| "nearshore partner" | **0** | |
| build-operate-transfer, captive center | **0** | probably out of scope, fine |
| "staff augmentation" | 2 | both on `/pricing` only |
| outsourcing | 7 | mostly used to describe what you are *not* |
| "nearshore delivery" | 6 | good, underused |
| "nearshore team" | 4 | |

Two things to note:

- **"consulting" and "consultancy" are correctly at zero.** That is the brand rule working. Keep the site clean and let Clutch, G2 and GoodFirms carry "Snowflake consulting," exactly as the off-site checklist already says. You asked about a "software consultancy for AI and data"; on-site, the phrase to own is *data and AI engineering practice*, and off-site directories absorb the consulting queries.
- **"dedicated team" and "team extension" are safe to add** because they describe how you already work ("embedded-team models" appears on `/pricing`, "work inside your team" in the service copy). This is renaming a real thing in the language buyers search, not a new claim.

---

## Gap C: head terms for AI and data

Missing entirely, and each is a genuine gap rather than a positioning choice:

| Term | Occurrences | Why it matters |
| --- | --- | --- |
| **"artificial intelligence"** | **0** | `AI` appears 434 times; the spelled-out entity name appears nowhere. Add it once or twice in prose for entity clarity and for queries that spell it out. |
| **"business intelligence"** | **0** | `BI` appears 34 times, always abbreviated. High-volume head term, and you have Power BI (9) and Tableau (15) work to back it. |
| MLOps, LLMOps | 0 | you run production AI; the ops vocabulary is absent |
| "AI governance", "responsible AI" | 0 | you sell governance harder than anyone; this is the AI-era phrasing of it |
| evals, evaluations | 0 (`evaluation` 2) | how buyers now ask "how do you know the agent is right?" |
| "model context protocol" | 0 (`MCP` 2) | spell it out once |
| lakehouse | 2 | fine |
| "warehouse modernization" | 0 | you have a whole `/migrations` page for exactly this |
| NLP, computer vision | 0 | leave at zero unless you deliver it |
| Fivetran, Matillion, Databricks | 0 | correct, Snowflake-native stance |
| Snowflake Intelligence, Document AI, Marketplace, Unistore | 0 | 2026 product surface worth naming where you actually use it |

Also worth noting: `data science` 1, `data scientist` 2. If data science is part of the offer, it is effectively invisible. If it is not, ignore this line.

---

## Gap D: the "software" half of "software consultancy" (a decision, not a bug)

You framed the business as a software consultancy for AI and data. The site is not written that way, and mostly should not be:

| Term | Occurrences |
| --- | --- |
| "custom software", "application development", full-stack, microservices | **0** |
| DevOps, Kubernetes, Docker, Terraform, platform engineering | **0** |
| "test automation", "quality assurance" | **0** |
| React, Node, .NET, TypeScript, mobile app | 0 to 1 |
| API / APIs | 10 |
| Streamlit | 15 |
| "data app" | 5 |
| integration | 37 |

**Recommendation: do not chase generic custom-software terms.** "Nearshore software development company" SERPs are saturated by staffing firms with hundreds of engineers, the queries convert to staff-augmentation buyers rather than data and AI buyers, and pursuing them would dilute the Snowflake positioning that is currently your strongest asset.

**Do claim the adjacent slice you actually deliver**, which is currently under-worded:

- **Data applications and embedded analytics.** `/services/embedded-analytics` already describes a "product squad" delivering features into a client product, yet `API` appears 10 times site-wide and `microservices`, `full-stack` and `application development` never. Terms to add there: data application development, embedded analytics, product engineering, APIs and data services, Streamlit and Native Apps.
- **Agent engineering.** `agentic` (45) and `AI agent` (41) are strong; pair them with software vocabulary ("agent engineering," "integrations," "in the flow of work") rather than with "custom software."

If you do want the broader software-development market, that is a separate positioning decision with its own page cluster, and it should be a deliberate call rather than keyword insertion into the current pages. Flagging it, not deciding it.

---

## Gap E: FAQ coverage (structured-data leverage, currently unused)

The site emits `FAQPage` schema on `/faq` and on each `/services/<slug>` (`app/[locale]/(marketing)/faq/page.tsx`, `services/[slug]/page.tsx`). There are **11 FAQ entries** in `prisma/seed/data.ts:654-664`, and **none** is about nearshore, Monterrey, time zones, travel, or offshore comparison. Every one is about Snowflake partnership, delivery, commercials, or security.

This is the cheapest long-tail capture on the site, and it feeds both Google rich results and AI answer engines. Questions to add (categories already exist):

- Where is Viewnear's delivery team located?
- What time zone does the Monterrey team work in?
- How far is Monterrey from the US, and can the team travel onsite?
- How is nearshore different from offshore for a data and AI build?
- Is the team bilingual?
- Can we visit the delivery center, and can your team work in our office?
- What engagement models do you offer (dedicated team, team extension, fixed outcome)?
- Who owns the code and the IP? (`NDA`, `MSA`, `SLA`, `SOW` all score 0 site-wide)

Each answer naturally carries several zero-count terms without a single line of keyword stuffing.

---

## Metadata hygiene

Several titles waste the most valuable element on the page. The layout appends `" | Viewnear"` (`app/[locale]/layout.tsx:15-17`), so add 11 characters to each:

| Page | Current title | Chars | Problem |
| --- | --- | --- | --- |
| `/approach` | "Our approach" | 12 | no keyword at all |
| `/case-studies` | "Case studies" | 12 | no keyword |
| `/press` | "In the press" | 12 | no keyword |
| `/news` | "News & Events" | 13 | noindex, ignore |
| `/life-at-viewnear` | "Life at Viewnear" | 16 | brand-only, but it is the page holding both office addresses |
| `/security` | "Security & Trust" | 16 | no qualifier |
| `/industries` | "Industries we serve" | 19 | no qualifier |
| `/pricing` | "Pricing & engagement" | 20 | no qualifier |
| `/partnership` | "Snowflake Partnership" | 21 | thin for your best credential |

Good ones to model on: `/nearshore` (67), `/migrations` (66), `/data-ai` (58), `/about` (55). Rewrites should stay under about 60 characters before the suffix and each should carry one qualifier plus, where honest, one geography or credential signal. For example:

- `/approach` → "How we deliver: use-case sprints, proof before scale"
- `/case-studies` → "Snowflake data & AI case studies across the Americas"
- `/pricing` → "Pricing & engagement models: fixed outcome or embedded team"
- `/partnership` → "Snowflake Premier & CoCo Preferred Partner"
- `/industries` → "Industries: data & AI by sector, from manufacturing to finance"

---

## Technical and structured-data fixes

1. **Add `address` to the site-wide `Organization`** (`app/[locale]/layout.tsx:50`), listing both offices via `location: [Place, Place]`. Today the entity has no postal address anywhere except a culture page.
2. **Move or duplicate the two `ProfessionalService` blocks onto `/contact` and `/nearshore`**, the pages with location intent. Keep `/life-at-viewnear` if you like; duplication across pages is legitimate here.
3. **Extend `knowsAbout`** (`layout.tsx:62-70`). It currently lists 7 topics and already includes "Nearshore software delivery." Add: nearshore delivery center, Monterrey Mexico, business intelligence, artificial intelligence, AI agents on Snowflake, data governance, MLOps.
4. **Spell out `areaServed`.** It reads `["United States", "Canada", "Mexico", ...]` in schema while the phrase "United States" never appears in visible copy. Use it in prose at least once.
5. **No `/careers` index page exists** (only `app/[locale]/(marketing)/careers/[slug]`), yet job URLs are in the sitemap. A `/careers` hub in both locales would give the Monterrey recruiting terms a home and add Nuevo León entity signal on the Spanish side.
6. **Spanish side is well set up** (`es_MX` OG locale, reciprocal hreflang, `x-default`, Monterrey in the `/es/nearshore` title). Mirror every change below into `messages/es/*` so the Mexico-facing pages keep parity.

---

## Prioritized actions

> **Status (2026-07-25): P0, P1, and P2 items 11 to 12 are shipped.** Item 13 is a
> positioning decision, not a task, and it is open. What remains beyond it is the off-site
> half in `docs/seo-offsite-checklist.md`. Search Console is still unverified, so none of
> this is measurable yet: that is the next real blocker, and it needs account access rather
> than code.

**P0, this week (copy only, no new routes)** — done

1. Fix the DST claim on `/nearshore` (`messages/en/nearshore.json:13,27,28` + es mirror). Correctness issue, visible on the page today.
2. Add a proximity block to `/nearshore`: flights, distance, onsite cadence, CST/CDT, USMCA, bilingual. Takes the page from roughly 700 to roughly 1,100 words and clears most of Gap A.
3. Put geography on the homepage: one sentence naming Monterrey, Mexico and Austin, Texas and the time-zone overlap.
4. Add 8 nearshore and engagement FAQ entries to `prisma/seed/data.ts` so `FAQPage` schema starts carrying the long tail.
5. Add "artificial intelligence" and "business intelligence" in prose where they read naturally (`/data-ai`, `/services/data-visualisation`).

**P1, next** — done

6. Rewrite the 9 thin title tags listed above (en + es). *Done: 8 rewritten (`/news` skipped, it is noindex).*
7. Ship `/nearshore/monterrey` (or `/monterrey-delivery-center`): the delivery center page, roughly 900 to 1,200 words, with the office photo, address, `ProfessionalService` schema, talent pool, travel and time zone, and a link back to `/nearshore`. *Done: 1,057 words, en + es, in the sitemap, linked from the `/nearshore` proximity section.*
8. Add address and location to `Organization` schema; duplicate `ProfessionalService` onto `/contact` and `/nearshore`. *Done: addresses extracted to `lib/offices.ts` as the single NAP source, now emitted on `/contact`, `/nearshore`, `/nearshore/monterrey` and `/life-at-viewnear`, with `address` + `location` on the site-wide `Organization` and `knowsAbout` extended to 13 topics.*
9. Name the engagement models in the buyer's words on `/pricing`: dedicated team, team extension, staff augmentation, fixed outcome. *Done, on `/pricing` and `/services`.*
10. Add the AI-ops vocabulary where it is true: MLOps, evals, AI governance, model context protocol. *Done. MLOps is described as the Snowflake loop the platform supports, not as a separate service we sell; NLP and computer vision stay at zero because we do not deliver them.*

**P2, when there is room**

11. `/careers` hub, in both locales, aimed at Monterrey engineering talent. *Done. Note: `/careers` had a permanent 301 to `/life-at-viewnear` in `next.config.mjs`, which is now removed so the URL serves the hub. Clients that cached the 301 will keep redirecting until that cache expires. The hub is the recruiting-intent page (who we hire, locations, growth, openings) and links out to `/life-at-viewnear` for culture rather than duplicating it; the job detail pages now link back to the hub instead of the culture page.*
12. Strengthen the internal-link graph into `/nearshore`: 8 inbound links today, and 5 of them are from seed longform rather than navigation. *Done: in-content links went from 3 to 12 references across 9 templates. `/nearshore` is now linked from `/pricing` and `/approach`; `/nearshore/monterrey` from `/about`, `/life-at-viewnear`, `/careers` and the `/nearshore` proximity section. `Careers` also joined the nav and footer Company groups.*
13. Decide the software-engineering question in Gap D before writing any of it. **Decided 2026-07-25: stay focused.** No software-development page cluster. Generic terms (custom software, application development, full-stack, microservices, DevOps, Kubernetes, QA, test automation, mobile) stay deliberately at zero, and a guard grep for them is a legitimate check on future copy. The adjacent slice we do deliver is now named: "data application development" and "APIs and data services" on `/services/embedded-analytics`, "agent engineering" on `/data-ai`.
14. Off-site work in `docs/seo-offsite-checklist.md` is still the other half of this. Search Console is unverified, so none of the above is measurable yet. Do that first if you want to track any of it.

---

## Words to keep at zero (brand rules, verified as compliant)

| Term | Count | Rule |
| --- | --- | --- |
| consulting, consultancy, consultant | 0 | banned in site copy; directories carry it instead |
| "you own the platform", "no lock-in" | 0 | ownership filler rule |
| "the platform" as the deliverable | not used that way | Snowflake is the platform; you deliver governed, AI-ready data |
| auto-learning / self-improving AI claims | 0 | no-overclaiming rule |
| em dashes | n/a | style rule |

---

## Sources consulted for competitor and factual grounding

- [Direct flights from Monterrey (MTY), 67 destinations](https://www.directflights.com/MTY)
- [Time in Monterrey, Mexico](https://time.is/Monterrey)
- [Why Monterrey is an ideal nearshoring hub, Axented](https://www.axented.com/blog-posts/why-monterrey-mexico-is-the-ideal-nearshoring-hub-for-software-development)
- [Nearshore Software Development in Mexico, Azumo](https://azumo.com/nearshore-software-development/mexico)
- [2026 Guide to Nearshore Software Development in Mexico, ScienceSoft](https://www.scnsoft.com/software-development/nearshore/mexico)
- [Nearshore Software Development in Mexico, BEON.tech](https://beon.tech/blog/nearshore-software-development-mexico/)
- [Top 10 Nearshore Engineering Companies in Mexico, Mismo](https://mismo.team/nearshore-engineering-mexico-companies-guide/)
- [Nearshore Staff Augmentation Mexico, Relay Human Cloud](https://www.relayhumancloud.com/blog/nearshore-staff-augmentation-in-mexico/)
