import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor } from "@/components/marketing/Decor";
import { PRESS, PRESS_HOME_QUOTE, getOutlet } from "@/lib/press";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { SNOWFLAKE, type PartnerNetwork } from "@/config/partners";

/**
 * Recognition: the two pieces of third-party proof the site owns, side by side.
 *
 * Left, the photograph: Snowflake's CoCo Global Partner Momentum wall at Summit
 * 2026, shot from the floor, with Viewnear's logo among the 41 named. A wall of
 * logos in front of a keynote audience says something a badge cannot, which is
 * that somebody else put the name up there.
 *
 * Right, the quote: a line of real press, verbatim and untranslated, credited
 * to the speaker and the outlet.
 *
 * The photograph is 1600x1200 and the frame is 4:3, so `object-cover` crops
 * nothing and a hover zoom can center on Viewnear's logo as a percentage of
 * the image and stay put at every width, rather than a ring calling it out
 * permanently. Measured from the source file: the logo sits at x 696-808,
 * y 673-698 of 1600x1200, so its center is 47.25%/56.9%.
 *
 * Below both, the credential the photograph names: a bare badge, one line on
 * what the network is for, and the way to the partnership page that goes
 * deep on it. Not a repeat of the hero's credential line; a reader who
 * scrolled this far gets the "so what."
 */

const LOGO_CENTER = { left: "47.25%", top: "56.9%" } as const;

function PartnerCard({
  partner,
  title,
  body,
  href,
  cta,
}: {
  partner: PartnerNetwork;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-5 rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary/50"
    >
      <PartnerBadgeMark partner={partner} size="sm" className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
          <span className="link-underline">{cta}</span>
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}

// The phrase in the quote worth a subtle accent. Split at render time so the
// surrounding text is never hand-copied; the quote itself stays verbatim and
// untranslated.
const HIGHLIGHT_PHRASE = "data first";

function splitOnPhrase(text: string, phrase: string): [string, string, string] {
  const idx = text.indexOf(phrase);
  if (idx === -1) return [text, "", ""];
  return [text.slice(0, idx), phrase, text.slice(idx + phrase.length)];
}

export async function Recognition() {
  const t = await getTranslations("homeServer.recognition");
  const p = await getTranslations("press");
  const [before, highlight, after] = splitOnPhrase(PRESS_HOME_QUOTE.quote, HIGHLIGHT_PHRASE);
  const outlet = getOutlet(PRESS_HOME_QUOTE.outlet);

  return (
    <section className="section relative overflow-hidden">
      <SectionDecor variant="dots" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">{t("eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.1]">
              {t.rich("title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            </h2>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* The photograph, uncropped, with Viewnear ringed on the wall. */}
            <figure className="m-0">
              <div className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border shadow-soft-lg">
                <Image
                  src="/assets/images/life/partner-momentum.jpg"
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-[2.2] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{ transformOrigin: `${LOGO_CENTER.left} ${LOGO_CENTER.top}` }}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                {t("caption")}
              </figcaption>
            </figure>

            {/* The press line, with the outlet and the way to the rest of it. */}
            <div className="min-w-0">
              <div
                aria-hidden="true"
                className="select-none font-display text-[4.5rem] leading-none text-primary/15 md:text-[6rem]"
              >
                &ldquo;
              </div>
              <blockquote className="-mt-7 text-balance font-display text-2xl font-medium italic leading-snug text-foreground md:-mt-10 md:text-[1.75rem]">
                &ldquo;{before}
                <ScrollHighlight>{highlight}</ScrollHighlight>
                {after}&rdquo;
              </blockquote>
              <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                <a
                  href={PRESS_HOME_QUOTE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p("readOn", { outlet: outlet.name })}
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
                <span>{PRESS_HOME_QUOTE.attribution}</span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href="/press"
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">{p("homeCta")}</span>
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <span className="font-mono text-xs text-muted">
                  {p("storiesCount", { count: PRESS.length })}
                </span>
              </div>
            </div>
          </div>

          {/* The credential, as a summary a reader can act on right here. */}
          <div className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-14">
            <p className="eyebrow mb-6">{t("partners.eyebrow")}</p>
            <div className="max-w-xl">
              <PartnerCard
                partner={SNOWFLAKE}
                title={t("partners.snowflake.title")}
                body={t("partners.snowflake.body")}
                href="/partnership/snowflake"
                cta={t("partners.cta")}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
