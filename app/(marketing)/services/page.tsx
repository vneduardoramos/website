import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import {
  Section,
  SectionHeading,
  Pill,
  TestimonialCard,
  CtaBand,
} from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import { MetricBand, InlineCta } from "@/components/marketing/Blocks";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import {
  CompassIcon,
  DatabaseIcon,
  PipelineIcon,
  ChartIcon,
  CpuIcon,
  RocketIcon,
  SnowflakeIcon,
} from "@/components/marketing/home/Icons";
import { getServicesByTier, getSetting, getTestimonials } from "@/lib/queries";
import { asStringArray } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";

import type { ComponentType, SVGProps } from "react";
const SERVICE_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "ai-data-strategy": CompassIcon,
  "cloud-architecture": DatabaseIcon,
  "data-engineering": PipelineIcon,
  "data-visualisation": ChartIcon,
  "embedded-analytics": CpuIcon,
  "capability-development": RocketIcon,
};

export const metadata = pageMeta({
  title: "Services: THINK · BUILD · GROW",
  description:
    "THINK, BUILD, GROW: strategy, engineering, and enablement for modern data and AI on Snowflake.",
  path: "/services",
});

type TierMeta = {
  eyebrow: string;
  num: string;
  intro: string;
  tile: string; // icon tile bg (static class for Tailwind)
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
      "Set the direction. We align your data and AI ambitions with measurable business outcomes before a single pipeline is built.",
    tile: "bg-primary",
    num_cls: "text-primary/15",
    bar: "bg-primary",
    decor: "dots",
    tint: false,
  },
  BUILD: {
    eyebrow: "Engineering",
    num: "02",
    intro:
      "Make it real. We design and ship the data foundations, pipelines, and models that turn strategy into working systems.",
    tile: "bg-secondary",
    num_cls: "text-secondary/15",
    bar: "bg-secondary",
    decor: "grid",
    tint: true,
  },
  GROW: {
    eyebrow: "Enablement",
    num: "03",
    intro:
      "Compound the value. We help your teams operate, scale, and continuously improve what we build together.",
    tile: "bg-accent",
    num_cls: "text-accent/15",
    bar: "bg-accent",
    decor: "swoosh",
    tint: false,
  },
};

const engagementModels = [
  {
    title: "Fixed cost",
    body: "A defined scope, timeline, and price agreed up front. Best when the outcome is clear and you want budget certainty from day one.",
    how: "We scope the work in a short, paid discovery, then commit to a price and a date.",
    includes: ["Scoped statement of work", "Milestones with decision gates", "Change control if scope moves"],
    bestFor: "Defined platform builds & migrations",
  },
  {
    title: "Time & materials",
    body: "Flexible, iterative delivery billed by effort against a shared backlog. Ideal for evolving requirements and discovery-led work.",
    how: "We deliver sprint to sprint against a prioritized backlog you control.",
    includes: ["Prioritized, shared backlog", "Sprint demos & burn reporting", "Stop or pivot any sprint"],
    bestFor: "Discovery, POCs & evolving scope",
  },
  {
    title: "Team augmentation",
    body: "Embed our certified practitioners alongside yours. We accelerate delivery while leveling up your in-house capability.",
    how: "SnowPro-certified engineers join your team, tools, and ways of working.",
    includes: ["Certified, versed at every level", "Knowledge transfer built in", "Scale up or down monthly"],
    bestFor: "Scaling an existing team fast",
  },
  {
    title: "Managed & support",
    body: "Ongoing run, optimization, and enhancement once you're live, so your data and AI keep paying off without a permanent in-house team.",
    how: "A retained team monitors, tunes cost and performance, and ships enhancements.",
    includes: ["Monitoring & cost optimization", "SLAs and a named contact", "A roadmap of enhancements"],
    bestFor: "Running & growing a live platform",
  },
];

// What every client gets regardless of which model they choose: the UVP.
const engagementValue = [
  { title: "One certified team, versed at every level", body: "One accountable team: the people who scope your work are the ones who deliver it." },
  { title: "Premier & CoCo Preferred Partner", body: "A SnowPro-certified team and a verified, end-to-end Snowflake delivery track record." },
  { title: "Priced to outcomes", body: "Scope and price agreed up front, whatever the model, so there are no surprises." },
  { title: "Governance built in", body: "Security, lineage, and access control designed in from the first table, not bolted on." },
  { title: "Handover and enablement", body: "Full handover, documentation, and enablement so your team runs it confidently." },
  { title: "Delivered across the Americas", body: "Aligned to your region, data residency, and time zone, under one accountable partner." },
];

const costFactors =
  "Engagements are scoped on data volume and source complexity, the number of analytics and AI use cases, team size, and timeline. We agree scope and price up front (whichever model you choose) so there are no surprises.";

// What a CXO gets, framed by horizon rather than feature.
const impactByPhase = [
  {
    phase: "First 90 days",
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
    title: "A fixed 8–16 week arc",
    body: "Most initial platforms reach production in 8–16 weeks, scoped to your data and use cases, with value delivered from the first sprint.",
  },
  {
    title: "Steering & transparency",
    body: "Regular steering reviews, a shared backlog, and clear decision gates keep sponsors in control of scope, budget, and priorities throughout.",
  },
  {
    title: "De-risked by design",
    body: "We prove the approach with a focused proof of concept before the full build, so you commit to scale on evidence, not a slide deck.",
  },
  {
    title: "Built to hand over",
    body: "Documentation, enablement, and a transition plan in every engagement, so your team runs and extends the work confidently.",
  },
];

const stack = [
  {
    layer: "Foundation",
    name: "Snowflake",
    body: "The single governed platform every layer runs on: one copy of your data, one place to secure, and one lineage to audit.",
  },
  {
    layer: "Ingestion",
    name: "Openflow",
    body: "Managed integration on Apache NiFi for batch and streaming, so every source lands governed without bolting on a separate ETL vendor.",
  },
  {
    layer: "Transformation",
    name: "dbt",
    body: "Our transformation framework of choice, run natively against Snowflake for tested, documented, version-controlled models.",
  },
  {
    layer: "Engineering",
    name: "Snowpark",
    body: "Python, Java, and Scala pipelines and UDFs that execute next to the data: no movement, no separate compute to secure.",
  },
  {
    layer: "Open storage",
    name: "Apache Iceberg",
    body: "An open, governed copy of your data that stays portable and queryable by any engine, so you are never locked in.",
  },
  {
    layer: "Governance",
    name: "Horizon Catalog",
    body: "Lineage, access history, classification, and policy across your estate: the audit trail and trusted context AI depends on.",
  },
  {
    layer: "AI & agents",
    name: "Cortex",
    body: "LLM and ML functions that run securely beside governed data, from SQL-level calls to natural-language analytics.",
  },
  {
    layer: "Apps & consumption",
    name: "Streamlit",
    body: "Interactive data apps shipped right next to the data, so insight lands where people already work.",
  },
];

export default async function ServicesPage() {
  const [tiers, faqs, testimonials] = await Promise.all([
    getServicesByTier(),
    getSetting<{ q: string; a: string }[]>("faqs"),
    getTestimonials({ featured: true }),
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
      <JsonLd data={serviceLd} />
      <PageHero
        eyebrow="Services"
        title={
          <>
            From strategy to{" "}
            <ScrollHighlight color="cyan">
              <span className="text-gradient">scale</span>
            </ScrollHighlight>
            .
          </>
        }
        description="Three tiers of engagement (THINK, BUILD, GROW) covering the full lifecycle of your data and AI investments."
      />

      {tiers.map(({ tier, services }) => {
        const meta = tierMeta[tier];
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
              <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" variant="pop">
                {services.map((service) => {
                  const tools = asStringArray(service.tools);
                  const Icon = SERVICE_ICONS[service.slug] ?? SnowflakeIcon;
                  return (
                    <div key={service.slug} className="card card-hover flex flex-col">
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${meta?.tile} text-white shadow-md`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-muted">{service.summary}</p>
                      {service.body && (
                        <div className="prose-vn mt-3 text-sm">
                          <Markdown>{service.body}</Markdown>
                        </div>
                      )}
                      {tools.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-2 pt-6">
                          {tools.map((tool) => (
                            <Pill key={tool}>{tool}</Pill>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </RevealGroup>
            </div>
            {meta?.tint && <WaveDivider position="bottom" fill="fill-background" />}
          </Section>
        );
      })}

      <Section className="section-tint">
        <FeatureSplit
          eyebrow="The Snowflake stack"
          title={
            <>
              Built on Snowflake,{" "}
              <ScrollHighlight color="cyan">
                <span className="text-gradient">delivered end-to-end</span>
              </ScrollHighlight>
              .
            </>
          }
          body="We own the full journey, from architecture and ingestion to governed analytics and AI, on a single, scalable Snowflake foundation. No hand-offs, no fragmented stack."
          bullets={[
            "Cloud-native architecture designed around your data, not a template",
            "Automated, observable pipelines with built-in data quality checks",
            "Governed, role-based access and cost controls from day one",
            "Production-ready models and dashboards your teams actually use",
          ]}
          image="/assets/images/photos/datacenter.jpg"
          imageAlt="Modern data center powering the Snowflake platform"
          cta={{ label: "Talk to our team", href: "/contact" }}
        />
      </Section>

      <ShowcaseBand
        image="/assets/images/photos/network.jpg"
        imageAlt="Connected, governed data spanning the Americas"
        eyebrow="Why now"
        title={
          <>
            The data leaders of the Americas are{" "}
            <span className="text-secondary">already moving</span>.
          </>
        }
        body="AI advantage compounds. The teams putting a governed data foundation in place now are the ones shipping Cortex-powered products, while everyone else is still arguing about tooling."
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      <Section>
        <SectionHeading
          eyebrow="Outcomes we target"
          title="What engagements aim to deliver"
          intro="Outcomes we target, shaped by the engagement and the goals we agree up front."
        />
        <div className="mt-12">
          <MetricBand
            metrics={[
              { value: "60%", label: "Faster time to first insight" },
              { value: "3x", label: "More reliable pipelines" },
              { value: "40%", label: "Lower platform run cost" },
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Business impact"
          title="What changes, and when"
          intro="A practical view of the value an engagement returns: by horizon, not by feature list."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {impactByPhase.map((p) => (
            <div key={p.phase} className="card card-hover flex h-full flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
                {p.phase}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-muted">{p.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow="How engagements run"
            title="Delivery you can govern"
            intro="We de-risk the engagement itself (clear timelines, steering, and a clean hand-over) so the buy is as low-risk as the outcome is high."
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
            {runPhases.map((r) => (
              <div key={r.title} className="card card-pop flex h-full flex-col bg-background">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </RevealGroup>
          <p className="mt-8 text-sm text-muted">
            Security and governance are built into every phase:{" "}
            <Link href="/security" className="font-semibold text-primaryDeep hover:underline">
              see how we keep your data safe
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className="section-tint">
        <SectionHeading
          eyebrow="What we build on"
          title="The Snowflake-native stack we build on"
          intro="We build natively on Snowflake end to end, leading with these products over third-party tools. One governed copy of your data, one lineage to audit, and trusted context every AI agent can rely on."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
          {stack.map((s) => (
            <div key={s.name} className="card card-hover flex h-full flex-col bg-background">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
                {s.layer}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                {s.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </RevealGroup>
        <p className="mt-8 text-sm text-muted">
          dbt is the one external framework we run, natively against Snowflake. Everything
          else is Snowflake-native, so governance and AI context stay in one place.
        </p>
        <div className="mx-auto mt-12 max-w-3xl">
          <InlineCta
            title="See the full Snowflake-native stack we build on"
            href="/platform"
            label="Explore the platform"
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow="How we work"
          title="Engagement models"
          intro="Flexible ways to partner with us, matched to the shape of your problem, from a fixed-scope build to an embedded team or an ongoing managed service. Whichever you choose, the way we deliver doesn't change."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {engagementModels.map((m) => (
            <div key={m.title} className="card card-hover flex h-full flex-col">
              <h3 className="font-display text-xl font-bold text-foreground">{m.title}</h3>
              <p className="mt-3 text-muted">{m.body}</p>

              <p className="mt-5 text-sm leading-relaxed text-foreground/90">
                <span className="font-semibold">How it works:</span> {m.how}
              </p>

              <ul className="mt-4 space-y-2">
                {m.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-0.5 shrink-0 text-primaryDeep" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l4 4 10-11" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted">Best for</p>
                <p className="mt-1 font-semibold text-primaryDeep">{m.bestFor}</p>
              </div>
            </div>
          ))}
        </RevealGroup>

        {/* UVP: what's constant across every model */}
        <div className="mt-12 rounded-3xl border border-border bg-background p-8 md:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Constant across every model</p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              The model flexes. The standard doesn&rsquo;t.
            </h3>
            <p className="mt-3 text-muted">
              However you choose to engage, every Viewnear engagement is delivered to the same standard, the things that make the difference between a build that ships and one that stalls.
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
              Discuss your engagement
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

      {testimonials.length > 0 && (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow="Customer feedback"
            title="The impact teams describe"
          />
          <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" variant="fade-up">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </RevealGroup>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
