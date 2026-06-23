import type { CSSProperties } from "react";

export type ImageOverrideData = {
  key: string;
  mediaUrl: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  alt: string | null;
};

export type OverrideMap = Record<string, ImageOverrideData>;

/** Pure: compute the effective src/style/alt for an image given its override. */
export function applyOverride(
  src: string,
  ov: ImageOverrideData | null,
): { src: string; style?: CSSProperties; alt?: string } {
  if (!ov) return { src, style: undefined, alt: undefined };
  const style: CSSProperties = {};
  if (ov.focalX !== 50 || ov.focalY !== 50) style.objectPosition = `${ov.focalX}% ${ov.focalY}%`;
  if (ov.zoom > 1) style.transform = `scale(${ov.zoom})`;
  return {
    src: ov.mediaUrl || src,
    style: Object.keys(style).length ? style : undefined,
    alt: ov.alt ?? undefined,
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Pure: validate/normalize the POST body for the override API. */
export function parseOverrideInput(
  body: unknown,
): { key: string; data: { mediaUrl?: string | null; focalX?: number; focalY?: number; zoom?: number; alt?: string | null } } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.key !== "string" || b.key.length === 0) return null;
  const data: { mediaUrl?: string | null; focalX?: number; focalY?: number; zoom?: number; alt?: string | null } = {};
  if ("mediaUrl" in b) data.mediaUrl = typeof b.mediaUrl === "string" ? b.mediaUrl : null;
  if (typeof b.focalX === "number") data.focalX = clamp(b.focalX, 0, 100);
  if (typeof b.focalY === "number") data.focalY = clamp(b.focalY, 0, 100);
  if (typeof b.zoom === "number") data.zoom = clamp(b.zoom, 1, 3);
  if ("alt" in b) data.alt = typeof b.alt === "string" ? b.alt.trim() : null;
  return { key: b.key, data };
}
