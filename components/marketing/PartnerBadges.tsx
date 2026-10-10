/**
 * Partner credentials as chips, cards or a logo row. Reads everything from
 * config/partners.ts, so this file holds no partner facts of its own.
 *
 * `chips`: compact pill row (default). `logos`: the official artwork.
 * All variants show artwork bare: no plate, no frame. For the network with
 * its network and level beneath, use PartnerBadgeRow.
 */
import Image from "next/image";
import { PARTNERS, SNOWFLAKE, type PartnerNetwork } from "@/config/partners";
import { PartnerBadgeMark } from "@/components/marketing/PartnerBadgeRow";
import { cn } from "@/lib/utils";

type Credential = { label: string; partner: PartnerNetwork["key"] };

const CREDENTIALS: readonly Credential[] = [
  { label: SNOWFLAKE.label, partner: "snowflake" },
  { label: "Snowflake CoCo Preferred Partner", partner: "snowflake" },
];

/** Flat labels, for callers that only need the text. */
export const CERTIFICATIONS: readonly string[] = CREDENTIALS.map((c) => c.label);

function SnowflakeMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M2 12h20" />
      <path d="M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </svg>
  );
}

export function PartnerBadges({
  variant = "chips",
  size = "lg",
  only,
  className = "",
}: {
  variant?: "chips" | "logos";
  size?: "sm" | "lg";
  /** Show one network's credentials only. Omit for the default (all). */
  only?: PartnerNetwork["key"];
  className?: string;
}) {
  const credentials = CREDENTIALS.filter((c) => !only || c.partner === only);
  if (variant === "logos") {
    // Bare artwork, no frame. Routed through PartnerBadgeMark (not a plain
    // <Image> per badge) so Snowflake's Premier/Select stack renders here
    // exactly as it does everywhere else the primary badge shows, with one
    // definition of what "the Snowflake badge" looks like.
    const base = size === "sm" ? 80 : 128;
    const mainPartners = PARTNERS.filter((p) => !only || p.key === only);
    const secondaryBadges = !only || only === "snowflake" ? SNOWFLAKE.secondary : [];
    return (
      <div className={cn("flex flex-wrap items-center gap-x-8 gap-y-5", className)}>
        {mainPartners.map((p) => (
          <PartnerBadgeMark key={p.key} partner={p} size={size} />
        ))}
        {secondaryBadges.map((b) => (
          <Image
            key={b.src}
            src={b.src}
            alt={b.alt}
            width={b.w}
            height={b.h}
            sizes={size === "sm" ? "160px" : "320px"}
            style={{ height: Math.round(base * 0.7) }}
            className="w-auto object-contain"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {credentials.map((c) => (
        <span
          key={c.label}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-4 py-1.5 text-sm font-medium text-primaryDeep"
        >
          <SnowflakeMark />
          {c.label}
        </span>
      ))}
    </div>
  );
}
