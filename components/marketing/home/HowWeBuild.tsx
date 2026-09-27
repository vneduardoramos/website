import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { SNOWFLAKE, ANTHROPIC, type PartnerNetwork } from "@/config/partners";

/**
 * The one place on the home page where the partners are prominent.
 *
 * Everywhere else Snowflake and Claude are the how: a clause in the subhead, a
 * line of credentials, a chip on a case card. Here they carry a column each,
 * badge and all, because this is the section that answers what Viewnear
 * actually builds.
 *
 * The two halves are rendered by the same code from the same shape, so they
 * cannot drift: the badge row is a fixed height, which puts both headings on
 * one line, and the points are a ruled list rather than a card.
 */

const HALVES: { partner: PartnerNetwork; href: string }[] = [
  { partner: SNOWFLAKE, href: "/partnership/snowflake" },
  { partner: ANTHROPIC, href: "/partnership/claude" },
];

export async function HowWeBuild() {
  const t = await getTranslations("home.build");
  const columns = t.raw("columns") as { title: string; body: string; points: string[]; link: string }[];

  return (
    <Section className="section-tint">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <div className="mt-14 grid gap-12 border-t border-border lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
        {HALVES.map((half, i) => (
          <div key={half.partner.key} className={i === 0 ? "pt-10 lg:pr-14" : "pt-10 lg:pl-14"}>
            <div className="flex h-28 items-center">
              <PartnerBadgeMark partner={half.partner} size="md" />
            </div>
            <h3 className="mt-7 font-display text-2xl font-bold leading-snug text-foreground">
              {columns[i]?.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted">{columns[i]?.body}</p>
            <ul className="mt-8 divide-y divide-border border-t border-border">
              {(columns[i]?.points ?? []).map((point) => (
                <li key={point} className="py-3.5 leading-relaxed text-foreground">
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={half.href}
              className="group mt-7 inline-flex items-center gap-1.5 font-semibold text-primaryDeep"
            >
              <span className="link-underline">{columns[i]?.link}</span>
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-12 max-w-3xl border-t border-border pt-8 font-display text-xl font-medium leading-snug text-foreground md:text-2xl">
        {t("closing")}
      </p>
    </Section>
  );
}
