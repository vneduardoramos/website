/**
 * Snowflake certification badges: the single source for Viewnear's partner
 * status. Used on home, About, the Partnership page, and the footer.
 */
import Image from "next/image";
import { cn } from "@/lib/utils";

export const CERTIFICATIONS = [
  "Snowflake Premier Partner",
  "Snowflake CoCo Preferred Partner",
] as const;

// Official Snowflake partner + certification badge artwork.
const BADGE_IMAGES = [
  { src: "/assets/images/certs/premier.webp", alt: "Snowflake Premier Partner badge", w: 460, h: 460 },
  { src: "/assets/images/certs/coco-preferred.png", alt: "Snowflake CoCo Preferred Partner badge", w: 1910, h: 1572 },
  { src: "/assets/images/certs/snowpro-core.png", alt: "SnowPro Core certification badge", w: 487, h: 402 },
];

function SnowflakeMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M2 12h20" />
      <path d="M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </svg>
  );
}

/**
 * `chips`: compact pill row (default). `cards`: larger badge cards for the
 * Partnership page. `logos`: the official badge artwork.
 */
export function PartnerBadges({
  variant = "chips",
  size = "lg",
  className = "",
}: {
  variant?: "chips" | "cards" | "logos";
  size?: "sm" | "lg";
  className?: string;
}) {
  const items = [...CERTIFICATIONS];

  // Real Snowflake badge artwork (Premier circle + CoCo shield), at a fixed height.
  if (variant === "logos") {
    const h = size === "sm" ? "h-14" : "h-28";
    return (
      <div className={cn("flex flex-wrap items-center gap-x-8 gap-y-5", className)}>
        {BADGE_IMAGES.map((b) => (
          <Image
            key={b.src}
            src={b.src}
            alt={b.alt}
            width={b.w}
            height={b.h}
            className={cn(h, "w-auto")}
          />
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
        {CERTIFICATIONS.map((c) => (
          <div key={c} className="card flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primaryDeep">
              <SnowflakeMark className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-foreground">{c}</p>
              <p className="mt-0.5 text-sm text-muted">Verified Snowflake partner status</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-4 py-1.5 text-sm font-medium text-primaryDeep"
        >
          <SnowflakeMark />
          {c}
        </span>
      ))}
    </div>
  );
}
