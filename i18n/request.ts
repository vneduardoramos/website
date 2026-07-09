import { getRequestConfig } from "next-intl/server";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { routing } from "./routing";

const ROOT = join(process.cwd(), "messages");
const cache = new Map<string, Record<string, unknown>>();

function load(locale: string): Record<string, unknown> {
  const prod = process.env.NODE_ENV === "production";
  if (prod && cache.has(locale)) return cache.get(locale)!;
  const out: Record<string, unknown> = {};
  try {
    for (const f of readdirSync(join(ROOT, locale))) {
      if (f.endsWith(".json")) {
        out[f.slice(0, -5)] = JSON.parse(readFileSync(join(ROOT, locale, f), "utf8"));
      }
    }
  } catch {
    // No message dir yet (e.g. before catalogs are authored) — empty namespace set.
  }
  if (prod) cache.set(locale, out);
  return out;
}

function deepMerge(base: any, over: any): any {
  if (over == null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over ?? base;
  const out: any = { ...base };
  for (const k of Object.keys(over)) out[k] = k in base ? deepMerge(base[k], over[k]) : over[k];
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  const en = load("en");
  const messages = locale === "en" ? en : deepMerge(en, load(locale));
  return { locale, messages };
});
