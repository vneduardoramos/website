import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import {
  DatabaseIcon,
  CpuIcon,
  ShieldIcon,
  DataStackIcon,
} from "@/components/marketing/home/Icons";
import { LedgerCard } from "@/components/marketing/Cards";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Nearshore Snowflake delivery in the US Central time zone",
  description:
    "Viewnear delivers Snowflake data and AI from Monterrey, Mexico, in the US Central time zone. SnowPro-certified experts who work your business hours, with depth at every level.",
  path: "/nearshore",
});

const HERO_CHIPS = [
  "US Central time zone",
  "SnowPro-certified",
  "Snowflake Premier Partner",
  "CoCo Preferred Partner",
];


// Why nearshore with Viewnear: the real differentiators, reframed for data + AI.
const reasons = [
  {
    label: "Depth",
    title: "Snowflake depth at every level",
    body: "Strategists, architects, and engineers all fluent in Snowflake and SnowPro-certified. The depth that scopes your work is the depth that delivers it.",
  },
  {
    label: "Language",
    title: "Clear, bilingual communication",
    body: "A fully English- and Spanish-proficient team and direct access to the people doing the work. Fewer translation layers, fewer misread requirements.",
  },
  {
    label: "Continuity",
    title: "The same team from scope to run",
    body: "You get a committed team that learns your data and your goals and stays on: no re-staffing mid-engagement, no delivery pyramid billed by the hour.",
  },
  {
    label: "Cadence",
    title: "A communication cadence you can count on",
    body: "Regular working sessions and full visibility into progress. You are never in the dark on where a build stands or what comes next.",
  },
  {
    label: "Delivery",
    title: "Agile delivery, value early",
    body: "An iterative, use-case-driven model that puts working data products in front of your team in weeks, then builds on what proves out.",
  },
];

// Verified credentials only (no vanity metrics).
const numbers = [
  { value: "Premier", label: "Snowflake Premier + CoCo Preferred Partner" },
  { value: "SnowPro", label: "SnowPro-certified across the team" },
  { value: "15+", label: "Years building data & enterprise AI" },
  { value: "5", label: "Countries across the Americas" },
];

// What the nearshore team delivers, mapped to Viewnear's service areas.
const delivers = [
  {
    Icon: DatabaseIcon,
    title: "Data modernization and migration",
    body: "Legacy warehouses and pipelines consolidated onto Snowflake, governed from the first table.",
  },
  {
    Icon: CpuIcon,
    title: "AI and Cortex",
    body: "Governed, AI-ready data and Cortex use cases prioritized against real business return.",
  },
  {
    Icon: ShieldIcon,
    title: "Governance and Horizon",
    body: "Access, lineage, and policy built in with Horizon, so trust scales with the data.",
  },
  {
    Icon: DataStackIcon,
    title: "Data apps and Snowpark",
    body: "Native data applications and Snowpark workloads that run where your data already lives.",
  },
];

const STACK = ["Cortex", "Snowpark", "Iceberg", "dbt", "Openflow", "Horizon"];

export default async function NearshorePage() {
  const bands = await getClientBands();

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Nearshore Advantage"
            title={
              <>
                Nearshore data and AI delivery,{" "}
                <ScrollHighlight color="cyan">
                  <span className="text-gradient">in sync with your team</span>
                </ScrollHighlight>
                .
              </>
            }
            description="SnowPro-certified Snowflake experts who work your business hours. Delivery moves at the pace of a team down the hall, not a handoff you wait overnight for."
          >
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_CHIPS.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </PageHero>
        </div>
      </div>

      {/* Trust: real client logos */}
      <Section>
        <p className="eyebrow mb-8 text-center">Trusted by teams across the Americas</p>
        <LogoRow logos={bands.top} />
      </Section>

      {/* Why nearshore with Viewnear */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="Why nearshore with Viewnear"
            title="Deep Snowflake delivery, without the offshore tradeoffs"
            intro="Nearshore gives you the cost and capacity advantages of a distributed team while keeping the proximity, hours, and communication of one in the building."
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {/* The time-zone card, carried by the actual office: a real address
                beats an icon for proving "nearshore" means a real team here. */}
            <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-border shadow-soft">
              <Image
                src="/assets/images/life/monterrey-building.jpg"
                alt="Viewnear's Monterrey office building at Pueblo Serena"
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold text-white">
                  Your time zone, not a handoff
                </h3>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/75">
                  Our Monterrey hub &middot; on your clock
                </p>
              </div>
            </div>
            {reasons.map(({ label, title, body }) => (
              <LedgerCard key={title} eyebrow={label} title={title}>
                {body}
              </LedgerCard>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* By the numbers */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow="By the numbers"
          title="Credentials, not vanity metrics"
        />
        <div className="mt-12">
          <MetricBand metrics={numbers} />
        </div>
      </Section>

      {/* What we deliver nearshore */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="What we deliver"
            title="The full Snowflake build, delivered nearshore"
            intro={`Our delivery team works from Monterrey, Mexico, in the US Central time zone, covering the same scope ${theme.brand.name} delivers anywhere: from migration to governed AI in production.`}
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
            {delivers.map(({ Icon, title, body }) => (
              <div key={title} className="card card-hover flex h-full flex-col">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-muted">{body}</p>
              </div>
            ))}
          </RevealGroup>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {STACK.map((s) => (
              <span key={s} className="pill-chip">
                {s}
              </span>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The team behind it */}
      <Section>
        <FeatureSplit
          eyebrow="Certified nearshore talent"
          title={
            <>
              Nearshore should not mean <span className="text-gradient">junior</span>
            </>
          }
          body="Our Monterrey team is SnowPro-certified and proven in production. The people who scope your work are the people who build it, and they specialize in exactly one platform: Snowflake, every project, every day."
          bullets={[
            "SnowPro-certified architects and engineers, proven in production",
            "A rigorous hiring bar for every team member",
            "Direct access to the engineers doing the work",
          ]}
          image="/assets/images/life/team-group.jpg"
          imageAlt="The Viewnear delivery team"
          reverse
          cta={{ label: "See how we work", href: "/approach" }}
        />
      </Section>

      {/* Partner credibility */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow="Backed by Snowflake"
          title="A certified partner behind every engagement"
          intro="The nearshore team carries the same recognitions as the rest of Viewnear: two of Snowflake's highest partner statuses, with certified delivery on every project."
        />
        <div className="mt-12 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
      </Section>

      <CtaBand
        title="Put a nearshore Snowflake team on it."
        subtitle="Tell us where you are with Snowflake (migrating, scaling, or building AI) and we'll bring a certified team in your time zone to get you there."
      />
    </>
  );
}
