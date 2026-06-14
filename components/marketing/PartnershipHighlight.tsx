import Image from "next/image";
import Link from "next/link";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { SectionDecor } from "@/components/marketing/Decor";

const STATS = [
  { value: "1,300+", label: "Snowflake partners worldwide" },
  { value: "2026", label: "Featured on the Summit platform keynote" },
  { value: "2", label: "Premier Partner + CoCo Catalyst recognition" },
];

/**
 * Prominent partnership proof block: the official badges (large), the facts, the
 * CoCo Catalyst keynote slide, and stat tiles. Reused on home,
 * About, and the Partnership page (`showCta` adds a link to /partnership).
 */
export function PartnershipHighlight({
  title = "Recognized among Snowflake's top partners",
  showCta = false,
}: {
  title?: string;
  showCta?: boolean;
}) {
  return (
    <section className="section section-tint relative overflow-hidden">
      <SectionDecor variant="grid" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Snowflake Partnership</p>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.1]">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Viewnear is a{" "}
            <strong className="font-semibold text-foreground">Snowflake Premier Partner</strong>,
            recognized in Snowflake&apos;s{" "}
            <strong className="font-semibold text-foreground">CoCo Catalyst</strong> program. At
            Snowflake Summit 2026 we were featured among the partners driving the most momentum on
            Snowflake CoCo, the data-native coding agent, out of 1,300+ worldwide, alongside firms
            like Accenture, Deloitte, IBM, and Capgemini.
          </p>

          <div className="mt-8">
            <PartnerBadges variant="logos" />
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background p-4">
                <dt className="font-display text-xl font-bold text-foreground md:text-2xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>

          {showCta && (
            <Link href="/partnership" className="btn-primary group mt-8">
              Explore our partnership
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>

        <figure className="relative">
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft-lg">
            <Image
              src="/assets/images/certs/coco-momentum-summit-2026.png"
              alt="Snowflake Summit 2026 keynote: CoCo Catalyst partner momentum, featuring Viewnear among partners including Accenture, Deloitte, IBM, and Capgemini"
              width={1500}
              height={1500}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            Snowflake Summit 2026: CoCo Catalyst partner momentum, platform keynote
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
