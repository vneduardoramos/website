import { describe, it, expect } from "vitest";
import { slugify, parseJson, asObjectArray, formatDate } from "@/lib/utils";

describe("slugify", () => {
  it("kebab-cases and strips punctuation", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });
  it("expands ampersands", () => {
    expect(slugify("Tom & Jerry")).toBe("tom-and-jerry");
  });
  it("collapses whitespace and trims dashes", () => {
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });
});

describe("parseJson", () => {
  it("parses valid JSON", () => {
    expect(parseJson<number[]>("[1,2,3]", [])).toEqual([1, 2, 3]);
  });
  it("returns the fallback on invalid JSON", () => {
    expect(parseJson("not json", "fallback")).toBe("fallback");
  });
  it("returns the fallback for null", () => {
    expect(parseJson(null, [])).toEqual([]);
  });
});

describe("asObjectArray", () => {
  it("coerces a JSON string into an object array", () => {
    expect(asObjectArray('[{"a":1}]')).toEqual([{ a: 1 }]);
  });
  it("returns [] for non-array input", () => {
    expect(asObjectArray("nope")).toEqual([]);
  });
});

describe("formatDate timezone", () => {
  it("renders the calendar date, not the host's local shift", () => {
    // Authored as a calendar date, stored midnight UTC. Anywhere west of
    // Greenwich, local formatting would render the previous day.
    expect(formatDate("2025-06-29", "en")).toBe("June 29, 2025");
    expect(formatDate(new Date("2025-06-29T00:00:00.000Z"), "en")).toBe("June 29, 2025");
  });

  it("agrees with the ISO value a <time dateTime> would carry", () => {
    const iso = "2026-06-06";
    const d = new Date(iso);
    expect(d.toISOString().slice(0, 10)).toBe(iso);
    expect(formatDate(iso, "en")).toBe("June 6, 2026");
  });

  it("formats Spanish without shifting the day", () => {
    expect(formatDate("2026-01-13", "es")).toContain("13");
    expect(formatDate("2026-01-13", "es")).toContain("2026");
  });
});
