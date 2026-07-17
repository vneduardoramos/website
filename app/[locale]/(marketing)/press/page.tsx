import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { RevealGroup } from "@/components/marketing/Motion";
import { cn, formatDate } from "@/lib/utils";
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
        {/* Editorial "dispatches" list: the newest article (index 0) gets a
            wider, larger-type lead treatment; the rest fill an equal-height
            2-column grid. Neutral card hairlines throughout, no colored
            rails; a small font-display quote glyph stands in for a rail. */}
        <RevealGroup className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-2">
          {PRESS.map((item, i) => {
            const isFeatured = i === 0;
            return (
              <article
                key={item.slug}
                className={cn(
                  "card card-hover flex h-full flex-col",
                  isFeatured && "md:col-span-2",
                )}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {isFeatured && <span className="pill-chip">{t("latest")}</span>}
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    CRN &middot; {formatDate(item.date, locale as Locale)}
                  </p>
                </div>
                <h3
                  className={cn(
                    "mt-3 font-display font-semibold leading-snug text-foreground",
                    isFeatured ? "text-2xl md:text-[1.75rem]" : "text-lg",
                  )}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline hover:text-primaryDeep"
                  >
                    {item.title}
                  </a>
                </h3>
                <blockquote
                  className={cn(
                    "relative italic leading-relaxed text-foreground",
                    isFeatured ? "mt-5 max-w-2xl pl-6 text-lg" : "mt-4 pl-5 text-base",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-0 select-none font-display leading-none text-primary/25",
                      isFeatured ? "text-3xl" : "text-2xl",
                    )}
                  >
                    &ldquo;
                  </span>
                  {item.quote}
                </blockquote>
                <p className="mt-3 text-sm font-semibold text-muted">{item.quoteBy}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">{t("readOn")}</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </article>
            );
          })}
        </RevealGroup>
      </Section>
      <CtaBand />
    </>
  );
}
