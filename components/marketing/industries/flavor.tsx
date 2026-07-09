import type { ComponentType, SVGProps } from "react";

/**
 * Per-industry "flavor": a subtle, on-brand identity for each sector page,
 * a sector icon, one accent hue drawn from the Glacier palette, a decorative
 * texture chosen to echo the sector's nature, plus tailored metrics and
 * engagement bullets so no two industry pages read the same.
 *
 * Class strings are written out in full (never interpolated) so Tailwind's JIT
 * keeps them, same approach as the services page's tier meta.
 *
 * i18n note: only the NON-TEXT, visual identity (icon, decor, tile, bar, glow,
 * text, accentVar) lives here, so this module stays safe to import from the
 * client `Nav`. The localized COPY (pattern eyebrow, compliance sentence,
 * capabilities, bullets) moved into the `contentData` message catalog and is
 * read via `getFlavorText(slug, t)` by the server industry-detail page.
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

function BankIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 9.5V20M9 9.5V20M15 9.5V20M19 9.5V20" />
      <path d="M3 20h18" />
    </svg>
  );
}

function BuildingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 12h2M13 12h2M9 16h2M13 16h2" />
    </svg>
  );
}

function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 2 9l10 5 10-5-10-5z" />
      <path d="M6 11v4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4" />
      <path d="M22 9v5" />
    </svg>
  );
}

function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function FactoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" />
      <path d="M4 21V11l5 3v-3l5 3v-3l5 3v7" />
      <path d="M8 21v-3M12 21v-3M16 21v-3" />
    </svg>
  );
}

function BroadcastIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 9.2 15 12l-5 2.8z" />
    </svg>
  );
}

function ChipIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
    </svg>
  );
}

export type DecorVariant = "blobs" | "dots" | "grid" | "swoosh" | "mesh" | "flow";

export interface IndustryFlavor {
  icon: ComponentType<IconProps>;
  /** decorative texture that echoes the sector's nature */
  decor: DecorVariant;
  /** icon-tile background + foreground (full static classes) */
  tile: string;
  /** thin accent bar / left rule */
  bar: string;
  /** soft hero glow blob */
  glow: string;
  /** accent text for small labels */
  text: string;
  /** CSS color-token variable for the sector hue (e.g. "--color-amber"), used to tint eyebrows */
  accentVar: string;
}

/**
 * Localized per-sector copy, read from the `contentData` message catalog.
 * `capabilities` are always-true capability facts for the sector-level strip,
 * NOT outcome numbers: measured client results live only in the attributed
 * case-study spotlight.
 */
export interface IndustryFlavorText {
  /** sub-sectors, shown as the hero eyebrow */
  pattern: string;
  /** one-line governance/compliance note (CXO trust signal) */
  compliance: string;
  capabilities: { value: string; label: string }[];
  bullets: string[];
}

export const INDUSTRY_FLAVOR: Record<string, IndustryFlavor> = {
  "construction-real-estate": {
    icon: BuildingIcon,
    accentVar: "--color-amber",
    decor: "grid", // blueprint precision
    tile: "bg-amber/15 text-amber",
    bar: "bg-amber",
    glow: "bg-amber/15",
    text: "text-amber",
  },
  education: {
    icon: GraduationCapIcon,
    accentVar: "--color-secondary",
    decor: "mesh", // networks of learning
    tile: "bg-secondary/15 text-primaryDeep",
    bar: "bg-secondary",
    glow: "bg-secondary/20",
    text: "text-primaryDeep",
  },
  "financial-services": {
    icon: BankIcon,
    accentVar: "--color-primary-deep",
    decor: "grid", // ledger / blueprint precision
    tile: "bg-primaryDeep/15 text-primaryDeep",
    bar: "bg-primaryDeep",
    glow: "bg-primaryDeep/15",
    text: "text-primaryDeep",
  },
  manufacturing: {
    icon: FactoryIcon,
    accentVar: "--color-success",
    decor: "flow", // assembly-line flow
    tile: "bg-success/15 text-success",
    bar: "bg-success",
    glow: "bg-success/15",
    text: "text-success",
  },
  "media-entertainment-advertising": {
    icon: BroadcastIcon,
    accentVar: "--color-accent",
    decor: "swoosh", // motion & broadcast
    tile: "bg-accent/15 text-accent",
    bar: "bg-accent",
    glow: "bg-accent/15",
    text: "text-accent",
  },
  "retail-cpg": {
    icon: BagIcon,
    accentVar: "--color-purple",
    decor: "dots", // SKU grid
    tile: "bg-purple/15 text-purple",
    bar: "bg-purple",
    glow: "bg-purple/15",
    text: "text-purple",
  },
  "technology-telco": {
    icon: ChipIcon,
    accentVar: "--color-primary",
    decor: "blobs", // signal & flow
    tile: "bg-primary/15 text-primaryDeep",
    bar: "bg-primary",
    glow: "bg-primary/15",
    text: "text-primaryDeep",
  },
};

export const DEFAULT_FLAVOR: IndustryFlavor = {
  icon: BankIcon,
  accentVar: "--color-primary-deep",
  decor: "blobs",
  tile: "bg-primary/15 text-primaryDeep",
  bar: "bg-primary",
  glow: "bg-primary/15",
  text: "text-primaryDeep",
};

export function getFlavor(slug: string): IndustryFlavor {
  return INDUSTRY_FLAVOR[slug] ?? DEFAULT_FLAVOR;
}

/**
 * Localized per-sector copy for `slug`, read from the `contentData` catalog.
 * Falls back to the shared default copy when the slug has no dedicated entry
 * (mirrors `getFlavor`'s fallback). Pass a `getTranslations("contentData")`
 * (server) or `useTranslations("contentData")` (client) instance.
 */
export function getFlavorText(
  slug: string,
  t: { raw: (key: string) => unknown },
): IndustryFlavorText {
  const key = slug in INDUSTRY_FLAVOR ? slug : "default";
  return t.raw(`industryFlavor.${key}`) as IndustryFlavorText;
}
