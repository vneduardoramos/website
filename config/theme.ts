/**
 * Viewnear brand configuration: the single source of brand truth.
 *
 * Colors are expressed as "R G B" triplets so Tailwind can apply alpha
 * (e.g. `bg-primary/20`). They are emitted as CSS variables in globals.css
 * and referenced by tailwind.config.ts. Swap values here to rebrand the
 * entire site in one place.
 *
 * "Glacier" brand system: a bright, airy white canvas with a Snowflake-sky blue
 * primary (#29B5E8), a reserved coral accent (#FF8A4C, ~5% of UI), Space Grotesk
 * display + Inter body. The logo lockup lives in public/assets and is rendered by
 * components/marketing/Logo.tsx.
 */

export const theme = {
  brand: {
    name: "Viewnear",
    domain: "viewnear.com",
    url: "https://www.viewnear.com",
    email: "contact@viewnear.com",
    tagline: "Everything your data needs, under one roof.",
    description:
      "Viewnear is a Snowflake, data & AI consultancy for the enterprise: governed data products, integrated with the systems your business runs on, across the Americas.",
    // Region positioning for the Americas.
    region: "the Americas",
    regions: ["Canada", "USA", "Mexico", "LATAM", "Caribbean"],
  },

  // "R G B" triplets, consumed via CSS variables (see globals.css).
  // "Glacier" palette: bright/airy white canvas, Snowflake-sky primary, coral accent (~5%).
  colors: {
    background: "255 255 255", // #FFFFFF pure-white canvas
    surface: "246 250 253", //    #F6FAFD off-white section bands / card base
    surface2: "234 244 251", //   #EAF4FB soft tinted cards, hover fills, callouts
    border: "224 235 244", //     #E0EBF4 hairline borders
    foreground: "15 37 48", //    #0F2530 near-navy text (softer than black)
    muted: "92 115 133", //       #5C7385 secondary / caption text
    primary: "41 181 232", //     #29B5E8 SIGNATURE sky-blue: CTAs, links, accents
    primaryFg: "255 255 255",
    primaryDeep: "11 110 153", // #0B6E99 legible blue for small text/links, hovers, chart strokes
    // Logo-true palette (sampled from public/assets/viewnear-logo.png):
    royal: "44 83 200", //        #2C53C8 logo royal-blue: authority anchor, deep accents
    royalDeep: "20 35 88", //     #142358 deep indigo: the one dark authority band (.panel-indigo)
    red: "255 72 60", //          #FF483C logo vermilion: rare high-energy accent (not the semantic danger)
    accent: "255 160 0", //       #FFA000 logo orange, the warm accent (was coral #FF8A4C; folded into the logo color)
    accentFg: "26 39 51", //      #1A2733 dark ink on the warm accent
    accentDeep: "180 83 9", //    #B45309 legible burnt-orange: warm eyebrows/links/small text on light bands
    gold: "251 191 36", //        #FBBF24 bright amber-gold: the warm "yellow" for fills/glows only (not small text)
    success: "16 185 129",
    warning: "245 158 11",
    danger: "239 68 68",
    secondary: "34 211 238", //   #22D3EE bright cyan: meshes, data-flow lines, status dots
    cyan: "34 211 238", //        #22D3EE (alias kept for existing references)
    amber: "255 160 0", //        #FFA000
    orange: "255 160 0", //       #FFA000 logo orange: primary button fill
    purple: "124 58 237", //      #7C3AED violet: legacy mesh hue (being phased out of recipes)
    deep: "15 37 48", //          near-navy (legacy token; dark slabs retired)
  },

  fonts: {
    sans: "var(--font-inter)",
    display: "var(--font-space-grotesk)",
    mono: "var(--font-jetbrains)",
  },

  logo: {
    // Single official lockup (mark + wordmark + "data + ai"), navy for light surfaces.
    src: "/assets/viewnear-logo.png",
    useTextWordmark: false,
  },

  socials: {
    linkedin: "https://www.linkedin.com/company/viewnear/",
  },

  nav: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      children: [
        { label: "Solutions", href: "/solutions", group: "What we do" },
        { label: "Migrations", href: "/migrations", group: "What we do" },
        { label: "Data + AI", href: "/data-ai", group: "What we do" },
        { label: "Platform", href: "/platform", group: "What we do" },
        { label: "Services overview", href: "/services", group: "How we work" },
        { label: "Approach", href: "/approach", group: "How we work" },
        { label: "Pricing", href: "/pricing", group: "How we work" },
      ],
    },
    {
      label: "Industries",
      children: [
        { label: "Construction & Real Estate", href: "/industries/construction-real-estate" },
        { label: "Education", href: "/industries/education" },
        { label: "Financial Services", href: "/industries/financial-services" },
        { label: "Manufacturing", href: "/industries/manufacturing" },
        { label: "Retail & CPG", href: "/industries/retail-cpg" },
        { label: "Technology & Telco", href: "/industries/technology-telco" },
        { label: "Media, Entertainment & Advertising", href: "/industries/media-entertainment-advertising" },
      ],
    },
    {
      label: "Company",
      children: [
        { label: "About", href: "/about" },
        { label: "Partnership", href: "/partnership" },
        { label: "Nearshore Advantage", href: "/nearshore" },
        { label: "Life at Viewnear", href: "/life-at-viewnear" },
        { label: "Security & Trust", href: "/security" },
      ],
    },
    {
      label: "Resources",
      children: [
        { label: "All resources", href: "/resources" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ],
} as const;

export type Theme = typeof theme;
