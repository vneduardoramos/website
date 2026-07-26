"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated count-up for stats. Counts up to a *clean* numeric value (e.g. "50+",
 * "1,300", "2×") when scrolled into view; ranged/worded/text values ("8–16 wks",
 * "Premier", "Americas") display statically so the count is never misleading.
 * `valueClassName` styles the number element (so callers can keep
 * `.text-gradient`). Respects `prefers-reduced-motion`.
 *
 * The real value is what renders on the server and what stays in the DOM if JS
 * never runs. That is not cosmetic: these stats are the site's proof numbers,
 * and AI crawlers read raw HTML. A sample of 27 stats across 15 pages was
 * serving 10 of them as "0", "0%" or "0+".
 */
export function StatCounter({
  value,
  label,
  valueClassName = "font-display text-4xl font-bold text-foreground lg:text-5xl",
}: {
  value: string;
  label: string;
  valueClassName?: string;
}) {
  // Only a plain number with a simple suffix (+, %, ×, k, M…) counts up.
  const m = value.match(/^(\d[\d,]*)([+%x×kKmMbB]*)$/);
  const numeric = !!m;
  const target = numeric ? parseInt(m![1].replace(/,/g, ""), 10) : 0;
  const suffix = numeric ? m![2] : "";

  // `null` means "not animating", and the render falls back to the real target.
  // Starting at 0 instead put a literal 0 in the server HTML, so every crawler
  // and every reader without JS was told "0+ Years", "0% Faster time to first
  // insight", "0x More reliable pipelines". Those are the numbers the page
  // exists to prove, and they are exactly what an answer engine lifts, so the
  // final value has to be the server-rendered value and the count-up has to be
  // a pure client-side enhancement layered on top.
  const [display, setDisplay] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!numeric) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (started.current) return;
        started.current = true;
        // The observer's first callback reports the element's state at
        // observation time. Already on screen means the reader has seen the real
        // number, so counting up from 0 now would visibly snap it backwards:
        // leave it alone. Only a stat scrolled INTO view gets the animation.
        if (entry.isIntersecting) {
          obs.disconnect();
          return;
        }
        obs.disconnect();
        const io = new IntersectionObserver(
          (later) => {
            if (!later[0].isIntersecting) return;
            io.disconnect();
            const duration = 1200;
            const start = performance.now();
            const step = (t: number) => {
              const p = Math.min((t - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.round(eased * target));
              // Hand the value back to the server-rendered target at the end,
              // so nothing depends on the animation having finished.
              if (p < 1) raf = requestAnimationFrame(step);
              else setDisplay(null);
            };
            raf = requestAnimationFrame(step);
          },
          { threshold: 0.4 },
        );
        io.observe(el);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [numeric, target]);

  return (
    <div ref={ref} className="text-center">
      <div className={`tabular-nums ${valueClassName}`}>
        {numeric ? `${(display ?? target).toLocaleString()}${suffix}` : value}
      </div>
      <div className="mt-2 text-sm text-muted">{label}</div>
    </div>
  );
}
