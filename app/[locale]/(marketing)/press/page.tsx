import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { RevealGroup } from "@/components/marketing/Motion";
import { cn, formatDate } from "@/lib/utils";
import { PRESS, getOutlet, PRIMARY_SPEAKER } from "@/lib/press";
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
                    {getOutlet(item.outlet).name} &middot; {formatDate(item.date, locale as Locale)}
                  </p>
                </div>
                <h3
                  className={cn(
                    "mt-3 font-display font-bold leading-snug text-foreground",
                    isFeatured ? "text-2xl md:text-3xl" : "text-xl",
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
                    "mt-4 border-t border-border pt-4 italic leading-relaxed text-muted",
                    isFeatured ? "max-w-2xl text-base" : "text-sm",
                  )}
                >
                  &ldquo;{item.quote}&rdquo;
                  {item.quoteBy !== PRIMARY_SPEAKER && (
                    <cite className="mt-2 block not-italic text-sm font-semibold text-foreground">
                      {item.quoteBy}
                    </cite>
                  )}
                </blockquote>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">{t("readOn", { outlet: getOutlet(item.outlet).name })}</span>
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
