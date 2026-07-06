# Content publishing: local is the source of truth

The deployed site cannot be edited: middleware 404s the whole admin surface
(/admin, the auth endpoints, and the admin-only APIs) outside local dev unless
`ADMIN_ENABLED="true"` is set. Production content ships from your machine
through git.

## The workflow

1. Edit content locally in the CMS (http://localhost:3000/admin) or via seed.
2. `npm run content:export` - snapshots every content table from your local
   DB into `prisma/content-snapshot.json` (committed).
3. Commit and push. The Render build (`npm run build`) runs
   `content-sync.ts import` after `prisma db push`, mirroring the snapshot
   into Neon before `next build` prerenders pages.

Prod therefore always matches the last exported local state. Forgetting step 2
means a deploy ships code changes with the previous content snapshot.

## What syncs and what never does

Synced (mirrored exactly, including deletions): Tag, Client, Industry, Media
(rows only; files already live on shared R2), TeamMember, Service, SiteSetting,
NewsEvent, JobOpening, CaseStudy, BlogPost (+ tag links), ImageOverride.

Never synced: `User` (auth secrets stay per-environment), `Lead` and
`JobApplication` (production-generated; they survive every deploy). A stale
row that production data still references (e.g. a JobOpening with
applications) is kept with a warning instead of failing the build.

## Safety rails

- `import` is a no-op unless the `RENDER` env var is present (Render sets it
  automatically) or `--force` is passed, so a local `npm run build` never
  touches your dev DB.
- `npm run content:import` (forced) exists for pointing DATABASE_URL at
  another environment deliberately.
- BlogPost.authorId is dropped on export (it references the unsynced User
  table); bylines render from authorTeamId.
