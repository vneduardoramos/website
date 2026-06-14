"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "fade-up" | "left" | "right" | "wipe" | "blur" | "pop" | "fold";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  "fade-up": "",
  left: "reveal--left",
  right: "reveal--right",
  wipe: "reveal--wipe",
  blur: "reveal--blur",
  pop: "reveal--pop",
  fold: "reveal--fold",
};

/** Fires once when the element first enters the viewport. */
function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Scroll-reveal wrapper: animates its children in the first time they enter the
 * viewport. `variant` picks the entrance (fade-up default, or left/right slide,
 * clip wipe, blur-in, or scale pop). Pairs with `.reveal*` CSS in globals.css
 * (disabled under prefers-reduced-motion).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("reveal", VARIANT_CLASS[variant], inView && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Cascading reveal for grids/lists: becomes the container element itself (so its
 * DIRECT children stay grid items, column spans and `h-full` intact) and
 * staggers them in via CSS nth-child delays once the group enters view.
 */
export function RevealGroup({
  children,
  className,
  variant = "fade-up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "ul" | "ol";
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-variant={variant}
      className={cn("reveal-stagger", inView && "is-visible", className)}
    >
      {children}
    </Tag>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Shared scroll-linked engine. Writes a 0→1 CSS custom property (`varName`) onto
 * the ref element each frame as it travels up through the viewport, from
 * `start` (viewport fraction, default 0.85, near the bottom) to `end` (0.35).
 * No React state → no re-render per frame (compositor-only consumers read the
 * var in CSS). Sets the var to 1 immediately under prefers-reduced-motion.
 *
 * `anchor` picks the tracked edge: "center" (default) suits short elements;
 * "top" suits tall frames (e.g. a full-height image) where a center-based
 * progress would already read 1 before the element is comfortably onscreen.
 */
export function useProgressVar<T extends HTMLElement>(
  varName: string,
  opts: { start?: number; end?: number; anchor?: "center" | "top" } = {},
) {
  const { start = 0.85, end = 0.35, anchor = "center" } = opts;
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty(varName, "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const point = anchor === "top" ? r.top : r.top + r.height / 2;
      const p = (vh * start - point) / (vh * (start - end));
      el.style.setProperty(varName, String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [varName, start, end, anchor]);
  return ref;
}

/**
 * Scroll-linked highlight: as the wrapped text travels up through the viewport,
 * an accent "marker" sweeps across it (0→1 via the `--hl` CSS var, driven by
 * the shared engine). Coral by default; `color="cyan"` for the calm variant.
 * Fully painted immediately under prefers-reduced-motion.
 */
export function ScrollHighlight({
  children,
  className,
  color = "accent",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "accent" | "cyan";
}) {
  const ref = useProgressVar<HTMLSpanElement>("--hl", { start: 0.8, end: 0.45 });
  return (
    <span ref={ref} className={cn("scroll-highlight", color === "cyan" && "scroll-highlight--cyan", className)}>
      {children}
    </span>
  );
}

/**
 * Returns 0→1 progress of scrolling through a tall element (used for sticky
 * scenes and progress rails). Attach `ref` to the tall outer wrapper. Returns 1
 * immediately under prefers-reduced-motion so consumers render the end-state.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, progress };
}

/**
 * Discrete-step scroll engine for timelines/stacks: writes a continuous 0→1
 * `--progress` var onto the ref (for CSS draws/fills) and returns `activeUpTo`,
 * the number of steps whose threshold the scroll has passed. Only re-renders
 * when `activeUpTo` changes (not every frame). Under reduced motion: `--progress`
 * = 1 and all steps active.
 */
export function useStepThresholds<T extends HTMLElement>(
  count: number,
  opts: { start?: number; end?: number } = {},
) {
  const { start = 0.9, end = 0.4 } = opts;
  const ref = useRef<T>(null);
  const [activeUpTo, setActiveUpTo] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--progress", "1");
      setActiveUpTo(count);
      return;
    }
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh * (start - end);
      const p = Math.min(1, Math.max(0, (vh * start - r.top) / total));
      el.style.setProperty("--progress", String(p));
      const a = Math.min(count, Math.floor(p * count + 1e-4));
      if (a !== last) {
        last = a;
        setActiveUpTo(a);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, start, end]);
  return { ref, activeUpTo };
}

/**
 * Hero "data converges" energy: writes `--mesh-energy` (1→0) onto the ref over
 * the first ~80vh of page scroll, so descendants (the HeroMesh SVG, via CSS var
 * inheritance) calm/settle as the user scrolls in. Desktop-only; mobile and
 * reduced-motion get a steady `1` (full, ambient).
 */
export function useHeroConverge<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (prefersReducedMotion() || !desktop) {
      el.style.setProperty("--mesh-energy", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const span = window.innerHeight * 0.8;
      const energy = Math.min(1, Math.max(0, 1 - window.scrollY / span));
      el.style.setProperty("--mesh-energy", String(energy));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/* ── v3 "Dimensional" primitives ────────────────────────────────────────── */

/**
 * Kinetic-depth parallax: writes `--py` (px) onto the ref each frame from the
 * element's distance to viewport-center × `speed`, so a layer drifts at its own
 * pace (CSS `.parallax` reads `--py`). Desktop-only; steady `0` under
 * reduced-motion / mobile. Keep `speed` small (~0.06–0.18) and use on decorative
 * layers, not body text.
 */
export function useParallax<T extends HTMLElement>(speed = 0.12) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (prefersReducedMotion() || !desktop) {
      el.style.setProperty("--py", "0px");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const py = (center - window.innerHeight / 2) * -speed;
      el.style.setProperty("--py", `${py.toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

/**
 * Cutout reveal: a brand cut-corner frame around content whose inner layer
 * (an image, ideally) wipes in diagonally as it scrolls into view (`--progress`
 * → `.mask-wipe`). Fully revealed at rest under reduced-motion.
 */
export function MaskReveal({
  children,
  className,
  cutCorner = true,
  start = 0.9,
  end = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  cutCorner?: boolean;
  start?: number;
  end?: number;
}) {
  // Top-anchored so the wipe stays visible on tall frames (a full-height image
  // would already read progress 1 before it's onscreen if center-anchored).
  // `h-full` lets the wipe layer fill a height-bearing parent so `fill`/`h-full`
  // children resolve against a real height instead of collapsing to 0.
  const ref = useProgressVar<HTMLDivElement>("--progress", {
    start,
    end,
    anchor: "top",
  });
  return (
    <div className={cn(cutCorner && "clip-cut-corner", className)}>
      <div ref={ref} className="mask-wipe h-full">
        {children}
      </div>
    </div>
  );
}

/**
 * Section fold-open: a gentle 3D tilt→flat (perspective rotateX) as the wrapped
 * block scrolls in, for a dimensional "panel settling into place" entrance.
 * `angle` is the max tilt in degrees (keep ≤ ~16). Flat under reduced-motion;
 * the CSS also flattens it below `lg`.
 */
export function SectionFold({
  children,
  className,
  angle = 12,
  start = 0.95,
  end = 0.55,
}: {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  start?: number;
  end?: number;
}) {
  const ref = useProgressVar<HTMLDivElement>("--progress", { start, end });
  return (
    <div
      ref={ref}
      className={cn("fold-scroll", className)}
      style={{ ["--fold-angle" as string]: `${angle}deg` }}
    >
      {children}
    </div>
  );
}
