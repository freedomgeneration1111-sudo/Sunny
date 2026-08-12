import { expect, test, type Page } from "@playwright/test";

const importantRoutes = [
  "/",
  "/south-asian-weddings/",
  "/weddings/",
  "/events/parties/",
  "/events/corporate/",
  "/services/photo-video/",
  "/services/entertainment-production/",
  "/pricing/",
  "/work/",
  "/about/",
  "/check-availability/",
  "/guides/",
  "/guides/wedding-day-coordination-checklist/",
  "/guides/shaadi-week-timeline/",
  "/guides/mehndi-baraat-valima-venue-checklist/",
  "/guides/corporate-av-checklist/",
  "/guides/photo-video-coverage-map/",
  "/guides/enhancements-venue-approval/",
] as const;

async function expectPageShell(page: Page) {
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
}

test("important routes render", async ({ page }) => {
  for (const route of importantRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should return a successful response`).toBeTruthy();
    await expectPageShell(page);
    const customerFacingText = (await page.locator("main").innerText()).replace(/\s+/g, " ").trim();
    expect(customerFacingText.length, route + " should contain substantive customer-facing content").toBeGreaterThan(250);
  }
});

test("homepage loads at desktop and mobile project viewports", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
});

test("rendered navigation contains no broken internal links", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter((href): href is string => Boolean(href)),
  );
  const paths = [...new Set(hrefs.map((href) => new URL(href, "http://local").pathname))];
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should not be a broken internal link`).toBeTruthy();
  }
});

test("check-availability flow renders and advances", async ({ page }) => {
  await page.goto("/check-availability/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("group", { name: "Start with the event." })).toBeVisible();
  await page.getByRole("button", { name: "Wedding", exact: true }).click();
  await page.locator('input[type="date"]').fill("2027-04-17");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("group", { name: "Shape the starting scope." })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("group", { name: "How should Focus Lab reach you?" })).toBeVisible();
});
