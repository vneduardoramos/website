# 0013: American English spelling + "data & AI" terminology

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

The copy (inherited from a UK/EMEA scrape) mixed British and American spelling (optimisation/programme/visualise vs optimize/program/visualize) and inconsistent terminology, notably the service titled "AI & Data Strategy" while everywhere else used "data & AI". ViewNear targets the Americas.

## Decision

- **American English** for all visible copy: optimize, program, organization, visualization, color, license, fulfill, prioritize, analyze, recognize, etc. Applied across `prisma/seed/data.ts`, `app/(marketing)/**`, `components/marketing/**`, and `privacy/page.tsx`.
- **URL slugs are exempt** to avoid breaking links, e.g. the service slug `data-visualisation` and its `SERVICE_ICONS` key stay British; only the human-readable title became "Data Visualization".
- **Terminology:** standardize on "**data & AI**" ordering; the service was renamed **"Data & AI Strategy"** (slug `ai-data-strategy` unchanged).

## Consequences

- Consistent voice for the target audience.
- A guard grep (`optimis|visualis|programme|organis|recognis|colour|prioritis|…` excluding `data-visualisation`) should return only the intentional slug.
- The full word-list and the slug-exemption rule live in [`content-style-guide.md`](../content-style-guide.md).

## Alternatives considered

- **Standardize to British English**, rejected: audience is the Americas.
- **Rename the `data-visualisation` slug too**, rejected: would break existing/SEO URLs for no real gain.
