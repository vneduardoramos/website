import Link from "next/link";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { AnthropicMark } from "@/components/marketing/ProviderMark";
import { LedgerCard } from "@/components/marketing/Cards";
import { Interplay } from "@/components/marketing/data-ai/Interplay";
import { BuiltWithAnthropic } from "@/components/marketing/data-ai/BuiltWithAnthropic";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const metadata = pageMeta({
  title: "Data + AI: agents inside Snowflake and in the flow of work",
  description:
    "Agents that reason over governed data inside Snowflake and act in the tools teams already use, and the interplay between them. Built with Claude as an Anthropic partner, in production in 8–16 weeks.",
  path: "/data-ai",
});

const HERO_CHIPS = ["Inside Snowflake + in the field", "Grounded in governed data", "Built with Claude", "In production, not a lab"];

// What we actually ship: concrete use cases, each with its Snowflake mechanism
// and, where one exists, the real (anonymized) engagement that proves it.
const USE_CASES = [
  {
    eyebrow: "Documents",
    title: "Paperwork that reads itself",
    body: "Claims, invoices, and contracts classified, extracted, and routed in seconds instead of hand-sorted piles. The document backlog becomes a table teams can query.",
    mech: "AI_CLASSIFY · AI_EXTRACT · PARSE_DOCUMENT",
    stat: "60→95% accuracy · 4 sec per document",
    proof: { label: "Read the engagement →", href: "/case-studies/insurance-claims-cortex-ai" },
  },
  {
    eyebrow: "Answers",
    title: "Executives who ask the data directly",
    body: "Plain-language questions answered with citations against governed definitions, so the Monday meeting starts from the same number, not three versions of it.",
    mech: "Cortex Analyst · Semantic Views · CoWork",
    stat: "Thousands of runaway SKUs, one catalog agent",
    proof: { label: "Read the engagement →", href: "/case-studies/sku-catalog-governance" },
  },
  {
    eyebrow: "Foresight",
    title: "Churn and failures, flagged early",
    body: "Models on usage, billing, and sensor data that surface at-risk customers and equipment before the quarter ends, with the reasons attached.",
    mech: "Cortex ML · Snowpark",
  },
  {
    eyebrow: "Search",
    title: "Documents, searched by meaning",
    body: "Policies, contracts, and wikis answered directly, with sources cited. Retrieval grounded in the organization's own content, so answers stay accurate and current.",
    mech: "Cortex Search · RAG",
  },
  {
    eyebrow: "Agents",
    title: "Agents that act, inside policy",
    body: "AI that does the next step, not just describes it: drafting the response, filing the update, kicking off the workflow, each action inside per-agent permissions with a full audit trail.",
    mech: "Cortex Agents · AI Agent Identity",
  },
  {
    eyebrow: "Embedded",
    title: "AI where teams already work",
    body: "Answers and actions flowing back into the ERP, CRM, and apps the business runs on, so nobody has to visit another dashboard to benefit.",
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
                Agents that act where work happens,{" "}
                <ScrollHighlight>on data teams can trust.</ScrollHighlight>
              </>
            }
            description="The value of AI shows up when agents reason over governed data inside Snowflake and take the next action in the tools teams already use. We build both, and the interplay between them, with Claude as an Anthropic partner. Proven small first, in production in 8–16 weeks."
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

      {/* THE THESIS, SHOWN: two planes that interplay. The contrasting kick
          right after the light hero. */}
      <Section className="section-tint relative overflow-hidden">
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="Two planes, one governed loop"
            intro="Agents run in two places. Inside Snowflake, they reason over governed data without moving it. In the flow of work, Claude takes the next action where teams already are. The point is the interplay: a request crosses both and comes back cited, in policy, and logged."
          />
          <div className="mt-12">
            <Interplay />
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* WHAT WE SHIP: the dark kick. White cards on deep indigo, real
          engagement numbers on the proven ones. */}
      <Section>
        <div className="panel-indigo relative overflow-hidden rounded-3xl p-7 shadow-xl md:p-12">
          <div className="relative">
            <div className="max-w-2xl">
              <p className="eyebrow eyebrow--invert mb-4">What we ship</p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.08]">
                Six jobs, running across both planes.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
                Each one reasons over governed data inside Snowflake and shows up where teams
                work. Where a real engagement proves it, the numbers are on the card.
              </p>
            </div>
            <RevealGroup className="mt-10 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
              {USE_CASES.map((u) => (
                <LedgerCard key={u.title} eyebrow={u.eyebrow} title={u.title} foot={["Runs on", u.mech]}>
                  <p>{u.body}</p>
                  {u.stat && (
                    <p className="mt-3 font-mono text-[0.78rem] font-semibold text-primaryDeep">
                      {u.stat}
                    </p>
                  )}
                  {u.proof && (
                    <p className="mt-1.5">
                      <Link
                        href={u.proof.href}
                        className="text-sm font-semibold text-primaryDeep underline-offset-4 hover:underline"
                      >
                        {u.proof.label}
                      </Link>
                    </p>
                  )}
                </LedgerCard>
              ))}
            </RevealGroup>
            <p className="mt-8 text-center text-sm text-white/70">
              A use case we haven&rsquo;t listed? If the data can carry it, we can ship it.{" "}
              <Link href="/contact" className="font-semibold text-white underline-offset-4 hover:underline">
                Tell us the job &rarr;
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* Governed by default: the governance that spans both planes */}
      <Section className="section-warm relative overflow-hidden">
        <FeatureSplit
          eyebrow="Governed by default"
          title="One perimeter, one identity, both planes"
          body="Inference runs inside the business's Snowflake account, so prompts and results stay within the same perimeter as the data. Agents in the field reach it through governed endpoints, never raw copies, acting as verifiable identities with per-agent permissions. Access, masking, and lineage carry across both planes, and Cortex guardrails screen every call."
          bullets={[
            "Models run next to governed data: no copies, no export",
            "Every agent acts as one governed identity, inside or out",
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

      {/* The Anthropic moment: partner + Claude as default, on both planes */}
      <Section>
        <BuiltWithAnthropic />
      </Section>

      {/* Proof */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow="Credentials"
          title="Certified to run AI on enterprise data"
          intro="Every model runs under Snowflake's independently audited controls, delivered by a SnowPro-certified team that does this every day, and, as an Anthropic partner, builds with Claude."
        />
        <div className="mt-12 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted">
          <AnthropicMark size={16} />
          Anthropic partner, building with Claude
        </p>
      </Section>

      <CtaBand
        title="Put the right agent on the work."
        subtitle="Tell us the use case. We'll bring Claude, the governance, and the people to ship it into production with the team, inside Snowflake and in the flow of work."
      />
    </>
  );
}
