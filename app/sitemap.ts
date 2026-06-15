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
    "/security",
    "/life-at-viewnear",
    "/services",
    "/solutions",
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

  const dynamic: MetadataRoute.Sitemap = [
    ...industries.map((r) => ({ path: `/industries/${r.slug}`, lastModified: r.updatedAt })),
    ...caseStudies.map((r) => ({ path: `/case-studies/${r.slug}`, lastModified: r.updatedAt })),
    ...blog.map((r) => ({ path: `/blog/${r.slug}`, lastModified: r.updatedAt })),
    ...jobs.map((r) => ({ path: `/careers/${r.slug}`, lastModified: r.updatedAt })),
  ].map((e) => ({ url: `${base}${e.path}`, lastModified: e.lastModified }));

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, lastModified: now })),
    ...dynamic,
  ];
}
