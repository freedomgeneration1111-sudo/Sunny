import { expect, test } from "@playwright/test";

test("the pricing page is one complete visible menu without tabs", async ({ page }) => {
  await page.goto("/pricing/");
  await expect(page.getByRole("tablist")).toHaveCount(0);

  for (const slug of ["weddings", "asian-weddings", "parties", "corporate", "photo-video", "enhancements"]) {
    await expect(page.locator(`#pricing-${slug}`), `${slug} category should be visible`).toBeVisible();
  }

  // Every service in the inventory is on the page, in its natural price mode.
  await expect(page.getByRole("article")).toHaveCount(32);
  await expect(page.getByText("$675", { exact: true })).toBeVisible();
  await expect(page.getByText("From $1,700", { exact: true })).toBeVisible();
  await expect(page.getByText("$175/hour", { exact: true })).toBeVisible();
  await expect(page.getByText("Custom Quote").first()).toBeVisible();
});

test("the public site does not simulate a quote", async ({ page }) => {
  for (const route of ["/", "/pricing/", "/weddings/"]) {
    await page.goto(route);
    await expect(page.getByRole("button", { name: "Add to Plan" }), `${route} should not offer Add to Plan`).toHaveCount(0);
    await expect(page.getByRole("complementary", { name: "Event plan summary" })).toHaveCount(0);
    await expect(page.getByText(/running total/i)).toHaveCount(0);
    await expect(page.getByText(/subtotal/i)).toHaveCount(0);
  }
});

test("the homepage points at pricing rather than repeating the menu", async ({ page }) => {
  await page.goto("/");
  const bridge = page.locator("#pricing-menu");
  await expect(bridge.getByRole("link", { name: "View Pricing" })).toHaveAttribute("href", "/pricing/");
  // The full catalog lives on /pricing; the homepage must stay compact.
  await expect(bridge.getByRole("article")).toHaveCount(0);
});

test("check availability works without planner carryover", async ({ page }) => {
  await page.goto("/");
  await page.locator("#cta").getByRole("link", { name: /Check Availability/ }).click();
  await expect(page).toHaveURL(/\/check-availability\//);
  await expect(page.getByText("Services you selected")).toHaveCount(0);

  await expect(page.getByRole("group", { name: "Start with the event." })).toBeVisible();
  await page.getByRole("button", { name: "Wedding", exact: true }).click();
  await page.getByLabel("Preferred date").fill("2027-04-17");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("group", { name: "How should Focus Lab reach you?" })).toBeVisible();
});

test("guide pages open commercially before the planning material", async ({ page }) => {
  await page.goto("/weddings/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "See Wedding Pricing" })).toHaveAttribute(
    "href",
    "/pricing/#pricing-weddings",
  );

  const pricingTop = await page.getByRole("link", { name: "See Wedding Pricing" }).boundingBox();
  const contentsTop = await page.getByRole("navigation", { name: "Guide contents" }).boundingBox();
  expect(pricingTop!.y, "pricing should appear before the guide contents").toBeLessThan(contentsTop!.y);
});

test("the contextual chat teaser still appears without opening chat", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/v1/chat/status", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        state: "async",
        label: "Send us a Message",
        destinationUrl: null,
        checkedAt: new Date().toISOString(),
      }),
    }),
  );
  await page.goto("/asian-weddings/");
  const teaser = page.getByTestId("chat-teaser");
  await expect(teaser).toBeVisible({ timeout: 30_000 });
  await expect(teaser).toContainText("Need help shaping your Asian wedding plan?");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`key decision pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const route of ["/", "/pricing/", "/check-availability/", "/about/", "/privacy/"]) {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(sizes.content, `${route} at ${width}px`).toBeLessThanOrEqual(sizes.viewport);
    }
  });
}
