import Link from "next/link";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, safe } from "@/lib/queries";

/**
 * Self-fetching "latest from the blog" band: a 3-up grid of the most recent
 * posts. Drops in with a single line (it fetches its own data), like
 * LeadershipStrip, so the host page needs no query wiring.
 */
export async function LatestPosts({
  eyebrow = "From the lab",
  title = "Latest from the blog",
  take = 3,
  tint = false,
}: {
  eyebrow?: string;
  title?: string;
  take?: number;
  tint?: boolean;
}) {
  const posts = await safe(getBlogPosts({ take }), []);
  if (posts.length === 0) return null;

  return (
    <Section className={tint ? "section-tint" : undefined}>
      <div className="flex items-end justify-between gap-4">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
        >
          Read the blog
          <span>→</span>
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <CoverCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            image={post.coverImageUrl ?? coverFor(post.slug)}
            imageAlt={post.title}
            kicker={post.tags?.[0]?.name}
            title={post.title}
            excerpt={post.excerpt}
            meta={`${post.authorTeam?.name ?? "Viewnear"} · ${formatDate(post.publishedAt)}`}
          />
        ))}
      </div>
    </Section>
  );
}
