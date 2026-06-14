import { getSetting, safe } from "@/lib/queries";

/**
 * The two client-logo bands on the home page (above + below the "Leading teams"
 * Customers section), configurable from the admin (/admin/client-logos).
 *
 * Each logo carries its own src/alt/w/h (so admin-uploaded logos work without a
 * code change) plus a per-logo nudge (dx/dy px) and scale. Defaults are dx:0,
 * dy:0, scale:1, which reproduces exactly the current site layout.
 */
export type BandLogo = {
  src: string;
  alt: string;
  w: number; // intrinsic width (for next/image; no layout shift)
  h: number; // intrinsic height
  dx: number; // horizontal nudge in px (right +, left -)
  dy: number; // vertical nudge in px (down +, up -)
  scale: number; // size multiplier (1 = default)
};

export type ClientBands = { top: BandLogo[]; bottom: BandLogo[] };

/** Catalog of the normalized logos already on the site (the "add existing" palette). */
export const LOGO_CATALOG: { key: string; src: string; alt: string; w: number; h: number }[] = [
  { key: "heb", src: "/assets/images/clients/heb.png", alt: "H-E-B", w: 252, h: 115 },
  { key: "starbucks", src: "/assets/images/clients/starbucks.png", alt: "Starbucks", w: 536, h: 115 },
  { key: "banregio", src: "/assets/images/clients/banregio.png", alt: "Banregio", w: 287, h: 115 },
  { key: "laureate", src: "/assets/images/clients/laureate.png", alt: "Laureate", w: 557, h: 115 },
  { key: "hussmann", src: "/assets/images/clients/hussmann.png", alt: "Hussmann", w: 586, h: 115 },
  { key: "lendz", src: "/assets/images/clients/lendz.png", alt: "Lendz", w: 353, h: 115 },
  { key: "difrenosa", src: "/assets/images/clients/difrenosa.png", alt: "Difrenosa", w: 675, h: 115 },
];

function fromCatalog(key: string): BandLogo {
  const c = LOGO_CATALOG.find((x) => x.key === key)!;
  return { src: c.src, alt: c.alt, w: c.w, h: c.h, dx: 0, dy: 0, scale: 1 };
}

/** Defaults reproduce exactly the current layout (top 4 / bottom 3, no offsets). */
export const DEFAULT_BANDS: ClientBands = {
  top: ["heb", "starbucks", "banregio", "laureate"].map(fromCatalog),
  bottom: ["hussmann", "lendz", "difrenosa"].map(fromCatalog),
};

const num = (v: unknown, fallback: number): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function sanitizeLogo(raw: unknown): BandLogo | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.src !== "string" || o.src === "") return null;
  return {
    src: o.src,
    alt: typeof o.alt === "string" ? o.alt : "",
    w: Math.round(clamp(num(o.w, 200), 1, 5000)),
    h: Math.round(clamp(num(o.h, 115), 1, 5000)),
    dx: Math.round(clamp(num(o.dx, 0), -300, 300)),
    dy: Math.round(clamp(num(o.dy, 0), -300, 300)),
    scale: clamp(num(o.scale, 1), 0.3, 3),
  };
}

export function sanitizeBands(raw: unknown): ClientBands {
  const o = (raw ?? {}) as Record<string, unknown>;
  const arr = (v: unknown): BandLogo[] =>
    Array.isArray(v) ? v.map(sanitizeLogo).filter((x): x is BandLogo => x !== null) : [];
  return { top: arr(o.top), bottom: arr(o.bottom) };
}

/** Read the admin-configured bands; fall back to the current default layout. */
export async function getClientBands(): Promise<ClientBands> {
  const raw = await safe(getSetting<unknown>("clientBands"), null);
  if (raw == null) return DEFAULT_BANDS;
  const bands = sanitizeBands(raw);
  if (bands.top.length === 0 && bands.bottom.length === 0) return DEFAULT_BANDS;
  return bands;
}
