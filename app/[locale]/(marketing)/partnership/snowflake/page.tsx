import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Img as Image } from "@/components/marketing/Img";
import { PartnershipHighlight } from "@/components/marketing/PartnershipHighlight";
import { FieldStrip } from "@/components/marketing/FieldStrip";
import { SNOWFLAKE } from "@/config/partners";
import {
  PartnerHero,
  TwoWays,
  StackGroups,
  InPractice,
  AroundIt,
  Leaders,
  hl,
} from "@/components/marketing/partnership/PartnerPageBlocks";

const PATH = "/partnership/snowflake";

/** One row of the build-vs-partner comparison, moved here from the old hub. */
type Row = { dimension: string; inhouse: string; big3: string; viewnear: string };

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnershipSnowflake.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: PATH, locale, ownOgFile: true });
}

export default async function SnowflakePartnershipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("partnershipSnowflake");
  const u = await getTranslations("sharedUi");
  const comparison = t.raw("comparison") as Row[];

  return (
    <>
      <JsonLd
        data={[
          webPageLd({ path: PATH, name: t("meta.title"), description: t("meta.description"), locale }),
          breadcrumbLd(
            [{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }],
            locale,
          ),
        ]}
      />

      <PartnerHero
        partner={SNOWFLAKE}
        eyebrow={t("hero.eyebrow")}
        kicker={t("hero.kicker")}
        title={t.rich("hero.title", { hl })}
        description={t("hero.description")}
        ctaPrimary={t("hero.ctaPrimary")}
        ctaSecondary={t("hero.ctaSecondary")}
        verify={u("partnerPlates.verify")}
      />

      {/* Proof before argument: the partnership is a thing the team turns up to,
          so one wide frame sits directly under the hero where it gets seen.
          Row and caption, not a card. */}
      <Section>
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/assets/images/life/team-dfb.jpg"
              alt={t("fieldPhoto.alt")}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="aspect-[16/9] object-cover"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            {t("fieldPhoto.caption")}
          </figcaption>
        </figure>
      </Section>

      <TwoWays eyebrow={t("ways.eyebrow")} title={t("ways.title")} items={t.raw("ways.items") as { title: string; body: string }[]} />

      <FieldStrip items={["team-dfb-backdrop", "dfb-room", "team-group", "team-dinner"]} />

      <StackGroups
        eyebrow={t("stack.eyebrow")}
        title={t("stack.title")}
        intro={t("stack.intro")}
        groups={t.raw("stack.groups") as { label: string; items: string[] }[]}
        className="section-warm"
      />

      <InPractice
        eyebrow={t("practice.eyebrow")}
        title={t("practice.title")}
        slugs={["insurance-claims-cortex-ai", "sku-catalog-governance", "real-time-student-data-pipeline"]}
        locale={locale}
      />

      <AroundIt
        eyebrow={t("around.eyebrow")}
        title={t.rich("around.title", { hl })}
        intro={t("around.intro")}
        items={t.raw("around.items") as { title: string; body: string }[]}
      />

      {/* The recognition, with the facts and the photographed Summit slide. */}
      <PartnershipHighlight title={t("highlight.title")} badges="snowflake" />
      <div className="container-page -mt-6 md:-mt-8">
        <p className="text-sm text-muted">
          {t("directory.body")}{" "}
          {SNOWFLAKE.directoryUrl && (
            <a
              href={SNOWFLAKE.directoryUrl}
              target="_blank"
              rel="noopener"
              className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
            >
              {t("directory.label")}
              <span aria-hidden="true"> →</span>
            </a>
          )}
        </p>
      </div>

      <Leaders eyebrow={t("leaders.eyebrow")} title={t("leaders.title")} body={t("leaders.body")} />

      {/* Build vs partner. Moved here when the partnership hub folded into this
          page; /services still links straight to #comparison. */}
      <Section id="comparison" className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading eyebrow={t("comparisonHeading.eyebrow")} title={t("comparisonHeading.title")} intro={t("comparisonHeading.intro")} />
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-border bg-background md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left">
                  <th className="px-5 py-4 font-medium text-muted">&nbsp;</th>
                  <th className="px-5 py-4 font-display font-bold text-foreground">{t("comparisonHeaders.inhouse")}</th>
                  <th className="px-5 py-4 font-display font-bold text-foreground">{t("comparisonHeaders.big3")}</th>
                  <th className="px-5 py-4 font-display font-bold text-primaryDeep">{t("comparisonHeaders.viewnear")}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.dimension} className="border-t border-border align-top">
                    <td className="px-5 py-4 font-semibold text-foreground">{r.dimension}</td>
                    <td className="px-5 py-4 text-muted">{r.inhouse}</td>
                    <td className="px-5 py-4 text-muted">{r.big3}</td>
                    <td className="bg-surface2/60 px-5 py-4 font-medium text-foreground">{r.viewnear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 space-y-4 md:hidden">
            {comparison.map((r) => (
              <div key={r.dimension} className="card bg-background">
                <h3 className="font-display text-base font-bold text-foreground">{r.dimension}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t("comparisonMobile.inhouse")}</dt>
                    <dd className="text-right text-muted">{r.inhouse}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t("comparisonMobile.big3")}</dt>
                    <dd className="text-right text-muted">{r.big3}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-border pt-2">
                    <dt className="font-semibold text-primaryDeep">{t("comparisonMobile.viewnear")}</dt>
                    <dd className="text-right font-medium text-foreground">{r.viewnear}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>


      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
