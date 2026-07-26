/**
 * Local-is-truth content publishing.
 *
 * The loop, for editing content locally and publishing it:
 *
 *   1. edit at http://localhost:3000/admin
 *   2. npm run ship          # export + stage the snapshot
 *   3. git commit && git push
 *
 * Render's build imports the snapshot, so whatever the snapshot says is what
 * production shows. Nothing else needs doing.
 *
 * `tsx scripts/content-sync.ts export [--force]`
 *   Snapshots every content table from the CURRENT DATABASE_URL (your local
 *   dev DB) into prisma/content-snapshot.json, which is committed. Media
 *   files themselves live on R2 and are shared across environments; only
 *   their rows travel here. Refuses to write a snapshot that would delete
 *   rows the committed one has, unless --force: see lostKeysVsSnapshot.
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
  // The seed owns hero/stats/partnership/contact/faqs (+ .es), so mirroring
  // deletions here is right. `clientBands` is the exception: the client-logos
  // admin page writes it, the seed never does, and a deploy pruning it is what
  // silently dropped the home-page logo bands once before (the UI fell back to
  // DEFAULT_BANDS, so nothing looked broken).
  { name: "siteSetting", key: "key", strip: [], remap: {}, keepKeys: ["clientBands"] },
  { name: "jobOpening", key: "slug", strip: [], remap: {} },
  { name: "caseStudy", key: "slug", strip: [], remap: { clientId: "client", industryId: "industry" } },
  { name: "blogPost", key: "slug", strip: ["tags", "authorId"], remap: { authorTeamId: "teamMember" } },
  // Authored in the production admin, not in the seed. The local export is
  // normally empty, so mirroring deletions here would wipe whatever an editor
  // set on production. Upserts still apply when the snapshot does carry rows.
  { name: "imageOverride", key: "key", strip: [], remap: {}, neverPrune: true },
] as const;

type Row = Record<string, unknown>;
const model = (name: string) => (prisma as any)[name];

/**
 * Fields never compared when deciding whether a row changed. `updatedAt` is
 * Prisma-managed (`@updatedAt`), `createdAt` is environment-local, and `id` is
 * stripped from the payload before it gets here.
 */
const TIMESTAMPS = new Set(["id", "createdAt", "updatedAt"]);

/** Normalize for comparison: the snapshot holds ISO strings where the DB returns Date. */
function comparable(v: unknown): unknown {
  if (v instanceof Date) return v.toISOString();
  if (v === undefined) return null;
  return v;
}

/**
 * True when the live row already matches the snapshot payload.
 *
 * Why this matters: the import used to upsert every row on every deploy, and
 * because `updatedAt` is `@updatedAt` Prisma bumped it even when nothing about
 * the row had changed. `app/sitemap.ts` feeds `updatedAt` to `lastmod`, so all
 * 76 dynamic URLs ended up sharing one timestamp (the deploy time), which is
 * exactly the "every URL shares the build time" outcome the sitemap was written
 * to avoid. Crawlers discount a `lastmod` they learn is meaningless.
 *
 * Skipping unchanged rows keeps `updatedAt` honest: it moves only when the
 * content actually moved.
 */
function unchanged(existing: Row | null, incoming: Row): boolean {
  if (!existing) return false;
  for (const [k, v] of Object.entries(incoming)) {
    if (TIMESTAMPS.has(k)) continue;
    if (JSON.stringify(comparable(v)) !== JSON.stringify(comparable(existing[k]))) return false;
  }
  return true;
}

/**
 * Which keys would this export drop, per table, versus the committed snapshot?
 *
 * The import side already refuses to empty a table on a thin snapshot. The
 * export side had no such guard, and that asymmetry cost real work: a local
 * `db:reset` wipes admin-authored rows that no seed recreates (image overrides,
 * `clientBands`), and the next export then wrote that loss over the committed
 * snapshot. The deploy faithfully published the deletion. Nothing errored, and
 * the pages fell back to their placeholders, so it looked like nothing had
 * happened.
 *
 * A shrinking table is not always wrong (deleting a blog post is a real edit),
 * so this reports rather than decides. `--force` proceeds.
 */
function lostKeysVsSnapshot(tables: Record<string, Row[]>): Record<string, string[]> {
  if (!existsSync(SNAPSHOT)) return {};
  let prev: { tables?: Record<string, Row[]> };
  try {
    prev = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  } catch {
    return {};
  }
  const lost: Record<string, string[]> = {};
  for (const t of TABLES) {
    const before = prev.tables?.[t.name] ?? [];
    const after = tables[t.name] ?? [];
    const keyOf = (r: Row) => String(r[t.key] ?? "");
    const have = new Set(after.map(keyOf));
    const gone = before.map(keyOf).filter((k) => k && !have.has(k));
    if (gone.length) lost[t.name] = gone;
  }
  return lost;
}

async function exportContent(force: boolean) {
  const tables: Record<string, Row[]> = {};
  for (const t of TABLES) {
    const rows: Row[] =
      t.name === "blogPost"
        ? await model(t.name).findMany({ include: { tags: { select: { id: true } } } })
        : await model(t.name).findMany();
    tables[t.name] = rows;
    console.log(`export ${t.name}: ${rows.length}`);
  }

  const lost = lostKeysVsSnapshot(tables);
  if (Object.keys(lost).length > 0 && !force) {
    console.error("");
    console.error("=".repeat(72));
    console.error("EXPORT REFUSED: this snapshot would DELETE content in production.");
    console.error("");
    console.error("These rows are in the committed snapshot but not in your local");
    console.error("database, so exporting would publish their deletion:");
    console.error("");
    for (const [table, keys] of Object.entries(lost)) {
      console.error(`  ${table} (${keys.length}):`);
      for (const k of keys) console.error(`    - ${k}`);
    }
    console.error("");
    console.error("If you just ran db:reset, your local DB lost admin-authored rows");
    console.error("that no seed file recreates. Restore them before exporting:");
    console.error("");
    console.error("  npm run db:reset      # now re-applies the snapshot for you");
    console.error("");
    console.error("If these deletions ARE what you want, re-run with --force:");
    console.error("");
    console.error("  npx tsx scripts/content-sync.ts export --force");
    console.error("=".repeat(72));
    console.error("");
    process.exit(1);
  }
  if (Object.keys(lost).length > 0) {
    console.warn(`\nexport --force: publishing the deletion of ${Object.values(lost).flat().length} row(s).`);
  }

  // Blog-post tag links, kept separately so rows stay plain scalars.
  const blogPostTags: Record<string, string[]> = {};
  for (const p of tables.blogPost) {
    blogPostTags[p.id as string] = ((p.tags as { id: string }[]) ?? []).map((t) => t.id);
  }
  const snapshot = { exportedAt: new Date().toISOString(), tables, blogPostTags };
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 1));
  console.log(`\nWrote ${SNAPSHOT}`);
  console.log("Commit it to publish: git add prisma/content-snapshot.json");
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

  // Rows left untouched because they already match the snapshot, per table.
  const skipped: Record<string, number> = {};

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
      // Read first so an unchanged row can be left alone, keeping its updatedAt
      // (and therefore the sitemap's lastmod) truthful. See unchanged().
      const existing: Row | null = await model(t.name).findUnique({
        where: { [t.key]: keyValue },
      });
      if (unchanged(existing, row)) {
        idMap[t.name].set(keyValue, existing!.id as string);
        skipped[t.name] = (skipped[t.name] ?? 0) + 1;
        continue;
      }
      const saved: { id: string } = await model(t.name).upsert({
        where: { [t.key]: keyValue },
        update: row,
        create: row,
        select: { id: true },
      });
      idMap[t.name].set(keyValue, saved.id);
    }
    const skip = skipped[t.name] ?? 0;
    console.log(
      `upsert ${t.name}: ${rows.length - skip} written, ${skip} unchanged (by ${t.key})`,
    );
  }

  // Blog-post tag links mirror the snapshot, translated through slugs. Written
  // only when the link set actually differs: `update` bumps `updatedAt` even
  // when `set` is a no-op, which on its own was enough to give every blog post
  // the deploy timestamp in the sitemap.
  let tagWrites = 0;
  for (const [snapPostId, snapTagIds] of Object.entries(snap.blogPostTags)) {
    const postSlug = snapKeyById.blogPost.get(snapPostId);
    const postId = postSlug ? idMap.blogPost.get(postSlug) : undefined;
    if (!postId) continue;
    const tagIds = snapTagIds
      .map((tid) => snapKeyById.tag.get(tid))
      .map((slug) => (slug ? idMap.tag.get(slug) : undefined))
      .filter((x): x is string => Boolean(x));
    const current: { tags: { id: string }[] } | null = await model("blogPost").findUnique({
      where: { id: postId },
      select: { tags: { select: { id: true } } },
    });
    const have = (current?.tags ?? []).map((x) => x.id).sort();
    const want = [...tagIds].sort();
    if (JSON.stringify(have) === JSON.stringify(want)) continue;
    await model("blogPost").update({
      where: { id: postId },
      data: { tags: { set: tagIds.map((id) => ({ id })) } },
    });
    tagWrites += 1;
  }
  console.log(`blogPost tag links: ${tagWrites} updated, ${Object.keys(snap.blogPostTags).length - tagWrites} unchanged`);

  if (!prune) {
    console.log("content-sync import: --no-prune, skipping mirror-deletes (additive only).");
    console.log("content-sync import: upserts applied.");
    return;
  }

  // Mirror-deletes, children-first. A row that cannot be deleted because
  // production data references it (e.g. a JobOpening with applications) is
  // logged and kept rather than failing the deploy.
  for (const t of [...TABLES].reverse()) {
    const keep = [
      ...(snap.tables[t.name] ?? []).map((r) => r[t.key] as string),
      // Keys owned by the production admin rather than the seed.
      ...(((t as { keepKeys?: readonly string[] }).keepKeys ?? []) as readonly string[]),
    ];
    if ((t as { neverPrune?: boolean }).neverPrune) {
      console.log(`prune ${t.name}: skipped (admin-authored on production)`);
      continue;
    }
    // A table the snapshot knows nothing about is a missing export, not an
    // instruction to empty the table. Deleting every row on that signal is how
    // production lost content once already.
    if (keep.length === 0) {
      const count: number = await model(t.name).count();
      if (count > 0) {
        console.warn(
          `prune ${t.name}: SKIPPED. Snapshot has 0 rows but the database has ${count}. ` +
            `Refusing to delete them all; re-export if the table really is empty.`,
        );
      }
      continue;
    }
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
    await exportContent(force);
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
