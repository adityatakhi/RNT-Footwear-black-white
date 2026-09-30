import { expect, test } from "@playwright/test";
test("sample storefront supports product browsing and keeps checkout closed", async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /built for more/i })).toBeVisible();
  await page.getByRole("link", { name: /explore the collection/i }).first().click();
  await expect(page.getByRole("heading", { name: /find your form/i })).toBeVisible();
  await expect(page.getByText("4 concepts")).toBeVisible();
  await page.locator(".product-card").first().hover();
  await page.locator(".product-card").first().getByRole("button", { name: /quick add/i }).click();
  await page.goto("/cart");
  await expect(page.getByText("Strata Runner")).toBeVisible();
  await page.goto("/checkout");
  await expect(page.getByText(/does not accept payments/i)).toBeVisible();
});
