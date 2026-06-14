# 0009: Upload hardening: MIME allowlist + size cap

- **Status:** Active
- **Date:** 2026-06-07   **Last updated:** 2026-06-07

## Context

`app/api/upload/route.ts` (admin Media library) accepted **any** file type and **any** size for authenticated users. The client input only sets `accept="image/*"`, which is a UI hint, not enforcement. Files are served from `/uploads` on the **same origin** as the admin, so a stored SVG with inline `<script>` is a stored-XSS vector; unbounded size is a memory/DoS risk.

## Decision

Validate server-side in the upload route:

- **MIME allowlist** of raster image types, `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/avif`. **SVG is deliberately excluded** (it can carry script). Reject others with `415`.
- **8 MB size cap**; reject larger with `413`.
- Surface the server's error message in `components/admin/MediaUploader.tsx` instead of a generic "Upload failed".

## Consequences

- The admin can no longer upload script-bearing SVGs or oversized files; users get a clear reason.
- If real SVG support is ever needed, sanitize server-side (e.g. DOMPurify/svg-sanitizer) before allowing it, do not simply add it to the allowlist.

## Alternatives considered

- **Client-side validation only**, rejected: trivially bypassed; the server is the trust boundary.
- **Allow SVG**, rejected: same-origin stored-XSS risk without sanitization.
