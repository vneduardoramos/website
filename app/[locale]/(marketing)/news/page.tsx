import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { getNews } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "news.meta" });
  // News is dormant (not linked in nav/footer/sitemap); keep it out of the index.
  return pageMeta({ title: t("title"), description: t("description"), path: "/news", noindex: true, locale });
}

export default async function NewsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const news = await getNews({});
  const [latest, ...rest] = news;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
        description={t("hero.description")}
      />

      {news.length === 0 ? (
        <Section>
          <p className="text-muted">{t("empty")}</p>
        </Section>
      ) : (
        <>
          {/* Featured latest item */}
          <section className="section relative overflow-hidden">
            <SectionDecor variant="blobs" />
            <div className="container-page relative">
              <SectionHeading
                eyebrow={t("latest.eyebrow")}
                title={t("latest.title")}
                intro={t("latest.intro")}
              />
              <div className="mt-10">
                <CoverCard
                  href={`/news/${latest.slug}`}
                  image={latest.coverImage ?? coverFor(latest.slug)}
                  imageAlt={latest.title}
                  kicker={latest.kind}
                  title={latest.title}
                  excerpt={latest.excerpt}
                  meta={formatDate(latest.eventDate ?? latest.publishedAt)}
                  featured
                />
              </div>
            </div>
            <WaveDivider position="bottom" fill="fill-surface2" />
          </section>

          {/* Rest of the items */}
          {rest.length > 0 ? (
            <Section className="section-warm">
              <SectionHeading
                eyebrow={t("more.eyebrow")}
                title={t("more.title")}
                intro={t("more.intro")}
              />
              <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <CoverCard
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    image={item.coverImage ?? coverFor(item.slug)}
                    imageAlt={item.title}
                    kicker={item.kind}
                    title={item.title}
                    excerpt={item.excerpt}
                    meta={formatDate(item.eventDate ?? item.publishedAt)}
                  />
                ))}
              </div>
            </Section>
          ) : null}
        </>
      )}

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
