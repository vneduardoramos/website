import { getNews } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverFor } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const revalidate = 60;

export const metadata = {
  title: "News & Events",
  description:
    "Snowflake and AI news, announcements, and events from across the Americas.",
  // News is dormant (not linked in nav/footer/sitemap); keep it out of the index.
  robots: { index: false, follow: false },
};

export default async function NewsPage() {
  const news = await getNews({});
  const [latest, ...rest] = news;

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title={<>Snowflake &amp; AI news from the <span className="text-gradient">Americas</span>.</>}
        description="Announcements, press, and events spanning Canada, the USA, Mexico, LATAM, and the Caribbean."
      />

      {news.length === 0 ? (
        <Section>
          <p className="text-muted">No news to show yet. Check back soon.</p>
        </Section>
      ) : (
        <>
          {/* Featured latest item */}
          <section className="section relative overflow-hidden">
            <SectionDecor variant="blobs" />
            <div className="container-page relative">
              <SectionHeading
                eyebrow="Latest"
                title="Fresh from the newsroom"
                intro="The most recent announcement, press mention, or event from across the Americas."
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
            <Section className="section-tint">
              <SectionHeading
                eyebrow="More updates"
                title="All news & events"
                intro="Browse the full archive of announcements, press, and upcoming events."
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
        title="Want to be the first to know?"
        subtitle="Talk to our team about upcoming Snowflake & AI events near you."
      />
    </>
  );
}
