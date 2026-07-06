/**
 * Ambient aurora for the home hero: a few large, slowly drifting blurred color
 * fields in the Glacier palette (sky, royal, cyan, a faint warm accent),
 * multiply-blended into the light wash so they read as a soft, premium color
 * wash rather than pastel haze. Calm and slow, so the headline stays dominant.
 *
 * Purely decorative. Reuses the shared `drift` animation, so it freezes to its
 * resting frame under prefers-reduced-motion (globals.css kill-switch). Opacities
 * are 5-step per the project's Tailwind convention.
 */
export function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="animate-drift absolute -left-[8%] -top-[12%] h-[42rem] w-[42rem] rounded-full bg-primary/20 mix-blend-multiply blur-[72px]" />
      <div className="animate-drift absolute -right-[6%] top-0 h-[46rem] w-[46rem] rounded-full bg-royal/20 mix-blend-multiply blur-[88px] [animation-delay:-14s]" />
      <div className="animate-drift absolute -bottom-[14%] left-[26%] h-[38rem] w-[38rem] rounded-full bg-secondary/15 mix-blend-multiply blur-[72px] [animation-delay:-24s]" />
      <div className="animate-drift absolute bottom-[6%] right-[18%] h-[20rem] w-[20rem] rounded-full bg-accent/10 mix-blend-multiply blur-[60px] [animation-delay:-8s]" />
    </div>
  );
}
