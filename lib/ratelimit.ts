/**
 * Minimal in-memory fixed-window rate limiter, keyed by an arbitrary string
 * (typically `route:ip`). No external deps.
 *
 * NOTE: state lives in the process, so it is per-instance. That's fine for a
 * single Node server; on serverless/multi-instance (e.g. Vercel, or more than
 * one Render instance) it's best-effort only, since each instance keeps its
 * own buckets. For durable, distributed limiting swap in Upstash Ratelimit.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Above this many tracked keys, opportunistically sweep expired buckets. A
// spoofed X-Forwarded-For lets an attacker mint effectively unlimited unique
// keys that are written once and never read again, so lazy delete-on-read
// (which only cleans a bucket when that same key comes back) would never
// reclaim them. This keeps memory bounded without a background timer.
const EVICTION_THRESHOLD = 10_000;

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  if (buckets.size > EVICTION_THRESHOLD) {
    for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
  }

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= opts.limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client IP from proxy headers. Render sits in front of the app
 * as a single trusted reverse proxy that appends the real client IP as the
 * rightmost hop of X-Forwarded-For; everything to its left (including the
 * leftmost entry) is client-supplied and trivially spoofable, so it must not
 * be trusted for rate limiting. X-Real-IP is equally client-settable and is
 * only used as a last resort when XFF is absent.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",");
    return parts[parts.length - 1]!.trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Read-only check: true if `key` is still under `limit` (not yet blocked),
 * WITHOUT consuming a slot. Lets a caller enforce a budget up front while
 * leaving the actual increment to a later, conditional rateLimit() call, e.g.
 * count only failed logins so successful logins never exhaust the budget.
 */
export function peek(key: string, opts: { limit: number }): boolean {
  const b = buckets.get(key);
  if (!b || Date.now() > b.resetAt) return true;
  return b.count < opts.limit;
}

/** Exposed only so unit tests can assert the eviction sweep actually runs. */
export function __bucketCount(): number {
  return buckets.size;
}

/** 429 response with a Retry-After header. */
export function tooMany(retryAfter: number) {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
  });
}
