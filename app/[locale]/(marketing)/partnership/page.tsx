import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FieldStrip } from "@/components/marketing/FieldStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { SNOWFLAKE, type PartnerNetwork } from "@/config/partners";
import { Link } from "@/i18n/navigation";
import { Img as Image } from "@/components/marketing/Img";
import { cn } from "@/lib/utils";

/**
 * The partnership hub: the Snowflake network, then the build-vs-partner
 * comparison.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnership.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/partnership", locale, ownOgFile: true });
}

type Row = { dimension: string; inhouse: string; big3: string; viewnear: string };

// Not a card: a column. A photograph carries the surface, the plate and the
// level sit under it in a row, then the heading, the body and a text link.
const PHOTO: Record<PartnerNetwork["key"], { src: string; alt: string }> = {
  snowflake: { src: "/assets/images/life/partner-momentum.jpg", alt: "Snowflake's CoCo Global Partner Momentum wall at Summit 2026" },
};

function NetworkColumn({
  partner,
  title,
  body,
  cta,
  href,
  verify,
  className,
}: {
  partner: PartnerNetwork;
  title: string;
  body: string;
  cta: string;
  href: string;
  verify: string;
  className?: string;
}) {
  const photo = PHOTO[partner.key];
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[16/10] object-cover" />
      </div>
      <div className="mt-6 flex items-center gap-5">
        <PartnerBadgeMark partner={partner} size="md" className="shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{partner.network}</p>
          <p className="mt-1 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-foreground">{partner.level}</p>
          {partner.directoryUrl && (
            <a href={partner.directoryUrl} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primaryDeep underline-offset-4 hover:underline">
              {verify}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-foreground md:text-[1.75rem]">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{body}</p>
      <Link href={href} className="group mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-primaryDeep">
        <span className="link-underline">{cta}</span>
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default async function PartnershipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("partnership");
  const u = await getTranslations("sharedUi");
  const comparison = t.raw("comparison") as Row[];
  const verify = u("partnerPlates.verify");

  return (
    <>
      <JsonLd
        data={[
          webPageLd({ path: "/partnership", name: t("meta.title"), description: t("meta.description"), locale }),
          breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }], locale),
        ]}
      />
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

      {/* The Snowflake network, handing off to its own page. */}
      <Section>
        <RevealGroup className="mx-auto max-w-xl" variant="fade-up">
          <NetworkColumn
            partner={SNOWFLAKE}
            title={t("networks.snowflake.title")}
            body={t("networks.snowflake.body")}
            cta={t("networks.snowflake.cta")}
            href="/partnership/snowflake"
            verify={verify}
          />
        </RevealGroup>
      </Section>

      {/* Build vs partner comparison */}
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

      <FieldStrip items={["team-group", "team-stage", "team-dinner"]} />

      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
