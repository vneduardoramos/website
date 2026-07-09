import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "thankYou.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/thank-you", noindex: true, locale });
}

export default async function ThankYouPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("thankYou");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary btn-lg">
            {t("actions.home")}
          </Link>
          <Link href="/case-studies" className="btn-ghost btn-lg">
            {t("actions.caseStudies")}
          </Link>
          <Link href="/resources" className="btn-ghost btn-lg">
            {t("actions.resources")}
          </Link>
        </div>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-2xl text-center text-muted">
          <p>{t("body")}</p>
        </div>
      </Section>
    </>
  );
}
