# Content Style Guide

> Living reference. The **authoritative source** for the site's spelling, terminology, and the numbers it quotes. Update here first, then the pages. ([0013](decisions/0013-american-english-terminology.md), [0014](decisions/0014-canonical-metrics.md))

## Voice

Confident, precise, and human: a partner who knows the work, not a vendor reading a script. Lead with **outcomes** (faster decisions, lower cost, governed data), not features or hype. (Codified on the `/brand` page.)

- **Do:** be precise and technical; speak to outcomes; stay warm and human.
- **Don't:** bury value in jargon; overpromise ("revolutionary", "magic"); sound corporate/cold.

## Punctuation: no em dashes

**Never use an em dash (`—`, U+2014) anywhere** in the codebase: copy, JSX text, string literals, code comments, docs, and content files. Replace each with the punctuation that reads best in context:

- A pause or explanation that expands the first clause → a **colon** (`:`).
- An aside set off mid-sentence → wrap it in **commas**, or in **parentheses** if it is a true aside.
- A contrast or tacked-on phrase → a **comma**, or reword the sentence.
- Two related independent clauses → a **semicolon** (`;`) or a period.

Rules: never substitute a double hyphen (`--`); keep spacing clean (no space before `,`/`:`); **en dashes (`–`, U+2013) for numeric ranges stay** (`8–16 weeks`, `1–2 per page`); they are not em dashes.

Guard grep over rendered source + content (should return nothing). Exempt: the orphaned `prisma/seed/generated.json` and `content-source/` artifacts (not rendered) and historical `docs/` records (audits, specs, superpowers plans). New docs should still avoid em dashes.

```bash
grep -rl "—" --include="*.tsx" --include="*.ts" --include="*.md" app components lib config prisma/seed/data.ts prisma/seed/content README.md
```

## Spelling: American English

All visible copy uses American spelling. Common conversions:

`optimize` (not optimise) · `organization` · `program` (not programme) · `visualization` · `analyze` · `recognize` · `specialize` · `prioritize` · `license` · `fulfill` · `color` · `center` · `behavior`

**Exception: URL slugs are never changed**, to preserve links/SEO. The service slug `data-visualisation` (and its `SERVICE_ICONS` key in `services/page.tsx`) stays British; only the human-readable title is "Data Visualization".

Guard grep (should return only the `data-visualisation` slug):

```bash
grep -rniE "optimis|visualis|programme|organis|recognis|colour|prioritis|specialise|behaviour|\bfulfil\b|\blicence\b" \
  app components prisma/seed/data.ts config lib | grep -vi data-visualisation
```

## Terminology

- Brand name: **Viewnear** (one word, capital V). Domain `viewnear.com`.
- Pairing order: **"data & AI"** (not "AI & Data"). The strategy service is **"Data & AI Strategy"** (slug `ai-data-strategy`).
- **"Snowflake-first"**, **"governed data"**, **"single accountable team"** are core phrases. Use "end-to-end" sparingly (1–2 per page).
- Snowflake certifications: **Snowflake Premier Partner** and **Snowflake CoCo Preferred Partner** (retired: "Select-tier Services Partner"). Engineers are **SnowPro-certified**. Source the badge strings from `components/marketing/PartnerBadges.tsx` (`CERTIFICATIONS`); the canonical page is `/partnership`.

## Products & tooling ([0020](decisions/0020-snowflake-native-stack.md))

**Lead with Snowflake-native products** over third-party brands. Approved names (use these spellings exactly):

| Layer | Use |
|------|-----|
| Ingestion / movement | **Openflow**, **Snowpipe Streaming**, **Datastream**, **Zero-Copy Integrations** |
| Transformation | **dbt** (the one external framework we keep, used 100%), **Snowpark**, **Dynamic Tables** |
| Open storage | **Apache Iceberg** (v3), **Open Catalog (Polaris)** |
| Governance / context | **Horizon Catalog**, **Horizon Context**, **Cortex Sense**, **Semantic Views**, **AI Agent Identity** |
| AI & agents | **Cortex** (AISQL, Cortex Analyst, Cortex Agents, Cortex Search), **Snowflake CoWork**, **Snowflake CoCo**, **Cortex Training** |
| Consumption | **Snowsight**, **Streamlit in Snowflake**, **Snowflake CoWork** |

- **Product rebrands** (track Snowflake's names): **Snowflake CoWork** = formerly Snowflake Intelligence; **Snowflake CoCo** = formerly Cortex Code. Don't use the old names.
- **Snowflake is consumption-based** (you pay for the compute credits + storage you use, on one open platform); **never** frame it as per-user/per-seat **"licenses."** Partners help clients *procure Snowflake capacity*, not buy licenses. (The word "license" is fine only in the legal IP sense, e.g. Terms.)
- **Snowflake Document AI is deprecated.** For document classification and extraction, use **Snowflake Cortex AI** functions (`AI_CLASSIFY`, `AI_EXTRACT`, `PARSE_DOCUMENT`). Document AI is a real product but superseded, so do not lead with it.
- **Avoid these third-party brands** in copy: Matillion, Fivetran, Power BI, ThoughtSpot, Sigma, Alation, Tableau, Looker. (dbt is the lone exception.)
- The full stack with GA/Preview status lives on the **`/platform`** page (`app/(marketing)/platform/page.tsx`, `LAYERS`).

Guard grep (should return nothing):

```bash
grep -rniE "matillion|fivetran|thoughtspot|power ?bi|\bsigma\b|alation|tableau|looker|snowflake intelligence|cortex code|document ai" \
  app components prisma/seed/data.ts config lib
```

## Placeholders (intentional)

Clients, team members, and testimonials are **generic placeholders** (e.g. Northwind Bank, Meridian Health, AndesPay). Per-case-study quotes use placeholder author names + real-sounding roles. Edit in the CMS / `prisma/seed/data.ts`. ([0007](decisions/0007-content-model-isr.md))

## Region

Positioning targets **the Americas**: Canada, USA, Mexico, LATAM, Caribbean (5 regions).

## Canonical metric set: single source of truth ([0014](decisions/0014-canonical-metrics.md))

Use these everywhere; never present two as the same metric. Firm-level and delivery-level bands are kept distinct.

**Firm-level**

| Metric | Value | Shown on |
|--------|-------|----------|
| Clients served | **50+** | home stats, about stats |
| Engagements delivered | **120+** | about (labeled "engagements", never "clients") |
| Years | **15** / **15+** | home; about (senior experience) |
| Specialists | **25+** | home, about |
| Countries (Americas) | **5** | everywhere |
| Time to first value | **8–16 weeks** | home, services, FAQ |
| NPS | **90+** | services, about, why-viewnear |

**Delivery-level (Services "what engagements deliver")**

| Metric | Value |
|--------|-------|
| Faster time to first insight | **60%** |
| Pipeline reliability | **3×** |
| Lower platform run cost | **40%** |

Per-case-study outcome metrics are **study-specific** and separate from this set ([0015](decisions/0015-outcome-led-case-studies.md)). When real figures are known, update this table, then the few pages that hardcode bands: About `trackRecord`, the Services delivery band, and the home metric band.
