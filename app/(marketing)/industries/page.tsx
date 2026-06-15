import { getIndustries } from "@/lib/queries";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";

export const metadata = {
  title: "Industries we serve",
  description:
    "Industry-specific data and AI solutions across the Americas, built on Snowflake by Viewnear.",
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={<>Solutions tailored to your{" "}<ScrollHighlight color="cyan"><span className="text-gradient">sector</span></ScrollHighlight>.</>}
        description="From regulated enterprises to high-growth challengers, we bring deep domain expertise and a modern Snowflake-first data stack to the industries we serve across the Americas."
      />

      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
        <FeatureSplit
          eyebrow="Domain-led delivery"
          title={
            <>
              Deep expertise,{" "}
              <span className="text-gradient">tailored to your world</span>.
            </>
          }
          body="Every sector has its own data, regulations, and pressures. We pair consultants who know your industry with our SnowPro-certified Snowflake engineers to map the problem, shape the roadmap, and build the solution, so what we deliver speaks your language and moves your metrics."
          bullets={[
            "Pre-built accelerators tuned to each sector's data patterns",
            "Compliance and governance baked into the architecture",
            "Outcomes mapped to the KPIs your leadership tracks",
          ]}
          image="/assets/images/photos/analytics.jpg"
          imageAlt="Industry analytics dashboards built on Snowflake"
          cta={{ label: "Discuss your sector", href: "/contact" }}
        />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Sectors we serve"
          title="Find your industry"
          intro="Each practice pairs sector specialists with our Snowflake-first platform; explore the one closest to your world."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {industries.map((industry, i) => (
            <CoverCard
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              image={`/assets/images/industries/${industry.slug}.jpg`}
              imageAlt={`${industry.name} data and AI solutions`}
              kicker="Industry"
              title={industry.name}
              excerpt={industry.headline}
              featured={i === 0}
            />
          ))}
        </RevealGroup>
      </Section>

      <ShowcaseBand
        image="/assets/images/photos/analytics.jpg"
        imageAlt="Industry analytics on a governed Snowflake platform"
        eyebrow="Across the Americas"
        title={
          <>
            Sector depth, on{" "}
            <span className="text-secondary">one governed platform</span>.
          </>
        }
        body="Whatever your industry, the foundation is the same: trusted, governed data on Snowflake, with sector specialists who speak your language on top of it."
        cta={{ label: "Discuss your sector", href: "/contact" }}
      />

      <CtaBand />
    </>
  );
}
