/**
 * CRN press coverage: 5 real 2026 articles quoting Eduardo Ramos / Viewnear,
 * all by CRN associate editor Wade Tyler Millward. A typed constant is
 * sufficient for this small, static list (no CMS/DB model).
 *
 * Titles, URLs, dates, and quotes are copied verbatim from the approved
 * design doc (docs/superpowers/specs/2026-07-17-press-crn-coverage-design.md)
 * and are NEVER translated: only the chrome around them (messages/*\/press.json)
 * is localized. Newest first.
 */

export type PressItem = {
  slug: string;
  title: string;
  url: string;
  outlet: "CRN";
  author: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  quote: string;
  quoteBy: string;
};

export const PRESS: PressItem[] = [
  {
    slug: "anthropic-takes-step-toward-ipo-amid-channel-development",
    title: "Anthropic Takes Step Toward IPO Amid Channel Development",
    url: "https://www.crn.com/news/ai/2026/anthropic-takes-step-toward-ipo-amid-channel-development",
    outlet: "CRN",
    author: "Wade Tyler Millward",
    date: "2026-06-01",
    quote:
      "Organizations are investing in platforms they believe can support long-term, production-scale AI initiatives. We're seeing that demand firsthand across our customers.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "snowflake-q1-earnings-5-channel-takeaways-on-ai-growth-data-product-consumption",
    title:
      "Snowflake Q1 Earnings: 5 Channel Takeaways On AI Growth, Data Product Consumption",
    url: "https://www.crn.com/news/ai/2026/snowflake-q1-earnings-5-channel-takeaways-on-ai-growth-data-product-consumption",
    outlet: "CRN",
    author: "Wade Tyler Millward",
    date: "2026-06-01",
    quote:
      "Data and AI are coming together. Leaders are understanding now that if they want to do AI, they need to do data first.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "anthropic-raises-65b-as-it-scales-partnerships",
    title: "Anthropic Raises $65B As It Scales Partnerships",
    // NOTE: the live CRN URL slug reads "scale" (singular), not "scales" as in
    // the headline; copied verbatim, do not "fix".
    url: "https://www.crn.com/news/ai/2026/anthropic-raises-65b-as-it-scale-partnerships",
    outlet: "CRN",
    author: "Wade Tyler Millward",
    date: "2026-05-28",
    quote:
      "Anthropic, at the end of the day, they want partners that know Anthropic top to bottom. We can bring in new accounts, co-sell accounts through them.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "outcome-based-business-models-gain-traction-in-the-channel-as-a-way-to-navigate-ai-economics",
    title:
      "Outcome-Based Business Models Gain Traction In The Channel As A Way To Navigate AI Economics",
    url: "https://www.crn.com/news/ai/2026/outcome-based-business-models-gain-traction-in-the-channel-as-a-way-to-navigate-ai-economics",
    outlet: "CRN",
    author: "Wade Tyler Millward",
    date: "2026-02-18",
    quote:
      "We were born as a data AI company. I feel I'm with the right partner, with the right company.",
    quoteBy: "Eduardo Ramos",
  },
  {
    slug: "snowflake-partners-ais-impact-can-withstand-a-potential-bubble",
    title: "Snowflake Partners: AI's Impact Can Withstand A Potential Bubble",
    // NOTE: the live CRN URL slug reads "ai-s" (hyphenated), copied verbatim.
    url: "https://www.crn.com/news/ai/2026/snowflake-partners-ai-s-impact-can-withstand-a-potential-bubble",
    outlet: "CRN",
    author: "Wade Tyler Millward",
    date: "2026-02-18",
    quote:
      "AI holds as much importance to technological innovation as the internet and electricity.",
    quoteBy: "Eduardo Ramos",
  },
];

/**
 * The home strip's pull-quote: CRN's own framing (its lead-in on item 2), the
 * strongest third-party validation line. Attributed to CRN (not to a person),
 * linking to that source article.
 */
export const PRESS_HOME_QUOTE = {
  quote:
    "Viewnear has been building enterprise-grade production AI systems with governed Snowflake data anchored on Anthropic Claude.",
  quoteBy: "CRN",
  url: PRESS[1].url,
} as const;
