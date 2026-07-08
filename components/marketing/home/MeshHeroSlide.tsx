"use client";

import Link from "next/link";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { HeroAurora } from "@/components/marketing/home/HeroAurora";

const PILLS = [
  "Migrate & modernize",
  "Govern data people trust",
  "Ship AI into production",
];

/**
 * Home hero, "the governed data engine": a centered headline + CTAs over an
 * ambient aurora (soft, slowly drifting color fields in the Glacier palette).
 * Proof reads as a single mono credential line; the certification badges get
 * their one full showing in the Proof & Trust band further down. Calm,
 * on-palette, and consistent with the centered hero language of the content pages.
 */
export function MeshHeroSlide({ subhead }: { subhead?: string }) {
  const sub =
    subhead ||
    "We help enterprises stand up two lasting capabilities: a data practice the whole company trusts and an AI practice that ships use cases into production. Built alongside in-house teams and run by them, guided and accelerated by ours, across the Americas.";

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
            From data strategy to <span className="text-gradient-accent">AI in production</span>, on Snowflake.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{sub}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {PILLS.map((p) => (
              <span key={p} className="pill-tag">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary btn-lg group">
              Talk to an architect
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link href="/services" className="btn-ghost btn-lg">
              Explore services
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
            Snowflake Premier &amp; CoCo Preferred Partner · SnowPro-certified · The Americas
          </p>
        </div>
      </div>
    </div>
  );
}
