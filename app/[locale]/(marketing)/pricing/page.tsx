import { pageMeta, breadcrumbLd } from "@/lib/seo";
import Link from "next/link";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { LedgerCard } from "@/components/marketing/Cards";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Pricing & engagement",
  description:
    "How Viewnear engagements are scoped and priced (fixed cost, time & materials, or team augmentation), plus what drives cost. Scope and price agreed up front.",
  path: "/pricing",
});

const engagementModels = [
  {
    title: "Fixed cost",
    body: "A defined scope, timeline, and price agreed up front. Best when the outcome is clear and budget certainty matters from day one.",
    bestFor: "Defined foundation builds & migrations",
  },
  {
    title: "Time & materials",
    body: "Flexible, iterative delivery billed by effort against a shared backlog. Ideal for evolving requirements and discovery-led work.",
    bestFor: "Discovery, POCs & evolving scope",
  },
  {
    title: "Team augmentation",
    body: "Embed our certified practitioners alongside the in-house team. We accelerate delivery while leveling up their capability.",
    bestFor: "Scaling an existing team fast",
  },
];

// Service + engagement-model structured data (no fixed prices: scoped per engagement).
const pricingLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Data & AI services on Snowflake",
  serviceType: "Data and AI professional services",
  provider: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
  areaServed: "Americas",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engagement models",
    itemListElement: engagementModels.map((m) => ({
      "@type": "Offer",
      name: m.title,
      description: m.body,
    })),
  },
};

const costFactors = [
  "Data volume and the number/complexity of source systems",
  "How many analytics and AI use cases are in scope",
  "Team size and target timeline",
  "Governance, compliance, and security requirements",
];

const impactByPhase = [
  { phase: "First 8–16 weeks", title: "Foundations & first value", body: "The data practice stands up: scope fixed in a paid discovery, governance designed in from the first table, priority data flowing, and the first governed data products in production." },
  { phase: "6–12 months", title: "Scale & self-service", body: "The AI practice ships: use cases spread across teams and each new one reaches first insight 60% faster. Self-service takes hold; manual reporting retires." },
  { phase: "18+ months", title: "Compounding advantage", body: "Both practices are in-house: new use cases ship in weeks at 40% lower run cost, and the handover is real. The team runs and extends the work without us." },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[pricingLd, breadcrumbLd([{ name: "Home", url: "/" }, { name: "Pricing" }])]} />
      <PageHero
        eyebrow="Pricing & engagement"
        title={
          <>
            Clear scope. <span className="text-gradient">No surprises.</span>
          </>
        }
        description="Engagements are scoped to the data and goals at hand, and priced up front, whichever model fits. Here's how we structure the work and what shapes the investment."
      />

      <Section>
        <SectionHeading
          eyebrow="How we work"
          title="Engagement models"
          intro="Flexible ways to partner, matched to the shape of the problem."
        />
        <div className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3">
          {engagementModels.map((m, i) => (
            <LedgerCard
              key={m.title}
              eyebrow={m.title}
              index={`0${i + 1}`}
              foot={["Best for", m.bestFor]}
            >
              {m.body}
            </LedgerCard>
          ))}
        </div>

        {/* Worked example: the shape of a first engagement, no invented prices. */}
        <div className="panel-warm mt-10 rounded-3xl p-8">
          <p className="eyebrow mb-2">A worked example</p>
          <p className="max-w-3xl text-muted">
            The shape of a typical first engagement: a paid discovery fixes scope and price, sprint
            demos show working software from the first weeks, and a governed foundation reaches
            production in 8–16 weeks, with a named team the sponsor meets before signing and
            in-house people in the work from sprint one.
          </p>
        </div>
      </Section>

      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">What drives cost</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.2rem]">
              Priced to the work, not a sticker
            </h2>
            <p className="mt-4 text-muted">
              We don&apos;t publish one-size pricing because no two engagements are the same. Cost is shaped by:
            </p>
            <ul className="mt-6 space-y-3">
              {costFactors.map((c) => (
                <li key={c} className="flex items-start gap-3 text-foreground/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primaryDeep">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary mt-8 group">
              Get a scoped estimate
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <div className="panel-warm rounded-2xl p-8">
            <p className="eyebrow mb-2">Practice adoption, by horizon</p>
            <ul className="mt-4 space-y-6">
              {impactByPhase.map((p) => (
                <li key={p.phase}>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">{p.phase}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <FeaturedCaseStudies title="What an engagement looks like" />

      <CtaBand
        title="Let's scope it together."
        subtitle="Tell us the goals and constraints, and we'll come back with a model, a plan, and a price ready for the board."
      />
    </>
  );
}
