import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor } from "@/components/marketing/Decor";
import { PRESS, PRESS_HOME_QUOTE, getOutlet } from "@/lib/press";

/**
 * Editorial "In the press" pull-quote moment: the outlet's own framing quote
 * (the strongest third-party validation line, verbatim + untranslated), staged
 * behind an oversized typographic quotation mark, the section's one signature
 * element. Attributed to the outlet (its logo, or its name as a chip when no
 * logo exists) linking out to the article, with the article byline underneath,
 * plus a link to the full /press coverage list. Outlet-agnostic (see OUTLETS).
 * Server component (no hooks), a cool `.section-tint` band so it keeps the
 * site's warm/cool rhythm (never placed immediately before the warm CtaBand;
 * the home page puts FAQ between them).
 */

// The phrase in the quote worth a subtle accent: the substrate + partner
// story in one clause. Split at render time so the surrounding text is never
// duplicated/hand-copied (the quote itself stays verbatim + untranslated).
const HIGHLIGHT_PHRASE = "governed Snowflake data";

function splitOnPhrase(text: string, phrase: string): [string, string, string] {
  const idx = text.indexOf(phrase);
  if (idx === -1) return [text, "", ""];
  return [text.slice(0, idx), phrase, text.slice(idx + phrase.length)];
}

export async function PressStrip() {
  const t = await getTranslations("press");
  const [before, highlight, after] = splitOnPhrase(PRESS_HOME_QUOTE.quote, HIGHLIGHT_PHRASE);
  // PRESS_HOME_QUOTE.url === PRESS[1].url (see lib/press.ts); reuse that
  // article's byline for the credit line under the CRN source chip.
  const sourceArticle = PRESS.find((item) => item.url === PRESS_HOME_QUOTE.url) ?? PRESS[1];
  const outlet = getOutlet(PRESS_HOME_QUOTE.outlet);

  return (
    <section className="section section-tint relative overflow-hidden">
      <SectionDecor variant="dots" />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <div
            aria-hidden="true"
            className="mt-2 select-none font-display text-[5.5rem] leading-none text-primary/15 md:text-[7.5rem]"
          >
            &ldquo;
          </div>
          <blockquote className="-mt-8 text-balance font-display text-2xl font-medium italic leading-snug text-foreground md:-mt-12 md:text-3xl">
            &ldquo;{before}
            <ScrollHighlight>{highlight}</ScrollHighlight>
            {after}&rdquo;
          </blockquote>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-muted">
            <a
              href={PRESS_HOME_QUOTE.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read the coverage on ${outlet.name} by ${sourceArticle.author}`}
              className={
                outlet.logo
                  ? "inline-flex items-center rounded-lg border border-border bg-white px-3 py-1.5 shadow-soft transition-shadow hover:shadow-soft-lg"
                  : "pill-chip transition-colors hover:bg-primaryDeep/15"
              }
            >
              {outlet.logo ? (
                <Image
                  src={outlet.logo}
                  alt={outlet.name}
                  width={outlet.logoWidth ?? 200}
                  height={outlet.logoHeight ?? 80}
                  sizes="96px"
                  className="h-5 w-auto md:h-6"
                />
              ) : (
                outlet.name
              )}
            </a>
            <span aria-hidden="true">&middot;</span>
            <span>{sourceArticle.author}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/press"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
            >
              <span className="link-underline">{t("homeCta")}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <span className="font-mono text-xs text-muted">
              {t("storiesCount", { count: PRESS.length })}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
