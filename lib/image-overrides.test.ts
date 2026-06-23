import { describe, it, expect } from "vitest";
import { applyOverride, isOverrideActive, parseOverrideInput } from "./image-overrides";

const ov = (p: Partial<Parameters<typeof applyOverride>[1] & object> = {}) => ({
  key: "/a.jpg",
  mediaUrl: null,
  focalX: 50,
  focalY: 50,
  zoom: 1,
  alt: null,
  ...p,
});

describe("isOverrideActive", () => {
  it("is false for null and for a neutral (centered, unzoomed, no replacement) override", () => {
    expect(isOverrideActive(null)).toBe(false);
    expect(isOverrideActive(ov())).toBe(false);
  });
  it("is true when focal is off-center, zoomed, or src replaced", () => {
    expect(isOverrideActive(ov({ focalX: 30 }))).toBe(true);
    expect(isOverrideActive(ov({ focalY: 70 }))).toBe(true);
    expect(isOverrideActive(ov({ zoom: 1.5 }))).toBe(true);
    expect(isOverrideActive(ov({ mediaUrl: "/uploads/b.jpg" }))).toBe(true);
  });
});

describe("applyOverride", () => {
  it("returns the base src untouched when no override", () => {
    expect(applyOverride("/a.jpg", null)).toEqual({ src: "/a.jpg", style: undefined, alt: undefined });
  });

  it("stays byte-identical (no style) for a neutral override", () => {
    expect(applyOverride("/a.jpg", ov())).toEqual({ src: "/a.jpg", style: undefined, alt: undefined });
  });

  it("forces object-fit: cover and sets object-position when focal is off-center", () => {
    const r = applyOverride("/a.jpg", ov({ focalX: 30, focalY: 70 }));
    expect(r.style?.objectFit).toBe("cover");
    expect(r.style?.objectPosition).toBe("30% 70%");
    // no zoom -> no transform
    expect(r.style?.transform).toBeUndefined();
    expect(r.style?.transformOrigin).toBeUndefined();
  });

  it("applies cover + scale + transform-origin at the focal point when zoomed in", () => {
    const r = applyOverride("/a.jpg", ov({ zoom: 1.5 }));
    expect(r.style?.objectFit).toBe("cover");
    expect(r.style?.objectPosition).toBe("50% 50%");
    expect(r.style?.transform).toBe("scale(1.5)");
    expect(r.style?.transformOrigin).toBe("50% 50%");
  });

  it("anchors the zoom at an off-center focal point (pan + zoom together)", () => {
    const r = applyOverride("/a.jpg", ov({ focalX: 20, focalY: 80, zoom: 2 }));
    expect(r.style?.objectFit).toBe("cover");
    expect(r.style?.objectPosition).toBe("20% 80%");
    expect(r.style?.transform).toBe("scale(2)");
    expect(r.style?.transformOrigin).toBe("20% 80%");
  });

  it("swaps src when mediaUrl is set, and is active even when centered/unzoomed", () => {
    const r = applyOverride("/a.jpg", ov({ mediaUrl: "/uploads/b.jpg" }));
    expect(r.src).toBe("/uploads/b.jpg");
    // a replacement alone forces cover framing too
    expect(r.style?.objectFit).toBe("cover");
    expect(r.style?.objectPosition).toBe("50% 50%");
  });

  it("passes alt through when the override is active", () => {
    const r = applyOverride("/a.jpg", ov({ focalX: 40, alt: "Hi" }));
    expect(r.alt).toBe("Hi");
  });

  it("passes alt through with NO style on an otherwise-neutral override (visual render byte-identical)", () => {
    const r = applyOverride("/a.jpg", ov({ alt: "Hi" }));
    expect(r).toEqual({ src: "/a.jpg", style: undefined, alt: "Hi" });
  });
});

describe("parseOverrideInput", () => {
  it("rejects non-objects and missing key", () => {
    expect(parseOverrideInput(null)).toBeNull();
    expect(parseOverrideInput({})).toBeNull();
    expect(parseOverrideInput({ key: "" })).toBeNull();
  });
  it("accepts a key and clamps numeric fields", () => {
    const r = parseOverrideInput({ key: "/a.jpg", focalX: 200, focalY: -5, zoom: 9 });
    expect(r?.key).toBe("/a.jpg");
    expect(r?.data.focalX).toBe(100);
    expect(r?.data.focalY).toBe(0);
    expect(r?.data.zoom).toBe(3);
  });
  it("keeps mediaUrl null and trims alt", () => {
    const r = parseOverrideInput({ key: "/a.jpg", mediaUrl: null, alt: "  hi  " });
    expect(r?.data.mediaUrl).toBeNull();
    expect(r?.data.alt).toBe("hi");
  });
});
