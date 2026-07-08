import { cn } from "@/lib/utils";

/**
 * A model-provider brand glyph (Simple Icons mark), rendered via CSS mask so it
 * can be shown monochrome (inherits `currentColor`) or "lit" in the provider's
 * brand color. Purely decorative, so always aria-hidden. Mirrors the SnowMark
 * technique; used for the "estate stays open" model row and the Anthropic mark.
 */
export function ProviderMark({
  src,
  color,
  size = 20,
  lit = false,
  className,
  style,
}: {
  src: string;
  color?: string;
  size?: number;
  /** When true, fill in the brand `color`; otherwise inherit currentColor. */
  lit?: boolean;
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
        backgroundColor: lit && color ? color : "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
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

/** Anthropic's mark in its clay brand color, for the "Built with Anthropic" cues. */
export function AnthropicMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <ProviderMark
      src="/assets/images/providers/anthropic.svg"
      color="#D97757"
      lit
      size={size}
      className={className}
    />
  );
}
