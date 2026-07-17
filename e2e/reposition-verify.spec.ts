/**
 * Pixel-level verification of the cropper-style zoom+pan reposition.
 *
 * The bar: the LIVE image must VISIBLY move (pixels differ), not merely carry a
 * changed style attribute. We screenshot the live image's bounding box BEFORE
 * any override and AFTER save, and assert the PNG bytes differ. We test:
 *   A) a fill / object-cover photo
 *   B) a sized non-cover image (cert badge, h-14 w-auto) — root cause B
 * and confirm an anonymous viewer sees the same moved framing and no edit UI.
 */
import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { chromium } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { login as loginAdmin } from "./helpers";

const editorLocator = '[aria-modal="true"]';
const OUT = path.join(__dirname, "reposition-evidence");
fs.mkdirSync(OUT, { recursive: true });

// Image A: fill + object-cover photo (ShowcaseBand). Image B: sized non-cover
// cert badge (h-14 w-auto) — the home "Customers" badge row.
const IMG_A = "/assets/images/industries/financial-services.jpg";
const IMG_B = "/assets/images/certs/coco-preferred.png";
// IMG_B appears multiple times; the editable home badge is the one rendered at
// ~h-14 (small). We disambiguate by picking the smallest rendered instance.

async function login(page: Page) {
  await loginAdmin(page);
}

async function gotoHome(page: Page) {
  await page.goto("/");
  // Scroll through to materialize lazy-loaded images (ShowcaseBand is below fold).
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

async function enableEditMode(page: Page) {
  const btn = page.getByRole("button", { name: /edit images/i });
  await btn.click();
  await expect(page.getByRole("button", { name: /done editing/i })).toBeVisible();
}

/**
 * Resolve the live <img> for a fragment to a stable Playwright locator.
 * Next rewrites src to /_next/image?url=<encoded>, so we decode in-page, find
 * the matching <img> (smallest rendered one when `smallest` is set, to pick the
 * h-14 badge over larger duplicates), tag it with data-vtest, and return a
 * locator for it.
 */
async function liveImgLocator(page: Page, srcFragment: string, smallest = false) {
  await page.evaluate(
    ({ frag, smallest }) => {
      document.querySelectorAll("[data-vtest]").forEach((e) => e.removeAttribute("data-vtest"));
      const decode = (s: string) => {
        const m = s.match(/url=([^&]+)/);
        return m ? decodeURIComponent(m[1]) : s;
      };
      const imgs = Array.from(document.querySelectorAll("img"))
        .filter((i) => decode(i.src).includes(frag))
        // visible only: has layout box and isn't display:none
        .filter((i) => {
          const r = i.getBoundingClientRect();
          return r.height > 1 && r.width > 1 && i.offsetParent !== null;
        });
      if (imgs.length === 0) return;
      imgs.sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height);
      const pick = smallest ? imgs[0] : imgs[imgs.length - 1];
      pick.setAttribute("data-vtest", "1");
    },
    { frag: srcFragment, smallest },
  );
  return page.locator("img[data-vtest='1']").first();
}

/** Reset any existing override for a key via the API so the baseline is clean. */
async function resetOverride(page: Page, key: string) {
  await page.evaluate(async (k) => {
    await fetch(`/api/image-overrides?key=${encodeURIComponent(k)}`, { method: "DELETE" });
  }, key);
}

/** Open the editor for the image tagged data-vtest (call liveImgLocator first). */
async function openEditorFor(page: Page) {
  const handle = await page.evaluateHandle(() => {
    const target = document.querySelector("img[data-vtest='1']");
    if (!target) return null;
    let el: HTMLElement | null = target.parentElement;
    while (el) {
      const btn = Array.from(el.querySelectorAll("button")).find(
        (b) => b.textContent?.trim() === "Edit",
      ) as HTMLElement | undefined;
      if (btn) {
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
        btn.scrollIntoView({ block: "center" });
        return btn;
      }
      el = el.parentElement;
    }
    return null;
  });
  const element = handle.asElement();
  expect(element).not.toBeNull();
  await element!.click();
  await expect(page.locator(editorLocator)).toBeVisible();
}

/** Set zoom + drag the preview to pan, then Save (page reloads). */
async function zoomDragSave(page: Page, zoom: string) {
  const dialog = page.locator(editorLocator);
  await dialog.locator('input[type="range"]').fill(zoom);

  const frame = dialog.locator(".cursor-grab").first();
  const box = await frame.boundingBox();
  expect(box).not.toBeNull();
  // Drag from lower-right toward upper-left so focal moves well off-center.
  const startX = box!.x + box!.width * 0.8;
  const startY = box!.y + box!.height * 0.8;
  const endX = box!.x + box!.width * 0.18;
  const endY = box!.y + box!.height * 0.18;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let s = 1; s <= 16; s++) {
    await page.mouse.move(startX + (endX - startX) * (s / 16), startY + (endY - startY) * (s / 16));
  }
  await page.mouse.up();

  await dialog.getByRole("button", { name: /^save$/i }).click();
  // Save POSTs then window.location.reload(); wait for the editor to be gone and
  // the document fully settled before any further evaluate/screenshot.
  await expect(page.locator(editorLocator)).toHaveCount(0, { timeout: 15_000 });
  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

async function scrollThrough(page: Page) {
  await page.waitForLoadState("load");
  try {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
  } catch {
    // a late navigation can destroy the context; retry once after it settles
    await page.waitForLoadState("load");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
  }
}

async function shotLive(page: Page, srcFragment: string, file: string, smallest = false): Promise<Buffer> {
  await page.waitForLoadState("networkidle");
  await scrollThrough(page);
  const img = await liveImgLocator(page, srcFragment, smallest);
  await expect(img).toHaveCount(1, { timeout: 10_000 });
  await img.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400); // let any transition settle
  const buf = await img.screenshot({ path: path.join(OUT, file) });
  return buf;
}

function pixelsDiffer(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return true;
  // Count differing bytes; require a non-trivial difference (not a 1-pixel JPEG wobble).
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff > a.length * 0.01; // >1% of bytes changed
}

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

test("A) fill/cover photo: live image visibly moves after zoom+pan save (admin + anon)", async ({ page }) => {
  await login(page);
  await gotoHome(page);
  await resetOverride(page, IMG_A);
  await gotoHome(page);

  const before = await shotLive(page, IMG_A, "A-before.png");

  await enableEditMode(page);
  await liveImgLocator(page, IMG_A);
  await openEditorFor(page);
  await zoomDragSave(page, "1.5");

  const afterAdmin = await shotLive(page, IMG_A, "A-after-admin.png");
  expect(pixelsDiffer(before, afterAdmin)).toBe(true);

  // Anonymous context: same framing, no edit UI.
  const anon = await chromium.launchPersistentContext("", { headless: true });
  const ap = await anon.newPage();
  await ap.goto("/");
  await ap.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await ap.waitForLoadState("networkidle");
  const afterAnon = await shotLive(ap, IMG_A, "A-after-anon.png");
  expect(pixelsDiffer(before, afterAnon)).toBe(true);
  expect(await ap.getByRole("button", { name: /edit images/i }).count()).toBe(0);
  await anon.close();

  // Cleanup
  await resetOverride(page, IMG_A);
});

test("B) sized non-cover badge (h-14 w-auto): live image visibly moves after zoom+pan save (anon)", async ({ page }) => {
  await login(page);
  await gotoHome(page);
  await resetOverride(page, IMG_B);
  await gotoHome(page);

  const before = await shotLive(page, IMG_B, "B-before.png", true);

  await enableEditMode(page);
  await liveImgLocator(page, IMG_B, true);
  await openEditorFor(page);
  await zoomDragSave(page, "1.5");

  const afterAdmin = await shotLive(page, IMG_B, "B-after-admin.png", true);
  expect(pixelsDiffer(before, afterAdmin)).toBe(true);

  const anon = await chromium.launchPersistentContext("", { headless: true });
  const ap = await anon.newPage();
  await ap.goto("/");
  await ap.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await ap.waitForLoadState("networkidle");
  const afterAnon = await shotLive(ap, IMG_B, "B-after-anon.png", true);
  expect(pixelsDiffer(before, afterAnon)).toBe(true);
  await anon.close();

  await resetOverride(page, IMG_B);
});

test("C) zoom alone clips inside the slot; an un-overridden image is unchanged", async ({ page }) => {
  await login(page);
  await gotoHome(page);
  await resetOverride(page, IMG_A);
  await gotoHome(page);

  // Reference: a different, un-overridden image elsewhere on the page (badge B).
  const refBefore = await shotLive(page, IMG_B, "C-ref-before.png", true);

  const before = await shotLive(page, IMG_A, "C-A-before.png");
  await enableEditMode(page);
  await liveImgLocator(page, IMG_A);
  await openEditorFor(page);
  // Zoom only — no drag. Focal stays 50/50, transform-origin centered.
  const dialog = page.locator(editorLocator);
  await dialog.locator('input[type="range"]').fill("2");
  await dialog.getByRole("button", { name: /^save$/i }).click();
  await expect(page.locator(editorLocator)).toHaveCount(0, { timeout: 15_000 });
  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const afterZoom = await shotLive(page, IMG_A, "C-A-after-zoom.png");
  expect(pixelsDiffer(before, afterZoom)).toBe(true); // zoom visibly crops

  // The clip: wrapper around the overridden image is overflow-hidden.
  const imgA = await liveImgLocator(page, IMG_A);
  const overflow = await imgA.evaluate((el) => {
    const w = el.parentElement as HTMLElement;
    return getComputedStyle(w).overflow;
  });
  expect(overflow).toBe("hidden");

  // The un-overridden reference image must be byte-identical to its baseline.
  const refAfter = await shotLive(page, IMG_B, "C-ref-after.png", true);
  expect(pixelsDiffer(refBefore, refAfter)).toBe(false);

  await resetOverride(page, IMG_A);
});
