# 0001: Stack: Next.js 14 App Router, one app for site + admin

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

ViewNear needs a public marketing site and a content-managed backend. We could split these into two apps/repos, or run them as one. The team is small and wants a single deploy, shared types, and shared theming.

## Decision

Build everything as one **Next.js 14 (App Router) + React 18 + TypeScript** application:

- Public marketing pages under the `app/(marketing)/` route group.
- The CMS under `app/admin/`, an open `login/` route plus an auth-guarded `(panel)/` route group.
- API routes under `app/api/` (auth, contact, careers, upload).
- Styling with Tailwind; server components by default, client components only where needed (forms, scroll-reveal).

## Consequences

- One codebase, one deploy, shared `config/theme.ts`, `lib/`, and Prisma client.
- Server Actions (`app/admin/actions.ts`) power CMS mutations without a separate API layer.
- Route groups keep marketing and admin chrome cleanly separated while sharing the root layout.
- Public pages use ISR (see [0007](0007-content-model-isr.md)); admin pages are `dynamic = "force-dynamic"`.

## Alternatives considered

- **Separate headless CMS (Contentful/Sanity) + static site**, rejected: adds external infra, cost, and a second system to learn for what is a modest content model we fully control.
- **Two apps (site + admin)**, rejected: duplicate theming/types and two deploys for no real benefit at this size.
