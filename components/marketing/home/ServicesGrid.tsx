import { Link } from "@/i18n/navigation";
import { CheckIcon } from "./Icons";
import { RevealGroup } from "@/components/marketing/Motion";

type Service = { slug: string; title: string; summary: string };

// No-card tile (left column, row 2): the engagement models, the one commercial
// fact the home page doesn't state anywhere else. Mirrors /pricing.
const ENGAGE_POINTS = [
  "Fixed cost: a defined outcome at a set price",
  "Time & materials: discovery and evolving scope",
  "Team augmentation: certified depth alongside in-house teams",
  "Paid discovery fixes scope; foundations go live in 8–16 weeks",
];

export function ServicesGrid({ services }: { services: Service[] }) {
  const cards = services.slice(0, 6);
  const [lead, ...rest] = cards;
  if (!lead) return null;

  // Ledger-language service card: eyebrow + № index over a dotted rule, no
  // icon tiles, no lift-on-hover. Restyled in place (not LedgerCard itself)
  // so the whole card stays one clickable link.
  const renderCard = (svc: Service, index: number) => (
    <Link
      key={svc.slug}
      href="/services"
      className="group flex h-full flex-col rounded-[10px] border border-border bg-background px-5 pb-5 pt-4 transition-colors hover:border-primary/50"
    >
      <div className="border-b border-dotted border-primary/40 pb-3">
        <span className="font-mono text-xs tracking-wider text-muted">
          № {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-3.5 font-display text-lg font-bold text-foreground">{svc.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{svc.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
        <span className="link-underline">Learn more</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );

  return (
    <section className="section section-warm">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">What we offer</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            A single accountable team, the whole data stack
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            From governed foundations and trusted pipelines to analytics and AI
            agents in production: advisory through delivery through enablement,
            on Snowflake.
          </p>
        </div>

        {/* Folding "deck": cards stand up in a staggered 3D fold-in (degrades to
            a fade below lg / under reduced-motion via the primitive).
            DOM order is interleaved so the grid lands: row1 [lead | Data Eng],
            row2 [no-card facts | Analytics], row3 [the remaining three]. */}
        <RevealGroup variant="fold" className="mt-14 grid gap-5 lg:auto-rows-fr lg:grid-cols-3">
          {/* Lead / anchor tile: same ledger language at a larger scale */}
          <Link
            href="/services"
            className="group flex h-full flex-col rounded-[10px] border border-border bg-background px-6 pb-6 pt-5 transition-colors hover:border-primary/50 lg:col-span-2"
          >
            <div className="border-b border-dotted border-primary/40 pb-3">
              <span className="font-mono text-xs tracking-wider text-muted">№ 01</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-foreground">{lead.title}</h3>
            <p className="mt-3 max-w-lg flex-1 text-base leading-relaxed text-muted">{lead.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
              <span className="link-underline">Learn more</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>

          {/* Top-right tile (Data Engineering) */}
          {rest[0] && renderCard(rest[0], 2)}

          {/* No-card tile: how to engage (left column, row 2) */}
          <div className="flex flex-col justify-center py-2 lg:col-span-2 lg:pr-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">How we engage</p>
            <h3 className="mt-3 max-w-xl text-balance font-display text-lg font-semibold leading-snug text-foreground/70 md:text-xl">
              Three ways to buy the same accountable delivery.
            </h3>
            <ul className="mt-5 grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-2">
              {ENGAGE_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-snug text-muted">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-primaryDeep"
            >
              <span className="link-underline">How pricing works</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Right tile (Analytics) + the remaining three tiles */}
          {rest.slice(1).map((svc, i) => renderCard(svc, i + 3))}
        </RevealGroup>
      </div>
    </section>
  );
}
