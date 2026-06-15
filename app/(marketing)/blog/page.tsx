import Link from "next/link";
import { getBlogPosts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Section } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { CtaBand } from "@/components/marketing/ui";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const metadata = pageMeta({
  title: "Blog: field notes on Snowflake, data & AI",
  description:
    "Field notes, ideas, and practical guides on Snowflake, data engineering, and AI from the Viewnear team, straight from the lab.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts({});
  const [featured, ...rest] = posts;

  // Collect unique tags across all posts for the topic chip row.
  const tagMap = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const slug = tag.slug ?? tag.name;
      if (slug && !tagMap.has(slug)) tagMap.set(slug, tag.name ?? slug);
    }
  }
  const uniqueTags = Array.from(tagMap.entries());

  return (
    <>
      <section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <PageHero
            eyebrow="Blog"
            title={<>Straight from the <span className="text-gradient">lab</span>.</>}
            description="Notes, ideas, and field reports on data, AI, and the modern Snowflake stack."
          >
            {uniqueTags.length ? (
              <div className="flex flex-wrap justify-center gap-2">
                {uniqueTags.map(([slug, name]) => (
                  <span key={slug} className="pill-chip">
                    #{name}
                  </span>
                ))}
              </div>
            ) : null}
          </PageHero>
        </div>
      </section>

      {featured ? (
        <Section className="pt-4">
          <CoverCard
            href={`/blog/${featured.slug}`}
            image={featured.coverImageUrl ?? coverFor(featured.slug)}
            imageAlt={featured.title}
            kicker={featured.tags?.[0]?.name ?? "Featured"}
            title={featured.title}
            excerpt={featured.excerpt}
            author={
              featured.authorTeam
                ? {
                    name: featured.authorTeam.name,
                    photo: featured.authorTeam.headshot?.url ?? featured.authorTeam.photo,
                  }
                : undefined
            }
            meta={
              featured.authorTeam
                ? formatDate(featured.publishedAt)
                : `${featured.author?.name ?? "Viewnear"} · ${formatDate(featured.publishedAt)}`
            }
            featured
          />
        </Section>
      ) : null}

      <section className="section section-tint relative overflow-hidden">
        <WaveDivider position="top" fill="fill-background" />
        <SectionDecor variant="grid" />
        <div className="container-page relative">
          {rest.length ? (
            <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
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
                      : `${post.author?.name ?? "Viewnear"} · ${formatDate(post.publishedAt)}`
                  }
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted">No posts yet. Check back soon.</p>
          ) : null}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
