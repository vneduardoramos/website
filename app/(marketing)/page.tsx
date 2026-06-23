import Link from "next/link";
import { Img as Image } from "@/components/marketing/Img";
import type { Metadata } from "next";
import { getSetting, getServices, safe } from "@/lib/queries";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { theme } from "@/config/theme";
import { Hero } from "@/components/marketing/home/Hero";
import { ServicesGrid } from "@/components/marketing/home/ServicesGrid";
import { FoundationPhoto, AiPhoto } from "@/components/marketing/home/SplitVisuals";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { Faq } from "@/components/marketing/Faq";
import { RevealGroup, ScrollHighlight, SectionFold } from "@/components/marketing/Motion";
import { IndustriesStrip } from "@/components/marketing/home/IndustriesStrip";
import { CustomersFeature } from "@/components/marketing/home/CustomersFeature";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";
import { SectionDecor } from "@/components/marketing/Decor";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

type HeroSetting = { headline: string; subhead: string };
type FaqItem = { q: string; a: string };

// ── Narrative beats (the story spine) ───────────────────────────────────────
// Built for outcomes: the economics-of-services thesis, drawn from the
// "From Hours to Outcomes" article. Fresh wording, three beats.
const WHY_VIEWNEAR = [
  {
    title: "Automation broke the billable hour",
    body: "Hourly rates made sense when value came from people doing the work by hand. AI now absorbs most of that work, so paying by the hour quietly rewards slowness and taxes the very efficiency you came for. We attach our fee to the result, which means finishing sooner is a win on both sides of the table.",
  },
  {
    title: "The expertise moved upstream",
    body: "The scarce skill is no longer typing the code or moving the data. It is framing the right problem, shaping the solution, directing the agents that execute, and judging whether the output can be trusted. That work is more senior, not less, and it is where we concentrate.",
  },
  {
    title: "We design the outcome, then the delivery",
    body: "We begin from the result you need and build the delivery backward: experienced people on the decisions, AI agents on the execution, the balance retuned as the work shifts. You are not renting a fixed team or a block of hours. You are buying the outcome, and answering for it stays our job.",
  },
];

// The plan, de-risked: what quiets the "this is a big bet" fear.
const DERISK = [
  { title: "Prove it first", body: "A focused proof of concept before the full build. You commit to scale on evidence, not a slide deck." },
  { title: "You stay in control", body: "Regular steering, a shared backlog, and clear decision gates keep scope, budget, and priorities yours." },
  { title: "Value from sprint one", body: "Most platforms reach production in 8–16 weeks, with something useful shipped from the very first sprint." },
  { title: "Built to hand over", body: "Documentation, enablement, and a transition plan in every engagement, so your team runs and extends the work confidently." },
];

// Official Snowflake credibility badges (real artwork; shown on white chips so
// they read on the deep indigo Proof & Trust band).
const BADGES = [
  { src: "/assets/images/certs/premier.webp", alt: "Snowflake Premier Partner badge", w: 460, h: 460 },
  { src: "/assets/images/certs/coco-preferred.png", alt: "Snowflake CoCo Preferred Partner badge", w: 1910, h: 1572 },
  { src: "/assets/images/certs/snowpro-core.png", alt: "SnowPro Core certification badge", w: 487, h: 402 },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: `${theme.brand.name}: ${theme.brand.tagline}` },
    description: theme.brand.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [hero, services, faqs, bands] =
    await Promise.all([
      safe(getSetting<HeroSetting>("hero"), null),
      safe(getServices(), []),
      safe(getSetting<FaqItem[]>("faqs"), null),
      getClientBands(),
    ]);

  // FAQPage structured data for the FAQs rendered below (helps AI/answer engines).
  const faqLd =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      {/* 1) HERO */}
      <Hero subhead={hero?.subhead} />

      {/* 2) BUILT FOR OUTCOMES: thesis header, the argument, and the source article
          as a featured read in its own column. */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl md:leading-[1.08]">
            The hour was never the point.{" "}
            <ScrollHighlight>The result always was.</ScrollHighlight>
          </h2>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
            For decades a services invoice was headcount times a rate, because the value
            lived in the manual work. AI has dissolved that link: the mechanical execution
            is increasingly automated, and the expertise that matters has moved upstream,
            into deciding what to build, orchestrating the agents that build it, and
            standing behind what they produce.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* The argument */}
          <div className="lg:col-span-7">
            <RevealGroup as="ul" variant="fade-up">
              {WHY_VIEWNEAR.map((s, i) => (
                <li
                  key={s.title}
                  className="flex gap-5 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-7"
                >
                  <span
                    className="mt-1 font-mono text-sm font-semibold tracking-widest text-primaryDeep"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-snug text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-lg leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </RevealGroup>
            <p className="mt-9 border-t border-border pt-7 text-xl font-medium leading-relaxed text-foreground/90">
              Not a cheaper way to buy services. A more honest one: the target is set up
              front, senior judgment runs the whole way through, and{" "}
              <ScrollHighlight color="cyan">the result is ours to answer for.</ScrollHighlight>
            </p>
          </div>

          {/* The source: a featured read in its own column */}
          <div className="lg:col-span-5">
            <Link
              href="/blog/from-hours-to-outcomes-ai-economics-services"
              className="group block overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft-lg lg:sticky lg:top-28"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/assets/images/blog/from-hours-to-outcomes-ai-economics-services.jpg"
                  alt="From Hours to Outcomes article"
                  width={720}
                  height={450}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-7">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primaryDeep">
                  Read the thesis
                </span>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                  From Hours to Outcomes: How AI Changed the Economics of Services
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  We don&rsquo;t sell hours or headcount, we design outcomes. AI has shifted
                  where value is created, moving the expertise upstream into steering
                  solutions, orchestrating agents, and owning the result.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primaryDeep">
                  Read the article
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Section>

      {/* PROOF EARLY: who already trusts us, right after the thesis */}
      <section className="pt-2 pb-2 md:pt-4 md:pb-3">
        <div className="container-page">
          <LogoRow logos={bands.top} />
        </div>
      </section>
      <CustomersFeature bottomLogos={bands.bottom} />

      {/* 3) THE PATH: customer-first foundation + AI */}
      <Section className="section-tint">
        <FeatureSplit
          eyebrow="Your foundation"
          title="Data your whole company can trust"
          body="We stand up the governed Snowflake foundation everything else depends on, so every team works from one current, reliable source instead of five conflicting spreadsheets."
          bullets={[
            "One governed source of truth, not data scattered across tools",
            "Pipelines that keep it fresh, tested, and trustworthy",
            "Horizon Catalog governance and lineage, plus Horizon Context: one trusted business context every team and AI agent shares",
          ]}
          visual={<FoundationPhoto />}
          ratio="wide-visual"
          cta={{ label: "Explore services", href: "/services" }}
        />
      </Section>

      {/* A flowing "current" behind the AI row distinguishes it from the
          foundation split and echoes its data → answer story. */}
      <section className="section relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="container-page relative">
          <FeatureSplit
            eyebrow="Applied AI"
            title="AI your teams actually use"
            body="With the data governed, AI stops being a science project. Cortex runs securely next to your data and grounds every answer in Horizon Context, so it reflects your real business, not a generic model's guesswork."
            bullets={[
              "Cortex LLMs and ML running next to your governed data",
              "Snowflake CoWork and Cortex Agents that act on decisions, not just chart them",
              "Insight embedded where your teams already work",
            ]}
            visual={<AiPhoto />}
            reverse
            ratio="wide-text"
            cta={{ label: "Explore services", href: "/services" }}
          />
        </div>
      </section>

      {/* 3) WHAT WE DO */}
      <ServicesGrid services={services} />

      {/* 3b) WHO WE SERVE: industries */}
      <IndustriesStrip />

      {/* 4a) DE-RISKED BY DESIGN: quiet the "big bet" fear */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow="Low-risk by design"
          title="A big bet that doesn't feel like one"
          intro="The way we engage is built to de-risk the decision itself, so committing to data and AI never means committing blind."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
          {DERISK.map((d) => (
            <div key={d.title} className="card card-pop card-ledger flex h-full gap-3">
              <span className="mt-0.5 shrink-0 text-primaryDeep" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l4 4 10-11" />
                </svg>
              </span>
              <div>
                <h3 className="font-display font-bold text-foreground">{d.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d.body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>

        {/* The build-vs-buy case: same risk-reduction beat, now carrying the
            speed/cost contrast against hiring in-house, so the whole "safe bet"
            story lands in one place. */}
        <div className="panel-warm mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 shadow-soft md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-balance font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
              <span className="text-primaryDeep">8–16 weeks</span> to production, vs.{" "}
              <span className="text-red">6–12 months</span> building the team in-house.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              A Snowflake-certified team, versed at every level: no hiring runway, no ramp,
              no key-person risk.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Talk to an architect</Link>
            <Link href="/partnership" className="btn-ghost">See the comparison</Link>
          </div>
        </div>
      </Section>

      {/* 4b) PROOF & TRUST: the deep royal-indigo authority band */}
      <Section>
        <SectionFold angle={12}>
          <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-xl md:p-14">
            <div className="relative max-w-3xl">
              <p className="eyebrow eyebrow--invert mb-4">Proof, not promises</p>
              <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.08]">
                A Snowflake partner enterprises trust.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                Recognized in Snowflake&rsquo;s CoCo Preferred Partner program at Summit 2026,
                alongside Accenture, Deloitte, IBM, and Capgemini.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                {BADGES.map((b) => (
                  <Image
                    key={b.src}
                    src={b.src}
                    alt={b.alt}
                    width={b.w}
                    height={b.h}
                    className="h-14 w-auto"
                  />
                ))}
              </div>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/70">
                Everything we build inherits Snowflake&rsquo;s independently audited
                controls (SOC 2 Type II, ISO 27001, HIPAA), extended by our
                governed delivery practices.{" "}
                <Link
                  href="/security"
                  className="font-semibold text-white underline-offset-4 hover:underline"
                >
                  How we secure your data &rarr;
                </Link>
              </p>
            </div>
          </div>
        </SectionFold>
      </Section>

      {/* 5) FAQ */}
      {faqLd && <JsonLd data={faqLd} />}
      {faqs && faqs.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Questions"
            title="Answers to what teams ask us first"
            center
          />
          <div className="mt-12">
            <Faq items={faqs} />
          </div>
        </Section>
      )}

      {/* CTA: restate the stakes, confident close */}
      <CtaBand
        title="Make this the quarter your data starts paying off."
        subtitle="Every quarter on ungoverned data is decisions made half-blind. Tell us where you are, and we'll map the fastest path to data and AI you can trust."
      />
    </>
  );
}
