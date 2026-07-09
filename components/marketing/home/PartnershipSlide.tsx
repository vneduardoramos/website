import { useTranslations } from "next-intl";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { HeroBackground } from "@/components/marketing/HeroBackground";

/**
 * Hero carousel slide: the Snowflake partnership proof, Premier + recognized
 * in the CoCo Preferred Partner program, featured at Summit 2026. Mirrors the former
 * PartnershipHighlight section, hero-sized.
 */
export function PartnershipSlide() {
  const t = useTranslations("partnershipUi");
  return (
    <div className="relative flex min-h-[36rem] items-center overflow-hidden lg:min-h-[42rem]">
      <HeroBackground />
      <div className="container-page relative z-10 grid items-center gap-10 pt-20 pb-28 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-24">
        <div className="max-w-xl">
          <span className="chip">{t("slide.chip")}</span>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.04] tracking-tight text-foreground md:text-[3.4rem]">
            {t.rich("slide.title", {
              hl: (c) => <span className="text-gradient-accent">{c}</span>,
            })}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">
            {t.rich("slide.body", {
              hl: (c) => <span className="text-foreground">{c}</span>,
            })}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/partnership" className="btn-primary btn-lg group">
              {t("slide.ctaPrimary")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link href="/contact" className="btn-ghost btn-lg">
              {t("slide.ctaSecondary")}
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
            {t("slide.footnote")}
          </p>
        </div>

        <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft-lg">
            <Image
              src="/assets/images/certs/coco-momentum-summit-2026.png"
              alt={t("slide.imageAlt")}
              width={1500}
              height={1500}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            {t("slide.figcaption")}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
