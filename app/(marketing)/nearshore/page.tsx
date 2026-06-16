import type { SVGProps } from "react";
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
  SnowflakeIcon,
  RocketIcon,
} from "@/components/marketing/home/Icons";
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

// ── Local line icons (24x24, stroke-2, matching the home icon family) ────────
const ibase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function ClockIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ibase} {...p} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function ChatIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ibase} {...p} aria-hidden="true">
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M8 10h8M8 13.5h5" />
    </svg>
  );
}
function UsersIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ibase} {...p} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4" />
      <path d="M17.2 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  );
}
function CalendarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...ibase} {...p} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h3M7.5 17h3M13.5 13h3" />
    </svg>
  );
}

// Why nearshore with Viewnear: the real differentiators, reframed for data + AI.
const reasons = [
  {
    Icon: ClockIcon,
    title: "Your time zone, not a handoff",
    body: "We work from Monterrey in US Central hours. Questions get answered the same afternoon, not the next morning, so reviews and decisions keep pace with your team.",
  },
  {
    Icon: SnowflakeIcon,
    title: "Snowflake depth at every level",
    body: "Strategists, architects, and engineers all fluent in Snowflake and SnowPro-certified. The depth that scopes your work is the depth that delivers it.",
  },
  {
    Icon: ChatIcon,
    title: "Clear, bilingual communication",
    body: "A fully English- and Spanish-proficient team and direct access to the people doing the work. Fewer translation layers, fewer misread requirements.",
  },
  {
    Icon: UsersIcon,
    title: "A dedicated, boutique team",
    body: "You get a committed team that knows your data and your goals, not a rotating bench billed by the hour from a delivery pyramid.",
  },
  {
    Icon: CalendarIcon,
    title: "A communication cadence you can count on",
    body: "Regular working sessions and full visibility into progress. You are never in the dark on where a build stands or what comes next.",
  },
  {
    Icon: RocketIcon,
    title: "Agile delivery, value early",
    body: "An iterative, use-case-driven model that puts working data products in front of your team in weeks, then builds on what proves out.",
  },
];

// Verified credentials only (no vanity metrics).
const numbers = [
  { value: "Premier", label: "Snowflake Premier + CoCo Preferred Partner" },
  { value: "SnowPro", label: "SnowPro-certified across the team" },
  { value: "15+", label: "Years building data and enterprise AI" },
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
            description="SnowPro-certified Snowflake experts who work your business hours in the US Central time zone. Delivery moves at the pace of a team down the hall, not a handoff you wait overnight for."
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
            title="Senior Snowflake delivery, without the offshore tradeoffs"
            intro="Nearshore gives you the cost and capacity advantages of a distributed team while keeping the proximity, hours, and communication of one in the building."
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {reasons.map(({ Icon, title, body }) => (
              <div key={title} className="card card-hover flex h-full flex-col">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primaryDeep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-muted">{body}</p>
              </div>
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
      <Section className="section-tint relative overflow-hidden">
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

      {/* Deep-dive benefits */}
      <Section className="space-y-20 md:space-y-28">
        <FeatureSplit
          eyebrow="Same-time-zone collaboration"
          title={
            <>
              Shared hours, <span className="text-gradient">real momentum</span>
            </>
          }
          body="Working in US Central hours means live design sessions, same-day answers, and reviews that happen while everyone is at their desk. There is no overnight queue between a question and an answer, so projects move at the speed of a team in the next room."
          bullets={[
            "Overlapping business hours with US ET, CT, MT, and PT",
            "Live working sessions, not asynchronous handoffs",
            "Same-day turnaround on questions and reviews",
          ]}
          image="/assets/images/life/monterrey.jpg"
          imageAlt="Monterrey, Mexico, home of the Viewnear nearshore delivery team"
        />
        <FeatureSplit
          eyebrow="Senior nearshore talent"
          title={
            <>
              Depth at <span className="text-gradient">every level</span>
            </>
          }
          body="Nearshore should not mean junior. Our Monterrey team is SnowPro-certified and proven in production, paired with industry context so the people who scope your work are the people who build it. Snowflake is what we do, not one of ten stacks we dabble in."
          bullets={[
            "SnowPro-certified architects and engineers",
            "A rigorous hiring bar for every team member",
            "Snowflake specialists, end to end",
          ]}
          image="/assets/images/life/team-group.jpg"
          imageAlt="The Viewnear delivery team"
          reverse
        />
        <FeatureSplit
          eyebrow="Clear communication"
          title={
            <>
              Full visibility, <span className="text-gradient">no surprises</span>
            </>
          }
          body="A lack of communication is what derails distributed projects. We keep it transparent with a steady working cadence, direct access to the engineers doing the work, and a fully bilingual team, so requirements land the first time and you always know where a build stands."
          bullets={[
            "A regular cadence of working sessions",
            "Direct access to the people building, at every level",
            "An English- and Spanish-proficient team",
          ]}
          image="/assets/images/life/team-breakfast.jpg"
          imageAlt="The Viewnear team collaborating"
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
