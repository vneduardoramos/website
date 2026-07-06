import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import type { Layer } from "@/components/marketing/platform/PlatformStack";
import { ProductIndex } from "@/components/marketing/platform/StackDiagram";
import { StackStory } from "@/components/marketing/platform/StackStory";
import { RevealGroup } from "@/components/marketing/Motion";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Platform: the Snowflake-native stack",
  description:
    "We build native on Snowflake end to end (Openflow, dbt, Snowpark, Horizon, Cortex, Iceberg) so governance, lineage, and AI context stay in one place.",
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
    blurb: "Model and transform in-platform, in the languages your team already uses.",
    products: [
      { name: "dbt", status: "GA", desc: "Our transformation framework of choice, run natively against Snowflake." },
      { name: "Snowpark", status: "GA", desc: "Python/Java/Scala pipelines and UDFs executing next to the data." },
      { name: "Dynamic Tables", status: "GA", desc: "Declarative, incremental pipelines that keep derived data fresh." },
    ],
  },
  {
    layer: "Open storage & interoperability",
    blurb: "One governed copy of your data, open to every engine.",
    products: [
      { name: "Apache Iceberg v3", status: "GA", desc: "Open table format with deletion vectors, row lineage, and variant types." },
      { name: "Open Catalog (Polaris)", status: "GA", desc: "Bi-directional read/write catalog so Snowflake and external lakes share one source." },
      { name: "Snowflake-managed Iceberg", status: "GA", desc: "A single live, governed copy across Snowflake and your lake, with no movement." },
    ],
  },
  {
    layer: "Governance, security & context",
    blurb: "Governance, lineage, and trusted business context built in: the foundation AI actually needs.",
    products: [
      { name: "Horizon Catalog", status: "GA", desc: "Lineage, access history, classification, and policy across your estate." },
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
      { name: "Cortex Analyst", status: "GA", desc: "Natural-language questions answered against your governed semantic models." },
      { name: "Snowflake CoWork", status: "GA", desc: "Agentic, cited answers and governed dashboards for knowledge workers." },
      { name: "Snowflake CoCo", status: "GA", desc: "Coding agent for enterprise AI development, validated before production." },
      { name: "Cortex Training", status: "Preview", desc: "Fine-tune open-weight models on managed GPUs; data never moves." },
    ],
  },
  {
    layer: "Consumption & apps",
    blurb: "Put insight where people work: on your governed data, not a separate BI stack to secure.",
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
  { title: "One lineage to audit", body: "Lineage, access, and policy enforced in a single place you can actually show an auditor." },
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
            description={`${theme.brand.name} builds the whole stack inside Snowflake (ingestion, transformation, governance, and AI) so your data has one governed home. Fewer vendors to secure, one lineage to audit, and trusted context every AI agent can rely on.`}
          />
        </div>
      </div>

      {/* The stack, narrated as an engagement: the page's centerpiece */}
      <Section>
        <SectionHeading
          eyebrow="How it comes together"
          title="One build, start to finish"
          intro="What actually happens when we build on Snowflake: who does what, and where each product earns its place in the story. dbt is the one external framework we run, natively against Snowflake."
        />
        <StackStory />
      </Section>

      {/* Why native: the argument, typographic (no stock imagery) */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            eyebrow="Why native"
            title="One platform beats a stitched-together stack"
            intro="Every third-party tool you bolt on is another copy of your data, another system to secure, and another place lineage breaks. Building natively keeps value compounding instead of leaking at the seams."
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

      {/* The fine print: every product's one-liner, as type, not cards */}
      <Section>
        <SectionHeading
          eyebrow="Layer by layer"
          title="What each piece does"
        />
        <ProductIndex layers={LAYERS} />
      </Section>

      <FeaturedCaseStudies tint title="Built on Snowflake, in production" />

      <CtaBand
        title="Go native on Snowflake."
        subtitle="Tell us your current stack and we'll map the fastest path to a single, governed Snowflake foundation, and what to retire along the way."
      />
    </>
  );
}
