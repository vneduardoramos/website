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

/**
 * Is this override doing anything visible? An override is "active" when it
 * pans (focal off-center), zooms in, or replaces the source. Only then do we
 * apply the cropper CSS / wrap the live image — when inactive the render path
 * must stay byte-identical to the unedited default.
 */
export function isOverrideActive(ov: ImageOverrideData | null): boolean {
  if (!ov) return false;
  return ov.focalX !== 50 || ov.focalY !== 50 || ov.zoom > 1 || Boolean(ov.mediaUrl);
}

/**
 * Pure: compute the effective src/style/alt for an image given its override.
 *
 * Cropper model (identical in the editor preview and the live render):
 *   - the image fills its slot via `object-fit: cover`
 *   - `object-position: focalX% focalY%` pans the natural cover overflow
 *   - `transform: scale(zoom)` with `transform-origin` at the focal point
 *     magnifies the image, anchored on the focal point, which GUARANTEES a
 *     large pannable region once zoomed
 * The caller (Img / the editor frame) supplies the `overflow: hidden` slot
 * that clips the magnified image. `focalX/focalY` are reinterpreted as the
 * focal/pan point; `zoom` as magnification. No schema change.
 */
export function applyOverride(
  src: string,
  ov: ImageOverrideData | null,
): { src: string; style?: CSSProperties; alt?: string } {
  if (!ov) return { src, style: undefined, alt: undefined };
  // Alt text and a replaced src are honored even when the framing is neutral
  // (they don't change the cover/transform render path).
  if (!isOverrideActive(ov)) {
    return { src: ov.mediaUrl || src, style: undefined, alt: ov.alt ?? undefined };
  }
  const o = ov;
  const style: CSSProperties = {
    // Force cover so the focal point + zoom crop applies even to images whose
    // component never set object-fit (root cause B: sized non-cover images).
    objectFit: "cover",
    objectPosition: `${o.focalX}% ${o.focalY}%`,
  };
  if (o.zoom > 1) {
    style.transform = `scale(${o.zoom})`;
    style.transformOrigin = `${o.focalX}% ${o.focalY}%`;
  }
  return {
    src: o.mediaUrl || src,
    style,
    alt: o.alt ?? undefined,
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
