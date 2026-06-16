// Targeted, idempotent delivery of the "Data Modernization & Migration" service.
// Upserts ONLY that service (by slug) and re-sequences the `order` of the three
// services it shifts, leaving all other service content untouched. Safe to re-run.
//
// Local:  npm run db:seed already covers this. This script is for PROD, where
// seeding is manual. Run against the prod DB, e.g.:
//   DATABASE_URL="<prod-connection-string>" npx tsx scripts/add-service.ts
import { PrismaClient } from "@prisma/client";
import { services } from "../prisma/seed/data";

const prisma = new PrismaClient();
const J = (v: unknown) => JSON.stringify(v);

async function main() {
  const now = new Date();
  const svc = services.find((s) => s.slug === "data-modernization");
  if (!svc) throw new Error("data-modernization not found in prisma/seed/data.ts");

  await prisma.service.upsert({
    where: { slug: svc.slug },
    update: { ...svc, tools: J(svc.tools), status: "PUBLISHED", publishedAt: now },
    create: { ...svc, tools: J(svc.tools), status: "PUBLISHED", publishedAt: now },
  });
  console.log(`upserted service: ${svc.slug} (order ${svc.order})`);

  // Re-sequence ONLY the order field of the services the insert shifts down.
  const reorders: Record<string, number> = {
    "data-engineering": 5,
    "embedded-analytics": 6,
    "capability-development": 7,
  };
  for (const [slug, order] of Object.entries(reorders)) {
    const res = await prisma.service.updateMany({ where: { slug }, data: { order } });
    console.log(`  ${slug} -> order ${order} (${res.count} row updated)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
