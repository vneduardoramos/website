import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/marketing/ui";
import { PRESS_HOME_QUOTE } from "@/lib/press";

/**
 * Compact "In the press" band: CRN's own framing quote (the strongest
 * third-party validation line, verbatim + untranslated) attributed to CRN
 * with a link out to the source article, plus a link to the full /press
 * coverage list. Server component (no hooks), a cool `.section-tint` band so
 * it keeps the site's warm/cool rhythm (never placed immediately before the
 * warm CtaBand).
 */
export async function PressStrip() {
  const t = await getTranslations("press");
  return (
    <Section className="section-tint">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="eyebrow">{t("eyebrow")}</span>
        <Link
          href="/press"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
        >
          <span className="link-underline">{t("homeCta")}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <blockquote className="mt-8 max-w-3xl text-balance font-display text-2xl font-medium italic leading-snug text-foreground md:text-3xl">
        &ldquo;{PRESS_HOME_QUOTE.quote}&rdquo;
      </blockquote>
      <p className="mt-4 text-sm font-semibold">
        <a
          href={PRESS_HOME_QUOTE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaryDeep hover:underline"
        >
          {PRESS_HOME_QUOTE.quoteBy}
        </a>
      </p>
    </Section>
  );
}
