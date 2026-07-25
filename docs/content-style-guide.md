# Content Style Guide

> Living reference. The **authoritative source** for the site's spelling, terminology, and the numbers it quotes. Update here first, then the pages. ([0013](decisions/0013-american-english-terminology.md), [0014](decisions/0014-canonical-metrics.md))

## Voice

Confident, precise, and human: a partner who knows the work, not a vendor reading a script. Lead with **outcomes** (faster decisions, lower cost, governed data), not features or hype. (Codified on the `/brand` page.)

- **Do:** be precise and technical; speak to outcomes; stay warm and human.
- **Don't:** bury value in jargon; overpromise ("revolutionary", "magic"); sound corporate/cold.

### No caveats, no explaining ourselves (2026-07-25)

Accuracy is required; apologizing for it is not. State a fact and move on. Never frame a detail as a **caveat, disclaimer, admission, or confession**, and never narrate our own honesty.

- Banned framings: "one caveat worth stating", "the honest version", "to be fair", "we should admit", "worth saying plainly rather than claiming...", "full disclosure". In Spanish: "la versión honesta", "una aclaración que vale decir", "vale más decirlo que...".
- Structure a factual detail as **promise, then mechanism**: lead with what the client gets, state the fact plainly in the middle, close on the benefit. Not: fact, hedge, reassurance.
- Worked example. The Monterrey time-zone detail (Mexico dropped DST in 2022, so the clock sits an hour behind US Central from March to November) is real and must stay in the copy, because the live `TwoClocks` widget shows it. It reads: *"The team works your business hours year round. Monterrey holds CST all year, so when US Central moves to CDT the clock here sits an hour behind: the working day still overlaps end to end."* It used to read *"Central Time, with one caveat worth stating"*, which was rejected.

### Spanish (es) voice — Mexican professional register, impersonal (revised 2026-07-25)

The `/es` site is **Mexican business Spanish**: professional and human, NOT a literal translation of the English and NOT casual/slangy. The exemplar is the home page (`messages/es/home.json`, `heroUi.json`, `homeServer.json`, and the `hero` blob in `prisma/seed/es/settings.ts`). Match its register when translating any other page.

**Register: impersonal. Never address the reader as a person.** This supersedes the earlier `usted` rule (2026-07-09), which was reversed on 2026-07-25 and swept out of the whole `/es` surface. Concretely:

- **No `usted`/`ustedes`**, and no verb forms that address the reader: not `usted acepta`, not `si quiere`, not `puede ver` (use `se puede ver`).
- **No `usted` imperatives.** Buttons, links, and eyebrows take the **infinitive**: `Hablar con un arquitecto`, `Ver el proyecto →`, `Leer el artículo`, `Explorar la plataforma`, `Postularse`, `Contacto` (not `Contáctenos`). Body-copy advice becomes `Conviene + infinitive`, `Vale la pena + infinitive`, `Basta con + infinitive`, or a plain statement.
- **No reader-directed `su`/`sus`.** Use `el`/`la`/`los`/`las`, or name the owner: `los datos`, `el equipo interno`, `la oficina del cliente`, `el horario del cliente`, `la organización`. Third-person `su` is fine when it belongs to something already named (`el producto ... llevar su marca`, `los clientes confían en sus datos`).
- **No reader-directed dative `le`/`les`:** `le responderemos` → `respondemos`; `le mostraremos` → `mostramos`.
- **`cuéntenos X y haremos Y`** becomes a condition: `Con X sobre la mesa, hacemos Y` / `Con saber X, hacemos Y`.
- **Legal pages** (`privacy`, `terms`) use third-person **`el usuario`**, not `usted`.
- **Use the English terms Mexican tech/enterprise teams actually use** (do NOT translate these): `sponsor` (not "patrocinador"), `POC`, `build`, `scope`, `backlog`, `discovery`, `stack`, `dashboard`, `pipeline`, `Time & materials`, `Staff augmentation`, `compliance`, plus all brand/product nouns (Snowflake, Cortex, Horizon, Data + AI, ...).
- **Right words:** `números` (never "cifras"); `juntas` (not "reuniones"); `en producción` / `en un nivel productivo`. Translate for real *intent*, not dictionary meaning (e.g. "prove it first" → "Comprobado con un POC", not "pruébelo primero").
- **Do NOT get casual/slangy.** Banned as too informal: "Ahí entramos", "se las dejamos operando", "le entramos", "cinco Excels", "no en un PowerPoint", "en corto", "nos conviene a los dos", "meterle a", "aventarse a ciegas". These over-corrected a prior draft and were rejected.
- **Carry over the English rules:** generic "AI" → **"IA"** but keep the brand pairing **"Data + AI"** in English; no em dashes; all the Positioning/banned-word rules below apply in Spanish too (no "consultoría/consultor"; Snowflake is the platform, never call the deliverable "la plataforma").

## Positioning

**Statement (internal north star, revised 2026-07-06):** Viewnear helps enterprises stand up two capabilities they keep: a **data practice** (governed, trusted data feeding real decisions) and an **AI practice** (use cases shipping into production), built on Snowflake, run by the client's own team, guided and accelerated by ours. Operational data flows in (ERP, CRM, core systems via Openflow and Zero-Copy Integrations); decisions, answers, and AI agents flow back out to the apps and workflows where work happens.

**Three pillars, named consistently:**
1. **A practice you keep** (built with your team, handed over documented, extended without us).
2. **Data & AI that reaches production** (governed foundation, then Cortex analytics and agents).
3. **Time-to-value made real** (use-case sprints, proof before scale, 8–16 weeks with the how attached).

Rules:
- **"consulting" / "consultoría": search pages only (revised 2026-07-25).** The words "consultancy", "consulting", "consultant(s)", "consultative" stay out of general copy: on every other page, express the idea through what happens instead ("we work inside your team", "senior people on your hardest decisions", "we build it with you, then hand you the keys", "a partner measured on outcomes, not hours").

  **The exception is search-intent landing pages that target the term directly**, currently `/snowflake-consulting-services` (`messages/*/snowflakeConsulting.json`), plus the labels that link to it: nav, footer, and the `consultingCta` anchors on `/services`, `/migrations`, and `/partnership`. Anchor text matching the destination term is deliberate, not a leak. Buyers literally search "Snowflake consulting services" and "Snowflake implementation services"; a page cannot rank for a term it refuses to use. Keep the term in the H1, title, description, and FAQ headings there, and keep it out of the home page, service pages, and general positioning copy. This supersedes the blanket ban (which itself replaced the pre-2026-07 rule that made "consultancy" the category word) and narrows, but does not cancel, the guidance in `docs/seo-offsite-checklist.md` that directories carry the term.
- **Snowflake is the substrate, not the subject.** Never sell Snowflake itself; headlines belong to the client's practice, and "on Snowflake" is the location, not the pitch. Name products only where they explain HOW a result happens.
- **Time-to-value never stands bare.** When 8–16 weeks appears, attach the mechanism (discovery that fixes scope, use-case sprints, proof before scale, sprint-one shipping).
- **"Data products"** is an approved first-class deliverable noun alongside "governed foundation". (Snowflake remains the platform; we never call the deliverable "the/your platform".)
- **Integration is claimed concretely, both directions.** Name the real mechanisms (Openflow, Zero-Copy Integrations in; Snowsight, Streamlit, APIs, agents out) and real systems (ERP, CRM; SAP, Salesforce, Workday are fine, they are integration endpoints, not the banned BI-competitor list).
- **Never self-label caliber.** "High-caliber", "world-class", "premium" are hype; caliber is demonstrated through the work shown, outcome pricing, the proof band, and enterprise-grade governance.

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

Note: the site's stat bands currently lead with credentials (Premier, SnowPro, 15+, 5 countries) rather than volume metrics. The values below stay canonical; if a volume metric returns to a page, use exactly these figures.

| Metric | Value | Shown on |
|--------|-------|----------|
| Clients served | **50+** | not currently shown (reserved for stat bands) |
| Engagements delivered | **120+** | not currently shown (always labeled "engagements", never "clients") |
| Years | **15** / **15+** | home facts band, nearshore, about (senior experience) |
| Specialists | **25+** | not currently shown |
| Countries (Americas) | **5** | home, nearshore credential bands |
| Time to first value | **8–16 weeks** | home, services, approach, FAQ |
| NPS | **90+** | not currently shown |

**Delivery-level (Services "what engagements deliver")**

| Metric | Value |
|--------|-------|
| Faster time to first insight | **60%** |
| Pipeline reliability | **3×** |
| Lower platform run cost | **40%** |

Per-case-study outcome metrics are **study-specific** and separate from this set ([0015](decisions/0015-outcome-led-case-studies.md)). When real figures are known, update this table, then the few pages that hardcode bands: About `trackRecord`, the Services delivery band, and the home metric band.
