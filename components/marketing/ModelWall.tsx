"use client";

import { useEffect, useState } from "react";
import { MODEL_PROVIDERS } from "@/lib/model-providers";

/**
 * The Data + AI showpiece: a wall of LLM provider marks wired to a live
 * "swap models" SQL snippet. As the AI_COMPLETE() model token cycles, the
 * matching provider mark lights up from grey to its brand color.
 * Under prefers-reduced-motion: no cycle, every mark shown lit, SQL is static.
 */
export function ModelWall() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % MODEL_PROVIDERS.length);
    }, 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      {/* The wall */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {MODEL_PROVIDERS.map((p, i) => {
          const lit = reduced || i === active;
          const markColor = lit ? p.color : "#94A3B8";
          const isActive = !reduced && i === active;
          return (
            <li
              key={p.key}
              aria-label={`${p.name} ${p.family}`}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-surface px-3 py-5 transition-all duration-500 ${
                isActive
                  ? "-translate-y-0.5 border-accent/50 shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18),0_14px_34px_-14px_rgb(var(--color-accent)/0.55)]"
                  : "border-border"
              }`}
            >
              <span className="flex h-9 items-center justify-center">
                {p.src ? (
                  <span
                    aria-hidden="true"
                    className="h-8 w-8 transition-all duration-500"
                    style={{
                      backgroundColor: markColor,
                      opacity: lit ? 1 : 0.5,
                      WebkitMaskImage: `url(${p.src})`,
                      maskImage: `url(${p.src})`,
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-display text-lg font-bold transition-all duration-500"
                    style={{ color: markColor, opacity: lit ? 1 : 0.5 }}
                  >
                    {p.name}
                  </span>
                )}
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">
                {p.family}
              </span>
            </li>
          );
        })}
      </ul>

      {/* The one line that swaps them */}
      <div className="panel-indigo relative overflow-hidden rounded-2xl p-6 shadow-xl md:p-8">
        <p className="eyebrow eyebrow--invert mb-5">One line. Any of them.</p>
        <pre className="overflow-x-auto font-mono text-sm leading-7 text-white/85 md:text-[0.95rem]">
          <code>
            <span className="text-white/45">SELECT</span> AI_COMPLETE({"\n"}
            {"  "}
            <span className="font-semibold text-gold transition-colors duration-300">
              &lsquo;{MODEL_PROVIDERS[active].token}&rsquo;
            </span>
            ,{"\n"}
            {"  "}
            <span className="text-white/45">prompt =&gt;</span> question{"\n"}
            );
          </code>
        </pre>
        <p className="mt-5 text-sm leading-relaxed text-white/70">
          Switch models with one line. Inference runs inside your Snowflake
          account, so your data never moves.
        </p>
      </div>
    </div>
  );
}
