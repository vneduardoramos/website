"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

/**
 * Hero slide carousel: horizontal slide between panels, auto-advancing (pauses
 * on hover/focus), with dot + arrow controls. Reduced-motion users get instant
 * switches and no auto-advance. Slides are server-rendered and passed in.
 */
export function HeroCarousel({
  slides,
  intervalMs = 6500,
  label,
}: {
  slides: React.ReactNode[];
  intervalMs?: number;
  label?: string;
}) {
  const t = useTranslations("heroUi");
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), intervalMs);
    return () => clearInterval(t);
    // `active` resets the timer after manual nav so each slide gets a full turn.
  }, [count, paused, intervalMs, active]);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={label ?? t("carousel.label")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={t("carousel.slidePosition", { current: i + 1, total: count })}
              aria-hidden={i !== active}
              {...({ inert: i !== active ? "" : undefined } as Record<string, unknown>)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label={t("carousel.previous")}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border bg-surface/80 p-2.5 text-foreground shadow-soft backdrop-blur transition hover:bg-surface md:flex lg:left-6"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label={t("carousel.next")}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border bg-surface/80 p-2.5 text-foreground shadow-soft backdrop-blur transition hover:bg-surface md:flex lg:right-6"
          >
            <Chevron dir="right" />
          </button>

          <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={t("carousel.goToSlide", { current: i + 1 })}
                aria-current={i === active}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === active ? "w-7 bg-primary" : "w-2.5 bg-border hover:bg-muted",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
