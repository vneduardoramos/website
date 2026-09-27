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
  level: "Premier Services Partner",
  label: "Snowflake Premier Partner",
  badge: { src: "/assets/images/certs/premier.webp", alt: "Snowflake Premier Partner badge", w: 460, h: 460 },
  secondary: [
    { src: "/assets/images/certs/coco-preferred.png", alt: "Snowflake CoCo Preferred Partner badge", w: 900, h: 741 },
    { src: "/assets/images/certs/snowpro-core.png", alt: "SnowPro Core certification badge", w: 487, h: 402 },
  ],
  directoryUrl: "https://www.snowflake.com/en/why-snowflake/partners/all-partners/viewnear/",
  org: { name: "Snowflake Inc.", url: "https://www.snowflake.com", wikidata: "https://www.wikidata.org/wiki/Q65141064" },
};

export const ANTHROPIC: PartnerNetwork = {
  key: "anthropic",
  network: "Claude Partner Network",
  level: "Certified Partner",
  label: "Claude Certified Partner",
  // Anthropic's artwork, with everything outside the rounded card made
  // transparent so the badge sits on the page rather than carrying its own
  // cream rectangle onto every surface. The file exactly as supplied is kept
  // beside it as claude-partner-network-member-original.png.
  //
  // displayScale: the card is 1.87:1 where the Snowflake seal is 1:1, so at an
  // equal height it reads much wider and heavier. Held at 0.82 so the two sit
  // as equals in a row.
  badge: {
    src: "/assets/images/certs/claude-partner-network-member.png",
    alt: "Claude Partner Network member badge",
    w: 1021,
    h: 546,
    displayScale: 0.82,
  },
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
 * the program uses. Snowflake's does ("Snowflake Partner Network Premier
 * Services Partner"); Anthropic's does not, so the label stands on its own and
 * the line reads "... · Claude Certified Partner · <extras>".
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
