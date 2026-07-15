import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getIndustries } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "industries.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/industries", locale });
}

export default async function IndustriesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");
  const industries = await getIndustries(locale as Locale);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }], locale)} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", {
          hl: (c) => (
            <ScrollHighlight color="cyan">
              <span className="text-gradient">{c}</span>
            </ScrollHighlight>
          ),
        })}
        description={t("hero.description")}
      />

      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
        <FeatureSplit
          eyebrow={t("feature.eyebrow")}
          title={t.rich("feature.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
          body={t("feature.body")}
          bullets={t.raw("feature.bullets") as string[]}
          image="/assets/images/photos/analytics.jpg"
          imageAlt={t("feature.imageAlt")}
          cta={{ label: t("feature.cta"), href: "/contact" }}
        />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("sectors.eyebrow")}
          title={t("sectors.title")}
          intro={t("sectors.intro")}
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {industries.map((industry) => (
            <CoverCard
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              image={`/assets/images/industries/${industry.slug}.jpg`}
              imageAlt={t("grid.imageAlt", { name: industry.name })}
              kicker={t("grid.kicker")}
              title={industry.name}
              excerpt={industry.headline}
            />
          ))}
          {/* CTA end-cap: fills the grid's trailing row and turns dead space
              into a route for sectors not listed. */}
          <CoverCard
            href="/contact"
            kicker={t("endCap.kicker")}
            title={t("endCap.title")}
            excerpt={t("endCap.excerpt")}
          />
        </RevealGroup>
      </Section>

      <ShowcaseBand
        image="/assets/images/photos/analytics.jpg"
        imageAlt={t("showcase.imageAlt")}
        veil
        eyebrow={t("showcase.eyebrow")}
        title={t.rich("showcase.title", { hl: (c) => <span className="text-secondary">{c}</span> })}
        body={t("showcase.body")}
        cta={{ label: t("showcase.cta"), href: "/contact" }}
      />

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
