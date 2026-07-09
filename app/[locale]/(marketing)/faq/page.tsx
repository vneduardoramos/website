import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { getSetting, safe } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/faq", locale });
}

export const revalidate = 60;

type FaqRow = { category?: string; q: string; a: string };

export default async function FaqPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const faqs = await safe(getSetting<FaqRow[]>("faqs", locale as Locale), []);
  const rows = faqs ?? [];

  // Group by category, preserving first-seen order.
  const groups: { category: string; items: FaqRow[] }[] = [];
  for (const row of rows) {
    const category = row.category ?? t("defaultCategory");
    let group = groups.find((g) => g.category === category);
    if (!group) {
      group = { category, items: [] };
      groups.push(group);
    }
    group.items.push(row);
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rows.map((r) => ({
      "@type": "Question",
      name: r.q,
      acceptedAnswer: { "@type": "Answer", text: r.a },
    })),
  };

  return (
    <>
      {rows.length > 0 && <JsonLd data={faqLd} />}
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <h2 className="font-display text-xl font-bold text-foreground">{group.category}</h2>
              <div className="mt-5 space-y-4">
                {group.items.map((faq) => (
                  <details key={faq.q} className="card group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-bold">
                      {faq.q}
                      <span className="ml-4 text-2xl text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-muted">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
