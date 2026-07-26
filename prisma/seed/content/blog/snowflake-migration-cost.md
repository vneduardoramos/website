## Why there is no sticker price

The most common question we get before a migration is also the hardest to answer in one line: "What will it cost to move us to Snowflake?" Anyone who gives you a firm number before understanding your environment is guessing, and usually guessing low.

That does not mean the number is unknowable. A Snowflake migration cost is the sum of a few well-understood drivers, and once you know what moves them, you can estimate a realistic range and, more importantly, act to bring it down. Here is how we think about it.

## The two costs people conflate

First, separate two very different things:

1. **The platform cost.** Snowflake is priced on consumption, storage plus the compute you actually use, not per-seat licenses. This is an ongoing operating cost, and for most teams it lands lower than the legacy infrastructure it replaces once auto-suspend, right-sized warehouses, and resource monitors are in place.
2. **The migration project cost.** The one-time effort to move data, convert code, validate results, and cut the business over. This is the number people usually mean, and it is the one the drivers below control.

Confusing the two leads to sticker shock in both directions. Keep them separate when you budget.

## What actually drives the project number

A Snowflake migration project cost is the sum of six drivers: the source system, the volume and shape of the data, the pipelines and transformations, downstream dependencies, governance and compliance, and organizational readiness.

| Cost driver | Why it moves the number |
| --- | --- |
| Source system | Moving off Teradata, Oracle, or Hadoop is not the same effort as moving off Redshift or SQL Server: proprietary features, stored procedures, and dialect-specific SQL all have to be translated |
| Volume and shape of the data | How many distinct sources, tables, and formats you have matters more than raw terabytes; a hundred well-modeled tables move faster than a thousand tangled ones |
| Pipelines and transformations | Usually the biggest line item: every ETL job, every transformation, and every piece of business logic buried in a legacy tool has to be understood, rebuilt, and validated |
| Downstream dependencies | Dashboards, reports, extracts, and applications that read from the old system all need to be repointed and re-tested; the more consumers, the more validation |
| Governance and compliance | Regulated data (financial, healthcare, PII) adds masking, row-level security, lineage, and audit requirements |
| Organizational readiness | How quickly your team answers questions, approves decisions, and tests results affects the timeline as much as any technical factor |

**The source system.** Moving off [Teradata, Oracle, or Hadoop](/migrations) is not the same effort as moving off Redshift or SQL Server. Proprietary features, stored procedures, and dialect-specific SQL all have to be translated, and some systems have far more of that baggage than others.

**The volume and shape of the data.** Raw terabytes matter less than how many distinct sources, tables, and formats you have, and how clean they are. A hundred well-modeled tables move faster than a thousand tangled ones.

**The pipelines and transformations.** This is usually the biggest line item. Every ETL job, every transformation, every piece of business logic buried in a legacy tool has to be understood, rebuilt, and validated. The count and complexity of your [data pipelines](/services/data-engineering) drive more of the cost than the data itself.

**Downstream dependencies.** Dashboards, reports, extracts, and applications that read from the old system all need to be repointed and re-tested. The more consumers, the more validation.

**Governance and compliance.** Regulated data (financial, healthcare, PII) adds masking, row-level security, lineage, and audit requirements. This is real work, and skipping it is not an option in those industries.

**Organizational readiness.** How quickly your team can answer questions, approve decisions, and test results affects the timeline as much as any technical factor. A responsive stakeholder shortens a migration; an absent one stretches it.

## What brings the number down

The good news is that most of these drivers are movable.

- **Automated code conversion.** A large share of legacy SQL and pipeline logic can be converted with tooling rather than rewritten by hand. This is where a partner's accelerators earn their keep, and where the hours (and cost) drop most.
- **Retire what is dead.** Most legacy warehouses carry pipelines and tables nobody has used in years. A migration is the best chance you will ever have to leave them behind. Do not pay to move data you will never query.
- **Validate parity, do not eyeball it.** Automated row-and-aggregate comparison between old and new catches problems early, when they are cheap, instead of after cutover, when they are expensive and public.
- **Phase the cutover.** A big-bang migration concentrates risk and cost into one terrifying weekend. A phased cutover, workload by workload, spreads the effort, lets the business keep running, and lets you learn on the low-risk pieces first.

## The shape of a sensible migration

We almost always start with a discovery: a short, fixed engagement that inventories the source system, profiles the data, and produces a real scope and estimate instead of a guess. That discovery is where the range narrows from "somewhere between X and 3X" to a number you can actually plan around.

From there, the work runs in phases with validated parity at each step and a handover that leaves your team running the result, not dependent on us to touch it. Time-to-value shows up early because the first workloads reach production in weeks, not at the end of a year-long project.

## The number that matters more than the number

The real cost of a migration is not just the invoice. It is the risk of getting it wrong: a cutover that breaks reporting during quarter close, a rebuild that quietly changes numbers the business trusts, a partner who disappears once the contract ends. A slightly higher project cost that buys validated parity, a phased cutover, and a team that hands over the keys is almost always cheaper than the alternative.

If you want a real estimate for your environment, the honest first step is a discovery, not a quote. Our [migrations page](/migrations) explains how we approach it, and we are happy to walk through what the drivers above look like for your specific stack.
