"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Two live clocks, Austin and Monterrey, proving the time-zone claim with the
 * actual time instead of an icon. Quiet inline strip: mono type between
 * hairlines, no card. Renders nothing until mounted (the time is inherently
 * client-side, so this avoids any hydration mismatch), then ticks every 30s.
 */

const CLOCKS = [
  { city: "Austin", timeZone: "America/Chicago" },
  { city: "Monterrey", timeZone: "America/Monterrey" },
] as const;

function timeIn(timeZone: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());
}

export function TwoClocks() {
  const t = useTranslations("misc");
  const locale = useLocale();
  const intlLocale = locale === "es" ? "es-419" : "en-US";
  const [times, setTimes] = useState<string[] | null>(null);

  useEffect(() => {
    const tick = () => setTimes(CLOCKS.map((c) => timeIn(c.timeZone, intlLocale)));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [intlLocale]);

  if (!times) return null;

  return (
    <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y border-border py-3 font-mono text-xs tracking-wide text-muted">
      {CLOCKS.map((c, i) => (
        <span key={c.city} className="whitespace-nowrap">
          <span className="font-semibold text-foreground">{c.city}</span>{" "}
          <time>{times[i]}</time>
        </span>
      ))}
      <span className="whitespace-nowrap">{t("twoClocks.tagline")}</span>
    </div>
  );
}
