## Challenge

A commercial-vehicle dealer group runs a large network: dealerships that sell heavy trucks, service bays that keep fleets on the road, and parts operations that supply both. Across that network, the same customer, vehicle, part, supplier, and employee existed differently in every system. The ERP, the dealer management system, and the payroll and HR system each kept their own version, with their own codes and their own rules.

- **No trusted single version.** A customer, vehicle, part, supplier, or employee looked different depending on which system you asked.
- **Reporting meant reconciling by hand.** Before anyone could trust a number, the same entity had to be matched and merged across systems manually.
- **Governance was tribal knowledge.** Matching, survivorship, and ownership lived in people's heads, not in designed-in rules.

Operational efficiency across sales, service, and parts depended on data the group could not yet trust as one.

## Solution: a corporate master data golden record on Snowflake

Viewnear designed and built a corporate Master Data Management (MDM) foundation on Snowflake, in the group's own account, producing a progressive multi-source golden record across the business:

- **Medallion architecture.** Source data lands in Bronze, is cleaned and conformed in Silver, and resolves into governed Gold golden records, with master keys, matching and merge, survivorship rules, lineage, and audit designed in from the first table.
- **Eight business domains.** Aftersales and service, vehicle and parts catalogs, sales, purchasing, inventory, finance, accounting, and HR, each mastered into one trusted definition.
- **Automated ingestion.** Openflow lands data from the ERP, dealer management system, and payroll and HR system on a nightly incremental schedule.
- **Versioned transformations.** All modeling runs in dbt under Git, so every rule that builds a golden record is reviewed, tested, and traceable.
- **Per-domain AI agents.** Snowflake CoWork agents, grounded in each domain's governed golden record, let business users ask questions of master data in plain language.

Delivery runs as three releases across a twelve-month roadmap, so each domain reaches a trusted golden record in sequence rather than all at once.

## Governed by design

Master data is the backbone the whole group reports from, so governance was built in, not bolted on:

- **Catalog and ownership.** Horizon Catalog documents every domain, with a named owner accountable for each golden record.
- **Least-privilege access.** RBAC is structured by environment, layer, and domain, with SSO and SCIM so access maps to the group's own identity.
- **Data quality, designed in.** dbt tests validate matching, survivorship, and conformance on every run, so a bad record is caught before it reaches Gold.
- **Predictable cost.** Resource monitors keep compute and spend in check across environments.
- **Data stays in place.** Everything runs in the group's own Snowflake account, so no copies leave their perimeter.

## What the group gets

- One governed golden record for every core entity: customer, vehicle, part, supplier, and employee, each traceable back to its source.
- Eight business domains mastered on a single Snowflake foundation, from aftersales and parts to finance and HR.
- Reporting that starts from trusted master data, instead of reconciling the same entity by hand across systems.
- A documented, governed foundation the group's own team can run and extend, with master data ready for analytics and AI on top.
