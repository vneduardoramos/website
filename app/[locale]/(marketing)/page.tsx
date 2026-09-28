import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSetting, getServices, safe } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { pageMeta } from "@/lib/seo";
import { officesLd } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/marketing/home/Hero";
import { ServicesGrid } from "@/components/marketing/home/ServicesGrid";
import { RevealGroup } from "@/components/marketing/Motion";
import { CustomersFeature } from "@/components/marketing/home/CustomersFeature";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";
import { PlateCard } from "@/components/marketing/Cards";
import { FaceStack } from "@/components/marketing/LeadershipStrip";
import { Recognition } from "@/components/marketing/home/Recognition";
import { Insights } from "@/components/marketing/home/Insights";
import { CareersTeaser } from "@/components/marketing/home/CareersTeaser";

export const revalidate = 60;

type HeroSetting = { headline: string; subhead: string };

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const base = pageMeta({ title: t("title"), description: t("description"), path: "/", locale });
  // Keep the flagship home <title> absolute (no "| Viewnear" template suffix),
  // as it was before i18n; pageMeta still supplies the locale-aware canonical,
  // hreflang alternates, and the OG/Twitter title.
  return { ...base, title: { absolute: t("title") } };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [hero, services, bands] = await Promise.all([
    safe(getSetting<HeroSetting>("hero", locale as Locale), null),
    safe(getServices(locale as Locale), []),
    getClientBands(),
  ]);

  const derisk = t.raw("derisk.cards") as { label: string; title: string; body: string }[];

  return (
    <>
      {/* The home page is the entity's main entry point, so it carries the two
          physical offices as ProfessionalService alongside the site-wide
          Organization from the layout. Geography is central to the positioning
          and this page previously asserted none of it in structured data. */}
      <JsonLd data={officesLd()} />

      {/* The page in five beats: the promise, the proof, what we do, how to
          buy it, the ask. Everything cut from here on 2026-09-27 (the
          foundation split, industries, the pricing essay, the partner band,
          the FAQ) exists in full on its own page. The ask itself is two
          sections rather than one generic CTA panel: Insights (the proof
          archive), then Careers, which closes with the booking card in the
          same section (2026-09-28) rather than as a third section after it. */}
      {/* 1) HERO: the mono line under it carries both credentials. */}
      <Hero subhead={hero?.subhead} />

      {/* PROOF EARLY: the logo band sits right after the hero. It carries no
          caption naming the brands as customers: the relationship is not
          something the site substantiates, so the logos speak for themselves
          and each one's name stays in its alt text only. */}
      <section className="pt-2 pb-2 md:pt-4 md:pb-3">
        <div className="container-page">
          <LogoRow logos={bands.top} />
        </div>
      </section>
      <CustomersFeature bottomLogos={bands.bottom} />

      {/* RECOGNITION: the two pieces of third-party proof, side by side. The
          Summit wall with Viewnear's logo on it, and the one press line that
          names both halves of the offer. A plain band between the customers
          block and the warm services grid. */}
      <Recognition />

      {/* 2) WHAT WE DO */}
      <ServicesGrid services={services} />

      {/* 3) HOW TO BUY IT: quiet the "big bet" fear */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow={t("derisk.heading.eyebrow")}
          title={t("derisk.heading.title")}
          intro={t("derisk.heading.intro")}
        />
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
          {derisk.map((d, i) => (
            <PlateCard key={d.title} label={d.label} refCode={`0${i + 1}`} title={d.title}>
              {d.body}
            </PlateCard>
          ))}
        </RevealGroup>

        {/* The build-vs-buy case: same risk-reduction beat, now carrying the
            speed/cost contrast against hiring in-house, so the whole "safe bet"
            story lands in one place. */}
        <div className="panel-warm mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 shadow-soft md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-balance font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
              {t.rich("derisk.panel.headline", {
                weeks: (c) => <span className="text-primaryDeep">{c}</span>,
                months: (c) => <span className="text-red">{c}</span>,
              })}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t.rich("derisk.panel.body", {
                nearshore: (c) => (
                  <Link href="/nearshore" className="link-underline font-medium text-primaryDeep">
                    {c}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            {/* The CTA promises a person; show the actual people. */}
            <FaceStack slugs={["eduardo-ramos", "jc-rodriguez", "rene-trevino"]} />
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">{t("derisk.panel.ctaPrimary")}</Link>
              <Link href="/partnership" className="btn-ghost">{t("derisk.panel.ctaGhost")}</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 4) THE ASK, in three parts, instead of one generic CTA panel: the
          proof archive a reader can browse (random each visit), the team a
          reader could join, and the actual way to reach a person. */}
      <Insights locale={locale as Locale} />
      <CareersTeaser locale={locale as Locale} />
    </>
  );
}
