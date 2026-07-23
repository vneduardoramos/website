import type { ComponentType, SVGProps } from "react";

/**
 * Per-service "flavor": a subtle, on-brand identity so no two service pages read
 * the same. Each service gets one accent hue from the Glacier palette, a
 * decorative texture, a representative icon, and matching tile/glow/text
 * classes. Mirrors the industry flavor system (components/marketing/industries).
 *
 * Class strings are written out in full (never interpolated) so Tailwind's JIT
 * keeps them. Visual identity only (no copy), so it is safe to import anywhere.
 */

type IconProps = SVGProps<SVGSVGElement>;
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CompassIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8L8.5 15.5l2.2-4.8z" />
    </svg>
  );
}
function DatabaseIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}
function PipelineIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 6h4a3 3 0 0 1 3 3v0M7 18h4a3 3 0 0 0 3-3v0M14 10.5l3 .9M14 13.5l3-.9" />
    </svg>
  );
}
function SparkIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3c.6 3.6 1.8 4.8 5.4 5.4-3.6.6-4.8 1.8-5.4 5.4-.6-3.6-1.8-4.8-5.4-5.4 3.6-.6 4.8-1.8 5.4-5.4z" />
      <path d="M18.5 14.5c.3 1.6.8 2.1 2.4 2.4-1.6.3-2.1.8-2.4 2.4-.3-1.6-.8-2.1-2.4-2.4 1.6-.3 2.1-.8 2.4-2.4z" />
    </svg>
  );
}
function EmbedIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="m7 15 2.5-2.6 2 2L16 11" />
    </svg>
  );
}
function UsersIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4" />
      <path d="M17.2 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  );
}

export type DecorVariant = "blobs" | "dots" | "grid" | "swoosh" | "mesh" | "flow";

export interface ServiceFlavor {
  icon: ComponentType<IconProps>;
  decor: DecorVariant;
  /** icon-tile background + foreground (full static classes) */
  tile: string;
  /** thin accent bar / rule */
  bar: string;
  /** soft hero / showcase glow blob */
  glow: string;
  /** accent text for small labels + deliverable check marks */
  text: string;
  /** CSS color-token variable for the hue, drives --eyebrow-accent */
  accentVar: string;
}

// One distinct hue + texture per service. Decor variants are all six different
// so the page textures never repeat across services.
export const SERVICE_FLAVOR: Record<string, ServiceFlavor> = {
  "ai-data-strategy": {
    icon: CompassIcon,
    accentVar: "--color-royal",
    decor: "dots",
    tile: "bg-royal/10 text-royal",
    bar: "bg-royal",
    glow: "bg-royal/15",
    text: "text-royal",
  },
  "cloud-architecture": {
    icon: DatabaseIcon,
    accentVar: "--color-primary-deep",
    decor: "grid",
    tile: "bg-primaryDeep/10 text-primaryDeep",
    bar: "bg-primaryDeep",
    glow: "bg-primaryDeep/15",
    text: "text-primaryDeep",
  },
  "data-engineering": {
    icon: PipelineIcon,
    accentVar: "--color-primary-deep",
    decor: "flow",
    tile: "bg-primary/15 text-primaryDeep",
    bar: "bg-primary",
    glow: "bg-primary/15",
    text: "text-primaryDeep",
  },
  "data-visualisation": {
    icon: SparkIcon,
    accentVar: "--color-primary-deep",
    decor: "mesh",
    tile: "bg-secondary/15 text-primaryDeep",
    bar: "bg-secondary",
    glow: "bg-secondary/20",
    text: "text-primaryDeep",
  },
  "embedded-analytics": {
    icon: EmbedIcon,
    accentVar: "--color-accent-deep",
    decor: "swoosh",
    tile: "bg-accent/15 text-accentDeep",
    bar: "bg-accent",
    glow: "bg-accent/15",
    text: "text-accentDeep",
  },
  "capability-development": {
    icon: UsersIcon,
    accentVar: "--color-success",
    decor: "blobs",
    tile: "bg-success/15 text-success",
    bar: "bg-success",
    glow: "bg-success/15",
    text: "text-success",
  },
};

export const DEFAULT_SERVICE_FLAVOR: ServiceFlavor = {
  icon: DatabaseIcon,
  accentVar: "--color-primary-deep",
  decor: "dots",
  tile: "bg-primaryDeep/10 text-primaryDeep",
  bar: "bg-primaryDeep",
  glow: "bg-primaryDeep/15",
  text: "text-primaryDeep",
};

export function getServiceFlavor(slug: string): ServiceFlavor {
  return SERVICE_FLAVOR[slug] ?? DEFAULT_SERVICE_FLAVOR;
}
