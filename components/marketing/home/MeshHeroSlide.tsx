"use client";

import { Img as Image } from "@/components/marketing/Img";
import Link from "next/link";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { HeroMesh } from "@/components/marketing/home/HeroMesh";
import { MeshConverge } from "@/components/marketing/home/MeshConverge";
import { useParallax } from "@/components/marketing/Motion";

const PILLS = [
  "Migrate & modernize",
  "Govern with Horizon Catalog",
  "Build with Cortex AI",
];

// Official Snowflake badges, spread in a large triangle over the mesh.
const BADGES = [
  { src: "/assets/images/certs/premier.webp", alt: "Snowflake Premier Partner badge", w: 460, h: 460 },
  { src: "/assets/images/certs/coco-preferred.png", alt: "Snowflake CoCo Preferred Partner badge", w: 1910, h: 1572 },
  { src: "/assets/images/certs/snowpro-core.png", alt: "SnowPro Core certification badge", w: 487, h: 402 },
];
// Positions (% of the hero): a tighter triangle around the hub.
const BADGE_POS = [
  "left-[63%] top-[34%]", // Premier, top left
  "left-[78%] top-[33%]", // CoCo, top right
  "left-[71%] top-[61%]", // SnowPro, bottom center
];

/**
 * Hero carousel slide: the living network-mesh visual spanning the slide edge to
 * edge, headline overlaid on the left, certification badges in a triangle over
 * the mesh on the right.
 */
export function MeshHeroSlide({ subhead }: { subhead?: string }) {
  const sub =
    subhead ||
    "Whether you're migrating off a legacy warehouse, scaling a governed lakehouse, or grounding AI agents in real business context, our certified team helps you move faster and get it right the first time, across the Americas.";

  // Kinetic depth: the mesh (deepest layer) drifts slowly, the badge cluster
  // (floating above) drifts faster, so they separate in depth as the hero
  // scrolls. Desktop-only / steady under reduced-motion (handled by the hook).
  // Headline copy stays static. Both layers stay inside the clipped hero box.
  const meshRef = useParallax<HTMLDivElement>(0.06);
  const badgeRef = useParallax<HTMLDivElement>(0.14);

  return (
    <div className="relative flex min-h-[36rem] items-center overflow-hidden lg:min-h-[42rem]">
      <HeroBackground />

      {/* Full-bleed living mesh spanning the slide, behind the message.
          MeshConverge calms the field as the hero scrolls away; the parallax
          wrapper layers depth-drift on top without touching the convergence. */}
      <div ref={meshRef} className="parallax pointer-events-none absolute inset-0">
        <MeshConverge className="absolute inset-0">
          <HeroMesh />
        </MeshConverge>
      </div>
      {/* Left scrim so the headline stays legible over the mesh. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent lg:via-background/55"
        aria-hidden
      />

      {/* Certification badges in a triangle over the right of the mesh (desktop);
          drifts faster than the mesh for depth separation. */}
      <div
        ref={badgeRef}
        className="parallax pointer-events-none absolute inset-0 z-10 hidden lg:block"
        aria-hidden
      >
        {BADGES.map((b, i) => (
          <div
            key={b.src}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${BADGE_POS[i]}`}
          >
            <Image
              src={b.src}
              alt={b.alt}
              width={b.w}
              height={b.h}
              className="h-36 w-auto drop-shadow-[0_12px_30px_rgba(15,37,48,0.2)] xl:h-44"
            />
          </div>
        ))}
      </div>

      <div className="container-page relative z-10 pt-20 pb-28 md:pt-24 lg:pb-24">
        <div className="max-w-xl">
          <span className="chip">Snowflake Premier Partner · CoCo Preferred Partner</span>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.04] tracking-tight text-foreground md:text-[3.6rem]">
            Make Snowflake <span className="text-gradient-accent">do more</span>, from strategy to AI.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{sub}</p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {PILLS.map((p) => (
              <span key={p} className="pill-tag">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary btn-lg group">
              Start a conversation
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link href="/services" className="btn-ghost btn-lg">
              Explore services
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
            SnowPro-certified team · Americas-focused delivery
          </p>

          {/* Badges on mobile/tablet: a centered row beneath the copy, with the
              Premier Partner badge larger in the middle and the other two
              flanking it left and right. The desktop triangle overlay (lg+) is
              hidden here, and this row is hidden there, so badges show on every
              breakpoint. BADGES = [premier, coco, snowpro]. */}
          <div className="mt-8 flex w-full items-center justify-between gap-3 lg:hidden">
            <Image
              src={BADGES[2].src}
              alt={BADGES[2].alt}
              width={BADGES[2].w}
              height={BADGES[2].h}
              className="h-auto w-[29%] drop-shadow-[0_8px_20px_rgba(15,37,48,0.18)]"
            />
            <Image
              src={BADGES[0].src}
              alt={BADGES[0].alt}
              width={BADGES[0].w}
              height={BADGES[0].h}
              className="h-auto w-[37%] drop-shadow-[0_12px_28px_rgba(15,37,48,0.22)]"
            />
            <Image
              src={BADGES[1].src}
              alt={BADGES[1].alt}
              width={BADGES[1].w}
              height={BADGES[1].h}
              className="h-auto w-[29%] drop-shadow-[0_8px_20px_rgba(15,37,48,0.18)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
