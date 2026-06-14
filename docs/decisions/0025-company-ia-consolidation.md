# 0025: Company menu consolidation (8 → 4)

- **Status:** Active
- **Date:** 2026-06-07

## Context

The Company mega-menu had grown to 8 items (About, Team, Partnership, Why Viewnear, Security & Trust, Life at Viewnear, Careers, Brand) with real content overlap. `/careers` duplicated `/life-at-viewnear` (culture + benefits) and only uniquely added open roles + an apply form; `/team` was essentially a subset of `/about` (which already renders the team cards); `/why-viewnear` was a sales case tied closely to `/partnership`; `/brand` is an internal guide, not a visitor destination. Goal: fewer, richer pages and a tighter menu, without breaking existing links or SEO.

## Decision

Merge the overlapping pages and add permanent redirects. The Company menu becomes four items: **About, Partnership, Life at Viewnear, Security & Trust** (Brand drops to the footer).

- **Careers into Life at Viewnear** (surviving URL `/life-at-viewnear`): the page is now an async server component that fetches `getJobOpenings()` and renders an "Open roles" section (`#open-roles`) plus the `ApplicationForm` ("Apply", `#apply`). Careers' culture/benefits blocks were dropped (Life's model + benefits already cover them). In-page CTAs point at `#open-roles`; the old "Meet the team" button points at `/about#team`.
- **Team into About:** the "how we staff" three-card block moved into About's team section, which now carries `id="team"`.
- **Why Viewnear into Partnership:** the "build vs. partner" comparison table moved into `/partnership` (`#comparison`); `/services` links there; the page's "Certified vs. generalist" CTA now points at `/services`.
- **Brand:** removed from the Company nav, kept reachable from the footer.
- Redirects in `next.config.mjs` (all permanent): `/careers` to `/life-at-viewnear`, `/team` to `/about`, `/why-viewnear` to `/partnership`.

Wiring updated in `config/theme.ts` (nav), `components/marketing/Nav.tsx` (`NAV_DESCRIPTIONS`), `components/marketing/Footer.tsx`, and `app/sitemap.ts`. The three old `page.tsx` route files were deleted.

## Consequences

- Shorter, clearer Company menu; less duplicated copy to maintain.
- Old URLs keep working via 308 redirects (links, bookmarks, SEO preserved).
- `/api/careers` and `ApplicationForm` are unchanged; the apply flow now lives on `/life-at-viewnear`.
- Static page count drops by three (the merged routes no longer generate).
