import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PARTNERS, SNOWFLAKE, type PartnerNetwork } from "@/config/partners";
import { AnthropicMark } from "@/components/marketing/ProviderMark";
import { cn } from "@/lib/utils";

/**
 * Partner badges, shown bare.
 *
 * Everywhere except the home page's partner band, a badge sits directly on the
 * page: no plate, no tint, no frame. Official artwork is already a designed
 * object, and putting one inside another rounded box makes it read as a card
 * about a card. The one exception is the home band, where both badges share a
 * single white rectangle laid across the indigo panel, because there the page
 * behind them is dark.
 *
 * Sizing. Snowflake's badge is a circle; Claude's (the Chip cut, square) was
 * chosen specifically to match it, so the default case needs no
 * `displayScale` correction to sit as an equal in a row. Snowflake's own
 * second tier (`stackedBadge`) layers behind the primary circle instead of
 * beside it; Claude's portrait cut (`badgeTall`) swaps in only where
 * `preferTall` is passed, the one slot it stands alone rather than paired
 * against the other network's mark.
 */
// Floors, not decoration. Both badges carry type inside them, so a size is
// only valid if the smallest words in it can be read: the Snowflake seal's
// "AI DATA CLOUD SERVICES PARTNER" ring and the lockup's "Claude Partner
// Network" line. Below roughly 80px neither survives.
// xl is the partnership hero, where the badge is the page's credential and
// carries real weight beside the headline.
const BASE_PX = { sm: 80, md: 104, lg: 128, xl: 170 } as const;
type Size = keyof typeof BASE_PX;

// How much of the back badge peeks out from behind the front one, as a
// fraction of the front badge's own size, on both axes (bottom-right).
const STACK_PEEK = 0.25;

// next/image's built-in optimizer rejects local SVGs unless the project opts
// into `dangerouslyAllowSVG` (a real risk for remote/untrusted sources, not
// worth enabling site-wide for these three trusted local files). `unoptimized`
// sidesteps the optimizer for just these images instead: Next serves the file
// from /public as-is, which an SVG already is.
const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

export function PartnerBadgeMark({
  partner,
  size = "md",
  preferTall = false,
  className,
}: {
  partner: PartnerNetwork;
  size?: Size;
  /**
   * Use `badgeTall` instead of `badge` when the partner has one. For the one
   * slot (the partnership-page hero credential) where the badge stands alone
   * rather than paired in a row against the other network's mark.
   */
  preferTall?: boolean;
  className?: string;
}) {
  const tall = preferTall ? partner.badgeTall : undefined;
  const h = Math.round(BASE_PX[size] * ((tall ?? partner.badge)?.displayScale ?? 1));

  if (tall) {
    return (
      <Image
        src={tall.src}
        alt={tall.alt}
        width={tall.w}
        height={tall.h}
        sizes={`${Math.round(h * (tall.w / tall.h))}px`}
        unoptimized={isSvg(tall.src) || undefined}
        style={{ height: h }}
        className={cn("w-auto object-contain", className)}
      />
    );
  }

  if (!partner.badge) {
    return (
      <span className={cn("inline-flex items-center gap-2 font-display font-bold text-foreground", className)}>
        {partner.key === "anthropic" && <AnthropicMark size={Math.round(h * 0.55)} />}
        {partner.label}
      </span>
    );
  }

  if (partner.stackedBadge) {
    // Two tiers, one credential: the back badge (Select) sits behind and
    // down-right of the front one (Premier), peeking out by STACK_PEEK of
    // its own size, rather than two badges shown side by side to parse
    // independently. Both are the same seal artwork (same w/h), so a plain
    // height swap keeps them round; no separate width math needed.
    const peek = Math.round(h * STACK_PEEK);
    return (
      <span
        className={cn("relative inline-block", className)}
        style={{ width: h + peek, height: h + peek }}
      >
        <Image
          src={partner.stackedBadge.src}
          alt=""
          aria-hidden="true"
          width={partner.stackedBadge.w}
          height={partner.stackedBadge.h}
          sizes={`${h}px`}
          style={{ height: h, width: h }}
          className="absolute bottom-0 right-0 rounded-full object-contain"
        />
        <Image
          src={partner.badge.src}
          alt={`${partner.badge.alt} and ${partner.stackedBadge.alt}`}
          width={partner.badge.w}
          height={partner.badge.h}
          sizes={`${h}px`}
          style={{ height: h, width: h }}
          className="absolute left-0 top-0 rounded-full object-contain ring-4 ring-background"
        />
      </span>
    );
  }

  return (
    <Image
      src={partner.badge.src}
      alt={partner.badge.alt}
      width={partner.badge.w}
      height={partner.badge.h}
      sizes={`${BASE_PX[size] * 4}px`}
      unoptimized={isSvg(partner.badge.src) || undefined}
      style={{ height: h }}
      className={cn("w-auto object-contain", className)}
    />
  );
}

export async function PartnerBadgeRow({
  size = "md",
  captions = false,
  secondary = false,
  className,
}: {
  size?: Size;
  /** Network and level under each badge, plus a verify link where one exists. */
  captions?: boolean;
  /** Also show the further Snowflake recognitions (CoCo, SnowPro), smaller. */
  secondary?: boolean;
  className?: string;
}) {
  const t = await getTranslations("sharedUi");
  return (
    <div className={className}>
      <div className={cn("flex flex-wrap items-center", captions ? "gap-x-14 gap-y-8" : "gap-x-10 gap-y-6")}>
        {PARTNERS.map((p) => (
          <div key={p.key} className={cn(captions && "min-w-0")}>
            <PartnerBadgeMark partner={p} size={size} />
            {captions && (
              <div className="mt-3 flex flex-col gap-0.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                <span>{p.network}</span>
                <span className="font-semibold text-foreground">{p.level}</span>
                {p.directoryUrl && (
                  <a
                    href={p.directoryUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-1 inline-flex w-fit items-center gap-1 font-semibold normal-case tracking-normal text-primaryDeep underline-offset-4 hover:underline"
                  >
                    {t("partnerPlates.verify")}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {secondary && SNOWFLAKE.secondary.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
          {SNOWFLAKE.secondary.map((b) => (
            <Image
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={b.w}
              height={b.h}
              sizes="160px"
              style={{ height: Math.round(BASE_PX[size] * 0.7) }}
              className="w-auto object-contain"
            />
          ))}
        </div>
      )}
    </div>
  );
}
