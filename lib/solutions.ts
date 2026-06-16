// The four Snowflake-native solution pillars. Single source of truth for the
// /solutions hub, the /solutions/[slug] landing pages, the nav, and JSON-LD.
// Pure data (no JSX) so it stays reusable; pages render the title with the
// `titleAccent` span gradiented.

export type SolutionItem = { title: string; body: string };
export type SolutionStep = { step: string; body: string };

export type Solution = {
  slug: string;
  eyebrow: string; // short tag (nav + chips)
  name: string; // short name (cards + nav)
  titleLead: string; // page H1, plain part
  titleAccent: string; // page H1, gradient part
  summary: string; // hub card + hero description
  body: string; // intro / outcome paragraph on the detail page
  whoFor: string; // who it is for
  included: SolutionItem[]; // "what's included"
  approach: SolutionStep[]; // how we approach it
  image: string;
  cta: { label: string; href: string };
  seoTitle: string;
  seoDescription: string;
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "migrate",
    eyebrow: "Migrate",
    name: "Migrate to Snowflake",
    titleLead: "Migrate to",
    titleAccent: "Snowflake",
    summary:
      "Move off Teradata, Oracle, Netezza, SQL Server, Hadoop, or a cloud warehouse onto one governed Snowflake foundation, without the risk.",
    body: "Legacy warehouses are costly to run, slow to change, and a weak base for AI. We move you onto Snowflake the low-risk way: automated translation, parity validation before cutover, and Openflow pipelines that keep data fresh from day one. You retire licenses and hardware and land on a governed, Cortex-ready foundation.",
    whoFor:
      "For teams modernizing off Teradata, Oracle, Netezza, SQL Server, Hadoop, or a first-generation cloud warehouse.",
    included: [
      { title: "Automated SQL & schema translation", body: "Translate views, stored procedures, and schemas with SnowConvert, validated at each step." },
      { title: "Parity validation before cutover", body: "Row-level reconciliation so results match the source before you switch over." },
      { title: "Pipelines from day one", body: "Openflow and Snowpipe ingestion with dbt and Snowpark transformation." },
      { title: "Governed and handed over", body: "Documented, secured, and transferred to your team, not left as a black box." },
    ],
    approach: [
      { step: "Assess", body: "Inventory workloads, dependencies, and SLAs, then sequence the migration by value and risk." },
      { step: "Translate", body: "Automated schema and SQL conversion, with edge cases handled by certified architects." },
      { step: "Validate", body: "Run old and new in parallel and reconcile until results match." },
      { step: "Cut over & hand off", body: "Switch consumers, decommission the legacy estate, and transfer ownership." },
    ],
    image: "/assets/images/photos/network.jpg",
    cta: { label: "Plan your migration", href: "/contact" },
    seoTitle: "Migrate to Snowflake: Teradata, Oracle, Hadoop & more",
    seoDescription:
      "Low-risk data migration onto Snowflake from Teradata, Oracle, Netezza, SQL Server, Hadoop, and cloud warehouses, with automated translation and parity validation.",
  },
  {
    slug: "applied-ai",
    eyebrow: "Applied AI",
    name: "Cortex AI & agents",
    titleLead: "Cortex",
    titleAccent: "AI & agents",
    summary:
      "Production AI that runs securely next to your governed data: cited answers from Cortex and Snowflake CoWork, grounded in your Semantic Views.",
    body: "Most AI stalls because it is bolted onto ungoverned data. We deliver AI inside Snowflake, grounded in your Semantic Views, so business users get cited, trustworthy answers and your developers build with Snowflake CoCo, all within your existing security and governance.",
    whoFor: "For teams ready to put AI into production on a governed foundation, not just run another pilot.",
    included: [
      { title: "Cortex AISQL & Analyst", body: "Ask questions over governed semantic models and get cited answers, not hallucinations." },
      { title: "Grounded agents", body: "Agents grounded in Semantic Views and Horizon context, with full audit trails." },
      { title: "CoWork & CoCo", body: "Snowflake CoWork for knowledge workers; Snowflake CoCo for AI development." },
      { title: "Governed by design", body: "AI Agent Identity and access controls so every agent works within your policies." },
    ],
    approach: [
      { step: "Ground the data", body: "Stand up Semantic Views and the business context the model can reason over." },
      { step: "Build the use case", body: "Develop and test the agent or analytic against real, governed data." },
      { step: "Validate", body: "Check citations, accuracy, and access before anything reaches users." },
      { step: "Deploy & monitor", body: "Roll out with audit trails and guardrails, then iterate on real usage." },
    ],
    image: "/assets/images/photos/circuit.jpg",
    cta: { label: "Explore AI use cases", href: "/contact" },
    seoTitle: "Cortex AI & agents on Snowflake: production-ready, governed",
    seoDescription:
      "Put AI into production on Snowflake: Cortex AISQL and Analyst, Snowflake CoWork and CoCo, and governed agents grounded in your Semantic Views.",
  },
  {
    slug: "governance",
    eyebrow: "Governance",
    name: "Data governance & trust",
    titleLead: "Data",
    titleAccent: "governance & trust",
    summary:
      "One governed copy of your data, with lineage, access, and policy enforced in one auditable place: the foundation AI actually needs.",
    body: "AI and analytics are only as trustworthy as the data underneath. We put governance in one place on Snowflake: Horizon Catalog lineage and classification, policy-based access and masking, and residency by region, configured to your sector so you stay audit-ready.",
    whoFor: "For regulated teams in finance, healthcare, and the public sector that need trust, lineage, and audit-readiness.",
    included: [
      { title: "Horizon Catalog", body: "Lineage, access history, and classification across your data estate." },
      { title: "Policy-based access", body: "PII masking, row and column policies, and data residency by region." },
      { title: "Audit-ready", body: "Configured for FINRA, HIPAA, PCI, and your sector's requirements." },
      { title: "Governed agents", body: "AI Agent Identity for verifiable, governed AI on the same foundation." },
    ],
    approach: [
      { step: "Classify", body: "Discover and classify sensitive data and map who needs access to what." },
      { step: "Enforce", body: "Apply masking, row and column policies, and residency in one place." },
      { step: "Audit", body: "Wire lineage and access history for continuous, audit-ready evidence." },
      { step: "Extend to AI", body: "Bring agents under the same identity and access controls." },
    ],
    image: "/assets/images/photos/datacenter.jpg",
    cta: { label: "See Security & Trust", href: "/security" },
    seoTitle: "Data governance & trust on Snowflake: lineage, access, audit",
    seoDescription:
      "Governed data on Snowflake: Horizon Catalog lineage, PII masking, row and column policies, residency by region, and audit-ready controls for regulated sectors.",
  },
  {
    slug: "embedded-analytics",
    eyebrow: "Consumption",
    name: "Embedded analytics & data apps",
    titleLead: "Embedded analytics &",
    titleAccent: "data apps",
    summary:
      "Put insight where people work, on your governed data: Snowsight dashboards, Streamlit apps, and ask-in-plain-language analytics, no shadow BI stack.",
    body: "Insight should live where decisions happen, not in a separate BI tool you have to secure all over again. We build analytics natively in Snowflake and embed it into your products and client portals, governed end to end, so there are no exports and no shadow stacks.",
    whoFor: "For product and data teams that want analytics in the product, or self-service without a separate BI stack.",
    included: [
      { title: "Native dashboards & apps", body: "Snowsight dashboards and Streamlit in Snowflake data apps." },
      { title: "Self-service in plain language", body: "Snowflake CoWork for natural-language analytics over governed data." },
      { title: "Embedded in your product", body: "Analytics inside your applications, client portals, and partner interfaces." },
      { title: "Governed end to end", body: "No exports, no shadow stacks; the same governance as your warehouse." },
    ],
    approach: [
      { step: "Model", body: "Shape governed semantic models for the questions users actually ask." },
      { step: "Build", body: "Develop dashboards, Streamlit apps, or embedded views on the data." },
      { step: "Embed", body: "Surface them in the product or portal where users already work." },
      { step: "Adopt", body: "Roll out self-service and retire the manual reporting it replaces." },
    ],
    image: "/assets/images/photos/dashboard.jpg",
    cta: { label: "Talk to our team", href: "/contact" },
    seoTitle: "Embedded analytics & data apps on Snowflake",
    seoDescription:
      "Embedded analytics and data apps native to Snowflake: Snowsight dashboards, Streamlit apps, and natural-language self-service, governed end to end with no shadow BI stack.",
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
