"use client";

import { useEffect, useState } from "react";

/**
 * A thin progress bar pinned to the top of the viewport that fills as the reader
 * scrolls through the target article region (defaults to the `#article-body`
 * element). Purely decorative; hidden from assistive tech.
 */
export function ReadingProgress({ targetId = "article-body" }: { targetId?: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = document.getElementById(targetId);
      if (!el) return;
      // getBoundingClientRect is relative to the viewport (not offsetParent),
      // so absTop is a reliable document-absolute position.
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const total = rect.height - window.innerHeight;
      const scrolled = window.scrollY - absTop;
      const p =
        total > 0
          ? (scrolled / total) * 100
          : window.scrollY > absTop
            ? 100
            : 0; // article shorter than viewport: full once its top passes
      setPct(Math.min(100, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1" aria-hidden>
      <div
        data-testid="reading-progress"
        className="h-full bg-primary motion-safe:transition-[width] motion-safe:duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
