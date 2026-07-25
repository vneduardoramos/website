import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = theme.brand.url;

  const staticPaths = [
    "",
    "/about",
    "/partnership",
    "/nearshore",
    "/nearshore/monterrey",
    "/security",
    "/life-at-viewnear",
    "/careers",
    "/services",
    "/snowflake-consulting-services",
    "/migrations",
    "/data-ai",
    "/approach",
    "/pricing",
    "/platform",
    "/industries",
    "/case-studies",
    "/blog",
    "/resources",
    "/press",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  // Dynamic content carries its real updatedAt so crawlers get an honest
  // per-URL freshness signal (instead of every URL sharing the build time).
  const sel = { where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } } as const;
  const [services, industries, caseStudies, blog, jobs] = await Promise.all([
    prisma.service.findMany(sel),
    prisma.industry.findMany(sel),
    prisma.caseStudy.findMany(sel),
    prisma.blogPost.findMany(sel),
    prisma.jobOpening.findMany(sel),
  ]);

  const dynamic = [
    ...services.map((r) => ({ path: `/services/${r.slug}`, lastModified: r.updatedAt })),
    ...industries.map((r) => ({ path: `/industries/${r.slug}`, lastModified: r.updatedAt })),
    ...caseStudies.map((r) => ({ path: `/case-studies/${r.slug}`, lastModified: r.updatedAt })),
    ...blog.map((r) => ({ path: `/blog/${r.slug}`, lastModified: r.updatedAt })),
    ...jobs.map((r) => ({ path: `/careers/${r.slug}`, lastModified: r.updatedAt })),
  ];

  // Every path emits two URLs (en + es), each carrying reciprocal hreflang
  // alternates. Home ("") maps to `${base}` / `${base}/es` (no trailing slash).
  // x-default points at the en URL, matching the on-page canonical alternates.
  const langs = (p: string) => ({
    en: p ? `${base}${p}` : base,
    es: `${base}/es${p}`,
    "x-default": p ? `${base}${p}` : base,
  });
  // Static paths carry no lastModified (there is no real per-page freshness
  // signal for them); dynamic entries carry their record's honest updatedAt.
  function entry(p: string, lastModified?: Date): MetadataRoute.Sitemap {
    return [
      { url: p ? `${base}${p}` : base, alternates: { languages: langs(p) }, ...(lastModified ? { lastModified } : {}) },
      { url: `${base}/es${p}`, alternates: { languages: langs(p) }, ...(lastModified ? { lastModified } : {}) },
    ];
  }

  return [
    ...staticPaths.flatMap((path) => entry(path)),
    ...dynamic.flatMap((e) => entry(e.path, e.lastModified)),
  ];
}
