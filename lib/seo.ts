import type { Metadata } from "next";
import { theme } from "@/config/theme";
import { DEFAULT_LOCALE } from "@/lib/i18n-content";

const DEFAULT_OG = "/assets/og-default.jpg";

/**
 * Stable node identifiers for the site's structured data.
 *
 * Every page used to declare its own anonymous `{"@type":"Organization", name,
 * url}` stub for `publisher`, `provider` and `parentOrganization`. A consumer
 * reading those has no way to know they are the same company as the
 * `Organization` in the layout, so instead of one entity described by 124 pages
 * the graph held one entity plus a crowd of look-alike stubs.
 *
 * With a stable `@id`, the layout declares the company once and every other node
 * points at it. That is what lets an answer engine fuse the mentions into a
 * single entity it can name and cite, and it is the same mechanism `sameAs` uses
 * to tie the entity to its off-site profiles.
 */
export const ORG_ID = `${theme.brand.url}/#organization`;
export const SITE_ID = `${theme.brand.url}/#website`;

/** Reference to the company, for `publisher` / `provider` / `parentOrganization`. */
export const ORG_REF = { "@id": ORG_ID } as const;

/** Stable id for a team member's Person node, so bylines resolve to one human. */
export function personId(slug: string): string {
  return `${theme.brand.url}/about#${slug}`;
}

/**
 * Where the company delivers, as typed nodes.
 *
 * `areaServed` was previously asserted three different ways across the site: a
 * string array on the Organization, the bare string "Americas" on Service and
 * office nodes, and a translated string on /pricing. A consumer reading those
 * cannot tell whether they describe the same footprint. Countries are `Country`;
 * the two regions that are not countries are `AdministrativeArea`, which is what
 * they actually are.
 */
export const AREA_SERVED = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "Canada" },
  { "@type": "Country", name: "Mexico" },
  { "@type": "AdministrativeArea", name: "Latin America" },
  { "@type": "AdministrativeArea", name: "Caribbean" },
] as const;

/**
 * A `Service` node for a commercial page that describes an offering.
 *
 * Seven substantial pages (/migrations, /data-ai, /platform, /approach,
 * /partnership and the two legal pages) carried no page-level structured data at
 * all, so the only thing a consumer learned from them was that the site belongs
 * to Viewnear. `provider` references the one Organization by id rather than
 * restating it.
 */
export function serviceLd(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  locale?: string;
}): Record<string, unknown> {
  const { name, description, path, serviceType, locale = DEFAULT_LOCALE } = opts;
  const url = absoluteForLocale(path, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name,
    description,
    ...(serviceType ? { serviceType } : {}),
    provider: ORG_REF,
    areaServed: AREA_SERVED,
    inLanguage: locale,
  };
}

/**
 * A `WebPage` node tying a URL to the site and to its breadcrumb trail.
 *
 * Gives every page one node that can carry `inLanguage` and `dateModified`,
 * which none of the existing per-page types could: FAQPage, CollectionPage and
 * Service all describe an offering or a list rather than the document.
 */
export function webPageLd(opts: {
  path: string;
  name: string;
  description?: string;
  locale?: string;
  dateModified?: string;
  primaryTopicOf?: string;
}): Record<string, unknown> {
  const { path, name, description, locale = DEFAULT_LOCALE, dateModified, primaryTopicOf } = opts;
  const url = absoluteForLocale(path, locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    ...(description ? { description } : {}),
    isPartOf: { "@id": SITE_ID },
    inLanguage: locale,
    publisher: ORG_REF,
    ...(dateModified ? { dateModified } : {}),
    ...(primaryTopicOf ? { mainEntity: { "@id": primaryTopicOf } } : {}),
  };
}

/**
 * The root layout renders titles through the template `"%s | Viewnear"`, so a
 * page title costs 11 characters more than it looks. Google stops showing a
 * title at roughly 60 characters, which leaves this much for the page's own part.
 */
const TITLE_BUDGET = 60 - " | Viewnear".length;
/** Google stops showing a description at roughly 160 characters. */
const DESCRIPTION_BUDGET = 155;

/**
 * Trim to `max` characters on a word boundary, preferring a natural break.
 *
 * No ellipsis: a hard stop reads better in a SERP than a truncation marker, and
 * Google appends its own when it shortens further.
 */
/**
 * Words not worth ending on. Truncating mid-phrase used to leave titles like
 * "About: building data & AI practices across the", so any trailing connector is
 * dropped after the cut.
 */
const DANGLING = new RegExp(
  "(?:\\s+(?:" +
    [
      // English articles, conjunctions and prepositions
      "the", "a", "an", "and", "or", "of", "for", "to", "in", "on", "at", "by",
      "with", "from", "as", "into", "onto", "over", "under", "across",
      "through", "about", "after", "before", "between", "during", "than",
      "that", "is", "are",
      // Spanish
      "y", "e", "o", "u", "de", "del", "la", "el", "los", "las", "un", "una",
      "en", "con", "para", "por", "sobre", "que", "al", "como", "entre",
    ].join("|") +
    "))+$",
  "i",
);

function clamp(text: string, max: number): string {
  const s = text.trim();
  if (s.length <= max) return s;
  // Prefer cutting at a clause boundary that still lands inside the budget, so
  // "Long Title: subtitle that runs on" becomes "Long Title".
  for (const sep of [": ", " | ", " (", ", "]) {
    const at = s.lastIndexOf(sep, max);
    // Only worth it if a useful amount of the string survives.
    if (at > max * 0.45) return trimDangling(s.slice(0, at));
  }
  const space = s.lastIndexOf(" ", max);
  return trimDangling(s.slice(0, space > max * 0.5 ? space : max));
}

function trimDangling(s: string): string {
  return s.trim().replace(DANGLING, "").replace(/[,;:]$/, "").trim();
}

/**
 * Safety net for metadata length.
 *
 * A production crawl on 2026-07-25 found 66 of 124 titles over 60 characters and
 * 72 over 160 for the description, the worst being 514 characters, because blog
 * and case-study pages passed the full article title and the full excerpt
 * straight through. Hand-written `seoTitle` / `seoDescription` (per record, both
 * locales) are the real fix; this keeps any future record from regressing past
 * what a SERP will display.
 *
 * Exported for the unit tests.
 */
export function clampTitle(title: string): string {
  return clamp(title, TITLE_BUDGET);
}
export function clampDescription(description: string): string {
  return clamp(description, DESCRIPTION_BUDGET);
}

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
  // Set true for routes that ship their own opengraph-image.tsx file (Next's
  // file-based convention). Leaves the images key unset entirely so that file
  // wins instead of being overridden by the site-wide default below.
  ownOgFile?: boolean;
}): Metadata {
  const {
    title: rawTitle,
    description: rawDescription,
    path,
    image,
    type = "website",
    noindex,
    locale = DEFAULT_LOCALE,
    ownOgFile,
  } = opts;
  // Every caller goes through here, so the length guarantee holds site-wide.
  const title = rawTitle ? clampTitle(rawTitle) : rawTitle;
  const description = rawDescription ? clampDescription(rawDescription) : rawDescription;
  const base = theme.brand.url;
  const isHome = path === "/" || path === "";
  const enUrl = isHome ? base : `${base}${path}`;
  const esUrl = isHome ? `${base}/es` : `${base}/es${path}`;
  const url = locale === "es" ? esUrl : enUrl;
  const abs = (src: string) => (/^https?:\/\//i.test(src) ? src : `${theme.brand.url}${src}`);
  // Pin an OG image when the caller passes one. Otherwise, if the route ships
  // its own opengraph-image.tsx file, omit the images key so that file wins;
  // every other route falls back to the site-wide default image.
  const ogImage = image ? abs(image) : ownOgFile ? null : abs(DEFAULT_OG);
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: { en: enUrl, es: esUrl, "x-default": enUrl },
    },
    // Snippet permissions, stated rather than left to each engine's default.
    //
    // These are the same controls that govern how much of a page may be lifted
    // into an AI Overview, AI Mode, or a Copilot answer: `max-snippet` caps the
    // text an engine may quote, and with nothing declared the engine picks its
    // own ceiling. `-1` removes the cap, which is the point when the goal is to
    // have a long self-contained passage quoted verbatim with attribution.
    // `max-image-preview: large` makes the case-study and industry photography
    // eligible for a large preview alongside a citation.
    //
    // This grants permission, it does not request ranking. Dormant routes keep
    // their noindex, so the branch stays conditional.
    ...(noindex
      ? { robots: { index: false, follow: false } }
      : {
          robots: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        }),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url,
      type,
      locale: locale === "es" ? "es_MX" : "en_US",
      siteName: theme.brand.name,
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

// Resolves a breadcrumb URL for the given locale, mirroring `pageMeta`'s es
// URL behavior so breadcrumb JSON-LD points at the same localized path the
// page actually renders at. Absolute URLs pass through unchanged; en resolves
// relative paths against the site root.
function absoluteForLocale(url: string, locale: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (locale !== "es") return `${theme.brand.url}${url}`;
  const base = theme.brand.url;
  const isHome = url === "/" || url === "";
  return isHome ? `${base}/es` : `${base}/es${url}`;
}

/**
 * `CollectionPage` for a listing page (blog index, case-study index, press,
 * resources), with a `BreadcrumbList` and, when entries are passed, an
 * `ItemList` naming them in display order.
 *
 * Listing pages previously emitted no page-level structured data at all: only
 * the site-wide `Organization` and `WebSite` from the root layout. This gives
 * each index an explicit type and a crawlable trail back to the home page.
 *
 * `items` should carry site-relative paths; they are resolved for `locale` the
 * same way breadcrumbs are.
 */
export function collectionLd(opts: {
  name: string;
  description?: string;
  path: string;
  locale?: string;
  crumbs: BreadcrumbItem[];
  items?: { name: string; url: string }[];
}): Record<string, unknown>[] {
  const { name, description, path, locale = DEFAULT_LOCALE, crumbs, items } = opts;
  const collection: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    ...(description ? { description } : {}),
    url: absoluteForLocale(path, locale),
    ...(items && items.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.map((it, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: it.name,
              url: absoluteForLocale(it.url, locale),
            })),
          },
        }
      : {}),
  };
  return [collection, breadcrumbLd(crumbs, locale)];
}

/**
 * `FAQPage` for a page's visible Q&A.
 *
 * The markup must describe what the page actually shows, so pass only the rows
 * rendered on it. Deliberately NOT applied to pages that repeat the site-wide
 * FAQ verbatim (/services and the home page both show the same rows as /faq):
 * marking the identical set up on several URLs is what Google's FAQ guidance
 * tells you not to do, and it wins nothing, because the underlying
 * `<details>/<summary>` markup is already extractable.
 *
 * Worth knowing: Google withdrew FAQ rich results for most sites in 2023, so
 * this earns no SERP feature. It stays because answer engines parse it when
 * deciding which passage answers a question.
 */
export function faqLd(
  rows: { q: string; a: string }[],
  opts: { url: string; locale?: string; name?: string },
): Record<string, unknown> {
  const { url, locale = DEFAULT_LOCALE, name } = opts;
  const abs = absoluteForLocale(url, locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs}#faq`,
    url: abs,
    ...(name ? { name } : {}),
    inLanguage: locale,
    mainEntity: rows.map((r) => ({
      "@type": "Question",
      name: r.q,
      acceptedAnswer: { "@type": "Answer", text: r.a },
    })),
  };
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
