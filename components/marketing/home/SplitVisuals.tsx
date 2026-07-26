"use client";

import { useTranslations } from "next-intl";
import { Img as Image } from "@/components/marketing/Img";
import { SnowflakeIcon, CheckIcon, CpuIcon } from "@/components/marketing/home/Icons";
import { useParallax } from "@/components/marketing/Motion";

/**
 * Bespoke, on-brand SVG visuals for the home FeatureSplits, same design
 * language as the hero diagram (viewBox-scaled, Glacier palette via
 * rgb(var(--color-*)), soft glow). Replaces generic stock dashboard photos.
 */

/**
 * Kinetic-depth wrapper for a FeatureSplit's visual column: drifts the visual on
 * a small translateY tied to scroll so it separates in depth from the static
 * text column. Desktop-only / steady under reduced-motion (handled by the hook +
 * `.parallax` CSS). Keep `speed` small. Wraps within the column's box → no CLS.
 */
export function ParallaxVisual({
  children,
  speed = 0.1,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <div ref={ref} className="parallax">
      {children}
    </div>
  );
}

/**
 * Real-photo visual for a FeatureSplit: the photo sits in a framed card with a
 * soft royal glow and a subtle brand tint. Clean image, no overlays baked in.
 */
function PhotoFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-royal/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-border/70 shadow-soft-lg">
        <div className="relative aspect-[4/3] w-full">
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-royal/15 via-transparent to-secondary/10" />
        </div>
      </div>
    </div>
  );
}

/** "Data the whole business can trust": a team working from one shared, trusted set of data. */
export function FoundationPhoto() {
  const t = useTranslations("heroUi");
  return (
    <PhotoFrame
      src="/assets/images/photos/layered-data-architecture-render.jpg"
      alt={t("split.foundationPhotoAlt")}
    />
  );
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-secondary/10 blur-3xl" />
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-surface to-surface2 p-5 shadow-soft-lg sm:p-7">
        <svg viewBox="0 0 420 320" className="h-auto w-full" role="img" aria-label={label}>
          <defs>
            <radialGradient id="splitGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.22" />
              <stop offset="70%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="splitLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {children}
        </svg>
      </div>
    </div>
  );
}

/** A small "messy source" tile (a couple of uneven bars), slightly tilted. */
function SourceTile({ x, y, rotate, hue }: { x: number; y: number; rotate: number; hue: string }) {
  return (
    <g transform={`rotate(${rotate} ${x + 46} ${y + 29})`}>
      <rect x={x} y={y} width={92} height={58} rx={10} className="fill-background stroke-border" strokeWidth={1.5} />
      <rect x={x + 14} y={y + 16} width={64} height={6} rx={3} className="fill-border" />
      <rect x={x + 14} y={y + 30} width={44} height={6} rx={3} style={{ fill: `rgb(var(${hue}) / 0.5)` }} />
      <rect x={x + 14} y={y + 42} width={54} height={6} rx={3} className="fill-border" />
    </g>
  );
}

/** "Many conflicting sources → one governed source of truth." */
export function FoundationVisual() {
  const t = useTranslations("heroUi");
  const panelX = 92;
  const panelY = 196;
  const panelW = 236;
  return (
    <Frame label={t("split.foundationLabel")}>
      {/* scattered sources */}
      <SourceTile x={26} y={28} rotate={-5} hue="--color-accent" />
      <SourceTile x={164} y={18} rotate={2} hue="--color-secondary" />
      <SourceTile x={302} y={28} rotate={5} hue="--color-purple" />

      {/* connectors converging down into the governed panel */}
      {[72, 210, 348].map((sx, i) => (
        <path
          key={i}
          d={`M ${sx} 96 C ${sx} 150 210 150 210 ${panelY - 2}`}
          fill="none"
          stroke="url(#splitLine)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}

      {/* governed source-of-truth panel */}
      <circle cx={210} cy={panelY + 56} r={92} fill="url(#splitGlow)" />
      <rect x={panelX} y={panelY} width={panelW} height={104} rx={16} className="fill-surface stroke-primary" strokeWidth={2} />
      {/* header bar */}
      <rect x={panelX} y={panelY} width={panelW} height={30} rx={16} className="fill-primaryDeep/10" />
      <rect x={panelX} y={panelY + 14} width={panelW} height={16} className="fill-primaryDeep/10" />
      <rect x={panelX + 16} y={panelY + 11} width={86} height={8} rx={4} className="fill-primaryDeep" opacity={0.7} />
      {/* governed check badge */}
      <circle cx={panelX + panelW - 22} cy={panelY + 15} r={11} className="fill-primary" />
      <CheckIcon x={panelX + panelW - 30} y={panelY + 7} width={16} height={16} className="text-primary-fg" />
      {/* tidy rows */}
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x={panelX + 16} y={panelY + 46 + r * 18} width={120} height={8} rx={4} className="fill-border" />
          <rect x={panelX + panelW - 70} y={panelY + 46 + r * 18} width={54} height={8} rx={4} style={{ fill: "rgb(var(--color-secondary) / 0.55)" }} />
        </g>
      ))}

      <text x={210} y={panelY + 128} textAnchor="middle" className="fill-foreground font-display" fontSize={13} fontWeight={700}>
        {t("split.foundationText")}
      </text>
    </Frame>
  );
}

/** "Governed data → Cortex → an answer grounded in that data." */
export function AiVisual() {
  const t = useTranslations("heroUi");
  return (
    <Frame label={t("split.aiLabel")}>
      {/* governed data layer (bottom) */}
      <rect x={70} y={214} width={280} height={78} rx={14} className="fill-surface stroke-border" strokeWidth={1.5} />
      <rect x={70} y={214} width={280} height={26} rx={14} className="fill-primaryDeep/10" />
      <rect x={70} y={228} width={280} height={12} className="fill-primaryDeep/10" />
      <circle cx={94} cy={227} r={8} className="fill-primary" />
      <CheckIcon x={88} y={221} width={12} height={12} className="text-primary-fg" />
      <text x={112} y={231} className="fill-primaryDeep font-mono" fontSize={9} letterSpacing={0.5}>{t("split.governedData")}</text>
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={88} y={252 + r * 16} width={150} height={7} rx={3.5} className="fill-border" />
          <rect x={250} y={252 + r * 16} width={84} height={7} rx={3.5} style={{ fill: "rgb(var(--color-secondary) / 0.5)" }} />
        </g>
      ))}

      {/* connector up to the Cortex node */}
      <path d="M 210 214 C 210 180 210 170 210 150" fill="none" stroke="url(#splitLine)" strokeWidth={2} strokeLinecap="round" />

      {/* Cortex node */}
      <circle cx={210} cy={104} r={62} fill="url(#splitGlow)" />
      <circle cx={210} cy={104} r={40} className="fill-surface stroke-primary" strokeWidth={2} />
      <SnowflakeIcon x={210 - 16} y={104 - 16} width={32} height={32} className="text-primaryDeep" />

      {/* grounded-answer card */}
      <g>
        <rect x={250} y={36} width={140} height={66} rx={12} className="fill-background stroke-border" strokeWidth={1.5} />
        <rect x={264} y={50} width={96} height={7} rx={3.5} className="fill-foreground" opacity={0.75} />
        <rect x={264} y={64} width={112} height={7} rx={3.5} className="fill-border" />
        <g transform="translate(264 80)">
          <rect x={0} y={0} width={70} height={14} rx={7} className="fill-primary/15" />
          <CpuIcon x={5} y={1} width={12} height={12} className="text-primaryDeep" />
          <text x={22} y={10} className="fill-primaryDeep font-mono" fontSize={7.5} letterSpacing={0.3}>{t("split.grounded")}</text>
        </g>
      </g>
    </Frame>
  );
}
