import { expect, test } from "@playwright/test";

test("event plan persists into the sticky bar and availability form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add to Plan" }).first().click();
  const summary = page.getByRole("complementary", { name: "Event plan summary" });
  await expect(summary).toBeVisible();
  await expect(summary).toContainText("Your plan: 1 item");
  await summary.getByRole("link", { name: /Continue/ }).click();
  await expect(page).toHaveURL(/\/check-availability\/\?interest=/);
  await expect(page.getByText("Carried from your plan")).toBeVisible();
  await expect(page.getByText("Wedding DJ\/MC", { exact: true })).toBeVisible();
});

test("pricing tabs expose distinct planning groups", async ({ page }) => {
  await page.goto("/pricing/");
  const tabs = page.getByRole("tablist", { name: "Event pricing" });
  await expect(tabs).toBeVisible();
  await tabs.getByRole("tab", { name: "Corporate" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Corporate Production Half-Day");
  await expect(page.getByRole("tabpanel")).not.toContainText("3-Hour Party");
});

for (const width of [320, 390, 768, 1440]) {
  test(`key decision pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const route of ["/", "/pricing/", "/check-availability/"]) {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
      expect(sizes.content, `${route} at ${width}px`).toBeLessThanOrEqual(sizes.viewport);
    }
    if (process.env.CAPTURE_LAYOUT === "1") {
      await page.goto("/");
      await page.screenshot({ path: `artifacts/screenshots/home-${width}.png`, fullPage: true });
    }
  });
}
