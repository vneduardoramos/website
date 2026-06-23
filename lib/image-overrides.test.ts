import { describe, it, expect } from "vitest";
import { applyOverride, parseOverrideInput } from "./image-overrides";

describe("applyOverride", () => {
  it("returns the base src untouched when no override", () => {
    expect(applyOverride("/a.jpg", null)).toEqual({ src: "/a.jpg", style: undefined, alt: undefined });
  });
  it("swaps src when mediaUrl is set", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: "/uploads/b.jpg", focalX: 50, focalY: 50, zoom: 1, alt: null });
    expect(r.src).toBe("/uploads/b.jpg");
  });
  it("applies object-position only when focal differs from center", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 30, focalY: 70, zoom: 1, alt: null });
    expect(r.style?.objectPosition).toBe("30% 70%");
    expect(r.style?.transform).toBeUndefined();
  });
  it("applies scale only when zoomed in", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 50, focalY: 50, zoom: 1.5, alt: null });
    expect(r.style?.transform).toBe("scale(1.5)");
  });
  it("passes alt through", () => {
    const r = applyOverride("/a.jpg", { key: "/a.jpg", mediaUrl: null, focalX: 50, focalY: 50, zoom: 1, alt: "Hi" });
    expect(r.alt).toBe("Hi");
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
