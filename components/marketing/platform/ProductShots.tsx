import { Img as Image } from "@/components/marketing/Img";
import { RevealGroup } from "@/components/marketing/Motion";
import { getTranslations } from "next-intl/server";

/**
 * Real screens from our build environments (not mockups, not stock): the
 * business surface (CoWork), the engineering (a semantic view in Workspaces),
 * and governance made visible (Horizon Catalog). Each in a quiet browser
 * frame with a captioned takeaway.
 */

const SHOTS = [
  {
    key: "cowork",
    src: "/assets/images/product/cowork-home.webp",
    w: 1920,
    h: 860,
    wide: true,
  },
  {
    key: "workspaces",
    src: "/assets/images/product/workspaces-build.png",
    w: 2466,
    h: 1216,
    wide: false,
  },
  {
    key: "catalog",
    src: "/assets/images/product/catalog-governance.png",
    w: 1210,
    h: 766,
    wide: false,
  },
];

export async function ProductShots() {
  const t = await getTranslations("platformUi");
  return (
    <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" variant="fade-up">
      {SHOTS.map((s) => (
        <figure key={s.src} className={s.wide ? "md:col-span-2" : undefined}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <div aria-hidden className="flex items-center gap-1.5 border-b border-border bg-surface2 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-red/70" />
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="h-2 w-2 rounded-full bg-success/80" />
            </div>
            <Image
              src={s.src}
              alt={t(`productShots.${s.key}.alt`)}
              width={s.w}
              height={s.h}
              sizes={s.wide ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 50vw"}
              className="w-full"
            />
          </div>
          <figcaption className="mt-3 px-1">
            <span className="font-display text-sm font-bold text-foreground">{t(`productShots.${s.key}.caption`)}.</span>{" "}
            <span className="text-sm text-muted">{t(`productShots.${s.key}.detail`)}</span>
          </figcaption>
        </figure>
      ))}
    </RevealGroup>
  );
}
