import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { BookACall } from "@/components/marketing/BookACall";
import { InlineCta } from "@/components/marketing/Blocks";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { LegacyContrast, CutoverTimeline } from "@/components/marketing/migrations/Crossing";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "migrations.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/migrations", locale });
}

export default async function MigrationsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("migrations");

  const heroChips = t.raw("heroChips") as string[];

  // The full set of source platforms, grouped. `slug` maps to an official brand
  // mark in /assets/images/sources (rendered monochrome via CSS mask); platforms
  // without a mark fall back to a clean wordmark.
  // Only platforms with an official brand mark in /assets/images/sources are
  // listed; everything else rides on the "not listed? we've seen it" line.
  const sourceGroups = t.raw("sources") as { label: string; items: { name: string; slug: string }[] }[];

  // The phased, de-risked method. (The "why teams move" drivers live inside
  // LegacyContrast as before/after annotations.)
  const phases = t.raw("phases") as { title: string; body: string }[];

  // The hard parts, handled, for the most common sources.
  const hardParts = t.raw("hardParts") as { source: string; detail: string }[];

  const metrics = t.raw("metrics") as { value: string; label: string }[];

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <ScrollHighlight>{c}</ScrollHighlight> })}
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

      {/* Source-platform wall */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("sourcesHeading.eyebrow")}
            title={t("sourcesHeading.title")}
            intro={t("sourcesHeading.intro")}
          />
          {/* One continuous board instead of five card boxes */}
          <div className="mt-12 rounded-3xl border border-border bg-surface">
            {sourceGroups.map((g, gi) => (
              <div
                key={g.label}
                className={`grid gap-3 p-5 md:grid-cols-[230px_1fr] md:items-baseline md:gap-6 md:px-7 ${gi > 0 ? "border-t border-border" : ""}`}
              >
                <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  {g.label}
                </h3>
                <ul className="flex flex-wrap gap-x-2 gap-y-2">
                  {g.items.map((p) => (
                    <li
                      key={p.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground/80"
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 flex-none"
                        style={{
                          backgroundColor: "rgb(var(--color-foreground))",
                          opacity: 0.75,
                          WebkitMaskImage: `url(/assets/images/sources/${p.slug}.svg)`,
                          maskImage: `url(/assets/images/sources/${p.slug}.svg)`,
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                      />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted">
            {t("sourcesNote")}
          </p>
        </div>
      </Section>

      {/* Why teams move */}
      <Section className="section-warm relative overflow-hidden">
        <SectionHeading
          align="center"
          eyebrow={t("whyHeading.eyebrow")}
          title={t("whyHeading.title")}
          intro={t("whyHeading.intro")}
        />
        <LegacyContrast />
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How we migrate */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow={t("howHeading.eyebrow")}
          title={t("howHeading.title")}
          intro={t("howHeading.intro")}
        />
        <CutoverTimeline phases={phases} />
      </Section>

      {/* The conviction: tools convert code; the team answers for it */}
      <Section className="section-tint relative overflow-hidden">
        <FeatureSplit
          eyebrow={t("conviction.eyebrow")}
          title={t("conviction.title")}
          body={t("conviction.body")}
          bullets={t.raw("conviction.bullets") as string[]}
          image="/assets/images/product/workspaces-build.png"
          imageAlt={t("conviction.imageAlt")}
          ratio="wide-text"
        />
        {/* One quiet, real proof point for the claim above. */}
        <p className="mt-10 text-center text-sm text-muted">
          {t.rich("liveExample", {
            link: (c) => (
              <Link
                href="/case-studies/real-time-student-data-pipeline"
                className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
              >
                {c}
              </Link>
            ),
          })}
        </p>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The hard parts, handled */}
      <Section className="section-warm">
        <SectionHeading
          align="center"
          eyebrow={t("hardPartsHeading.eyebrow")}
          title={t("hardPartsHeading.title")}
          intro={t("hardPartsHeading.intro")}
        />
        {/* Same continuous-board rhythm as the sources wall and the platform
            parts list: fixed label column, uniform hairline rows. */}
        <div className="mt-12 rounded-3xl border border-border bg-surface">
          {hardParts.map((h, i) => (
            <div
              key={h.source}
              className={`grid gap-2 p-5 md:grid-cols-[230px_1fr] md:items-baseline md:gap-8 md:px-8 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                {h.source}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{h.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Proof */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow={t("proofHeading.eyebrow")}
          title={t("proofHeading.title")}
          intro={t("proofHeading.intro")}
        />
        <div className="mt-10">
          <MetricBand metrics={metrics} />
        </div>
        <div className="mt-10 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
        <p className="mt-8 text-sm text-muted">
          {t.rich("caseStudiesLine", {
            link: (c) => (
              <Link href="/case-studies" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
                {c}
              </Link>
            ),
          })}
        </p>
      </Section>

      {/* A migration is one slice of the wider implementation engagement. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <InlineCta
            title={t("consultingCta.title")}
            href="/snowflake-consulting-services"
            label={t("consultingCta.label")}
          />
        </div>
      </Section>

      {/* Booking replaces the generic CTA here: this page is evaluation-stage,
          so "talk to the person who would own it" beats "let's talk". */}
      <BookACall variant="compact" />
    </>
  );
}
