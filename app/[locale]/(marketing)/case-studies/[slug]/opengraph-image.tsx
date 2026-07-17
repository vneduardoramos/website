import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getCaseStudyBySlug } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear case study";

const COPY = {
  en: { eyebrow: "Case study", fallback: "Case study" },
  es: { eyebrow: "Casos de éxito", fallback: "Caso de éxito" },
} as const;

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const copy = COPY[params.locale as Locale] ?? COPY.en;
  const cs = await getCaseStudyBySlug(params.slug, params.locale as Locale).catch(() => null);
  return renderOg({ eyebrow: cs?.sector ?? copy.eyebrow, title: cs?.title ?? copy.fallback });
}
