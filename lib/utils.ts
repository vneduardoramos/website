import type { Locale } from "@/lib/i18n-content";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const INTL_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-419" };

/**
 * A publication date, formatted for display.
 *
 * Forced to UTC. Every date on this site is an editorial calendar date rather
 * than an instant: they are authored as `new Date("2025-06-29")` and stored as
 * midnight UTC. Formatting those in the host's local time shifts them a day
 * backwards anywhere west of Greenwich, so a post dated 2025-06-29 rendered
 * "June 28, 2025" on a machine in America/Denver while its own `<time datetime>`
 * said the 29th. Production happens to run UTC and was unaffected, which is
 * exactly why this stayed invisible: the output depended on the host timezone.
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: Locale = "en",
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(INTL_LOCALE[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Parse a JSON-encoded String column (SQLite) into a value, safely. */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Coerce a JSON-encoded String (or array) field into string[]. */
export function asStringArray(value: unknown): string[] {
  const v = typeof value === "string" ? parseJson<unknown>(value, []) : value;
  if (Array.isArray(v)) return v.map(String);
  return [];
}

/** Coerce a JSON-encoded String (or array) field into an array of objects. */
export function asObjectArray<T = Record<string, unknown>>(value: unknown): T[] {
  const v = typeof value === "string" ? parseJson<unknown>(value, []) : value;
  if (Array.isArray(v)) return v as T[];
  return [];
}
