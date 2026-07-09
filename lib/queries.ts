import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import {
  localize,
  localizeMany,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/i18n-content";

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
export async function getServices(locale: Locale = DEFAULT_LOCALE) {
  const rows = await prisma.service.findMany({
    where: PUBLISHED,
    orderBy: [{ tier: "asc" }, { order: "asc" }],
  });
  return localizeMany("service", rows, locale);
}

export async function getServicesByTier(locale: Locale = DEFAULT_LOCALE) {
  const services = await getServices(locale);
  const tiers = ["THINK", "BUILD", "GROW"] as const;
  return tiers.map((tier) => ({
    tier,
    services: services.filter((s) => s.tier === tier),
  }));
}

// ---------- Industries ----------
export async function getIndustries(locale: Locale = DEFAULT_LOCALE) {
  const rows = await prisma.industry.findMany({
    where: PUBLISHED,
    orderBy: { order: "asc" },
  });
  return localizeMany("industry", rows, locale);
}

export async function getIndustrySlugs() {
  const rows = await prisma.industry.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getIndustryBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const row = await prisma.industry.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      caseStudies: {
        where: PUBLISHED,
        orderBy: { order: "asc" },
        include: { client: true },
      },
    },
  });
  return row ? localize("industry", row, locale) : row;
}

// ---------- Case studies ----------
export async function getCaseStudies(
  opts?: { featured?: boolean; take?: number },
  locale: Locale = DEFAULT_LOCALE,
) {
  const rows = await prisma.caseStudy.findMany({
    where: { ...PUBLISHED, ...(opts?.featured ? { featured: true } : {}) },
    orderBy: { order: "asc" },
    take: opts?.take,
    include: { client: true, industry: true },
  });
  return localizeMany("caseStudy", rows, locale);
}

export async function getCaseStudySlugs() {
  const rows = await prisma.caseStudy.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getCaseStudyBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const row = await prisma.caseStudy.findFirst({
    where: { slug, ...PUBLISHED },
    include: { client: true, industry: true },
  });
  return row ? localize("caseStudy", row, locale) : row;
}

// ---------- Blog ----------
export async function getBlogPosts(
  opts?: { take?: number },
  locale: Locale = DEFAULT_LOCALE,
) {
  const rows = await prisma.blogPost.findMany({
    where: PUBLISHED,
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
    include: {
      author: true,
      tags: true,
      authorTeam: { include: { headshot: true } },
    },
  });
  return localizeMany("blogPost", rows, locale);
}

export async function getBlogSlugs() {
  const rows = await prisma.blogPost.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getBlogPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const row = await prisma.blogPost.findFirst({
    where: { slug, ...PUBLISHED },
    include: {
      author: true,
      tags: true,
      authorTeam: { include: { headshot: true } },
    },
  });
  return row ? localize("blogPost", row, locale) : row;
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

// ---------- Team / clients ----------
export async function getTeam(locale: Locale = DEFAULT_LOCALE) {
  const rows = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return localizeMany("teamMember", rows, locale);
}

export async function getClients() {
  return prisma.client.findMany({ orderBy: { name: "asc" } });
}

// ---------- Jobs ----------
export async function getJobOpenings(locale: Locale = DEFAULT_LOCALE) {
  const rows = await prisma.jobOpening.findMany({
    where: PUBLISHED,
    orderBy: { order: "asc" },
  });
  return localizeMany("jobOpening", rows, locale);
}

export async function getJobSlugs() {
  const rows = await prisma.jobOpening.findMany({
    where: PUBLISHED,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getJobOpeningBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const row = await prisma.jobOpening.findFirst({ where: { slug, ...PUBLISHED } });
  return row ? localize("jobOpening", row, locale) : row;
}

// ---------- Site settings ----------
export async function getSetting<T = unknown>(
  key: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<T | null> {
  // Spanish settings live under a sibling `${key}.es` row; fall back to the
  // base row when it is absent or resolves to null.
  if (locale === "es") {
    const esRow = await prisma.siteSetting.findUnique({
      where: { key: `${key}.es` },
    });
    if (esRow) {
      const esValue = parseJson<T | null>(esRow.value, null);
      if (esValue != null) return esValue;
    }
  }
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return null;
  return parseJson<T | null>(row.value, null);
}
