/**
 * Ambient aurora for the home hero: a few large, slowly drifting blurred color
 * fields in the Glacier palette (sky, royal, cyan, a faint warm accent),
 * multiply-blended into the light wash so they read as a soft, premium color
 * wash rather than pastel haze. Calm and slow, so the headline stays dominant.
 *
 * Purely decorative. Reuses the shared `drift` animation, so it freezes to its
 * resting frame under prefers-reduced-motion (globals.css kill-switch). Opacities
 * are 5-step per the project's Tailwind convention.
 *
 * A few barely-there Snowflake marks drift in the field too: a whisper of the
 * platform behind the headline, felt before it's noticed.
 */
import { SnowMark } from "@/components/marketing/SnowMark";

export function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="animate-drift absolute -left-[8%] -top-[12%] h-[42rem] w-[42rem] rounded-full bg-primary/20 mix-blend-multiply blur-[72px]" />
      <div className="animate-drift absolute -right-[6%] top-0 h-[46rem] w-[46rem] rounded-full bg-royal/20 mix-blend-multiply blur-[88px] [animation-delay:-14s]" />
      <div className="animate-drift absolute -bottom-[14%] left-[26%] h-[38rem] w-[38rem] rounded-full bg-secondary/15 mix-blend-multiply blur-[72px] [animation-delay:-24s]" />
      <div className="animate-drift absolute bottom-[6%] right-[18%] h-[20rem] w-[20rem] rounded-full bg-accent/10 mix-blend-multiply blur-[60px] [animation-delay:-8s]" />
      {/* Snowflake crystals, barely there. */}
      <SnowMark size={46} className="animate-drift absolute left-[8%] top-[22%] opacity-[0.05]" />
      <SnowMark size={72} className="animate-drift absolute right-[12%] top-[34%] opacity-[0.04] [animation-delay:-18s]" />
      <SnowMark size={34} className="animate-drift absolute left-[32%] bottom-[14%] opacity-[0.06] [animation-delay:-10s]" />
    </div>
  );
}
