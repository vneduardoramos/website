import Image from "next/image";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { notFound } from "next/navigation";
import { getNewsBySlug, getNews, getNewsSlugs } from "@/lib/queries";
import { formatDate, asObjectArray } from "@/lib/utils";
import { Section, SectionHeading, Pill, CtaBand } from "@/components/marketing/ui";
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

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: "News", robots: { index: false, follow: false } };
  return pageMeta({
    title: item.title,
    description: item.excerpt ?? undefined,
    path: `/news/${params.slug}`,
    image: item.coverImage,
    type: "article",
    noindex: true,
  });
}

type AgendaItem = { time: string; item: string };

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  const externalUrl = (item as { externalUrl?: string | null }).externalUrl;
  const agenda =
    item.kind === "event" ? asObjectArray<AgendaItem>(item.agenda) : [];

  // Reading structure: section list for the TOC + optional key takeaways.
  const headings = getHeadings(item.body);
  const takeaways = asStringArray(
    (item as { keyTakeaways?: unknown }).keyTakeaways,
  );

  const allNews = await getNews({});
  const more = allNews.filter((n) => n.slug !== item.slug).slice(0, 3);

  const newsLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt ?? undefined,
    datePublished: item.publishedAt ?? undefined,
    dateModified: item.updatedAt ?? item.publishedAt ?? undefined,
    publisher: {
      "@type": "Organization",
      name: theme.brand.name,
      logo: { "@type": "ImageObject", url: `${theme.brand.url}/assets/viewnear-logo.png` },
    },
    image: `${theme.brand.url}/news/${item.slug}/opengraph-image`,
    mainEntityOfPage: `${theme.brand.url}/news/${item.slug}`,
  };

  return (
    <>
      <JsonLd data={newsLd} />
      <ReadingProgress />
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-surface2">
        <SectionDecor variant="dots" />
        <div className="container-page relative py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "News & Events", href: "/news" },
                { label: item.title },
              ]}
            />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Pill>{item.kind}</Pill>
              <span className="font-mono text-xs text-muted">
                {formatDate(item.eventDate ?? item.publishedAt)}
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              {item.title}
            </h1>

            {item.excerpt ? (
              <p className="mt-5 text-lg text-muted">{item.excerpt}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Full-bleed cover image */}
      {item.coverImage ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface2 md:aspect-[3/1]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-deep/20 to-transparent" />
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <Section>
        <KeyTakeaways items={takeaways} />

        {/* Event details: venue + agenda timeline */}
        {item.kind === "event" && (item.venue || agenda.length > 0) ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="card">
              {item.venue ? (
                <p className="text-sm text-muted">
                  <span className="font-medium text-foreground">Venue:</span>{" "}
                  {item.venue}
                </p>
              ) : null}

              {agenda.length > 0 ? (
                <div className={item.venue ? "mt-6" : ""}>
                  <h2 className="eyebrow">Agenda</h2>
                  <ul className="mt-4 space-y-4">
                    {agenda.map((entry, i) => (
                      <li
                        key={i}
                        className="flex gap-4 border-l-2 border-primary/40 pl-4"
                      >
                        <span className="w-24 shrink-0 font-mono text-sm text-primary">
                          {entry.time}
                        </span>
                        <span className="text-sm text-foreground">
                          {entry.item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-10">
          <ArticleBody headings={headings}>
            <Markdown>{item.body}</Markdown>
          </ArticleBody>
        </div>

        {externalUrl ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Read the full announcement &rarr;
            </a>
          </div>
        ) : null}
      </Section>

      {/* More news */}
      {more.length > 0 ? (
        <Section className="section-tint">
          <SectionHeading eyebrow="Newsroom" title="More news & events" />
          <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {more.map((n) => (
              <CoverCard
                key={n.slug}
                href={`/news/${n.slug}`}
                image={n.coverImage ?? coverFor(n.slug)}
                imageAlt={n.title}
                kicker={n.kind}
                title={n.title}
                excerpt={n.excerpt}
                meta={formatDate(n.eventDate ?? n.publishedAt)}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
