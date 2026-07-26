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
 * `tsx scripts/content-sync.ts verify`
 *   Read-only. Compares live row counts against the snapshot and exits non-zero
 *   on drift. Safe to point at production to answer "did my content land?".
 *
 * Deliberately NOT synced: User (auth secrets), Lead and JobApplication
 * (production-generated data that must survive deploys).
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const SNAPSHOT = path.join(process.cwd(), "prisma", "content-snapshot.json");

/**
 * Picks the connection for the bulk upsert/delete loop.
 *
 * A direct (non-pooled) URL is best: a tight write loop over Neon's pooler
 * (PgBouncer transaction mode) trips prepared-statement errors, which is why
 * schema ops already use `directUrl`.
 *
 * When DIRECT_DATABASE_URL is absent we used to fall back to the pooled
 * DATABASE_URL unchanged, which reliably threw on Neon and, because the import
 * is non-fatal, left production content silently stale. The fallback now adds
 * `pgbouncer=true` (Prisma stops using prepared statements) and
 * `connection_limit=1`, so the import works through a pooler too. Harmless on a
 * direct connection: it only costs the prepared-statement cache.
 */
function importDatasource(): { url?: string; how: string } {
  const direct = process.env.DIRECT_DATABASE_URL;
  if (direct) return { url: direct, how: "DIRECT_DATABASE_URL (non-pooled)" };
  const pooled = process.env.DATABASE_URL;
  if (!pooled) return { how: "default datasource" };
  try {
    const u = new URL(pooled);
    if (!u.searchParams.has("pgbouncer")) u.searchParams.set("pgbouncer", "true");
    if (!u.searchParams.has("connection_limit")) u.searchParams.set("connection_limit", "1");
    return {
      url: u.toString(),
      how: "DATABASE_URL + pgbouncer=true (DIRECT_DATABASE_URL not set)",
    };
  } catch {
    return { url: pooled, how: "DATABASE_URL as-is (unparseable)" };
  }
}

const DATASOURCE = importDatasource();
const prisma = new PrismaClient(DATASOURCE.url ? { datasourceUrl: DATASOURCE.url } : undefined);

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
  const drift = await verifyAgainstSnapshot(snap);
  if (drift.length) {
    console.warn("content-sync import: row counts still differ after import:");
    for (const d of drift) console.warn(`  ${d}`);
    throw new Error(`content-sync import incomplete: ${drift.length} table(s) do not match the snapshot`);
  }
  console.log("content-sync import: OK, database matches the snapshot.");
}

/**
 * Compares live row counts against the snapshot. Cheap, and it turns "the import
 * printed no error" into "the database actually matches", which is the thing a
 * build log could not previously tell you.
 */
async function verifyAgainstSnapshot(snap: { tables: Record<string, Row[]> }): Promise<string[]> {
  const drift: string[] = [];
  for (const t of TABLES) {
    const expected = (snap.tables[t.name] ?? []).length;
    const actual: number = await model(t.name).count();
    if (actual !== expected) drift.push(`${t.name}: snapshot ${expected}, database ${actual}`);
  }
  return drift;
}

async function main() {
  const cmd = process.argv[2];
  const force = process.argv.includes("--force");
  if (cmd === "export") {
    await exportContent();
    return;
  }
  if (cmd === "import") {
    console.log(`content-sync import: connecting via ${DATASOURCE.how}`);
    // Non-fatal by default: a content hiccup should not block a code deploy.
    // But a *persistent* failure used to look exactly like success, which let
    // production content sit stale across several deploys. The banner below is
    // greppable, and CONTENT_SYNC_STRICT=1 makes it fail the build instead.
    try {
      await importContent(force);
    } catch (e) {
      console.error("");
      console.error("=".repeat(72));
      console.error("CONTENT-SYNC IMPORT FAILED — PRODUCTION CONTENT IS STALE");
      console.error("The code in this deploy is live; database content is NOT updated.");
      console.error("Anything edited in the admin or seeded (FAQs, services, team,");
      console.error("case studies, blog) still shows its previous values.");
      console.error("");
      console.error(`Connection used: ${DATASOURCE.how}`);
      if (!process.env.DIRECT_DATABASE_URL) {
        console.error("Hint: DIRECT_DATABASE_URL is not set. Set it to Neon's direct");
        console.error("      (non-pooled) URL, the host without '-pooler'.");
      }
      console.error("");
      console.error(String(e instanceof Error ? e.stack || e.message : e));
      console.error("=".repeat(72));
      console.error("");
      if (process.env.CONTENT_SYNC_STRICT === "1") process.exit(1);
    }
    return;
  }
  if (cmd === "verify") {
    // Read-only: reports whether the current database matches the snapshot.
    // Safe to point at production.
    if (!existsSync(SNAPSHOT)) {
      console.error("content-sync verify: no snapshot to compare against.");
      process.exit(1);
    }
    const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as { tables: Record<string, Row[]> };
    console.log(`content-sync verify: via ${DATASOURCE.how}`);
    const drift = await verifyAgainstSnapshot(snap);
    if (!drift.length) {
      console.log("content-sync verify: database matches the snapshot.");
      return;
    }
    console.error("content-sync verify: DRIFT");
    for (const d of drift) console.error(`  ${d}`);
    process.exit(1);
  }
  console.error("Usage: tsx scripts/content-sync.ts <export|import|verify> [--force]");
  process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
