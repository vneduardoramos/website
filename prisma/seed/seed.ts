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

const prisma = new PrismaClient();
const now = new Date();
const J = (v: unknown) => JSON.stringify(v);

/** Load long-form body markdown from prisma/seed/content/<type>/<slug>.md (falls back to inline body). */
function readBody(type: string, slug: string): string | null {
  try {
    return readFileSync(join(process.cwd(), "prisma/seed/content", type, `${slug}.md`), "utf8").trim();
  } catch {
    return null;
  }
}

async function main() {
  console.log("Seeding Viewnear content...");

  // --- Admin user ---
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@viewnear.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", name: process.env.SEED_ADMIN_NAME || "Viewnear Admin" },
    create: { email, passwordHash, role: "ADMIN", name: process.env.SEED_ADMIN_NAME || "Viewnear Admin" },
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

  // --- Services ---
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, tools: J(s.tools), status: "PUBLISHED", publishedAt: now },
      create: { ...s, tools: J(s.tools), status: "PUBLISHED", publishedAt: now },
    });
  }

  // --- Industries ---
  for (const i of industries) {
    const data = {
      slug: i.slug,
      name: i.name,
      headline: i.headline,
      intro: i.intro,
      challenges: J(i.challenges),
      deliverables: J(i.deliverables),
      tools: J(i.tools),
      stats: J(i.stats),
      order: i.order,
      status: "PUBLISHED",
      publishedAt: now,
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
      publishedAt: now,
    };
    await prisma.caseStudy.upsert({ where: { slug: cs.slug }, update: data, create: data });
  }

  // --- Team --- (remove any stale members not in the current list)
  await prisma.teamMember.deleteMany({ where: { slug: { notIn: team.map((t) => t.slug) } } });
  for (const t of team) {
    await prisma.teamMember.upsert({
      where: { slug: t.slug },
      update: { ...t, published: true },
      create: { ...t, published: true },
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
      publishedAt: now,
    };
    await prisma.newsEvent.upsert({ where: { slug: n.slug }, update: data, create: data });
  }

  // --- Blog posts (authored by admin) ---
  for (const b of blogPosts) {
    const blogAuthorTeam = (b as { authorTeam?: string }).authorTeam
      ? await prisma.teamMember.findUnique({ where: { slug: (b as { authorTeam?: string }).authorTeam as string } })
      : null;
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
      publishedAt: (b as { date?: string }).date ? new Date((b as { date?: string }).date as string) : now,
    };
    await prisma.blogPost.upsert({ where: { slug: b.slug }, update: data, create: data });
  }

  // --- Job openings ---
  for (const j of jobOpenings) {
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
