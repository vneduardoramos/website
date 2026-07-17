import type { Page } from "@playwright/test";

export const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@viewnear.com";
export const E2E_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "changeme123";

/** Log in via the admin credentials form using env-driven (or default) test credentials. */
export async function login(page: Page) {
  await page.goto("/admin/login");
  await page.locator('input[type="email"]').fill(E2E_ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(E2E_ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/admin/login"), { timeout: 10_000 });
}
