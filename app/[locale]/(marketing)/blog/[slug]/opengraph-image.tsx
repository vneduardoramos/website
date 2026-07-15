import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getBlogPostBySlug } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear blog post";

const COPY = {
  en: { eyebrow: "Blog", fallback: "Field notes" },
  es: { eyebrow: "Blog", fallback: "Notas de campo" },
} as const;

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const copy = COPY[params.locale as Locale] ?? COPY.en;
  const post = await getBlogPostBySlug(params.slug, params.locale as Locale).catch(() => null);
  return renderOg({ eyebrow: copy.eyebrow, title: post?.title ?? copy.fallback });
}
