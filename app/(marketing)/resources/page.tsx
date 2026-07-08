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
    "Case studies and blog from Viewnear: proof from real engagements and field notes on data & AI, all in one place.",
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
    safe(getBlogPosts({ take: 4 }), []),
    safe(getCaseStudies({ featured: true, take: 4 }), []),
  ]);

  // Lead with one study + one post; the grids below carry the rest so
  // nothing appears twice on the page.
  const featuredStudy = caseStudies[0];
  const featuredPost = posts[0];
  const restStudies = caseStudies.slice(1);
  const restPosts = posts.slice(1);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Everything in <span className="text-gradient">one place</span>.
          </>
        }
        description="Case studies from real engagements and field notes from the people who ran them. For anyone building a data & AI practice, this is what it looks like in the field."
      />

      {/* Start here: one engagement + one field note, large and side by side */}
      {(featuredStudy || featuredPost) && (
        <Section>
          <SectionHeading
            eyebrow="Start here"
            title="One engagement, one field note"
            intro="A real case study and a recent post from the team, the fastest way to see how we work."
          />
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2">
            {featuredStudy && (
              <CoverCard
                href={`/case-studies/${featuredStudy.slug}`}
                image={
                  featuredStudy.heroImage ??
                  coverForSector(featuredStudy.sector, featuredStudy.slug)
                }
                imageAlt={`${featuredStudy.title}: ${featuredStudy.sector}`}
                kicker={`Case study · ${featuredStudy.sector}`}
                title={featuredStudy.title}
                excerpt={featuredStudy.summary}
                meta={featuredStudy.client?.name ?? undefined}
              />
            )}
            {featuredPost && (
              <CoverCard
                href={`/blog/${featuredPost.slug}`}
                image={featuredPost.coverImageUrl ?? coverFor(featuredPost.slug)}
                imageAlt={featuredPost.title}
                kicker={`Blog · ${featuredPost.tags?.[0]?.name ?? "Field notes"}`}
                title={featuredPost.title}
                excerpt={featuredPost.excerpt}
                author={
                  featuredPost.authorTeam
                    ? {
                        name: featuredPost.authorTeam.name,
                        photo:
                          featuredPost.authorTeam.headshot?.url ??
                          featuredPost.authorTeam.photo,
                      }
                    : undefined
                }
                meta={
                  featuredPost.authorTeam
                    ? formatDate(featuredPost.publishedAt)
                    : `Viewnear · ${formatDate(featuredPost.publishedAt)}`
                }
              />
            )}
          </div>
        </Section>
      )}

      {/* Case studies */}
      {restStudies.length > 0 && (
        <Section>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Proof" title="Case studies" />
            <SeeAll href="/case-studies" label="All case studies" />
          </div>
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {restStudies.map((cs) => (
              <CoverCard
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
                imageAlt={`${cs.title}: ${cs.sector}`}
                kicker={`${cs.sector} · ${cs.region}`}
                title={cs.title}
                excerpt={cs.summary}
                meta={cs.client?.name ?? undefined}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Blog */}
      {restPosts.length > 0 && (
        <Section className="section-warm">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Field notes" title="Blog" />
            <SeeAll href="/blog" label="All posts" />
          </div>
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {restPosts.map((post) => (
              <CoverCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                image={post.coverImageUrl ?? coverFor(post.slug)}
                imageAlt={post.title}
                kicker={post.tags?.[0]?.name}
                title={post.title}
                excerpt={post.excerpt}
                author={
                  post.authorTeam
                    ? {
                        name: post.authorTeam.name,
                        photo: post.authorTeam.headshot?.url ?? post.authorTeam.photo,
                      }
                    : undefined
                }
                meta={
                  post.authorTeam
                    ? formatDate(post.publishedAt)
                    : `Viewnear · ${formatDate(post.publishedAt)}`
                }
              />
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
