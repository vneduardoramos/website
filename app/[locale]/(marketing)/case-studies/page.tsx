import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, collectionLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getCaseStudies } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { Section, CtaBand, Pill } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverForSector } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudies.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/case-studies", locale });
}

export default async function CaseStudiesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");

  const caseStudies = await getCaseStudies({}, locale as Locale);

  // Feature the strongest as one full-width card, the rest in a uniform grid.
  const featured = caseStudies[0];
  const rest = caseStudies.slice(1);

  // Unique sector chips for a lightweight filter row (visual scan aid).
  const sectors = Array.from(new Set(caseStudies.map((cs) => cs.sector))).filter(
    Boolean,
  );

    // The newest thing on the page is a real, derivable freshness signal for a
  // listing that has no editorial date of its own.
  const newest = caseStudies.reduce<Date | null>(
    (acc, r) => (r.updatedAt && (!acc || r.updatedAt > acc) ? r.updatedAt : acc),
    null,
  );
const ld = collectionLd({
    dateModified: newest ? newest.toISOString() : undefined,
    name: t("meta.title"),
    description: t("meta.description"),
    path: "/case-studies",
    locale,
    crumbs: [
      { name: t("breadcrumb.home"), url: "/" },
      { name: t("breadcrumb.current") },
    ],
    items: caseStudies.map((cs) => ({ name: cs.title, url: `/case-studies/${cs.slug}` })),
  });

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      />

      {caseStudies.length > 0 ? (
        <>
          {/* ── Featured engagements (large, image-led) ───────────── */}
          <Section className="relative overflow-hidden">
            <SectionDecor variant="dots" />
            <div className="relative">
              <p className="eyebrow mb-3">{t("featured.eyebrow")}</p>
              <p className="mb-8 max-w-2xl text-sm text-muted">
                {t("featured.note")}
              </p>
              {sectors.length > 1 && (
                <div className="mb-10 flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-mono text-xs uppercase tracking-wider text-muted">
                    {t("filter.label")}
                  </span>
                  {sectors.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              )}

              {featured && (
                <CoverCard
                  href={`/case-studies/${featured.slug}`}
                  image={featured.heroImage ?? coverForSector(featured.sector, featured.slug)}
                  imageAlt={`${featured.title}: ${featured.sector}`}
                  kicker={`${featured.sector} · ${featured.region}`}
                  title={featured.title}
                  excerpt={featured.summary}
                  featured
                />
              )}
            </div>
          </Section>

          {/* ── The rest, in a tinted band ────────────────────────── */}
          {rest.length > 0 && (
            <div className="relative">
              <WaveDivider position="top" fill="fill-surface2" />
              <Section className="section-warm relative overflow-hidden">
                <SectionDecor variant="grid" />
                <div className="relative">
                  <p className="eyebrow mb-8">{t("more.eyebrow")}</p>
                  <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((cs) => (
                      <CoverCard
                        key={cs.slug}
                        href={`/case-studies/${cs.slug}`}
                        image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
                        imageAlt={`${cs.title}: ${cs.sector}`}
                        kicker={`${cs.sector} · ${cs.region}`}
                        title={cs.title}
                        excerpt={cs.summary}
                      />
                    ))}
                  </div>
                </div>
              </Section>
              <WaveDivider position="bottom" fill="fill-background" />
            </div>
          )}
        </>
      ) : (
        <Section>
          <p className="text-muted">{t("empty")}</p>
        </Section>
      )}

      {/* ── Real, verifiable proof (credibility rests here) ──────── */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="panel-warm relative grid gap-8 rounded-3xl p-8 md:grid-cols-2 md:items-center md:p-10">
          <div>
            <p className="eyebrow mb-3">{t("proof.eyebrow")}</p>
            <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("proof.title")}
            </h2>
            <p className="mt-3 text-muted">
              {t("proof.body")}
            </p>
          </div>
          <div className="md:justify-self-end">
            <PartnerBadges variant="logos" />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
