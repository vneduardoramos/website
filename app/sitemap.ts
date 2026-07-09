import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = theme.brand.url;
  const now = new Date();

  const staticPaths = [
    "",
    "/about",
    "/partnership",
    "/nearshore",
    "/security",
    "/life-at-viewnear",
    "/services",
    "/migrations",
    "/data-ai",
    "/approach",
    "/pricing",
    "/platform",
    "/industries",
    "/case-studies",
    "/blog",
    "/resources",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  // Dynamic content carries its real updatedAt so crawlers get an honest
  // per-URL freshness signal (instead of every URL sharing the build time).
  const sel = { where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } } as const;
  const [industries, caseStudies, blog, jobs] = await Promise.all([
    prisma.industry.findMany(sel),
    prisma.caseStudy.findMany(sel),
    prisma.blogPost.findMany(sel),
    prisma.jobOpening.findMany(sel),
  ]);

  const dynamic = [
    ...industries.map((r) => ({ path: `/industries/${r.slug}`, lastModified: r.updatedAt })),
    ...caseStudies.map((r) => ({ path: `/case-studies/${r.slug}`, lastModified: r.updatedAt })),
    ...blog.map((r) => ({ path: `/blog/${r.slug}`, lastModified: r.updatedAt })),
    ...jobs.map((r) => ({ path: `/careers/${r.slug}`, lastModified: r.updatedAt })),
  ];

  // Every path emits two URLs (en + es), each carrying reciprocal hreflang
  // alternates. Home ("") maps to `${base}` / `${base}/es` (no trailing slash).
  const langs = (p: string) => ({ en: p ? `${base}${p}` : base, es: `${base}/es${p}` });
  function entry(p: string, lastModified: Date): MetadataRoute.Sitemap {
    return [
      { url: p ? `${base}${p}` : base, lastModified, alternates: { languages: langs(p) } },
      { url: `${base}/es${p}`, lastModified, alternates: { languages: langs(p) } },
    ];
  }

  return [
    ...staticPaths.flatMap((path) => entry(path, now)),
    ...dynamic.flatMap((e) => entry(e.path, e.lastModified)),
  ];
}
