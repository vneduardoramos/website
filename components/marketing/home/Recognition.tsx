import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, RevealGroup } from "@/components/marketing/Motion";
import { SectionDecor } from "@/components/marketing/Decor";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { SNOWFLAKE, type PartnerBadge } from "@/config/partners";
import { PRESS, getOutlet } from "@/lib/press";
import { cn } from "@/lib/utils";

/**
 * The photograph is 1600x1200 in a 4:3 frame, so object-cover crops nothing.
 * Viewnear's logo sits at x 696-808, y 673-698, so LOGO_CENTER is 47.25% / 56.9%.
 */
const LOGO_CENTER = { left: "47.25%", top: "56.9%" } as const;

// Shared tracks so every row and the CTA share one left edge.
const ROW_GRID =
  "grid grid-cols-[6.25rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[8.125rem_minmax(0,1fr)] sm:gap-x-6";

function secondaryBadge(slug: string): PartnerBadge {
  const badge = SNOWFLAKE.secondary.find((b) => b.src.includes(slug));
  if (!badge) throw new Error(`config/partners.ts: no Snowflake secondary badge matching "${slug}"`);
  return badge;
}

const COCO = secondaryBadge("coco-preferred");
const SNOWPRO = secondaryBadge("snowpro-core");

function Shield({ badge }: { badge: PartnerBadge }) {
  return (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={badge.w}
      height={badge.h}
      unoptimized
      sizes="130px"
      className="h-[4.75rem] w-auto object-contain sm:h-24 lg:h-20 xl:h-24"
    />
  );
}

export async function Recognition() {
  const t = await getTranslations("homeServer.recognition");
  const ui = await getTranslations("sharedUi");
  const outlet = PRESS.length > 0 ? getOutlet(PRESS[0].outlet) : null;

  const rows = [
    {
      key: "tier",
      // Shift by half the Select peek so the Premier disc, not the composite, centers under the shields.
      badge: (
        <>
          <span className="flex translate-x-2.5 sm:hidden">
            <PartnerBadgeMark partner={SNOWFLAKE} size="sm" />
          </span>
          <span className="hidden sm:flex sm:translate-x-[0.8125rem]">
            <PartnerBadgeMark partner={SNOWFLAKE} size="md" />
          </span>
        </>
      ),
      name: SNOWFLAKE.level ?? SNOWFLAKE.label,
      meaning: t("ledger.tier.meaning"),
      verify: SNOWFLAKE.directoryUrl,
    },
    {
      key: "coco",
      badge: <Shield badge={COCO} />,
      name: t("ledger.coco.name"),
      meaning: t("ledger.coco.meaning"),
      verify: null,
    },
    {
      key: "snowpro",
      badge: <Shield badge={SNOWPRO} />,
      name: t("ledger.snowpro.name"),
      meaning: t("ledger.snowpro.meaning"),
      verify: null,
    },
  ];

  return (
    <section className="section relative overflow-hidden">
      <SectionDecor variant="dots" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">{t("eyebrow")}</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.1]">
              {t.rich("title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{t("intro")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <Reveal variant="left">
            <figure className="m-0">
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-soft-lg">
                <Image
                  src="/assets/images/life/partner-momentum.jpg"
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1280px) 584px, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[2.2] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{ transformOrigin: `${LOGO_CENTER.left} ${LOGO_CENTER.top}` }}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                {t("caption")}
                <span className="hidden [@media(hover:hover)]:inline">
                  {" "}
                  {t("hoverHint")}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="min-w-0">
            <RevealGroup as="ul" className="border-t border-border">
              {rows.map((row) => (
                <li key={row.key} className={cn(ROW_GRID, "items-center border-b border-border py-5 lg:py-4 xl:py-5")}>
                  <div className="flex items-center justify-center">{row.badge}</div>
                  <div className="min-w-0 max-w-xl">
                    <p className="font-display text-lg font-bold leading-snug text-foreground">{row.name}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{row.meaning}</p>
                    {row.verify && (
                      <a
                        href={row.verify}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep underline-offset-4 hover:underline"
                      >
                        {ui("partnerPlates.verify")}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </RevealGroup>
            <Reveal delay={210}>
              <div className={cn(ROW_GRID, "pt-5 lg:pt-4 xl:pt-5")}>
                <span aria-hidden="true" />
                <Link
                  href="/partnership/snowflake"
                  className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">{t("cta")}</span>
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
              {outlet && (
                <div className={cn(ROW_GRID, "mt-6")}>
                  <span aria-hidden="true" />
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                    {outlet.logo && (
                      <Image
                        src={outlet.logo}
                        alt={outlet.name}
                        width={outlet.logoWidth ?? 200}
                        height={outlet.logoHeight ?? 80}
                        unoptimized
                        sizes="48px"
                        className="h-4 w-auto"
                      />
                    )}
                    <span>{t("press.line", { outlet: outlet.name, count: PRESS.length })}</span>
                    <Link href="/press" className="group inline-flex items-center gap-1 font-semibold normal-case tracking-normal text-primaryDeep">
                      <span className="link-underline">{t("press.cta")}</span>
                      <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
