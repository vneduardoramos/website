import type { ComponentType, SVGProps } from "react";

/**
 * Per-industry "flavor": a subtle, on-brand identity for each sector page,
 * a sector icon, one accent hue drawn from the Glacier palette, a decorative
 * texture chosen to echo the sector's nature, plus tailored metrics and
 * engagement bullets so no two industry pages read the same.
 *
 * Class strings are written out in full (never interpolated) so Tailwind's JIT
 * keeps them, same approach as the services page's tier meta.
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
  /** sub-sectors, shown as the hero eyebrow */
  pattern: string;
  /** one-line governance/compliance note (CXO trust signal) */
  compliance: string;
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
  metrics: { value: string; label: string }[];
  bullets: string[];
}

export const INDUSTRY_FLAVOR: Record<string, IndustryFlavor> = {
  "construction-real-estate": {
    icon: BuildingIcon,
    pattern: "Contractors · Developers · Asset Owners",
    accentVar: "--color-amber",
    compliance:
      "Auditable cost, contract, and asset data with role-based access across every project.",
    decor: "grid", // blueprint precision
    tile: "bg-amber/15 text-amber",
    bar: "bg-amber",
    glow: "bg-amber/15",
    text: "text-amber",
    metrics: [
      { value: "15%", label: "Lower cost overruns" },
      { value: "1", label: "Unified portfolio view" },
      { value: "Daily", label: "Project cost visibility" },
      { value: "SnowPro", label: "Certified delivery team" },
    ],
    bullets: [
      "Project cost and schedule data consolidated into one governed view",
      "Portfolio and asset analytics across every property and project",
      "Budget-vs-actual and schedule risk surfaced while there's time to act",
      "Forecasting and valuation grounded in trusted, current data",
    ],
  },
  education: {
    icon: GraduationCapIcon,
    pattern: "Schools · Universities · Training Providers",
    accentVar: "--color-secondary",
    compliance:
      "FERPA-aware handling of student data, with privacy and access control built in.",
    decor: "mesh", // networks of learning
    tile: "bg-secondary/15 text-primaryDeep",
    bar: "bg-secondary",
    glow: "bg-secondary/20",
    text: "text-primaryDeep",
    metrics: [
      { value: "2×", label: "Faster institutional reporting" },
      { value: "1", label: "Source for student success" },
      { value: "100%", label: "Statutory reporting automated" },
      { value: "SnowPro", label: "Certified delivery team" },
    ],
    bullets: [
      "SIS, LMS, and operational data unified under one governance model",
      "Student success analytics on engagement, attainment, and retention",
      "Statutory, accreditation, and funder reporting automated from one source",
      "Early-warning insight on the students most at risk",
    ],
  },
  "financial-services": {
    icon: BankIcon,
    pattern: "Banking · Insurance · Asset Management",
    accentVar: "--color-primary-deep",
    compliance:
      "FINRA, SEC, and SOX-aligned reporting with role-based access and full audit lineage.",
    decor: "grid", // ledger / blueprint precision
    tile: "bg-primaryDeep/15 text-primaryDeep",
    bar: "bg-primaryDeep",
    glow: "bg-primaryDeep/15",
    text: "text-primaryDeep",
    metrics: [
      { value: "70%", label: "Less time on regulatory reporting" },
      { value: "1", label: "Governed source of truth" },
      { value: "100%", label: "Auditable data lineage" },
      { value: "Premier", label: "Snowflake Premier Partner" },
    ],
    bullets: [
      "A single governed warehouse consolidating fragmented banking, insurance, and asset data",
      "Automated regulatory and structured external reporting, auditable end to end",
      "Self-service analytics so teams decide on current, reliable numbers",
      "AI use cases prioritized against risk, compliance, and return",
    ],
  },
  manufacturing: {
    icon: FactoryIcon,
    pattern: "Discrete · Process · Supply Chain",
    accentVar: "--color-success",
    compliance:
      "Traceability from supplier to shipment, governed end to end for quality and audit.",
    decor: "flow", // assembly-line flow
    tile: "bg-success/15 text-success",
    bar: "bg-success",
    glow: "bg-success/15",
    text: "text-success",
    metrics: [
      { value: "12 pts", label: "OEE improvement" },
      { value: "360°", label: "Shop-floor & supply view" },
      { value: "99.9%", label: "Pipeline uptime" },
      { value: "SnowPro", label: "Certified delivery team" },
    ],
    bullets: [
      "Shop-floor, sensor, and ERP data unified into one governed, trusted source",
      "OEE and quality analytics that expose the real cost drivers",
      "End-to-end supply-chain visibility from supplier to shipment",
      "Data foundations for predicting failures before they happen",
    ],
  },
  "media-entertainment-advertising": {
    icon: BroadcastIcon,
    pattern: "Media · Entertainment · Advertising",
    accentVar: "--color-accent",
    compliance:
      "Consent-aware audience data, governed for privacy across every channel.",
    decor: "swoosh", // motion & broadcast
    tile: "bg-accent/15 text-accent",
    bar: "bg-accent",
    glow: "bg-accent/15",
    text: "text-accent",
    metrics: [
      { value: "Real-time", label: "Campaign attribution" },
      { value: "1", label: "Unified audience view" },
      { value: "100%", label: "Channels connected" },
      { value: "SnowPro", label: "Certified delivery team" },
    ],
    bullets: [
      "Viewing, subscription, and engagement data unified into one source",
      "Near-real-time campaign and ad attribution across channels",
      "Content performance analytics that guide what to commission",
      "Audience signal your teams act on, not gut feel",
    ],
  },
  "retail-cpg": {
    icon: BagIcon,
    pattern: "Retail · CPG · Loyalty",
    accentVar: "--color-purple",
    compliance:
      "PCI-aware handling of payment and customer data, governed end to end.",
    decor: "dots", // SKU grid
    tile: "bg-purple/15 text-purple",
    bar: "bg-purple",
    glow: "bg-purple/15",
    text: "text-purple",
    metrics: [
      { value: "2.5×", label: "Faster inventory decisions" },
      { value: "−15%", label: "Perishable shrink" },
      { value: "100%", label: "Online + in-store unified" },
      { value: "SnowPro", label: "Certified delivery team" },
    ],
    bullets: [
      "Online and in-store data unified into one near-real-time platform",
      "Inventory and perishables analytics that cut shrink",
      "Production, food cost, and logistics in a single view",
      "Customer and loyalty performance tracked alongside margin",
    ],
  },
  "technology-telco": {
    icon: ChipIcon,
    pattern: "Software · Platforms · Telecom",
    accentVar: "--color-primary",
    compliance:
      "Usage and network data handled with privacy, consent, and access controls.",
    decor: "blobs", // signal & flow
    tile: "bg-primary/15 text-primaryDeep",
    bar: "bg-primary",
    glow: "bg-primary/15",
    text: "text-primaryDeep",
    metrics: [
      { value: "Early", label: "Churn-risk warning" },
      { value: "1", label: "Governed source of truth" },
      { value: "100%", label: "Usage events tracked" },
      { value: "Premier", label: "Snowflake Premier Partner" },
    ],
    bullets: [
      "Product usage, billing, and network telemetry unified and governed",
      "Churn and retention analytics that flag risk early",
      "High-volume telemetry ingested, governed, and query-ready",
      "Reliable, governed metrics every team reports from",
    ],
  },
};

export const DEFAULT_FLAVOR: IndustryFlavor = {
  icon: BankIcon,
  pattern: "Data & AI",
  accentVar: "--color-primary-deep",
  compliance:
    "Governance, lineage, and access controls built in from day one.",
  decor: "blobs",
  tile: "bg-primary/15 text-primaryDeep",
  bar: "bg-primary",
  glow: "bg-primary/15",
  text: "text-primaryDeep",
  metrics: [
    { value: "50%", label: "Less time on manual reporting" },
    { value: "2.5×", label: "Faster decision cycles" },
    { value: "99.9%", label: "Pipeline uptime" },
    { value: "30%", label: "Fewer data incidents" },
  ],
  bullets: [
    "Sector-specific data models and governance built in from the start",
    "Industry consultants paired with SnowPro-certified Snowflake engineers",
    "Measurable outcomes tied to the metrics your teams report on",
    "A roadmap that scales from first win to platform-wide adoption",
  ],
};

export function getFlavor(slug: string): IndustryFlavor {
  return INDUSTRY_FLAVOR[slug] ?? DEFAULT_FLAVOR;
}
