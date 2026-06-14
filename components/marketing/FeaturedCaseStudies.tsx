import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverForSector } from "@/lib/covers";
import { getCaseStudies, safe } from "@/lib/queries";

/**
 * Self-fetching "featured work" band: a 3-up grid of case studies for any page
 * that wants proof before its CTA. Drops in with a single line (it fetches its
 * own data), like LeadershipStrip / CustomersFeature, so the host page does not
 * need to be async or wire any queries.
 */
export async function FeaturedCaseStudies({
  eyebrow = "Proof",
  title = "Real engagements, real outcomes",
  take = 3,
  tint = false,
}: {
  eyebrow?: string;
  title?: string;
  take?: number;
  tint?: boolean;
}) {
  const items = await safe(getCaseStudies({ take }), []);
  if (items.length === 0) return null;

  return (
    <Section className={tint ? "section-tint" : undefined}>
      <div className="flex items-end justify-between gap-4">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <Link
          href="/case-studies"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
        >
          View all case studies
          <span>→</span>
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
        {items.map((cs) => (
          <CoverCard
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
            imageAlt={`${cs.title}: ${cs.sector}`}
            kicker={`${cs.sector} · ${cs.region}`}
            title={cs.title}
            excerpt={cs.summary}
          />
        ))}
      </div>
    </Section>
  );
}
