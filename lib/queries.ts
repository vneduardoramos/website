import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

const PUBLISHED = { status: "PUBLISHED" as const };

/**
 * Run a query and fall back to a default if it throws (e.g. the DB is
 * unreachable), so a transient failure degrades a page to empty sections
 * instead of a 500. Logs the error for visibility.
 */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.error("[query] falling back after error:", err);
    return fallback;
  }
}

// ---------- Services ----------
export async function getServices() {
  return prisma.service.findMany({
    where: PUBLISHED,
    orderBy: [{ tier: "asc" }, { order: "asc" }],
  });
}

export async function getServicesByTier() {
  const services = await getServices();
  const tiers = ["THINK", "BUILD", "GROW"] as const;
  return tiers.map((tier) => ({
    tier,
    services: services.filter((s) => s.tier === tier),
  }));
}

// ---------- Industries ----------
export async function getIndustries() {
  return prisma.industry.findMany({
    where: PUBLISHED,
    orderBy: { order: "asc" },
  });
}

export async function getIndustrySlugs() {
  const rows = await prisma.industry.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getIndustryBySlug(slug: string) {
  return prisma.industry.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      caseStudies: {
        where: PUBLISHED,
        orderBy: { order: "asc" },
        include: { client: true },
      },
    },
  });
}

// ---------- Case studies ----------
export async function getCaseStudies(opts?: { featured?: boolean; take?: number }) {
  return prisma.caseStudy.findMany({
    where: { ...PUBLISHED, ...(opts?.featured ? { featured: true } : {}) },
    orderBy: { order: "asc" },
    take: opts?.take,
    include: { client: true, industry: true },
  });
}

export async function getCaseStudySlugs() {
  const rows = await prisma.caseStudy.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getCaseStudyBySlug(slug: string) {
  return prisma.caseStudy.findFirst({
    where: { slug, ...PUBLISHED },
    include: { client: true, industry: true },
  });
}

// ---------- Blog ----------
export async function getBlogPosts(opts?: { take?: number }) {
  return prisma.blogPost.findMany({
    where: PUBLISHED,
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
    include: {
      author: true,
      tags: true,
      authorTeam: { include: { headshot: true } },
    },
  });
}

export async function getBlogSlugs() {
  const rows = await prisma.blogPost.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      author: true,
      tags: true,
      authorTeam: { include: { headshot: true } },
    },
  });
}

// ---------- News & events ----------
export async function getNews(opts?: { take?: number }) {
  return prisma.newsEvent.findMany({
    where: PUBLISHED,
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
  });
}

export async function getNewsSlugs() {
  const rows = await prisma.newsEvent.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getNewsBySlug(slug: string) {
  return prisma.newsEvent.findFirst({ where: { slug, ...PUBLISHED } });
}

// ---------- Team / testimonials / clients ----------
export async function getTeam() {
  return prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getTestimonials(opts?: { featured?: boolean }) {
  return prisma.testimonial.findMany({
    where: { published: true, ...(opts?.featured ? { featured: true } : {}) },
    orderBy: { order: "asc" },
    include: { client: true },
  });
}

export async function getClients() {
  return prisma.client.findMany({ orderBy: { name: "asc" } });
}

// ---------- Jobs ----------
export async function getJobOpenings() {
  return prisma.jobOpening.findMany({
    where: PUBLISHED,
    orderBy: { order: "asc" },
  });
}

export async function getJobSlugs() {
  const rows = await prisma.jobOpening.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getJobOpeningBySlug(slug: string) {
  return prisma.jobOpening.findFirst({ where: { slug, ...PUBLISHED } });
}

// ---------- Site settings ----------
export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return null;
  return parseJson<T | null>(row.value, null);
}
