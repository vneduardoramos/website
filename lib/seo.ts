import type { Metadata } from "next";
import { theme } from "@/config/theme";

const DEFAULT_OG = "/assets/og-default.jpg";

/**
 * Build per-page metadata with a canonical URL, Open Graph, and Twitter card.
 * Pass a bare `title` (no " | Viewnear" suffix; the root layout title template
 * adds it). `image` is the page's content image (site-relative or absolute);
 * it falls back to the sitewide default OG image. Set `noindex` for dormant or
 * utility pages that should not be indexed.
 */
export function pageMeta(opts: {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const { title, description, path, image, type = "website", noindex } = opts;
  const url = `${theme.brand.url}${path}`;
  const abs = (src: string) => (/^https?:\/\//i.test(src) ? src : `${theme.brand.url}${src}`);
  const ogImage = abs(image || DEFAULT_OG);
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url,
      type,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [ogImage],
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

export function breadcrumbLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: absolute(c.url) } : {}),
    })),
  };
}
