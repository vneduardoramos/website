"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Two live clocks, Austin and Monterrey, proving the time-zone claim with the
 * actual time instead of an icon. Quiet inline strip: mono type between
 * hairlines, no card.
 *
 * The city names and the strip render on the server; only the digits wait for
 * the client, since the time is inherently client-side. It used to return null
 * until mounted, which kept the whole strip (both city names included) out of the
 * server HTML, so the page's proof of the time-zone overlap was invisible to
 * anything that does not run JavaScript, AI crawlers included.
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

  return (
    <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-y border-border py-3 font-mono text-xs tracking-wide text-muted">
      {CLOCKS.map((c, i) => (
        <span key={c.city} className="whitespace-nowrap">
          <span className="font-semibold text-foreground">{c.city}</span>{" "}
          {/* Blank until the client ticks: a server-rendered time would be
              wrong for the reader and would trip hydration. */}
          <time>{times ? times[i] : "\u2014\u2014:\u2014\u2014"}</time>
        </span>
      ))}
      <span className="whitespace-nowrap">{t("twoClocks.tagline")}</span>
    </div>
  );
}
