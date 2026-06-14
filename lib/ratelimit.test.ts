import { describe, it, expect } from "vitest";
import { rateLimit, clientIp } from "@/lib/ratelimit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks", () => {
    const key = `test-${Math.floor(performance.now())}-${process.hrtime()[1]}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, { limit: 3, windowMs: 10_000 }).ok).toBe(true);
    }
    const blocked = rateLimit(key, { limit: 3, windowMs: 10_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("uses independent buckets per key", () => {
    const a = rateLimit("bucket-a", { limit: 1, windowMs: 10_000 });
    const b = rateLimit("bucket-b", { limit: 1, windowMs: 10_000 });
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("reads the first x-forwarded-for entry", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });
  it("falls back to 'unknown'", () => {
    expect(clientIp(new Request("http://x"))).toBe("unknown");
  });
});
