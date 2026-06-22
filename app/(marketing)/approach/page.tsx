import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Methodology } from "@/components/marketing/home/Methodology";

export const metadata = pageMeta({
  title: "Our Approach",
  description:
    "How Viewnear delivers: a proven Snowflake methodology plus engagement governance that de-risks the buy with fixed timelines, steering reviews, POC-before-build gates, and a clean hand-over.",
  path: "/approach",
});

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

const impactByPhase = [
  {
    phase: "First 90 days",
    title: "Foundations & first value",
    body: "A governed Snowflake foundation stood up, priority data flowing, and the first production dashboards live.",
  },
  {
    phase: "6–12 months",
    title: "Scale & self-service",
    body: "Analytics and AI use cases rolled out across teams; self-service adopted and manual reporting retired.",
  },
  {
    phase: "18+ months",
    title: "Compounding advantage",
    body: "New use cases shipped in weeks, run cost tuned, and a team fluent enough to keep extending it on their own.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <PageHero
            eyebrow="Our approach"
            title={
              <>
                Delivery you can <span className="text-gradient">govern</span>.
              </>
            }
            description="A proven Snowflake methodology, plus the governance that de-risks the engagement itself, so the buy is as low-risk as the outcome is high."
          />
        </div>
      </div>

      {/* The six-step methodology (shared with home) */}
      <Methodology />

      {/* How engagements run */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow="How engagements run"
            title="De-risked, start to finish"
            intro="Clear timelines, steering, and a clean hand-over: the questions every sponsor asks, answered up front."
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4">
            {runPhases.map((r) => (
              <div key={r.title} className="card flex h-full flex-col">
                <h3 className="font-display text-lg font-bold text-foreground">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-surface2" />
      </Section>

      {/* Value by horizon */}
      <Section className="section-warm">
        <SectionHeading
          eyebrow="Business impact"
          title="What changes, and when"
          intro="A practical view of the value an engagement returns, by horizon, not by feature list."
        />
        <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3">
          {impactByPhase.map((p) => (
            <div key={p.phase} className="card card-hover flex h-full flex-col bg-background">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
                {p.phase}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">{p.title}</h3>
              <p className="mt-3 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <FeaturedCaseStudies tint title="How it plays out in practice" />

      <CtaBand />
    </>
  );
}
