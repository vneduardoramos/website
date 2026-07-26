import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/marketing/ui";
import { FormattedDate } from "@/components/marketing/FormattedDate";
import { LEGAL_UPDATED } from "@/config/legal";
import type { Locale } from "@/lib/i18n-content";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/terms", locale });
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: "/terms",
            name: t("meta.title"),
            description: t("meta.description"),
            locale,
          }),
          breadcrumbLd(
            [{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }],
            locale,
          ),
        ]}
      />
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            description={t("hero.description")}
          />
        </div>
      </div>

      <Section>
        <div className="prose-vn max-w-3xl">
          <p className="text-muted">
            {t("lastUpdated")}:{" "}
            <FormattedDate date={LEGAL_UPDATED["/terms"]} locale={locale as Locale} />
          </p>

          <p>{t("intro")}</p>

          <h2>{t("sections.use.title")}</h2>
          <p>{t("sections.use.body")}</p>

          <h2>{t("sections.ip.title")}</h2>
          <p>{t("sections.ip.body")}</p>

          <h2>{t("sections.services.title")}</h2>
          <p>{t("sections.services.body")}</p>

          <h2>{t("sections.thirdParty.title")}</h2>
          <p>{t("sections.thirdParty.body")}</p>

          <h2>{t("sections.noWarranties.title")}</h2>
          <p>{t("sections.noWarranties.body")}</p>

          <h2>{t("sections.liability.title")}</h2>
          <p>{t("sections.liability.body")}</p>

          <h2>{t("sections.links.title")}</h2>
          <p>{t("sections.links.body")}</p>

          <h2>{t("sections.changes.title")}</h2>
          <p>{t("sections.changes.body")}</p>

          <h2>{t("sections.contact.title")}</h2>
          <p>
            {t.rich("sections.contact.body", {
              link: (c) => <a href={`mailto:${theme.brand.email}`}>{c}</a>,
            })}
          </p>
        </div>
      </Section>
    </>
  );
}
