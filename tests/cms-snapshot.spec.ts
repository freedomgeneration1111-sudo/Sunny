import { expect, test } from "@playwright/test";

test("an explicit CMS snapshot renders the exact pricing draft", async ({ page }) => {
  test.skip(!process.env.FOCUS_CMS_SNAPSHOT_PATH, "requires an explicit CMS snapshot build");

  await page.goto("/pricing/");
  await expect(page.getByText("3-Hour Party Preview", { exact: true })).toBeVisible();
  await expect(page.getByText("$676", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("3-Hour Party — $650");

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(contentWidth).toBeLessThanOrEqual(viewportWidth);
});
