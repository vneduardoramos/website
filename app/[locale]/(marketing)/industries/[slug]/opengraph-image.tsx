import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getIndustryBySlug } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear industry";

const COPY = {
  en: { eyebrow: "Industries", fallback: "Industries" },
  es: { eyebrow: "Industrias", fallback: "Industrias" },
} as const;

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const copy = COPY[params.locale as Locale] ?? COPY.en;
  const industry = await getIndustryBySlug(params.slug, params.locale as Locale).catch(() => null);
  const title = industry
    ? params.locale === "es"
      ? `${industry.name}: datos e IA en Snowflake`
      : `${industry.name}: data & AI on Snowflake`
    : copy.fallback;
  return renderOg({ eyebrow: copy.eyebrow, title });
}
