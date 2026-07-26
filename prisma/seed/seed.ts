import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import {
  siteSettings,
  services,
  industries,
  clients,
  caseStudies,
  team,
  news,
  blogPosts,
  jobOpenings,
  faqs,
} from "./data";
import { servicesEs } from "./es/services";
import { industriesEs } from "./es/industries";
import { caseStudiesEs } from "./es/caseStudies";
import { blogPostsEs } from "./es/blog";
import { teamEs } from "./es/team";
import { jobOpeningsEs } from "./es/jobs";
import { siteSettingsEs, faqsEs } from "./es/settings";

const prisma = new PrismaClient();
const now = new Date();
/**
 * Publication date for content that has no editorial date of its own (services,
 * industries, case studies, job openings). Fixed rather than `now` on purpose:
 * `publishedAt` feeds `Article.datePublished` and the sitemap's freshness
 * signal, and seeding with the current time made every case study claim it was
 * published at the moment of the last deploy. This is the date the content went
 * live on the site, and it stays put across re-seeds and re-imports.
 *
 * Blog posts do not use this: they carry a real `date` in their seed data.
 */
const SITE_CONTENT_PUBLISHED_AT = new Date("2026-07-17T00:00:00.000Z");
const J = (v: unknown) => JSON.stringify(v);
/** A blog post's own editorial date, falling back to the site content date. */
const blogDate = (b: { date?: string }) =>
  b.date ? new Date(b.date) : SITE_CONTENT_PUBLISHED_AT;

/** Load long-form body markdown from prisma/seed/content/<type>/<slug>.md (falls back to inline body). */
function readBody(type: string, slug: string, locale: "en" | "es" = "en"): string | null {
  const file = locale === "es" ? `${slug}.es.md` : `${slug}.md`;
  try {
    return readFileSync(join(process.cwd(), "prisma/seed/content", type, file), "utf8").trim();
  } catch {
    return null;
  }
}

async function main() {
  console.log("Seeding Viewnear content...");

  // --- Admin user ---
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@viewnear.com").toLowerCase();
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || "Viewnear Admin";
  if ((process.env.NODE_ENV === "production" || process.env.RENDER) && !seedPassword) {
    throw new Error("SEED_ADMIN_PASSWORD must be set when seeding production");
  }
  // Dev-only fallback so a fresh local DB is still usable out of the box.
  // Only reached when not seeding production (guarded above).
  const password = seedPassword || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    // No passwordHash here unless SEED_ADMIN_PASSWORD was explicitly set, so
    // re-running the seed locally (var unset) never downgrades a password
    // that was since changed through the admin UI.
    update: { role: "ADMIN", name, ...(seedPassword ? { passwordHash } : {}) },
    create: { email, passwordHash, role: "ADMIN", name },
  });
  console.log(`  admin: ${admin.email}`);

  // --- Site settings ---
  for (const [key, value] of Object.entries(siteSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: J(value) },
      create: { key, value: J(value) },
    });
  }
  await prisma.siteSetting.upsert({
    where: { key: "faqs" },
    update: { value: J(faqs) },
    create: { key: "faqs", value: J(faqs) },
  });

  // --- Site settings (es overlay) --- stored under "<key>.es"; empty overlay = no rows.
  for (const [key, value] of Object.entries(siteSettingsEs)) {
    await prisma.siteSetting.upsert({
      where: { key: `${key}.es` },
      update: { value: J(value) },
      create: { key: `${key}.es`, value: J(value) },
    });
  }
  if (faqsEs.length) {
    await prisma.siteSetting.upsert({
      where: { key: "faqs.es" },
      update: { value: J(faqsEs) },
      create: { key: "faqs.es", value: J(faqsEs) },
    });
  }

  // --- Services ---
  for (const s of services) {
    const data = {
      ...s,
      tools: J(s.tools),
      status: "PUBLISHED",
      publishedAt: SITE_CONTENT_PUBLISHED_AT,
      updatedAt: SITE_CONTENT_PUBLISHED_AT,
      titleEs: servicesEs[s.slug]?.title ?? null,
      summaryEs: servicesEs[s.slug]?.summary ?? null,
      bodyEs: servicesEs[s.slug]?.body ?? null,
      seoTitleEs: servicesEs[s.slug]?.seoTitle ?? null,
      seoDescriptionEs: servicesEs[s.slug]?.seoDescription ?? null,
    };
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: data,
      create: data,
    });
  }

  // --- Industries ---
  for (const i of industries) {
    const iEs = industriesEs[i.slug] ?? {};
    const data = {
      slug: i.slug,
      name: i.name,
      headline: i.headline,
      intro: i.intro,
      challenges: J(i.challenges),
      deliverables: J(i.deliverables),
      tools: J(i.tools),
      stats: J(i.stats),
      faq: i.faq ? J(i.faq) : null,
      order: i.order,
      status: "PUBLISHED",
      publishedAt: SITE_CONTENT_PUBLISHED_AT,
      updatedAt: SITE_CONTENT_PUBLISHED_AT,
      // SERP-length metadata, distinct from the on-page name/headline.
      seoTitle: i.seoTitle ?? null,
      seoDescription: i.seoDescription ?? null,
      nameEs: iEs.name ?? null,
      headlineEs: iEs.headline ?? null,
      introEs: iEs.intro ?? null,
      bodyEs: iEs.body ?? null,
      challengesEs: iEs.challenges ? J(iEs.challenges) : null,
      deliverablesEs: iEs.deliverables ? J(iEs.deliverables) : null,
      statsEs: iEs.stats ? J(iEs.stats) : null,
      faqEs: iEs.faq ? J(iEs.faq) : null,
      seoTitleEs: iEs.seoTitle ?? null,
      seoDescriptionEs: iEs.seoDescription ?? null,
    };
    await prisma.industry.upsert({ where: { slug: i.slug }, update: data, create: data });
  }

  // --- Clients ---
  for (const c of clients) {
    await prisma.client.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  // --- Case studies (link to client + industry) ---
  for (const cs of caseStudies) {
    const client = await prisma.client.findUnique({ where: { slug: cs.clientSlug } });
    const industry = cs.industrySlug
      ? await prisma.industry.findUnique({ where: { slug: cs.industrySlug } })
      : null;
    const csEs = caseStudiesEs[cs.slug] ?? {};
    const data = {
      slug: cs.slug,
      title: cs.title,
      summary: cs.summary,
      sector: cs.sector,
      region: cs.region,
      heroImage: cs.heroImage ?? null,
      featured: cs.featured,
      order: cs.order,
      body: readBody("case-studies", cs.slug) ?? cs.body ?? null,
      metrics: cs.metrics ? J(cs.metrics) : null,
      quote: cs.quote ? J(cs.quote) : null,
      clientId: client?.id ?? null,
      industryId: industry?.id ?? null,
      status: "PUBLISHED",
      // The record's own date when it has one, else the shared launch date.
      publishedAt: cs.date ? new Date(cs.date) : SITE_CONTENT_PUBLISHED_AT,
      updatedAt: cs.date ? new Date(cs.date) : SITE_CONTENT_PUBLISHED_AT,
      seoTitle: cs.seoTitle ?? null,
      seoDescription: cs.seoDescription ?? null,
      titleEs: csEs.title ?? null,
      summaryEs: csEs.summary ?? null,
      sectorEs: csEs.sector ?? null,
      bodyEs: readBody("case-studies", cs.slug, "es"),
      challengeEs: csEs.challenge ?? null,
      solutionEs: csEs.solution ?? null,
      resultsEs: csEs.results ?? null,
      metricsEs: csEs.metrics ? J(csEs.metrics) : null,
      quoteEs: csEs.quote ? J(csEs.quote) : null,
      seoTitleEs: csEs.seoTitle ?? null,
      seoDescriptionEs: csEs.seoDescription ?? null,
    };
    await prisma.caseStudy.upsert({ where: { slug: cs.slug }, update: data, create: data });
  }

  // --- Team --- (remove any stale members not in the current list)
  await prisma.teamMember.deleteMany({ where: { slug: { notIn: team.map((t) => t.slug) } } });
  for (const t of team) {
    const data = {
      ...t,
      published: true,
      titleEs: teamEs[t.slug]?.title ?? null,
      bioEs: teamEs[t.slug]?.bio ?? null,
      bookingTopicsEs: teamEs[t.slug]?.bookingTopics ?? null,
    };
    await prisma.teamMember.upsert({
      where: { slug: t.slug },
      update: data,
      create: data,
    });
  }

  // --- News & events ---
  for (const n of news) {
    const data = {
      slug: n.slug,
      kind: n.kind,
      title: n.title,
      excerpt: n.excerpt,
      body: n.body,
      venue: (n as { venue?: string }).venue ?? null,
      agenda: (n as { agenda?: unknown }).agenda ? J((n as { agenda?: unknown }).agenda) : null,
      status: "PUBLISHED",
      publishedAt: SITE_CONTENT_PUBLISHED_AT,
      updatedAt: SITE_CONTENT_PUBLISHED_AT,
    };
    await prisma.newsEvent.upsert({ where: { slug: n.slug }, update: data, create: data });
  }

  // --- Blog posts (authored by admin) ---
  for (const b of blogPosts) {
    const blogAuthorTeam = (b as { authorTeam?: string }).authorTeam
      ? await prisma.teamMember.findUnique({ where: { slug: (b as { authorTeam?: string }).authorTeam as string } })
      : null;
    const bEs = blogPostsEs[b.slug] ?? {};
    const data = {
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      coverImageUrl: (b as { coverImage?: string }).coverImage ?? null,
      body: readBody("blog", b.slug) ?? (b as { body?: string }).body ?? "",
      keyTakeaways: (b as { keyTakeaways?: unknown }).keyTakeaways
        ? J((b as { keyTakeaways?: unknown }).keyTakeaways)
        : null,
      authorId: admin.id,
      authorTeamId: blogAuthorTeam?.id ?? null,
      status: "PUBLISHED",
      publishedAt: blogDate(b),
      updatedAt: blogDate(b),
      seoTitle: (b as { seoTitle?: string }).seoTitle ?? null,
      seoDescription: (b as { seoDescription?: string }).seoDescription ?? null,
      titleEs: bEs.title ?? null,
      excerptEs: bEs.excerpt ?? null,
      bodyEs: readBody("blog", b.slug, "es"),
      keyTakeawaysEs: bEs.keyTakeaways ? J(bEs.keyTakeaways) : null,
      seoTitleEs: bEs.seoTitle ?? null,
      seoDescriptionEs: bEs.seoDescription ?? null,
    };
    await prisma.blogPost.upsert({ where: { slug: b.slug }, update: data, create: data });
  }

  // --- Job openings ---
  for (const j of jobOpenings) {
    const jEs = jobOpeningsEs[j.slug] ?? {};
    const data = {
      slug: j.slug,
      title: j.title,
      employment: j.employment,
      location: j.location,
      description: j.description,
      body: readBody("careers", j.slug) ?? j.body ?? null,
      skills: J(j.skills),
      order: j.order,
      status: "PUBLISHED",
      // Feeds JobPosting.datePosted and the sitemap's lastmod for /careers/<slug>.
      // Stable, so a reseed does not re-date an existing opening.
      publishedAt: SITE_CONTENT_PUBLISHED_AT,
      updatedAt: SITE_CONTENT_PUBLISHED_AT,
      titleEs: jEs.title ?? null,
      descriptionEs: jEs.description ?? null,
      employmentEs: jEs.employment ?? null,
      bodyEs: readBody("careers", j.slug, "es") ?? jEs.body ?? null,
    };
    await prisma.jobOpening.upsert({ where: { slug: j.slug }, update: data, create: data });
  }
  // Prune openings no longer in the seed list so removed roles disappear on
  // reseed (job openings are seed-managed). Applications keep their record;
  // their optional openingId is set null by the FK.
  const pruned = await prisma.jobOpening.deleteMany({
    where: { slug: { notIn: jobOpenings.map((j) => j.slug) } },
  });
  if (pruned.count > 0) console.log(`Pruned ${pruned.count} stale job opening(s).`);

  const counts = {
    services: await prisma.service.count(),
    industries: await prisma.industry.count(),
    caseStudies: await prisma.caseStudy.count(),
    news: await prisma.newsEvent.count(),
    blog: await prisma.blogPost.count(),
    team: await prisma.teamMember.count(),
    jobs: await prisma.jobOpening.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
