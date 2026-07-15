import type { Metadata } from "next";
import { theme } from "@/config/theme";
import { DEFAULT_LOCALE } from "@/lib/i18n-content";

const DEFAULT_OG = "/assets/og-default.jpg";

/**
 * Build per-page metadata with a canonical URL, Open Graph, and Twitter card.
 * Pass a bare `title` (no " | Viewnear" suffix; the root layout title template
 * adds it). `image` is the page's content image (site-relative or absolute);
 * it falls back to the sitewide default OG image. Set `noindex` for dormant or
 * utility pages that should not be indexed.
 *
 * `locale` selects which URL is canonical and drives the hreflang alternates.
 * It defaults to the site default (en) so existing callers stay valid until
 * they opt into a locale.
 */
export function pageMeta(opts: {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  // Accepts a plain string (page `params.locale`) so callers don't need to cast;
  // only the "es" value changes behavior, everything else resolves to the en default.
  locale?: string;
}): Metadata {
  const { title, description, path, image, type = "website", noindex, locale = DEFAULT_LOCALE } = opts;
  const base = theme.brand.url;
  const isHome = path === "/" || path === "";
  const enUrl = isHome ? base : `${base}${path}`;
  const esUrl = isHome ? `${base}/es` : `${base}/es${path}`;
  const url = locale === "es" ? esUrl : enUrl;
  const abs = (src: string) => (/^https?:\/\//i.test(src) ? src : `${theme.brand.url}${src}`);
  // Only pin an OG image when the caller passes one. Otherwise leave it unset
  // so the cascade resolves correctly: a route's own opengraph-image.tsx file
  // wins, and pages with neither fall back to the site-wide default declared
  // in app/layout.tsx. (Previously this always injected og-default, which
  // silently overrode the branded per-route opengraph-image files.)
  const ogImage = image ? abs(image) : null;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: { en: enUrl, es: esUrl, "x-default": enUrl },
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url,
      type,
      locale: locale === "es" ? "es_MX" : "en_US",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/**
 * Builds a schema.org BreadcrumbList object from an ordered trail of
 * `{ name, url }` items. `url` should be a site-relative path (e.g. `/blog`)
 * or absolute; relative paths are resolved against `theme.brand.url`. The last
 * crumb (current page) typically omits `url`.
 *
 * Reusable across detail pages and the Breadcrumbs UI so there is a single
 * source of truth for the breadcrumb structured data.
 */
export type BreadcrumbItem = { name: string; url?: string };

function absolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${theme.brand.url}${url}`;
}

// Locale-aware counterpart to `absolute()`: mirrors `pageMeta`'s es URL
// behavior so breadcrumb JSON-LD points at the same localized path the page
// actually renders at. Absolute URLs pass through unchanged; en behaves like
// `absolute()` always has.
function absoluteForLocale(url: string, locale: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (locale !== "es") return `${theme.brand.url}${url}`;
  const base = theme.brand.url;
  const isHome = url === "/" || url === "";
  return isHome ? `${base}/es` : `${base}/es${url}`;
}

export function breadcrumbLd(
  items: BreadcrumbItem[],
  locale: string = DEFAULT_LOCALE,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: absoluteForLocale(c.url, locale) } : {}),
    })),
  };
}
