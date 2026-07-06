# ViewNear: Project Documentation

This folder is the durable record of **what** ViewNear is and **why** it's built the way it is. It's meant to be edited and kept current as the project evolves.

Two kinds of document live here:

| Kind | What it is | How to treat it |
|------|------------|-----------------|
| **Decision records** (`decisions/`) | One file per significant decision, in [ADR](https://adr.github.io/) form. The history of *why*. | Append-only numbering. Mark a reversed decision `Superseded by NNNN` rather than deleting it. Factual corrections to an Active record are fine. |
| **Living guides** (`*.md` below) | Current-state references for a whole area. The source of truth for *how it is now*. | Edit freely whenever the codebase changes. |

## Living guides

- [`architecture.md`](architecture.md): stack, app structure, data model, CMS, storage, auth, dev workflow, production path.
- [`design-system.md`](design-system.md): the "Glacier" palette, fonts, components, layout conventions, the industry-flavor system, the screenshot harness.
- [`content-style-guide.md`](content-style-guide.md): voice, spelling standard, terminology, placeholder policy, and the **authoritative canonical metric table** (the single source of truth for the numbers shown on the site).
- [`CHANGELOG.md`](CHANGELOG.md): reverse-chronological record of notable changes.

## Decision log

See [`decisions/`](decisions/). Current records:

| # | Decision | Status |
|---|----------|--------|
| [0001](decisions/0001-stack-next-app-router.md) | Stack: Next.js 14 App Router, one app for site + admin | Active |
| [0002](decisions/0002-prisma-sqlite-dev.md) | Prisma + SQLite for dev, Postgres-portable schema | Active |
| [0003](decisions/0003-nextauth-credentials.md) | Auth: NextAuth Credentials + bcryptjs, single seeded admin | Active |
| [0004](decisions/0004-config-driven-cms.md) | Config-driven CMS (one generic CRUD) | Active |
| [0005](decisions/0005-glacier-theming.md) | Central "Glacier" theming via CSS variables | Active |
| [0006](decisions/0006-storage-abstraction.md) | Storage abstraction + `STORAGE_DRIVER` fail-loud | Active |
| [0007](decisions/0007-content-model-isr.md) | Content model: seeded, Americas rebrand, placeholders, ISR | Active |
| [0008](decisions/0008-publish-workflow-fix.md) | Publish workflow: stamp `publishedAt` once; `JobOpening.publishedAt` | Active |
| [0009](decisions/0009-upload-hardening.md) | Upload hardening: MIME allowlist + size cap | Active |
| [0010](decisions/0010-screenshot-harness.md) | Design screenshot harness with scroll-reveal | Active |
| [0011](decisions/0011-industry-flavor.md) | Per-industry "flavor" system | Active |
| [0012](decisions/0012-layout-conventions.md) | Heading `text-balance` + equal-height card grids | Active |
| [0013](decisions/0013-american-english-terminology.md) | American English spelling + "data & AI" terminology | Active |
| [0014](decisions/0014-canonical-metrics.md) | Canonical metric set (single source of truth) | Active |
| [0015](decisions/0015-outcome-led-case-studies.md) | Outcome-led case studies via DB fields | Active |
| [0016](decisions/0016-cxo-content.md) | CXO content on Services + About | Active |
| [0017](decisions/0017-security-why-pages.md) | New pages: Security & Trust, Why ViewNear; brand fix | Active |
| [0018](decisions/0018-button-system.md) | Refreshed button system | Active |
| [0019](decisions/0019-showcase-band.md) | Full-bleed image showcase band | Active |
| [0020](decisions/0020-snowflake-native-stack.md) | Prefer Snowflake-native products; Platform page | Active |
| [0021](decisions/0021-hero-visual.md) | Hero visual: product screenshot + team card | Superseded by 0029 |
| [0022](decisions/0022-single-logo-lockup.md) | Single official logo lockup | Active |
| [0023](decisions/0023-partnerships-and-ia-expansion.md) | Partnerships, certifications & IA expansion (8 pages) | Active |
| [0024](decisions/0024-flat-orange-buttons-mega-menu.md) | Buttons (now solid royal-blue) + mega-menu nav | Active |
| [0025](decisions/0025-company-ia-consolidation.md) | Company menu consolidation (8 to 4) | Active |
| [0026](decisions/0026-final-industries-and-case-study-spotlight.md) | Final 7 industries, one case study each, prominent spotlight | Active |
| [0027](decisions/0027-eyebrow-tag.md) | Cut-corner "tag" shape language: eyebrows, pills & chips (themeable via `--eyebrow-accent`) | Active |
| [0028](decisions/0028-launch-readiness-hardening.md) | Launch-readiness hardening: error pages, SEO/JSON-LD/OG, CMS settings, rate-limit/S3/CI, consent + analytics | Active |
| [0029](decisions/0029-hero-platform-diagram.md) | Hero visual → branded "governed Snowflake platform" diagram (replaces product screenshot) | Active |
| [0030](decisions/0030-home-narrative-arc.md) | Home page narrative arc (problem → path → de-risk → transformation; customer = hero) | Active |
| [0031](decisions/0031-cms-field-types.md) | Reusable CMS field types (WYSIWYG, image, relation, repeater, group); blog author = TeamMember | Active |

## Adding a new decision

1. Copy the template below into `decisions/NNNN-kebab-title.md` using the next free number.
2. Fill it in; reference real file paths and values.
3. Add a row to the table above.
4. If it reverses an earlier decision, set that record's **Status** to `Superseded by NNNN`.

```md
# NNNN: <Title>
- **Status:** Active | Superseded by NNNN | Proposed
- **Date:** YYYY-MM-DD   **Last updated:** YYYY-MM-DD

## Context
## Decision
## Consequences
## Alternatives considered
```
