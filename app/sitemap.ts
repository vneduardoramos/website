import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";
import {
  getIndustrySlugs,
  getCaseStudySlugs,
  getBlogSlugs,
  getJobSlugs,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = theme.brand.url;
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

  const [industries, caseStudies, blog, jobs] = await Promise.all([
    getIndustrySlugs(),
    getCaseStudySlugs(),
    getBlogSlugs(),
    getJobSlugs(),
  ]);

  const dynamicPaths = [
    ...industries.map((s) => `/industries/${s}`),
    ...caseStudies.map((s) => `/case-studies/${s}`),
    ...blog.map((s) => `/blog/${s}`),
    ...jobs.map((s) => `/careers/${s}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
