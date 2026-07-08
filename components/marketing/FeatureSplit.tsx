import { Img as Image } from "@/components/marketing/Img";
import Link from "next/link";
import { Reveal } from "@/components/marketing/Motion";
import { ParallaxVisual } from "@/components/marketing/home/SplitVisuals";
import { SnowMark } from "@/components/marketing/SnowMark";
import { cn } from "@/lib/utils";

/** Browser-framed image, floated with a soft shadow + faint brand tint. */
function FramedShot({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
        <Image
          src={image}
          alt={alt}
          width={720}
          height={520}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Alternating feature row: text on one side, a framed product shot (or a custom
 * `visual`) on the other. `reverse` flips the order. Both columns reveal on
 * scroll.
 */
export function FeatureSplit({
  eyebrow,
  title,
  body,
  bullets,
  image,
  imageAlt = "",
  reverse = false,
  cta,
  visual,
  as: Heading = "h3",
  ratio = "balanced",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  cta?: { label: string; href: string };
  visual?: React.ReactNode;
  as?: "h2" | "h3";
  /** Column weighting. Asymmetric ratios + a slight overlap distinguish rows. */
  ratio?: "balanced" | "wide-visual" | "wide-text";
}) {
  // Wider track lands under the visual iff the visual is the wider one and it
  // sits in the first cell (reverse). See firstCellWider = (visualWider === reverse).
  const cols =
    ratio === "balanced"
      ? "md:grid-cols-2"
      : (ratio === "wide-visual") === reverse
        ? "md:grid-cols-[1.12fr_1fr]"
        : "md:grid-cols-[1fr_1.12fr]";

  // Asymmetric (home) splits get a wider gap so the text breathes next to the
  // photo; balanced splits elsewhere keep their original spacing.
  const gap = ratio === "balanced" ? "gap-10 md:gap-14" : "gap-10 md:gap-14 lg:gap-20";

  return (
    <div className={cn("grid items-center", gap, cols)}>
      <Reveal className={reverse ? "md:order-2" : ""}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Heading className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </Heading>
        {body && <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>}
        {bullets && bullets.length > 0 && (
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                {/* Ambient Snowflake cue: the mark stands in for the bullet. */}
                <SnowMark size={16} className="mt-1 opacity-55" />
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <Link href={cta.href} className="btn-primary group mt-8">
            {cta.label}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}
      </Reveal>

      <Reveal className={reverse ? "md:order-1" : ""} delay={90}>
        <ParallaxVisual speed={0.1}>
          {visual ?? (image ? <FramedShot image={image} alt={imageAlt} /> : null)}
        </ParallaxVisual>
      </Reveal>
    </div>
  );
}
