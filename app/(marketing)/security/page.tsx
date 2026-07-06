import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import {
  Section,
  SectionHeading,
  CtaBand,
} from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Security & Trust",
  description:
    "How Viewnear keeps your data secure and governed: built on Snowflake's certified foundation, with governance, access control, and audit lineage in every engagement.",
  path: "/security",
});

// Snowflake's platform certifications that our work inherits. We're explicit
// that these are the platform's; we build on top of them, we don't claim them.
const platformCompliance = [
  { name: "SOC 2 Type II", note: "Snowflake platform" },
  { name: "ISO 27001", note: "Snowflake platform" },
  { name: "HIPAA", note: "Snowflake platform (healthcare)" },
  { name: "PCI DSS", note: "Snowflake platform (payments)" },
  { name: "FedRAMP", note: "Snowflake platform (US gov)" },
  { name: "GDPR-ready", note: "Data residency & controls" },
];

const practices = [
  {
    title: "Least-privilege access",
    body: "Role-based access control modeled to your org, so people see only the data they need, enforced in Snowflake, not bolted on after.",
  },
  {
    title: "Lineage & auditability",
    body: "Horizon Catalog lineage and access history mean every figure is traceable to its source and every access is logged for audit.",
  },
  {
    title: "PII classification",
    body: "Sensitive data is classified, masked, and protected with tagging and row/column policies from the first table we build.",
  },
  {
    title: "Data residency by region",
    body: "We deploy in the Snowflake region you require across the Americas, so data stays where your policy and regulators need it.",
  },
  {
    title: "Secrets & key management",
    body: "Credentials and keys are managed through your cloud's secrets and KMS services: never hard-coded, never shared in the clear.",
  },
  {
    title: "Secure delivery practices",
    body: "Code review, least-privilege delivery accounts, and environment separation are standard on every engagement.",
  },
];

const verticals = [
  {
    sector: "Financial services",
    body: "FINRA, SEC, and SOX-aligned reporting with auditable lineage and segregation of duties built in by design.",
  },
  {
    sector: "Healthcare",
    body: "HIPAA-aligned handling of clinical and patient data, with masking, access policies, and audit trails designed in.",
  },
  {
    sector: "Retail & payments",
    body: "PCI-aware handling of payment and customer data, isolated and governed end to end.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Security & Trust"
            title={
              <>
                Your data, <span className="text-gradient">governed and secure</span>.
              </>
            }
            description={`Security isn't a phase at ${theme.brand.name}; it's how we build. Everything we deliver runs on Snowflake's certified foundation, with governance, access control, and audit lineage designed in from the first table.`}
          />
        </div>
      </div>

      {/* Platform compliance inheritance */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            eyebrow="Compliance posture"
            title="Built on a certified foundation"
            intro="We build on Snowflake's independently audited platform and extend it with our own governed delivery practices. The certifications below are Snowflake's; your data inherits them, and we configure your environment to meet them."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 md:auto-rows-fr md:grid-cols-3">
            {platformCompliance.map((c) => (
              <div key={c.name} className="card flex h-full flex-col bg-background">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {c.name}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                  {c.note}
                </p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How we build securely */}
      <Section>
        <SectionHeading
          eyebrow="Our practices"
          title="How we keep your data safe"
          intro="The controls we apply on every engagement by default, never as optional add-ons."
        />
        <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
          {practices.map((p) => (
            <div key={p.title} className="card card-hover flex h-full flex-col">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5C8 19.3 5 15.4 5 11V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-3 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Governance overview split */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <FeatureSplit
            eyebrow="Governance"
            title={
              <>
                One governed foundation,{" "}
                <span className="text-gradient">not scattered copies</span>
              </>
            }
            body="Most data risk comes from sprawl: exports, shadow copies, and ungoverned spreadsheets. We consolidate onto a single governed Snowflake platform so access, lineage, and policy live in one place you can actually audit."
            bullets={[
              "A single governed source of truth, not data spread across tools",
              "Access, masking, and retention policy enforced centrally",
              "Full access history and lineage for audit and incident response",
              "Open table formats (Apache Iceberg), queryable by any engine, no re-platforming",
            ]}
            image="/assets/images/photos/datacenter.jpg"
            imageAlt="Governed, secure data infrastructure"
            cta={{ label: "Talk to our team", href: "/contact" }}
          />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Vertical compliance */}
      <Section>
        <SectionHeading
          eyebrow="By industry"
          title="Compliance where it counts"
          intro="Regulated sectors carry specific obligations. We configure governance to the rules your industry answers to."
        />
        <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.sector} className="card flex h-full flex-col">
              <h3 className="font-display text-lg font-bold text-foreground">{v.sector}</h3>
              <p className="mt-3 text-muted">{v.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Have a specific compliance or security requirement?{" "}
          <Link href="/contact" className="font-semibold text-primaryDeep hover:underline">
            Talk to our team
          </Link>{" "}
          and we&apos;ll walk you through how we&apos;d meet it.
        </p>
      </Section>

      <CtaBand
        title="Security questions before you start?"
        subtitle="Tell us your requirements (data residency, certifications, audit, or vendor review) and we'll show you exactly how we deliver against them."
      />
    </>
  );
}
