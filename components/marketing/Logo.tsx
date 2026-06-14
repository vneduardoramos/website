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
  return (
    <Image
      src="/assets/viewnear-logo.png"
      alt="Viewnear: data + ai"
      width={Math.round(height * RATIO)}
      height={height}
      priority
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
