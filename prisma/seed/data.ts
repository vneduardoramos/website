/**
 * Viewnear seed content: rebranded from the scraped DataLab site.
 * Transforms applied: Datalab -> Viewnear, South Africa/EMEA -> the Americas,
 * client/team/testimonial names are anonymized.
 * Regions used: Canada, USA, Mexico, LATAM, Caribbean.
 */

export const siteSettings: Record<string, unknown> = {
  hero: {
    // headline mirrors the hero H1 rendered in MeshHeroSlide (kept in sync for reference).
    headline: "From data strategy to AI in production, on Snowflake.",
    subhead:
      "Choosing Snowflake is the easy part. The harder part is what an organization stands up on it: a data practice that feeds real decisions with numbers people trust, and an AI practice that ships use cases into production. We build both inside the team, then hand over the keys.",
  },
  stats: [
    { label: "Snowflake partner tier", value: "Premier" },
    { label: "Years building data & enterprise AI", value: "15+" },
    { label: "Certified engineers across the team", value: "SnowPro" },
    { label: "Countries across the Americas", value: "5" },
  ],
  partnership: {
    title: "The Snowflake Premier Partner across the Americas.",
    points: [
      {
        title: "Snowflake Premier Partner",
        body: "Premier status puts SnowPro-certified engineers on the work, backed by a verified, end-to-end delivery track record across the Americas: from architecture and migration through analytics and AI in production.",
      },
      {
        title: "Snowflake CoCo Preferred Partner",
        body: "As a Snowflake CoCo Preferred Partner, we build with Snowflake CoCo, the coding agent, so data products and AI use cases ship faster: governed and validated before they reach production.",
      },
      {
        title: "Snowflake procurement, simplified",
        body: "Procure Snowflake directly through Viewnear. It's consumption-based (the business pays for the compute and storage it uses) and we simplify the capacity commitment, commercial terms, and account management under one trusted partner.",
      },
      {
        title: "End-to-end delivery",
        body: "From architecture and migration to data engineering, analytics, and AI in production, one accountable team carries the work end to end, and in-house teams learn it as we build.",
      },
      {
        title: "The Americas' home team",
        body: "Local expertise across Canada, the USA, Mexico, LATAM, and the Caribbean. We understand the regional data landscape and we're here for the long term, not just the first deployment.",
      },
    ],
  },
  contact: {
    email: "contact@viewnear.com",
    blurb:
      "Viewnear answers a first message with a short intro call, then a scoped proposal: the first use cases, a sprint-by-sprint plan, and a price, whether that means modernizing on Snowflake or starting from scratch.",
  },
};

export const services = [
  {
    slug: "ai-data-strategy",
    tier: "THINK",
    title: "Data & AI Strategy",
    summary:
      "Turn AI ambition into a board-ready roadmap: where data and AI create measurable ROI, sequenced by value and grounded in what the data can actually support, on a clear path to the agentic enterprise.",
    seoTitle: "Data & AI Strategy Services: Roadmap on Snowflake",
    seoDescription:
      "Data and AI strategy services: an AI readiness assessment and a roadmap sequenced by ROI, from a Snowflake Premier Partner. Start with a discovery.",
    tools: [],
    order: 1,
    // Body convention: paragraph 1 is the standalone card pitch (no headings or
    // links); the full markdown renders on the service detail page.
    body: `Invest with confidence and know exactly what to build next. Our data and AI strategy services turn "we need an AI strategy" into a costed, sequenced roadmap: we work with CEOs and CTOs to ground every use case in what the data can actually support today, and to prioritize the ones with the clearest measurable return.

## What our data and AI strategy services deliver

Strategy here is not a slide deck. Every data and AI strategy engagement produces decisions you can fund and a plan your team can execute:

- **An AI readiness assessment.** An honest read of data quality, governance, and architecture against the use cases you want to ship, so investment lands where the gaps actually are.
- **A board-ready AI roadmap for the enterprise.** Use cases sequenced by ROI and data readiness, each one costed, owned, and tied to a business metric rather than a technology wish list.
- **A data strategy anchored in a governed foundation.** The target state on Snowflake that the roadmap depends on: governed, trusted data feeding real decisions, with Horizon Catalog and Semantic Views giving every team and every agent one business context. We design it hand in hand with our [cloud architecture and data foundation](/services/cloud-architecture) work.
- **A clear path to the agentic enterprise.** Where Cortex Analyst, Cortex Agents, and Snowflake CoWork earn a place on the roadmap, and where they do not yet. As an Anthropic partner we default to Claude for agentic work; see how [agentic AI runs inside and outside Snowflake](/data-ai).
- **An operating model your team keeps.** Roles, governance, and a capability plan so both practices, data and AI, run on your payroll and keep improving after we step back.

## How a strategy engagement runs

We price on outcomes, not hours, and we compress the distance between strategy and production. A short discovery fixes scope and surfaces the real state of your data. Use-case sprints then ship working increments, and proof comes before scale: the decision to invest further is made on evidence, not a deck. That mechanism is why first value lands in 8 to 16 weeks instead of at the end of a programme.

The advice stays concrete because the same team delivers on it: SnowPro-certified engineers, a Snowflake Premier Partner and Snowflake CoCo Preferred Partner, with leadership carrying 15+ years of data experience. The roadmap also stays honest about sequencing. If a legacy warehouse stands between you and the first use case, [migration to Snowflake](/migrations) is planned into the sequence, not discovered later. You can see how that sequencing plays out across industries in our [case studies](/case-studies).

## Strategy built in live working sessions, in your time zone

An AI roadmap is shaped in the room, in workshops where your executives argue priorities and trade-offs with ours. That collaboration does not survive an overnight async gap, which is why our senior strategists work nearshore from Monterrey and Austin, in US time zones, serving clients across the Americas. Strategy workshops, working sessions, and steering meetings happen live, the same day the question comes up.

The result is a roadmap your leadership pressure-tests in the same meeting it is drafted, not a deliverable that arrives by email for comments. [See how the nearshore model works](/nearshore).

## Frequently asked questions

### How do I know if my company is ready for AI?

Readiness is measurable, not a feeling. We assess data quality, governance, architecture, and team skills against the specific use cases you want to ship, and score each gap by the effort to close it. Most organizations turn out readier than they feared in some areas and less ready than they assumed in others, which is exactly what the roadmap needs to reflect.

### What should an AI roadmap include?

Four things at minimum: use cases prioritized by business value and feasibility, the data foundations each one depends on, costs and owners per initiative, and the operating model that keeps it running. A roadmap missing any of these is a vision statement, not a plan.

### How long does a data and AI strategy engagement take?

The readiness assessment and roadmap take shape during discovery in the opening weeks, and the first use-case sprint ships a working increment against real data soon after, so first value lands in 8–16 weeks with proof before scale. Strategy and delivery are not separate phases; the roadmap earns trust by shipping against it.`,
  },
  {
    slug: "cloud-architecture",
    tier: "BUILD",
    title: "Cloud Architecture & Data Foundation",
    summary:
      "The AI-ready foundation: governed, built on Snowflake, and ready to scale, the single source of truth every model and agent depends on.",
    seoTitle: "Snowflake Data Foundation & Cloud Architecture",
    seoDescription:
      "Governed, AI-ready Snowflake data foundation and cloud architecture from a Snowflake Premier Partner, built with your team in US time zones.",
    tools: ["Snowflake", "Openflow", "Iceberg"],
    order: 3,
    body: `Every team gets one fast, scalable foundation to build on. We design and deliver a governed Snowflake data foundation, with cloud architecture sized for the AI workloads on the horizon, not just the reporting teams run today, and security and governance built in from the first table: the single source of truth every model, dashboard, and agent depends on.

## What a governed Snowflake data foundation includes

Architecture is where cost, security, and trust get decided, usually years before anyone feels the consequences. We design with the decisions documented and build with your team, so the people who will run the foundation understand every layer. A typical build covers:

- Cloud architecture design: account and environment topology, role-based access, and warehouses organized so Snowflake's consumption-based model stays predictable as workloads grow.
- Ingestion built on Openflow, Snowpipe Streaming, and Zero-Copy Integrations, bringing ERP, CRM, and SaaS sources into one governed source of truth.
- A tested transformation layer with dbt and Dynamic Tables, so every metric is versioned, reviewed, and reproducible.
- Lakehouse architecture with Apache Iceberg and Open Catalog (Polaris) where open table formats are the right call, keeping storage open without giving up governance.
- Governance from the first table: Horizon Catalog for lineage and access policy, and Semantic Views so business definitions live with the data, ready for Cortex when the AI use cases arrive.
- A Snowflake architecture review for environments already running: we audit design, security, and spend, then leave a prioritized fix list your team can execute.

That discipline is what makes the first production use case land in 8 to 16 weeks rather than at the end of a programme, and what keeps each later use case cheaper than the one before it.

## How a foundation build runs

Choosing a Snowflake implementation partner is choosing the architecture you will live with for years, so we make the first step small and evidence-based. A short discovery fixes scope: sources, workloads, security requirements, and the first use cases the foundation must serve. Delivery then runs in use-case sprints, proving each slice in production before scaling it, which is how first value lands in 8–16 weeks instead of at the end of a long build, with pricing tied to outcomes rather than hours.

The Snowflake data foundation is never the finish line. It feeds the [governed data pipelines](/services/data-engineering) that keep it current and the [AI practice](/data-ai) that puts Cortex analytics and agents to work on top of it. And when a legacy warehouse is in the way, [migration to Snowflake](/migrations) is usually the first sprint, not a separate project.

## Nearshore architecture depth, on your hours

Foundation work fails quietly when the architects and your platform and security teams are half a world apart: a design decision that waits overnight turns into days of rework. Our delivery hub in Monterrey, Mexico works US business hours, with leadership in Austin, Texas, serving clients across the Americas, so architecture reviews, security sign-offs, and scope decisions happen the same day they come up.

Nearshore does not mean the work disappears into a delivery queue. We [work inside your team](/nearshore): SnowPro-certified engineers pair daily with your infrastructure and security people, senior judgment lands on the hardest architecture decisions, and your team keeps control of scope and priorities. That is architecture depth at nearshore economics, from a [Snowflake Premier Partner and Snowflake CoCo Preferred Partner](/partnership).

## Frequently asked questions

### How long does a Snowflake implementation take?

For a governed Snowflake data foundation, we put first value in production in 8–16 weeks. The mechanism matters more than the number: a discovery fixes scope up front, delivery runs in use-case sprints, and each slice proves out before it scales. A full estate takes longer, but no one waits until the end to see working data products.

### What is a Snowflake architecture review?

A structured audit of an existing Snowflake environment: account topology, security and access design, cost drivers, and pipeline reliability, measured against how Snowflake is built to run. You get a prioritized findings list with the reasoning documented, so your team can act on it with us or on its own.

### Should we build a Snowflake lakehouse with Apache Iceberg?

Iceberg makes sense when other engines need to read the same tables, when data volumes push toward open storage economics, or when open formats are organizational policy. Open Catalog (Polaris) keeps those tables governed either way. When workloads live end to end in Snowflake, native tables are often simpler; discovery is where we decide with evidence rather than defaults.

### How is data governance enforced, not just documented?

Data governance on Snowflake is enforced as configuration on the data itself, not as a policy document. Role-based access is modeled to the organization so people see only the data they need, enforced in Snowflake rather than bolted on afterward, and sensitive data is classified and masked with tagging plus row and column policies from the first table built. Horizon Catalog carries lineage and access history, so every figure is traceable to its source and every access is logged for audit. All of it runs in the client's own Snowflake account, so no copies leave that perimeter.

### How is a golden record built across multiple source systems?

A golden record is built in layers inside the client's own Snowflake account. Source data lands in Bronze, is cleaned and conformed in Silver, and resolves into governed Gold records, with master keys, matching and merge, survivorship rules, lineage, and audit designed in from the first table. All the modeling runs in dbt under Git, so every rule that decides which value survives is reviewed, tested, and traceable. For a commercial-vehicle dealer group, Openflow lands the ERP, dealer management system, and payroll and HR system on a nightly incremental schedule, producing one governed version of customer, vehicle, part, supplier, and employee, each traceable back to its source.

### Do all master data domains have to be mastered at once?

Master data domains are mastered in sequence, so each one reaches a trusted golden record in turn rather than all at once. In the master data build for a commercial-vehicle dealer group, eight business domains, from aftersales and parts catalogs to finance and HR, are delivered as three releases across a twelve-month roadmap. dbt tests validate matching, survivorship, and conformance on every run, so a bad record is caught before it reaches Gold and each domain stays trustworthy after the release that created it.`,
  },
  {
    slug: "data-engineering",
    tier: "BUILD",
    title: "Data Engineering & Pipelines",
    summary:
      "Always-current, trusted data: governed pipelines that unify every source (ERP, CRM, SaaS, and files) so analytics and AI run on inputs worth staking decisions on.",
    seoTitle: "Snowflake Data Engineering Services, Nearshore",
    seoDescription:
      "Snowflake data engineering services: governed ELT pipelines with dbt, built nearshore in US time zones. Snowflake Premier Partner. Get a scoped plan.",
    tools: ["Snowflake", "Openflow", "dbt"],
    order: 4,
    body: `No more chasing numbers across systems. Our Snowflake data engineering services deliver automated, governed pipelines that pull every source (ERP, CRM, SaaS, APIs, databases, flat files) into Snowflake reliably and on schedule, so teams work from data they can trust and AI workloads run on clean, current inputs. Built by a nearshore team in US time zones, priced on outcomes, not hours.

## What our Snowflake data engineering services deliver

Every pipeline we build exists to feed a decision, a report, or an AI use case someone is waiting on. The typical scope includes:

- **ELT pipeline development.** Ingestion with Openflow, Snowpipe Streaming for real-time feeds, and Zero-Copy Integrations where a SaaS source never needed a pipeline in the first place. Batch and streaming, one governed pattern.
- **dbt transformation layers.** Business logic modeled in dbt: tested, versioned, documented, and reviewed like the production code it is, with Dynamic Tables handling incremental processing where it saves compute.
- **ETL modernization.** Legacy jobs, stored procedures, and brittle scripts rebuilt as maintainable ELT, often as part of a broader [migration to Snowflake](/migrations).
- **Governance and data quality built in.** Access policies and lineage in Horizon Catalog, quality tests that run inside the pipeline, and alerting that catches failures before the business does.
- **Open formats where they earn their place.** Apache Iceberg tables and Open Catalog (Polaris) when interoperability across engines matters to your architecture.

Reliability and run cost are deliverables too, not side effects. Pipelines ship with tests, alerting and lineage from the first table, and warehouse sizing and scheduling are tuned as part of the build rather than after the first invoice.

## How a pipeline build runs

We start with a discovery that fixes scope: which sources, which data products, which decisions they feed. The work then runs as use-case sprints, each shipping a working pipeline into your environment, with proof before anything scales. First value lands in 8–16 weeks because that structure removes the usual drift, not because anyone is rushing.

The pipelines land on a [governed data foundation](/services/cloud-architecture) and feed everything downstream, from Snowsight reporting to the [AI analytics layer](/services/data-visualisation) built on Cortex. And because pricing is on outcomes rather than hours, there is no incentive to stretch the build.

## Data engineering outsourcing, without the handoff

Teams that look into data engineering outsourcing usually want the same thing: reliable pipeline capacity without a months-long hiring cycle. What they fear is the classic version of it: requirements handed off into silence, code coming back weeks later, every question waiting overnight for another continent.

Our nearshore data engineering model is built to be the opposite. SnowPro-certified engineers work from Monterrey, Mexico and Austin, Texas, in US time zones, serving organizations across the Americas with the depth of Latin America's data engineering talent. They work inside your repos, your CI, and your standards; sprint reviews happen inside your working day; and your engineers build alongside ours from the first sprint, because the goal is a data practice your team keeps, not a dependency on ours. That difference shows in [how our nearshore delivery works](/nearshore) and in the [case studies](/case-studies) behind it.

## Frequently asked questions

### Should we use ETL or ELT with Snowflake?

ELT. Land raw data in Snowflake first, then transform it in-warehouse with dbt and Dynamic Tables. You keep full lineage from raw data to reporting, reprocessing becomes a rerun instead of a re-extract, and transformations scale on Snowflake compute instead of a separate ETL server.

### Is it safe to outsource data engineering?

It is when the work never leaves your environment. Our engineers build inside your Snowflake account and your repositories, under access you grant and can revoke, with lineage and policies governed in Horizon Catalog. Everything inherits Snowflake's independently audited controls, and nothing about the model requires data to be copied out.

### How fast does a nearshore data engineering team deliver value?

The first advantage is onboarding: the team already works your hours, so no ramp-up is lost to time zones and the hiring lead time disappears. From there the sprint mechanism takes over: a discovery fixes scope up front, use-case sprints ship working pipelines from the first weeks, and proof comes before scale, so first value lands in 8–16 weeks.`,
  },
  {
    slug: "data-visualisation",
    tier: "BUILD",
    title: "AI Analytics & Agents",
    summary:
      "Put governed AI to work: Cortex Analyst and Snowflake CoWork agents that turn governed data into cited, decision-ready answers, embedded where leaders already work.",
    seoTitle: "AI Analytics & Agents on Snowflake: Cortex",
    seoDescription:
      "Self-service analytics on Snowflake: Cortex Analyst, Snowsight dashboards, and AI agents that reach production, from a SnowPro-certified nearshore team.",
    tools: ["Cortex Analyst", "Snowflake CoWork", "Snowsight", "Streamlit"],
    order: 2,
    body: `Put answers in the hands of the people making decisions. We build self-service analytics and AI agents on Snowflake: Snowsight dashboards and Streamlit apps for the views teams live in, Cortex Analyst answering plain-language questions over governed Semantic Views, and Snowflake CoWork letting business users explore and act. This is the business intelligence layer rebuilt so a question returns an answer instead of a ticket: no waiting on the data team, no exporting to spreadsheets.

## What we deliver: self-service analytics on Snowflake

Every engagement builds the layer where the business actually meets its data, natively on Snowflake so governance travels with every answer:

- **Cortex Analyst implementation.** Semantic Views that encode your metrics, joins, and business terms, so natural language questions return accurate, cited answers instead of guesses.
- **AI agents on Snowflake.** Cortex Agents that plan across structured data and documents, with Cortex Search handling retrieval. They run on Claude, the model at the center of our Anthropic partnership.
- **Snowflake CoWork for business users.** The personal AI agent, configured over your governed data so anyone can explore, ask follow-ups, and act in plain language.
- **Snowsight dashboards and Streamlit in Snowflake apps.** The data visualization layer teams open every morning: curated views and interactive data apps, with nothing copied outside the governed perimeter.
- **Answers where work happens.** Insight delivered into the workflows leaders already use; when analytics becomes part of your product, our [embedded analytics service](/services/embedded-analytics) carries it into customer-facing apps.

## How an analytics rollout runs

Self-service analytics is only as good as the data underneath it. When pipelines need hardening first, our [data engineering team](/services/data-engineering) gets the inputs decision-grade; from there the work moves into the analytics and agent layer.

First value lands in 8–16 weeks, and the mechanism is what makes that number honest: a discovery fixes scope, use-case sprints ship one governed answer set at a time, and scaling decisions rest on proof, not a slide. Many AI-agent projects on Snowflake stall between demo and production; the sprint model exists to close exactly that gap, with pricing tied to outcomes rather than hours.

Agents inside Snowflake are half the story. How they connect with agents working outside it, over one governed context, is laid out in our [data & AI approach](/data-ai).

## A nearshore team in your review sessions

Analytics and agent tuning is feedback-heavy work. A semantic model gets good the way a forecast does: someone asks a question, the answer comes back slightly off, an analyst explains why, and the definition is corrected. That loop breaks when the delivery team wakes up as yours logs off.

Our engineers work from Monterrey and Austin, on your hours. Nearshore AI development from Latin America usually means an outsourcing handoff; this model is the opposite. SnowPro-certified engineers sit in the same review sessions as your analysts, hear objections firsthand, and turn them into sharper Semantic Views and better-behaved agents in days, not release cycles. The full delivery model is on our [nearshore page](/nearshore).

And the practice is built to stay yours: your team learns the semantic model and the agent configurations as we build, so the dashboards and agents keep improving after handover. See how that plays out in our [case studies](/case-studies).

## Questions teams ask before rolling out AI analytics

### How accurate is Cortex Analyst?

As accurate as its semantic model. Cortex Analyst answers only through the Semantic Views it is given, shows the query behind every answer, and asks for clarification rather than guessing when a question falls outside them. Most of our implementation effort goes exactly there: verified queries, business-term coverage, and review cycles with your analysts until the answers hold up.

### Do I need a semantic model for Cortex Analyst?

Yes. Text-to-SQL over raw schemas has to guess what "revenue" or "active customer" means, and guessing is what erodes trust. Semantic Views encode those definitions once, and Cortex Analyst, Cortex Agents, and Snowflake CoWork all answer through them. We build the first version during discovery and refine it with your team every sprint.

### What is the difference between Cortex Analyst and Snowflake CoWork?

Cortex Analyst is the service that turns a natural language question into governed SQL, built to be embedded in apps and workflows. Snowflake CoWork is the agent experience business users open directly to explore data and act on it. Most engagements deliver both: CoWork for people, Cortex Analyst wherever answers need to surface inside a product or process.

### Can Power BI and Tableau keep running after a move to Snowflake?

Power BI and Tableau keep running after a move to Snowflake, with Snowflake as the governed source they query. Security is implemented once in Snowflake, with row-level policies and secure views, so every BI tool inherits the same governance instead of enforcing its own, and data access stays auditable across all of them. New analytics work is built Snowflake-native: Snowsight dashboards, Streamlit in Snowflake apps, and Cortex Analyst answering plain-language questions over governed Semantic Views that encode metrics, joins, and business terms once.

### What is the right way to connect Power BI or Tableau to Snowflake?

Power BI and Tableau should connect to Snowflake through the native Snowflake connector rather than a generic ODBC driver, so calculations push down to Snowflake instead of pulling data out to be processed elsewhere. Four patterns keep that connection fast and predictable: a service account with key pair authentication rather than individual user credentials, a dedicated warehouse per tool for predictable performance and clear cost attribution, aggressive auto-suspend with multi-cluster auto-scaling to absorb concurrent users without inflating cost, and live connections for large, changing data with extracts for smaller, stable data.`,
  },
  {
    slug: "embedded-analytics",
    tier: "BUILD",
    title: "Embedded Analytics",
    summary:
      "Differentiate the product: Cortex-powered data products embedded into apps and client workflows, turning insight into a competitive edge.",
    seoTitle: "Embedded Analytics on Snowflake for SaaS Products",
    seoDescription:
      "Embedded analytics on Snowflake: customer-facing dashboards, Streamlit apps, and Cortex answers built into your product by a nearshore product squad.",
    tools: ["Streamlit", "Cortex"],
    order: 5,
    body: `Make analytics a feature customers pay for. We build embedded analytics on Snowflake: dashboards, reporting, and Cortex-powered answers delivered inside your applications, client portals, and partner interfaces, so insight lives where users already work and the product stands apart from competitors. The result is a set of customer-facing data products backed by a governed foundation your team keeps.

## What we build into your product

Customer-facing analytics is data application development, not an internal reporting exercise. Everything we build is designed to live inside your product, carry your brand, and scale with your customer base:

- **Embedded dashboards and reports**, served straight from the governed data already in Snowflake, with no second copy of every table to sync, secure, and pay for.
- **Multi-tenant analytics architecture** designed for SaaS: tenant isolation, row-level security, and per-tenant cost visibility on Snowflake's consumption model, so the feature scales without billing surprises.
- **Streamlit in Snowflake data apps**: interactive applications that run where the data lives and inherit Snowflake's security and governance instead of re-implementing them.
- **Cortex-powered answers inside the product**: Cortex Analyst over governed Semantic Views for natural language questions, and Cortex Search for retrieval, so customers ask and act without leaving your app.
- **APIs and data services** where the front end is your own: governed data served to your components, so a bespoke interface does not mean a bespoke pipeline behind it.
- **Governance built in from the first tenant**: access, lineage, and policy managed through Horizon Catalog, with serving layers kept fresh by Dynamic Tables.

For the analytics your own teams use day to day, see [AI Analytics & Agents](/services/data-visualisation); this page is about the analytics your customers see.

## From roadmap item to revenue feature

An analytics feature earns its place the way any feature does: it ships, customers use it, and sales can point at it. Our engagement model is built for that bar. A discovery fixes scope against your product roadmap, use-case sprints put working screens in front of design partners early, and proof runs before scale, so the first slice of embedded analytics reaches real users in 8–16 weeks. Pricing is on outcomes, not hours, so finishing sooner benefits both sides.

Under the feature sits the plumbing that decides whether it survives contact with customers. Where the pipelines feeding it need hardening, our [data engineering and pipelines](/services/data-engineering) work comes first, so the feature inherits pipelines that hold up as tenants grow. Outcomes like these are documented in our [case studies](/case-studies). And when customers start asking questions instead of reading charts, the same governed foundation powers [AI agents in production](/data-ai).

## A product squad alongside yours, in your time zone

Embedded analytics is never a hand-off project. It lives on your product roadmap and moves at your release cadence. Teams looking to add nearshore analytics capacity from Latin America usually discover they need something different from classic outsourcing: a squad that works inside their process, not at the end of a ticket queue.

That is how we staff it. A Viewnear product squad delivers from our Monterrey hub on US time zones, with leadership in Austin: your standups, your sprint reviews, your release trains. Product managers and designers get same-day answers instead of overnight handoffs, and the SnowPro-certified engineers building the feature are in the room when priorities shift. As a Snowflake Premier Partner and Snowflake CoCo Preferred Partner, we bring Snowflake and enterprise depth at every level, guided by leadership with 15+ years in data and serving clients across the Americas. The full model is on our [nearshore delivery](/nearshore) page.

## Embedded analytics on Snowflake: common questions

### How do I add analytics to my SaaS product?

Start where the data already lives. If your product data lands in Snowflake, embedding analytics from that governed source avoids standing up a separate BI stack and maintaining a second copy of every table. The build order that works: model the data for multi-tenant access, pick the serving pattern (embedded dashboards, Streamlit in Snowflake apps, or APIs into your own front end), and ship one high-value view to design partners before rolling it out to every customer.

### Is Streamlit in Snowflake good for production data apps?

Yes, when it is matched to the job. Streamlit in Snowflake inherits the account's security, governance, and access controls, which removes most of the operational overhead of running a separate app stack, and it excels at interactive data products. For deeply custom in-app experiences, we serve governed data through APIs into your own components instead. That architecture call gets made in discovery, per use case, before any build starts.

### Can we outsource embedded analytics development to Latin America?

You can, and time zones decide whether it works. Analytics inside a product needs daily contact with your product and design teams, exactly where offshore handoffs strain. A nearshore squad in Mexico works US business hours, joins your sprints directly, and is measured on shipped outcomes rather than hours logged. Ours serves clients across the Americas.`,
  },
  {
    slug: "capability-development",
    tier: "GROW",
    title: "Capability Development",
    summary:
      "Compound the advantage: we embed with the team and build the in-house fluency to scale AI use cases long after launch.",
    seoTitle: "Snowflake Enablement Services: Nearshore Coaching",
    seoDescription:
      "Snowflake enablement services from a Snowflake Premier Partner: SnowPro-certified coaches embed with your team through real delivery, in your time zone.",
    tools: [],
    order: 6,
    body: `Capability that outlasts the engagement. Our SnowPro-certified practitioners embed alongside your in-house team and coach through real delivery: Snowflake enablement that builds fluency at every level, from executive data literacy to hands-on work for analysts and engineers, so the team keeps improving long after we step back.

## What our Snowflake enablement services deliver

Courses teach syntax. Capability comes from shipping. Our enablement work happens inside live delivery, on your data and your backlog, and it leaves behind:

- **Role-based enablement paths.** Executives learn to read, question, and act on governed numbers; analysts get fluent in Snowsight, Semantic Views, and Cortex Analyst; engineers go deep on dbt, Snowpark, and Dynamic Tables.
- **A data team upskilling program with a visible bar.** Skills map to SnowPro certification, so progress is measurable and portable, not a certificate of attendance.
- **AI enablement for the whole data team.** Your people learn to build, evaluate, and operate Cortex Analyst, Cortex Search, and Cortex Agents over governed data, [the AI practice we help you stand up](/data-ai), with Snowflake CoCo accelerating the build. As an Anthropic partner we default to Claude, and we teach your team to hold any model to the same evaluation bar.
- **Standards that stay.** Coding standards, review rituals, runbooks, and documentation written into every sprint, so the practice survives turnover.

## How enablement runs

Enablement is not a training track that runs beside the project; it is how we deliver. A discovery fixes scope and picks the first use cases. Then use-case sprints ship working data products with your people pairing on the build, which is how first value lands in 8–16 weeks and proof arrives before scale. Along the way, your engineers absorb the patterns behind that pace: how scope gets fixed, how a use case is sliced, and how a pipeline is made observable before it ships.

We price on outcomes, not hours, so there is no incentive to keep knowledge on our side of the table. Teams often start here after a [data engineering](/services/data-engineering) build or a warehouse migration, when the foundation is live and the question becomes who runs it. The [case studies](/case-studies) show what teams kept after we stepped back.

## Coaching in your working hours, in English and Spanish

Enablement only sticks when the coach is in the room while the real work happens. That is the case for nearshore: our team coaches from Monterrey and Austin, in US time zones, so every pairing session, design review, and office hour lands inside your business day, whether your team sits in the US, Mexico, or anywhere across the Americas.

The offshore alternative usually means choosing between recorded courses and an overnight handoff. [Nearshore delivery](/nearshore) removes that trade: same-day answers, live working sessions, and coaching in English or Spanish, whichever language your team thinks in.

## Questions teams ask about Snowflake enablement

### How is Snowflake enablement different from Snowflake training?

Training transfers information; enablement transfers capability. Snowflake's own courses and SnowPro certification prep are excellent for syntax and concepts, and we build on them. Enablement adds what a course cannot: a certified engineer beside your team on a real backlog, standards and runbooks that outlast the engagement, and verifiable proof (SnowPro certifications, use cases in production) that the capability exists.

### How do I build a Snowflake team?

Start from use cases, not job descriptions. A discovery fixes the first use cases and reveals the roles they actually require; then hire a small core and grow it through delivery, with certified engineers embedded alongside while your people come up to speed. The team forms while value ships, instead of spending those months recruiting first.

### Snowflake enablement vs staff augmentation: what is the difference?

Staff augmentation rents capacity and takes it away when the contract ends; classic outsourcing moves the work, and the learning, outside your walls. Enablement is the opposite bet: we work inside your team, price on outcomes, and measure success by how little you need us next quarter. Our [Snowflake Premier Partner practice](/partnership) is built around that handover.`,
  },
];

export const industries = [
  {
    slug: "construction-real-estate",
    name: "Construction & Real Estate",
    headline: "Construction and real estate generate data on every project. Most of it never reaches a decision.",
    seoTitle: "Snowflake for Construction & Real Estate",
    seoDescription: "Construction and real estate data on Snowflake: project, design, and property data unified into measurable decisions.",
    intro:
      "From job-site progress to portfolio performance, we unify project, cost, and asset data into one governed source so developers, contractors, and owners can see schedule, budget, and yield in near real time.",
    challenges: [
      { problem: "Project data trapped in spreadsheets", response: "We consolidate scheduling, cost, and progress data into one governed, trusted source." },
      { problem: "No portfolio-level visibility", response: "We deliver portfolio and asset analytics across every property and project." },
      { problem: "Cost and schedule overruns spotted too late", response: "We surface budget-vs-actual and schedule risk while there is still time to act." },
    ],
    deliverables: [
      { title: "Project cost & schedule analytics", description: "Budget-vs-actual, earned value, and schedule risk in one view." },
      { title: "Portfolio & asset dashboards", description: "Occupancy, yield, and performance across the whole portfolio." },
      { title: "Unified project data foundation", description: "A governed source consolidating ERP, project, and field systems." },
      { title: "Forecasting & valuation models", description: "Data-driven inputs for valuation, capital planning, and bids." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "6+" }],
    faq: [
      { q: "How can a contractor see budget-vs-actual and schedule risk in time to act?", a: "Budget-vs-actual, earned value, and schedule risk sit in one governed view on Snowflake, built from scheduling, cost, and progress data consolidated out of spreadsheets into one governed, trusted source. Viewnear surfaces budget-vs-actual and schedule risk while there is still time to act, on a governed source consolidating ERP, project, and field systems. Cost, contract, and asset data stays auditable, with role-based access across every project." },
      { q: "Can architectural CAD drawings be used as data in reporting?", a: "CAD drawings can be read into structured, governed tables, so the quantities, areas, and materials that define a building become queryable alongside the business numbers. For a construction and real-estate developer, Viewnear unified four disconnected sources (construction program and scheduling, project cost and finance, land and acquisition records, and architectural CAD drawings) into one governed source of truth on Snowflake: Openflow ingested the business data into a Bronze, Silver, Gold Medallion foundation, and the design data locked in the architectural and engineering drawings was extracted into governed, queryable tables. Snowflake CoWork agents over governed Semantic Views, plus Slack bots, then let teams ask questions and act on that data inside Snowflake and in the tools they already work in." },
      { q: "What does a property owner or developer get at portfolio level?", a: "Portfolio and asset analytics on Snowflake show occupancy, yield, and performance across every property and project in one place, and forecasting and valuation models feed valuation, capital planning, and bids with trusted, current data. For a construction and real-estate developer, construction programs, individual projects, and land acquisition decisions were all measured against the same governed Gold models, so the business ran from one source instead of hand-stitched spreadsheets." },
    ],
    order: 1,
  },
  {
    slug: "education",
    name: "Education",
    headline: "Education institutions are rich in student data and starved of insight.",
    seoTitle: "Snowflake for Education Data & Analytics",
    seoDescription: "Education data and AI on Snowflake: student records and learning events unified into insight institutions can act on.",
    intro:
      "Across schools, universities, and training providers, we turn enrollment, learning, and operational data into a single trusted source for student success, institutional reporting, and funding accountability.",
    challenges: [
      { problem: "Student data split across systems", response: "We unify SIS, LMS, and operational data into one governed, trusted source." },
      { problem: "Manual statutory and funder reporting", response: "We automate institutional and regulatory reporting from one source." },
      { problem: "Retention risks identified too late", response: "We deliver early-warning analytics on engagement and outcomes." },
    ],
    deliverables: [
      { title: "Student success analytics", description: "Engagement, attainment, and retention insight in one place." },
      { title: "Institutional reporting", description: "Automated statutory, accreditation, and funder reporting." },
      { title: "Enrollment & operations dashboards", description: "Admissions, capacity, and operational performance at a glance." },
      { title: "Unified education data foundation", description: "A governed foundation across academic and administrative systems." },
    ],
    tools: ["Snowflake", "Openflow", "Snowsight", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "5+" }],
    faq: [
      { q: "How long does it take to stand up a student data foundation on Snowflake?", a: "A governed, real-time student data foundation on Snowflake was live in seven weeks for one university group, and a typical first production build runs 8–16 weeks depending on data volume, source complexity, and the use cases in scope. What keeps that timeline real: a discovery that fixes scope up front, two-week agile sprints with a shared backlog and demos, and a joint technical and business committee. That group received a governed Snowflake environment, native Anthology / Blackboard Data Share integration, real-time Caliper event streaming, and documentation plus knowledge transfer so its own team runs and extends it." },
      { q: "How do institutions bring SIS and LMS data together on Snowflake?", a: "Academic records and learning-activity events reach Snowflake by two paths and are joined in one governed model. For a group of universities serving 20,000+ students across Miami and Latin America, Viewnear connected Anthology / Blackboard Data Share to land academic data in a RAW layer with schema discovery and refresh, volume, and usage validation, and streamed Caliper learning events from the LMS through Azure Event Hub into Snowflake RAW. A documented student analytics model sits on top of those RAW layers, and the governed RAW-to-analytics structure keeps clear lineage back to each source system." },
      { q: "Can Snowflake flag students at risk of dropping out?", a: "Early-warning analytics on engagement and outcomes is a standard education deliverable on Snowflake, and it depends on learning-activity events streaming as they happen rather than arriving in batch. Viewnear unifies SIS, LMS, and operational data into one governed, trusted source, then delivers student success analytics on engagement, attainment, and retention, with early-warning insight on the students most at risk. Student data is handled FERPA-aware, with roles, RBAC, and network policies defining who can reach what by campus and function." },
    ],
    order: 2,
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    headline: "In financial services, data is worth more than the products. It should be treated that way.",
    seoTitle: "Snowflake for Financial Services Data",
    seoDescription: "Financial services data and AI on Snowflake: governed, auditable data for risk, finance, and customer decisions.",
    intro:
      "Across banking, insurance, and asset management, the organizations that win are the ones that turn fragmented financial data into a single, governed, trusted source for reporting, compliance, and AI.",
    challenges: [
      { problem: "Fragmented data sources", response: "We consolidate complex financial data into a single, governed enterprise warehouse." },
      { problem: "Manual compliance reporting", response: "We automate regulatory and structured external reporting from one governed source." },
      { problem: "Decisions on stale data", response: "We deliver self-service analytics so teams act on current, reliable numbers." },
    ],
    deliverables: [
      { title: "Enterprise data warehouses", description: "Scalable, governed foundations for analytics across the business." },
      { title: "Self-service analytics", description: "Internal analytics and structured external reporting from one source." },
      { title: "Regulatory reporting", description: "Automated, auditable compliance reporting." },
      { title: "Analytics & AI use cases", description: "From product evaluation through to AI use cases across departments." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "12+" }],
    faq: [
      { q: "How do banks and insurers make regulatory reporting auditable on Snowflake?", a: "Regulatory reporting becomes auditable on Snowflake when it is generated from one governed source instead of assembled by hand. Viewnear consolidates fragmented banking, insurance, and asset data into a single governed enterprise warehouse, then automates regulatory and structured external reporting from it, with FINRA, SEC, and SOX-aligned reporting, role-based access, and full audit lineage on every reported number. Self-service analytics on the same source keeps teams deciding on current, reliable numbers instead of stale data." },
      { q: "What can Snowflake Cortex AI do with insurance claim documents?", a: "Snowflake Cortex AI classifies and extracts data from claim documents with the AI functions called directly in SQL, so there is no separate model to host. For a claims processing company that had been sorting documents from many insurance providers by hand, Viewnear built a pipeline where PARSE_DOCUMENT turned each PDF into usable text and layout, AI_CLASSIFY sorted documents into Denials, Verifications, Payments, and Correspondence without rigid templates, and AI_EXTRACT pulled claim numbers, check amounts, dates, and customer details. Classification accuracy rose from 60% to 95%, average per-document classification dropped to 4 seconds, and over 40% of previously discarded documents were recovered." },
      { q: "Do Snowflake Cortex AI features send sensitive data outside the client's account?", a: "Cortex AI functions run on the data inside the client's own governed Snowflake account, so nothing is copied to an external service. On the claims work Viewnear delivered on Snowflake Cortex AI, sensitive fields are classified and masked by policy, role-based access limits who can see raw documents and extracted data with separation of duties across processing, review, and reporting, and Horizon Catalog makes every document, classification, and extracted field traceable. The build itself runs in the client's Snowflake account, repositories, and CI, under the client's access controls and change process." },
    ],
    order: 3,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    headline: "Manufacturing data, moving as fast as the factory floor makes it.",
    seoTitle: "Snowflake for Manufacturing Analytics",
    seoDescription: "Manufacturing data and AI on Snowflake: governed production, quality, and cost data that reaches the decisions on the floor.",
    intro:
      "We connect production, supply-chain, and sensor data into one governed, trusted source so manufacturers can lift OEE, see the whole supply chain, and act on issues before they reach the customer.",
    challenges: [
      { problem: "Machine and ERP data don't connect", response: "We unify shop-floor, sensor, and ERP data into one governed, trusted source." },
      { problem: "Hidden downtime and quality loss", response: "We deliver OEE and quality analytics that expose the real cost drivers." },
      { problem: "Supply-chain blind spots", response: "We bring the whole chain into one view, from supplier to shipment." },
    ],
    deliverables: [
      { title: "OEE & production analytics", description: "Availability, performance, and quality in a single live view." },
      { title: "Supply-chain visibility", description: "Tracking from supplier through to delivery, governed at every step." },
      { title: "IoT & sensor data pipelines", description: "High-volume machine and sensor data, ingested and governed." },
      { title: "Predictive maintenance models", description: "Data foundations for forecasting failures before they happen." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "7+" }],
    faq: [
      { q: "What data problems do manufacturers usually run into on Snowflake?", a: "Manufacturers usually arrive with three problems: machine and ERP data that do not connect, hidden downtime and quality loss, and supply-chain blind spots. Viewnear unifies shop-floor, sensor, and ERP data into one governed, trusted source on Snowflake, then builds OEE and quality analytics that expose the real cost drivers, with availability, performance, and quality in a single live view. Traceability runs from supplier to shipment, governed at every step for quality and audit." },
      { q: "How does shop-floor, sensor, and ERP data get into Snowflake?", a: "Shop-floor, sensor, and ERP data is unified into one governed, trusted source on Snowflake, and high-volume machine and sensor data is ingested and governed as part of it. On a Viewnear engagement with a corrugated packaging manufacturer, Openflow ingested SAP Business One and its satellite systems on a batch, incremental schedule, landing raw data in Bronze, conforming it into a Silver enterprise model, and resolving governed Gold analytical models. Every transformation that builds those layers runs in dbt under version control and natively against Snowflake, so each rule is reviewed, tested, and traceable." },
      { q: "Can Snowflake help fix a product catalog that has grown into thousands of unmanaged SKUs?", a: "A runaway product catalog is fixed with product architecture and governance rules, and Snowflake is where both get enforced. For a corrugated packaging manufacturer whose catalog had exploded into thousands of SKUs and variants with no product architecture, Viewnear built a Standard SKU catalog defining the allowed variants and the rules for combining them, a golden record per domain with versioned rules and accountable owners, and What-if simulation that quantifies SKU-reduction and standardization decisions against demand, capacity, and business constraints before anyone commits to them. A Snowflake CoWork agent over governed Semantic Views lets business users validate SKUs, detect duplicates, and see which variants drive complexity in plain language." },
    ],
    order: 4,
  },
  {
    slug: "media-entertainment-advertising",
    name: "Media, Entertainment & Advertising",
    headline: "Media, entertainment, and advertising audiences move fast. The data that tracks them should move faster.",
    seoTitle: "Snowflake for Media & Advertising Data",
    seoDescription: "Media, entertainment, and advertising data on Snowflake: audience and campaign data governed and fast enough to act on.",
    intro:
      "We unify audience, content, and campaign data into one governed source so media, entertainment, and advertising teams can measure performance, attribute spend, and act on engagement in near real time.",
    challenges: [
      { problem: "Audience data scattered across platforms", response: "We unify viewing, subscription, and engagement data into one source." },
      { problem: "Campaign attribution that arrives too late", response: "We deliver near-real-time attribution across channels and spend." },
      { problem: "Content decisions made on gut feel", response: "We surface content performance analytics that guide what to commission." },
    ],
    deliverables: [
      { title: "Audience & engagement analytics", description: "A unified view of who is watching, reading, and subscribing." },
      { title: "Campaign & ad attribution", description: "Cross-channel attribution that connects spend to outcomes." },
      { title: "Content performance analytics", description: "What resonates, by title, format, and platform." },
      { title: "Unified media data foundation", description: "A governed foundation across ad, subscription, and content systems." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "5+" }],
    faq: [
      { q: "How do media companies unify audience data spread across platforms?", a: "Viewing, subscription, and engagement data is unified into one governed source on Snowflake, which is what turns audience data scattered across platforms into a single view of who is watching, reading, and subscribing. Viewnear builds that governed foundation across ad, subscription, and content systems. Audience data is handled consent-aware, governed for privacy across every channel." },
      { q: "Can Snowflake do cross-channel campaign and ad attribution?", a: "Cross-channel attribution runs on Snowflake once campaign, audience, and spend data share one governed source, and it is delivered near real time rather than arriving too late to act on. Viewnear unifies audience, content, and campaign data so media, entertainment, and advertising teams can measure performance, attribute spend, and act on engagement in near real time, with attribution connecting spend to outcomes across channels." },
      { q: "What data does a content team need to decide what to commission?", a: "Content performance analytics shows what resonates by title, format, and platform, which is what replaces gut feel in commissioning decisions. Viewnear delivers that analytics on Snowflake from unified audience, content, and campaign data, so engagement can be acted on in near real time." },
    ],
    order: 5,
  },
  {
    slug: "retail-cpg",
    name: "Retail & CPG",
    headline: "Retail and CPG margin is thin. Data-driven decisions are where it is recovered.",
    seoTitle: "Snowflake for Retail & CPG Data and AI",
    seoDescription: "Retail and CPG analytics on Snowflake: unified sales, inventory, and margin data, governed well enough to act on daily.",
    intro:
      "From perishable goods and food production to omnichannel retail and loyalty, we unify sales, inventory, production, and customer data into near-real-time analytics that sharpen inventory, margin, and merchandising decisions.",
    challenges: [
      { problem: "Stock and sales blind spots", response: "We track stock against sales to sharpen inventory and replenishment decisions." },
      { problem: "Online and in-store data split", response: "We unify online and physical operations into one near-real-time view." },
      { problem: "Opaque cost and loyalty data", response: "We connect production and food cost with customer and loyalty analytics." },
    ],
    deliverables: [
      { title: "Sales & inventory analytics", description: "Stock-vs-sales visibility that cuts shrink and stockouts." },
      { title: "Omnichannel analytics", description: "Online and in-store unified for near-real-time reporting." },
      { title: "Production & food-cost analytics", description: "Production performance, logistics, and food cost in one view." },
      { title: "Customer & loyalty analytics", description: "Margin-by-product insight and loyalty performance tracking." },
    ],
    tools: ["Snowflake", "Snowsight", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "10+" }],
    faq: [
      { q: "How does a retailer get one view of demand across online and in-store?", a: "Retail and CPG teams get one demand view by unifying online and physical operations into a single near-real-time governed source on Snowflake, with stock tracked against sales. Viewnear delivers stock-vs-sales visibility that cuts shrink and stockouts, with online and in-store data unified for near-real-time reporting. Payment and customer data is handled PCI-aware and governed end to end." },
      { q: "Can Snowflake show margin by product and food cost for a food producer?", a: "Margin-by-product insight and food cost sit on the same governed foundation on Snowflake: production performance, logistics, and food cost in one view, tracked alongside loyalty performance. Viewnear works across perishable goods and food production, unifying sales, inventory, production, and customer data into near-real-time analytics that sharpen inventory, margin, and merchandising decisions." },
      { q: "How does a multi-site sales, service, and parts network get one definition of a customer or a part?", a: "One definition comes from a master data foundation on Snowflake: source data lands in Bronze, is cleaned and conformed in Silver, and resolves into governed Gold golden records, with master keys, matching and merge, survivorship rules, lineage, and audit designed in from the first table. Viewnear built that for a commercial-vehicle dealer group that ran sales, service, parts, and the back office on separate systems, mastering eight business domains from three source systems across three releases in a twelve-month roadmap. Per-domain Snowflake CoWork agents, grounded in each domain's governed golden record, let business users ask questions of master data in plain language." },
    ],
    order: 6,
  },
  {
    slug: "technology-telco",
    name: "Technology & Telco",
    headline: "Technology and telco firms sit on usage data most companies would envy.",
    seoTitle: "Snowflake for Technology & Telco Data",
    seoDescription: "Technology and telco data on Snowflake: usage, billing, and product telemetry turned into governed, revenue-ready insight.",
    intro:
      "For software, platform, and telecommunications businesses, we turn product usage and network telemetry into a governed source for churn, growth, and reliability, so teams act on signal instead of anecdote.",
    challenges: [
      { problem: "Product and network data in silos", response: "We unify usage, billing, and network telemetry into one governed, trusted source." },
      { problem: "Churn surfaces only after customers leave", response: "We deliver churn and retention analytics that flag risk early." },
      { problem: "Growth levers buried in raw events", response: "We build product analytics that connect usage to revenue." },
    ],
    deliverables: [
      { title: "Product & usage analytics", description: "Event-level usage connected to activation, growth, and revenue." },
      { title: "Churn & retention models", description: "Early-warning analytics on the customers most at risk." },
      { title: "Network & telemetry pipelines", description: "High-volume telemetry ingested, governed, and query-ready." },
      { title: "Self-service analytics", description: "Reliable, governed metrics every team reports from." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "8+" }],
    faq: [
      { q: "How is high-volume event telemetry handled on Snowflake?", a: "High-volume usage and network telemetry is ingested, governed, and query-ready on Snowflake, unified with product usage and billing data in one governed, trusted source. Viewnear builds those telemetry pipelines for software, platform, and telecommunications businesses, keeping the full volume query-ready. Usage and network data is handled with privacy, consent, and access controls." },
      { q: "Can Snowflake flag customers at risk of churning before they leave?", a: "Churn and retention analytics on Snowflake flag risk early, instead of surfacing churn only after customers have left. Viewnear builds those early-warning analytics on product usage, billing, and network telemetry unified into one governed, trusted source, and delivers them use case by use case, in sprints with working software at every demo." },
      { q: "How do product teams connect usage data to revenue?", a: "Product analytics on Snowflake connects event-level usage to activation, growth, and revenue in one governed source, which is how growth levers buried in raw events become visible. Viewnear unifies product usage, billing, and network telemetry into that source, then builds the product analytics on top. Because the metrics are governed and reliable, every team reports from the same numbers." },
    ],
    order: 7,
  },
];

// Clients across Americas regions and sectors, one per industry.
export const clients = [
  { slug: "construction-developer", name: "A construction and real-estate developer", sector: "Construction & Real Estate", region: "Mexico" },
  { slug: "harvest-university", name: "Harvest University", sector: "Education", region: "USA" },
  { slug: "university-group-latam", name: "A multi-campus university group", sector: "Education", region: "Miami & LATAM" },
  { slug: "northwind-bank", name: "Northwind Bank", sector: "Financial Services", region: "USA" },
  { slug: "insurance-claims-processor", name: "A claims processing company", sector: "Insurance", region: "Americas" },
  { slug: "commercial-vehicle-dealer-group", name: "A commercial-vehicle dealer group", sector: "Automotive", region: "Mexico" },
  { slug: "corrugated-packaging-manufacturer", name: "A corrugated packaging manufacturer", sector: "Manufacturing", region: "Mexico" },
];

type CaseStudySeed = {
  slug: string;
  /**
   * When this case study was published on the site, from the git history of its
   * longform markdown. Feeds Article.datePublished and the sitemap's lastmod.
   * Without it these all inherited one shared constant that postdated the real
   * content history.
   */
  date?: string;
  clientSlug: string;
  industrySlug: string | null;
  sector: string;
  region: string;
  heroImage?: string;
  title: string;
  summary: string;
  /**
   * SERP-length metadata. `title` and `summary` are the on-page copy and run
   * well past what a search result displays (the longest summary here was 514
   * characters as a meta description), so these carry the short versions.
   */
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  order: number;
  metrics?: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  body?: string;
};

// One case study per industry; ordered to mirror the industries list.
export const caseStudies: CaseStudySeed[] = [
  { slug: "sku-catalog-governance", date: "2026-07-05", seoTitle: "SKU Governance: Restoring Accurate Costs", seoDescription: "A packaging manufacturer's catalog had grown to thousands of unmanaged SKUs. Product architecture and governance on Snowflake restored accurate costs.", clientSlug: "corrugated-packaging-manufacturer", heroImage: "/assets/images/cases/sku-catalog-governance-hero.jpg", industrySlug: "manufacturing", sector: "Manufacturing", region: "Mexico", title: "Reining in thousands of runaway SKUs to restore accurate product costs", summary: "A corrugated packaging manufacturer's product catalog exploded into thousands of SKUs and variants with no product architecture, distorting costs and slowing production. Viewnear designed a governed Snowflake foundation: a Medallion warehouse from SAP Business One via Openflow, master-data and SKU governance rules, a Standard SKU catalog, What-if simulation, and a Snowflake CoWork catalog agent over governed Semantic Views.", featured: true, order: 3, metrics: [{ value: "Medallion", label: "Bronze, Silver, Gold warehouse" }, { value: "3–5", label: "Critical catalogs in first wave" }, { value: "What-if", label: "SKU optimization simulation" }, { value: "CoWork", label: "Natural-language catalog agent" }] },
  { slug: "construction-cad-data-foundation", date: "2026-07-05", seoTitle: "CAD Drawings to Decision-Ready Data", seoDescription: "Four disconnected sources, architectural CAD drawings among them, unified into one governed source of truth on Snowflake.", clientSlug: "construction-developer", heroImage: "/assets/images/cases/construction-cad-data-foundation-hero.jpg", industrySlug: "construction-real-estate", sector: "Construction & Real Estate", region: "Mexico", title: "Turning architectural CAD drawings into measurable, decision-ready data", summary: "We unified four disconnected sources, including architectural CAD drawings, into one governed source of truth on Snowflake. Design data locked in the drawings became structured, measurable data alongside construction, finance, and land data, and we delivered Snowflake CoWork agents and Slack bots on top.", featured: true, order: 4, metrics: [{ value: "4", label: "Sources unified, including CAD" }, { value: "CAD", label: "Drawings made measurable as governed data" }, { value: "Agents", label: "Snowflake CoWork + Slack bots" }, { value: "1", label: "Source for programs, projects, and land" }] },
  { slug: "real-time-student-data-pipeline", date: "2026-06-14", seoTitle: "Real-Time Student Analytics in 7 Weeks", seoDescription: "Academic records and LMS learning events across campuses in Miami and Latin America, unified into live insight on 20,000+ students.", clientSlug: "university-group-latam", heroImage: "/assets/images/cases/real-time-student-data-pipeline-hero.jpg", industrySlug: "education", sector: "Education", region: "Miami & LATAM", title: "Real-time insight into 20,000+ students across campuses, live in seven weeks", summary: "A group of universities serving 20,000+ students across Miami and Latin America had academic records and LMS learning events siloed across campuses. Viewnear built a governed, real-time student data pipeline on Snowflake: a governed environment, native Blackboard Data Share integration, and real-time Caliper event streaming, unifying academic and learning-activity data into one governed source.", featured: true, order: 1, metrics: [{ value: "20k+", label: "Students across Miami & LATAM" }, { value: "Real-time", label: "Caliper learning events, was batch" }, { value: "2", label: "Core sources unified (Blackboard + Caliper)" }, { value: "7 wks", label: "To a governed, real-time foundation" }] },
  { slug: "insurance-claims-cortex-ai", date: "2026-07-05", seoTitle: "Claims Classification with Snowflake Cortex", seoDescription: "Hand-sorted insurance documents replaced by Snowflake Cortex AI classification, reaching 95% accuracy in seconds.", clientSlug: "insurance-claims-processor", heroImage: "/assets/images/cases/insurance-claims-cortex-ai-hero.jpg", industrySlug: "financial-services", sector: "Insurance", region: "Americas", title: "From hand-sorted documents to 95% accurate claims classification in seconds", summary: "A claims processing company was sorting documents from many insurance providers by hand, causing delays, errors, and lost files. Using Snowflake Cortex AI functions like AI_EXTRACT, Viewnear automated classification and data extraction, lifting accuracy from 60% to 95% and cutting per-document handling to four seconds.", featured: true, order: 0, metrics: [{ value: "60→95%", label: "Classification accuracy" }, { value: "4 sec", label: "Per-document classification" }, { value: "40%", label: "Discarded documents recovered" }, { value: "88%", label: "Fewer classification errors" }] },
  { slug: "corporate-mdm-golden-record", date: "2026-06-14", seoTitle: "Master Data: One Golden Record", seoDescription: "A commercial-vehicle dealer group unified sales, service, parts, and back office into one trusted golden record across eight domains.", clientSlug: "commercial-vehicle-dealer-group", heroImage: "/assets/images/cases/corporate-mdm-golden-record-hero.jpg", industrySlug: "retail-cpg", sector: "Automotive", region: "Mexico", title: "One trusted golden record across eight business domains", summary: "A commercial-vehicle dealer group ran sales, service, parts, and the back office on separate systems, with no single version of a customer, vehicle, part, or supplier. Viewnear built a corporate master data foundation on Snowflake: a progressive multi-source golden record across eight business domains, using a Medallion architecture, Openflow ingestion, dbt transformations, and per-domain Snowflake CoWork agents.", featured: true, order: 2, metrics: [{ value: "3", label: "Source systems unified" }, { value: "8", label: "Business domains mastered" }, { value: "Medallion", label: "Bronze, Silver, Gold" }, { value: "12 mo", label: "Phased, three releases" }] },
];

export const team = [
  { slug: "jc-rodriguez", name: "JC Rodriguez", title: "Head of Service Delivery", photo: "/assets/images/team/jc-rodriguez.png", linkedinUrl: "https://www.linkedin.com/in/jcrodriguezmiranda/", bookingUrl: "https://calendly.com/juan-r-miranda-viewnear/30min", bookingTopics: "Delivery model, team shape, timelines and migrations", order: 1 },
  { slug: "rene-trevino", name: "René Treviño", title: "Head of Document Intelligence", photo: "/assets/images/team/rene-trevino.png", linkedinUrl: "https://www.linkedin.com/in/reneramosdev/", bookingUrl: "https://calendly.com/rene-viewnear/new-meeting", bookingTopics: "Unstructured documents, extraction accuracy and Cortex AI", order: 2 },
  { slug: "carlos-egremy", name: "Carlos Egremy", title: "Head of Operations", photo: "/assets/images/team/carlos-egremy.png", linkedinUrl: "https://www.linkedin.com/in/carlosegremy/", order: 3 },
  { slug: "karen-berber", name: "Karen Berber", title: "Head of People & HR", photo: "/assets/images/team/karen-berber.png", linkedinUrl: "https://www.linkedin.com/in/karen-b-b0542a137/", order: 4 },
  { slug: "aydhe-mota", name: "Aydhé Mota", title: "Head of Finance", photo: "/assets/images/team/aydhe-mota.png", linkedinUrl: "https://www.linkedin.com/in/aydhemota/", order: 5 },
  { slug: "eduardo-ramos", name: "Eduardo Javier Ramos", title: "CEO", photo: "/assets/images/team/eduardo-ramos.png", linkedinUrl: "https://www.linkedin.com/in/eduardojramos/", bookingUrl: "https://calendly.com/eduardo-viewnear/30min", bookingTopics: "Strategy, roadmap sequencing, partnership and commercial terms", order: 6 },
];

export const news = [
  { slug: "viewnear-snowflake-elite-partner", kind: "announcement", title: "Viewnear named a Snowflake Premier Partner and CoCo Preferred Partner", excerpt: "Viewnear is recognized as a Snowflake Premier Partner and a Snowflake CoCo Preferred Partner.", body: "Viewnear is now a Snowflake Premier Partner and a Snowflake CoCo Preferred Partner, a status earned through SnowPro-certified engineers and a verified, end-to-end delivery track record. Clients can procure Snowflake through Viewnear on consumption-based terms and rely on a single accountable team across the Americas." },
  { slug: "viewnear-elite-partner-founder-story", kind: "press", title: "How Viewnear became a Snowflake Premier Partner in four years", excerpt: "The founder story behind Viewnear's path to Premier Partner status.", body: "From a small specialist team to a trusted Snowflake Premier Partner serving clients across Canada, the USA, Mexico, LATAM, and the Caribbean: the story of how Viewnear earned that status within four years of joining the Snowflake partner program by building deep expertise and a verified delivery track record." },
  { slug: "viewnear-executive-roundtable", kind: "event", title: "Executive roundtable explores data and AI strategy in financial services", excerpt: "Viewnear hosts an executive roundtable on data and AI strategy.", body: "Viewnear convened senior leaders to explore how data and AI strategy are reshaping financial services, with practical sessions on Snowflake Cortex and governed AI.", venue: "Toronto, Canada", agenda: [{ time: "09:00", item: "Welcome & breakfast" }, { time: "09:30", item: "Keynote: There is no AI strategy without a data strategy" }, { time: "10:30", item: "Panel: AI in financial services" }] },
  { slug: "viewnear-manufacturing-collaboration", kind: "event", title: "Manufacturing data collaboration workshop explores value realization", excerpt: "A workshop on realizing value from manufacturing data.", body: "Viewnear ran a collaborative workshop with manufacturing leaders exploring how to realize measurable value from shop-floor and operational data on Snowflake." },
  { slug: "viewnear-americas-expansion", kind: "announcement", title: "Viewnear expands across the Americas", excerpt: "New presence to support clients across North and Latin America.", body: "Viewnear announces expanded operations to better serve clients across Canada, the USA, Mexico, LATAM, and the Caribbean." },
  { slug: "viewnear-summit-user-group", kind: "event", title: "Viewnear hosts Snowflake user group at Summit", excerpt: "Bringing the regional Snowflake community together.", body: "Viewnear hosted a regional Snowflake user group session, bringing together data leaders to share patterns and lessons from production deployments." },
];

export const blogPosts = [
  { slug: "how-to-choose-a-snowflake-partner", seoTitle: "How to Choose a Snowflake Partner", seoDescription: "A buyer's checklist for evaluating a Snowflake partner: certifications, delivery model, references, and what to ask before signing.", coverImage: "/assets/images/photos/collaboration.jpg", title: "How to Choose a Snowflake Partner: A Buyer's Checklist", excerpt: "Certifications are the floor, not the answer. The traits that separate a good Snowflake partner from a painful one rarely make the pitch deck: who builds with your team, who stays accountable after go-live, and who prices to finish rather than to bill. A practical checklist to take into every conversation.", authorTeam: "eduardo-ramos", date: "2026-07-14", keyTakeaways: ["Partner tier and SnowPro certification are the floor: confirm them, then check whether the senior people in the pitch are the ones who will actually deliver.", "The biggest predictor of long-term happiness is whether a partner builds with your team and hands the work over, or builds a black box and leaves.", "Match the delivery model to how you work: for US companies, a nearshore team in your time zone changes the pace of the whole engagement.", "Pricing reveals incentives: hourly billing rewards taking longer, outcome-based pricing rewards finishing. Know which you are buying.", "Ask for proof, not adjectives: callable references, a project walked through end to end, and governance and cost control designed in from day one."] },
  { slug: "snowflake-migration-cost", seoTitle: "What a Snowflake Migration Costs", seoDescription: "The real cost drivers in a Snowflake migration: data volume, pipeline rework, compute sizing, and the team needed to run it.", coverImage: "/assets/images/photos/datacenter.jpg", title: "What a Snowflake Migration Actually Costs (And What Drives the Number)", excerpt: "Anyone who quotes a firm migration price before seeing your environment is guessing. But the cost is not unknowable: it is the sum of a few clear drivers, from the source system to the pipeline count to governance. Here is what moves the number, and how to bring it down.", authorTeam: "eduardo-ramos", date: "2026-07-15", keyTakeaways: ["Separate two costs: Snowflake's ongoing consumption-based platform cost, and the one-time migration project cost. Confusing them causes sticker shock in both directions.", "The biggest project driver is usually the pipelines and transformations, not the raw data volume: every job and buried business rule must be rebuilt and validated.", "The source system matters: moving off Teradata, Oracle, or Hadoop carries more proprietary baggage than Redshift or SQL Server.", "You can move the number down with automated code conversion, retiring dead pipelines, validated parity, and a phased cutover instead of a big bang.", "The honest first step is a discovery, not a quote: it narrows the range from a guess to a number you can plan around."] },
  { slug: "nearshore-vs-offshore-snowflake", seoTitle: "Nearshore vs Offshore Snowflake Delivery", seoDescription: "How to decide between nearshore and offshore for Snowflake delivery: time-zone overlap, travel, bilingual teams, and total cost.", coverImage: "/assets/images/photos/team-meeting.jpg", title: "Nearshore vs Offshore for Snowflake Delivery: How to Decide", excerpt: "The nearshore-versus-offshore decision usually starts with hourly rates. It should start with clocks. Snowflake and AI work is iterative and decision-dense, which is exactly the kind of work where time-zone overlap beats a lower rate. A framework for deciding which model fits your project.", authorTeam: "eduardo-ramos", date: "2026-07-16", keyTakeaways: ["Compare cost-to-outcome, not cost-per-hour: a lower offshore rate is erased by the rework that overnight latency causes on iterative work.", "Snowflake and AI work is discovery-heavy and decision-dense, which rewards time-zone overlap: a blocker resolved by lunch versus a full day per round trip.", "Offshore is a strong choice when scope is stable, documented, and cleanly handed off; the rate advantage is real on that kind of work.", "Score your project on two axes: how stable the scope is, and how decision-dense the work is. Evolving and decision-dense leans nearshore.", "Whatever you choose, look past the rate card to team stability and who stays accountable after go-live."] },
  { slug: "snowflake-control-plane-agentic-enterprise", seoTitle: "Snowflake as the Agentic Control Plane", seoDescription: "Snowflake is becoming the control plane for the agentic enterprise, where agents act on governed data instead of copies of it.", coverImage: "/assets/images/blog/snowflake-control-plane-agentic-enterprise.jpg", title: "Snowflake Is Now the Control Plane for the Agentic Enterprise", excerpt: "Snowflake began as a data platform, but the rise of agentic AI demands a governed control plane that unifies trusted data, business context, model choice, security, and workflows. This piece explains why Snowflake is positioning itself as that operating layer for the agentic enterprise.", authorTeam: "eduardo-ramos", date: "2026-06-13", keyTakeaways: ["The agentic enterprise needs a control plane that coordinates data, context, models, agents, governance, and action.", "Governed enterprise data is the foundation agentic AI must start from, not the agents themselves.", "Business context, definitions, metrics, and semantic models are what let agents reason correctly and consistently.", "Agentic governance shifts from who can see what to what agents are allowed to do and execute.", "Snowflake is evolving from data warehouse to AI operating layer, positioning itself as the control plane for enterprise AI."] },
  { slug: "ai-assistant-understands-your-data", seoTitle: "The AI Assistant That Understands Data", seoDescription: "Why an AI assistant grounded in governed, modeled data answers questions a general-purpose chatbot cannot.", coverImage: "/assets/images/blog/ai-assistant-understands-your-data.jpg", title: "The AI Assistant That Actually Understands Your Data (And Why That Matters)", excerpt: "Snowflake Cortex Agents are not just another chatbot feature. After implementing them across multiple client environments, I have seen how they are transforming the way business users interact with data, and it is more profound than I initially expected.", authorTeam: "eduardo-ramos", date: "2025-04-19", keyTakeaways: ["Cortex Agents work inside the data platform, so they query live data and inherit your existing permissions and governance automatically.", "Customer service is the best place to start because the value is immediate: agents give reps a customer's full history and institutional memory from past cases.", "Data preparation is about business context, not heavy engineering: readable field names, meaningful categories, and documented business rules.", "Security and cost behave like the rest of Snowflake, with row-level security, masking, shared audit trails, and transparent consumption-based pricing.", "The biggest hurdle is usually organizational, so begin with high-value use cases, limited scope, and training focused on conversation techniques."] },
  { slug: "data-warehouse-revolution-five-years", seoTitle: "Five Years of Data Warehouse Change", seoDescription: "What changed in data warehousing across five years, and why separating compute from storage mattered more than anything else.", coverImage: "/assets/images/blog/data-warehouse-revolution-five-years.jpg", title: "The Data Warehouse Transformation I've Been Watching Unfold for Five Years", excerpt: "When I started recommending Snowflake to clients, many were skeptical about cloud data warehousing. Today, those same organizations cannot imagine going back to traditional systems, and here is why this transformation matters.", authorTeam: "rene-trevino", date: "2025-04-26", keyTakeaways: ["Cloud-native platforms remove the storage and compute constraints that shaped traditional data warehouse design, changing the questions teams ask about their data.", "Separating compute and storage is the key insight: each scales independently, and multi-cluster architecture keeps workloads from interfering with one another.", "Near-maintenance-free operations, instant scaling, and live data sharing let teams focus on business problems instead of administrative overhead.", "Consumption-based pricing aligns cost with actual usage, but it requires new monitoring habits to avoid surprises during development and testing.", "Start with a focused, high-value proof of concept that showcases new capabilities rather than attempting a complete migration up front."] },
  { slug: "bi-integration-challenge-power-bi-tableau-snowflake", seoTitle: "Power BI and Tableau on Snowflake", seoDescription: "The integration problem every BI team hits connecting Power BI and Tableau to Snowflake, and how to solve it cleanly.", coverImage: "/assets/images/blog/bi-integration-challenge-power-bi-tableau-snowflake.jpg", title: "The Integration Challenge Every BI Team Faces (And How We Solve It)", excerpt: "Connecting Snowflake to your favorite BI tools should not feel like rocket science. After dozens of implementations, here are the patterns that work and the pitfalls that waste time.", authorTeam: "eduardo-ramos", date: "2025-05-03", keyTakeaways: ["Use service accounts with key pair authentication and dedicated warehouses per tool to keep performance predictable and costs clear.", "Choose DirectQuery or live connections for large, changing data and import or extracts for smaller, stable data, and combine them in a hybrid model.", "Implement security once in Snowflake with row-level policies and secure views so every BI tool inherits the same governance.", "Aggressive auto-suspend plus multi-cluster auto-scaling controls cost without hurting the user experience.", "Design integrations for flexibility and governance rather than optimizing for any single tool or use case."] },
  { slug: "why-snowflake-ai-strategy-matters", seoTitle: "Why Snowflake's AI Strategy Matters", seoDescription: "What Snowflake's AI strategy means for data teams, from Cortex to governed model access inside the warehouse.", coverImage: "/assets/images/blog/why-snowflake-ai-strategy-matters.jpg", title: "Why Every Data Team Should Pay Attention to Snowflake's AI Strategy", excerpt: "From a front-row seat watching Snowflake's AI evolution, this is not just another vendor adding ML features. It is a fundamental shift that will change how we build and deploy AI applications.", authorTeam: "rene-trevino", date: "2025-05-10", keyTakeaways: ["Bringing AI into the data cloud removes the barrier between data storage and AI processing, so you can analyze text and run models where your data already lives.", "Cortex functions let you blend traditional analytics with AI insights in a single query, from sentiment analysis to document extraction to forecasting.", "Because AI runs inside the platform, existing access controls, audit trails, and governance policies apply automatically with no extra configuration.", "Consumption-based pricing means AI costs scale with usage, and the same monitoring and optimization habits you use for queries apply to AI workloads.", "Start with focused, high-value use cases, augment human judgment rather than replace it, and plan for iterative improvement as capabilities evolve."] },
  { slug: "zero-copy-cloning-snowflake", seoTitle: "Snowflake Zero-Copy Cloning Explained", seoDescription: "Zero-copy cloning is Snowflake's most underused feature. How it works, and where it saves real time and money.", coverImage: "/assets/images/blog/zero-copy-cloning-snowflake.jpg", title: "Understanding Zero-Copy Cloning: Snowflake's Most Underutilized Feature", excerpt: "Zero-copy cloning sounds too good to be true until you understand the mechanics. Here is how this feature works and why it should be part of every data team's toolkit.", authorTeam: "rene-trevino", date: "2025-05-17", keyTakeaways: ["Zero-copy cloning creates instant, fully functional database copies by sharing underlying data files, so cloning a 100TB database takes the same time as cloning a 100GB one.", "Storage costs start at zero and grow only as the clone and original diverge through updates, making cloning practical for everyday development, testing, and analysis.", "Clones inherit the security, masking, and access controls of the source, so governance applies automatically without extra configuration.", "Pair clones with descriptive naming, lifecycle policies, and storage monitoring to avoid forgotten long-running clones that quietly accumulate cost.", "Use cases span development environments, A/B testing, point-in-time reporting, migration rehearsals, disaster recovery testing, and isolated support investigations."] },
  { slug: "snowflake-compute-storage-architecture", seoTitle: "Snowflake Compute and Storage", seoDescription: "Why separating compute from storage changes what a data strategy can do, and how to size warehouses around it.", coverImage: "/assets/images/blog/snowflake-compute-storage-architecture.jpg", title: "Why Snowflake's Compute-Storage Architecture Actually Matters for Your Data Strategy", excerpt: "Understanding Snowflake's architectural decisions is not just technical curiosity. It is the foundation for optimizing performance, controlling costs, and building scalable data solutions.", authorTeam: "eduardo-ramos", date: "2025-05-24", keyTakeaways: ["Separating compute and storage lets you scale each independently, so you pay for what you actually use instead of provisioning for peak capacity around the clock.", "Multi-cluster and resource isolation keep different workloads (ETL, user queries, development) from interfering with each other while giving you clear cost visibility.", "Optimization shifts from index tuning and physical storage layouts to data organization, clustering keys, materialized views, and result caching.", "Resource monitors, auto-suspend, and right-sizing turn cost control into a predictable, automated discipline.", "Architectural separation is what makes instant scaling, zero-copy cloning, and secure data sharing economically feasible."] },
  { slug: "snowflake-summit-2025-takeaways", seoTitle: "Snowflake Summit 2025: Takeaways", seoDescription: "What stood out at Snowflake Summit 2025, what it signals for data teams, and what we are carrying into delivery.", coverImage: "/assets/images/blog/snowflake-summit-2025-takeaways.jpg", title: "Just Back from Snowflake Summit 2025: What Stood Out, What Got Us Thinking, and What's Next", excerpt: "Viewnear attended Snowflake Summit 2025 in San Francisco, and beyond a roadmap full of exciting updates, what stood out were the thoughtful conversations, the clear direction the platform was heading, and how those shifts align with the way we help clients build smarter, faster, and more future-ready data solutions.", authorTeam: "eduardo-ramos", date: "2025-06-06", keyTakeaways: ["Snowflake CoWork brings natural language querying built on governed, secure, role-aware data, but real impact depends on pairing it with the right data models and use cases.", "Cortex AISQL applies generative AI directly inside SQL, summarizing, analyzing, and classifying unstructured data without moving anything out of Snowflake.", "Adaptive Compute, Gen 2 Warehouses, and stronger security defaults (passkeys, MFA, leaked-credential monitoring) free up time for strategic design over manual tuning.", "Native dbt Projects in Snowsight tighten the analytics engineering loop, and Openflow (via the Datavolo acquisition) points toward richer in-platform data movement.", "Viewnear acted on what Summit 2025 showed: Cortex AISQL pilots, architecture baselines updated for Gen 2, and scoping Snowflake CoWork inside client orgs."] },
  { slug: "snowflake-cortex-aisql-first-look", seoTitle: "Snowflake Cortex AISQL: A First Look", seoDescription: "A first look at Snowflake Cortex AISQL: running generative AI from SQL, and where it fits in a data practice.", coverImage: "/assets/images/blog/snowflake-cortex-aisql-first-look.jpg", title: "From SQL to Gen-AI: A First Look at Snowflake Cortex AISQL", excerpt: "Snowflake's Cortex AISQL functions let you run large language model tasks such as classification, extraction, translation, and even image Q&A directly in SQL. Here is what it means for data teams, how it works in practice, and where we at Viewnear see the biggest opportunities.", authorTeam: "eduardo-ramos", date: "2025-06-21", keyTakeaways: ["Cortex AISQL embeds state-of-the-art LLMs directly inside the Snowflake engine, so there is no extra AI infrastructure to stand up and your data never leaves the platform.", "Analysts can prototype LLM workflows with nothing more than a SELECT statement, classifying sentiment, extracting fields, and answering questions about images in a single query.", "Pairing PARSE_DOCUMENT with AI_COMPLETE handles PDFs and mobile photos in one pipeline, which is ideal for mortgage and insurance use cases.", "Existing roles, masking policies, and row-level security still apply, and credits scale with input tokens and the chosen model, so prototype small and track usage.", "The hosting question is largely solved; the real decision is now which business problem to tackle first."] },
  { slug: "agi-ready-data-cloud", seoTitle: "Steps Toward an AGI-Ready Data Cloud", seoDescription: "Even the strongest models are limited by the data they can reach. What an AGI-ready data cloud actually requires.", coverImage: "/assets/images/blog/agi-ready-data-cloud.jpg", title: "Quiet Steps Toward an AGI-Ready Data Cloud", excerpt: "Artificial general intelligence no longer feels like science fiction, but even the smartest models will stumble without disciplined, trustworthy data. This article outlines the mindset shifts business leaders need, shows how Snowflake quietly smooths the path, and explains why Viewnear favors small, well-governed wins over grand, risky bets.", authorTeam: "eduardo-ramos", date: "2025-06-29", keyTakeaways: ["AGI ambitions live or die on data trust, adaptive governance, and delivery speed, not on model size alone.", "Data quality compounds like interest: explainable lineage, portable policies, and continuous insight pay off most when the first AI audit arrives.", "Snowflake's separation of storage and compute lets raw records, governed views, and intelligent agents coexist without data hops.", "Executives win by budgeting for data quality, sponsoring focused pilots with clear metrics, and evolving governance in real time.", "Start with one high-frequency decision, rebuild it on Snowflake's native AI layer, and publish accuracy and cost openly to build momentum."] },
  { slug: "llms-to-ai-agents-snowflake-cortex", seoTitle: "From LLMs to AI Agents on Snowflake", seoDescription: "Why Snowflake Cortex signals a shift from prompting LLMs to running AI agents against governed enterprise data.", coverImage: "/assets/images/blog/llms-to-ai-agents-snowflake-cortex.jpg", title: "From LLMs to AI Agents: Why Snowflake Cortex Signals a New Era for Enterprise AI", excerpt: "As business leaders, we have all seen the hype around large language models. But the shift to AI agents, powered by Snowflake Cortex, is where the real business value begins.", authorTeam: "eduardo-ramos", date: "2025-09-24", keyTakeaways: ["LLMs are passive; they answer questions but do not make decisions or take action. AI agents sense, reason, plan, act, and feed results back into the next iteration, behaving more like digital coworkers than tools.", "Data agents are the most impactful category, blending structured and unstructured data into reliable insights with accuracy, efficiency, and governance built in.", "Snowflake Cortex has moved fast: multimodal support arrived in April 2025 and Cortex AISQL in June 2025, making AI more about business outcomes than technical skill.", "Governance and security must be built in from day one, which is what lets leaders move from experiments to production without compromising trust.", "The gap between companies that experiment with agentic AI and those that operationalize it is widening, and early adopters will move faster and outpace their competition."] },
  { slug: "viewnear-snowflake-openflow-data-workflows", seoTitle: "Building Data Workflows with Openflow", seoDescription: "How Viewnear uses Snowflake Openflow to build ingestion and data workflows that hold up in production.", coverImage: "/assets/images/blog/viewnear-snowflake-openflow-data-workflows.jpg", title: "How Viewnear Is Using Snowflake Openflow to Build the Next Generation of Data Workflows", excerpt: "Snowflake Openflow, powered by Apache NiFi, gives Viewnear the control, flexibility, and speed to move and prepare data for analytics and AI. It blends visual workflow design with modern engineering standards so our teams build scalable, governed pipelines faster than ever.", authorTeam: "eduardo-ramos", date: "2025-10-09", keyTakeaways: ["Snowflake Openflow is a fully managed ingestion and orchestration service, built on Apache NiFi, that lets teams design, deploy, and observe pipelines directly in Snowflake.", "Its split architecture (a Snowflake-managed control plane and a deployable data plane on BYOC or Snowpark Container Services) handles structured, semi-structured, streaming, and unstructured data with dozens of connectors.", "Viewnear treats data workflows like code: Git-based version control, CI/CD automation, integrated monitoring, and consistent environments across development, testing, and production.", "Pairing NiFi visual design with Git-driven discipline lets multiple engineers collaborate in parallel, track changes, and roll back safely.", "As AI workloads grow, ETL is returning to curate and enrich data before it reaches the warehouse, and Openflow brings that into the modern era across streaming, batch, and unstructured ingestion."] },
  { slug: "center-of-software-work-moving-data-ai", seoTitle: "The Center of Software Work Is Moving", seoDescription: "Software work is shifting toward data and AI. What that changes about teams, budgets, and where value gets created.", coverImage: "/assets/images/blog/center-of-software-work-moving-data-ai.jpg", title: "The Center of Software Work Is Moving, and Data + AI Make It Obvious", excerpt: "As AI and agents take over more of the mechanical implementation work, the middle of building software gets thinner. The real leverage shifts to intent, context, definitions, and ownership, because fast execution without clarity just creates fast mistakes.", authorTeam: "eduardo-ramos", date: "2026-01-13", keyTakeaways: ["The middle of software work, manually translating intent into implementation, is thinning as agents produce working code and transformations from goals and context.", "What needs to be built remains the hardest question; agents act directly on what they are given, so ambiguity becomes a multiplier.", "Design is about clarity of intent, not artifacts, and that clarity now drives execution rather than just planning.", "Agents become dramatically more effective in context-rich environments where feedback, data sources, entities, and outcomes are clearly connected.", "When execution is cheap, the cost moves to verification, governance, and shipping changes without breaking meaning."] },
  { slug: "separation-with-purpose-apps-analytics", seoTitle: "Keeping Apps Fast, Analytics Scalable", seoDescription: "Why modern teams separate transactional apps from analytics, and how to do it without losing one source of truth.", coverImage: "/assets/images/blog/separation-with-purpose-apps-analytics.jpg", title: "Separation With Purpose: How Modern Teams Keep Apps Fast and Analytics Scalable", excerpt: "PostgreSQL and Snowflake were built for different kinds of work. With Snowflake Postgres, teams can now run transactional and analytical workloads in the same data cloud, without blurring responsibilities or sacrificing performance.", authorTeam: "eduardo-ramos", date: "2026-01-22", keyTakeaways: ["Most data problems come from unclear boundaries between systems, not from bad technology.", "PostgreSQL is optimized for fast, reliable transactions, while Snowflake is built to analyze large volumes of data at scale.", "Snowflake Postgres lets teams run PostgreSQL workloads inside Snowflake while keeping transactional and analytical work separate.", "Operational data lives close to the analytical layer, yet transactional workloads stay isolated from analytical compute.", "The biggest benefit is organizational: with clear responsibilities, teams focus on outcomes instead of negotiating around risk."] },
  { slug: "from-hours-to-outcomes-ai-economics-services", seoTitle: "From Hours to Outcomes: AI Economics", seoDescription: "AI changed the economics of professional services. Why outcome-based delivery is replacing the billable hour.", coverImage: "/assets/images/blog/from-hours-to-outcomes-ai-economics-services.jpg", title: "From Hours to Outcomes: How AI Changed the Economics of Services", excerpt: "At Viewnear, we do not sell hours or headcount. We design outcomes. As a pure-play Snowflake partner, we see clearly that AI has shifted where value is created, moving expertise upstream into steering solutions, orchestrating agents, and owning results.", authorTeam: "eduardo-ramos", date: "2026-02-03", keyTakeaways: ["Hourly pricing aligned with a world where value was created through manual execution; AI has broken that link by automating much of the mechanical work.", "Expertise has not eroded, it has moved upstream from manual execution to design, oversight, and orchestration.", "Snowflake makes outcomes measurable in near real time, which is exactly why time-based pricing breaks down so quickly on the platform.", "Viewnear operates a flex-capacity model: define the outcome first, then design delivery backwards with the right mix of human roles and AI agents.", "Outcome-based services are not cheaper; they demand more senior expertise, clear success criteria, and accountability that sits with the provider."] },
  { slug: "snowflake-foundation-for-data-intelligence", seoTitle: "Snowflake as a Data Intelligence Layer", seoDescription: "How Snowflake moved from a constrained warehouse to the foundation for data intelligence across the business.", coverImage: "/assets/images/blog/snowflake-foundation-for-data-intelligence.jpg", title: "From Constrained to Everywhere: Snowflake as the Foundation for Data Intelligence", excerpt: "Snowflake changed the economics of data, turning what was once constrained, slow, and gated into something elastic, governed, and accessible across the enterprise. As AI collapses the distance between questions and answers, Snowflake becomes the place where you talk to your data and move from insight to action faster than ever.", authorTeam: "eduardo-ramos", date: "2026-02-07", keyTakeaways: ["Snowflake changed the economics of data: decoupled storage and compute, elastic scale, and native sharing turned data use from constrained to everywhere.", "The real value of Snowflake is as a distribution layer for governed enterprise data, where domains intersect on a single source of truth without copying or friction.", "AI only works when grounded in governed, high-quality data, so intelligence runs directly on the system of record rather than on shadow copies.", "With Snowflake CoWork powered by Cortex AI, natural language becomes a first-class interface to governed data without bypassing governance.", "The shift is from better analytics to operational intelligence embedded in daily workflows, with Snowflake as the execution layer."] },
];

export const jobOpenings = [
  {
    slug: "senior-data-ai-engineer",
    title: "Senior Data & AI Engineer",
    employment: "Full-time",
    location: "Remote (Americas)",
    description: "Design, build, and scale modern data and AI solutions on Snowflake, turning complex business operations into trusted, production-ready systems.",
    skills: ["Snowflake", "SQL", "Python", "Snowpark", "Cortex", "RAG & LLMs", "dbt", "Data modeling"],
    order: 1,
    body: `## About the role

At Viewnear, we help enterprises stand up two capabilities they keep: a data practice their teams trust and an AI practice that ships use cases into production, built on Snowflake, run by the client's own team, and guided and accelerated by ours.

We're looking for a Senior Data & AI Engineer who brings strong technical depth, ownership, and execution discipline to the data and AI practices we build with clients.

This role is for someone who knows that great data and AI work is not built through big talk. It is built through clean architecture, reliable pipelines, thoughtful modeling, strong engineering habits, and the willingness to solve complex problems when the path is not perfectly clear.

The role helps design, build, and scale modern data and AI solutions on Snowflake, turning complex business operations into trusted, usable, production-ready systems.

## What the role involves

This engineer leads the design and implementation of governed data foundations, pipelines, data models, and AI-ready architectures using Snowflake as the core cloud data platform.

The work runs close to business, analytics, engineering, and leadership teams: understanding operational challenges, translating them into technical requirements, and delivering solutions that create measurable business value.

It also means bringing AI use cases from concept to production: preparing trusted data, building scalable integration patterns, and supporting solutions such as LLM applications, RAG architectures, semantic search, automation workflows, and AI-powered analytics.

This is a hands-on role: writing SQL and Python, designing data models, building ELT pipelines, reviewing technical designs, troubleshooting performance issues, documenting decisions, and mentoring others on the team.

## What we're looking for

Strong experience across:

- Snowflake architecture, development, performance tuning, cost optimization, and security
- Data engineering with SQL, Python, Snowpark, Snowflake Cortex, Tasks, Streams, Dynamic Tables, and Stored Procedures
- ELT pipeline design, data modeling, dimensional modeling, semantic layers, and analytics engineering
- Data integration patterns using APIs, files, external stages, cloud storage, and orchestration tools
- AI and ML enablement: trusted data pipelines, vector search, RAG patterns, LLM integrations, and production AI workflows
- Building production-grade systems with testing, monitoring, governance, access control, documentation, and cost awareness
- Working directly with business stakeholders to clarify needs and turn them into practical technical solutions
- Leading technical conversations without ego and raising the quality bar for the team

Experience with dbt, Airflow, Coalesce, Azure, AWS, or GCP is a plus.

## The kind of person who succeeds here

The people who thrive here are the ones who keep showing up.

They take ownership of messy source systems, unclear requirements, broken pipelines, performance bottlenecks, and ambitious goals, then work through them with patience and precision.

They do not need everything to be perfect before starting. They know how to ask the right questions, make smart tradeoffs, and move the work forward.

They care about clean architecture, but they care just as much about getting useful solutions into people's hands. They understand that trust in data is earned one correct number, one reliable pipeline, and one well-built solution at a time.

They bring technical depth, and just as much humility. They help others get better. They make the team stronger.

## What success looks like

Success means our clients trust their data, AI use cases move beyond demos, pipelines run reliably, and business teams make faster, better decisions.

This role helps build the governed foundation on Snowflake that turns ambitious ideas into real systems. We're looking for someone ready to do the work, carry responsibility, and help the team win.`,
  },
];

// Flat list with a `category` for grouping on /faq; home & services read q/a only.
export const faqs = [
  { category: "Partnership & certifications", q: "What is a Snowflake Premier Partner, and how can that status be verified?", a: "Viewnear is a Snowflake Premier Partner and a Snowflake CoCo Preferred Partner, with SnowPro-certified engineers and a verified delivery track record across the Americas." },
  { category: "Partnership & certifications", q: "What does Premier status actually unlock?", a: "Depth and a direct line to Snowflake. Premier status reflects certified delivery across the full Snowflake stack, and it means we work hand in hand with Snowflake itself: aligned with the client's Snowflake account team on architecture and delivery, with early visibility into new capabilities (Cortex, Openflow, Horizon Catalog, CoCo, and CoWork). We partner with Snowflake to carry each project to a successful outcome." },
  { category: "Partnership & certifications", q: "How does Snowflake pricing work, and can it be bought through a partner?", a: "Snowflake is consumption-based: the business pays for the compute (credits) and storage it actually uses, so run cost flexes with the work. Snowflake capacity can be procured through Viewnear for simpler commercial terms and account management under one accountable partner." },
  { category: "Delivery & engagements", q: "How long does a Snowflake implementation take?", a: "A typical first production build runs 8–16 weeks, depending on data volume, source complexity, and the use cases in scope. What keeps that real: a discovery that fixes scope up front, use-case-driven sprints with working software at every demo, and proof running in parallel with the build, so value shows from sprint one." },
  { category: "Delivery & engagements", q: "How can a large Snowflake engagement be de-risked?", a: "We prove the approach with a focused proof of concept before we scale, run regular steering reviews with clear decision gates, and build enablement in from day one, so in-house teams can run and extend the work without us." },
  { category: "Delivery & engagements", q: "Can an existing data warehouse be migrated to Snowflake?", a: "Yes. Migration is one of our most common engagements (Teradata, Oracle, Hadoop, SQL Server). We manage the full technical delivery and program governance." },
  { category: "Delivery & engagements", q: "Can Snowflake be integrated with ERP, CRM, and operational systems?", a: "Yes, in both directions. Openflow and Zero-Copy Integrations bring data in from systems like SAP, Salesforce, and Workday, and we deliver insight back out through Snowsight, Streamlit apps, APIs, and agents embedded where teams work." },
  { category: "Nearshore & the delivery team", q: "Where are nearshore Snowflake delivery teams based?", a: "Our nearshore delivery center is in Monterrey, Nuevo León, Mexico, with leadership in Austin, Texas. Engineers, architects, and strategists all work from those two offices, and we serve clients across the Americas: Canada, the United States, Mexico, LATAM, and the Caribbean." },
  { category: "Nearshore & the delivery team", q: "What time zone does the nearshore team work in?", a: "Monterrey holds Central Standard Time (CST) all year, because Mexico no longer observes daylight saving time. US Central switches to CDT from March to November, so in those months the Monterrey clock reads an hour earlier than yours. The team works your business hours either way, so the working day overlaps end to end and questions get answered the same day instead of overnight." },
  { category: "Nearshore & the delivery team", q: "How far is Monterrey from the United States, and can the team work onsite?", a: "Monterrey is about 140 miles from the Texas border, with nonstop flights to major US cities in one to four hours. That makes onsite work practical rather than ceremonial: discovery workshops, architecture sessions, and steering reviews can happen in your office without a two-day trip on either side." },
  { category: "Nearshore & the delivery team", q: "Can we visit the Monterrey delivery center?", a: "Yes. Clients are welcome at our Monterrey office, and visits are common at the start of an engagement: meet the engineers who will build the work, walk the architecture on a whiteboard, and see how the team runs day to day." },
  { category: "Nearshore & the delivery team", q: "How is nearshore different from offshore for a data and AI build?", a: "Snowflake and AI work is iterative: profile the data, model it, test a use case, look at the result, adjust. That loop is fast when a blocker raised at 10am is resolved by lunch, and painful when every round trip waits overnight. Nearshore keeps that loop inside a single working day, with live pairing and sprint reviews your team can actually attend. Offshore can still win on pure rate card; it rarely wins on time to a working result." },
  { category: "Nearshore & the delivery team", q: "Does the team work in English or Spanish?", a: "Both. Every engineer is English-proficient and the team is fully bilingual, so working sessions, documentation, and enablement run in whichever language your team thinks in. There is no translation layer between you and the people doing the work." },
  { category: "Commercials", q: "What engagement models are available?", a: "Three, and they can be combined: fixed-outcome delivery priced to a defined result, flex capacity when the scope keeps moving, and an embedded or dedicated team that works inside your sprints, repos, and standards. Team extension and staff augmentation buyers usually land on the embedded model. All three are measured on outcomes rather than hours." },
  { category: "Security & platform", q: "Does the work stay inside our environment and under our controls?", a: "Yes. The build runs in the client's Snowflake account, repositories, and CI, under the client's access controls and change process. Engineers work as named identities with least-privilege access, under signed confidentiality terms, and Horizon Catalog lineage keeps an audit trail of what changed." },
  { category: "Commercials", q: "How is an engagement priced?", a: "Engagements are scoped on data volume and complexity, the number of analytics/AI use cases, team size, and timeline. We agree scope and price up front and offer fixed-outcome, flex-capacity, and embedded-team models: a partner measured on outcomes, not hours." },
  { category: "Commercials", q: "Do Snowflake partners publish standard pricing?", a: "No. No two data estates are the same, so we price to the work. Share the goals and constraints, and we'll come back with a model, a plan, and a price." },
  { category: "Security & platform", q: "How is data kept secure during a Snowflake engagement?", a: "We build on Snowflake's certified platform and extend it with least-privilege access, Horizon Catalog lineage and PII classification, Horizon Context so every person and AI agent works from the same trusted business context, data residency by region, and audit-ready controls, all configured to the client's sector." },
  { category: "Security & platform", q: "Should a Snowflake build stay native, or add third-party tools?", a: "We lead with the Snowflake-native stack (Openflow, Snowpark, Horizon Catalog, Cortex, Snowsight, Streamlit, plus the Snowflake CoCo coding agent and CoWork AI agent) so governance and AI context (Horizon Context) stay in one place. dbt is the one external framework we run, natively against Snowflake." },
  { category: "Contracting & vendor review", q: "What agreements govern a Viewnear data and AI engagement?", a: "A separate written agreement governs every Viewnear engagement and sets out scope, fees, timelines, and obligations; where it conflicts with the website terms, the engagement agreement prevails. Fixed-cost work is documented as a scoped statement of work with milestones, decision gates, and change control if scope moves, while time and materials work runs against a prioritized backlog the business controls. A short discovery fixes scope and returns a firm price before a build is committed, and engineers work under signed confidentiality terms." },
  { category: "Contracting & vendor review", q: "How does Viewnear handle a vendor security review or security questionnaire?", a: "Viewnear answers a vendor security review by walking through how each requirement is met, whether that is a single item such as data residency, certifications, or audit, or a full questionnaire. The published starting point is Viewnear's Security and Trust page, which splits the answer in two: the environment inherits Snowflake's independently audited certifications (SOC 2 Type II, ISO 27001, HIPAA, PCI DSS), and Viewnear applies its own delivery controls on every engagement. Those controls are least-privilege access, lineage and auditability, PII classification, data residency by region, secrets and key management, and secure delivery practices, which mean code review, least-privilege delivery accounts, and environment separation." },
  { category: "Contracting & vendor review", q: "Does data leave the client's region when Snowflake delivery happens from Mexico?", a: "Data stays in the client's own Snowflake account, in the Snowflake region the client's policy requires: Viewnear deploys in the Snowflake region required across the Americas, and nothing about the delivery model requires data to be copied out of it. Engineers based in Monterrey, Nuevo León and in Austin, Texas reach that account as named identities with least-privilege access, under the client's access controls and change process. Horizon Catalog lineage and access history log every access, and sensitive data is classified and masked with tagging and row and column policies from the first table." },
  { category: "Contracting & vendor review", q: "What happens at the end of a Viewnear engagement?", a: "A Viewnear engagement ends on a documented handover: runbooks, documentation, and enablement sessions ship with the build, plus a transition plan that names who runs what once Viewnear steps back. The work already sits in the client's own Snowflake account, repositories, and CI, so the in-house team runs and extends it from there. Ongoing optimization, cost tuning, and support stay available for teams that want them." },
  { category: "Nearshore & the delivery team", q: "How much of the US working day does the Monterrey delivery team overlap?", a: "Viewnear's Monterrey team overlaps US Central, Eastern, and Mountain business hours in full, because the team works the client's business hours rather than local ones. Standups, sprint reviews, and steering meetings all sit inside the client's working day, so a blocker raised in the morning gets an answer that day instead of clearing overnight. Monterrey holds Central Standard Time year round, an hour behind US Central from March to November, and the working schedule absorbs the difference." },
  { category: "Nearshore & the delivery team", q: "How are the usual offshore risks handled in a nearshore engagement?", a: "Viewnear answers offshore risk with three mechanisms, not assurances. Continuity: one committed team carries the work from scope to run, with no re-staffing mid-engagement and no delivery pyramid billed by the hour, and the SnowPro-certified people who scope the work are the people who build it. Visibility: regular working sessions, a shared backlog, and clear decision gates keep scope, budget, and priorities with the client's sponsors. Control: the build runs in the client's own Snowflake account, repositories, and CI, under access the client grants and can revoke, with Horizon Catalog lineage keeping an audit trail of what changed." }
];
