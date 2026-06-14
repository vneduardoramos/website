## Challenge

A corrugated packaging manufacturer makes cardboard boxes, manages cutting dies (suajes) and paper stock, and runs a large, fast-growing catalog of product variants. Over time the catalog exploded: thousands of SKUs and variant combinations created with no standardized product architecture, and no clear rules for how a new SKU comes into being. Every variant added without structure quietly raises the cost of running the floor.

- **Variant explosion with no product architecture.** New SKUs are created ad hoc, with no allowed-variant rules and no standard way to combine attributes, so near-duplicate products multiply unchecked.
- **Decisions on tribal knowledge and Excel.** Critical calls about production, paper, and cutting dies depend on individual expertise and one-off spreadsheet analysis, not on a trusted, shared source.
- **Scattered, unstandardized data and distorted costs.** Information sits across SAP Business One and satellite systems with low standardization, so real cost per SKU is unclear and production planning, paper, and cutting-die management all suffer.
- **No traceability, and an open security gap.** It is hard to trace how SKUs are created and modified or to measure the impact of a catalog change, and sensitive information moves by flat file and email with no access control or audit.

## Solution: a governed SKU and catalog data foundation on Snowflake

Viewnear designed and built a governed Snowflake foundation in the manufacturer's own account, turning a sprawling, ungoverned catalog into golden records and a Standard SKU catalog the business can trust.

- **Medallion warehouse from SAP Business One and satellites.** Openflow ingests SAP Business One and the satellite systems on a batch, incremental schedule, landing raw data in Bronze, conforming it into a Silver enterprise model, and resolving it into governed Gold analytical models.
- **Data dictionary and SKU governance rules.** An enterprise data dictionary fixes the official definition, owner, and mandatory flags per attribute, and a master-data model produces a Golden Record per domain with versioned, owned rules for creating, modifying, and homologating variants, each carrying a severity and an accountable owner under a RACI.
- **Standard SKU catalog and product architecture.** A product base architecture and a Standard SKU catalog define the allowed variants and the rules for combining them, so SKUs are created to a standard instead of by improvisation, with the first wave reengineering three to five critical satellite catalogs onto it.
- **Multidimensional SKU analysis and What-if simulation.** A multidimensional model in Gold gives KPIs by SKU across dimensions and facts, and What-if simulation quantifies SKU-reduction, standardization, and production-configuration decisions against demand, capacity, and business constraints before anyone commits to them.
- **A natural-language catalog agent.** A Snowflake CoWork agent, with Cortex Analyst answering questions over governed Semantic Views on the Gold layer, lets business users query the master and Standard SKU catalogs in plain language, validate SKUs and detect duplicates, see which variants drive complexity, look up the current create, modify, and homologate rules, and evaluate simplification scenarios.
- **Versioned, tested transformations in dbt.** Every transformation that builds the Silver model, the Golden Records, and the Gold analytics runs in dbt under version control and natively against Snowflake, so each rule is reviewed, tested, and traceable.

Delivery is iterative and deliverable-oriented, tackling the highest-impact product domains first with active business-user participation, so the architecture, rules, and catalogs evolve under control rather than all at once.

## Governed by design

The catalog is what production, materials, and costing all depend on, so governance and security were designed in and adopted proportionally as the foundation grew.

- **RBAC with separation of duties.** Access is separated across administration, operation, analytics consumption, and change approval, so the people who run the catalog, use it, and approve changes to it hold distinct roles.
- **Masking and row-access policies for sensitive data.** Column-level masking and row access policies, with tags that classify sensitive attributes, control who can see which records and which fields.
- **Horizon Catalog lineage and auditing.** Horizon Catalog documents the catalog with data lineage and object dependencies, and access and query auditing plus versioning of rules, policies, and structural changes replace the old flat-file and email sharing with governed, traceable access.
- **Resource Monitors for predictable cost.** Resource Monitors keep compute and credit consumption in check, with Snowsight monitoring activity, governed objects, consumption, and compliance.
- **Data stays in the manufacturer's own account.** Everything runs in the manufacturer's own Snowflake account, so sensitive catalog, cost, and materials data never leaves their perimeter.

## What the manufacturer gets

- **A governed source of truth for the catalog.** Golden records per domain and a Standard SKU catalog with enforced variant and combination rules, with versioned rules and accountable owners replacing tribal knowledge and ad-hoc Excel.
- **Plain-language access to the catalog.** A Snowflake CoWork agent over governed Semantic Views lets business users validate SKUs, find duplicates, look up the current rules, and test simplification scenarios without waiting on an analyst.
- **A path to a simpler catalog.** Multidimensional analysis and What-if simulation are designed to quantify each move first, with the goal of significant SKU reduction and roughly halving the time spent on data cleanup and preparation.
- **Decision-ready cost and operations data.** The governed model is built with the goal of clearer real cost per SKU, better paper and cutting-die utilization, less operational waste, and reducing reliance on manual reporting.
- **Governed access that closes the security gap, with full traceability.** Governed, audited access replaces flat-file and email sharing, with full lineage of how catalog data is created, modified, and used.
