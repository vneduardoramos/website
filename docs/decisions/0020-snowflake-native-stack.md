# 0020: Prefer Snowflake-native products; add a Platform page

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07 (product rename: CoWork/CoCo)

## Context

ViewNear is a Snowflake partner, but the site's stated tooling leaned on third-party brands (Matillion, Fivetran for ingestion; Power BI, ThoughtSpot, Sigma for BI). With Snowflake's expanding native stack (Openflow, Horizon Catalog/Context, Cortex, Snowflake Intelligence, Cortex Code, Semantic Views, Iceberg/Polaris, Datastream, etc.), the positioning should **lead with Snowflake-native products** over third-party tools.

**Two explicit constraints from the user:** keep **dbt** (used 100%, the one external framework we run), and do **not** use "Document AI" (it doesn't exist).

## Decision

1. **Replace third-party brands with Snowflake-native equivalents** across all content (`prisma/seed/data.ts`) and components:
   - Ingestion: Matillion / Fivetran → **Openflow** (+ Snowpipe Streaming, Datastream, Zero-Copy Integrations)
   - BI / consumption: Power BI / ThoughtSpot / Sigma → **Snowsight**, **Streamlit in Snowflake**, **Snowflake CoWork (Cortex Analyst)**
   - Catalog/governance: → **Horizon Catalog** (+ Horizon Context)
   - **dbt is kept** (transformation), alongside Snowpark / Dynamic Tables.
   - Touched: service `tools` + Data-Visualization copy, every industry's `tools` + a deliverable title, the retail flavor bullet, a case study's copy, the Methodology stack line, the Services tech strip (now "The Snowflake-native stack we build on"), two job postings' skills, the BI-comparison blog post (rewritten to "Native analytics on Snowflake…", slug changed), and the admin field help text.
2. **New page `/platform`** (`app/(marketing)/platform/page.tsx`), "Built native on Snowflake, not bolted on." A "why native" split + the full native stack grouped into six layers (Ingestion & movement, Transformation & engineering, Open storage & interoperability, Governance/security/context, AI & agents, Consumption & apps), each product tagged with honest **GA / Preview** status. Added to the top-level nav (after Services), the footer (Company group), and cross-linked from the Services tech strip.

## Consequences

- The site consistently positions ViewNear as Snowflake-native; third-party brand names are gone (verified by grep), dbt remains in the right places.
- Preview-stage products are labeled as such, so claims stay honest.
- Product names track Snowflake's rebrands, **Snowflake CoWork** (formerly Snowflake Intelligence) and **Snowflake CoCo** (formerly Cortex Code). On future renames/promotions, update `LAYERS` in `platform/page.tsx`, `Methodology.tsx`, and the `prisma/seed/data.ts` copy.

## Alternatives considered

- **Keep third-party as secondary "we also integrate with…"**, rejected: the directive was to prefer native; we lead with native and only keep dbt.
- **Replace dbt too**, rejected per explicit instruction ("we use dbt 100%").
- **Feature every announced product**, rejected: led with GA, included key Previews with status tags; omitted niche items.
