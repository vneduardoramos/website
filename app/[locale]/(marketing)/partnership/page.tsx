import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { InlineCta } from "@/components/marketing/Blocks";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { FieldStrip } from "@/components/marketing/FieldStrip";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { PartnershipHighlight } from "@/components/marketing/PartnershipHighlight";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnership.meta" });
  return pageMeta({
    title: t("title"),
    description: t("description"),
    path: "/partnership",
    locale,
    ownOgFile: true,
  });
}

// Build-vs-partner comparison: the question every leader weighs.
type Row = { dimension: string; inhouse: string; big3: string; viewnear: string };

export default async function PartnershipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("partnership");

  const unlocks = t.raw("unlocks") as { title: string; body: string }[];
  const comparison = t.raw("comparison") as Row[];

  return (
    <>
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
          />
        </div>
      </div>

      {/* Badges + CoCo Preferred Partner momentum */}
      <PartnershipHighlight title={t("highlight.title")} />

      {/* The claim, and the record that corroborates it.
          The page asserts two partner recognitions; this is the outbound link to
          Snowflake's own directory entry, so the claim is checkable by a reader
          and by a crawler following an anchor, not only via sameAs in JSON-LD.
          rel keeps the endorsement one-directional without nofollowing it: this
          is a citation of a primary source, which is exactly what should be
          followable. */}
      <div className="container-page -mt-6 md:-mt-8">
        <p className="text-sm text-muted">
          {t("directory.body")}{" "}
          <a
            href="https://www.snowflake.com/en/why-snowflake/partners/all-partners/viewnear/"
            target="_blank"
            rel="noopener"
            className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
          >
            {t("directory.label")}
          </a>
          <span aria-hidden="true"> →</span>
        </p>
      </div>

      {/* What it unlocks */}
      <Section>
        <SectionHeading
          eyebrow={t("unlocksHeading.eyebrow")}
          title={t("unlocksHeading.title")}
          intro={t("unlocksHeading.intro")}
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {unlocks.map((u) => (
            <div key={u.title} className="card card-hover flex h-full flex-col">
              <h3 className="font-display text-xl font-bold text-foreground">{u.title}</h3>
              <p className="mt-3 text-muted">{u.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* Build vs partner comparison */}
      <Section id="comparison" className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("comparisonHeading.eyebrow")}
            title={t("comparisonHeading.title")}
            intro={t("comparisonHeading.intro")}
          />

          {/* Desktop table */}
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

          {/* Mobile stacked cards */}
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

      {/* Certified vs generalist */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <FeatureSplit
            eyebrow={t("certified.eyebrow")}
            title={t.rich("certified.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            body={t("certified.body")}
            bullets={t.raw("certified.bullets") as string[]}
            image="/assets/images/life/team-booth.jpg"
            imageAlt={t("certified.imageAlt")}
            reverse
            cta={{ label: t("certified.cta"), href: "/services" }}
          />
          <LeadershipStrip label={t("certified.leadershipLabel")} className="mt-10" />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Real event photography: partner-ecosystem presence, made visible.
          team-booth is excluded here since the FeatureSplit above already uses
          it, and partner-momentum since it now anchors the inset up top. */}
      <FieldStrip items={["team-group", "team-stage", "team-dinner"]} />

      {/* Partner status is the credential; this is what it buys. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <InlineCta
            title={t("consultingCta.title")}
            href="/snowflake-consulting-services"
            label={t("consultingCta.label")}
          />
        </div>
      </Section>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
