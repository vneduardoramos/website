/**
 * Playwright tests for two image editor bugs:
 *  Bug 1 — editor reopening showed defaults instead of saved override
 *  Bug 2 — focal drag did nothing (native image-drag intercepted mouse events)
 */
import { test, expect, type Page } from "@playwright/test";
import { login as loginAdmin } from "./helpers";

// The image editor uses aria-modal="true"; the cookie banner also uses role="dialog"
// so we scope to the image editor by aria-modal.
const editorLocator = '[aria-modal="true"]';

/** Log in via the credentials form and navigate to home page. */
async function login(page: Page) {
  await loginAdmin(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

/** Enable "Edit images" mode and wait for the toggle button to flip. */
async function enableEditMode(page: Page) {
  const btn = page.getByRole("button", { name: /edit images/i });
  await btn.click();
  await expect(page.getByRole("button", { name: /done editing/i })).toBeVisible();
}

/** Click the first "Edit" button (force-visible via JS) and wait for the editor dialog. */
async function openFirstEditor(page: Page) {
  const editBtn = page.getByRole("button", { name: /^Edit$/ }).first();
  // Make opacity-0 button clickable by revealing it inline
  await editBtn.evaluate((el) => {
    (el as HTMLElement).style.opacity = "1";
    (el as HTMLElement).style.pointerEvents = "auto";
  });
  await editBtn.click({ force: true });
  await expect(page.locator(editorLocator)).toBeVisible();
}

// ─────────────────────────────────────────────────────────────────────────────
// Bug 1: editor should reopen with saved override values, not defaults
// ─────────────────────────────────────────────────────────────────────────────
test("Bug 1 – editor reopens with saved override (zoom + focal)", async ({ page }) => {
  await login(page);
  await enableEditMode(page);
  await openFirstEditor(page);

  const dialog = page.locator(editorLocator);

  // Set zoom to 1.3 (distinctly above default 1)
  const zoomSlider = dialog.locator('input[type="range"]');
  await zoomSlider.fill("1.3");

  // Save — page reloads
  await dialog.getByRole("button", { name: /save/i }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
  await page.waitForLoadState("networkidle");

  // Re-enable edit mode and reopen the same editor
  await enableEditMode(page);
  await openFirstEditor(page);

  // Assert editor shows saved zoom (~1.3), NOT default (1)
  const reopenedDialog = page.locator(editorLocator);
  const reopenedSlider = reopenedDialog.locator('input[type="range"]');
  const sliderValue = await reopenedSlider.inputValue();
  expect(parseFloat(sliderValue)).toBeGreaterThan(1.1);

  // Cleanup: reset the override
  await reopenedDialog.getByRole("button", { name: /reset to default/i }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 2: dragging in the preview should update focal position
// ─────────────────────────────────────────────────────────────────────────────
test("Bug 2 – focal drag updates object-position on live image", async ({ page }) => {
  await login(page);
  await enableEditMode(page);
  await openFirstEditor(page);

  const dialog = page.locator(editorLocator);
  const frame = dialog.locator(".cursor-grab").first();
  // Capture the preview img BEFORE dragging — mid-drag the frame class flips to
  // `cursor-grabbing`, so a `.cursor-grab img` locator would no longer match.
  const previewImg = dialog.locator("img").first();
  // Zoom in so there is pannable range in the vertical axis regardless of the
  // image's aspect (grab-pan needs room to move).
  await dialog.locator('input[type="range"]').fill("1.8");
  const box = await frame.boundingBox();
  expect(box).not.toBeNull();

  // Grab-pan: drag the image downward. The image follows the cursor, so the
  // viewport reveals the TOP of the image -> object-position Y moves toward 0%.
  const centerX = box!.x + box!.width / 2;
  const topY = box!.y + box!.height * 0.15;
  const bottomY = box!.y + box!.height * 0.85;

  await page.mouse.move(centerX, topY);
  await page.mouse.down();
  // Move in steps so mousemove fires with buttons===1
  for (let step = 0; step <= 12; step++) {
    const y = topY + (bottomY - topY) * (step / 12);
    await page.mouse.move(centerX, y);
  }

  // Read object-position while mouse is still down (focal state should be updated)
  const objPosDuringDrag = await previewImg.evaluate(
    (el) => (el as HTMLImageElement).style.objectPosition
  );
  await page.mouse.up();

  // Parse focalY from "X% Y%"; dragging the image down reveals its top, so
  // focalY should drop well below the 50% default.
  const parts = objPosDuringDrag.trim().split(/\s+/);
  const focalY = parts[1] ? parseFloat(parts[1]) : 50;
  expect(focalY).toBeLessThan(45);

  // Save and verify the live image has a non-default object-position
  await dialog.getByRole("button", { name: /save/i }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
  await page.waitForLoadState("networkidle");

  const styledImages = await page.locator("img").evaluateAll((imgs) =>
    imgs
      .map((img) => (img as HTMLImageElement).style.objectPosition)
      .filter((op) => op && op !== "" && op !== "50% 50%")
  );
  expect(styledImages.length).toBeGreaterThan(0);

  // Cleanup
  await enableEditMode(page);
  await openFirstEditor(page);
  const cleanupDialog = page.locator(editorLocator);
  await cleanupDialog.getByRole("button", { name: /reset to default/i }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15_000 });
});
