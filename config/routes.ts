/**
 * The site's static (non database-driven) marketing routes, in the order a
 * reader should meet them.
 *
 * Single source of truth for `app/sitemap.ts` and `app/llms.txt/route.ts`. Those
 * two used to keep their own lists and drifted: the hand-maintained llms.txt
 * covered 15 of these 24 paths and pointed at `/solutions`, which has
 * redirected to `/services` for some time.
 *
 * `""` is the home page. Every path here exists in both locales: en at the path
 * itself, es at `/es` + path (next-intl `localePrefix: "as-needed"`).
 *
 * `group` drives the llms.txt section headings. It has no effect on the sitemap.
 */
export type StaticRoute = {
  path: string;
  /** Human page name. This is what a model reads as the page's title. */
  label: string;
  group: "core" | "offering" | "proof" | "company" | "legal";
  /** One line telling a machine what the page is for. Used by llms.txt. */
  blurb: string;
};

export const STATIC_ROUTES: StaticRoute[] = [
  { path: "", label: "Home", group: "core", blurb: "Positioning and overview" },
  { path: "/services", label: "Services", group: "offering", blurb: "The six service areas, from strategy to production AI" },
  {
    path: "/snowflake-consulting-services", label: "Snowflake consulting and implementation services",
    group: "offering",
    // The one page allowed to use the word: it targets that head term.
    blurb: "Snowflake consulting and implementation services, end to end",
  },
  { path: "/migrations", label: "Snowflake migrations", group: "offering", blurb: "Moving off Teradata, Oracle, Redshift or Hadoop onto Snowflake" },
  { path: "/data-ai", label: "Data and AI, agents in production", group: "offering", blurb: "AI agents inside Snowflake and in the flow of work" },
  { path: "/platform", label: "Snowflake architecture and governance", group: "offering", blurb: "The Snowflake-native architecture engagements are built on" },
  { path: "/nearshore", label: "Nearshore delivery", group: "offering", blurb: "Nearshore delivery model and the engineering team behind it" },
  {
    path: "/nearshore/monterrey", label: "Monterrey delivery centre",
    group: "offering",
    blurb: "The Monterrey, Mexico delivery centre: address, talent pool, travel and time zone",
  },
  { path: "/industries", label: "Industries", group: "offering", blurb: "Sector-specific data and AI work" },
  { path: "/approach", label: "How engagements run", group: "offering", blurb: "How engagements run, use case by use case" },
  { path: "/pricing", label: "Pricing and engagement models", group: "offering", blurb: "Engagement models and what drives cost" },
  { path: "/case-studies", label: "Case studies", group: "proof", blurb: "Real, anonymized engagements with measured outcomes" },
  { path: "/partnership", label: "Partnerships", group: "proof", blurb: "Both partner networks: Snowflake Premier & Select Partner and Claude Certified Partner" },
  { path: "/partnership/snowflake", label: "Snowflake partnership", group: "proof", blurb: "Snowflake Premier & Select Partner and CoCo Preferred Partner: governed data and the AI layer on Snowflake" },
  { path: "/partnership/claude", label: "Claude partnership", group: "proof", blurb: "Claude Certified Partner in the Claude Partner Network: agentic solutions built with Claude" },
  { path: "/security", label: "Security and trust", group: "proof", blurb: "Governance, data handling and compliance posture" },
  { path: "/faq", label: "Frequently asked questions", group: "proof", blurb: "Partner status, pricing, timelines, security, contracting" },
  { path: "/press", label: "Press coverage", group: "proof", blurb: "Third-party press coverage quoting Viewnear" },
  { path: "/snowflake-world-tour-mexico-city", label: "Snowflake World Tour Mexico City", group: "proof", blurb: "Viewnear at Snowflake World Tour Mexico City, October 13, 2026: booth details and a form to meet" },
  { path: "/blog", label: "Blog", group: "proof", blurb: "Field notes on Snowflake, data engineering and AI" },
  { path: "/resources", label: "Resources", group: "proof", blurb: "Case studies, blog and FAQ in one place" },
  { path: "/about", label: "About Viewnear", group: "company", blurb: "The company, the leadership team and the track record" },
  { path: "/life-at-viewnear", label: "Life at Viewnear", group: "company", blurb: "Culture, benefits and the two offices" },
  { path: "/careers", label: "Careers", group: "company", blurb: "Open engineering roles and how hiring works" },
  { path: "/contact", label: "Contact", group: "company", blurb: "Start a data and AI engagement" },
  { path: "/privacy", label: "Privacy policy", group: "legal", blurb: "Privacy policy" },
  { path: "/terms", label: "Terms of service", group: "legal", blurb: "Terms of service" },
];

/** Just the paths, for the sitemap. */
export const STATIC_PATHS: string[] = STATIC_ROUTES.map((r) => r.path);
