import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor, coverForSector } from "@/lib/covers";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, getCaseStudies, safe } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resources.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/resources", locale });
}

export const revalidate = 60;

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
      {label}
      <span>→</span>
    </Link>
  );
}

export default async function ResourcesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");

  const [posts, caseStudies] = await Promise.all([
    safe(getBlogPosts({ take: 4 }, locale as Locale), []),
    safe(getCaseStudies({ featured: true, take: 4 }, locale as Locale), []),
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
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      />

      {/* Start here: one engagement + one field note, large and side by side */}
      {(featuredStudy || featuredPost) && (
        <Section>
          <SectionHeading
            eyebrow={t("startHere.eyebrow")}
            title={t("startHere.title")}
            intro={t("startHere.intro")}
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
                kicker={t("startHere.caseKicker", { sector: featuredStudy.sector })}
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
                kicker={t("startHere.blogKicker", {
                  tag: featuredPost.tags?.[0]?.name ?? t("startHere.fieldNotesFallback"),
                })}
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
                    ? formatDate(featuredPost.publishedAt, locale as Locale)
                    : `Viewnear · ${formatDate(featuredPost.publishedAt, locale as Locale)}`
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
            <SectionHeading eyebrow={t("caseStudies.eyebrow")} title={t("caseStudies.title")} />
            <SeeAll href="/case-studies" label={t("caseStudies.seeAll")} />
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
            <SectionHeading eyebrow={t("blog.eyebrow")} title={t("blog.title")} />
            <SeeAll href="/blog" label={t("blog.seeAll")} />
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
                    ? formatDate(post.publishedAt, locale as Locale)
                    : `Viewnear · ${formatDate(post.publishedAt, locale as Locale)}`
                }
              />
            ))}
          </div>
        </Section>
      )}

      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
