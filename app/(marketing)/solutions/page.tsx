import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { IndustryTiles } from "@/components/marketing/home/IndustriesStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup } from "@/components/marketing/Motion";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata = pageMeta({
  title: "Solutions: migrate, govern & build with AI",
  description:
    "Outcome-led Snowflake solutions: migrate to Snowflake, Cortex AI & agents, data governance & trust, and embedded analytics & data apps, delivered native, end to end.",
  path: "/solutions",
});

const solutionsLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${theme.brand.name} solutions`,
  itemListElement: SOLUTIONS.map((s, i) => ({
    "@type": "Service",
    position: i + 1,
    name: s.name,
    description: s.summary,
    serviceType: s.eyebrow,
    areaServed: "Americas",
    url: `${theme.brand.url}/solutions/${s.slug}`,
    provider: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
  })),
};

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={solutionsLd} />
      <PageHero
        eyebrow="Solutions"
        title={
          <>
            Outcomes, <span className="text-gradient">delivered native</span>.
          </>
        }
        description="Common ways teams put Snowflake to work, each delivered end to end on the native stack, governed from the first table. Not sure where you fit? We'll help you sequence it."
      />

      <Section>
        <RevealGroup className="grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="fade-up">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="card card-hover group flex h-full flex-col"
            >
              <span className="chip self-start">{s.eyebrow}</span>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">
                {s.name}
              </h2>
              <p className="mt-3 flex-1 text-base leading-relaxed text-muted">{s.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                <span className="link-underline">Explore this solution</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-tint">
        <SectionHeading
          eyebrow="By sector"
          title="Tuned to your industry"
          intro="Every solution is shaped by sector context; see how we apply it in your industry."
          center
        />
        <IndustryTiles className="mt-10" />
      </Section>

      <FeaturedCaseStudies title="See it in your industry" />

      <CtaBand />
    </>
  );
}
