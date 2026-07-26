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
 * `--no-prune` skips the mirror-deletes, so the import only adds and updates.
 * Use it when the target environment holds rows the snapshot legitimately lacks.
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

/**
 * Parent-first order; deletions run in reverse.
 *
 * `key` is the NATURAL key used to match rows across environments. Matching on
 * `id` does not work: local and production were seeded independently, so the same
 * content carries different cuids. An upsert by id then tries to CREATE a row
 * whose `slug` already exists, hits the unique constraint, throws, and (because
 * the import is non-fatal) leaves production content silently stale. Every table
 * here has a natural key, so that whole class of failure goes away.
 *
 * `strip` drops columns we deliberately do not carry across environments:
 *   - relation arrays (handled separately, e.g. BlogPost.tags)
 *   - BlogPost.authorId -> User, which is not synced (the visible byline is
 *     authorTeamId)
 *   - TeamMember.headshotId -> Media, which is not synced (see below)
 *
 * `remap` translates an id-based foreign key from snapshot ids to the target
 * environment's ids, resolved through the parent's natural key.
 *
 * Media is deliberately NOT synced: it is the one table with no natural key, and
 * its rows are environment-specific (R2 storage keys, per-environment uploads).
 * Production holds 65 media rows that a local export would otherwise delete.
 */
const TABLES = [
  { name: "tag", key: "slug", strip: [] as string[], remap: {} as Record<string, string> },
  { name: "client", key: "slug", strip: [], remap: {} },
  { name: "industry", key: "slug", strip: [], remap: {} },
  { name: "teamMember", key: "slug", strip: ["headshotId"], remap: {} },
  { name: "service", key: "slug", strip: [], remap: {} },
  { name: "siteSetting", key: "key", strip: [], remap: {} },
  { name: "newsEvent", key: "slug", strip: [], remap: {} },
  { name: "jobOpening", key: "slug", strip: [], remap: {} },
  { name: "caseStudy", key: "slug", strip: [], remap: { clientId: "client", industryId: "industry" } },
  { name: "blogPost", key: "slug", strip: ["tags", "authorId"], remap: { authorTeamId: "teamMember" } },
  { name: "imageOverride", key: "key", strip: [], remap: {} },
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

async function importContent(force: boolean, prune: boolean) {
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

  // snapshotId -> this environment's id, per table, built as we go so children
  // can translate their foreign keys. Ids are treated as environment-local;
  // natural keys are the cross-environment contract.
  const idMap: Record<string, Map<string, string>> = {};
  // snapshot id -> natural key, so a child can resolve a parent it references.
  const snapKeyById: Record<string, Map<string, string>> = {};
  for (const t of TABLES) {
    snapKeyById[t.name] = new Map(
      (snap.tables[t.name] ?? []).map((r) => [r.id as string, r[t.key] as string]),
    );
  }

  // Upserts, parent-first, matched on the natural key.
  for (const t of TABLES) {
    const rows = snap.tables[t.name] ?? [];
    idMap[t.name] = new Map();
    for (const raw of rows) {
      const row: Row = { ...raw };
      for (const f of t.strip) delete row[f];
      const snapshotId = row.id as string;
      delete row.id; // ids stay environment-local
      // Point id-based FKs at this environment's rows.
      for (const [field, parent] of Object.entries(t.remap as Record<string, string>)) {
        const ref = row[field] as string | null | undefined;
        if (!ref) continue;
        const naturalKey = snapKeyById[parent]?.get(ref);
        const localId = naturalKey ? idMap[parent]?.get(naturalKey) : undefined;
        if (!localId) {
          console.warn(`  ${t.name}.${field}: could not resolve ${ref}, leaving null`);
          row[field] = null;
        } else {
          row[field] = localId;
        }
      }
      const keyValue = row[t.key] as string;
      const saved: { id: string } = await model(t.name).upsert({
        where: { [t.key]: keyValue },
        update: row,
        create: row,
        select: { id: true },
      });
      idMap[t.name].set(keyValue, saved.id);
    }
    console.log(`upsert ${t.name}: ${rows.length} (by ${t.key})`);
  }

  // Blog-post tag links mirror the snapshot, translated through slugs.
  for (const [snapPostId, snapTagIds] of Object.entries(snap.blogPostTags)) {
    const postSlug = snapKeyById.blogPost.get(snapPostId);
    const postId = postSlug ? idMap.blogPost.get(postSlug) : undefined;
    if (!postId) continue;
    const tagIds = snapTagIds
      .map((tid) => snapKeyById.tag.get(tid))
      .map((slug) => (slug ? idMap.tag.get(slug) : undefined))
      .filter((x): x is string => Boolean(x));
    await model("blogPost").update({
      where: { id: postId },
      data: { tags: { set: tagIds.map((id) => ({ id })) } },
    });
  }

  if (!prune) {
    console.log("content-sync import: --no-prune, skipping mirror-deletes (additive only).");
    console.log("content-sync import: upserts applied.");
    return;
  }

  // Mirror-deletes, children-first. A row that cannot be deleted because
  // production data references it (e.g. a JobOpening with applications) is
  // logged and kept rather than failing the deploy.
  for (const t of [...TABLES].reverse()) {
    const keep = (snap.tables[t.name] ?? []).map((r) => r[t.key] as string);
    const stale: Row[] = await model(t.name).findMany({
      where: { [t.key]: { notIn: keep } },
      select: { id: true, [t.key]: true },
    });
    if (stale.length > 0) {
      console.log(`prune ${t.name}: deleting ${stale.length} row(s) absent from the snapshot:`);
      for (const row of stale) console.log(`    - ${row[t.key]}`);
    }
    for (const row of stale) {
      try {
        await model(t.name).delete({ where: { id: row.id as string } });
      } catch {
        console.warn(`keep ${t.name} ${row[t.key]}: still referenced, not deleted`);
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
  const prune = !process.argv.includes("--no-prune");
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
      await importContent(force, prune);
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
  console.error("Usage: tsx scripts/content-sync.ts <export|import|verify> [--force] [--no-prune]");
  process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
