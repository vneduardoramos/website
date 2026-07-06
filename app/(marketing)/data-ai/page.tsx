import Link from "next/link";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { LedgerCard } from "@/components/marketing/Cards";
import { OneLineSwap } from "@/components/marketing/data-ai/OneLineSwap";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const metadata = pageMeta({
  title: "Data + AI: the use cases we ship on your governed data",
  description:
    "Document intelligence, cited answers, early-warning models, and agents that act: what Viewnear ships with Snowflake Cortex on governed data, in production.",
  path: "/data-ai",
});

const HERO_CHIPS = ["In production, not a lab", "Runs in your Snowflake", "Governed by default", "8–16 weeks to first value"];

// What we actually ship: concrete use cases, each with its Snowflake mechanism
// and, where one exists, the real (anonymized) engagement that proves it.
const USE_CASES = [
  {
    eyebrow: "Documents",
    title: "Paperwork that reads itself",
    body: "Claims, invoices, and contracts classified, extracted, and routed in seconds instead of hand-sorted piles. The document backlog becomes a table you can query.",
    mech: "AI_CLASSIFY · AI_EXTRACT · PARSE_DOCUMENT",
    proof: { label: "95% claims accuracy, in seconds →", href: "/case-studies/insurance-claims-cortex-ai" },
  },
  {
    eyebrow: "Answers",
    title: "Executives who ask the data directly",
    body: "Plain-language questions answered with citations against your governed definitions, so the Monday meeting starts from the same number, not three versions of it.",
    mech: "Cortex Analyst · Semantic Views · CoWork",
    proof: { label: "A catalog your teams can ask →", href: "/case-studies/sku-catalog-governance" },
  },
  {
    eyebrow: "Foresight",
    title: "Churn and failures, flagged early",
    body: "Models on your usage, billing, and sensor data that surface at-risk customers and equipment before the quarter ends, with the reasons attached.",
    mech: "Cortex ML · Snowpark",
  },
  {
    eyebrow: "Search",
    title: "Your documents, searched by meaning",
    body: "Policies, contracts, and wikis answered from directly, with sources cited. Retrieval grounded in your content, so answers stay accurate and current.",
    mech: "Cortex Search · RAG",
  },
  {
    eyebrow: "Agents",
    title: "Agents that act, inside policy",
    body: "AI that does the next step, not just describes it: drafting the response, filing the update, kicking off the workflow, each action inside per-agent permissions with a full audit trail.",
    mech: "Cortex Agents · AI Agent Identity",
  },
  {
    eyebrow: "In your tools",
    title: "AI where your teams already work",
    body: "Answers and actions flowing back into the ERP, CRM, and apps your business runs on, so nobody has to visit another dashboard to benefit.",
    mech: "Streamlit · APIs · Zero-Copy Integrations",
  },
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
                Six jobs your data could be doing{" "}
                <ScrollHighlight>by next quarter.</ScrollHighlight>
              </>
            }
            description="Reading the paperwork, answering your executives, flagging churn before it lands, acting inside policy. This is what we ship with Snowflake Cortex on governed data: in production, in weeks, in the tools your teams already use."
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

      {/* THE DELIVERABLES: what data + AI actually does, with proof attached */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="What we deliver"
            title="The use cases we ship"
            intro="Every one runs next to your governed data inside Snowflake, and every one is built to land in production, not a lab. Where a real engagement proves it, the link is right there."
          />
          <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {USE_CASES.map((u) => (
              <LedgerCard key={u.title} eyebrow={u.eyebrow} title={u.title} foot={["Runs on", u.mech]}>
                <p>{u.body}</p>
                {u.proof && (
                  <p className="mt-3">
                    <Link
                      href={u.proof.href}
                      className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
                    >
                      {u.proof.label}
                    </Link>
                  </p>
                )}
              </LedgerCard>
            ))}
          </RevealGroup>
          <p className="mt-8 text-center text-sm text-muted">
            A use case we haven&rsquo;t listed? If the data can carry it, we can ship it.{" "}
            <Link href="/contact" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
              Tell us the job &rarr;
            </Link>
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
          ratio="wide-visual"
          visual={
            /* Real product screen, in the ProductShots browser-frame treatment. */
            <figure>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                <div aria-hidden className="flex items-center gap-1.5 border-b border-border bg-surface2 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-red/70" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <span className="h-2 w-2 rounded-full bg-success/80" />
                </div>
                <Image
                  src="/assets/images/product/cowork-home.webp"
                  alt="Snowflake CoWork answering questions with cited results from governed data"
                  width={1920}
                  height={860}
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="w-full"
                />
              </div>
              <figcaption className="mt-3 px-1 text-sm text-muted">
                Snowflake CoWork answering from governed data (demo environment).
              </figcaption>
            </figure>
          }
        />
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The model question, answered once: never locked, benchmarked per job */}
      <Section>
        <OneLineSwap />
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Anthropic, OpenAI, Meta, Mistral, Google, and DeepSeek are all callable in Snowflake
          Cortex; we benchmark per use case on quality, cost, and latency, and switch when the
          frontier moves. Names are trademarks of their respective owners; lineup varies by region.
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
