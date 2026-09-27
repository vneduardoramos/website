import type { Config } from "tailwindcss";

/** Colors map to CSS variables emitted in globals.css (see config/theme.ts). */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  // Single bright "Glacier" theme by design: no `dark:` variants are used
  // anywhere, so no darkMode strategy is configured (see docs/design-system.md).
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withVar("--color-background"),
        surface: withVar("--color-surface"),
        surface2: withVar("--color-surface2"),
        border: withVar("--color-border"),
        foreground: withVar("--color-foreground"),
        muted: withVar("--color-muted"),
        primary: {
          DEFAULT: withVar("--color-primary"),
          fg: withVar("--color-primary-fg"),
          deep: withVar("--color-primary-deep"),
        },
        primaryDeep: withVar("--color-primary-deep"),
        royal: withVar("--color-royal"),
        royalDeep: withVar("--color-royal-deep"),
        panelInk: withVar("--color-panel-ink"),
        codeInk: withVar("--color-code-ink"),
        red: withVar("--color-red"),
        accent: {
          DEFAULT: withVar("--color-accent"),
          fg: withVar("--color-accent-fg"),
          deep: withVar("--color-accent-deep"),
        },
        accentDeep: withVar("--color-accent-deep"),
        gold: withVar("--color-gold"),
        success: withVar("--color-success"),
        warning: withVar("--color-warning"),
        danger: withVar("--color-danger"),
        secondary: withVar("--color-secondary"),
        cyan: withVar("--color-cyan"),
        amber: withVar("--color-amber"),
        orange: withVar("--color-orange"),
        purple: withVar("--color-purple"),
        deep: withVar("--color-deep"),
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        // soft, two-layer, low-spread (airy "Glacier" elevation)
        soft: "0 1px 2px rgb(16 24 40 / 0.04), 0 8px 24px rgb(16 24 40 / 0.06)",
        "soft-lg": "0 2px 4px rgb(16 24 40 / 0.05), 0 16px 40px rgb(16 24 40 / 0.10)",
        glow: "0 0 30px rgb(var(--color-primary) / 0.25), 0 0 60px rgb(var(--color-secondary) / 0.15)",
        "glow-cyan": "0 0 20px rgb(var(--color-cyan) / 0.35)",
        "glow-accent": "0 0 24px rgb(var(--color-accent) / 0.35)",
        "glow-subtle": "0 0 20px rgb(var(--color-primary) / 0.15)",
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: { "2xl": "1200px" },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(2%, -2%) scale(1.06)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 38s linear infinite",
        drift: "drift 30s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
