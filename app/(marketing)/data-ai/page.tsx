import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { ModelWall } from "@/components/marketing/ModelWall";
import { ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const metadata = pageMeta({
  title: "Data + AI: every major model, on your governed data",
  description:
    "Snowflake Cortex runs leading LLMs next to your governed data with no data movement. Viewnear helps you pick the right model per use case and ship it.",
  path: "/data-ai",
});

const HERO_CHIPS = ["14+ models", "6 leading labs", "Runs in your Snowflake", "Governed by default"];

const METRICS = [
  { value: "14+", label: "Models in Cortex" },
  { value: "6", label: "Leading labs, one interface" },
  { value: "0", label: "Data movement" },
  { value: "1 line", label: "To swap models" },
];

export default function DataAiPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Data + AI"
            title={
              <>
                New models ship every week.{" "}
                <ScrollHighlight>Your data foundation shouldn&rsquo;t.</ScrollHighlight>
              </>
            }
            description="Snowflake Cortex runs the leading models from every major lab right next to your governed data, with no data movement. We help you pick the right one for each use case, ground it in your data, and put it in production."
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

      {/* Showpiece: the model wall + swap-models SQL */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="Model-agnostic"
            title="One foundation. Every major model."
            intro="Anthropic, OpenAI, Meta, Mistral, Google, and DeepSeek, all callable on your governed data. Move between them with a single line of SQL as better models arrive."
          />
          <div className="mt-14">
            <ModelWall />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted">
            Model and provider names and logos are trademarks of their respective owners,
            shown to indicate availability in Snowflake Cortex. Model lineup varies by region.
          </p>
        </div>
      </Section>

      {/* Governed by default */}
      <Section className="section-warm relative overflow-hidden">
        <FeatureSplit
          eyebrow="Governed by default"
          title="AI without shipping your data out"
          body="Inference runs inside your Snowflake account, so prompts and results stay within the same perimeter as your data. Every call inherits the access controls, lineage, and Horizon governance you already trust, with Cortex guardrails screening for prompt injection and unsafe output."
          bullets={[
            "Models run next to governed data: no copies, no export",
            "Access, masking, and lineage inherited from Snowflake Horizon",
            "Cortex Guard and AI guardrails on every call",
          ]}
          image="/assets/images/photos/data-foundation.jpg"
          imageAlt="A governed Snowflake data foundation"
          ratio="wide-text"
        />
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The right model for each job */}
      <Section>
        <FeatureSplit
          eyebrow="The right model for each job"
          title="We match the model to the work"
          body="There is no single best model, only the best model for a task, a budget, and a latency target. We benchmark the options against your real use cases, fine-tune on your data where it earns its keep, and ground answers in your content with Cortex Search. As stronger models ship, we re-evaluate and switch."
          bullets={[
            "Model selection benchmarked per use case: quality, cost, latency",
            "Fine-tuning and retrieval grounding on your own data",
            "Evaluate and swap as the frontier moves",
          ]}
          image="/assets/images/photos/ai-teams.jpg"
          imageAlt="The Viewnear team delivering AI use cases"
          reverse
          cta={{ label: "How we deliver", href: "/approach" }}
        />
      </Section>

      {/* By the numbers + link out to Cortex depth */}
      <Section className="section-warm">
        <MetricBand metrics={METRICS} />
        <p className="mt-10 text-center text-sm text-muted">
          Want the full Cortex stack (Analyst, Search, Agents, AISQL)?{" "}
          <Link href="/solutions" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
            See our solutions &rarr;
          </Link>
        </p>
      </Section>

      {/* Proof */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow="Backed by Snowflake"
          title="Certified to run AI on enterprise data"
          intro="Model inference inherits Snowflake's independently audited controls, delivered by a SnowPro-certified team that does this every day."
        />
        <div className="mt-12 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
      </Section>

      <CtaBand
        title="Put the right model on your data."
        subtitle="Tell us the use case. We'll bring the model, the governance, and the team to ship it on Snowflake."
      />
    </>
  );
}
