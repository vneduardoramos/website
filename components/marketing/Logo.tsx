import Image from "next/image";

// Official Viewnear logo lockup (mark + wordmark + "data + ai" slogan).
// Intrinsic 1998×251 (~7.96:1). Navy lockup, used on the site's light surfaces.
const RATIO = 1998 / 251;

/**
 * Renders the Viewnear logo. `height` controls render size; width is derived
 * from the lockup aspect ratio. `variant` is accepted for backwards
 * compatibility but no longer changes the asset (one lockup for all uses).
 */
export function Logo({
  height = 30,
  className,
}: {
  variant?: "light" | "dark" | "mark";
  height?: number;
  className?: string;
}) {
  // No style override: the width/height props already encode the exact
  // rendered size (width derived from RATIO), so next/image needs nothing
  // else to preserve the aspect ratio. A style that pins one dimension
  // (height) while leaving the other "auto" is exactly the pattern
  // next/image's own dev warning flags, even though the math here was fine.
  return (
    <Image
      src="/assets/viewnear-logo.png"
      alt="Viewnear: data + ai"
      width={Math.round(height * RATIO)}
      height={height}
      priority
      className={className}
    />
  );
}
