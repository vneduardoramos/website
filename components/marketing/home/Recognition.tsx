import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor } from "@/components/marketing/Decor";
import { PRESS, PRESS_HOME_QUOTE, getOutlet } from "@/lib/press";

/**
 * Recognition: the two pieces of third-party proof the site owns, side by side.
 *
 * Left, the photograph: Snowflake's CoCo Global Partner Momentum wall at Summit
 * 2026, shot from the floor, with Viewnear's logo among the 41 named. A wall of
 * logos in front of a keynote audience says something a badge cannot, which is
 * that somebody else put the name up there.
 *
 * Right, the quote: the one line of press that names both halves of the offer,
 * verbatim and untranslated, credited to the speaker and the outlet.
 *
 * The photograph is 1600x1200 and the frame is 4:3, so `object-cover` crops
 * nothing and the marker below can be positioned as a percentage of the image
 * and stay on Viewnear's logo at every width. Measured from the source file:
 * the logo sits at x 696-808, y 673-698 of 1600x1200.
 */

const MARKER = { left: "42.5%", top: "54.3%", width: "9.5%", height: "5.2%" } as const;

// The phrase in the quote worth a subtle accent: the substrate and the partner
// in one clause. Split at render time so the surrounding text is never
// hand-copied; the quote itself stays verbatim and untranslated.
const HIGHLIGHT_PHRASE = "governed Snowflake data";

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
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-soft-lg">
                <Image
                  src="/assets/images/life/partner-momentum.jpg"
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  style={MARKER}
                  className="pointer-events-none absolute rounded-md ring-2 ring-secondary ring-offset-0"
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
        </Reveal>
      </div>
    </section>
  );
}
