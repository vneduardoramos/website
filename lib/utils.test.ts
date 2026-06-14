import { describe, it, expect } from "vitest";
import { slugify, parseJson, asObjectArray } from "@/lib/utils";

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
