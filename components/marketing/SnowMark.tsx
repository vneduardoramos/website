import { cn } from "@/lib/utils";

/**
 * Ambient Snowflake cue: the official mark, rendered via CSS mask so it can be
 * tinted and dialed to low opacity as pure decoration (never restyled color,
 * never with copy). Kept in official Snowflake blue on light grounds and white
 * on dark. Purely decorative, so always aria-hidden.
 *
 * Source is the mark-only SVG already in /public (served static); the migrations
 * source-logo wall uses the same mask technique.
 */
const MARK = "/assets/images/providers/snowflake.svg";

export function SnowMark({
  size = 16,
  variant = "blue",
  className,
  style,
}: {
  size?: number;
  variant?: "blue" | "white";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: variant === "white" ? "#FFFFFF" : "#29B5E8",
        WebkitMaskImage: `url(${MARK})`,
        maskImage: `url(${MARK})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}

/**
 * Cue 02: an ornamental section break, the mark centered on a hairline rule.
 * Use sparingly between sections where a plain gap feels bare.
 */
export function SnowflakeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("container-page flex items-center gap-4", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <SnowMark size={18} className="opacity-40" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/**
 * Cue 04: an oversized faint watermark for a single dark band per page.
 * Absolutely positioned; drop inside a `relative overflow-hidden` parent.
 */
export function SnowWatermark({
  size = 220,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <SnowMark
      variant="white"
      size={size}
      className={cn(
        "pointer-events-none absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.06]",
        className,
      )}
    />
  );
}
