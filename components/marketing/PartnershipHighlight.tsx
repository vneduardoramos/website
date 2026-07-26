import { getTranslations } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { SnowflakeLockup } from "@/components/marketing/SnowflakeLockup";
import { SectionDecor } from "@/components/marketing/Decor";

const STAT_VALUES = ["14,000+", "41", "2"];

/**
 * Prominent partnership proof block: the official badges (large), the facts, the
 * CoCo Preferred Partner keynote slide, and stat tiles. Reused on home,
 * About, and the Partnership page (`showCta` adds a link to /partnership).
 */
export async function PartnershipHighlight({
  title,
  showCta = false,
}: {
  title?: string;
  showCta?: boolean;
}) {
  const t = await getTranslations("partnershipUi");
  const heading = title ?? t("highlight.title");
  const statLabels = t.raw("highlight.stats") as string[];
  return (
    <section className="section section-tint relative overflow-hidden">
      <SectionDecor variant="grid" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-3">{t("highlight.eyebrow")}</p>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.1]">
            {heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {t.rich("highlight.body", {
              strong: (c) => <strong className="font-semibold text-foreground">{c}</strong>,
            })}
          </p>

          <SnowflakeLockup variant="default" height={30} className="mt-8" />

          <div className="mt-6">
            <PartnerBadges variant="logos" />
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            {STAT_VALUES.map((value, i) => (
              <div key={value} className="rounded-2xl border border-border bg-background p-4">
                <dt className="font-display text-xl font-bold text-foreground md:text-2xl">
                  {value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{statLabels[i]}</dd>
              </div>
            ))}
          </dl>

          {showCta && (
            <Link href="/partnership" className="btn-primary group mt-8">
              {t("highlight.cta")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>

        <figure className="relative">
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft-lg">
            <Image
              src="/assets/images/certs/coco-momentum-summit-2026.png"
              alt={t("highlight.imageAlt")}
              width={1500}
              height={1500}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            {t("highlight.figcaption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
