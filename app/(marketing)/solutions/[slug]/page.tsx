import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { IndustryTiles } from "@/components/marketing/home/IndustriesStrip";
import { RevealGroup } from "@/components/marketing/Motion";
import { CheckIcon } from "@/components/marketing/home/Icons";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";
import { SOLUTIONS, getSolution } from "@/lib/solutions";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSolution(params.slug);
  if (!s) return {};
  return pageMeta({ title: s.seoTitle, description: s.seoDescription, path: `/solutions/${s.slug}` });
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const s = getSolution(params.slug);
  if (!s) notFound();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.eyebrow,
    description: s.summary,
    areaServed: "Americas",
    url: `${theme.brand.url}/solutions/${s.slug}`,
    provider: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <PageHero
        eyebrow={s.eyebrow}
        title={
          <>
            {s.titleLead} <span className="text-gradient">{s.titleAccent}</span>
          </>
        }
        description={s.summary}
      />

      <Section className="relative overflow-hidden">
        <FeatureSplit
          eyebrow="Why it matters"
          title={s.name}
          body={s.body}
          image={s.image}
          imageAlt={`${s.name}: Snowflake-native solution`}
          cta={s.cta}
        />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What's included"
          title="Inside this engagement"
          intro={s.whoFor}
        />
        <RevealGroup
          className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
          variant="pop"
        >
          {s.included.map((item) => (
            <div key={item.title} className="card card-hover flex h-full flex-col bg-background">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-tint">
        <SectionHeading eyebrow="How we work" title="Our approach" />
        <RevealGroup
          className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
          variant="fade-up"
        >
          {s.approach.map((step, i) => (
            <div key={step.step} className="card flex h-full flex-col bg-background">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primaryDeep font-mono text-sm font-bold text-primary-fg">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{step.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <FeaturedCaseStudies title="See it in your industry" />

      <Section>
        <SectionHeading
          eyebrow="By sector"
          title="Tuned to your industry"
          intro="Every engagement is shaped by sector context; see how we apply it in your industry."
          center
        />
        <IndustryTiles className="mt-10" />
      </Section>

      <CtaBand />
    </>
  );
}
