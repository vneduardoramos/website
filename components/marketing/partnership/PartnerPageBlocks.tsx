import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading, CaseStudyCard } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { SectionDecor } from "@/components/marketing/Decor";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { getCaseStudies } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import type { PartnerNetwork } from "@/config/partners";
import { cn } from "@/lib/utils";

/**
 * The shared skeleton of the two partnership pages, so Snowflake and Claude
 * are told in the same shape and a reader can compare them: the hero with
 * the network's plate and level, two numbered ways the partnership is put to
 * work, what it looks like in practice, what Viewnear engineers around the
 * partner's product, the people, and a hand-off to the other partnership.
 * Each page supplies its own copy from its own namespace; nothing here is
 * specific to either partner.
 */

/**
 * A point in a ruled list: a heading and a paragraph over a hairline, never a
 * tile. The site tried a shared primitive for this once and the card-shaped
 * result was rejected, so the two partnership pages keep their own, used
 * nowhere else.
 */
export type PartnerPoint = { title: string; body?: string };

function PointGrid({
  items,
  cols,
  numbered = false,
  className,
}: {
  items: PartnerPoint[];
  cols: 2 | 3;
  /** Number the points only when they are genuinely a sequence. */
  numbered?: boolean;
  className?: string;
}) {
  return (
    <RevealGroup
      className={cn(
        "grid gap-x-10 gap-y-8 border-t border-border",
        cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      variant="fade-up"
    >
      {items.map((it, i) => (
        <div key={it.title} className="pt-6">
          {numbered && (
            <span
              className="font-mono text-sm font-semibold tracking-widest text-primaryDeep"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <h3
            className={cn(
              "font-display font-bold leading-snug text-foreground",
              numbered && "mt-3",
              cols === 3 ? "text-lg" : "text-xl",
            )}
          >
            {it.title}
          </h3>
          {it.body && <p className="mt-3 leading-relaxed text-muted">{it.body}</p>}
        </div>
      ))}
    </RevealGroup>
  );
}

export function PartnerHero({
  partner,
  eyebrow,
  kicker,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  verify,
}: {
  /** Omit where the page already says the credential in words and a badge would only repeat it. */
  partner?: PartnerNetwork;
  eyebrow: string;
  kicker: string;
  title: React.ReactNode;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  verify?: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <SectionDecor variant="grid" />
      <div className="relative">
        <PageHero
          eyebrow={eyebrow}
          align="left"
          title={
            <>
              <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                {kicker}
              </span>
              {title}
            </>
          }
          description={description}
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary btn-lg group">
              {ctaPrimary}
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
            <Link href="/case-studies" className="btn-ghost btn-lg">
              {ctaSecondary}
            </Link>
          </div>
        </PageHero>
        {/* The badge sits on the hero's right on wide screens, the credential shown, not typed. */}
        {partner && (
          <div className="container-page pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-end lg:flex">
            <div className="pointer-events-auto w-fit max-w-64 xl:max-w-96">
              {/* One size down at lg, where the headline runs close to the badge. */}
              <span className="block xl:hidden">
                <PartnerBadgeMark partner={partner} size="lg" />
              </span>
              <span className="hidden xl:block">
                <PartnerBadgeMark partner={partner} size="xl" />
              </span>
              <div className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                <div>{partner.network}</div>
                <div className="mt-1 font-semibold text-foreground">{partner.level}</div>
                {partner.directoryUrl && (
                  <a
                    href={partner.directoryUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-1 font-semibold normal-case tracking-normal text-primaryDeep underline-offset-4 hover:underline"
                  >
                    {verify}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TwoWays({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: PartnerPoint[];
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <PointGrid items={items} cols={2} numbered className="mt-12" />
    </Section>
  );
}

/** Two cards: real case studies by slug, and an optional non-case card (a service). */
export async function InPractice({
  eyebrow,
  title,
  slugs,
  locale,
  extra,
}: {
  eyebrow: string;
  title: string;
  slugs: string[];
  locale: string;
  extra?: { eyebrow: string; title: string; body: string; cta: string; href: string };
}) {
  const all = await getCaseStudies(undefined, locale as Locale);
  const cases = slugs.map((s) => all.find((c) => c.slug === s)).filter(Boolean) as typeof all;
  return (
    <Section className="section-tint relative overflow-hidden">
      <SectionDecor variant="dots" />
      <div className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {cases.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
          {extra && (
            <Link href={extra.href} className="card card-hover group flex h-full flex-col bg-background">
              <span className="pill-chip self-start">{extra.eyebrow}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{extra.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{extra.body}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primaryDeep">
                <span className="link-underline">{extra.cta}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </span>
            </Link>
          )}
        </RevealGroup>
      </div>
    </Section>
  );
}

export function AroundIt({
  eyebrow,
  title,
  intro,
  items,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  items: PartnerPoint[];
  className?: string;
}) {
  return (
    <Section className={className}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <PointGrid items={items} cols={3} className="mt-12" />
    </Section>
  );
}

export async function Leaders({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  const t = await getTranslations("strips");
  return (
    <Section className="section-warm relative overflow-hidden">
      <SectionDecor variant="grid" />
      <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <SectionHeading eyebrow={eyebrow} title={title} intro={body} />
        <LeadershipStrip label={t("leadershipStrip.label")} />
      </div>
    </Section>
  );
}

export function OtherHalf({ title, label, href }: { title: string; label: string; href: string }) {
  return (
    <Section>
      <div className={cn("mx-auto flex max-w-3xl flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center")}>
        <p className="font-display text-lg font-bold text-foreground">{title}</p>
        <Link href={href} className="btn-ghost group shrink-0">
          {label}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  );
}

export function hl(c: React.ReactNode) {
  return (
    <ScrollHighlight color="cyan">
      <span className="text-gradient">{c}</span>
    </ScrollHighlight>
  );
}
