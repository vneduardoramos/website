import Image from "next/image";
import {
  SnowflakeIcon,
  DatabaseIcon,
  PipelineIcon,
  ClipboardIcon,
  ChartIcon,
  CpuIcon,
  RocketIcon,
} from "@/components/marketing/home/Icons";

type TeamMini = { name: string; photo: string | null };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ member }: { member: TeamMini }) {
  const ring = "h-9 w-9 rounded-full ring-2 ring-background";
  return member.photo ? (
    <Image src={member.photo} alt={member.name} width={36} height={36} className={`${ring} object-cover`} />
  ) : (
    <span
      className={`${ring} flex items-center justify-center bg-primary/15 text-[11px] font-bold text-primaryDeep`}
      aria-label={member.name}
    >
      {initials(member.name)}
    </span>
  );
}

type Node = { x: number; y: number; icon: typeof SnowflakeIcon; label: string };

// viewBox geometry (440 × 380). Sources fan in from the left, outputs fan out right.
const SOURCES: Node[] = [
  { x: 56, y: 72, icon: DatabaseIcon, label: "Warehouses" },
  { x: 56, y: 174, icon: PipelineIcon, label: "Apps & APIs" },
  { x: 56, y: 276, icon: ClipboardIcon, label: "Files" },
];
const OUTPUTS: Node[] = [
  { x: 384, y: 72, icon: ChartIcon, label: "Dashboards" },
  { x: 384, y: 174, icon: CpuIcon, label: "Cortex AI" },
  { x: 384, y: 276, icon: RocketIcon, label: "Data apps" },
];
const HUB = { x: 220, y: 174, r: 50 };

// Cubic path from a left node's right edge into the hub's left edge.
function inPath(n: Node) {
  return `M ${n.x + 26} ${n.y} C 150 ${n.y} 150 ${HUB.y} ${HUB.x - HUB.r - 2} ${HUB.y}`;
}
// From the hub's right edge out to a right node's left edge.
function outPath(n: Node) {
  return `M ${HUB.x + HUB.r + 2} ${HUB.y} C 296 ${HUB.y} 296 ${n.y} ${n.x - 26} ${n.y}`;
}

function DiagramNode({ n }: { n: Node }) {
  const Icon = n.icon;
  return (
    <g>
      <circle cx={n.x} cy={n.y} r={24} className="fill-background stroke-border" strokeWidth={1.5} />
      <Icon x={n.x - 12} y={n.y - 12} width={24} height={24} className="text-primaryDeep" />
      <text
        x={n.x}
        y={n.y + 42}
        textAnchor="middle"
        className="fill-muted font-display"
        fontSize={12}
        fontWeight={600}
      >
        {n.label}
      </text>
    </g>
  );
}

/**
 * Hero visual: a branded "governed Snowflake platform" data-flow diagram:
 * source nodes fan into a glowing Snowflake hub and out to analytics/AI/app
 * outputs, with a subtle current flowing along the connectors. Single SVG
 * (viewBox-scaled, so it stays crisp and aligned at any size). Honest for a
 * services firm; themeable via the Glacier palette. Inherits the hero float;
 * a floating team card signals the real people behind the work.
 */
export function HeroDiagram({ team = [] }: { team?: TeamMini[] }) {
  const faces = team.slice(0, 4);
  return (
    <div className="relative">
      {/* soft glow behind the canvas */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-secondary/10 blur-3xl" />

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-surface to-surface2 p-5 shadow-soft-lg sm:p-7">
        <svg
          viewBox="0 0 440 380"
          className="h-auto w-full"
          role="img"
          aria-label="Data from warehouses, apps, and files flows into one governed Snowflake foundation and out to dashboards, Cortex AI, and data apps."
        >
          <defs>
            <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.35" />
              <stop offset="50%" stopColor="rgb(var(--color-primary))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.28" />
              <stop offset="70%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.10" />
              <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* connectors: a soft base stroke + an animated dashed "current" */}
          {[...SOURCES.map(inPath), ...OUTPUTS.map(outPath)].map((d, i) => (
            <g key={i} fill="none">
              <path d={d} stroke="url(#flowGrad)" strokeWidth={2} strokeLinecap="round" />
              <path
                d={d}
                stroke="rgb(var(--color-secondary))"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="2 14"
                className="hero-flow"
                opacity={0.9}
              />
            </g>
          ))}

          {/* hub glow + ring + mark */}
          <circle cx={HUB.x} cy={HUB.y} r={78} fill="url(#hubGlow)" />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={HUB.r}
            className="fill-surface stroke-primary"
            strokeWidth={2}
          />
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r + 7} className="stroke-primary" fill="none" strokeWidth={1} opacity={0.3} />
          <SnowflakeIcon x={HUB.x - 19} y={HUB.y - 21} width={38} height={38} className="text-primaryDeep" />

          {/* hub label, centered below the mark and clear of the side nodes */}
          <text x={HUB.x} y={HUB.y + 70} textAnchor="middle" className="fill-foreground font-display" fontSize={16} fontWeight={700}>
            Snowflake
          </text>
          <text x={HUB.x} y={HUB.y + 89} textAnchor="middle" className="fill-primaryDeep font-display" fontSize={11.5} fontWeight={600}>
            One governed foundation
          </text>
          <text x={HUB.x} y={HUB.y + 106} textAnchor="middle" className="fill-muted font-mono" fontSize={9} letterSpacing={0.5}>
            GOVERNANCE · LINEAGE · SECURITY
          </text>

          {/* nodes drawn last so they sit above the connectors */}
          {SOURCES.map((n) => (
            <DiagramNode key={n.label} n={n} />
          ))}
          {OUTPUTS.map((n) => (
            <DiagramNode key={n.label} n={n} />
          ))}
        </svg>
      </div>

      {/* "real people behind this": floating team card */}
      {faces.length > 0 && (
        <div className="absolute -bottom-5 left-3 z-10 flex max-w-xs items-center gap-3.5 rounded-2xl border border-border bg-surface/95 p-3 shadow-soft-lg backdrop-blur lg:-left-6">
          <div className="flex shrink-0 -space-x-2.5">
            {faces.map((m) => (
              <Avatar key={m.name} member={m} />
            ))}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight text-foreground">
              Real people. Certified delivery.
            </p>
            <p className="mt-0.5 text-[11px] text-muted">SnowPro-certified team</p>
          </div>
        </div>
      )}
    </div>
  );
}
