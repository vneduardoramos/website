import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, webPageLd, ORG_REF } from "@/lib/seo";
import { theme } from "@/config/theme";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { Img as Image } from "@/components/marketing/Img";
import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/marketing/ui";
import { Reveal, RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor } from "@/components/marketing/Decor";
import { SwtCdmxLeadForm } from "@/components/marketing/events/SwtCdmxLeadForm";
import { CoverCard } from "@/components/marketing/CoverCard";
import { getBlogPostBySlug, getCaseStudyBySlug } from "@/lib/queries";
import { coverForSector } from "@/lib/covers";
import type { Locale } from "@/lib/i18n-content";

const PATH = "/snowflake-world-tour-mexico-city";
const FLYER = "/assets/images/events/swt-cdmx-flyer.jpg";

// The 5 accelerators already in production. 5 more exist but are still in
// development, so they're named in the booth signage, not on the public page.
const ACCELERATOR_KEYS = ["docLens", "statementIQ", "underwriteIQ", "invoiceMatch", "contractLens"] as const;
const WHY_VISIT_KEYS = ["seeIt", "talkShop", "leaveWithAStep"] as const;

// The one published agentic case study, and the piece that lays out why
// Snowflake and Claude sit together, both squarely on-topic for a visitor
// deciding whether the booth is worth their time before the show.
const DEEPER_CASE_SLUG = "magnolia-doors-installation-scheduling";
const DEEPER_BLOG_SLUG = "snowflake-claude-enterprise-ai-stack";

/**
 * One dated event: Snowflake World Tour Mexico City, October 13, 2026. A
 * standalone page (not a "news" listing, which this site deliberately does
 * not have, see news-section-dormant), discoverable from the site-wide
 * EventAnnouncementBar rather than the permanent nav, since it stops being
 * relevant the day after the show.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "swtCdmx.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: PATH, image: FLYER, locale });
}

export default async function SwtCdmxPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("swtCdmx");
  const [deeperCase, deeperPost] = await Promise.all([
    getCaseStudyBySlug(DEEPER_CASE_SLUG, locale as Locale),
    getBlogPostBySlug(DEEPER_BLOG_SLUG, locale as Locale),
  ]);

  const localePath = locale === "es" ? "/es" : "";
  const url = `${theme.brand.url}${localePath}${PATH}`;

  // A real, dated, single-occurrence event: Event is the honest schema.org
  // type here, unlike the fabricated competitor-scraped "news" this site
  // deliberately removed in 2026-07.
  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: t("meta.title"),
    description: t("meta.description"),
    startDate: "2026-10-13",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Snowflake World Tour Mexico City",
      address: { "@type": "PostalAddress", addressLocality: "Mexico City", addressCountry: "MX" },
    },
    image: `${theme.brand.url}${FLYER}`,
    organizer: { "@type": "Organization", name: "Snowflake Inc.", url: "https://www.snowflake.com" },
    sponsor: ORG_REF,
    url,
  };

  return (
    <>
      <JsonLd
        data={[
          eventLd,
          webPageLd({ path: PATH, name: t("meta.title"), description: t("meta.description"), locale }),
        ]}
      />

      <div className="relative overflow-hidden">
        <SectionDecor variant="dots" />
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
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#meet" className="btn-primary btn-lg group">
                {t("hero.ctaPrimary")}
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </a>
              <Link href="/partnership/snowflake" className="btn-ghost btn-lg">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </PageHero>
        </div>
      </div>

      <Section className="pt-0">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-border shadow-soft-lg">
              <Image src={FLYER} alt={t("flyer.alt")} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {(["date", "where"] as const).map((key) => (
                <div key={key} className="rounded-2xl border border-border bg-background p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {t(`details.${key}Label`)}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-snug text-foreground">
                    {t(`details.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">{t("whyVisit.eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("whyVisit.title")}
            </h2>
          </div>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3" variant="fade-up">
          {WHY_VISIT_KEYS.map((key) => (
            <div key={key} className="rounded-2xl border border-border bg-background p-6">
              <p className="font-display text-lg font-bold text-foreground">{t(`whyVisit.items.${key}.title`)}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`whyVisit.items.${key}.desc`)}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-warm">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">{t("lastYear.eyebrow")}</p>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("lastYear.title")}
          </h2>
        </div>
        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" variant="fade-up">
          <figure className="m-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-soft-lg">
              <Image
                src="/assets/images/events/swt-cdmx-booth.jpg"
                alt={t("lastYear.boothCaption")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">{t("lastYear.boothCaption")}</figcaption>
          </figure>
          <figure className="m-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-soft-lg">
              <Image
                src="/assets/images/events/swt-cdmx-coco-wall.jpg"
                alt={t("lastYear.cocoCaption")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">{t("lastYear.cocoCaption")}</figcaption>
          </figure>
        </RevealGroup>
      </Section>

      <Section>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">{t("accelerators.eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("accelerators.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{t("accelerators.body")}</p>
          </div>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variant="fade-up">
          {ACCELERATOR_KEYS.map((key) => (
            <div key={key} className="rounded-2xl border border-border bg-background p-6">
              <p className="font-display text-lg font-bold text-foreground">{t(`accelerators.items.${key}.name`)}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-muted">
                {t(`accelerators.items.${key}.category`)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`accelerators.items.${key}.desc`)}</p>
            </div>
          ))}
        </RevealGroup>
        <p className="mt-8 text-center text-sm text-muted">{t("accelerators.pipeline")}</p>
      </Section>

      <Section className="section-warm">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-[11/12] w-full max-w-sm overflow-hidden rounded-3xl border border-border shadow-soft-lg">
              <Image
                src="/assets/images/events/swt-cdmx-swag.jpg"
                alt={t("swag.alt")}
                fill
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="aspect-[11/12] object-cover"
              />
            </div>
            <div>
              <p className="eyebrow mb-3">{t("swag.eyebrow")}</p>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("swag.title")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{t("swag.body")}</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {(deeperCase || deeperPost) && (
        <Section>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-3">{t("deeper.eyebrow")}</p>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("deeper.title")}
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" variant="fade-up">
            {deeperCase && (
              <CoverCard
                href={`/case-studies/${deeperCase.slug}`}
                image={deeperCase.heroImage ?? coverForSector(deeperCase.sector, deeperCase.slug)}
                imageAlt={deeperCase.title}
                kicker={t("deeper.kickerCase")}
                title={deeperCase.title}
                excerpt={deeperCase.summary}
                meta={`${deeperCase.sector} · ${deeperCase.region}`}
              />
            )}
            {deeperPost && (
              <CoverCard
                href={`/blog/${deeperPost.slug}`}
                image={deeperPost.coverImageUrl}
                imageAlt={deeperPost.title}
                kicker={t("deeper.kickerBlog")}
                title={deeperPost.title}
                excerpt={deeperPost.excerpt}
              />
            )}
          </RevealGroup>
        </Section>
      )}

      <Section id="meet">
        <Reveal>
          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow mb-3">{t("form.eyebrow")}</p>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("form.title")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{t("form.body")}</p>
            </div>
            <SwtCdmxLeadForm />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
