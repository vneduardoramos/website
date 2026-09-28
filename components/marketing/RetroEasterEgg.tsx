"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ↑ ↑ ↓ ↓ ← → ← → [space]: 1996 mode. A joke, not a feature, so it's
 * deliberately not persisted anywhere (no localStorage, no URL flag) and
 * costs nothing until triggered: this component renders `null` and does
 * nothing but listen for the sequence until then.
 *
 * The code is ignored while focus is in a text field (the chat input, a
 * form), so typing normal words with arrow keys or a space never
 * accidentally fires it.
 *
 * Site-wide CSS overrides live in a single injected `<style>` tag scoped to
 * `body.retro-1996`, so nothing here touches the real stylesheet or any
 * other component; toggling off removes the class and the style tag both.
 * The "marquee" and "animated gif" asks are real CSS keyframe animations
 * (a scrolling banner, bouncing/spinning emoji, blinking text) rather than
 * an actual <marquee> tag or a hotlinked GIF, both of which are either
 * deprecated or an asset this doesn't have — the visual joke is the same
 * either way, and it's respects prefers-reduced-motion.
 */
const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  " ",
];

const MARQUEE_TEXT =
  "★☆★ WELCOME TO VIEWNEAR.COM ★☆★ BEST VIEWED IN NETSCAPE NAVIGATOR 3.0 AT 800×600 ★☆★ " +
  "THIS SITE IS PERPETUALLY UNDER CONSTRUCTION ★☆★ SIGN OUR GUESTBOOK ★☆★ " +
  "DATA + AI, NOW IN 16 COLORS ★☆★ YOU ARE VISITOR #013370 ★☆★ ";

export function RetroEasterEgg() {
  const [active, setActive] = useState(false);
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && /^(INPUT|TEXTAREA)$/.test(target.tagName);

      if (active && e.key === "Escape") {
        setActive(false);
        buffer.current = [];
        return;
      }
      if (typing) return;

      const next = [...buffer.current, e.key].slice(-CODE.length);
      buffer.current = next;
      if (next.length === CODE.length && next.every((k, i) => k === CODE[i])) {
        setActive((v) => !v);
        buffer.current = [];
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    document.body.classList.toggle("retro-1996", active);
    return () => document.body.classList.remove("retro-1996");
  }, [active]);

  if (!active) return null;

  return (
    <>
      <style>{RETRO_CSS}</style>

      <div className="retro-marquee-bar" role="presentation">
        <span className="retro-marquee-track">{MARQUEE_TEXT}</span>
      </div>

      <div className="retro-badge retro-badge--left" role="presentation">
        <span className="retro-bounce" aria-hidden="true">
          🚧
        </span>
        <span className="retro-blink">UNDER CONSTRUCTION</span>
        <span className="retro-bounce" aria-hidden="true">
          🚧
        </span>
      </div>

      <div className="retro-badge retro-badge--right" role="presentation">
        <span className="retro-spin" aria-hidden="true">
          💾
        </span>
        <span className="retro-counter">HITS: 0013370</span>
      </div>

      <button type="button" onClick={() => setActive(false)} className="retro-exit">
        [ESC] Return to 2026
      </button>
    </>
  );
}

const RETRO_CSS = `
body.retro-1996,
body.retro-1996 * {
  font-family: "Comic Sans MS", "Comic Sans", cursive !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  text-shadow: none !important;
  backdrop-filter: none !important;
}
body.retro-1996 {
  background:
    repeating-linear-gradient(45deg, #000080, #000080 12px, #0000a8 12px, #0000a8 24px) fixed !important;
}
body.retro-1996 main,
body.retro-1996 header,
body.retro-1996 footer,
body.retro-1996 section,
body.retro-1996 nav {
  background: #c0c0c0 !important;
  color: #000000 !important;
}
body.retro-1996 h1,
body.retro-1996 h2,
body.retro-1996 h3 {
  background: linear-gradient(90deg, red, orange, #d4c400, green, blue, indigo, violet) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
  animation: retro-hue 4s linear infinite !important;
}
body.retro-1996 p,
body.retro-1996 span,
body.retro-1996 li {
  color: #000000 !important;
}
body.retro-1996 a {
  color: #0000ee !important;
  text-decoration: underline !important;
}
body.retro-1996 a:visited { color: #551a8b !important; }
body.retro-1996 button,
body.retro-1996 a.btn-primary,
body.retro-1996 a.btn-ghost,
body.retro-1996 a.btn-lg,
body.retro-1996 a.btn-sm {
  background: #00ff00 !important;
  border: 3px outset #dddddd !important;
  color: #000000 !important;
  font-weight: bold !important;
}
body.retro-1996 img,
body.retro-1996 svg:not(.retro-marquee-bar svg) {
  filter: contrast(1.3) saturate(2) !important;
}
body.retro-1996 ::selection {
  background: #ffff00 !important;
  color: #000000 !important;
}

.retro-marquee-bar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 9999;
  overflow: hidden;
  background: #000080;
  color: #ffff00;
  font-family: "Comic Sans MS", cursive;
  font-weight: bold;
  font-size: 0.85rem;
  padding: 5px 0;
  border-bottom: 3px ridge #c0c0c0;
  white-space: nowrap;
  pointer-events: none;
}
.retro-marquee-track {
  display: inline-block;
  padding-left: 100%;
  animation: retro-marquee 16s linear infinite;
}
@keyframes retro-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
@keyframes retro-hue {
  from { filter: hue-rotate(0deg); }
  to { filter: hue-rotate(360deg); }
}
@keyframes retro-blink {
  50% { opacity: 0; }
}
.retro-blink { animation: retro-blink 1s step-start infinite; }
@keyframes retro-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.retro-bounce { display: inline-block; animation: retro-bounce 0.6s ease-in-out infinite; }
@keyframes retro-spin {
  to { transform: rotate(360deg); }
}
.retro-spin { display: inline-block; animation: retro-spin 1.6s linear infinite; }

.retro-badge {
  position: fixed;
  bottom: 12px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #c0c0c0;
  border: 3px outset #dddddd;
  padding: 6px 10px;
  font-family: "Comic Sans MS", cursive;
  font-weight: bold;
  font-size: 0.75rem;
  color: #000080;
  pointer-events: none;
}
.retro-badge--left { left: 12px; }
.retro-badge--right { right: 12px; }
.retro-counter {
  font-family: "Courier New", monospace;
  background: #000000;
  color: #00ff00;
  padding: 2px 6px;
  letter-spacing: 0.1em;
}

.retro-exit {
  position: fixed;
  top: 46px;
  right: 12px;
  z-index: 10000;
  background: #c0c0c0;
  border: 3px outset #dddddd;
  padding: 6px 10px;
  font-family: "Comic Sans MS", cursive;
  font-weight: bold;
  font-size: 0.75rem;
  color: #000080;
  cursor: pointer;
}
.retro-exit:active { border-style: inset; }

@media (prefers-reduced-motion: reduce) {
  .retro-marquee-track,
  .retro-bounce,
  .retro-spin,
  .retro-blink,
  body.retro-1996 h1,
  body.retro-1996 h2,
  body.retro-1996 h3 {
    animation: none !important;
  }
}
`;
