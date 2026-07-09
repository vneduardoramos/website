// Content localization: overlay `${field}Es` values onto base fields so page
// components stay locale-blind. English is the fallback when an es value is
// empty. `*Es` keys are always stripped from the returned object (both locales)
// to keep them out of the RSC payload.
export type Locale = "en" | "es";
export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "es";
}

// Base field names that have an `${field}Es` counterpart, keyed by Prisma delegate.
const FIELDS: Record<string, string[]> = {
  service: ["title", "summary", "body", "seoTitle", "seoDescription"],
  industry: ["name", "headline", "intro", "body", "challenges", "deliverables", "stats", "seoTitle", "seoDescription"],
  caseStudy: ["title", "summary", "body", "challenge", "solution", "results", "metrics", "quote", "seoTitle", "seoDescription"],
  blogPost: ["title", "excerpt", "body", "keyTakeaways", "seoTitle", "seoDescription"],
  teamMember: ["title", "bio"],
  jobOpening: ["title", "description", "body", "employment"],
  tag: ["name"],
};

// Included relations to localize recursively: relationKeyOnRow -> delegate.
const RELATIONS: Record<string, Record<string, string>> = {
  industry: { caseStudies: "caseStudy" },
  caseStudy: { industry: "industry" },
  blogPost: { tags: "tag", authorTeam: "teamMember" },
};

function overlay<T extends Record<string, any>>(model: string, row: T, locale: Locale): T {
  if (!row || typeof row !== "object") return row;
  const out: Record<string, any> = { ...row };
  for (const f of FIELDS[model] ?? []) {
    const esKey = `${f}Es`;
    if (locale === "es") {
      const es = out[esKey];
      if (es != null && String(es).trim() !== "") out[f] = es;
    }
    delete out[esKey];
  }
  for (const [key, relModel] of Object.entries(RELATIONS[model] ?? {})) {
    const v = out[key];
    if (Array.isArray(v)) out[key] = v.map((r) => overlay(relModel, r, locale));
    else if (v && typeof v === "object") out[key] = overlay(relModel, v, locale);
  }
  return out as T;
}

export function localize<T>(model: string, row: T, locale: Locale): T {
  return overlay(model, row as any, locale) as T;
}
export function localizeMany<T>(model: string, rows: T[], locale: Locale): T[] {
  return rows.map((r) => localize(model, r, locale));
}
