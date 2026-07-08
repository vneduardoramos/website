import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Methodology } from "@/components/marketing/home/Methodology";
import { ApproachStory } from "@/components/marketing/approach/ApproachStory";
import { PlateCard } from "@/components/marketing/Cards";
import { RevealGroup } from "@/components/marketing/Motion";

export const metadata = pageMeta({
  title: "Our approach",
  description:
    "How Viewnear delivers on Snowflake: use-case-driven sprints, proof before scale, and engagement governance, with fixed timelines, steering reviews, POC gates, and a clean handover.",
  path: "/approach",
});

const runPhases = [
  {
    title: "A fixed 8–16 week arc",
    body: "Most initial builds reach production in 8–16 weeks: a paid discovery fixes scope and price up front, and every sprint closes with working software, so value lands from sprint one.",
  },
  {
    title: "Steering & transparency",
    body: "Regular steering reviews, a shared backlog, and clear decision gates keep sponsors in control of scope, budget, and priorities throughout.",
  },
  {
    title: "Proof before scale",
    body: "We prove the approach with a focused proof of concept before the full build, so the commitment to scale rests on evidence, not a slide deck.",
  },
  {
    title: "Built to hand over",
    body: "Runbooks, documentation, and enablement sessions ship with the build, plus a transition plan that names who runs what when we step back.",
  },
];

const impactByPhase = [
  {
    phase: "First 8–16 weeks",
    title: "Foundations & first value",
    body: "A governed foundation on Snowflake stood up, priority data flowing, and the first production dashboards live: the data practice takes root.",
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
                Delivery leaders can <span className="text-gradient">govern</span>.
              </>
            }
            description="Use-case-driven sprints with working software at every demo, plus the governance that de-risks the engagement itself, so sponsors always know where the work stands."
          />
        </div>
      </div>

      {/* The centerpiece: the engagement narrated from the sponsor's seat */}
      <Section>
        <SectionHeading
          eyebrow="The experience"
          title="What an engagement feels like from the sponsor's seat"
          intro="The reviews the sponsor runs, the demos the team watches, and the decisions that stay in-house: one engagement, from the first scoping session to handover."
        />
        <ApproachStory />
      </Section>

      {/* The six-step methodology (shared with home) */}
      <Methodology />

      {/* How engagements run */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow="How engagements run"
            title="Checkpoints sponsors control"
            intro="Clear timelines, steering, and a clean handover: the questions every sponsor asks, answered up front."
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
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {impactByPhase.map((p, i) => (
            <PlateCard key={p.phase} label={p.phase} refCode={`H${i + 1}`} title={p.title}>
              {p.body}
            </PlateCard>
          ))}
        </RevealGroup>
      </Section>

      <FeaturedCaseStudies tint title="How it plays out in practice" />

      <CtaBand />
    </>
  );
}
