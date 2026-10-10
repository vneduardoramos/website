import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/marketing/ui";
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

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnershipSnowflake.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: PATH, locale });
}

export default async function SnowflakePartnershipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("partnershipSnowflake");
  const u = await getTranslations("sharedUi");

  return (
    <>
      <JsonLd
        data={[
          webPageLd({ path: PATH, name: t("meta.title"), description: t("meta.description"), locale }),
          breadcrumbLd(
            [
              { name: t("breadcrumb.home"), url: "/" },
              { name: t("breadcrumb.partnership"), url: "/partnership" },
              { name: t("breadcrumb.current") },
            ],
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

      <TwoWays eyebrow={t("ways.eyebrow")} title={t("ways.title")} items={t.raw("ways.items") as { title: string; body: string }[]} />

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

      <FieldStrip items={["team-group", "team-stage", "team-dinner"]} />

      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
