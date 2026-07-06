# Platform + Migrations redesign: diagram-led (2026-07-05)

User rejected the current pages: both are "eyebrow, centered headline, grids of
identical bordered cards." The copy survives (audited A-); the presentation is
replaced by one bespoke visual device per page that depicts the subject itself.

## /platform: the stack, drawn as a stack

- Hero unchanged in content; keeps "Built native on Snowflake, not bolted on."
- The six-card LAYERS grid is replaced by `StackDiagram`
  (components/marketing/platform/StackDiagram.tsx):
  - Entry chip row ("Your systems": ERP, CRM, SaaS, files, streams) with a
    downward connector.
  - Five stacked layer bands, visually connected: Ingestion & movement,
    Transformation & engineering, Open storage, AI & agents,
    Apps & consumption. Each band: mono layer label + one-line job on the
    left, product chips with GA/Preview status dots on the right (data from
    the existing LAYERS array, restructured).
  - Governance rail: a vertical band spanning all five layers on the right
    (Horizon Catalog, Horizon Context, Cortex Sense, Semantic Views, AI Agent
    Identity), because governance wraps every layer; it is not a sixth box.
  - Exit chip row ("Decisions, answers, agents") flowing out the bottom.
  - A continuous animated flow line down the stack (CSS keyframes, disabled
    under prefers-reduced-motion). Layers reveal in sequence on scroll via the
    existing Reveal primitives.
  - GA/Preview legend replaces the maturity footnote.
- "Why native" keeps its four proof bullets but loses the stock laptop image;
  rendered as a compact full-width proof row under the diagram.
- Case-study proof band and CTA unchanged.

## /migrations: the crossing

- Hero unchanged (headline + four stat chips).
- New centerpiece 1, `LegacyContrast`: a before/after split panel.
  Left "Today": muted panel with a tangled systems sketch (SVG nodes and
  crossing lines: warehouse, ETL vendors, marts, exports) annotated with the
  cost/burden reasons. Right "On Snowflake": calm Glacier panel with one
  governed foundation block annotated with flexes-with-use, zero infra,
  AI-ready. Absorbs the six "case for leaving" cards.
- New centerpiece 2, `CutoverTimeline`: two parallel horizontal tracks.
  The legacy track runs through Assess, Convert, Validate, Run in parallel,
  then terminates at Cutover ("retired" end cap); the Snowflake track starts
  at Convert and continues past the edge. Phase content from the existing
  PHASES array; the parity note (row, aggregate, hash) annotates the
  parallel-run segment. Absorbs the phase cards.
- The five source-platform card boxes collapse into one continuous board
  (grouped chip rows, single container).
- Hard parts, Automated-then-proven split, metrics, and CTA stay.

## Constraints

- Pure JSX/SVG + Tailwind with Glacier tokens; no new image assets.
- Server components; animation is CSS-only, reduced-motion safe.
- Copy canon: no em dashes, deliverable is the governed foundation, canonical
  metrics only.
- Both components live under components/marketing/{platform,migrations}/.
