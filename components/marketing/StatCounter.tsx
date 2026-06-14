"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated count-up for stats. Counts up to a *clean* numeric value (e.g. "50+",
 * "1,300", "2×") on scroll-in; ranged/worded/text values ("8–16 wks", "Premier",
 * "Americas") display statically so the count is never misleading. `valueClassName`
 * styles the number element (so callers can keep `.text-gradient`). Respects
 * `prefers-reduced-motion` (shows the final value immediately).
 */
export function StatCounter({
  value,
  label,
  valueClassName = "font-display text-4xl font-bold text-foreground md:text-5xl",
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

  const [display, setDisplay] = useState(numeric ? 0 : target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!numeric) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [numeric, target]);

  return (
    <div ref={ref} className="text-center">
      <div className={`tabular-nums ${valueClassName}`}>
        {numeric ? `${display.toLocaleString()}${suffix}` : value}
      </div>
      <div className="mt-2 text-sm text-muted">{label}</div>
    </div>
  );
}
