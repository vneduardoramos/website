import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/i18n-content";

/**
 * A date, rendered as a real `<time>` with a machine-readable `dateTime`.
 *
 * Every date on the site was previously bare prose ("June 6, 2026"), including
 * the two whose dates are legally load-bearing. There was not one `<time>`
 * element anywhere. A localized long-form date is ambiguous to a machine (is
 * "6/6" June or the sixth of the month?) and unparseable in Spanish without
 * locale knowledge, so `dateTime` carries the ISO value alongside the human text.
 *
 * `formatDate` stays the single source of the visible formatting.
 */
export function FormattedDate({
  date,
  locale,
  className,
}: {
  date: Date | string | null | undefined;
  locale: Locale;
  className?: string;
}) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  return (
    <time dateTime={d.toISOString().slice(0, 10)} className={className}>
      {formatDate(d, locale)}
    </time>
  );
}
