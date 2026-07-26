import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { officesLd } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { BookACall } from "@/components/marketing/BookACall";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LedgerCard } from "@/components/marketing/Cards";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Link } from "@/i18n/navigation";
import { OFFICES } from "@/lib/offices";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "monterrey.meta" });
  return pageMeta({
    title: t("title"),
    description: t("description"),
    path: "/nearshore/monterrey",
    image: "/assets/images/life/monterrey.jpg",
    locale,
  });
}

const monterreyOffice = OFFICES.find((o) => o.key === "monterrey")!;

export default async function MonterreyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("monterrey");

  const heroChips = t.raw("hero.chips") as string[];
  const facts = t.raw("facts") as { label: string; title: string; body: string }[];
  const delivers = t.raw("delivers") as string[];

  return (
    <>
      {/* The page is about a physical location, so it carries the office NAP. */}
      <JsonLd data={officesLd()} />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <div className="container-page pt-10">
            <Breadcrumbs
              items={[
                { label: t("breadcrumb.home"), href: "/" },
                { label: t("breadcrumb.nearshore"), href: "/nearshore" },
                { label: t("breadcrumb.current") },
              ]}
            />
          </div>
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
          </PageHero>
        </div>
      </div>

      {/* The office itself, with the address in visible copy (not only schema). */}
      <Section>
        <FeatureSplit
          as="h2"
          eyebrow={t("office.eyebrow")}
          title={t.rich("office.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
          body={t("office.body")}
          bullets={t.raw("office.bullets") as string[]}
          image="/assets/images/life/monterrey-building.jpg"
          imageAlt={t("office.imageAlt")}
        />
        {/* Machine- and human-readable address block. */}
        <address className="mt-10 not-italic">
          <p className="eyebrow">{t("office.addressLabel")}</p>
          <p className="mt-2 font-display text-lg font-bold text-foreground">
            {monterreyOffice.streetAddress}
          </p>
          <p className="text-muted">
            {monterreyOffice.addressLocality}, {monterreyOffice.addressRegion}{" "}
            {monterreyOffice.postalCode}, {monterreyOffice.addressCountry === "MX" ? "México" : monterreyOffice.addressCountry}
          </p>
        </address>
      </Section>

      {/* Why Monterrey: the geographic specifics behind the nearshore claim. */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("factsHeading.eyebrow")}
            title={t("factsHeading.title")}
            intro={t("factsHeading.intro")}
          />
          <RevealGroup
            className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
            variant="pop"
          >
            {facts.map(({ label, title, body }) => (
              <LedgerCard key={title} eyebrow={label} title={title}>
                {body}
              </LedgerCard>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The DST caveat, stated rather than glossed over. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">{t("timeZone.eyebrow")}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("timeZone.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("timeZone.body")}</p>
          <ul className="mt-6 space-y-3">
            {(t.raw("timeZone.bullets") as string[]).map((b) => (
              <li key={b} className="flex items-start gap-3 text-foreground/90">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accentDeep" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* The talent pool: why the engineering is here at all. */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <FeatureSplit
            as="h2"
            reverse
            eyebrow={t("talent.eyebrow")}
            title={t.rich("talent.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            body={t("talent.body")}
            bullets={t.raw("talent.bullets") as string[]}
            image="/assets/images/life/monterrey.jpg"
            imageAlt={t("talent.imageAlt")}
            cta={{ label: t("talent.cta"), href: "/nearshore" }}
          />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* What ships from this office. */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow={t("deliversHeading.eyebrow")}
          title={t("deliversHeading.title")}
          intro={t("deliversHeading.intro")}
        />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {delivers.map((d) => (
            <li key={d} className="card flex items-start gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryDeep" />
              <span className="text-foreground/90">{d}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Visits, in both directions. */}
      <Section className="section-tint">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t("visit.eyebrow")}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("visit.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("visit.body")}</p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            {t("visit.cta")}
          </Link>
        </div>
      </Section>

      {/* Booking replaces the generic CTA here: this page is evaluation-stage,
          so "talk to the person who would own it" beats "let's talk". */}
      <BookACall variant="compact" />
    </>
  );
}
