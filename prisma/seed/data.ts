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
      "You've chosen Snowflake. The harder part is what you stand up on it: a data practice that feeds real decisions with numbers people trust, and an AI practice that ships use cases into production. We build both inside your team, then hand you the keys.",
  },
  stats: [
    { label: "Snowflake partner tier", value: "Premier" },
    { label: "Years building data & enterprise AI", value: "15+" },
    { label: "Certified engineers across the team", value: "SnowPro" },
    { label: "Countries across the Americas", value: "5" },
  ],
  partnership: {
    title: "Your Snowflake Premier Partner across the Americas.",
    points: [
      {
        title: "Snowflake Premier Partner",
        body: "Premier status puts SnowPro-certified engineers on your work, with a verified, end-to-end delivery track record across the Americas: from architecture and migration through analytics and AI in production.",
      },
      {
        title: "Snowflake CoCo Preferred Partner",
        body: "As a Snowflake CoCo Preferred Partner, we build with Snowflake CoCo, the coding agent, so your data products and AI use cases ship faster: governed and validated before they reach production.",
      },
      {
        title: "Snowflake procurement, simplified",
        body: "Procure Snowflake directly through Viewnear. It's consumption-based (you pay for the compute and storage you use) and we simplify the capacity commitment, commercial terms, and account management under one trusted partner.",
      },
      {
        title: "End-to-end delivery",
        body: "From architecture and migration to data engineering, analytics, and AI in production, one accountable team carries the work end to end, and your people learn it as we build.",
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
      "Tell us where you are. We will tell you what is possible. The answer might be a strategy session, a proof of concept, or an honest conversation about where your competition already is.",
  },
};

export const services = [
  {
    slug: "ai-data-strategy",
    tier: "THINK",
    title: "Data & AI Strategy",
    summary:
      "Turn AI ambition into a board-ready roadmap: where data and AI create measurable ROI, sequenced by value and grounded in what your data can actually support, on a clear path to the agentic enterprise.",
    tools: [],
    order: 1,
    body: "Invest with confidence and know exactly what to build next. We work with CEOs and CTOs to turn 'we need an AI strategy' into a costed, sequenced roadmap grounded in your current data readiness and focused on the use cases with the clearest return.",
  },
  {
    slug: "cloud-architecture",
    tier: "BUILD",
    title: "Cloud Architecture & Data Foundation",
    summary:
      "The AI-ready foundation: governed, built on Snowflake, and ready to scale, the single source of truth every model and agent depends on.",
    tools: ["Snowflake", "Openflow", "Iceberg"],
    order: 3,
    body: "Give every team one fast, scalable foundation to build on. We design and deliver it cloud-native on Snowflake, sized for the AI workloads you are planning rather than just the reporting you run today, with security and governance built in from the start.",
  },
  {
    slug: "data-engineering",
    tier: "BUILD",
    title: "Data Engineering & Pipelines",
    summary:
      "Always-current, trusted data: governed pipelines that unify every source (ERP, CRM, SaaS, and files) so your analytics and AI run on inputs you can stake decisions on.",
    tools: ["Snowflake", "Openflow", "dbt"],
    order: 4,
    body: "Stop chasing numbers across systems. We build automated, secure pipelines that pull every source (APIs, databases, flat files) into your warehouse reliably and on schedule, so your teams work from data they can trust and your AI workloads have clean, current inputs.",
  },
  {
    slug: "data-visualisation",
    tier: "BUILD",
    title: "AI Analytics & Agents",
    summary:
      "Put governed AI to work: Cortex Analyst and Snowflake CoWork agents that turn your governed data into cited, decision-ready answers, embedded where leaders already work.",
    tools: ["Cortex Analyst", "Snowflake CoWork", "Snowsight", "Streamlit"],
    order: 2,
    body: "Put answers in the hands of the people making decisions. We build the reporting and self-service layer natively in Snowflake: Snowsight dashboards and Streamlit apps for the views teams live in, with Cortex Analyst answering questions over your governed Semantic Views and Snowflake CoWork (the personal AI agent) letting business users explore and act in plain language. Anyone who needs insight can find it themselves: no waiting on the data team, no exporting to spreadsheets.",
  },
  {
    slug: "embedded-analytics",
    tier: "BUILD",
    title: "Embedded Analytics",
    summary:
      "Differentiate your product: Cortex-powered data products embedded into your apps and client workflows, turning insight into a competitive edge.",
    tools: ["Streamlit", "Cortex"],
    order: 5,
    body: "Make analytics a feature your customers pay for. We embed dashboards and reporting directly into your applications, client portals, and partner interfaces, so the insight lives where users already work and your product stands apart from competitors.",
  },
  {
    slug: "capability-development",
    tier: "GROW",
    title: "Capability Development",
    summary:
      "Compound the advantage: we embed with your team and build the in-house fluency to scale your AI use cases long after launch.",
    tools: [],
    order: 6,
    body: "Capability that outlasts the engagement. Our certified practitioners embed alongside your people, coaching through real delivery and building fluency at every level (from executive data literacy to hands-on tool training for analysts and engineers) so your team keeps improving on its own.",
  },
];

export const industries = [
  {
    slug: "construction-real-estate",
    name: "Construction & Real Estate",
    headline: "Every project and every property generates data. Most of it never reaches a decision.",
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
    order: 1,
  },
  {
    slug: "education",
    name: "Education",
    headline: "Institutions are rich in student data and starved of insight.",
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
    order: 2,
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    headline: "Your data is more valuable than your products. Treat it that way.",
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
    order: 3,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    headline: "The factory floor produces data faster than most teams can use it.",
    intro:
      "We connect production, supply-chain, and sensor data into one governed, trusted source so manufacturers can lift OEE, see the whole supply chain, and act on issues before they reach the customer.",
    challenges: [
      { problem: "Machine and ERP data don't connect", response: "We unify shop-floor, sensor, and ERP data into one governed, trusted source." },
      { problem: "Hidden downtime and quality loss", response: "We deliver OEE and quality analytics that expose the real cost drivers." },
      { problem: "Supply-chain blind spots", response: "We give you the whole chain in one view, from supplier to shipment." },
    ],
    deliverables: [
      { title: "OEE & production analytics", description: "Availability, performance, and quality in a single live view." },
      { title: "Supply-chain visibility", description: "Tracking from supplier through to delivery, governed at every step." },
      { title: "IoT & sensor data pipelines", description: "High-volume machine and sensor data, ingested and governed." },
      { title: "Predictive maintenance models", description: "Data foundations for forecasting failures before they happen." },
    ],
    tools: ["Snowflake", "Openflow", "Cortex", "Streamlit"],
    stats: [{ label: "Clients in this industry", value: "7+" }],
    order: 4,
  },
  {
    slug: "media-entertainment-advertising",
    name: "Media, Entertainment & Advertising",
    headline: "Audiences move fast. Your data should move faster.",
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
    order: 5,
  },
  {
    slug: "retail-cpg",
    name: "Retail & CPG",
    headline: "Retail margin is thin. Data-driven decisions are where it's recovered.",
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
    order: 6,
  },
  {
    slug: "technology-telco",
    name: "Technology & Telco",
    headline: "You sit on usage data most companies would envy. Make it work harder.",
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
  clientSlug: string;
  industrySlug: string | null;
  sector: string;
  region: string;
  heroImage?: string;
  title: string;
  summary: string;
  featured: boolean;
  order: number;
  metrics?: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  body?: string;
};

// One case study per industry; ordered to mirror the industries list.
export const caseStudies: CaseStudySeed[] = [
  { slug: "sku-catalog-governance", clientSlug: "corrugated-packaging-manufacturer", heroImage: "/assets/images/cases/sku-catalog-governance-hero.jpg", industrySlug: "manufacturing", sector: "Manufacturing", region: "Mexico", title: "Reining in thousands of runaway SKUs to restore accurate product costs", summary: "A corrugated packaging manufacturer's product catalog exploded into thousands of SKUs and variants with no product architecture, distorting costs and slowing production. Viewnear designed a governed Snowflake foundation: a Medallion warehouse from SAP Business One via Openflow, master-data and SKU governance rules, a Standard SKU catalog, What-if simulation, and a Snowflake CoWork catalog agent over governed Semantic Views.", featured: true, order: 3, metrics: [{ value: "Medallion", label: "Bronze, Silver, Gold warehouse" }, { value: "3–5", label: "Critical catalogs in first wave" }, { value: "What-if", label: "SKU optimization simulation" }, { value: "CoWork", label: "Natural-language catalog agent" }] },
  { slug: "construction-cad-data-foundation", clientSlug: "construction-developer", heroImage: "/assets/images/cases/construction-cad-data-foundation-hero.jpg", industrySlug: "construction-real-estate", sector: "Construction & Real Estate", region: "Mexico", title: "Turning architectural CAD drawings into measurable, decision-ready data", summary: "We unified four disconnected sources, including architectural CAD drawings, into one governed source of truth on Snowflake. Design data locked in the drawings became structured, measurable data alongside construction, finance, and land data, and we delivered Snowflake CoWork agents and Slack bots on top.", featured: true, order: 4, metrics: [{ value: "4", label: "Sources unified, including CAD" }, { value: "CAD", label: "Drawings made measurable as governed data" }, { value: "Agents", label: "Snowflake CoWork + Slack bots" }, { value: "1", label: "Source for programs, projects, and land" }] },
  { slug: "real-time-student-data-pipeline", clientSlug: "university-group-latam", heroImage: "/assets/images/cases/real-time-student-data-pipeline-hero.jpg", industrySlug: "education", sector: "Education", region: "Miami & LATAM", title: "Real-time insight into 20,000+ students across campuses, live in seven weeks", summary: "A group of universities serving 20,000+ students across Miami and Latin America had academic records and LMS learning events siloed across campuses. Viewnear built a governed, real-time student data pipeline on Snowflake: a governed environment, native Blackboard Data Share integration, and real-time Caliper event streaming, unifying academic and learning-activity data into one governed source.", featured: true, order: 1, metrics: [{ value: "20k+", label: "Students across Miami & LATAM" }, { value: "Real-time", label: "Caliper learning events, was batch" }, { value: "2", label: "Core sources unified (Blackboard + Caliper)" }, { value: "7 wks", label: "To a governed, real-time foundation" }] },
  { slug: "insurance-claims-cortex-ai", clientSlug: "insurance-claims-processor", heroImage: "/assets/images/cases/insurance-claims-cortex-ai-hero.jpg", industrySlug: "financial-services", sector: "Insurance", region: "Americas", title: "From hand-sorted documents to 95% accurate claims classification in seconds", summary: "A claims processing company was sorting documents from many insurance providers by hand, causing delays, errors, and lost files. Using Snowflake Cortex AI functions like AI_EXTRACT, Viewnear automated classification and data extraction, lifting accuracy from 60% to 95% and cutting per-document handling to four seconds.", featured: true, order: 0, metrics: [{ value: "60→95%", label: "Classification accuracy" }, { value: "4 sec", label: "Per-document classification" }, { value: "40%", label: "Discarded documents recovered" }, { value: "88%", label: "Fewer classification errors" }] },
  { slug: "corporate-mdm-golden-record", clientSlug: "commercial-vehicle-dealer-group", heroImage: "/assets/images/cases/corporate-mdm-golden-record-hero.jpg", industrySlug: "retail-cpg", sector: "Automotive", region: "Mexico", title: "One trusted golden record across eight business domains", summary: "A commercial-vehicle dealer group ran sales, service, parts, and the back office on separate systems, with no single version of a customer, vehicle, part, or supplier. Viewnear built a corporate master data foundation on Snowflake: a progressive multi-source golden record across eight business domains, using a Medallion architecture, Openflow ingestion, dbt transformations, and per-domain Snowflake CoWork agents.", featured: true, order: 2, metrics: [{ value: "3", label: "Source systems unified" }, { value: "8", label: "Business domains mastered" }, { value: "Medallion", label: "Bronze, Silver, Gold" }, { value: "12 mo", label: "Phased, three releases" }] },
];

export const team = [
  { slug: "jc-rodriguez", name: "JC Rodriguez", title: "Head of Service Delivery", photo: "/assets/images/team/jc-rodriguez.png", linkedinUrl: "https://www.linkedin.com/in/jcrodriguezmiranda/", order: 1 },
  { slug: "rene-trevino", name: "René Treviño", title: "Head of Document Intelligence", photo: "/assets/images/team/rene-trevino.png", linkedinUrl: "https://www.linkedin.com/in/reneramosdev/", order: 2 },
  { slug: "carlos-egremy", name: "Carlos Egremy", title: "Head of Operations", photo: "/assets/images/team/carlos-egremy.png", linkedinUrl: "https://www.linkedin.com/in/carlosegremy/", order: 3 },
  { slug: "karen-berber", name: "Karen Berber", title: "Head of People & HR", photo: "/assets/images/team/karen-berber.png", linkedinUrl: "https://www.linkedin.com/in/karen-b-b0542a137/", order: 4 },
  { slug: "aydhe-mota", name: "Aydhé Mota", title: "Head of Finance", photo: "/assets/images/team/aydhe-mota.png", linkedinUrl: "https://www.linkedin.com/in/aydhemota/", order: 5 },
  { slug: "eduardo-ramos", name: "Eduardo Javier Ramos", title: "CEO", photo: "/assets/images/team/eduardo-ramos.png", linkedinUrl: "https://www.linkedin.com/in/eduardojramos/", order: 6 },
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
  { slug: "snowflake-control-plane-agentic-enterprise", coverImage: "/assets/images/blog/snowflake-control-plane-agentic-enterprise.jpg", title: "Snowflake Is Now the Control Plane for the Agentic Enterprise", excerpt: "Snowflake began as a data platform, but the rise of agentic AI demands a governed control plane that unifies trusted data, business context, model choice, security, and workflows. This piece explains why Snowflake is positioning itself as that operating layer for the agentic enterprise.", authorTeam: "eduardo-ramos", date: "2026-06-13", keyTakeaways: ["The agentic enterprise needs a control plane that coordinates data, context, models, agents, governance, and action.", "Governed enterprise data is the foundation agentic AI must start from, not the agents themselves.", "Business context, definitions, metrics, and semantic models are what let agents reason correctly and consistently.", "Agentic governance shifts from who can see what to what agents are allowed to do and execute.", "Snowflake is evolving from data warehouse to AI operating layer, positioning itself as the control plane for enterprise AI."] },
  { slug: "ai-assistant-understands-your-data", coverImage: "/assets/images/blog/ai-assistant-understands-your-data.jpg", title: "The AI Assistant That Actually Understands Your Data (And Why That Matters)", excerpt: "Snowflake Cortex Agents are not just another chatbot feature. After implementing them across multiple client environments, I have seen how they are transforming the way business users interact with data, and it is more profound than I initially expected.", authorTeam: "eduardo-ramos", date: "2025-04-19", keyTakeaways: ["Cortex Agents work inside the data platform, so they query live data and inherit your existing permissions and governance automatically.", "Customer service is the best place to start because the value is immediate: agents give reps a customer's full history and institutional memory from past cases.", "Data preparation is about business context, not heavy engineering: readable field names, meaningful categories, and documented business rules.", "Security and cost behave like the rest of Snowflake, with row-level security, masking, shared audit trails, and transparent consumption-based pricing.", "The biggest hurdle is usually organizational, so begin with high-value use cases, limited scope, and training focused on conversation techniques."] },
  { slug: "data-warehouse-revolution-five-years", coverImage: "/assets/images/blog/data-warehouse-revolution-five-years.jpg", title: "The Data Warehouse Transformation I've Been Watching Unfold for Five Years", excerpt: "When I started recommending Snowflake to clients, many were skeptical about cloud data warehousing. Today, those same organizations cannot imagine going back to traditional systems, and here is why this transformation matters.", authorTeam: "rene-trevino", date: "2025-04-26", keyTakeaways: ["Cloud-native platforms remove the storage and compute constraints that shaped traditional data warehouse design, changing the questions teams ask about their data.", "Separating compute and storage is the key insight: each scales independently, and multi-cluster architecture keeps workloads from interfering with one another.", "Near-maintenance-free operations, instant scaling, and live data sharing let teams focus on business problems instead of administrative overhead.", "Consumption-based pricing aligns cost with actual usage, but it requires new monitoring habits to avoid surprises during development and testing.", "Start with a focused, high-value proof of concept that showcases new capabilities rather than attempting a complete migration up front."] },
  { slug: "bi-integration-challenge-power-bi-tableau-snowflake", coverImage: "/assets/images/blog/bi-integration-challenge-power-bi-tableau-snowflake.jpg", title: "The Integration Challenge Every BI Team Faces (And How We Solve It)", excerpt: "Connecting Snowflake to your favorite BI tools should not feel like rocket science. After dozens of implementations, here are the patterns that work and the pitfalls that waste time.", authorTeam: "eduardo-ramos", date: "2025-05-03", keyTakeaways: ["Use service accounts with key pair authentication and dedicated warehouses per tool to keep performance predictable and costs clear.", "Choose DirectQuery or live connections for large, changing data and import or extracts for smaller, stable data, and combine them in a hybrid model.", "Implement security once in Snowflake with row-level policies and secure views so every BI tool inherits the same governance.", "Aggressive auto-suspend plus multi-cluster auto-scaling controls cost without hurting the user experience.", "Design integrations for flexibility and governance rather than optimizing for any single tool or use case."] },
  { slug: "why-snowflake-ai-strategy-matters", coverImage: "/assets/images/blog/why-snowflake-ai-strategy-matters.jpg", title: "Why Every Data Team Should Pay Attention to Snowflake's AI Strategy", excerpt: "From a front-row seat watching Snowflake's AI evolution, this is not just another vendor adding ML features. It is a fundamental shift that will change how we build and deploy AI applications.", authorTeam: "rene-trevino", date: "2025-05-10", keyTakeaways: ["Bringing AI into the data cloud removes the barrier between data storage and AI processing, so you can analyze text and run models where your data already lives.", "Cortex functions let you blend traditional analytics with AI insights in a single query, from sentiment analysis to document extraction to forecasting.", "Because AI runs inside the platform, existing access controls, audit trails, and governance policies apply automatically with no extra configuration.", "Consumption-based pricing means AI costs scale with usage, and the same monitoring and optimization habits you use for queries apply to AI workloads.", "Start with focused, high-value use cases, augment human judgment rather than replace it, and plan for iterative improvement as capabilities evolve."] },
  { slug: "zero-copy-cloning-snowflake", coverImage: "/assets/images/blog/zero-copy-cloning-snowflake.jpg", title: "Understanding Zero-Copy Cloning: Snowflake's Most Underutilized Feature", excerpt: "Zero-copy cloning sounds too good to be true until you understand the mechanics. Here is how this feature works and why it should be part of every data team's toolkit.", authorTeam: "rene-trevino", date: "2025-05-17", keyTakeaways: ["Zero-copy cloning creates instant, fully functional database copies by sharing underlying data files, so cloning a 100TB database takes the same time as cloning a 100GB one.", "Storage costs start at zero and grow only as the clone and original diverge through updates, making cloning practical for everyday development, testing, and analysis.", "Clones inherit the security, masking, and access controls of the source, so governance applies automatically without extra configuration.", "Pair clones with descriptive naming, lifecycle policies, and storage monitoring to avoid forgotten long-running clones that quietly accumulate cost.", "Use cases span development environments, A/B testing, point-in-time reporting, migration rehearsals, disaster recovery testing, and isolated support investigations."] },
  { slug: "snowflake-compute-storage-architecture", coverImage: "/assets/images/blog/snowflake-compute-storage-architecture.jpg", title: "Why Snowflake's Compute-Storage Architecture Actually Matters for Your Data Strategy", excerpt: "Understanding Snowflake's architectural decisions is not just technical curiosity. It is the foundation for optimizing performance, controlling costs, and building scalable data solutions.", authorTeam: "eduardo-ramos", date: "2025-05-24", keyTakeaways: ["Separating compute and storage lets you scale each independently, so you pay for what you actually use instead of provisioning for peak capacity around the clock.", "Multi-cluster and resource isolation keep different workloads (ETL, user queries, development) from interfering with each other while giving you clear cost visibility.", "Optimization shifts from index tuning and physical storage layouts to data organization, clustering keys, materialized views, and result caching.", "Resource monitors, auto-suspend, and right-sizing turn cost control into a predictable, automated discipline.", "Architectural separation is what makes instant scaling, zero-copy cloning, and secure data sharing economically feasible."] },
  { slug: "snowflake-summit-2025-takeaways", coverImage: "/assets/images/blog/snowflake-summit-2025-takeaways.jpg", title: "Just Back from Snowflake Summit 2025: What Stood Out, What Got Us Thinking, and What's Next", excerpt: "We just returned from Snowflake Summit 2025 in San Francisco, and beyond a roadmap full of exciting updates, what stood out were the thoughtful conversations, the clear direction the platform is heading, and how those shifts align with the way we help clients build smarter, faster, and more future-ready data solutions.", authorTeam: "eduardo-ramos", date: "2025-06-06", keyTakeaways: ["Snowflake CoWork brings natural language querying built on governed, secure, role-aware data, but real impact depends on pairing it with the right data models and use cases.", "Cortex AISQL applies generative AI directly inside SQL, summarizing, analyzing, and classifying unstructured data without moving anything out of Snowflake.", "Adaptive Compute, Gen 2 Warehouses, and stronger security defaults (passkeys, MFA, leaked-credential monitoring) free up time for strategic design over manual tuning.", "Native dbt Projects in Snowsight tighten the analytics engineering loop, and Openflow (via the Datavolo acquisition) points toward richer in-platform data movement.", "Viewnear is already acting: Cortex AISQL pilots, updated architecture baselines for Gen 2, and scoping Snowflake CoWork inside client orgs."] },
  { slug: "snowflake-cortex-aisql-first-look", coverImage: "/assets/images/blog/snowflake-cortex-aisql-first-look.jpg", title: "From SQL to Gen-AI: A First Look at Snowflake Cortex AISQL", excerpt: "Snowflake's new Cortex AISQL functions let you run large language model tasks such as classification, extraction, translation, and even image Q&A directly in SQL. Here is what it means for data teams, how it works in practice, and where we at Viewnear see the biggest opportunities.", authorTeam: "eduardo-ramos", date: "2025-06-21", keyTakeaways: ["Cortex AISQL embeds state-of-the-art LLMs directly inside the Snowflake engine, so there is no extra AI infrastructure to stand up and your data never leaves the platform.", "Analysts can prototype LLM workflows with nothing more than a SELECT statement, classifying sentiment, extracting fields, and answering questions about images in a single query.", "Pairing PARSE_DOCUMENT with AI_COMPLETE handles PDFs and mobile photos in one pipeline, which is ideal for mortgage and insurance use cases.", "Existing roles, masking policies, and row-level security still apply, and credits scale with input tokens and the chosen model, so prototype small and track usage.", "The hosting question is largely solved; the real decision is now which business problem to tackle first."] },
  { slug: "agi-ready-data-cloud", coverImage: "/assets/images/blog/agi-ready-data-cloud.jpg", title: "Quiet Steps Toward an AGI-Ready Data Cloud", excerpt: "Artificial general intelligence no longer feels like science fiction, but even the smartest models will stumble without disciplined, trustworthy data. This article outlines the mindset shifts business leaders need, shows how Snowflake quietly smooths the path, and explains why Viewnear favors small, well-governed wins over grand, risky bets.", authorTeam: "eduardo-ramos", date: "2025-06-29", keyTakeaways: ["AGI ambitions live or die on data trust, adaptive governance, and delivery speed, not on model size alone.", "Data quality compounds like interest: explainable lineage, portable policies, and continuous insight pay off most when the first AI audit arrives.", "Snowflake's separation of storage and compute lets raw records, governed views, and intelligent agents coexist without data hops.", "Executives win by budgeting for data quality, sponsoring focused pilots with clear metrics, and evolving governance in real time.", "Start with one high-frequency decision, rebuild it on Snowflake's native AI layer, and publish accuracy and cost openly to build momentum."] },
  { slug: "llms-to-ai-agents-snowflake-cortex", coverImage: "/assets/images/blog/llms-to-ai-agents-snowflake-cortex.jpg", title: "From LLMs to AI Agents: Why Snowflake Cortex Signals a New Era for Enterprise AI", excerpt: "As business leaders, we have all seen the hype around large language models. But the shift to AI agents, powered by Snowflake Cortex, is where the real business value begins.", authorTeam: "eduardo-ramos", date: "2025-09-24", keyTakeaways: ["LLMs are passive; they answer questions but do not make decisions or take action. AI agents sense, reason, plan, act, and learn, behaving more like digital coworkers than tools.", "Data agents are the most impactful category, blending structured and unstructured data into reliable insights with accuracy, efficiency, and governance built in.", "Snowflake Cortex has moved fast: multimodal support arrived in April 2025 and Cortex AISQL in June 2025, making AI more about business outcomes than technical skill.", "Governance and security must be built in from day one, which is what lets leaders move from experiments to production without compromising trust.", "The gap between companies that experiment with agentic AI and those that operationalize it is widening, and early adopters will move faster and outpace their competition."] },
  { slug: "viewnear-snowflake-openflow-data-workflows", coverImage: "/assets/images/blog/viewnear-snowflake-openflow-data-workflows.jpg", title: "How Viewnear Is Using Snowflake Openflow to Build the Next Generation of Data Workflows", excerpt: "Snowflake Openflow, powered by Apache NiFi, gives Viewnear the control, flexibility, and speed to move and prepare data for analytics and AI. It blends visual workflow design with modern engineering standards so our teams build scalable, governed pipelines faster than ever.", authorTeam: "eduardo-ramos", date: "2025-10-09", keyTakeaways: ["Snowflake Openflow is a fully managed ingestion and orchestration service, built on Apache NiFi, that lets teams design, deploy, and observe pipelines directly in Snowflake.", "Its split architecture (a Snowflake-managed control plane and a deployable data plane on BYOC or Snowpark Container Services) handles structured, semi-structured, streaming, and unstructured data with dozens of connectors.", "Viewnear treats data workflows like code: Git-based version control, CI/CD automation, integrated monitoring, and consistent environments across development, testing, and production.", "Pairing NiFi visual design with Git-driven discipline lets multiple engineers collaborate in parallel, track changes, and roll back safely.", "As AI workloads grow, ETL is returning to curate and enrich data before it reaches the warehouse, and Openflow brings that into the modern era across streaming, batch, and unstructured ingestion."] },
  { slug: "center-of-software-work-moving-data-ai", coverImage: "/assets/images/blog/center-of-software-work-moving-data-ai.jpg", title: "The Center of Software Work Is Moving, and Data + AI Make It Obvious", excerpt: "As AI and agents take over more of the mechanical implementation work, the middle of building software gets thinner. The real leverage shifts to intent, context, definitions, and ownership, because fast execution without clarity just creates fast mistakes.", authorTeam: "eduardo-ramos", date: "2026-01-13", keyTakeaways: ["The middle of software work, manually translating intent into implementation, is thinning as agents produce working code and transformations from goals and context.", "What needs to be built remains the hardest question; agents act directly on what they are given, so ambiguity becomes a multiplier.", "Design is about clarity of intent, not artifacts, and that clarity now drives execution rather than just planning.", "Agents become dramatically more effective in context-rich environments where feedback, data sources, entities, and outcomes are clearly connected.", "When execution is cheap, the cost moves to verification, governance, and shipping changes without breaking meaning."] },
  { slug: "separation-with-purpose-apps-analytics", coverImage: "/assets/images/blog/separation-with-purpose-apps-analytics.jpg", title: "Separation With Purpose: How Modern Teams Keep Apps Fast and Analytics Scalable", excerpt: "PostgreSQL and Snowflake were built for different kinds of work. With Snowflake Postgres, teams can now run transactional and analytical workloads in the same data cloud, without blurring responsibilities or sacrificing performance.", authorTeam: "eduardo-ramos", date: "2026-01-22", keyTakeaways: ["Most data problems come from unclear boundaries between systems, not from bad technology.", "PostgreSQL is optimized for fast, reliable transactions, while Snowflake is built to analyze large volumes of data at scale.", "Snowflake Postgres lets teams run PostgreSQL workloads inside Snowflake while keeping transactional and analytical work separate.", "Operational data lives close to the analytical layer, yet transactional workloads stay isolated from analytical compute.", "The biggest benefit is organizational: with clear responsibilities, teams focus on outcomes instead of negotiating around risk."] },
  { slug: "from-hours-to-outcomes-ai-economics-services", coverImage: "/assets/images/blog/from-hours-to-outcomes-ai-economics-services.jpg", title: "From Hours to Outcomes: How AI Changed the Economics of Services", excerpt: "At Viewnear, we do not sell hours or headcount. We design outcomes. As a pure-play Snowflake partner, we see clearly that AI has shifted where value is created, moving expertise upstream into steering solutions, orchestrating agents, and owning results.", authorTeam: "eduardo-ramos", date: "2026-02-03", keyTakeaways: ["Hourly pricing aligned with a world where value was created through manual execution; AI has broken that link by automating much of the mechanical work.", "Expertise has not eroded, it has moved upstream from manual execution to design, oversight, and orchestration.", "Snowflake makes outcomes measurable in near real time, which is exactly why time-based pricing breaks down so quickly on the platform.", "Viewnear operates a flex-capacity model: define the outcome first, then design delivery backwards with the right mix of human roles and AI agents.", "Outcome-based services are not cheaper; they demand more senior expertise, clear success criteria, and accountability that sits with the provider."] },
  { slug: "snowflake-foundation-for-data-intelligence", coverImage: "/assets/images/blog/snowflake-foundation-for-data-intelligence.jpg", title: "From Constrained to Everywhere: Snowflake as the Foundation for Data Intelligence", excerpt: "Snowflake changed the economics of data, turning what was once constrained, slow, and gated into something elastic, governed, and accessible across the enterprise. As AI collapses the distance between questions and answers, Snowflake becomes the place where you talk to your data and move from insight to action faster than ever.", authorTeam: "eduardo-ramos", date: "2026-02-07", keyTakeaways: ["Snowflake changed the economics of data: decoupled storage and compute, elastic scale, and native sharing turned data use from constrained to everywhere.", "The real value of Snowflake is as a distribution layer for governed enterprise data, where domains intersect on a single source of truth without copying or friction.", "AI only works when grounded in governed, high-quality data, so intelligence runs directly on the system of record rather than on shadow copies.", "With Snowflake CoWork powered by Cortex AI, natural language becomes a first-class interface to governed data without bypassing governance.", "The shift is from better analytics to operational intelligence embedded in daily workflows, with Snowflake as the execution layer."] },
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

You will help design, build, and scale modern data and AI solutions on Snowflake, turning complex business operations into trusted, usable, production-ready systems.

## What you'll do

You will lead the design and implementation of governed data foundations, pipelines, data models, and AI-ready architectures using Snowflake as the core cloud data platform.

You will work closely with business, analytics, engineering, and leadership teams to understand operational challenges, translate them into technical requirements, and deliver solutions that create measurable business value.

You will help bring AI use cases from concept to production by preparing trusted data, building scalable integration patterns, and supporting solutions such as LLM applications, RAG architectures, semantic search, automation workflows, and AI-powered analytics.

This is a hands-on role. You will write SQL and Python, design data models, build ELT pipelines, review technical designs, troubleshoot performance issues, document decisions, and mentor others on the team.

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

You are the person who keeps showing up.

You take ownership of messy source systems, unclear requirements, broken pipelines, performance bottlenecks, and ambitious goals, then work through them with patience and precision.

You do not need everything to be perfect before you start. You know how to ask the right questions, make smart tradeoffs, and move the work forward.

You care about clean architecture, but you also care about getting useful solutions into people's hands. You understand that trust in data is earned one correct number, one reliable pipeline, and one well-built solution at a time.

You bring technical depth, but also humility. You help others get better. You make the team stronger.

## What success looks like

Success means our clients trust their data, AI use cases move beyond demos, pipelines run reliably, and business teams make faster, better decisions.

You will help build the governed foundation on Snowflake that allows ambitious ideas to become real systems. We're looking for someone ready to do the work, carry responsibility, and help the team win.`,
  },
];

// Flat list with a `category` for grouping on /faq; home & services read q/a only.
export const faqs = [
  { category: "Partnership & certifications", q: "What Snowflake partner status does Viewnear hold?", a: "Viewnear is a Snowflake Premier Partner and a Snowflake CoCo Preferred Partner, with SnowPro-certified engineers and a verified delivery track record across the Americas." },
  { category: "Partnership & certifications", q: "What does a Premier Partner unlock for us?", a: "Depth and a direct line to Snowflake. Premier status reflects certified delivery across the full Snowflake stack, and it means we work hand in hand with Snowflake itself: aligned with your Snowflake account team on architecture and delivery, with early visibility into new capabilities (Cortex, Openflow, Horizon Catalog, CoCo, and CoWork). We partner with Snowflake to bring your project to a successful outcome." },
  { category: "Partnership & certifications", q: "How does Snowflake pricing work, and can we buy it through Viewnear?", a: "Snowflake is consumption-based: you pay for the compute (credits) and storage you actually use, so run cost flexes with the work. You can procure your Snowflake capacity through Viewnear for simpler commercial terms and account management under one accountable partner." },
  { category: "Delivery & engagements", q: "How long does a Snowflake implementation take?", a: "A typical first production build runs 8–16 weeks, depending on data volume, source complexity, and the use cases in scope. What keeps that real: paid discovery that fixes scope up front, use-case-driven sprints with working software at every demo, and proof running in parallel with the build, so you see value from sprint one." },
  { category: "Delivery & engagements", q: "How do you de-risk a large engagement?", a: "We prove the approach with a focused proof of concept before we scale, run regular steering reviews with clear decision gates, and build enablement in from day one, so your team can run and extend the work without us." },
  { category: "Delivery & engagements", q: "Can you migrate our existing data warehouse to Snowflake?", a: "Yes. Migration is one of our most common engagements (Teradata, Oracle, Hadoop, SQL Server). We manage the full technical delivery and program governance." },
  { category: "Delivery & engagements", q: "Can you integrate Snowflake with our ERP, CRM, and operational systems?", a: "Yes, in both directions. Openflow and Zero-Copy Integrations bring data in from systems like SAP, Salesforce, and Workday, and we deliver insight back out through Snowsight, Streamlit apps, APIs, and agents embedded where your teams work." },
  { category: "Commercials", q: "How is an engagement priced?", a: "Engagements are scoped on data volume and complexity, the number of analytics/AI use cases, team size, and timeline. We agree scope and price up front and offer fixed-outcome, flex-capacity, and embedded-team models: a partner measured on outcomes, not hours." },
  { category: "Commercials", q: "Do you publish standard pricing?", a: "No. No two data estates are the same, so we price to the work. Tell us your goals and constraints and we'll come back with a model, a plan, and a price." },
  { category: "Security & platform", q: "How do you keep our data secure?", a: "We build on Snowflake's certified platform and extend it with least-privilege access, Horizon Catalog lineage and PII classification, Horizon Context so every person and AI agent works from the same trusted business context, data residency by region, and audit-ready controls, all configured to your sector." },
  { category: "Security & platform", q: "Do you use third-party tools or stay native to Snowflake?", a: "We lead with the Snowflake-native stack (Openflow, Snowpark, Horizon Catalog, Cortex, Snowsight, Streamlit, plus the Snowflake CoCo coding agent and CoWork AI agent) so governance and AI context (Horizon Context) stay in one place. dbt is the one external framework we run, natively against Snowflake." },
];
