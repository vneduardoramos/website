import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import type { Layer } from "@/components/marketing/platform/PlatformStack";
import { ProductIndex } from "@/components/marketing/platform/StackDiagram";
import { ProductShots } from "@/components/marketing/platform/ProductShots";
import { StackStory } from "@/components/marketing/platform/StackStory";
import { RevealGroup } from "@/components/marketing/Motion";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Platform: the stack a data & AI practice runs on",
  description:
    "Why we build a data & AI practice native on Snowflake (Openflow, dbt, Snowpark, Horizon, Cortex, Iceberg): governance, lineage, and AI context in one place the team can run.",
  path: "/platform",
});

const LAYERS: Layer[] = [
  {
    layer: "Ingestion & movement",
    blurb: "Get every source in, batch or streaming, without bolting on a separate ETL vendor.",
    products: [
      { name: "Openflow", status: "GA", desc: "Managed integration on Apache NiFi; batch + streaming, BYOC or Snowflake-managed." },
      { name: "Snowpipe Streaming", status: "GA", desc: "Low-latency, continuous ingestion straight into governed tables." },
      { name: "Datastream", status: "Preview", desc: "Managed, Kafka-compatible streaming; data inherits Snowflake governance automatically." },
      { name: "Zero-Copy Integrations", status: "Public Preview", desc: "Native links to SAP, Salesforce, Workday & more, with no data duplication." },
    ],
  },
  {
    layer: "Transformation & engineering",
    blurb: "Model and transform in-platform, in the languages the team already uses.",
    products: [
      { name: "dbt", status: "GA", desc: "Our transformation framework of choice, run natively against Snowflake." },
      { name: "Snowpark", status: "GA", desc: "Python/Java/Scala pipelines and UDFs executing next to the data." },
      { name: "Dynamic Tables", status: "GA", desc: "Declarative, incremental pipelines that keep derived data fresh." },
    ],
  },
  {
    layer: "Open storage & interoperability",
    blurb: "One governed copy of the data, open to every engine.",
    products: [
      { name: "Apache Iceberg v3", status: "GA", desc: "Open table format with deletion vectors, row lineage, and variant types." },
      { name: "Open Catalog (Polaris)", status: "GA", desc: "Bi-directional read/write catalog so Snowflake and external lakes share one source." },
      { name: "Snowflake-managed Iceberg", status: "GA", desc: "A single live, governed copy across Snowflake and the lake, with no movement." },
    ],
  },
  {
    layer: "Governance, security & context",
    blurb: "Governance, lineage, and trusted business context built in: the foundation AI actually needs.",
    products: [
      { name: "Horizon Catalog", status: "GA", desc: "Lineage, access history, classification, and policy across the estate." },
      { name: "Horizon Context", status: "Private Preview", desc: "Collect, enrich, and activate metadata with semantic + keyword search." },
      { name: "Cortex Sense", status: "GA", desc: "Runtime layer that assembles data + business definitions for AI agents." },
      { name: "Semantic Views", status: "GA", desc: "Shared business definitions so every query and agent speaks the same language." },
      { name: "AI Agent Identity", status: "GA", desc: "Verifiable identity and per-agent RBAC for every AI agent, with full audit trails." },
    ],
  },
  {
    layer: "AI & agents",
    blurb: "Production AI that runs securely next to governed data; models never see ungoverned copies.",
    products: [
      { name: "Cortex AISQL", status: "GA", desc: "Call LLMs and ML functions directly from SQL: COMPLETE, SENTIMENT, SUMMARIZE." },
      { name: "Cortex Analyst", status: "GA", desc: "Natural-language questions answered against governed semantic models." },
      { name: "Snowflake CoWork", status: "GA", desc: "Agentic, cited answers and governed dashboards for knowledge workers." },
      { name: "Snowflake CoCo", status: "GA", desc: "Coding agent for enterprise AI development, validated before production." },
      { name: "Cortex Training", status: "Preview", desc: "Fine-tune open-weight models on managed GPUs; data never moves." },
    ],
  },
  {
    layer: "Consumption & apps",
    blurb: "Put insight where people work: on governed data, not a separate BI stack to secure.",
    products: [
      { name: "Snowsight", status: "GA", desc: "Governed dashboards and ad-hoc exploration out of the box." },
      { name: "Streamlit in Snowflake", status: "GA", desc: "Interactive data apps shipped right next to the data." },
      { name: "Snowflake CoWork", status: "GA", desc: "Ask-in-plain-language analytics for the whole business." },
    ],
  },
];

// Why-native proof points (formerly a FeatureSplit with a stock photo).
const WHY_NATIVE = [
  { title: "One governed copy", body: "No exports, no shadow stacks: the data stays in one place with governance attached." },
  { title: "One lineage to audit", body: "Lineage, access, and policy enforced in a single place that stands up to an audit." },
  { title: "Grounded AI", body: "Agents inherit trusted, certified business context instead of guessing from copies." },
  { title: "Open by design", body: "Apache Iceberg keeps the same governed copy portable and queryable by any engine." },
];

export default function PlatformPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Platform"
            title={
              <>
                Built <span className="text-gradient">native on Snowflake</span>, not bolted on.
              </>
            }
            description={`A data & AI practice needs one home, not five vendors to reconcile. So everything ${theme.brand.name} builds for it lives inside Snowflake (ingestion, transformation, governance, AI): one governed home for the data, one lineage to audit, one context every team and agent shares.`}
          />
        </div>
      </div>

      {/* The stack, narrated as an engagement: the page's centerpiece */}
      <Section>
        <SectionHeading
          eyebrow="How it comes together"
          title="One build, start to finish"
          intro="What actually happens when we stand up a data foundation: who does what, where each product earns its place, and where the team takes over. dbt is the one external framework we run, natively against Snowflake."
        />
        <StackStory />
      </Section>

      {/* The work, on screen: real build environments, not mockups */}
      <Section className="section-tint relative overflow-hidden">
        <div className="relative">
          <SectionHeading
            eyebrow="On screen"
            title="What a governed build looks like"
            intro="Screens from our build environments, not mockups: the surface the business sees, the engineering behind it, and the governance that makes both trustworthy."
          />
          <ProductShots />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The conviction: our practice, not a platform pitch */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            eyebrow="Our conviction"
            title="We could stitch five tools together. We won't."
            intro="Snowflake sells the platform; we answer for what gets built on it. Every extra tool is another copy of the data, another system to secure, and another place lineage breaks, so building native is how we keep that promise:"
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4" variant="fade-up">
            {WHY_NATIVE.map((w) => (
              <div key={w.title} className="border-t border-border pt-4">
                <h3 className="font-display text-base font-bold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The parts list: reference, not pitch */}
      <Section>
        <SectionHeading
          eyebrow="For architects"
          title="The parts list"
          intro="Every product we reach for, and the one-line reason. dbt is the lone external framework; everything else stays native."
        />
        <ProductIndex layers={LAYERS} />
      </Section>

      <FeaturedCaseStudies tint title="This stack, in production" />

      <CtaBand
        title="Put the practice on one governed stack."
        subtitle="Tell us what runs today. We'll map the fastest path to a single, governed foundation on Snowflake, what to retire along the way, and where the team takes over."
      />
    </>
  );
}
