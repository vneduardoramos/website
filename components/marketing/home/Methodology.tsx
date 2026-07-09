"use client";

import {
  CompassIcon,
  PenIcon,
  PipelineIcon,
  RocketIcon,
  ShieldIcon,
  GaugeIcon,
  CheckIcon,
} from "./Icons";
import { useTranslations } from "next-intl";
import { Reveal, useStepThresholds } from "@/components/marketing/Motion";
import { cn } from "@/lib/utils";

const STEP_ICONS = [CompassIcon, PenIcon, PipelineIcon, RocketIcon, ShieldIcon, GaugeIcon];

export function Methodology() {
  const t = useTranslations("methodology");
  const steps = t.raw("steps") as { title: string; desc: string }[];
  const why = t.raw("why.items") as { title: string; body: string }[];

  const { ref: timelineRef, activeUpTo } = useStepThresholds<HTMLDivElement>(STEP_ICONS.length, {
    start: 0.85,
    end: 0.45,
  });

  return (
    <section className="section section-tint">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">{t("chip")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.rich("heading", { hl: (c) => <span className="text-gradient">{c}</span> })}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {t("intro")}
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mt-16">
          {/* connecting data-flow line on lg+, a cyan→primary "current" that
              fills as the timeline scrolls through (clip-path, compositor-only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px overflow-hidden bg-border lg:block">
            {/* fill is driven by the active step (not raw progress) so the
                "current" reaches each node exactly as that node lights up */}
            <div
              className="line-draw h-full bg-gradient-to-r from-secondary to-primary transition-[clip-path] duration-500 ease-out motion-reduce:transition-none"
              style={{ ["--progress" as string]: String(activeUpTo / STEP_ICONS.length) }}
            />
          </div>
          {/* loop-back arrow: the six steps run as a continuous, evolving cycle (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[8%] -top-8 hidden h-8 rounded-t-2xl border-2 border-b-0 border-dashed border-primary/40 lg:block"
          >
            <svg
              className="absolute -bottom-2 left-0 h-4 w-4 -translate-x-1/2 text-primary/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <ol className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {steps.map(({ title, desc }, i) => {
              const Icon = STEP_ICONS[i];
              const active = i < activeUpTo;
              return (
              <Reveal key={title} delay={i * 60}>
                <li className="relative flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-primaryDeep shadow-soft ring-4 ring-[rgb(var(--color-surface2))] transition-[filter] duration-500",
                      active && "node-active",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span
                      className={cn(
                        "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-500",
                        active ? "bg-primaryDeep text-primary-fg" : "bg-border text-muted",
                      )}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 font-display text-sm font-bold text-foreground">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
                </li>
              </Reveal>
              );
            })}
          </ol>
        </div>

        {/* Why this approach works */}
        <div className="panel-dark panel-editorial mt-16 rounded-3xl p-8 md:p-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <p className="eyebrow mb-3">{t("why.eyebrow")}</p>
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("why.title")}
            </h3>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {why.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-primaryDeep">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-foreground">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
