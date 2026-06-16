import type { SVGProps } from "react";

/** Shared inline SVG icons (no icon lib installed). viewBox 0 0 24 24.
 *  Default stroke style; pass className to color/size. */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DatabaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

export function PipelineIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="14" width="6" height="6" rx="1.5" />
      <path d="M9 7h6a3 3 0 0 1 3 3v4" />
      <path d="M6 10v4a3 3 0 0 0 3 3h6" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3v18h18" />
      <rect x="7" y="11" width="3" height="6" rx="0.5" />
      <rect x="12" y="7" width="3" height="10" rx="0.5" />
      <rect x="17" y="13" width="3" height="4" rx="0.5" />
    </svg>
  );
}

export function CpuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5C8 22.3 5 18.4 5 14V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function SnowflakeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v20M2 12h20" />
      <path d="M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
      <path d="M12 6l-2 2M12 6l2 2M12 18l-2-2M12 18l2-2M6 12l2-2M6 12l2 2M18 12l-2-2M18 12l-2 2" />
    </svg>
  );
}

/* ---- methodology step icons ---- */
export function CompassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6v3H9z" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  );
}

/** Bespoke solid "data store" mark for the mesh packets: a filled cylinder with
 *  a lighter top disc and a knocked-out mid band. Self-colored (Glacier vars). */
export function DataStackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 6.5v11c0 1.6 3.6 2.8 8 2.8s8-1.2 8-2.8v-11" fill="rgb(var(--color-primary))" />
      <ellipse cx="12" cy="6.5" rx="8" ry="2.8" fill="rgb(var(--color-secondary))" />
      <path d="M4 12c0 1.6 3.6 2.8 8 2.8s8-1.2 8-2.8" stroke="rgb(var(--color-surface))" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/** Bespoke solid "record" mark for the mesh packets: a filled page with a
 *  lighter folded (cut) corner (echoing the cut-corner eyebrow) and knocked-out
 *  data lines. Self-colored (Glacier vars). */
export function DocIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" fill="rgb(var(--color-primary))" />
      <path d="M13 3l6 6h-4.6A1.4 1.4 0 0 1 13 7.6z" fill="rgb(var(--color-secondary))" />
      <path d="M8.5 13.5h7M8.5 17h4.5" stroke="rgb(var(--color-surface))" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4l6 6L8 22H2v-6L14 4z" />
      <path d="M12 6l6 6" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 15c-2 1-3 5-3 5s4-1 5-3" />
      <path d="M9 15l-3-3c2-7 7-9 12-9 0 5-2 10-9 12z" />
      <circle cx="14" cy="10" r="1.5" />
    </svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 18a9 9 0 1 1 18 0" />
      <path d="M12 18l4-5" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function LifebuoyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M4.6 4.6l4.9 4.9M14.5 14.5l4.9 4.9M19.4 4.6l-4.9 4.9M9.5 14.5l-4.9 4.9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12l4 4 10-11" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Migration / modernization: a source store on the left moving to a target on
// the right (legacy platform -> Snowflake foundation).
export function MigrationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="8" width="7" height="9" rx="1.5" />
      <rect x="15" y="8" width="7" height="9" rx="1.5" />
      <path d="M9 12.5h4.5M12 10l2.5 2.5L12 15" />
    </svg>
  );
}
