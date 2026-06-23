# Image Editor Bug Fix Report

## Bug 1 — Saved override lost on reopen

### Repro
Log in, enable Edit Images, edit any image, set zoom to 1.3, Save (page reloads with
override applied). Enable Edit Images again, click Edit on the same image — editor opens
with zoom=1, focalX=50, focalY=50 (all defaults). Saving again would silently clobber
the saved values.

### Root cause confirmed
`EditRequest` type (EditModeProvider.tsx:6) carried only `{ key, baseSrc, alt }`.
`Img.tsx` reads the current override via `useImageOverride(key)` but passes none of it
into `openEditor(...)`. `ImageEditOverlay` initialises all four state values from
hardcoded defaults — never from any existing override.

### Fix (minimal)
1. `EditModeProvider.tsx`: added `override: ImageOverrideData | null` to `EditRequest`;
   imported `ImageOverrideData` from `@/lib/image-overrides`.
2. `Img.tsx`: passed `override: override ?? null` in the `openEditor(...)` call.
3. `ImageEditOverlay.tsx`: changed all four `useState` initialisers to read from
   `request.override` when present, falling back to defaults:
   - `mediaUrl = request.override?.mediaUrl ?? null`
   - `focalX = request.override?.focalX ?? 50`
   - `focalY = request.override?.focalY ?? 50`
   - `zoom  = request.override?.zoom  ?? 1`
   - `alt   = request.override?.alt   ?? request.alt`

"Reset to default" path unchanged — it still DELETEs the override and reloads.

---

## Bug 2 — Focal drag does nothing

### Repro
Open the editor. Click-drag anywhere on the preview image. The image does not move;
focalX/focalY stay at 50/50; the `objectPosition` style never changes.

### Root cause confirmed
The preview `<img>` inside the drag frame is natively draggable. On mousedown, the
browser initiates a native image-drag gesture. That gesture consumes the subsequent
mousemove events at the OS level, so the `onMouseMove` handler on the parent `<div>`
never sees `e.buttons === 1` — meaning `setFocalX`/`setFocalY` are never called.

### Fix (minimal)
In `ImageEditOverlay.tsx`, in the preview frame:
- Added `draggable={false}` to the `<img>` — disables the native image drag.
- Added `onMouseDown={(e) => e.preventDefault()}` to the frame `<div>` — suppresses
  text/element selection that also competes with the mouse handler.
- Added `select-none` to the frame's `className` — belt-and-suspenders against
  text-selection artifacts.

No other behaviour changed (zoom slider, upload, Pexels, Save/Reset/Cancel).

---

## Verification

### tsc --noEmit
Exit 0. No type errors.

### vitest run
37/37 tests pass (4 test files).

### Playwright evidence

Both tests run against the live dev server (http://localhost:3005):

**Bug 1 test** (`Bug 1 – editor reopens with saved override (zoom + focal)`):
- Sets zoom slider to 1.3 and saves.
- After page reload, reopens the same editor.
- Asserts the slider value > 1.1 (i.e., NOT the default 1).
- Result: PASS (3.9 s).

**Bug 2 test** (`Bug 2 – focal drag updates object-position on live image`):
- Drags from the top 10% to the bottom 85% of the preview frame.
- Reads `style.objectPosition` during the drag; asserts focalY > 60%.
- Saves and asserts at least one `<img>` on the live page has a non-default
  `object-position` inline style.
- Result: PASS (3.6 s).

Full run output:
```
Running 2 tests using 1 worker
  ✓  1 [chromium] › e2e/image-editor-bugs.spec.ts:45:5 › Bug 1 – editor reopens with saved override (zoom + focal) (3.9s)
  ✓  2 [chromium] › e2e/image-editor-bugs.spec.ts:79:5 › Bug 2 – focal drag updates object-position on live image (3.6s)
2 passed (8.3s)
```

---

## Self-review

- Both fixes are minimal — no unrelated code touched, no new dependencies.
- The `override ?? null` coercion in Img.tsx is safe: `useImageOverride` already returns
  `null` when no override exists, so no widening issue.
- `draggable={false}` is a standard HTML attribute; Playwright's headless Chromium
  respects it. The `onMouseDown` preventDefault does not break the zoom slider or the
  file-input (those are outside the frame div).
- Tailwind opacity constraint respected: no new opacity utilities added.
- The Playwright test file and `playwright.config.ts` are new files in the repo; the
  spec imports from `playwright/test` (the installed package, not `@playwright/test`
  which is not installed).
- object-position only visibly moves images that are `object-cover`-cropped. The test
  verifies the style value changes (not a visual pixel diff), which is the correct
  assertion given that any image on the home page may or may not be in a fixed-size
  container at test time.
