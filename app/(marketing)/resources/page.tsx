import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor, coverForSector } from "@/lib/covers";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, getCaseStudies, safe } from "@/lib/queries";

export const metadata = pageMeta({
  title: "Resources: case studies & blog",
  description:
    "Case studies and blog from Viewnear, everything in one place.",
  path: "/resources",
});

export const revalidate = 60;

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
      {label}
      <span>→</span>
    </Link>
  );
}

export default async function ResourcesPage() {
  const [posts, caseStudies] = await Promise.all([
    safe(getBlogPosts({ take: 3 }), []),
    safe(getCaseStudies({ featured: true, take: 3 }), []),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Everything in <span className="text-gradient">one place</span>.
          </>
        }
        description="Proof and ideas: case studies and field notes from the Viewnear team."
      />

      {/* Case studies */}
      {caseStudies.length > 0 && (
        <Section>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Proof" title="Case studies" />
            <SeeAll href="/case-studies" label="All case studies" />
          </div>
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <CoverCard
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
                imageAlt={`${cs.title}: ${cs.sector}`}
                kicker={`${cs.sector} · ${cs.region}`}
                title={cs.title}
                excerpt={cs.summary}
                meta={cs.client?.name ? `Client: ${cs.client.name}` : undefined}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <Section className="section-tint">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="From the lab" title="Blog" />
            <SeeAll href="/blog" label="All posts" />
          </div>
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <CoverCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                image={coverFor(post.slug)}
                imageAlt={post.title}
                kicker={post.tags?.[0]?.name}
                title={post.title}
                excerpt={post.excerpt}
                meta={`${post.author?.name ?? "Viewnear"} · ${formatDate(post.publishedAt)}`}
              />
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
