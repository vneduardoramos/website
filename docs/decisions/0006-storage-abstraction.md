# 0006: Storage abstraction + `STORAGE_DRIVER` fail-loud

- **Status:** Active
- **Date:** 2026-06-06   **Last updated:** 2026-06-07

## Context

The Media library accepts uploads. Local dev should write to the filesystem, but production (e.g. Vercel) has an **ephemeral** filesystem, so prod needs object storage (S3/R2/Blob).

## Decision

Define a `StorageAdapter` interface (`lib/storage/index.ts`) with a `save(buffer, filename, mimeType)` method returning `{ url, storageKey }`. The local filesystem adapter (`lib/storage/local.ts`) writes to `public/uploads`. `getStorage()` selects the adapter by the `STORAGE_DRIVER` env var.

`getStorage()` **honors `STORAGE_DRIVER` and fails loudly**: `"local"` returns the local adapter; `"s3"` throws a clear "not implemented yet" error; anything else throws "unknown driver". (Originally it ignored the var and always returned local, see Consequences.)

## Consequences

- The upload route (`app/api/upload/route.ts`) is storage-agnostic.
- Adding S3 = implement an adapter and add the `"s3"` branch, callers don't change.
- **Why fail-loud:** the previous version silently returned the local adapter regardless of `STORAGE_DRIVER`. On an ephemeral prod FS that would mean uploads vanish on the next deploy with no error. Failing loudly turns a silent data-loss trap into an obvious "implement the S3 adapter" message.

## Alternatives considered

- **Always-local (original)**, rejected: silent data loss in production.
- **Bake S3 in now**, deferred: no prod target/credentials yet; the seam is in place for when there is.
