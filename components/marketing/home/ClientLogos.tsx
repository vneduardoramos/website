import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BandLogo } from "@/lib/client-bands";

/**
 * A baseline-aligned row of client logos, full color, spread across the width.
 *
 * Each logo can carry a per-logo nudge (dx/dy px) + scale, applied as a CSS
 * transform with origin bottom-center, so the default (dx:0, dy:0, scale:1)
 * reproduces the base layout while the admin can move/resize individual logos.
 * Base artwork is normalized (see scripts/normalize-client-logos.py); the
 * catalog + band config live in lib/client-bands.ts.
 */
export function LogoRow({
  logos,
  className,
}: {
  logos: BandLogo[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:justify-between md:gap-x-6",
        className,
      )}
    >
      {logos.map((c, i) => {
        const moved = c.dx !== 0 || c.dy !== 0 || c.scale !== 1;
        return (
          <Image
            key={`${c.src}-${i}`}
            src={c.src}
            alt={c.alt}
            width={c.w}
            height={c.h}
            sizes="(min-width: 768px) 16vw, 38vw"
            className="h-9 w-auto md:h-10"
            style={
              moved
                ? {
                    transform: `translate(${c.dx}px, ${c.dy}px) scale(${c.scale})`,
                    transformOrigin: "bottom center",
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
