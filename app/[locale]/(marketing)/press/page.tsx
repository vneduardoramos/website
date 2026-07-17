import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { formatDate } from "@/lib/utils";
import { PRESS } from "@/lib/press";
import type { Locale } from "@/lib/i18n-content";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "press.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/press", locale });
}

export default async function PressPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("press");

  return (
    <>
      <Section>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} intro={t("intro")} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PRESS.map((item) => (
            <article key={item.slug} className="card flex h-full flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {formatDate(item.date, locale as Locale)}
              </p>
              <h2 className="mt-3 font-display text-xl font-bold leading-snug text-foreground">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primaryDeep hover:underline"
                >
                  {item.title}
                </a>
              </h2>
              <p className="mt-2 text-sm font-semibold text-primaryDeep">
                {t("attribution", { outlet: item.outlet, author: item.author })}
              </p>
              <blockquote className="mt-4 flex-1 text-base italic leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-foreground">{item.quoteBy}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
              >
                <span className="link-underline">{t("readOn")}</span>
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
