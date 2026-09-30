import { theme } from "@/config/theme";
import { prisma } from "@/lib/db";
import { STATIC_ROUTES, type StaticRoute } from "@/config/routes";
import { PRESS, getOutlet } from "@/lib/press";

/**
 * `/llms.txt`, generated rather than hand-maintained.
 *
 * The llmstxt.org convention: one markdown file giving a language model a
 * curated, link-first map of the site, so an agent researching this domain does
 * not have to infer structure from navigation markup.
 *
 * This replaces a static public/llms.txt that had drifted. It listed 15 of the
 * 24 static pages, none of the ~38 detail pages, no Spanish URLs, and its first
 * commercial link pointed at /solutions, which redirects. Generating it from
 * config/routes.ts plus the same database the sitemap reads means it cannot fall
 * out of date on the next content ship.
 *
 * Routing note: the middleware matcher excludes any path containing a dot, so
 * this route is never localized and the single file covers both locales (the
 * Spanish section is listed explicitly at the end).
 *
 * Kept deliberately short. The value is an accurate index a model can follow,
 * not a second copy of the site: every page here is already fully readable in
 * server HTML.
 */
export const revalidate = 3600;

const GROUP_HEADINGS: Record<StaticRoute["group"], string> = {
  core: "Start here",
  offering: "What Viewnear does",
  proof: "Evidence and reference",
  company: "Company",
  legal: "Legal",
};

const ORDER: StaticRoute["group"][] = ["core", "offering", "proof", "company", "legal"];

function line(base: string, path: string, label: string, blurb: string): string {
  return `- [${label}](${base}${path || "/"}): ${blurb}`;
}

export async function GET() {
  const base = theme.brand.url;

  const published = { where: { status: "PUBLISHED" } } as const;
  const [services, industries, caseStudies, posts, jobs, team] = await Promise.all([
    prisma.service.findMany({ ...published, select: { slug: true, title: true, summary: true }, orderBy: { order: "asc" } }),
    prisma.industry.findMany({ ...published, select: { slug: true, name: true, headline: true }, orderBy: { order: "asc" } }),
    prisma.caseStudy.findMany({
      ...published,
      select: { slug: true, title: true, sector: true, region: true },
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      ...published,
      select: { slug: true, title: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.jobOpening.findMany({ ...published, select: { slug: true, title: true, location: true }, orderBy: { order: "asc" } }),
    prisma.teamMember.findMany({
      where: { published: true },
      select: { name: true, title: true, linkedinUrl: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const out: string[] = [];

  out.push(`# ${theme.brand.name}`);
  out.push("");
  out.push(
    `> ${theme.brand.name} is a Snowflake Premier & Select Partner and Snowflake CoCo Preferred Partner that builds data and AI practices inside enterprise teams across the USA and LATAM. Engagements run from data strategy through governed data foundations to AI use cases in production, built natively on Snowflake, delivered nearshore from Monterrey, Mexico and Austin, Texas.`,
  );
  out.push("");

  out.push("## Key facts");
  out.push("");
  out.push("- Snowflake Premier & Select Partner and Snowflake CoCo Preferred Partner, with SnowPro-certified engineers.");
  out.push(
    "- Service areas: data and AI strategy, cloud architecture and data foundation, data engineering and pipelines, AI analytics and agents, embedded analytics, capability development.",
  );
  out.push(
    "- Built on Snowflake: Openflow, dbt, Snowpark, Horizon Catalog, Cortex, Snowflake CoWork, Apache Iceberg.",
  );
  out.push("- Typical time to first production value: 8 to 16 weeks.");
  out.push("- Offices: Austin, Texas (United States) and Monterrey, Nuevo Leon (Mexico).");
  out.push("- Delivery region: United States, Canada, Mexico, Latin America and the Caribbean.");
  out.push(`- Contact: ${theme.brand.email}`);
  out.push(`- Partner listing: https://www.snowflake.com/en/why-snowflake/partners/all-partners/viewnear/`);
  out.push(`- LinkedIn: ${theme.socials.linkedin}`);
  out.push("");

  // Who is behind it, and who has written about it. An agent asked "who runs
  // Viewnear" or "has anyone covered them" had nothing to go on here.
  if (team.length) {
    out.push("## Leadership");
    out.push("");
    for (const m of team) {
      const li = m.linkedinUrl ? ` (${m.linkedinUrl})` : "";
      out.push(`- ${m.name}, ${m.title}${li}`);
    }
    out.push("");
  }

  if (PRESS.length) {
    out.push("## Press coverage");
    out.push("");
    out.push("Third-party articles quoting Viewnear. Titles and URLs are the outlets' own.");
    out.push("");
    for (const item of PRESS) {
      out.push(`- [${item.title}](${item.url}): ${getOutlet(item.outlet).name}, ${item.date}`);
    }
    out.push("");
  }

  // Static pages, grouped.
  for (const group of ORDER) {
    const rows = STATIC_ROUTES.filter((r) => r.group === group);
    if (rows.length === 0) continue;
    out.push(`## ${GROUP_HEADINGS[group]}`);
    out.push("");
    for (const r of rows) out.push(line(base, r.path, r.label, r.blurb));
    out.push("");
  }

  if (services.length) {
    out.push("## Services in detail");
    out.push("");
    for (const s of services) out.push(line(base, `/services/${s.slug}`, s.title, s.summary));
    out.push("");
  }

  if (industries.length) {
    out.push("## Industries");
    out.push("");
    for (const i of industries) out.push(line(base, `/industries/${i.slug}`, i.name, i.headline));
    out.push("");
  }

  if (caseStudies.length) {
    out.push("## Case studies");
    out.push("");
    out.push("Real engagements, anonymized at the client's request. Sector and region are accurate.");
    out.push("");
    for (const c of caseStudies) {
      out.push(line(base, `/case-studies/${c.slug}`, c.title, `${c.sector}, ${c.region}`));
    }
    out.push("");
  }

  if (posts.length) {
    out.push("## Writing");
    out.push("");
    for (const p of posts) {
      const date = p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : "";
      out.push(line(base, `/blog/${p.slug}`, p.title, date));
    }
    out.push("");
  }

  if (jobs.length) {
    out.push("## Open roles");
    out.push("");
    for (const j of jobs) out.push(line(base, `/careers/${j.slug}`, j.title, j.location ?? ""));
    out.push("");
  }

  // Spanish. Listed as paths rather than repeated blurbs: the structure mirrors
  // the English tree exactly, and every page is a full translation.
  out.push("## Espanol");
  out.push("");
  out.push(
    `Every page above also exists in Spanish under ${base}/es, as a full translation rather than a summary. For example ${base}/es/nearshore and ${base}/es/services/data-engineering.`,
  );
  out.push("");

  out.push("## Optional");
  out.push("");
  out.push(`- [Sitemap](${base}/sitemap.xml): all ${STATIC_ROUTES.length * 2} static URLs plus every detail page, in both locales`);
  out.push("");

  return new Response(out.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
