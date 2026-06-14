import type { Metadata } from "next";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PlatformStack, type Layer } from "@/components/marketing/platform/PlatformStack";
import { theme } from "@/config/theme";

export const metadata: Metadata = {
  title: "Platform: the Snowflake-native stack",
  description:
    "We build native on Snowflake end to end (Openflow, dbt, Snowpark, Horizon Catalog, Cortex, Snowflake CoWork, Iceberg) so governance, lineage, and AI context stay in one place. No third-party sprawl.",
  alternates: { canonical: "/platform" },
};

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

      {/* Why native */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <FeatureSplit
            eyebrow="Why native"
            title={
              <>
                One platform beats a <span className="text-gradient">stitched-together stack</span>
              </>
            }
            body="Every third-party tool you bolt on is another copy of your data, another system to secure, and another place lineage breaks. Building natively on Snowflake keeps governance, security, and AI context intact, and lets value compound instead of leaking at the seams."
            bullets={[
              "One governed copy of the data: no exports, no shadow stacks",
              "Lineage, access, and policy enforced in one place you can audit",
              "AI agents grounded in trusted, certified business context",
              "Open formats (Apache Iceberg) keep your data portable and queryable by any tool",
            ]}
            image="/assets/images/photos/datacenter.jpg"
            imageAlt="A single governed Snowflake platform"
            cta={{ label: "Talk to our team", href: "/contact" }}
          />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The stack, by layer */}
      <Section>
        <SectionHeading
          eyebrow="The stack"
          title="Native end to end"
          intro="The Snowflake-native products we build on, by layer. We lead with these over third-party tools; dbt is the one external framework we run, natively against Snowflake."
        />
        <PlatformStack layers={LAYERS} />
        <p className="mt-8 text-sm text-muted">
          Status reflects Snowflake&apos;s product maturity (GA / Preview). We pair generally
          available capabilities with early access to what&apos;s next.
        </p>
      </Section>

      <FeaturedCaseStudies tint title="Built on Snowflake, in production" />

      <CtaBand
        title="Go native on Snowflake."
        subtitle="Tell us your current stack and we'll map the fastest path to a single, governed Snowflake foundation, and what to retire along the way."
      />
    </>
  );
}
