import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Motion";

/**
 * Full-bleed image section with content overlaid on a brand-tinted scrim: the
 * site's one immersive, slightly darker beat per page. Goes edge-to-edge (the
 * marketing <main> doesn't constrain width); content sits in `.container-page`.
 * The navy scrim keeps white text legible over any photo. Use `text-secondary`
 * (cyan) for emphasis words in the title; it pops on the dark background.
 */
export function ShowcaseBand({
  image,
  imageAlt,
  eyebrow,
  title,
  body,
  bullets,
  cta,
  align = "left",
  tintClass,
  scrim = "default",
  veil = false,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  bullets?: string[];
  cta?: { label: string; href: string };
  align?: "left" | "center";
  tintClass?: string;
  /** "light" lets more of the photo show through (still legible for white text). */
  scrim?: "default" | "light";
  /** Add a uniform veil on top of the directional scrim so a busy/sharp photo
   *  recedes evenly across the full width (not just the text side). */
  veil?: boolean;
}) {
  const centered = align === "center";
  const light = scrim === "light";
  const scrimBg = centered
    ? light
      ? "linear-gradient(0deg, rgb(var(--color-foreground) / 0.7), rgb(var(--color-foreground) / 0.28))"
      : "linear-gradient(0deg, rgb(var(--color-foreground) / 0.82), rgb(var(--color-foreground) / 0.5))"
    : light
      ? "linear-gradient(90deg, rgb(var(--color-foreground) / 0.78) 0%, rgb(var(--color-foreground) / 0.42) 45%, rgb(var(--color-foreground) / 0.05) 100%)"
      : "linear-gradient(90deg, rgb(var(--color-foreground) / 0.9) 0%, rgb(var(--color-foreground) / 0.62) 48%, rgb(var(--color-foreground) / 0.2) 100%)";
  return (
    <section className="relative isolate w-full overflow-hidden">
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />

      {/* Brand scrim: directional navy gradient for legible white text over any photo. */}
      <div aria-hidden className="absolute inset-0" style={{ background: scrimBg }} />
      {veil && (
        <div aria-hidden className="absolute inset-0" style={{ background: "rgb(var(--color-foreground) / 0.34)" }} />
      )}
      {tintClass && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 opacity-50 mix-blend-soft-light ${tintClass}`}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="container-page relative">
        <div
          className={`flex min-h-[420px] flex-col justify-center py-20 md:min-h-[480px] md:py-28 ${
            centered ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl"
          }`}
        >
          <Reveal>
            {eyebrow && (
              <p className="eyebrow eyebrow--invert">{eyebrow}</p>
            )}
            <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.1]">
              {title}
            </h2>
            {body && (
              <p
                className={`mt-5 text-lg leading-relaxed text-white/85 ${
                  centered ? "mx-auto max-w-xl" : "max-w-xl"
                }`}
              >
                {body}
              </p>
            )}
            {bullets && bullets.length > 0 && (
              <ul className={`mt-6 space-y-3 ${centered ? "mx-auto inline-block text-left" : ""}`}>
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-white/90">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {cta && (
              <div className="mt-8">
                <Link href={cta.href} className="btn-light group">
                  {cta.label}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
