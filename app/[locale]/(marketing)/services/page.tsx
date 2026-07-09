import Link from "next/link";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import {
  Section,
  SectionHeading,
  CtaBand,
} from "@/components/marketing/ui";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { PlateCard, LedgerCard } from "@/components/marketing/Cards";
import { TrustLogos } from "@/components/marketing/TrustBar";
import { SnowMark } from "@/components/marketing/SnowMark";
import { MetricBand, InlineCta } from "@/components/marketing/Blocks";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { getServicesByTier, getSetting } from "@/lib/queries";
import { asStringArray } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Services: THINK · BUILD · GROW",
  description:
    "THINK, BUILD, GROW: strategy, engineering, and enablement to stand up a data practice and an AI practice on Snowflake, built for in-house teams to run.",
  path: "/services",
});

type TierMeta = {
  eyebrow: string;
  num: string;
  intro: string;
  num_cls: string; // big faded index color
  bar: string; // accent bar color
  decor: "dots" | "grid" | "swoosh";
  tint: boolean; // tinted section background
};
const tierMeta: Record<string, TierMeta> = {
  THINK: {
    eyebrow: "Strategy",
    num: "01",
    intro:
      "Set the direction. We work inside the team to pinpoint where data and AI create real value, then sequence a roadmap the business can execute, grounded in what the data can support today.",
    num_cls: "text-primary/15",
    bar: "bg-primary",
    decor: "dots",
    tint: false,
  },
  BUILD: {
    eyebrow: "Engineering",
    num: "02",
    intro:
      "Make it real. We build it alongside the team: the governed foundation on Snowflake that AI actually needs, then the pipelines, models, and agents that run on it, integrated with the systems the business runs on.",
    num_cls: "text-secondary/15",
    bar: "bg-secondary",
    decor: "grid",
    tint: true,
  },
  GROW: {
    eyebrow: "Enablement",
    num: "03",
    intro:
      "Compound the value. The team scales AI use cases and agents into production with our people alongside, and keeps improving them long after we step back.",
    num_cls: "text-accent/15",
    bar: "bg-accent",
    decor: "swoosh",
    tint: false,
  },
};

const engagementModels = [
  {
    title: "Fixed cost",
    body: "A defined scope, timeline, and price agreed up front. Best when the outcome is clear and budget certainty matters from day one.",
    how: "We scope the work in a short, paid discovery, then commit to a price and a date.",
    includes: ["Scoped statement of work", "Milestones with decision gates", "Change control if scope moves"],
    bestFor: "Defined foundation builds & migrations",
  },
  {
    title: "Time & materials",
    body: "Flexible, iterative delivery billed by effort against a shared backlog. Ideal for evolving requirements and discovery-led work.",
    how: "We deliver sprint to sprint against a prioritized backlog the business controls.",
    includes: ["Prioritized, shared backlog", "Sprint demos & burn reporting", "Stop or pivot any sprint"],
    bestFor: "Discovery, POCs & evolving scope",
  },
  {
    title: "Team augmentation",
    body: "Embed our certified practitioners alongside the in-house team. We accelerate delivery while leveling up their capability.",
    how: "SnowPro-certified engineers join the team, its tools, and its ways of working.",
    includes: ["Snowflake depth at every level", "Knowledge transfer built in", "Scale up or down monthly"],
    bestFor: "Scaling an existing team fast",
  },
  {
    title: "Managed services & support",
    body: "Ongoing run, optimization, and enhancement once the practice is live, so it keeps compounding while the in-house team grows into it.",
    how: "A retained team monitors, tunes cost and performance, and ships enhancements.",
    includes: ["Monitoring & cost optimization", "SLAs and a named contact", "A roadmap of enhancements"],
    bestFor: "Running & growing a live Snowflake estate",
  },
];

// What every client gets regardless of which model they choose: the UVP.
const engagementValue = [
  { title: "One certified team, with depth at every level", body: "One accountable team: the people who scope the work are the ones who deliver it." },
  { title: "Verified Snowflake depth", body: "A SnowPro-certified team with a verified Snowflake delivery record behind every decision, from strategy through production." },
  { title: "Priced to outcomes", body: "Scope and price agreed up front, whichever model fits." },
  { title: "Governance built in", body: "Security, lineage, and access control designed in from the first table, not bolted on." },
  { title: "Handover and enablement", body: "Full handover, documentation, and enablement so the team runs it confidently." },
  { title: "Integrated with the enterprise", body: "Data products that connect to and from the systems the business runs on: ERP, CRM, and customer-facing apps." },
];

const costFactors =
  "Engagements are scoped on data volume and source complexity, the number of analytics and AI use cases, team size, and timeline. We agree scope and price up front (whichever model fits) so there are no surprises.";

// What a CXO gets, framed by horizon rather than feature.
const impactByPhase = [
  {
    phase: "First 8–16 weeks",
    title: "Foundations & first value",
    body: "A governed Snowflake foundation stood up, priority data flowing, and the first production dashboards live: value from sprint one, not after a year-long build.",
  },
  {
    phase: "6–12 months",
    title: "Scale & self-service",
    body: "Analytics and AI use cases rolled out across teams, self-service adopted, and manual reporting retired: decisions run on current, trusted numbers.",
  },
  {
    phase: "18+ months",
    title: "Compounding advantage",
    body: "New use cases shipped in weeks, run cost tuned, and a team fluent enough to keep extending it on their own: data and AI become a durable competitive edge.",
  },
];

// How we de-risk the engagement itself (the buying objection executives raise).
const runPhases = [
  {
    label: "Timeline",
    title: "A fixed 8–16 week arc",
    body: "Most initial builds reach production in 8–16 weeks: a paid discovery fixes scope and price up front, and every sprint closes with working software, so value lands from sprint one.",
  },
  {
    label: "Steering",
    title: "Steering & transparency",
    body: "Regular steering reviews, a shared backlog, and clear decision gates keep sponsors in control of scope, budget, and priorities throughout.",
  },
  {
    label: "Proof",
    title: "De-risked by design",
    body: "We prove the approach with a focused proof of concept before the full build, so the commitment to scale rests on evidence, not a slide deck.",
  },
  {
    label: "Handover",
    title: "Built to hand over",
    body: "Documentation, enablement, and a transition plan in every engagement, so the team runs and extends the work confidently.",
  },
];

export default async function ServicesPage() {
  const [tiers, faqs] = await Promise.all([
    getServicesByTier(),
    getSetting<{ q: string; a: string }[]>("faqs"),
  ]);

  const provider = {
    "@type": "Organization",
    name: theme.brand.name,
    url: theme.brand.url,
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${theme.brand.name} services`,
    itemListElement: tiers.flatMap(({ tier, services }) =>
      services.map((service) => ({
        "@type": "Service",
        name: service.title,
        ...(service.summary ? { description: service.summary } : {}),
        serviceType: tier,
        areaServed: "Americas",
        provider,
      })),
    ),
  };

  return (
    <>
      <JsonLd data={[serviceLd, breadcrumbLd([{ name: "Home", url: "/" }, { name: "Services" }])]} />
      <PageHero
        eyebrow="Services"
        title={
          <>
            From strategy to the{" "}
            <ScrollHighlight color="cyan">
              <span className="text-gradient">agentic enterprise</span>
            </ScrollHighlight>
            .
          </>
        }
        description="Strategy, engineering, and enablement under one accountable team, building two capabilities that stay in-house: a data practice decisions can trust and an AI practice that ships to production, across THINK, BUILD, and GROW."
        footer={<TrustLogos />}
      />

      {tiers.map(({ tier, services }, tierIdx) => {
        const meta = tierMeta[tier];
        // Running two-digit index across the whole page (01…06).
        const offset = tiers
          .slice(0, tierIdx)
          .reduce((n, t) => n + t.services.length, 0);
        return (
          <Section
            key={tier}
            className={`relative overflow-hidden ${meta?.tint ? "section-tint" : ""}`}
          >
            <SectionDecor variant={meta?.decor ?? "dots"} />
            <div className="relative">
              {/* tier header */}
              <div className="flex items-end gap-5">
                <span
                  className={`font-display text-7xl font-bold leading-[0.8] ${meta?.num_cls}`}
                >
                  {meta?.num}
                </span>
                <div className="pb-1">
                  <p className="eyebrow mb-1">{meta?.eyebrow}</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {tier}
                  </h2>
                </div>
              </div>
              <div className={`mt-5 h-1 w-16 rounded-full ${meta?.bar}`} />
              <p className="mt-5 max-w-2xl text-lg text-muted">{meta?.intro}</p>

              {/* services grid */}
              <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2" variant="pop">
                {services.map((service, i) => {
                  const tools = asStringArray(service.tools);
                  return (
                    <LedgerCard
                      key={service.slug}
                      eyebrow={meta?.eyebrow ?? tier}
                      index={String(offset + i + 1).padStart(2, "0")}
                      title={service.title}
                      foot={
                        tools.length > 0
                          ? ["Tools", tools.join(" · ")]
                          : undefined
                      }
                    >
                      <p>{service.summary}</p>
                      {service.body && (
                        <div className="prose-vn mt-3 text-sm">
                          <Markdown>{service.body}</Markdown>
                        </div>
                      )}
                    </LedgerCard>
                  );
                })}
              </RevealGroup>
            </div>
            {meta?.tint && <WaveDivider position="bottom" fill="fill-background" />}
          </Section>
        );
      })}

      {/* AGENTIC AI: the control-plane thesis + the AI we deliver on it */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            size="hero"
            eyebrow="Where this is heading"
            title={
              <>
                Ready for{" "}
                <ScrollHighlight color="cyan">
                  <span className="text-gradient">agents that act</span>
                </ScrollHighlight>
                .
              </>
            }
            intro="An AI practice ready for agents does not start with agents. It starts with governed data and trusted context: one layer where data, business context, models, and workflows come together. We build that layer with the team, so when the agents act, they act on numbers the business trusts."
          />
          <p className="mt-6 max-w-2xl text-sm text-muted">
            See the AI we put into production in our{" "}
            <Link href="/case-studies" className="font-semibold text-primaryDeep link-underline">
              case studies
            </Link>
            , and how we pick the model for each job on{" "}
            <Link href="/data-ai" className="font-semibold text-primaryDeep link-underline">
              data &amp; AI
            </Link>
            .
          </p>
          <div className="mt-10 max-w-3xl">
            <InlineCta
              title="Our thesis: the agentic enterprise runs on one governed layer of data and context"
              href="/blog/snowflake-control-plane-agentic-enterprise"
              label="Read the thesis"
            />
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Business impact"
          title="What changes, and when"
          intro="A practical view of the value an engagement returns: by horizon, not by feature list, with the targets we agree up front."
        />
        <div className="mt-12">
          <MetricBand
            metrics={[
              { value: "60%", label: "Faster time to first insight" },
              { value: "3×", label: "More reliable pipelines" },
              { value: "40%", label: "Lower run cost" },
            ]}
          />
        </div>
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {impactByPhase.map((p, i) => (
            <PlateCard key={p.phase} label={p.phase} refCode={`H${i + 1}`} title={p.title}>
              {p.body}
            </PlateCard>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow="How engagements run"
            title="Delivery leaders can govern"
            intro="We de-risk the engagement itself (clear timelines, steering, and a clean handover) so the buy is as low-risk as the outcome is valuable."
          />
          <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
            {runPhases.map((r) => (
              <LedgerCard key={r.title} eyebrow={r.label} title={r.title}>
                {r.body}
              </LedgerCard>
            ))}
          </RevealGroup>
          <p className="mt-8 text-sm text-muted">
            Security and governance are built into every phase:{" "}
            <Link href="/security" className="font-semibold text-primaryDeep hover:underline">
              see how we keep enterprise data safe
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* The stack itself lives on /platform (single source of truth); this is
          just the scent trail. */}
      <Section className="section-warm">
        <SectionHeading
          eyebrow={<><SnowMark size={11} />What we build on</>}
          title="Why we build Snowflake-native"
          intro="Openflow to Horizon Catalog to Cortex: we lead with Snowflake-native products over third-party tools, so there is one governed copy of the data, one lineage to audit, and one trusted context every AI agent relies on. dbt is the one external framework we run, natively against Snowflake."
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <InlineCta
            title="See the full stack, layer by layer, with what's GA and what's ahead"
            href="/platform"
            label="Explore the platform"
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow="How we work"
          title="Engagement models"
          intro="Flexible ways to partner with us, matched to the shape of the problem, from a fixed-scope build to an embedded team or an ongoing managed service. Whichever model fits, the way we deliver doesn't change."
        />
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {engagementModels.map((m, i) => (
            <LedgerCard key={m.title} eyebrow={m.title} index={`0${i + 1}`} foot={["Best for", m.bestFor]}>
              <p className="text-muted">{m.body}</p>
              <p className="mt-4 leading-relaxed text-foreground/90">
                <span className="font-semibold">How it works:</span> {m.how}
              </p>
              <ul className="mt-3 space-y-1.5">
                {m.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted">
                    <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primaryDeep/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </LedgerCard>
          ))}
        </RevealGroup>

        {/* UVP: what's constant across every model */}
        <div className="panel-warm mt-12 rounded-3xl p-8 md:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Constant across every model</p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              The model flexes. The standard doesn&rsquo;t.
            </h3>
            <p className="mt-3 text-muted">
              However an organization chooses to engage, every Viewnear engagement is delivered to the same standard: the things that make the difference between a build that ships and one that stalls.
            </p>
          </div>
          <RevealGroup className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3" variant="fade-up">
            {engagementValue.map((v) => (
              <div key={v.title} className="flex gap-3">
                <span className="mt-1 shrink-0 text-primaryDeep" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l4 4 10-11" />
                  </svg>
                </span>
                <div>
                  <h4 className="font-display font-bold text-foreground">{v.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </div>
            ))}
          </RevealGroup>
          <LeadershipStrip label="One accountable team." className="mt-8 border-t border-border pt-6" />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-6">
          <p className="eyebrow mb-2">What drives cost</p>
          <p className="text-muted">{costFactors}</p>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Not sure which model fits? Tell us the problem and we&rsquo;ll recommend one.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary btn-sm">
              Discuss an engagement
            </Link>
            <Link href="/partnership#comparison" className="btn-ghost btn-sm">
              Build vs. partner →
            </Link>
          </div>
        </div>
      </Section>

      {faqs && faqs.length > 0 && (
        <Section>
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="max-w-3xl mt-12 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card group">
                <summary className="font-display text-lg font-bold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-primary text-2xl ml-4 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-muted mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
