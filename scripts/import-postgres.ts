// One-time data load into Postgres from prisma/data-export.json.
//
// Run AFTER switching the Prisma datasource to Postgres and applying the
// initial migration (so the tables exist), with the client regenerated:
//   npx tsx scripts/import-postgres.ts
//
// Inserts in FK-safe order and reconnects the BlogPost <-> Tag m2m relation.
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

type BlogPostRow = Record<string, unknown> & { tags: { id: string }[] };

async function main() {
  const file = join(process.cwd(), "prisma", "data-export.json");
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<string, any[]>;

  // Independent + parent tables first.
  await prisma.user.createMany({ data: data.user });
  await prisma.media.createMany({ data: data.media });
  await prisma.client.createMany({ data: data.client });
  await prisma.tag.createMany({ data: data.tag });

  // Depend on the tables above.
  await prisma.teamMember.createMany({ data: data.teamMember });
  await prisma.industry.createMany({ data: data.industry });
  await prisma.service.createMany({ data: data.service });

  // Depend on Client / Industry.
  await prisma.caseStudy.createMany({ data: data.caseStudy });

  // BlogPost: m2m with Tag, so create one-by-one and connect tags.
  for (const row of data.blogPost as BlogPostRow[]) {
    const { tags, ...scalars } = row;
    await prisma.blogPost.create({
      data: {
        ...scalars,
        tags: tags?.length
          ? { connect: tags.map((t) => ({ id: t.id })) }
          : undefined,
      } as any,
    });
  }

  await prisma.newsEvent.createMany({ data: data.newsEvent });
  await prisma.lead.createMany({ data: data.lead });
  await prisma.jobOpening.createMany({ data: data.jobOpening });
  await prisma.jobApplication.createMany({ data: data.jobApplication });
  await prisma.siteSetting.createMany({ data: data.siteSetting });

  // Verify parity against the export.
  const counts: Record<string, [number, number]> = {};
  const check = async (key: string, n: number) => {
    counts[key] = [data[key].length, n];
  };
  await check("user", await prisma.user.count());
  await check("media", await prisma.media.count());
  await check("client", await prisma.client.count());
  await check("tag", await prisma.tag.count());
  await check("teamMember", await prisma.teamMember.count());
  await check("industry", await prisma.industry.count());
  await check("service", await prisma.service.count());
  await check("caseStudy", await prisma.caseStudy.count());
  await check("blogPost", await prisma.blogPost.count());
  await check("newsEvent", await prisma.newsEvent.count());
  await check("lead", await prisma.lead.count());
  await check("jobOpening", await prisma.jobOpening.count());
  await check("jobApplication", await prisma.jobApplication.count());
  await check("siteSetting", await prisma.siteSetting.count());

  console.log("Row counts [export -> postgres]:");
  let ok = true;
  for (const [k, [a, b]] of Object.entries(counts)) {
    const match = a === b ? "ok" : "MISMATCH";
    if (a !== b) ok = false;
    console.log(`  ${k}: ${a} -> ${b} (${match})`);
  }
  if (!ok) {
    console.error("Row count mismatch detected.");
    process.exit(1);
  }
  console.log("All row counts match.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
