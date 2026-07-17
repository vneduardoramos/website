/**
 * Local-is-truth content publishing.
 *
 * `tsx scripts/content-sync.ts export`
 *   Snapshots every content table from the CURRENT DATABASE_URL (your local
 *   dev DB) into prisma/content-snapshot.json, which is committed. Media
 *   files themselves live on R2 and are shared across environments; only
 *   their rows travel here.
 *
 * `tsx scripts/content-sync.ts import [--force]`
 *   Mirrors the snapshot into the CURRENT DATABASE_URL: upserts every row,
 *   restores blog-post tag links, then deletes rows that no longer exist in
 *   the snapshot. Runs as part of the Render build (RENDER env var is set
 *   there automatically); anywhere else it is a NO-OP unless --force is
 *   passed, so a local `npm run build` can never clobber your working DB.
 *
 * Deliberately NOT synced: User (auth secrets), Lead and JobApplication
 * (production-generated data that must survive deploys).
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const SNAPSHOT = path.join(process.cwd(), "prisma", "content-snapshot.json");
// Prefer the direct (non-pooler) connection for the bulk upsert/delete loop.
// Runtime queries use the pooled DATABASE_URL, but a tight write loop over
// Neon's pooler (PgBouncer transaction mode) trips prepared-statement errors,
// which is why schema ops already use directUrl. Fall back to the default
// datasource when no direct URL is set (e.g. local dev without it).
const prisma = new PrismaClient(
  process.env.DIRECT_DATABASE_URL
    ? { datasourceUrl: process.env.DIRECT_DATABASE_URL }
    : undefined,
);

// Parent-first order; deletions run in reverse. `strip` drops relation arrays
// and columns we intentionally do not carry (BlogPost.authorId points at the
// unsynced User table; the visible byline is authorTeamId).
const TABLES = [
  { name: "tag", strip: [] as string[] },
  { name: "client", strip: [] },
  { name: "industry", strip: [] },
  { name: "media", strip: [] },
  { name: "teamMember", strip: [] },
  { name: "service", strip: [] },
  { name: "siteSetting", strip: [] },
  { name: "newsEvent", strip: [] },
  { name: "jobOpening", strip: [] },
  { name: "caseStudy", strip: [] },
  { name: "blogPost", strip: ["tags", "authorId"] },
  { name: "imageOverride", strip: [] },
] as const;

type Row = Record<string, unknown>;
const model = (name: string) => (prisma as any)[name];

async function exportContent() {
  const tables: Record<string, Row[]> = {};
  for (const t of TABLES) {
    const rows: Row[] =
      t.name === "blogPost"
        ? await model(t.name).findMany({ include: { tags: { select: { id: true } } } })
        : await model(t.name).findMany();
    tables[t.name] = rows;
    console.log(`export ${t.name}: ${rows.length}`);
  }
  // Blog-post tag links, kept separately so rows stay plain scalars.
  const blogPostTags: Record<string, string[]> = {};
  for (const p of tables.blogPost) {
    blogPostTags[p.id as string] = ((p.tags as { id: string }[]) ?? []).map((t) => t.id);
  }
  const snapshot = { exportedAt: new Date().toISOString(), tables, blogPostTags };
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 1));
  console.log(`\nWrote ${SNAPSHOT}`);
}

async function importContent(force: boolean) {
  if (!process.env.RENDER && !force) {
    console.log("content-sync import: not on Render and no --force, skipping (local DB untouched).");
    return;
  }
  if (!existsSync(SNAPSHOT)) {
    console.log("content-sync import: no prisma/content-snapshot.json yet, skipping.");
    return;
  }
  const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as {
    exportedAt: string;
    tables: Record<string, Row[]>;
    blogPostTags: Record<string, string[]>;
  };
  console.log(`Importing content snapshot from ${snap.exportedAt}`);

  // Upserts, parent-first.
  for (const t of TABLES) {
    const rows = snap.tables[t.name] ?? [];
    for (const raw of rows) {
      const row: Row = { ...raw };
      for (const s of t.strip) delete row[s];
      const { id, ...data } = row;
      await model(t.name).upsert({ where: { id }, update: data, create: { id, ...data } });
    }
    console.log(`upsert ${t.name}: ${rows.length}`);
  }

  // Blog-post tag links mirror the snapshot exactly.
  for (const [postId, tagIds] of Object.entries(snap.blogPostTags)) {
    await model("blogPost").update({
      where: { id: postId },
      data: { tags: { set: tagIds.map((id) => ({ id })) } },
    });
  }

  // Mirror-deletes, children-first. A row that cannot be deleted because
  // production data references it (e.g. a JobOpening with applications) is
  // logged and kept rather than failing the deploy.
  for (const t of [...TABLES].reverse()) {
    const keep = (snap.tables[t.name] ?? []).map((r) => r.id as string);
    const stale: { id: string }[] = await model(t.name).findMany({
      where: { id: { notIn: keep } },
      select: { id: true },
    });
    for (const s of stale) {
      try {
        await model(t.name).delete({ where: { id: s.id } });
      } catch {
        console.warn(`keep ${t.name} ${s.id}: still referenced, not deleted`);
      }
    }
    if (stale.length > 0) console.log(`prune ${t.name}: ${stale.length}`);
  }
  console.log("Content import complete.");
}

async function main() {
  const cmd = process.argv[2];
  const force = process.argv.includes("--force");
  if (cmd === "export") {
    await exportContent();
    return;
  }
  if (cmd === "import") {
    // Non-fatal: a content-sync hiccup must never block the production build.
    // The code deploy has to ship regardless; on failure prod keeps its
    // last-good content and this logs loudly for follow-up.
    try {
      await importContent(force);
    } catch (e) {
      console.error("content-sync import failed (non-fatal, build continues):", e);
    }
    return;
  }
  console.error("Usage: tsx scripts/content-sync.ts <export|import> [--force]");
  process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
