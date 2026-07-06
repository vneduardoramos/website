import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { IndustryTiles } from "@/components/marketing/home/IndustriesStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Solutions: migrate, govern & build with AI",
  description:
    "Outcome-led Snowflake solutions: migrate to Snowflake, Cortex AI & agents, data governance & trust, and data products & embedded analytics, delivered native.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    eyebrow: "Migrate",
    name: "Migrate to Snowflake",
    title: (
      <>
        Migrate to <span className="text-gradient">Snowflake</span>
      </>
    ),
    body: "Move off Teradata, Oracle, Hadoop, or SQL Server onto one governed Snowflake foundation, with automated translation, validation, and Openflow pipelines plus Zero-Copy Integrations that keep data flowing in from the ERP, CRM, and SaaS systems you run.",
    bullets: [
      "Proven migration frameworks; certified architects reduce risk and rework",
      "Automated schema/SQL translation with validation at each step",
      "Openflow + Snowpipe ingestion; dbt and Snowpark transformation",
      "Governed, documented, and handed over to your team",
    ],
    image: "/assets/images/photos/network.jpg",
    cta: { label: "Every source platform we migrate", href: "/migrations" },
    proof: {
      label: "See it in production: live in seven weeks →",
      href: "/case-studies/real-time-student-data-pipeline",
    },
  },
  {
    eyebrow: "Applied AI",
    name: "Cortex AI & agents",
    title: (
      <>
        Cortex <span className="text-gradient">AI & agents</span>
      </>
    ),
    body: "Production AI that runs securely next to governed data. We ground Cortex and Snowflake CoWork in your Semantic Views so business users get cited, trustworthy answers, and we build it all with Snowflake CoCo.",
    bullets: [
      "Cortex AISQL and Cortex Analyst over governed semantic models",
      "Agents grounded in Semantic Views: cited, not hallucinated",
      "Snowflake CoWork for knowledge workers; Snowflake CoCo for AI dev",
      "AI Agent Identity and access controls built in",
    ],
    image: "/assets/images/photos/circuit.jpg",
    cta: { label: "Go deeper: every major model", href: "/data-ai" },
    proof: {
      label: "See it in production: 95% claims accuracy →",
      href: "/case-studies/insurance-claims-cortex-ai",
    },
    reverse: true,
  },
  {
    eyebrow: "Governance",
    name: "Data governance & trust",
    title: (
      <>
        Data <span className="text-gradient">governance & trust</span>
      </>
    ),
    body: "One governed copy of your data, with lineage, access, and policy enforced in one place you can audit: the foundation AI actually needs. Trusted context, not sprawl.",
    bullets: [
      "Horizon Catalog lineage, access history, and classification",
      "PII masking, row/column policies, and data residency by region",
      "Audit-ready for FINRA, HIPAA, PCI, configured to your sector",
      "AI Agent Identity for verifiable, governed agents",
    ],
    image: "/assets/images/photos/datacenter.jpg",
    cta: { label: "See Security & Trust", href: "/security" },
    proof: {
      label: "See it in production: one golden record across eight domains →",
      href: "/case-studies/corporate-mdm-golden-record",
    },
  },
  {
    eyebrow: "Consumption",
    name: "Data products & embedded analytics",
    title: (
      <>
        Data products & <span className="text-gradient">embedded analytics</span>
      </>
    ),
    body: "Put insight where people work: on your governed data, not a separate BI stack to secure. Snowsight dashboards, Streamlit apps, and ask-in-plain-language analytics, with answers that flow back into the tools your teams already use.",
    bullets: [
      "Snowsight dashboards and Streamlit in Snowflake data apps",
      "Snowflake CoWork for natural-language, self-service analytics",
      "Embed analytics directly into your product and client portals",
      "No exports, no shadow stacks; governed at every step",
    ],
    image: "/assets/images/photos/dashboard.jpg",
    cta: { label: "Talk to our team", href: "/contact" },
    proof: {
      label: "See it in production: a natural-language catalog agent →",
      href: "/case-studies/sku-catalog-governance",
    },
    reverse: true,
  },
];

const solutionsLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${theme.brand.name} solutions`,
  itemListElement: SOLUTIONS.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.body,
    serviceType: s.eyebrow,
    areaServed: "Americas",
    provider: {
      "@type": "Organization",
      name: theme.brand.name,
      url: theme.brand.url,
    },
  })),
};

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={solutionsLd} />
      <PageHero
        eyebrow="Solutions"
        title={
          <>
            Outcomes, <span className="text-gradient">delivered native</span>.
          </>
        }
        description="Common ways teams put Snowflake to work, each delivered end to end on the native stack, governed from the first table. Not sure where you fit? We'll help you sequence it."
      />

      {SOLUTIONS.map((s, i) => (
        <Section
          key={s.eyebrow}
          className={i % 2 === 1 ? "section-warm relative overflow-hidden" : "relative overflow-hidden"}
        >
          {i % 2 === 1 && <SectionDecor variant="dots" />}
          <div className="relative">
            <FeatureSplit
              eyebrow={s.eyebrow}
              title={s.title}
              body={s.body}
              bullets={s.bullets}
              image={s.image}
              imageAlt={`${s.eyebrow}: Snowflake-native solution`}
              reverse={s.reverse}
              cta={s.cta}
            />
            {/* Quiet proof line: the matching real engagement, under the text column. */}
            <p className={`mt-6 text-sm ${s.reverse ? "md:text-right" : ""}`}>
              <Link
                href={s.proof.href}
                className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
              >
                {s.proof.label}
              </Link>
            </p>
          </div>
          {i % 2 === 1 && <WaveDivider position="bottom" fill="fill-background" />}
        </Section>
      ))}

      <Section>
        <SectionHeading
          eyebrow="By sector"
          title="Tuned to your industry"
          intro="Every solution is shaped by sector context; see how we apply it in your industry."
          center
        />
        <IndustryTiles className="mt-10" />
      </Section>

      <FeaturedCaseStudies tint title="See it in practice" />

      <CtaBand />
    </>
  );
}
