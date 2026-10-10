import { getServices, getIndustries, getTeam, getSetting, getCaseStudies, getBlogPosts, safe } from "@/lib/queries";
import { theme } from "@/config/theme";
import { credentialLine } from "@/config/partners";
import type { Locale } from "@/lib/i18n-content";

/**
 * What the chat agent is allowed to know, assembled fresh per request from
 * the same content the site itself renders (services, industries, pricing
 * model, FAQs, the booking roster), never from the model's own training.
 *
 * Kept deliberately short: this text rides in the system prompt on every
 * turn, so it is trimmed to one line per item rather than the full page
 * copy. The bookable roster is returned separately (not just embedded in
 * the prose) so the API route can resolve a person's name to their actual
 * Calendly URL without asking the model to remember or invent one.
 */

export type BookableTeamMember = {
  slug: string;
  name: string;
  title: string;
  url: string;
  topics: string;
};

export type ChatKnowledge = {
  systemFacts: string;
  roster: BookableTeamMember[];
};

const MAX_LINE = 140;
const clip = (s: string, max = MAX_LINE) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

type FaqRow = { category?: string; q: string; a: string };

export async function getChatKnowledge(locale: Locale): Promise<ChatKnowledge> {
  const [services, industries, team, faqs, caseStudies, blogPosts] = await Promise.all([
    safe(getServices(locale), []),
    safe(getIndustries(locale), []),
    safe(getTeam(locale), []),
    safe(getSetting<FaqRow[]>("faqs", locale), []),
    safe(getCaseStudies({}, locale), []),
    safe(getBlogPosts({ take: 12 }, locale), []),
  ]);

  const roster: BookableTeamMember[] = team
    .filter((m): m is typeof m & { bookingUrl: string } => Boolean(m.bookingUrl))
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      title: m.title,
      url: m.bookingUrl,
      topics: m.bookingTopics ?? m.title,
    }));

  const servicesLines = services
    .map((s) => `- ${s.title} (/services/${s.slug}): ${clip(s.summary)}`)
    .join("\n");

  const industriesLines = industries
    .map((i) => `- ${i.name} (/industries/${i.slug}): ${clip(i.headline, 100)}`)
    .join("\n");

  const rosterLines = roster
    .map((p) => `- ${p.slug}: ${p.name}, ${p.title}. Talks about: ${clip(p.topics, 90)}`)
    .join("\n");

  // Named only where the customer agreed to it; every other case study stays
  // by sector, matching what the page itself shows.
  const caseStudyLines = caseStudies
    .map((c) => {
      const who = c.clientNamed && c.client?.name ? c.client.name : c.sector;
      return `- ${c.title} (/case-studies/${c.slug}): ${who} · ${c.region}. ${clip(c.summary, 140)}`;
    })
    .join("\n");

  const blogLines = blogPosts
    .map((b) => `- ${b.title} (/blog/${b.slug}): ${clip(b.excerpt ?? "", 120)}`)
    .join("\n");

  // Trimmed to question + one clause of the answer: enough for the model to
  // recognize the topic and paraphrase, not enough to quietly double the
  // system prompt's size.
  const faqLines = (faqs ?? [])
    .slice(0, 12)
    .map((f) => `- Q: ${clip(f.q, 100)} A: ${clip(f.a, 160)}`)
    .join("\n");

  const systemFacts = `
COMPANY
${theme.brand.name}: ${theme.brand.tagline} ${clip(theme.brand.description, 320)}
Partnerships: ${credentialLine([], { withNetwork: true })}.
Delivery: nearshore team on US business hours, offices in Austin, Texas and Monterrey, Mexico.
Contact: ${theme.brand.email}. General booking: ${theme.brand.bookingUrl}

AGENTIC APPROACH (which to propose, given what the visitor describes)
- Data foundation always comes first: never propose an agent that talks directly to an operational or production database. Source data lands in Snowflake, governed, before any agent touches it.
- Once it's governed in Snowflake, Cortex Agents, Snowflake's own agent framework, reason over it and act, running inside Snowflake so nothing is copied out.
- When the work also has to reach outside Snowflake (an ERP, a CRM, scheduling, any other system of record), that runs through Snowflake's own governed integrations (Openflow, external access integrations, Native Apps) on top of the same governed foundation, not a bespoke connector per system.
- Autonomy is a tuned confidence threshold, not "a person approves everything": above it the agent acts, below it a case goes to a person with the reasoning shown.

SERVICES
${servicesLines || "(none published)"}

INDUSTRIES
${industriesLines || "(none published)"}

ENGAGEMENT MODELS (pricing is scoped per engagement, never a published rate)
- Fixed cost: a defined scope, timeline and price agreed up front.
- Time & materials: flexible, iterative delivery for evolving scope.
- Dedicated team / staff augmentation: embedded practitioners alongside the in-house team.

CASE STUDIES (real, anonymized unless a client is named)
${caseStudyLines || "(none published)"}

RECENT BLOG POSTS
${blogLines || "(none published)"}

FAQ
${faqLines || "(none published)"}

TEAM AVAILABLE TO BOOK (use the slug in a BOOK line, never invent a person or URL)
${rosterLines || "(none)"}
`.trim();

  return { systemFacts, roster };
}
