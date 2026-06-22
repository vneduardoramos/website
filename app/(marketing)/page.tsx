import Link from "next/link";
import { Img as Image } from "@/components/marketing/Img";
import type { Metadata } from "next";
import { getSetting, getServices, safe } from "@/lib/queries";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { LatestPosts } from "@/components/marketing/LatestPosts";
import { theme } from "@/config/theme";
import { Hero } from "@/components/marketing/home/Hero";
import { ServicesGrid } from "@/components/marketing/home/ServicesGrid";
import { Methodology } from "@/components/marketing/home/Methodology";
import { FoundationPhoto, AiPhoto } from "@/components/marketing/home/SplitVisuals";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { Faq } from "@/components/marketing/Faq";
import { RevealGroup, ScrollHighlight, SectionFold } from "@/components/marketing/Motion";
import { HorizonScene } from "@/components/marketing/home/HorizonScene";
import { IndustriesStrip } from "@/components/marketing/home/IndustriesStrip";
import { CustomersFeature } from "@/components/marketing/home/CustomersFeature";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";
import { SectionDecor } from "@/components/marketing/Decor";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

type HeroSetting = { headline: string; subhead: string };
type PartnershipSetting = {
  title: string;
  points: { title: string; body: string }[];
};
type FaqItem = { q: string; a: string };

// ── Narrative beats (the story spine) ───────────────────────────────────────
// Why ViewNear: for warm leads who already know they're moving to Snowflake,
// the reasons we're the right partner to do it with.
const WHY_VIEWNEAR = [
  {
    title: "Depth at every level",
    body: "The person who scopes your work and the engineer who builds it are both SnowPro-certified. You get senior judgment end to end, not a senior pitch and a junior handoff.",
  },
  {
    title: "A dedicated, boutique team",
    body: "A committed team that learns your data and your goals, not a rotating bench billed from a delivery pyramid. The people in the kickoff are the people who ship.",
  },
  {
    title: "A certified Snowflake partner",
    body: "A Snowflake Premier and CoCo Preferred partner, with a direct line to Snowflake's engineering and roadmap when your build needs it.",
  },
];

// The plan, de-risked: what quiets the "this is a big bet" fear.
const DERISK = [
  { title: "Prove it first", body: "A focused proof of concept before the full build. You commit to scale on evidence, not a slide deck." },
  { title: "You stay in control", body: "Regular steering, a shared backlog, and clear decision gates keep scope, budget, and priorities yours." },
  { title: "Value from sprint one", body: "Most platforms reach production in 8–16 weeks, with something useful shipped from the very first sprint." },
  { title: "Built to hand over", body: "Documentation, enablement, and a transition plan in every engagement, so your team runs and extends the work confidently." },
];

// The transformation: before → after, by horizon.
const HORIZONS = [
  {
    phase: "First 90 days",
    title: "Foundations & first value",
    body: "A governed Snowflake foundation live, priority data flowing, and the first production dashboards in hand. Real decisions running on trusted data inside the first quarter.",
  },
  {
    phase: "6–12 months",
    title: "Scale & self-service",
    body: "Analytics and AI use cases rolled out across teams, self-service adopted, and manual reporting retired. Decisions run on current, trusted numbers.",
  },
  {
    phase: "18+ months",
    title: "Compounding advantage",
    body: "New use cases shipped in weeks, run cost tuned, and a team fluent enough to keep extending it on their own. Data and AI become a durable edge.",
  },
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
  const [hero, services, partnership, faqs, bands] =
    await Promise.all([
      safe(getSetting<HeroSetting>("hero"), null),
      safe(getServices(), []),
      safe(getSetting<PartnershipSetting>("partnership"), null),
      safe(getSetting<FaqItem[]>("faqs"), null),
      getClientBands(),
    ]);

  const whyPoints = partnership?.points?.slice(0, 4) ?? [
    {
      title: "Snowflake Premier Partner",
      body: "A top-tier Snowflake Services Partner with SnowPro-certified engineers and a verified, end-to-end delivery track record across the Americas.",
    },
    {
      title: "One Governed Foundation",
      body: "A single source of truth for analytics, engineering, and AI, with no silos and no data sprawl.",
    },
    {
      title: "Cortex AI Built-In",
      body: "Production-grade LLMs and ML run securely next to your governed data, not bolted on.",
    },
    {
      title: "Elastic Scale",
      body: "Compute that flexes to your workload and your budget: pay for what you use, scale when you need to.",
    },
  ];

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

      {/* 2) WHY VIEWNEAR: the right partner, depth at every level */}
      <Section>
        <SectionHeading
          size="hero"
          eyebrow="Why ViewNear"
          title={
            <>
              The tools are everywhere now.{" "}
              <ScrollHighlight>The team that makes them pay off isn&rsquo;t.</ScrollHighlight>
            </>
          }
          intro="Plenty of firms can stand up Snowflake. Far fewer bring senior judgment to every call, know the platform deeply enough to get it right the first time, and stay accountable long after launch. That's the difference here."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {WHY_VIEWNEAR.map((s, i) => (
            <div key={s.title} className="card card-pop card-editorial flex h-full flex-col">
              <span className="card-index font-display" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
        <p className="mt-8 max-w-2xl text-lg text-foreground/90">
          Most engagements start with one use case and grow, because teams keep coming back to{" "}
          <ScrollHighlight color="cyan">the people who delivered the first one.</ScrollHighlight>
        </p>
      </Section>

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

      {/* 4) HOW WE DO IT */}
      <Methodology />

      {/* 4a) DE-RISKED BY DESIGN: quiet the "big bet" fear */}
      <Section>
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
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 shadow-soft md:flex-row md:items-center md:p-8">
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

      {/* PROOF: featured case study, framed by real client logos */}
      {/* Top frame: a quiet white logo band leading into the tinted Customers section */}
      <section className="pt-4 pb-2 md:pt-6 md:pb-3">
        <div className="container-page">
          <LogoRow logos={bands.top} />
        </div>
      </section>
      <CustomersFeature bottomLogos={bands.bottom} />

      {/* 4b) PROOF & TRUST: the deep royal-indigo authority band */}
      <Section>
        <SectionFold angle={12}>
          <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-xl md:p-14">
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
              {/* positioning + real proof + badges + trust */}
              <div>
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
              {/* why Snowflake: differentiators, in light-on-indigo */}
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:content-center">
                {whyPoints.map((p) => (
                  <div key={p.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionFold>
      </Section>

      {/* TRANSFORMATION: where this takes you (by horizon), a compact static grid. */}
      <Section className="section-tint">
        <HorizonScene
          horizons={HORIZONS}
          heading={
            <SectionHeading
              size="hero"
              eyebrow="What changes"
              title="Where this takes you"
              intro="A practical view of the journey, by horizon: value early, scale through the year, a durable advantage after that."
            />
          }
        />
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

      {/* 7) CTA: restate the stakes, confident close */}
      <LatestPosts tint />

      <CtaBand
        title="Make this the quarter your data starts paying off."
        subtitle="Every quarter on ungoverned data is decisions made half-blind. Tell us where you are, and we'll map the fastest path to data and AI you can trust."
      />
    </>
  );
}
