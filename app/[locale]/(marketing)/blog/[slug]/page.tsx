import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts, getBlogSlugs } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { formatDate } from "@/lib/utils";
import { Section, Pill, CtaBand } from "@/components/marketing/ui";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { SectionDecor } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";
import { pageMeta } from "@/lib/seo";
import { getHeadings } from "@/lib/toc";
import { asStringArray } from "@/lib/utils";
import { ReadingProgress } from "@/components/marketing/article/ReadingProgress";
import { ArticleBody } from "@/components/marketing/article/ArticleBody";
import { KeyTakeaways } from "@/components/marketing/article/KeyTakeaways";
import { AuthorBio } from "@/components/marketing/article/AuthorBio";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const post = await getBlogPostBySlug(slug, locale as Locale);
  if (!post) {
    const t = await getTranslations({ locale, namespace: "blogDetail.meta" });
    return { title: t("fallbackTitle") };
  }
  return pageMeta({
    title: post.title,
    description: post.excerpt ?? undefined,
    path: `/blog/${slug}`,
    image: post.coverImageUrl,
    type: "article",
    locale,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations("blogDetail");

  const post = await getBlogPostBySlug(slug, locale as Locale);
  if (!post) notFound();

  // Estimated reading time from the markdown body.
  const wordCount = post.body ? post.body.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Real cover (admin-set) wins; otherwise fall back to the deterministic pool.
  const cover = post.coverImageUrl ?? coverFor(post.slug);
  const coverIsRemote = /^https?:\/\//i.test(cover);

  // Author: prefer the new TeamMember relation; else the legacy org byline.
  const author = post.authorTeam;
  const authorPhoto = author ? author.headshot?.url ?? author.photo : null;

  // Reading structure: section list for the TOC + optional key takeaways.
  const headings = getHeadings(post.body);
  const takeaways = asStringArray(post.keyTakeaways);

  // Related reading: 3 other recent posts (excluding the current one).
  const recent = await getBlogPosts({ take: 4 }, locale as Locale);
  const related = recent.filter((p) => p.slug !== post.slug).slice(0, 3);

  const localePath = locale === "es" ? "/es" : "";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          ...(author.linkedinUrl ? { sameAs: [author.linkedinUrl] } : {}),
        }
      : {
          "@type": post.author?.name ? "Person" : "Organization",
          name: post.author?.name ?? theme.brand.name,
        },
    publisher: {
      "@type": "Organization",
      name: theme.brand.name,
      logo: { "@type": "ImageObject", url: `${theme.brand.url}/assets/viewnear-logo.png` },
    },
    image: post.coverImageUrl
      ? coverIsRemote
        ? cover
        : `${theme.brand.url}${cover}`
      : `${theme.brand.url}${localePath}/blog/${post.slug}/opengraph-image`,
    mainEntityOfPage: `${theme.brand.url}${localePath}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <ReadingProgress />
      <section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="container-page relative pt-12 md:pt-16">
          <Breadcrumbs
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.blog"), href: "/blog" },
              { label: post.title },
            ]}
          />

          <header className="mt-8 max-w-3xl">
            {post.tags?.length ? (
              <div className="mb-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug ?? tag.name ?? String(tag)}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-primaryDeep"
                  >
                    #{tag.name ?? String(tag)}
                  </span>
                ))}
              </div>
            ) : null}
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg text-muted">{post.excerpt}</p>
            ) : null}
            {author ? (
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6">
                {authorPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authorPhoto}
                    alt={author.name}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface2 font-display text-sm font-bold uppercase text-muted">
                    {author.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-display font-semibold text-foreground">{author.name}</p>
                  {author.title ? (
                    <p className="text-sm text-muted">{author.title}</p>
                  ) : null}
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(post.publishedAt, locale as Locale)} · {t("readTime", { minutes: readingTime })}
                  </p>
                  {author.linkedinUrl ? (
                    <a
                      href={author.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                    >
                      {t("connectLinkedIn")}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="font-medium text-foreground">
                  {post.author?.name ?? "Viewnear"}
                </span>
                <span aria-hidden>·</span>
                <span>{formatDate(post.publishedAt, locale as Locale)}</span>
                <span aria-hidden>·</span>
                <span>{t("readTime", { minutes: readingTime })}</span>
              </div>
            )}
          </header>
        </div>
      </section>

      {cover ? (
        <div className="container-page mt-10">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl bg-surface2 shadow-lg md:aspect-[21/9]">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-deep/20 to-transparent" />
            <Image
              src={cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <Section className="pt-12">
        <KeyTakeaways items={takeaways} />

        <div className="mt-12">
          <ArticleBody headings={headings}>
            <Markdown>{post.body}</Markdown>
          </ArticleBody>
        </div>

        {post.tags?.length ? (
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((tag) => (
              <Pill key={tag.slug ?? tag.name ?? String(tag)}>
                {tag.name ?? String(tag)}
              </Pill>
            ))}
          </div>
        ) : null}

        <AuthorBio author={author} />
      </Section>

      {related.length ? (
        <section className="section section-warm relative overflow-hidden">
          <SectionDecor variant="grid" />
          <div className="container-page relative">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("relatedHeading")}
            </h2>
            <div className="mt-8 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <CoverCard
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  image={p.coverImageUrl ?? coverFor(p.slug)}
                  imageAlt={p.title}
                  kicker={p.tags?.[0]?.name}
                  title={p.title}
                  excerpt={p.excerpt}
                  author={
                    p.authorTeam
                      ? {
                          name: p.authorTeam.name,
                          photo: p.authorTeam.headshot?.url ?? p.authorTeam.photo,
                        }
                      : undefined
                  }
                  meta={
                    p.authorTeam
                      ? formatDate(p.publishedAt, locale as Locale)
                      : `${p.author?.name ?? "Viewnear"} · ${formatDate(p.publishedAt, locale as Locale)}`
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
