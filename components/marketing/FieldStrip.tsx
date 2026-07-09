import { Link } from "@/i18n/navigation";
import { Img as Image } from "@/components/marketing/Img";
import { Section } from "@/components/marketing/ui";

/**
 * "Out in the field": a slim band of real event photography with captions
 * naming the actual moments (Snowflake events, the booth, the dinners in
 * between). The photos live on /life-at-viewnear; this surfaces them on the
 * buyer-facing pages where the proof matters. Drop-in band like LatestPosts.
 */

type MomentKey =
  | "team-group"
  | "team-booth"
  | "team-stage"
  | "team-dinner"
  | "partner-momentum";

const MOMENTS: Record<MomentKey, { src: string; caption: string; alt: string }> = {
  "team-group": {
    src: "/assets/images/life/team-group.jpg",
    caption: "Customer conversations at the booth",
    alt: "The Viewnear team behind their data + ai booth at a Snowflake event",
  },
  "team-booth": {
    src: "/assets/images/life/team-booth.jpg",
    caption: "A full house at the live demo",
    alt: "A crowd gathered around the Viewnear booth watching a live product demo",
  },
  "team-stage": {
    src: "/assets/images/life/team-stage.jpg",
    caption: "Snowflake Data for Breakfast",
    alt: "A Viewnear team member at the Snowflake Data for Breakfast welcome signage",
  },
  "team-dinner": {
    src: "/assets/images/life/team-dinner.jpg",
    caption: "Dinner with the team",
    alt: "The Viewnear team and partners gathered for a team dinner",
  },
  "partner-momentum": {
    src: "/assets/images/life/partner-momentum.jpg",
    caption: "Among Snowflake's CoCo partners",
    alt: "Snowflake CoCo Global Partner Momentum wall listing Viewnear among Snowflake partners",
  },
};

export function FieldStrip({
  items = ["team-group", "team-booth", "partner-momentum", "team-dinner"],
  eyebrow = "Out in the field",
  className,
}: {
  items?: MomentKey[];
  eyebrow?: string;
  className?: string;
}) {
  return (
    <Section className={className}>
      <div className="flex items-end justify-between gap-4">
        <span className="eyebrow">{eyebrow}</span>
        <Link
          href="/life-at-viewnear"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
        >
          More from the team
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((key) => {
          const m = MOMENTS[key];
          return (
            <figure key={key}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
                {m.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
