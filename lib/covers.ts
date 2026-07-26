/**
 * Deterministic cover-image assignment from the local photo pool, so blog
 * posts, news, and case studies always show a real, on-brand photograph
 * (used directly where no DB image exists, or as a fallback).
 */

const PHOTOS = [
  "/assets/images/photos/analytics-dashboard-laptop.jpg",
  "/assets/images/photos/analytics-dashboard-charts.jpg",
  "/assets/images/photos/data-center-server-racks.jpg",
  "/assets/images/photos/earth-at-night-from-orbit.jpg",
  "/assets/images/photos/python-data-code-editor.jpg",
  "/assets/images/photos/data-team-at-laptop.jpg",
  "/assets/images/photos/team-meeting-laptops.jpg",
  "/assets/images/photos/circuit-board-macro.jpg",
];

const SECTOR_IMAGE: Record<string, string> = {
  "construction and real estate": "/assets/images/industries/construction-real-estate.jpg",
  education: "/assets/images/industries/education.jpg",
  "financial services": "/assets/images/industries/financial-services.jpg",
  manufacturing: "/assets/images/industries/manufacturing.jpg",
  "media, entertainment & advertising": "/assets/images/industries/media-entertainment-advertising.jpg",
  "retail & cpg": "/assets/images/industries/retail-cpg.jpg",
  "technology and telco": "/assets/images/industries/technology-telco.jpg",
};

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** A deterministic photo from the pool for the given seed (e.g. a slug). */
export function coverFor(seed: string): string {
  return PHOTOS[hash(seed) % PHOTOS.length];
}

/** Sector-appropriate image for case studies; falls back to the photo pool. */
export function coverForSector(sector: string | null | undefined, seed: string): string {
  const key = (sector ?? "").trim().toLowerCase();
  return SECTOR_IMAGE[key] ?? coverFor(seed);
}
