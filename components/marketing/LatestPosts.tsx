import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, safe } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

/**
 * Self-fetching "latest from the blog" band: a 3-up grid of the most recent
 * posts. Drops in with a single line (it fetches its own data), like
 * LeadershipStrip, so the host page needs no query wiring.
 */
export async function LatestPosts({
  eyebrow,
  title,
  take = 3,
  tint = false,
}: {
  eyebrow?: string;
  title?: string;
  take?: number;
  tint?: boolean;
}) {
  const t = await getTranslations("strips");
  const locale = (await getLocale()) as Locale;
  const posts = await safe(getBlogPosts({ take }, locale), []);
  if (posts.length === 0) return null;

  return (
    <Section className={tint ? "section-tint" : undefined}>
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow={eyebrow ?? t("latestPosts.eyebrow")}
          title={title ?? t("latestPosts.title")}
        />
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
        >
          {t("latestPosts.readBlog")}
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
                ? formatDate(post.publishedAt, locale)
                : `Viewnear · ${formatDate(post.publishedAt, locale)}`
            }
          />
        ))}
      </div>
    </Section>
  );
}
