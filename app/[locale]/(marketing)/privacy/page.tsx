import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor } from "@/components/marketing/Decor";
import { theme } from "@/config/theme";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/privacy", locale });
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const collectItems = t.raw("collect.items") as { label: string; body: string }[];
  const useItems = t.raw("use.items") as string[];

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: "/privacy",
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
          <p className="text-muted">{t("lastUpdated")}</p>

          <p>{t("intro")}</p>

          <h2>{t("collect.heading")}</h2>
          <p>{t("collect.intro")}</p>
          <ul>
            {collectItems.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> {item.body}
              </li>
            ))}
          </ul>

          <h2>{t("use.heading")}</h2>
          <p>{t("use.intro")}</p>
          <ul>
            {useItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{t("legalBasis.heading")}</h2>
          <p>{t("legalBasis.body")}</p>

          <h2>{t("cookies.heading")}</h2>
          <p>{t("cookies.body")}</p>

          <h2>{t("sharing.heading")}</h2>
          <p>{t("sharing.body")}</p>

          <h2>{t("retention.heading")}</h2>
          <p>{t("retention.body")}</p>

          <h2>{t("international.heading")}</h2>
          <p>{t("international.body")}</p>

          <h2>{t("rights.heading")}</h2>
          <p>{t("rights.body")}</p>

          <h2>{t("security.heading")}</h2>
          <p>{t("security.body")}</p>

          <h2>{t("children.heading")}</h2>
          <p>{t("children.body")}</p>

          <h2>{t("changes.heading")}</h2>
          <p>{t("changes.body")}</p>

          <h2>{t("contact.heading")}</h2>
          <p>
            {t.rich("contact.body", {
              link: (c) => <a href={`mailto:${theme.brand.email}`}>{c}</a>,
            })}
          </p>
        </div>
      </Section>
    </>
  );
}
