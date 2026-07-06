## Challenge

A construction and real-estate developer buys land, runs construction programs, and delivers building projects. Its design information and its business data lived in different worlds: drawings in one place, numbers in another, and no way to read them together. Measuring a program, checking a project, or evaluating a land purchase meant stitching figures across systems and pulling quantities off drawings by hand.

- **Four disconnected sources.** Construction program and scheduling data, project cost and finance data, land and acquisition records, and architectural CAD drawings each lived on their own, with no shared definitions and no common model to join them.
- **CAD drawings trapped in files no report could read.** The quantities, areas, and materials that define every building sat inside design and engineering drawings, locked in files that no report or query could reach, so design never showed up next to the business numbers.
- **Programs, projects, and land decisions stitched together by hand.** Every roll-up across construction programs, individual projects, and land acquisition was assembled manually, so the picture was always late and never quite reconciled.
- **No single trusted source.** With four sources and no governed model joining them, leadership had no one place they could trust to measure and run the business.

## Solution: one governed source of truth on Snowflake, with design data made measurable

Viewnear unified the four sources into a governed Snowflake foundation in the developer's own account, and turned the CAD drawings from inert files into structured, governed data that sits alongside the business.

- **Four sources into a governed Medallion foundation.** Openflow ingested the construction program, cost and finance, and land and acquisition data into Snowflake, landing raw data in Bronze, conforming it in Silver, and resolving governed Gold models, so the business systems finally shared one model.
- **CAD drawings read into structured, governed data.** We extracted the design data locked in the architectural and engineering drawings into governed, queryable tables, so design finally became measurable alongside the business numbers.
- **One trusted model for programs, projects, and land-buying.** Construction programs, individual projects, and land acquisition decisions all measured against the same governed Gold models, so the developer could run the business from one source instead of reconciling numbers by hand.
- **Snowflake CoWork agents for questions and actions in Snowflake.** We delivered Snowflake CoWork agents over governed Semantic Views, with Cortex Analyst answering questions in plain language, so teams could ask and act on the governed data directly inside Snowflake.
- **Slack bots in the flow of work.** We delivered Slack bots on top of the same governed data, so teams got answers and acted without leaving the tools they already work in.
- **Versioned, tested transformations in dbt.** Every transformation that built Silver, the governed Gold models, and the structured CAD data ran in dbt under version control and natively against Snowflake, so each rule was reviewed, tested, and traceable.

## Governed by design

The governed foundation became what programs, projects, and land decisions all depend on, so governance was designed in from the start.

- **Horizon Catalog for catalog, lineage, and ownership.** Horizon Catalog documented the data with lineage and object dependencies, so the developer can see where every figure, including the values read out of the drawings, comes from and who owns it.
- **RBAC with least privilege.** Access was separated across administration, operation, and analytics consumption, so the people who run the foundation, use it, and govern it hold distinct roles.
- **Data quality enforced with dbt tests.** dbt tests validated the models on every run, so the governed source stayed trustworthy as new data and use cases arrived.
- **Resource Monitors for predictable cost.** Resource Monitors kept compute and credit consumption in check, with Snowsight monitoring activity and consumption.
- **Data stays in the developer's own Snowflake account.** Everything ran in the developer's own account, so sensitive cost, land, and design data never left their perimeter.

## What we delivered

- **One governed source for programs, projects, and land.** Construction programs, individual projects, and land-buying decisions now measure against a single governed source of truth instead of hand-stitched spreadsheets.
- **CAD made measurable.** The design data read out of the drawings now lives as governed data the business can query alongside construction, finance, and land records.
- **AI agents in Snowflake and Slack.** Snowflake CoWork agents over governed Semantic Views, plus Slack bots, let teams ask questions and act on the governed data both inside Snowflake and in the flow of work.
- **A documented foundation the team runs and extends.** A governed, cataloged, and tested Snowflake foundation, with dbt transformations under version control, that the developer's team operates and extends to new use cases.
