import { getIndustries } from "@/lib/queries";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";

export const metadata = pageMeta({
  title: "Industries we serve",
  description:
    "Data & AI practices shaped to each sector's rules, KPIs, and systems: governed data and use cases in production, on Snowflake, across the Americas.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Industries" }])} />
      <PageHero
        eyebrow="Industries"
        title={<>Solutions tailored to each{" "}<ScrollHighlight color="cyan"><span className="text-gradient">sector</span></ScrollHighlight>.</>}
        description="From regulated enterprises to high-growth challengers: governed, AI-ready data shaped by each sector's rules, KPIs, and systems, across the Americas."
      />

      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
        <FeatureSplit
          eyebrow="Domain-led delivery"
          title={
            <>
              Every sector&rsquo;s data,{" "}
              <span className="text-gradient">regulations, and KPIs</span>.
            </>
          }
          body="Every sector has its own data, regulations, and pressures. We pair specialists who know the industry with SnowPro-certified engineers to map the problem, shape the roadmap, and build the solution alongside in-house teams, so what we deliver speaks the sector's language and moves the metrics that matter."
          bullets={[
            "Pre-built accelerators tuned to each sector's data patterns",
            "Compliance and governance baked into the architecture",
            "Outcomes mapped to the KPIs leadership tracks",
          ]}
          image="/assets/images/photos/analytics.jpg"
          imageAlt="Industry analytics dashboards built on Snowflake"
          cta={{ label: "Discuss a sector", href: "/contact" }}
        />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Sectors we serve"
          title="Find the right industry"
          intro="Seven practices, each with its own accelerators and compliance patterns; explore the one closest to the work at hand."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {industries.map((industry) => (
            <CoverCard
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              image={`/assets/images/industries/${industry.slug}.jpg`}
              imageAlt={`${industry.name} data and AI solutions`}
              kicker="Industry"
              title={industry.name}
              excerpt={industry.headline}
            />
          ))}
          {/* CTA end-cap: fills the grid's trailing row and turns dead space
              into a route for sectors not listed. */}
          <CoverCard
            href="/contact"
            kicker="Get in touch"
            title="Don't see a sector here?"
            excerpt="We work across the Americas. Share the data challenge and we'll map the fastest path to value."
          />
        </RevealGroup>
      </Section>

      <ShowcaseBand
        image="/assets/images/photos/analytics.jpg"
        imageAlt="Industry analytics on a governed Snowflake foundation"
        veil
        eyebrow="Across the Americas"
        title={
          <>
            Sector depth, on{" "}
            <span className="text-secondary">one governed foundation</span>.
          </>
        }
        body="Whatever the industry, the foundation is the same: trusted, governed data on Snowflake. What changes is everything on top: the sources, the compliance obligations, and the decisions it has to carry."
        cta={{ label: "Discuss a sector", href: "/contact" }}
      />

      <CtaBand />
    </>
  );
}
