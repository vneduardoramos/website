import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { MetricBand } from "@/components/marketing/Blocks";
import { TeamCard } from "@/components/marketing/TeamCard";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { PartnershipHighlight } from "@/components/marketing/PartnershipHighlight";
import {
  CheckIcon,
  ShieldIcon,
  PipelineIcon,
  DocIcon,
  CompassIcon,
} from "@/components/marketing/home/Icons";
import { getTeam } from "@/lib/queries";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "About: Snowflake data & AI partner for the Americas",
  description:
    "Viewnear is a Snowflake Premier and CoCo Preferred Partner. A team versed in Snowflake and enterprise solutions at every level takes enterprises from data strategy to governed AI in production across the Americas.",
  path: "/about",
});

const HERO_CHIPS = [
  "Snowflake Premier Partner",
  "CoCo Preferred Partner",
  "SnowPro-certified",
  "Americas-focused delivery",
];

// What every engagement gets: the operating model, end to end.
const operating = [
  "Versed in Snowflake & enterprise solutions, at every level",
  "Governed by design, from the first table",
  "End-to-end delivery under one accountable team",
  "Open formats keep your data portable, not locked in",
];

// Verifiable credential snapshot (no vanity metrics).
const trackRecord = [
  { value: "Premier", label: "Snowflake Premier + CoCo Preferred Partner" },
  { value: "SnowPro", label: "SnowPro-certified across the team" },
  { value: "15+", label: "Years building data & enterprise AI" },
  { value: "5", label: "Countries across the Americas" },
];

// How we operate: the principles enterprise buyers actually evaluate.
const principles = [
  {
    Icon: CheckIcon,
    title: "Versed in Snowflake, at every level",
    body: "Strategists, architects, and engineers who are all deeply fluent in Snowflake and enterprise solutions, SnowPro-certified and proven in production. The depth that scopes your work is the depth that delivers it.",
  },
  {
    Icon: ShieldIcon,
    title: "Governed by design",
    body: "Horizon Catalog lineage and Horizon Context give every team and AI agent one trusted business context, from the first table.",
  },
  {
    Icon: PipelineIcon,
    title: "End-to-end, one accountable team",
    body: "Strategy through production under a single team, so context never breaks across vendors or phases.",
  },
  {
    Icon: DocIcon,
    title: "We leave you stronger",
    body: "Documentation, enablement, and a transition plan in every engagement, so your team runs and extends the work confidently.",
  },
  {
    Icon: CompassIcon,
    title: "The Americas' home team",
    body: "Local expertise and time-zone alignment across Canada, the USA, Mexico, LATAM, and the Caribbean.",
  },
];

// Governance & trust posture (enterprise procurement checklist).
const governance = [
  "Least-privilege access and role-based controls (RBAC)",
  "Horizon Catalog lineage + Horizon Context across every asset",
  "PII classification and masking, data residency by region",
  "Built on Snowflake's audited platform: SOC 2 Type II, ISO 27001, HIPAA",
];

// What the team brings: versed in Snowflake & enterprise solutions at every level.
const staffing = [
  {
    title: "Versed in Snowflake, end to end",
    body: "Across strategy, architecture, engineering, and analytics, the team goes deep on the Snowflake platform: the Data Cloud, Cortex and CoCo, and Horizon governance. Snowflake is what we do.",
  },
  {
    title: "Enterprise solutions at every level",
    body: "Not just the leads. The whole team brings enterprise-grade depth: security, scale, compliance, and integration with the systems your business already runs on.",
  },
  {
    title: "One combined team",
    body: "A group of professionals who scope, build, and hand over together, combined experience across data and enterprise AI, so context never breaks across phases or vendors.",
  },
];

const credentials = [
  "Snowflake Premier Partner",
  "Snowflake CoCo Preferred Partner",
  "SnowPro-certified engineers",
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero
        eyebrow={`About ${theme.brand.name}`}
        title={
          <>
            The Snowflake data &amp; AI partner for the{" "}
            <ScrollHighlight color="cyan">
              <span className="text-gradient">Americas</span>
            </ScrollHighlight>
            .
          </>
        }
        description="Viewnear is a Snowflake Premier and CoCo Preferred Partner. A team versed in Snowflake and enterprise solutions at every level takes enterprises from data strategy to governed AI in production, across Canada, the USA, Mexico, LATAM, and the Caribbean."
      >
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {HERO_CHIPS.map((c) => (
            <span key={c} className="pill-chip">
              {c}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Snowflake partnership: Premier + CoCo Preferred Partner + Summit 2026 (lead section) */}
      <PartnershipHighlight showCta />

      {/* Who we are / how we operate (folds in a brief origin) */}
      <Section>
        <FeatureSplit
          as="h2"
          ratio="wide-text"
          eyebrow="Who we are"
          title="One accountable team, the whole Snowflake stack"
          body="Viewnear is a data & AI consultancy and Snowflake partner. We take enterprises end to end (strategy, architecture, engineering, analytics, and governed AI) with one team that owns the outcome from first workshop to production, deeply versed in Snowflake and enterprise solutions at every level. We grew from a specialist practice into a Snowflake Premier partner in four years by going deep on one platform and proving it in production."
          bullets={operating}
          cta={{ label: "How we deliver", href: "/services" }}
          visual={
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-soft-lg">
              <Image
                src="/assets/images/life/about-collage.jpg"
                alt="A collage of the Viewnear team across Snowflake events: the data + ai booth, Data for Breakfast, Snowflake Summit, and team meals"
                width={1500}
                height={1500}
                className="aspect-square w-full object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-royal/10 via-transparent to-secondary/10" />
            </div>
          }
        />
      </Section>

      {/* Track record: verifiable credentials */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow="Track record"
          title="Credentials you can verify"
          intro="No vanity numbers: the partner tier, certification, and regional reach you can check."
          center
        />
        <div className="mt-12">
          <MetricBand metrics={trackRecord} />
        </div>
      </Section>

      {/* How we operate: enterprise principles */}
      <Section>
        <SectionHeading
          eyebrow="How we operate"
          title="Built the way enterprises buy"
          intro="The operating principles behind every engagement."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {principles.map(({ Icon, title, body }) => (
            <div key={title} className="card card-pop flex h-full flex-col">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* Governance & trust: the enterprise signal */}
      <Section>
        <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-xl md:p-14">
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <p className="eyebrow eyebrow--invert mb-4">Governance &amp; trust</p>
              <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.08]">
                Enterprise-grade by default.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                Everything we build is governed and auditable from day one, and
                inherits the controls of Snowflake&rsquo;s independently audited
                platform.
              </p>
              <Link
                href="/security"
                className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white"
              >
                <span className="link-underline">How we secure your data</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:content-center">
              {governance.map((g) => (
                <div key={g} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-white/80">{g}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Our team, versed at every level, plus the leadership behind it */}
      <Section id="team" className="section-tint">
        <SectionHeading
          eyebrow="Our team"
          title="Versed in Snowflake and enterprise, at every level"
          intro="We're a group of professionals, strategy through engineering, who all go deep on the same thing: Snowflake and enterprise solutions. Not a few senior names over a rotating bench, but combined depth you feel at every level of the engagement."
        />
        <RevealGroup className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {staffing.map((s) => (
            <div key={s.title} className="card card-pop flex h-full flex-col">
              <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </RevealGroup>
        <div className="mt-8 flex flex-wrap gap-3">
          {credentials.map((c) => (
            <span key={c} className="pill-chip">
              {c}
            </span>
          ))}
        </div>
        {team.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4">
              <p className="eyebrow">Leadership</p>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              The leadership team
            </h3>
            <p className="mt-2 max-w-2xl text-muted">
              The people accountable for your outcome, combined experience across
              data, analytics, and enterprise AI.
            </p>
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr" variant="fade-up">
              {team.map((member) => (
                <TeamCard
                  key={member.slug}
                  member={{
                    name: member.name,
                    title: member.title,
                    bio: member.bio,
                    photo: member.photo,
                    bookingUrl: member.bookingUrl,
                    linkedinUrl: member.linkedinUrl,
                  }}
                />
              ))}
            </RevealGroup>
          </div>
        )}
      </Section>

      {/* Enterprise close: talk to an architect */}
      <section className="section">
        <div className="container-page">
          <div className="panel-dark panel-editorial relative overflow-hidden rounded-3xl p-10 text-center shadow-soft md:p-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Bring us your hardest data problem.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                Tell us where you are, migrating, scaling, or grounding AI, and a
                Snowflake architect will map the fastest path to value.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary btn-lg hover-sheen">
                  Talk to an architect
                </Link>
                <Link href="/partnership" className="btn-ghost btn-lg">
                  Explore our partnership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
