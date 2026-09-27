import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBlogPosts, getCaseStudies } from "@/lib/queries";
import { coverFor, coverForSector } from "@/lib/covers";
import { formatDate } from "@/lib/utils";
import { CoverCard } from "@/components/marketing/CoverCard";
import { Reveal } from "@/components/marketing/Motion";
import { RandomThree } from "@/components/marketing/home/RandomThree";
import type { Locale } from "@/lib/i18n-content";

/**
 * "Insights": the two proof archives, blog and case studies, drawn from at
 * random rather than as two separate sections. A reader who scrolls this far
 * has already seen the featured case in Customers; this is the rest of the
 * shelf, and a random three keeps a returning visitor from seeing the same
 * home page every time.
 *
 * The pool (up to four of each) is fetched and rendered server-side, so every
 * card carries a real translation and a real next/image; a client component
 * only ever chooses which three of the pool are visible, and only after
 * mount, which is what makes the pick vary per page load despite the route's
 * own revalidate window.
 */
export async function Insights({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.insights");
  const [posts, cases] = await Promise.all([
    getBlogPosts({ take: 4 }, locale),
    getCaseStudies({ take: 4 }, locale),
  ]);
  if (posts.length === 0 && cases.length === 0) return null;

  const cards = [
    ...posts.map((post) => ({
      key: `blog-${post.slug}`,
      node: (
        <CoverCard
          href={`/blog/${post.slug}`}
          image={post.coverImageUrl ?? coverFor(post.slug)}
          imageAlt={post.title}
          kicker={t("kickerBlog")}
          title={post.title}
          excerpt={post.excerpt}
          meta={formatDate(post.publishedAt, locale)}
        />
      ),
    })),
    ...cases.map((cs) => ({
      key: `case-${cs.slug}`,
      node: (
        <CoverCard
          href={`/case-studies/${cs.slug}`}
          image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
          imageAlt={cs.title}
          kicker={t("kickerCase")}
          title={cs.title}
          excerpt={cs.summary}
          meta={`${cs.sector} · ${cs.region}`}
        />
      ),
    })),
  ];

  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{t("eyebrow")}</p>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("title")}
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
              <Link href="/blog" className="group inline-flex items-center gap-1 font-semibold text-primaryDeep">
                <span className="link-underline">{t("viewBlog")}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
              <Link href="/case-studies" className="group inline-flex items-center gap-1 font-semibold text-primaryDeep">
                <span className="link-underline">{t("viewCases")}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-12">
            {cards.length <= 3 ? (
              <div className="grid gap-6 md:auto-rows-fr md:grid-cols-3">
                {cards.map((c) => (
                  <div key={c.key} className="h-full">
                    {c.node}
                  </div>
                ))}
              </div>
            ) : (
              <RandomThree cards={cards} />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
