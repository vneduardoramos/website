# Design: CRN press coverage on the site

## Context
CRN (crn.com) has published 5 articles in 2026 quoting Eduardo Ramos / Viewnear, all by associate editor Wade Tyler Millward. The coverage independently validates the exact positioning used across the site and the Snowflake profile (Snowflake + Anthropic/Claude partner, data & AI convergence, outcome-based delivery). Surfacing it as attributed press quotes is stronger third-party proof than self-description. Approved approach: a compact "In the press" strip on the home page plus a dedicated `/press` page listing all 5 articles.

## Guardrails
- Framed as factual coverage ("In the press" / "Featured in CRN"), never an endorsement claim.
- Every item attributed to CRN + Wade Tyler Millward and links out to the source article.
- Text "CRN" only, no CRN logo (trademark).
- Quotes/titles are verbatim English on both locales (press quotes are not translated); only surrounding chrome is localized (formal Mexican usted on es).
- Standard content rules: no banned words (consultancy/consulting), no em dash (U+2014), American English in en chrome. (The chosen quotes and all 5 titles are already em-dash-free.)

## Data (`lib/press.ts`)
A typed `PRESS` array, newest-first, each `{ slug, title, url, outlet: "CRN", author: "Wade Tyler Millward", date (ISO), quote, quoteBy }`:

1. **Anthropic Takes Step Toward IPO Amid Channel Development** — 2026-06-01
   `https://www.crn.com/news/ai/2026/anthropic-takes-step-toward-ipo-amid-channel-development`
   quote: "Organizations are investing in platforms they believe can support long-term, production-scale AI initiatives. We're seeing that demand firsthand across our customers." — Eduardo Ramos
2. **Snowflake Q1 Earnings: 5 Channel Takeaways On AI Growth, Data Product Consumption** — 2026-06-01
   `https://www.crn.com/news/ai/2026/snowflake-q1-earnings-5-channel-takeaways-on-ai-growth-data-product-consumption`
   quote: "Data and AI are coming together. Leaders are understanding now that if they want to do AI, they need to do data first." — Eduardo Ramos
3. **Anthropic Raises $65B As It Scales Partnerships** — 2026-05-28
   `https://www.crn.com/news/ai/2026/anthropic-raises-65b-as-it-scale-partnerships`
   quote: "Anthropic, at the end of the day, they want partners that know Anthropic top to bottom. We can bring in new accounts, co-sell accounts through them." — Eduardo Ramos
4. **Outcome-Based Business Models Gain Traction In The Channel As A Way To Navigate AI Economics** — 2026-02-18
   `https://www.crn.com/news/ai/2026/outcome-based-business-models-gain-traction-in-the-channel-as-a-way-to-navigate-ai-economics`
   quote: "We were born as a data AI company. I feel I'm with the right partner, with the right company." — Eduardo Ramos
5. **Snowflake Partners: AI's Impact Can Withstand A Potential Bubble** — 2026-02-18
   `https://www.crn.com/news/ai/2026/snowflake-partners-ai-s-impact-can-withstand-a-potential-bubble`
   quote: "AI holds as much importance to technological innovation as the internet and electricity." — Eduardo Ramos

Home-strip pull-quote (CRN's own framing, the strongest validation line), attributed to CRN with a link to item 2:
> "Viewnear has been building enterprise-grade production AI systems with governed Snowflake data anchored on Anthropic Claude." — CRN

## Components
- `components/marketing/PressStrip.tsx` — compact home band: eyebrow "In the press", the CRN framing pull-quote + "— CRN" attribution linking to the article, and a "See our CRN coverage" link to `/press`. Reuses `Section` and existing type/quote styling; no new colors; respects the warm/cool rhythm (a cool band, not adjacent-warm-before-CtaBand). Server component (no hooks).
- `app/[locale]/(marketing)/press/page.tsx` — `SectionHeading` ("In the press") + a list of the 5 `PRESS` items as cards (headline linking out to CRN, date via `formatDate(locale)`, "CRN · Wade Tyler Millward", the quote). `generateMetadata` via `pageMeta({ path: "/press", locale, title, description })`. External links use plain `<a target="_blank" rel="noopener noreferrer">` (not the i18n `Link`, since they leave the site).

## i18n (`messages/{en,es}/press.json`)
Chrome keys only: `meta.title`, `meta.description`, `eyebrow`, `heading`, `intro`, `homeCta` ("See our CRN coverage"), `readOn` ("Read on CRN"), `attribution` pattern. es in usted (e.g. eyebrow "En la prensa", homeCta "Vea nuestra cobertura en CRN"). Quotes/titles/author come from `lib/press.ts` (English, untranslated).

## Wiring
- Home: insert `<PressStrip />` in the proof zone of `app/[locale]/(marketing)/page.tsx` (near the partnership/outcomes proof, not directly before `<CtaBand />`).
- `app/sitemap.ts`: add `/press` to `staticPaths` (emits en + es + hreflang automatically).
- Footer (`components/marketing/Footer.tsx`) and the Resources nav group (`config/theme.ts` + `messages/{en,es}/nav.json`): add a "Press" / "Prensa" link to `/press`.

## Verify
- typecheck/lint/test clean; `npm run build` green.
- `/press` and `/es/press` return 200; the 5 outbound links resolve to the correct crn.com URLs; dates render localized; home strip renders with a working CRN link.
- Guard greps: no em dash, no consult-stem in the new files.

## Out of scope
- CRN logo asset; any "endorsed by" framing; translating the quotes; a CMS/DB model for press (a typed constant is sufficient for 5 static items).
