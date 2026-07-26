/**
 * Press coverage of Viewnear. Outlet-agnostic: each publication's display name
 * and optional logo live in OUTLETS, and every item references an outlet by
 * key, so adding a future outlet is just a new OUTLETS entry plus items (no
 * component changes). A typed constant is sufficient for this small, static
 * list (no CMS/DB model); today the items happen to be CRN articles.
 *
 * Titles, URLs, dates, and quotes are verbatim from the source articles and
 * are NEVER translated: only the chrome around them (messages/*\/press.json)
 * is localized. Newest first.
 */

/**
 * A publication that has covered Viewnear. `logo` is optional: outlets without
 * a logo asset render their name as text instead. Add future outlets here so
 * nothing downstream is tied to any single publication.
 */
export type Outlet = { name: string; logo?: string; logoWidth?: number; logoHeight?: number };

export const OUTLETS: Record<string, Outlet> = {
  crn: { name: "CRN", logo: "/assets/press/crn-mark.png", logoWidth: 767, logoHeight: 256 },
};

/** Resolve an outlet key to its metadata; an unknown key degrades to a name-only outlet. */
export function getOutlet(key: string): Outlet {
  return OUTLETS[key] ?? { name: key };
}

/**
 * The person usually quoted (Viewnear's CEO). Coverage cards omit the speaker
 * name when it matches this, so it isn't repeated on every card; a quote from
 * anyone else is credited by name.
 */
export const PRIMARY_SPEAKER = "Eduardo Ramos";

export type PressItem = {
  slug: string;
  title: string;
  url: string;
  /** Key into OUTLETS. */
  outlet: string;
  author: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Verbatim quotation from the article. Mutually exclusive with `paraphrase`. */
  quote?: string;
  /**
   * A line the article prints as reported speech rather than inside quotation
   * marks. Rendered without quote marks so the page never presents the
   * reporter's paraphrase as the speaker's words.
   */
  paraphrase?: string;
  quoteBy: string;
};

export const PRESS: PressItem[] = [
  {
    slug: "anthropic-takes-step-toward-ipo-amid-channel-development",
    title: "Anthropic Takes Step Toward IPO Amid Channel Development",
    url: "https://www.crn.com/news/ai/2026/anthropic-takes-step-toward-ipo-amid-channel-development",
    outlet: "crn",
    author: "Wade Tyler Millward",
    date: "2026-06-01T12:00:00Z",
    quote:
      "Organizations are investing in platforms they believe can support long-term, production-scale AI initiatives. We're seeing that demand firsthand across our customers.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "snowflake-q1-earnings-5-channel-takeaways-on-ai-growth-data-product-consumption",
    title:
      "Snowflake Q1 Earnings: 5 Channel Takeaways On AI Growth, Data Product Consumption",
    url: "https://www.crn.com/news/ai/2026/snowflake-q1-earnings-5-channel-takeaways-on-ai-growth-data-product-consumption",
    outlet: "crn",
    author: "Wade Tyler Millward",
    date: "2026-06-01T12:00:00Z",
    quote:
      "Data and AI are coming together. And people, leaders are understanding now that if they want to do AI, they need to do data first.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "anthropic-raises-65b-as-it-scales-partnerships",
    title: "Anthropic Raises $65B As It Scales Partnerships",
    // NOTE: the live CRN URL slug reads "scale" (singular), not "scales" as in
    // the headline; copied verbatim, do not "fix".
    url: "https://www.crn.com/news/ai/2026/anthropic-raises-65b-as-it-scale-partnerships",
    outlet: "crn",
    author: "Wade Tyler Millward",
    date: "2026-05-28T12:00:00Z",
    quote:
      "Anthropic, at the end of the day, they want partners that know Anthropic top to bottom. We can bring in new accounts, co-sell accounts through them.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "outcome-based-business-models-gain-traction-in-the-channel-as-a-way-to-navigate-ai-economics",
    title:
      "Outcome-Based Business Models Gain Traction In The Channel As A Way To Navigate AI Economics",
    url: "https://www.crn.com/news/ai/2026/outcome-based-business-models-gain-traction-in-the-channel-as-a-way-to-navigate-ai-economics",
    outlet: "crn",
    author: "Wade Tyler Millward",
    date: "2026-02-18T12:00:00Z",
    quote:
      "We were born as a data AI company. I feel I'm with the right partner, with the right company.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "snowflake-partners-ais-impact-can-withstand-a-potential-bubble",
    title: "Snowflake Partners: AI's Impact Can Withstand A Potential Bubble",
    // NOTE: the live CRN URL slug reads "ai-s" (hyphenated), copied verbatim.
    url: "https://www.crn.com/news/ai/2026/snowflake-partners-ai-s-impact-can-withstand-a-potential-bubble",
    outlet: "crn",
    author: "Wade Tyler Millward",
    date: "2026-02-18T12:00:00Z",
    // CRN prints this as reported speech ("... he said"), not inside quotation
    // marks, so it is stored as a paraphrase and rendered without quote marks.
    paraphrase:
      "AI holds as much importance to technological innovation as the internet and electricity.",
    quoteBy: "Eduardo Ramos",
  },
];

/**
 * The home strip's pull-quote. CRN's sentence is the reporter relaying Ramos
 * ("..., Ramos said"), so `attribution` credits him rather than letting the
 * outlet's byline stand as the source of the assessment. Links to the article.
 */
export const PRESS_HOME_QUOTE = {
  quote:
    "Viewnear has been building enterprise-grade production AI systems with governed Snowflake data anchored on Anthropic Claude.",
  outlet: "crn",
  attribution: "Eduardo Ramos, in CRN",
  url: PRESS[1].url,
} as const;
