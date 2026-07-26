import { describe, it, expect } from "vitest";
import { clampTitle, clampDescription } from "./seo";

/**
 * These guard the SERP-length safety net. A 2026-07-25 production crawl found 66
 * of 124 titles over 60 characters and 72 descriptions over 160 (worst: 514),
 * because detail pages passed full article titles and excerpts straight through.
 */
describe("clampTitle", () => {
  it("leaves a title that already fits untouched", () => {
    const t = "Snowflake migrations: Teradata, Oracle, Hadoop";
    expect(clampTitle(t)).toBe(t);
  });

  it("keeps the page budget at 49 so the ' | Viewnear' suffix still fits in 60", () => {
    const long = "x".repeat(200);
    expect(clampTitle(long).length).toBeLessThanOrEqual(49);
    expect(`${clampTitle(long)} | Viewnear`.length).toBeLessThanOrEqual(60);
  });

  it("cuts at a clause boundary rather than mid-phrase", () => {
    expect(
      clampTitle("Just Back from Snowflake Summit 2025: What Stood Out, What Got Us Thinking"),
    ).toBe("Just Back from Snowflake Summit 2025");
  });

  it("does not end on a dangling connector", () => {
    // The naive word-boundary cut produced "... practices across the".
    const out = clampTitle("About building data and AI practices across the Americas and beyond");
    expect(out).not.toMatch(/\s(the|and|of|across|a|an)$/i);
    expect(out.length).toBeLessThanOrEqual(49);
  });

  it("does not end on a dangling Spanish connector", () => {
    const out = clampTitle("Seguridad y confianza: datos gobernados en Snowflake y en cada capa");
    expect(out).not.toMatch(/\s(y|en|de|la|el|una|para)$/i);
  });

  it("never leaves trailing punctuation from the cut", () => {
    expect(clampTitle("A".repeat(45) + ", trailing clause here")).not.toMatch(/[,;:]$/);
  });
});

describe("clampDescription", () => {
  it("leaves a description under 160 untouched", () => {
    const d = "Academic records and LMS learning events unified into live insight.";
    expect(clampDescription(d)).toBe(d);
  });

  it("clamps a 514-character description to the display budget", () => {
    const out = clampDescription("word ".repeat(120));
    expect(out.length).toBeLessThanOrEqual(155);
  });

  it("cuts on a word boundary, never mid-word", () => {
    const out = clampDescription(
      "A corrugated packaging manufacturer's product catalog exploded into thousands of SKUs and variants with no product architecture, distorting costs and slowing production badly",
    );
    expect(out.length).toBeLessThanOrEqual(155);
    // every character kept must come from the original, ending on a whole word
    expect(out.split(" ").pop()).toMatch(/^[\w'’%.,-]+$/);
  });

  it("adds no ellipsis (Google appends its own)", () => {
    expect(clampDescription("word ".repeat(120))).not.toMatch(/\.\.\.|…$/);
  });
});
