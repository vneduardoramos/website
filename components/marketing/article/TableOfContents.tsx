"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Heading } from "@/lib/toc";
import { cn } from "@/lib/utils";

/**
 * Section navigation for an article. On desktop it pins beside the prose and
 * highlights the section currently in view (scroll-spy); on mobile it collapses
 * into an "In this article" disclosure above the body. Renders nothing for
 * short articles (< 2 headings).
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const t = useTranslations("articleUi");
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = headings.map((h) => h.id);
    if (!ids.length) return;
    let raf = 0;
    // Active section = the last heading whose top has scrolled past the
    // threshold. Robust at the page bottom (the final section still activates),
    // unlike a thin IntersectionObserver band.
    const compute = () => {
      raf = 0;
      const threshold = 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
        else break;
      }
      setActive(current);
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
  }, [headings]);

  if (headings.length < 2) return null;

  const list = (
    <ol className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
          <a
            href={`#${h.id}`}
            className={cn(
              "block border-l-2 py-1 pl-3 transition-colors",
              active === h.id
                ? "border-primary font-semibold text-primaryDeep"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Mobile: collapsible disclosure above the body */}
      <details className="mb-8 rounded-xl border border-border bg-surface2 p-4 lg:hidden">
        <summary className="cursor-pointer select-none font-display text-sm font-semibold text-foreground">
          {t("toc.inThisArticle")}
        </summary>
        <nav className="mt-4" aria-label={t("toc.ariaLabel")}>
          {list}
        </nav>
      </details>

      {/* Desktop: sticky rail */}
      <nav className="sticky top-28 hidden lg:block" aria-label={t("toc.ariaLabel")}>
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          {t("toc.onThisPage")}
        </p>
        {list}
      </nav>
    </>
  );
}
