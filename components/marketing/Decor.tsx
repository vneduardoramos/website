/**
 * Decorative SVG section backgrounds + dividers for the "Glacier" system:
 * light gradient-mesh blobs, faint dot/blueprint grids, luminous data-flow
 * lines, and a flowing swoosh, all in sky-blue / cyan / faint violet at low
 * opacity. Purely decorative.
 *
 * Usage: give the <section> `relative overflow-hidden`, drop <SectionDecor/> as
 * the first child, then wrap real content in a `relative` div so it sits above.
 * Use <WaveDivider/> at a section edge to transition between section colors.
 */

type DecorVariant = "blobs" | "dots" | "grid" | "swoosh" | "mesh" | "flow" | "crystal";

/**
 * One arm of a stellar dendrite, the snow crystal that grows a main shaft with
 * paired side branches at 60 degrees. Drawn once and rotated six times, so the
 * figure's symmetry is exact rather than hand-placed.
 */
const CRYSTAL_ARM = [
  "M0 0V-336",
  "M0 -104l64 -37M0 -104l-64 -37",
  "M0 -170l88 -51M0 -170l-88 -51",
  "M0 -170l88 -51l-10 32M0 -170l-88 -51l10 32",
  "M0 -238l62 -36M0 -238l-62 -36",
  "M0 -294l40 -23M0 -294l-40 -23",
  "M0 -336l26 -15M0 -336l-26 -15",
].join("");

function CrystalFigure({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-360 -360 720 720" fill="none" aria-hidden="true">
      <g
        stroke="rgb(var(--color-primary) / 0.30)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path key={angle} d={CRYSTAL_ARM} transform={`rotate(${angle})`} />
        ))}
        <path d="M0 -30L26 -15L26 15L0 30L-26 15L-26 -15Z" />
      </g>
    </svg>
  );
}

export function SectionDecor({
  variant = "blobs",
  className = "",
}: {
  variant?: DecorVariant;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {variant === "blobs" && (
        <>
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-drift" />
          <div className="absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-royal/15 blur-3xl animate-drift [animation-delay:-14s]" />
          <div className="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-drift [animation-delay:-24s]" />
        </>
      )}

      {variant === "mesh" && (
        <div className="mesh-soft absolute inset-0" />
      )}

      {variant === "dots" && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="vn-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="rgb(var(--color-primary) / 0.10)" />
            </pattern>
            <radialGradient id="vn-dots-fade" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="vn-dots-mask">
              <rect width="100%" height="100%" fill="url(#vn-dots-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#vn-dots)" mask="url(#vn-dots-mask)" />
        </svg>
      )}

      {variant === "grid" && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="vn-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M48 0H0V48"
                fill="none"
                stroke="rgb(var(--color-primary) / 0.06)"
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id="vn-grid-fade" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="70%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="vn-grid-mask">
              <rect width="100%" height="100%" fill="url(#vn-grid-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#vn-grid)" mask="url(#vn-grid-mask)" />
        </svg>
      )}

      {/* Three line families 60 degrees apart: the axis system a snow crystal
          actually grows on. Tile 60 wide and 60*tan(60) tall so every family
          wraps, and masked out of the middle so it only ever reads at the
          margins. */}
      {variant === "crystal" && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="vn-crystal" width="60" height="103.92" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="rgb(var(--color-primary) / 0.30)" strokeWidth="1">
                <path d="M0 0H60M0 51.96H60" />
                <path d="M0 103.92L60 0" />
                <path d="M0 0L60 103.92" />
              </g>
            </pattern>
            <radialGradient id="vn-crystal-fade" cx="50%" cy="45%" r="78%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="55%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
            <mask id="vn-crystal-mask">
              <rect width="100%" height="100%" fill="url(#vn-crystal-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#vn-crystal)" mask="url(#vn-crystal-mask)" />
        </svg>
      )}

      {/* The figures over the field: two crystals at different scales, each
          bleeding off an edge so neither reads as an icon dropped on the band. */}
      {variant === "crystal" && (
        <>
          <CrystalFigure className="absolute -top-[30rem] right-[-16rem] hidden h-[52rem] w-[52rem] [mask-image:radial-gradient(circle_at_69%_58%,#000_18%,transparent_62%)] lg:block" />
          <CrystalFigure className="absolute -bottom-28 -left-24 h-[28rem] w-[28rem] [mask-image:radial-gradient(circle_at_20%_78%,#000_15%,transparent_58%)] sm:h-[34rem] sm:w-[34rem]" />
        </>
      )}

      {variant === "flow" && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 480"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vn-flow-a" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.45" />
              <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-40,300 C320,210 600,360 860,280 C1080,214 1280,180 1480,240"
            stroke="url(#vn-flow-a)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-40,360 C300,280 580,420 820,330 C1040,256 1260,230 1480,300"
            stroke="rgb(var(--color-primary) / 0.18)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}

      {variant === "swoosh" && (
        <svg
          className="absolute inset-x-0 bottom-0 h-2/3 w-full"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vn-swoosh" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(var(--color-royal))" stopOpacity="0.14" />
              <stop offset="55%" stopColor="rgb(var(--color-primary))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <path
            d="M0,240 C300,170 560,270 760,230 C980,186 1180,150 1440,210 L1440,360 L0,360 Z"
            fill="url(#vn-swoosh)"
          />
          <path
            d="M-40,210 C300,130 560,260 780,210 C1010,158 1220,120 1480,180"
            stroke="rgb(var(--color-secondary))"
            strokeOpacity="0.30"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-40,170 C320,100 600,220 840,160 C1060,106 1260,82 1480,130"
            stroke="rgb(var(--color-primary))"
            strokeOpacity="0.20"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * A wave-shaped divider that sits flush to a section edge and is filled with the
 * ADJACENT section's color (pass a Tailwind `fill-*` class) for a smooth blend.
 */
export function WaveDivider({
  position = "bottom",
  fill = "fill-background",
  className = "",
}: {
  position?: "top" | "bottom";
  fill?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-[1] leading-[0] ${
        position === "top" ? "top-0" : "bottom-0"
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={`block h-[56px] w-full md:h-[80px] ${fill} ${
          position === "top" ? "rotate-180" : ""
        }`}
      >
        <path d="M0,48 C240,90 460,8 720,34 C980,60 1200,96 1440,46 L1440,90 L0,90 Z" />
      </svg>
    </div>
  );
}
