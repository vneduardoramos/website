import { theme } from "@/config/theme";

/**
 * The two real offices, in one place. Previously these addresses existed only
 * as inline JSON-LD on /life-at-viewnear, which meant the site-wide
 * Organization entity carried no postal address at all and the pages with
 * actual location intent (/contact, /nearshore, the Monterrey page) carried
 * nothing. Keep this list as the single source of truth so the NAP stays
 * identical everywhere (see docs/seo-offsite-checklist.md: NAP consistency is
 * itself a ranking signal).
 *
 * Austin is listed first: it is the US-facing address, and the commercial
 * target queries are US ones.
 */
export const OFFICES = [
  {
    key: "austin",
    streetAddress: "10900 Stonelake Blvd, Bldg 2, Suite 100",
    addressLocality: "Austin",
    addressRegion: "TX",
    postalCode: "78759",
    addressCountry: "US",
    // Approximate, from the street address; used for geo hints only.
    latitude: 30.4064,
    longitude: -97.7472,
  },
  {
    key: "monterrey",
    streetAddress: "Carr. Nacional 500, Valle Alto",
    addressLocality: "Monterrey",
    addressRegion: "NL",
    postalCode: "64983",
    addressCountry: "MX",
    latitude: 25.5563,
    longitude: -100.2417,
  },
] as const;

export type Office = (typeof OFFICES)[number];

function postalAddress(o: Office) {
  return {
    "@type": "PostalAddress",
    streetAddress: o.streetAddress,
    addressLocality: o.addressLocality,
    addressRegion: o.addressRegion,
    postalCode: o.postalCode,
    addressCountry: o.addressCountry,
  };
}

/**
 * `ProfessionalService` per office, for pages with location intent. Emitting
 * these on more than one page is legitimate: each page genuinely describes the
 * same two physical locations.
 */
export function officesLd(): Record<string, unknown>[] {
  return OFFICES.map((o) => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: theme.brand.name,
    url: theme.brand.url,
    parentOrganization: { "@type": "Organization", name: theme.brand.name, url: theme.brand.url },
    areaServed: "Americas",
    address: postalAddress(o),
    geo: { "@type": "GeoCoordinates", latitude: o.latitude, longitude: o.longitude },
  }));
}

/** `Place` nodes for `Organization.location` (both offices on one entity). */
export function officePlaces(): Record<string, unknown>[] {
  return OFFICES.map((o) => ({
    "@type": "Place",
    name: `${theme.brand.name} ${o.addressLocality}`,
    address: postalAddress(o),
  }));
}

/** The primary (US) postal address for `Organization.address`. */
export function primaryAddress(): Record<string, unknown> {
  return postalAddress(OFFICES[0]);
}
