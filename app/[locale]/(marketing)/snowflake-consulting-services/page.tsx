import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, ORG_REF } from "@/lib/seo";
import { theme } from "@/config/theme";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { LedgerCard, PlateCard } from "@/components/marketing/Cards";
import { MetricBand, InlineCta } from "@/components/marketing/Blocks";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { Faq } from "@/components/marketing/Faq";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { getClientBands } from "@/lib/client-bands";
import { BookACall } from "@/components/marketing/BookACall";

export const revalidate = 60;

/**
 * Commercial landing page for the head term "Snowflake consulting services" /
 * "Snowflake implementation services".
 *
 * Deliberately a hardcoded route rather than a DB-driven /services/<slug> row:
 * it is not one of the six THINK/BUILD/GROW offerings, it targets a search
 * query, so it needs its own structure (scope, phased process, cost drivers,
 * long FAQ) and its own Service + OfferCatalog + FAQPage schema.
 *
 * Note on wording: "consulting" is used here on purpose. It was previously
 * banned in site copy (see docs/content-style-guide.md), a rule reversed on
 * 2026-07-25 because this page cannot rank for the term without it.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "snowflakeConsulting.meta" });
  return pageMeta({
    title: t("title"),
    description: t("description"),
    path: "/snowflake-consulting-services",
    locale,
  });
}

export default async function SnowflakeConsultingPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("snowflakeConsulting");
  const bands = await getClientBands();

  const heroChips = t.raw("hero.chips") as string[];
  const scope = t.raw("scope") as { label: string; title: string; body: string }[];
  const process = t.raw("process") as { phase: string; title: string; body: string }[];
  const deliveryBand = t.raw("deliveryBand") as { value: string; label: string }[];
  const why = t.raw("why") as { title: string; body: string }[];
  const costFactors = t.raw("cost.factors") as string[];
  const faq = t.raw("faq") as { q: string; a: string }[];

  const localePath = locale === "es" ? "/es" : "";
  const url = `${theme.brand.url}${localePath}/snowflake-consulting-services`;

  // Service + the eight scope items as an OfferCatalog, so the offering is
  // machine-readable rather than only prose.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta.title"),
    description: t("meta.description"),
    serviceType: "Snowflake consulting and implementation services",
    areaServed: ["United States", "Canada", "Mexico", "Latin America", "Caribbean"],
    provider: ORG_REF,
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("scopeHeading.title"),
      itemListElement: scope.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.body },
      })),
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={[serviceLd, faqLd]} />

      {/* Hero: the head term as the H1, credentials as chips. No breadcrumb:
          this page isn't nested under /services (it's a standalone landing
          page for a search term, not one of the six real offerings), and a
          "Home > Services > ..." trail asserted a parent it doesn't have.
          /nearshore, the same kind of page, carries none either. */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
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
          >
            <div className="flex flex-wrap justify-center gap-2">
              {heroChips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                {t("hero.ctaPrimary")}
              </Link>
              <Link href="/pricing" className="btn-ghost">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </PageHero>
        </div>
      </div>

      {/* Trust: real clients, then the verified partner credentials. */}
      <Section>
        <p className="eyebrow mb-8 text-center">{t("trust.eyebrow")}</p>
        <LogoRow logos={bands.top} />
        <PartnerBadges className="mt-12 justify-center" />
      </Section>

      {/* Scope: what consulting and implementation actually covers. */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("scopeHeading.eyebrow")}
            title={t("scopeHeading.title")}
            intro={t("scopeHeading.intro")}
          />
          <RevealGroup
            className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
            variant="pop"
          >
            {scope.map(({ label, title, body }) => (
              <LedgerCard key={title} eyebrow={label} title={title}>
                {body}
              </LedgerCard>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How an implementation runs: the phased mechanism behind the timeline. */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow={t("processHeading.eyebrow")}
          title={t("processHeading.title")}
          intro={t("processHeading.intro")}
        />
        <RevealGroup
          className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
          variant="pop"
        >
          {process.map(({ phase, title, body }, i) => (
            <PlateCard key={title} label={phase} refCode={`0${i + 1}`} title={title}>
              {body}
            </PlateCard>
          ))}
        </RevealGroup>
        <div className="mt-14">
          <MetricBand metrics={deliveryBand} />
        </div>
      </Section>

      {/* Why this partner. */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("whyHeading.eyebrow")}
            title={t("whyHeading.title")}
            intro={t("whyHeading.intro")}
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {why.map(({ title, body }) => (
              <div key={title} className="card card-hover flex h-full flex-col">
                <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-muted">{body}</p>
              </div>
            ))}
          </RevealGroup>
          <div className="mt-12">
            <InlineCta title={t("industries.title")} href="/industries" label={t("industries.cta")} />
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Cost: the drivers, without inventing a price. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">{t("cost.eyebrow")}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("cost.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("cost.body")}</p>
          <ul className="mt-6 space-y-3">
            {costFactors.map((f) => (
              <li key={f} className="flex items-start gap-3 text-foreground/90">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accentDeep" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">{t("cost.note")}</p>
          <Link href="/pricing" className="btn-ghost mt-8 inline-flex">
            {t("cost.cta")}
          </Link>
        </div>
      </Section>

      {/* Proof. */}
      <FeaturedCaseStudies eyebrow={t("proof.eyebrow")} title={t("proof.title")} take={3} tint />

      {/* FAQ: long-tail capture, and it feeds the FAQPage schema above. */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow={t("faqHeading.eyebrow")}
          title={t("faqHeading.title")}
        />
        <div className="mt-12">
          <Faq items={faq} />
        </div>
      </Section>

      {/* Highest-intent page on the site, so give it the human next step. */}
      <BookACall />

      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
