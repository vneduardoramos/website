/**
 * Bright, airy hero background for the "Glacier" system: a soft sky wash, a
 * faint dot grid that fades downward, slowly drifting low-saturation mesh
 * blobs, and thin luminous data-flow lines (the "source → cloud → insight"
 * motif) with gently pulsing nodes. Purely decorative; render as the first
 * child of a `relative overflow-hidden` hero. All motion respects
 * prefers-reduced-motion (handled globally in globals.css).
 */
const FADE_MASK =
  "radial-gradient(78% 72% at 50% 12%, #000 55%, transparent)";

export function HeroBackground({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* base bright sky wash */}
      <div className="hero-wash absolute inset-0" />

      {/* faint dot grid, fading toward the edges */}
      <div
        className="bg-grid absolute inset-0 opacity-60"
        style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
      />

      {/* slowly drifting soft mesh blobs, logo-true: sky + royal + warm */}
      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-drift" />
      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-royal/15 blur-3xl animate-drift [animation-delay:-12s]" />
      {!compact && (
        <div className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-drift [animation-delay:-22s]" />
      )}

      {/* luminous data-flow lines + pulsing nodes */}
      <svg
        className={`absolute inset-x-0 ${compact ? "bottom-0 h-40" : "bottom-0 h-72"} w-full`}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="vnFlow1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vnFlow2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(var(--color-primary-deep))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-40,210 C300,130 560,250 780,200 C1010,150 1220,120 1480,170"
          stroke="url(#vnFlow1)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M-40,170 C320,100 600,210 840,150 C1060,100 1260,80 1480,130"
          stroke="url(#vnFlow2)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="300" cy="173" r="3.5" fill="rgb(var(--color-secondary))" className="animate-pulse-dot" />
        <circle cx="780" cy="200" r="3.5" fill="rgb(var(--color-accent))" className="animate-pulse-dot [animation-delay:-0.8s]" />
        <circle cx="1180" cy="132" r="3" fill="rgb(var(--color-primary-deep))" className="animate-pulse-dot [animation-delay:-1.6s]" />
      </svg>
    </div>
  );
}
