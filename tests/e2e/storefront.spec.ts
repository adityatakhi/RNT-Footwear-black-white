import { expect, test } from "@playwright/test";
test("sample storefront supports product browsing and keeps checkout closed", async ({ page }) => {
  const hydrationErrors: string[] = [];
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    browserErrors.push(message.text());
    if (/hydration|hydrated/i.test(message.text())) hydrationErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    browserErrors.push(error.message);
    if (/hydration|hydrated/i.test(error.message)) hydrationErrors.push(error.message);
  });
  await page.addInitScript(() => {
    const injectExtensionAttribute = () => {
      if (!document.body) return false;
      document.body.setAttribute("cz-shortcut-listen", "true");
      return true;
    };
    if (!injectExtensionAttribute()) {
      const observer = new MutationObserver(() => {
        if (injectExtensionAttribute()) observer.disconnect();
      });
      observer.observe(document, { childList: true, subtree: true });
    }
    if (!sessionStorage.getItem("rnt-test-storage-cleared")) {
      localStorage.clear();
      sessionStorage.setItem("rnt-test-storage-cleared", "true");
    }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /step into your stride/i })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
  await page.getByRole("link", { name: /explore the collection/i }).first().click();
  await expect(page.getByRole("heading", { name: /find your stride/i })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.locator(".product-card").first().hover();
  await page.locator(".product-card").first().getByRole("button", { name: /quick add/i }).click();
  await expect.poll(
    () => page.evaluate(() => {
      const cart = localStorage.getItem("rnt-cart");
      return cart ? JSON.parse(cart).length : 0;
    }),
    { message: browserErrors.join("\n") || "Quick add did not persist the cart." }
  ).toBeGreaterThan(0);
  await page.goto("/cart");
  await expect(page.getByText("Strata Runner")).toBeVisible();
  await page.goto("/checkout");
  await expect(page.getByText(/does not accept payments/i)).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});
