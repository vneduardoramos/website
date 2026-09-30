import Image from "next/image";

// Official Viewnear logo lockup (mark + wordmark + "data + ai" slogan).
// Intrinsic 1987×242 (~8.21:1). Navy lockup, used on the site's light surfaces.
//
// Cropped from the file as supplied (1998×251, kept beside it as
// viewnear-logo-original.png), which padded the visible mark asymmetrically:
// 5px left vs 16px right, 26px top vs 17px bottom. A flex container centers
// the whole canvas, padding included, so that asymmetry read as the logo
// itself sitting slightly left- and down-shifted everywhere it appears,
// nav and footer alike. This crop trims the excess from the wider side on
// each axis (11px off the right, 9px off the top) so the canvas margins are
// exactly symmetric (5px/5px, 17px/17px) and the visible glyph centers
// correctly in any container that centers the image.
const RATIO = 1987 / 242;

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
