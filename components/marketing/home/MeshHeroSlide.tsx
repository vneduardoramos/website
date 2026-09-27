"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { HeroAurora } from "@/components/marketing/home/HeroAurora";
import { credentialLine } from "@/config/partners";

/**
 * Home hero. The headline names the problem the business recognizes, not the
 * vendors behind the answer: Snowflake and Claude appear once each in the
 * subhead, as the how, and again in the mono credential line, as the proof.
 * The badges themselves get their showing further down the page.
 *
 * The second sentence of the headline carries the site's display gradient, the
 * same on-brand teal to indigo sweep the Customers and partnership headings
 * use. It is the punch line, and the contrast is what makes the eye land on it.
 */
export function MeshHeroSlide({ subhead }: { subhead?: string }) {
  const t = useTranslations("heroUi");
  const sub = subhead || t("hero.subhead");
  const pills = t.raw("hero.pills") as string[];

  return (
    <div className="relative flex min-h-[36rem] items-center overflow-hidden lg:min-h-[42rem]">
      <HeroBackground />
      <HeroAurora />

      {/* Soft vertical scrim so the centered headline stays legible over the
          aurora. The bottom stop is fully opaque so the hero lands exactly on
          the page background: no tonal seam against the logo band below. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/35 via-60% to-background"
        aria-hidden
      />

      <div className="container-page relative z-10 py-24 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold leading-[1.04] tracking-tight text-foreground md:text-[3.6rem]">
            {t.rich("hero.title", { hl: (c) => <span className="text-gradient-accent">{c}</span> })}
          </h1>

          {/* The hero's second voice, set wide and large: the headline makes the
              claim, this says what Viewnear actually does. Each word rises out
              of a blur in sequence, which makes the sentence read as it
              arrives rather than appearing all at once. */}
          <p className="mx-auto mt-7 max-w-4xl text-pretty text-xl font-medium leading-relaxed text-muted md:text-[1.65rem] md:leading-[1.5]">
            {sub.split(" ").map((word, i, all) => (
              <Fragment key={`${word}-${i}`}>
                <span className="hero-word" style={{ animationDelay: `${140 + i * 28}ms` }}>
                  {word}
                </span>
                {i < all.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {pills.map((p) => (
              <span key={p} className="pill-tag">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary btn-lg group">
              {t("hero.ctaPrimary")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link href="/services" className="btn-ghost btn-lg">
              {t("hero.ctaSecondary")}
            </Link>
          </div>

        </div>

        {/* The credential sits outside the headline column: it is one long mono
            line, and at 3xl it wrapped mid-word ("SNOWPRO- / CERTIFIED"). Each
            segment between the separators is kept whole, so the line breaks
            only where a reader would break it.

            Below sm a single credential is wider than the screen, so the
            segments wrap normally there and hold together from sm up.

            The tiers themselves come from config/partners.ts, so a change of
            level is one edit there and every surface follows. Only the team's
            certifications are translated. */}
        <p className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted">
          {credentialLine([t("hero.credentialCert")], { withNetwork: true })
            .split("·")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part, i) => (
              <span key={part} className="whitespace-normal sm:whitespace-nowrap">
                {i > 0 && <span aria-hidden="true" className="mr-2">·</span>}
                {part}
              </span>
            ))}
        </p>
      </div>
    </div>
  );
}
