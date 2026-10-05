/**
 * The single source of truth for Viewnear's partner credentials.
 *
 * Every surface that names a partnership reads from here: the hero credential
 * line, the partner plates on the home Proof band and the footer, the badge
 * chips, the Organization schema's memberOf, and llms.txt. Change a fact here
 * and the whole site follows; nothing else hard-codes a tier.
 *
 * Both credentials are stated as fact. Viewnear is a Claude Certified Partner,
 * the Claude Partner Network tier below Select (owner, 2026-09-27). The badge
 * artwork Anthropic issues for it reads "Member"; the copy carries the tier
 * name, and the badge is shown as the artwork it is. When Select arrives, the
 * three ANTHROPIC fields below are the only edit.
 *
 * Snowflake holds both Partner Network tiers at once (owner, 2026-09-30):
 * Premier in one region, Select in the other. Copy states both tiers as fact
 * ("Premier & Select Partner ... across the USA and LATAM") without pairing a
 * tier to a region; which tier applies where is not published. `stackedBadge`
 * carries the Select artwork shown layered behind the Premier badge.
 */

/** Public directory entry for the Anthropic partnership, once one exists. */
export const ANTHROPIC_DIRECTORY_URL: string | null = null;

export type PartnerBadge = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /**
   * Multiplier on the base height wherever the badge is shown. A wide lockup
   * reads much heavier than a circle at the same height, so the Claude Partner
   * Network badge is held below one.
   */
  displayScale?: number;
};

export type PartnerNetwork = {
  key: "snowflake" | "anthropic";
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
   * `preferTall`) rather than paired in a row against the other network's mark,
   * where a portrait shape next to a circle would read as mismatched.
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

export const ANTHROPIC: PartnerNetwork = {
  key: "anthropic",
  network: "Claude Partner Network",
  level: "Certified Partner",
  label: "Claude Certified Partner",
  // Anthropic's official SVGs (2026-10-05), replacing the old wide "Member"
  // card and its raster successor: three cuts of the same "Certified Services
  // Partner" badge, all already transparent outside the rounded card.
  //
  // `badge`, the Chip cut (90x90, square): used everywhere this sits in a row
  // beside Snowflake's circle (footer, home Recognition, the partnership hub,
  // the standalone logo rows on /migrations, /data-ai, /case-studies,
  // /snowflake-consulting-services). Square like the Snowflake seal, so no
  // displayScale correction is needed to read as an equal (the old wide card
  // held this below 1 to compensate for its 1.87:1 shape; this one does not).
  badge: { src: "/assets/images/certs/claude-certified-chip.svg", alt: "Claude Certified Services Partner badge", w: 90, h: 90 },
  // The Vertical cut (150x300, portrait): used only on the partnership-page
  // hero credential, the one place the badge stands alone with no other
  // network's mark beside it to match proportions against. A third cut,
  // Horizontal (300x95, landscape), ships alongside these in
  // public/assets/images/certs/ but has no slot that suits it yet: everywhere
  // the badge appears is either paired with Snowflake's circle (wants square)
  // or alone with vertical room to spare (wants portrait).
  badgeTall: { src: "/assets/images/certs/claude-certified-vertical.svg", alt: "Claude Certified Services Partner badge", w: 150, h: 300 },
  secondary: [],
  directoryUrl: ANTHROPIC_DIRECTORY_URL,
  // Verified 2026-09-16: Q116758847 resolves to "Anthropic, American artificial
  // intelligence corporation".
  org: { name: "Anthropic", url: "https://www.anthropic.com", wikidata: "https://www.wikidata.org/wiki/Q116758847" },
};

/** Snowflake first, always: the data practice comes before the agentic one. */
export const PARTNERS: readonly PartnerNetwork[] = [SNOWFLAKE, ANTHROPIC];

/**
 * The credential line. By default each partner's plain label; with
 * `withNetwork` the network and the level where that composes into the name
 * the program uses. Snowflake's does ("Snowflake Partner Network Premier &
 * Select Services Partner"); Anthropic's does not, so the label stands on its
 * own and the line reads "... · Claude Certified Partner · <extras>".
 */
export function credentialLine(extras: string[] = [], opts?: { withNetwork?: boolean }): string {
  const name = (p: PartnerNetwork) =>
    opts?.withNetwork && p.level && p.key !== "anthropic" ? `${p.network} ${p.level}` : p.label;
  return [...PARTNERS.map(name), ...extras].join(" · ");
}

/** The caption under a plate: the network and level when published, else the label. */
export function plateCaption(p: PartnerNetwork): string {
  return p.level ? `${p.network} · ${p.level}` : p.label;
}
