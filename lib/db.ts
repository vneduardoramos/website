import { PrismaClient } from "@prisma/client";

// Prisma client singleton: avoids exhausting connections in dev hot-reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Bound each client's connection pool.
 *
 * Prisma's default pool is `num_cpus * 2 + 1` per client. `next build` runs page
 * generation across several worker processes, and because NODE_ENV is
 * "production" during a build the singleton below used to be skipped, so every
 * worker opened its own full-size pool. Prerendering 163 pages against a
 * Postgres with the default `max_connections = 100` then died with
 * "FATAL: sorry, too many clients already" (Prisma P2037), which fails the
 * build partway through export.
 *
 * A small explicit limit keeps every worker inside the server's budget. Applied
 * only when the URL does not already specify one, so a deployment that tunes
 * this (or routes through a pooler) keeps its own setting.
 */
function datasourceUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (!u.searchParams.has("connection_limit")) {
      u.searchParams.set("connection_limit", "5");
    }
    return u.toString();
  } catch {
    // Malformed URL: hand it to Prisma unchanged and let it report the problem.
    return raw;
  }
}

const url = datasourceUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url ? { datasources: { db: { url } } } : {}),
  });

// Reused in every environment, including production: a build worker or server
// process that re-imports this module gets the same client instead of opening a
// second pool.
globalForPrisma.prisma = prisma;
