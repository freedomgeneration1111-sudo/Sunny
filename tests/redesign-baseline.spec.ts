import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/pricing/",
  "/weddings/",
  "/south-asian-weddings/",
  "/services/photo-video/",
  "/services/entertainment-production/",
  "/events/parties/",
  "/events/corporate/",
  "/about/",
  "/check-availability/",
  "/guides/",
] as const;

const indexableRoutes = [
  "/",
  "/weddings/",
  "/south-asian-weddings/",
  "/events/parties/",
  "/events/corporate/",
  "/services/photo-video/",
  "/services/entertainment-production/",
  "/pricing/",
  "/guides/",
  "/guides/wedding-day-coordination-checklist/",
  "/guides/shaadi-week-timeline/",
  "/guides/mehndi-baraat-valima-venue-checklist/",
  "/guides/corporate-av-checklist/",
  "/guides/photo-video-coverage-map/",
  "/guides/enhancements-venue-approval/",
] as const;

test("redesigned routes do not overflow the viewport", async ({ page }) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(widths.content, `${route} should fit the viewport`).toBeLessThanOrEqual(widths.viewport);
  }
});

test("production-capable public routes have no permanent robots block", async ({ page }) => {
  for (const route of indexableRoutes) {
    await page.goto(route);
    await expect(page.locator("meta[name=robots]"), route + " should be indexable outside review builds").toHaveCount(0);
  }
});

test("publication safeguards remain visible and work stays unpublished", async ({ page }) => {
  await page.goto("/pricing/");
  await expect(page.getByText(/Provisional and not approved for production publication/)).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toHaveCount(0);

  await page.goto("/work/");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  await expect(page.getByText(/No AI or proxy image is presented here as portfolio evidence/)).toBeVisible();
});
