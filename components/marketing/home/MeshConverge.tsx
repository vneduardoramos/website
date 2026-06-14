"use client";

import { useHeroConverge } from "@/components/marketing/Motion";

/**
 * Wraps the hero mesh and writes `--mesh-energy` (1→0) as the user scrolls the
 * first ~80vh, so the HeroMesh field (its `.mesh-field` layers) calms and the
 * data "converges" on the hub. Desktop-only; steady under reduced-motion/mobile.
 */
export function MeshConverge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useHeroConverge<HTMLDivElement>();
  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  );
}
