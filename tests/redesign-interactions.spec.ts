import { expect, test } from "@playwright/test";

test("event plan uses session storage and remains editable in the existing inquiry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add to Plan" }).first().click();
  const summary = page.getByRole("complementary", { name: "Event plan summary" });
  await expect(summary).toBeVisible();
  await expect(summary).toContainText("Your plan: 1 item");
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("focuslab.event-plan.v1"))).toContain("wedding-dj-core");
  expect(await page.evaluate(() => localStorage.getItem("focuslab.event-plan.v1"))).toBeNull();
  await page.reload();
  await expect(summary).toContainText("Your plan: 1 item");
  await summary.getByRole("link", { name: /Continue/ }).click();
  await expect(page).toHaveURL(/\/check-availability\/\?interest=/);
  await expect(page.getByText("Carried from your plan")).toBeVisible();
  await expect(page.getByText("Wedding DJ\/MC", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Remove Wedding DJ\/MC" }).click();
  await expect(page.getByText("Carried from your plan")).toHaveCount(0);
});

test("pricing is one complete visible menu without tabs or hidden categories", async ({ page }) => {
  await page.goto("/pricing/");
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Weddings", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shaadi Celebrations" })).toBeVisible();
  await expect(page.locator("#pricing-photo-video")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Enhancements" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "3-Hour Party" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Corporate Production Full-Day" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to Plan" })).toHaveCount(32);
});

test("custom-priced selections never create a false exact subtotal", async ({ page }) => {
  await page.goto("/pricing/");
  const customCard = page.getByRole("article").filter({ hasText: "South Asian Celebration Media" });
  await expect(customCard).toContainText("Custom scope");
  await customCard.getByRole("button", { name: "Add to Plan" }).click();
  await expect(page.getByText("+ 1 custom-scope selection")).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Event plan summary" })).toContainText("1 custom-scope item");
});

test("first Add-to-Plan reveals a Shaadi-aware teaser without opening chat or colliding", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/v1/chat/status", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ state: "async", label: "Send us a Message", destinationUrl: null, checkedAt: new Date().toISOString() }),
  }));
  await page.goto("/south-asian-weddings/");
  await page.getByRole("button", { name: "Add to Plan" }).first().click();
  const teaser = page.getByTestId("chat-teaser");
  const plan = page.getByRole("complementary", { name: "Event plan summary" });
  await expect(teaser).toContainText("Need help shaping your Shaadi plan?");
  await expect(teaser.getByRole("button", { name: "Send us a Message" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const [teaserBox, planBox] = await Promise.all([teaser.boundingBox(), plan.boundingBox()]);
  expect(teaserBox).not.toBeNull();
  expect(planBox).not.toBeNull();
  expect(teaserBox!.y + teaserBox!.height).toBeLessThanOrEqual(planBox!.y);
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
