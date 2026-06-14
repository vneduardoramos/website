import { HeroBackground } from "@/components/marketing/HeroBackground";

/**
 * Standard inner-page hero with the brand wave background. Title may include
 * JSX (e.g. a `.text-gradient` emphasis span). `align` defaults to center.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  children?: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden">
      <HeroBackground compact />
      <div className="container-page relative py-20 md:py-28">
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && (
            <p className="chip mb-5 inline-flex">{eyebrow}</p>
          )}
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.06] tracking-tight text-foreground md:text-[3.4rem]">
            {title}
          </h1>
          {description && (
            <p className={`mt-5 text-lg leading-relaxed text-muted md:text-xl ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
