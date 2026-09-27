"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { HeroAurora } from "@/components/marketing/home/HeroAurora";

/**
 * Home hero. The headline names the problem the business recognizes, not the
 * vendors behind the answer: Snowflake and Claude appear once each in the
 * subhead, as the how, and again in the mono credential line, as the proof.
 * The badges themselves get their showing further down the page.
 *
 * The headline is set in one weight and one color. It used to carry a gradient
 * span, which reads as the house style of every AI landing page; size and the
 * line itself do the work instead. The `hl` handler stays registered so a
 * translated string carrying the tag renders rather than throwing.
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
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.04] tracking-tight text-foreground md:text-[3.6rem]">
            {t.rich("hero.title", { hl: (c) => <span className="text-primaryDeep">{c}</span> })}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{sub}</p>

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
            only where a reader would break it. */}
        <p className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted">
          {t("hero.credential")
            .split("·")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part, i) => (
              <span key={part} className="whitespace-nowrap">
                {i > 0 && <span aria-hidden="true" className="mr-2">·</span>}
                {part}
              </span>
            ))}
        </p>
      </div>
    </div>
  );
}
