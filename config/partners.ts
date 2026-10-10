/**
 * The single source of truth for Viewnear's partner credentials.
 *
 * Every surface that names a partnership reads from here: the hero credential
 * line, the partner plates on the home Proof band and the footer, the badge
 * chips, the Organization schema's memberOf, and llms.txt. Change a fact here
 * and the whole site follows; nothing else hard-codes a tier.
 *
 * Snowflake holds both Partner Network tiers at once (owner, 2026-09-30):
 * Premier in one region, Select in the other. Copy states both tiers as fact
 * ("Premier & Select Partner ... across the USA and LATAM") without pairing a
 * tier to a region; which tier applies where is not published. `stackedBadge`
 * carries the Select artwork shown layered behind the Premier badge.
 */

export type PartnerBadge = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /**
   * Multiplier on the base height wherever the badge is shown. A wide lockup
   * reads much heavier than a circle at the same height, so a non-circular
   * badge can be held below one.
   */
  displayScale?: number;
};

export type PartnerNetwork = {
  key: "snowflake";
  /** The program's own name, printed as the program prints it. */
  network: string;
  /** The published level inside the program, or null when none is published. */
  level: string | null;
  /** The credential as a phrase, for prose and the hero line. */
  label: string;
  /** Official artwork for the primary recognition; null when none may be shown. */
  badge: PartnerBadge | null;
  /**
   * A second tier badge in the same program, layered behind `badge` (see
   * TieredBadgeMark) rather than shown separately: the two tiers as one
   * credential, not two recognitions to read independently.
   */
  stackedBadge?: PartnerBadge;
  /**
   * A taller cut of the same badge, for the one spot it stands alone with
   * real vertical room (the partnership-page hero credential, PartnerPageBlocks'
   * `preferTall`).
   */
  badgeTall?: PartnerBadge;
  /** Further recognitions inside the same program (shown smaller, with the primary). */
  secondary: PartnerBadge[];
  /** Where a reader can verify the claim. */
  directoryUrl: string | null;
  /** The company behind the program, for structured data. */
  org: { name: string; url: string; wikidata: string };
};

export const SNOWFLAKE: PartnerNetwork = {
  key: "snowflake",
  network: "Snowflake Partner Network",
  level: "Premier & Select Services Partner",
  label: "Snowflake Premier & Select Partner",
  badge: { src: "/assets/images/certs/premier.webp", alt: "Snowflake Premier Partner badge", w: 460, h: 460 },
  // Same seal, the Select tier ring. Shown layered behind the Premier badge
  // (see TieredBadgeMark), not on its own: the two tiers read as one
  // credential ("Premier & Select"), not as two badges to parse separately.
  stackedBadge: { src: "/assets/images/certs/select.png", alt: "Snowflake Select Partner badge", w: 512, h: 512 },
  secondary: [
    { src: "/assets/images/certs/coco-preferred.png", alt: "Snowflake CoCo Preferred Partner badge", w: 900, h: 741 },
    { src: "/assets/images/certs/snowpro-core.png", alt: "SnowPro Core certification badge", w: 487, h: 402 },
  ],
  directoryUrl: "https://www.snowflake.com/en/why-snowflake/partners/all-partners/viewnear/",
  org: { name: "Snowflake Inc.", url: "https://www.snowflake.com", wikidata: "https://www.wikidata.org/wiki/Q22078063" },
};

/** The one partner network the site names. */
export const PARTNERS: readonly PartnerNetwork[] = [SNOWFLAKE];

/**
 * The credential line. By default the partner's plain label; with
 * `withNetwork` the network and level compose into the name the program uses
 * ("Snowflake Partner Network Premier & Select Services Partner").
 */
export function credentialLine(extras: string[] = [], opts?: { withNetwork?: boolean }): string {
  const name = (p: PartnerNetwork) => (opts?.withNetwork && p.level ? `${p.network} ${p.level}` : p.label);
  return [...PARTNERS.map(name), ...extras].join(" · ");
}

/** The caption under a plate: the network and level when published, else the label. */
export function plateCaption(p: PartnerNetwork): string {
  return p.level ? `${p.network} · ${p.level}` : p.label;
}
