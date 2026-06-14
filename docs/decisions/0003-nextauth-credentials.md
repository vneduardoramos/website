# 0003: Auth: NextAuth Credentials + bcryptjs, single seeded admin

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

The CMS needs authentication. There is currently one administrator. We want no native build steps and a path to multi-user later.

## Decision

Use **NextAuth** with the **Credentials** provider (JWT session strategy), configured in `lib/auth.ts`:

- Passwords hashed with **`bcryptjs`** (pure JS, no native compilation).
- A single admin is seeded from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (`prisma/seed/seed.ts`).
- The `User.role` field exists for future multi-user; `role` is carried through the JWT/session callbacks.
- `middleware.ts` protects all `/admin` routes except `/admin/login`; `app/admin/(panel)/layout.tsx` and the server actions also re-check the session server-side.

## Consequences

- Simple, dependency-light auth with no native toolchain.
- Server Actions call `requireSession()` (`app/admin/actions.ts`) before any mutation.
- Multi-user/role-gating is not implemented yet, only presence-of-session is enforced. See "Alternatives".

## Alternatives considered

- **`bcrypt` (native)**, rejected: native build step; `bcryptjs` is sufficient.
- **OAuth/SSO provider**, deferred: overkill for a single internal admin; revisit if the team grows.
- **Role-based authorization now**, deferred: the `role` field is in place but not enforced; add when there's a second user type.
