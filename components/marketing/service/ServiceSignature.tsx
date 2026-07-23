import { cn } from "@/lib/utils";
import type { ServiceFlavor } from "./flavor";

/**
 * Per-service signature visual: a distinct, on-brand SVG/HTML diagram that
 * explains the service, so each page opens with something unmistakably its own
 * (roadmap / layered stack / pipeline flow / query-answer / device / ladder).
 * Server-rendered, no photos. Tinted with the flavor's `figureVar` hue.
 */

function Frame({
  caption,
  glow,
  children,
}: {
  caption: string;
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className={cn("pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl", glow)} aria-hidden="true" />
      <p className="relative mb-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
        {caption}
      </p>
      <div className="relative">{children}</div>
    </div>
  );
}

function Down({ c }: { c: string }) {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: c }}>
        <path d="M8 2v8M4.5 7.5 8 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

export function ServiceSignature({ slug, flavor }: { slug: string; flavor: ServiceFlavor }) {
  const V = flavor.figureVar;
  const c = (a = 1) => `rgb(var(${V}) / ${a})`;

  // ── Data & AI Strategy: engagement roadmap ────────────────────────────────
  if (slug === "ai-data-strategy") {
    const steps = [
      { t: "Discovery", s: "Scope and data readiness" },
      { t: "Roadmap", s: "Use cases sequenced by ROI" },
      { t: "First sprint", s: "Ship a working slice" },
      { t: "Scale", s: "Proof before spend" },
    ];
    return (
      <Frame caption="Engagement roadmap" glow={flavor.glow}>
        <ol className="relative space-y-5 pl-8">
          <span className="absolute bottom-2 left-[11px] top-2 w-0.5" style={{ background: c(0.25) }} aria-hidden="true" />
          {steps.map((st, i) => (
            <li key={st.t} className="relative">
              <span
                className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background font-mono text-[0.7rem] font-bold"
                style={{ borderColor: c(1), color: c(1) }}
              >
                {i + 1}
              </span>
              <p className="text-sm font-semibold text-foreground">{st.t}</p>
              <p className="text-xs text-muted">{st.s}</p>
            </li>
          ))}
        </ol>
      </Frame>
    );
  }

  // ── Cloud Architecture: layered governed foundation ───────────────────────
  if (slug === "cloud-architecture") {
    const layers = [
      { l: "Serve", tool: "Snowsight · Streamlit", a: 0.1 },
      { l: "Govern", tool: "Horizon · Semantic Views", a: 0.16 },
      { l: "Transform", tool: "dbt · Dynamic Tables", a: 0.22 },
      { l: "Ingest", tool: "Openflow · Zero-Copy", a: 0.3 },
    ];
    return (
      <Frame caption="Governed foundation" glow={flavor.glow}>
        <div className="space-y-2">
          {layers.map((ly) => (
            <div
              key={ly.l}
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{ background: c(ly.a), boxShadow: `inset 0 0 0 1px ${c(ly.a + 0.12)}` }}
            >
              <span className="text-sm font-semibold text-foreground">{ly.l}</span>
              <span className="font-mono text-[0.62rem] text-muted">{ly.tool}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[0.7rem] text-muted">One platform on Snowflake</p>
      </Frame>
    );
  }

  // ── Data Engineering: source-to-decision pipeline ─────────────────────────
  if (slug === "data-engineering") {
    return (
      <Frame caption="Source to decision" glow={flavor.glow}>
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            {["ERP", "CRM", "SaaS", "Files"].map((x) => <Chip key={x}>{x}</Chip>)}
          </div>
          <Down c={c(0.7)} />
          <div className="rounded-xl px-4 py-3 text-center" style={{ boxShadow: `inset 0 0 0 1.5px ${c(0.55)}` }}>
            <span className="text-sm font-semibold text-foreground">Governed pipeline</span>
            <span className="mt-0.5 block font-mono text-[0.62rem] text-muted">Openflow · dbt · Dynamic Tables</span>
          </div>
          <Down c={c(0.7)} />
          <div className="rounded-xl px-4 py-3 text-center text-white" style={{ background: c(1) }}>
            <span className="text-sm font-semibold">Snowflake</span>
          </div>
          <Down c={c(0.7)} />
          <div className="flex flex-wrap justify-center gap-2">
            {["Dashboards", "Cortex agents"].map((x) => <Chip key={x}>{x}</Chip>)}
          </div>
        </div>
      </Frame>
    );
  }

  // ── AI Analytics & Agents: query -> cited answer ──────────────────────────
  if (slug === "data-visualisation") {
    const bars = [42, 66, 52, 74, 60];
    return (
      <Frame caption="Cortex Analyst" glow={flavor.glow}>
        <div className="space-y-3">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-surface2 px-3.5 py-2 text-sm text-foreground">
            Revenue by region this quarter?
          </div>
          <div className="rounded-2xl rounded-bl-md border border-border bg-background p-3.5">
            <div className="flex items-center gap-1.5" style={{ color: c(1) }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c.6 3.6 1.8 4.8 5.4 5.4-3.6.6-4.8 1.8-5.4 5.4-.6-3.6-1.8-4.8-5.4-5.4 3.6-.6 4.8-1.8 5.4-5.4z" />
              </svg>
              <span className="text-[0.68rem] font-semibold uppercase tracking-wide">Answer</span>
            </div>
            <div className="mt-3 flex h-16 items-end gap-2">
              {bars.map((h, i) => (
                <span key={i} className="w-full rounded-t" style={{ height: `${h}%`, background: c(0.35 + i * 0.12) }} />
              ))}
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[0.7rem] text-muted">West leads, +18% QoQ</span>
              <span className="pill-chip text-[0.6rem]">cited · SALES.ORDERS</span>
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  // ── Embedded Analytics: analytics inside your product ─────────────────────
  if (slug === "embedded-analytics") {
    return (
      <Frame caption="Inside your product" glow={flavor.glow}>
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="ml-2 font-mono text-[0.6rem] text-muted">app.yourproduct.com/insights</span>
          </div>
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2">
              {[["MRR", "$128k"], ["Active seats", "3,402"]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border p-2.5">
                  <p className="text-[0.62rem] uppercase tracking-wide text-muted">{k}</p>
                  <p className="font-display text-lg font-bold" style={{ color: c(1) }}>{v}</p>
                </div>
              ))}
            </div>
            <svg viewBox="0 0 240 70" className="h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,58 L48,40 L96,48 L144,24 L192,32 L240,10 L240,70 L0,70 Z" fill={c(0.15)} />
              <path d="M0,58 L48,40 L96,48 L144,24 L192,32 L240,10" fill="none" stroke={c(1)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[0.7rem] text-muted">Served from Snowflake, styled as your feature</p>
          </div>
        </div>
      </Frame>
    );
  }

  // ── Capability Development: capability grows, we hand over ─────────────────
  if (slug === "capability-development") {
    const cols = [
      { l: "We lead", h: 44, a: 0.35 },
      { l: "Build together", h: 78, a: 0.6 },
      { l: "You run it", h: 120, a: 1 },
    ];
    return (
      <Frame caption="From our hands to yours" glow={flavor.glow}>
        <div className="relative">
          <svg viewBox="0 0 260 40" className="mb-1 h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M18,34 L130,20 L242,6" fill="none" stroke={c(0.55)} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
            <path d="M232,3 l12,3 -8,8" fill="none" stroke={c(1)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex items-end justify-between gap-4">
            {cols.map((col) => (
              <div key={col.l} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg" style={{ height: col.h, background: c(col.a) }} />
                <span className="text-center text-[0.7rem] text-muted">{col.l}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  return null;
}
