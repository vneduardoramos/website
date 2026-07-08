import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import {
  Section,
  SectionHeading,
  CtaBand,
} from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PlateCard } from "@/components/marketing/Cards";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Security & Trust",
  description:
    "How Viewnear keeps enterprise data secure and governed: built on Snowflake's certified foundation, with governance, access control, and audit lineage in every engagement.",
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
    label: "Access",
    title: "Least-privilege access",
    body: "Role-based access control modeled to the organization, so people see only the data they need, enforced in Snowflake, not bolted on after.",
  },
  {
    label: "Lineage",
    title: "Lineage & auditability",
    body: "Horizon Catalog lineage and access history mean every figure is traceable to its source and every access is logged for audit.",
  },
  {
    label: "PII",
    title: "PII classification",
    body: "Sensitive data is classified, masked, and protected with tagging and row/column policies from the first table we build.",
  },
  {
    label: "Residency",
    title: "Data residency by region",
    body: "We deploy in the Snowflake region required across the Americas, so data stays where policy and regulators need it.",
  },
  {
    label: "Secrets",
    title: "Secrets & key management",
    body: "Credentials and keys are managed through the cloud's secrets and KMS services: never hard-coded, never shared in the clear.",
  },
  {
    label: "Delivery",
    title: "Secure delivery practices",
    body: "Code review, least-privilege delivery accounts, and environment separation are standard on every engagement.",
  },
];

// The two halves of the trust story: what Snowflake's audits cover, and the
// delivery practices we bring on top. Rendered as the inherited-vs-ours board.
const inheritedControls = ["SOC 2 Type II", "ISO 27001", "HIPAA", "PCI DSS"];
const ourControls = [
  "Least-privilege access",
  "Lineage & auditability",
  "PII classification",
  "Secure delivery practices",
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
      <JsonLd data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Security & Trust" }])} />
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Security & Trust"
            title={
              <>
                Enterprise data, <span className="text-gradient">governed and secure</span>.
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
            intro="We build on Snowflake's independently audited platform and extend it with our own governed delivery practices. The certifications below are Snowflake's; the data inherits them, and we configure the environment to meet them."
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

          {/* Inherited vs. ours: the platform's audits on one side, our delivery practices on the other. */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-6 md:p-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  Snowflake&rsquo;s audited controls
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {inheritedControls.map((c) => (
                    <li key={c} className="py-2.5 text-sm text-foreground/90">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 md:p-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  Viewnear delivery practices
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {ourControls.map((c) => (
                    <li key={c} className="py-2.5 text-sm text-foreground/90">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How we build securely */}
      <Section>
        <SectionHeading
          eyebrow="Our practices"
          title="How we keep data safe"
          intro="The controls we apply on every engagement by default, never as optional add-ons."
        />
        <div className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
          {practices.map((p, i) => (
            <PlateCard
              key={p.title}
              label={p.label}
              refCode={`CTRL-0${i + 1}`}
              title={p.title}
            >
              {p.body}
            </PlateCard>
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
            body="Most data risk comes from sprawl: exports, shadow copies, and ungoverned spreadsheets. We consolidate onto a single governed Snowflake platform so access, lineage, and policy live in one place that can actually be audited."
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
          intro="Regulated sectors carry specific obligations. We configure governance to the rules each industry answers to."
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
          and we&apos;ll walk through how we&apos;d meet it.
        </p>
      </Section>

      <CtaBand
        title="Security questions before a build starts?"
        subtitle="Tell us the requirements (data residency, certifications, audit, or vendor review) and we'll show exactly how we deliver against them."
      />
    </>
  );
}
