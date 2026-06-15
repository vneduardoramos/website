// One-time data dump from the current (SQLite) database.
//
// Run this BEFORE switching the Prisma datasource to Postgres, while the
// generated client still points at SQLite:
//   npx tsx scripts/export-sqlite.ts
//
// Produces prisma/data-export.json, consumed by scripts/import-postgres.ts.
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

async function main() {
  const data = {
    user: await prisma.user.findMany(),
    media: await prisma.media.findMany(),
    client: await prisma.client.findMany(),
    tag: await prisma.tag.findMany(),
    teamMember: await prisma.teamMember.findMany(),
    industry: await prisma.industry.findMany(),
    service: await prisma.service.findMany(),
    caseStudy: await prisma.caseStudy.findMany(),
    blogPost: await prisma.blogPost.findMany({
      include: { tags: { select: { id: true } } },
    }),
    newsEvent: await prisma.newsEvent.findMany(),
    lead: await prisma.lead.findMany(),
    jobOpening: await prisma.jobOpening.findMany(),
    jobApplication: await prisma.jobApplication.findMany(),
    siteSetting: await prisma.siteSetting.findMany(),
  };

  const out = join(process.cwd(), "prisma", "data-export.json");
  writeFileSync(out, JSON.stringify(data, null, 2));

  const counts = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, (v as unknown[]).length]),
  );
  console.log("Exported rows:", counts);
  console.log("Wrote", out);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
