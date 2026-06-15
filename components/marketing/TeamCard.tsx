import { Img as Image } from "@/components/marketing/Img";

const LINKEDIN_PATH =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z";

/**
 * Team card: a contained rounded-square portrait (capped width, centered) resting
 * on a soft brand glow, above name / role / LinkedIn. Hover lifts the card, reveals
 * a gradient top bar, intensifies the glow, and zooms the photo. Monogram fallback.
 */
export function TeamCard({
  member,
}: {
  member: {
    name: string;
    title: string;
    bio?: string | null;
    photo?: string | null;
    bookingUrl?: string | null;
    linkedinUrl?: string | null;
  };
}) {
  const initials = member.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-surface2/40 p-6 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg">
      {/* gradient top bar, reveals on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-royal to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* soft brand glow behind the photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl transition duration-500 group-hover:from-primary/30 group-hover:to-secondary/30"
      />

      <div className="relative aspect-square w-36 overflow-hidden rounded-2xl bg-surface2 shadow-md ring-1 ring-border transition duration-300 group-hover:ring-primary/30">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="160px"
            className="object-cover object-center transition duration-[600ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-primary/30">
            {initials}
          </div>
        )}
      </div>

      {/* brand accent, grows on hover */}
      <span className="relative mt-5 h-[3px] w-9 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-14" />
      <h3 className="relative mt-3 font-display text-lg font-bold leading-tight text-foreground">
        {member.name}
      </h3>
      <p className="relative mt-1 text-sm font-medium text-primaryDeep">{member.title}</p>
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-primaryDeep"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d={LINKEDIN_PATH} />
          </svg>
          LinkedIn
        </a>
      )}
    </div>
  );
}
