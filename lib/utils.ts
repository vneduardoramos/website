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

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
