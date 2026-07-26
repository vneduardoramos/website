import { theme } from "@/config/theme";
import { ORG_REF, AREA_SERVED } from "@/lib/seo";

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
/** One physical office. `url` is its own page on this site, where it has one. */
type OfficeInput = {
  key: string;
  url?: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: number;
  longitude: number;
};

export const OFFICES: readonly OfficeInput[] = [
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
    // Its own page, so the LocalBusiness node points at a document describing it.
    url: "/nearshore/monterrey",
    streetAddress: "Carr. Nacional 500, Valle Alto",
    addressLocality: "Monterrey",
    addressRegion: "NL",
    postalCode: "64983",
    addressCountry: "MX",
    latitude: 25.5563,
    longitude: -100.2417,
  },
];

export type Office = OfficeInput;

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
 * One `LocalBusiness` per office, for pages with location intent. Emitting these
 * on more than one page is legitimate: each page genuinely describes the same two
 * physical locations.
 *
 * `LocalBusiness` rather than `ProfessionalService`: schema.org marks the latter
 * as superseded by LocalBusiness, so a current consumer resolves it less
 * reliably. Same properties, current type.
 */
export function officesLd(): Record<string, unknown>[] {
  return OFFICES.map((o) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    // One stable id per office, so the two locations are distinct entities that
    // can be referenced and corroborated rather than two anonymous look-alikes.
    "@id": `${theme.brand.url}/#office-${o.key}`,
    name: `${theme.brand.name} ${o.addressLocality}`,
    // The office's own page where it has one, so the node points somewhere that
    // describes it rather than at the site root twice.
    url: o.url ? `${theme.brand.url}${o.url}` : theme.brand.url,
    parentOrganization: ORG_REF,
    areaServed: AREA_SERVED,
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
