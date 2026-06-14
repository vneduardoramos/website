import { RevealGroup } from "@/components/marketing/Motion";

type Horizon = { phase: string; title: string; body: string };

/**
 * "Where this takes you": the transformation horizons as a compact, static 3-up
 * grid with a thin connector rail. (Previously a sticky pinned scroll scene; it
 * was de-pinned because the pin reserved a tall track + centered the content in a
 * full viewport, leaving a large empty band above and below.)
 */
export function HorizonScene({
  horizons,
  heading,
}: {
  horizons: Horizon[];
  /** Optional section heading rendered above the grid. */
  heading?: React.ReactNode;
}) {
  return (
    <div>
      {heading ? <div className="mb-10">{heading}</div> : null}

      {/* thin gradient connector rail (decorative, desktop only) */}
      <div className="relative mx-auto mb-10 hidden h-1 max-w-4xl overflow-hidden rounded-full bg-border lg:block">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-primary" />
      </div>

      <RevealGroup className="grid gap-6 md:auto-rows-fr md:grid-cols-3" variant="fade-up">
        {horizons.map((h, i) => (
          <div key={h.phase} className="card card-hover flex h-full flex-col">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pill-chip">{h.phase}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{h.title}</h3>
            <p className="mt-2 text-muted">{h.body}</p>
          </div>
        ))}
      </RevealGroup>
    </div>
  );
}
