import { cn } from "@/lib/utils";
import type { Benefit, BenefitIcon, BenefitAccent } from "@/lib/benefits";

// Benefit icons (stroke-based, 24x24).
const PATHS: Record<BenefitIcon, React.ReactNode> = {
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  ),
  shieldPlus: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  cap: (
    <>
      <path d="M22 9 12 5 2 9l10 4 10-4z" />
      <path d="M6 10.6V16c0 1.1 2.7 2 6 2s6-.9 6-2v-5.4" />
    </>
  ),
  mountain: <path d="m8 3 4 8 5-5 5 14H2L8 3z" />,
  sparkles: <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3z" />,
};

// Per-accent icon tile (full, literal classes so Tailwind keeps them).
const TILE: Record<BenefitAccent, string> = {
  red: "bg-red/15 text-red",
  blue: "bg-primary/15 text-primaryDeep",
  purple: "bg-purple/15 text-purple",
  amber: "bg-accent/15 text-accent",
  cyan: "bg-secondary/15 text-secondary",
  green: "bg-success/15 text-success",
  indigo: "bg-royal/15 text-royal",
};

function BenefitIco({ name, className }: { name: BenefitIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * Vibrant benefits grid: each card carries its own accent-colored icon tile and
 * a playful lift + icon wiggle on hover (motion-safe). Shared by /life-at-viewnear
 * and the careers pages.
 */
export function BenefitsGrid({ items, className }: { items: Benefit[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 md:auto-rows-fr lg:grid-cols-3",
        className,
      )}
    >
      {items.map((b) => (
        <div key={b.title} className="group card card-hover flex h-full flex-col">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6",
              TILE[b.accent],
            )}
          >
            <BenefitIco name={b.icon} className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">{b.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
        </div>
      ))}
    </div>
  );
}
