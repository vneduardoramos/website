import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { LedgerCard } from "@/components/marketing/Cards";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/pricing", locale });
}

export default async function PricingPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  const engagementModels = t.raw("engagementModels") as { title: string; body: string; bestFor: string }[];
  const costFactors = t.raw("costFactors") as string[];
  const impactByPhase = t.raw("impactByPhase") as { phase: string; title: string; body: string }[];

  // Service + engagement-model structured data (no fixed prices: scoped per engagement).
  const pricingLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("ld.name"),
    serviceType: t("ld.serviceType"),
    provider: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
    areaServed: t("ld.areaServed"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("ld.offerCatalogName"),
      itemListElement: engagementModels.map((m) => ({
        "@type": "Offer",
        name: m.title,
        description: m.body,
      })),
    },
  };

  return (
    <>
      <JsonLd data={[pricingLd, breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }])]} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      />

      <Section>
        <SectionHeading
          eyebrow={t("modelsHeading.eyebrow")}
          title={t("modelsHeading.title")}
          intro={t("modelsHeading.intro")}
        />
        <div className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3">
          {engagementModels.map((m, i) => (
            <LedgerCard
              key={m.title}
              eyebrow={m.title}
              index={`0${i + 1}`}
              foot={[t("bestForLabel"), m.bestFor]}
            >
              {m.body}
            </LedgerCard>
          ))}
        </div>

        {/* Worked example: the shape of a first engagement, no invented prices. */}
        <div className="panel-warm mt-10 rounded-3xl p-8">
          <p className="eyebrow mb-2">{t("workedExample.eyebrow")}</p>
          <p className="max-w-3xl text-muted">
            {t("workedExample.body")}
          </p>
        </div>
      </Section>

      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">{t("cost.eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.2rem]">
              {t("cost.title")}
            </h2>
            <p className="mt-4 text-muted">
              {t("cost.intro")}
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
              {t("cost.cta")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <div className="panel-warm rounded-2xl p-8">
            <p className="eyebrow mb-2">{t("impact.eyebrow")}</p>
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

      <FeaturedCaseStudies title={t("featuredTitle")} />

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
