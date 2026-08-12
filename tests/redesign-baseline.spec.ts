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

/** The structural contract of the one-anchor homepage, in page order. */
const homepageAnchors = [
  "hero",
  "trust-strip",
  "paths",
  "weddings",
  "shaadi",
  "parties",
  "corporate",
  "why-one-crew",
  "capabilities",
  "pricing-menu",
  "how-it-works",
  "cta",
] as const;

test("the homepage carries every one-anchor section", async ({ page }) => {
  await page.goto("/");
  for (const anchor of homepageAnchors) {
    await expect(page.locator(`#${anchor}`), `#${anchor} should exist on the homepage`).toHaveCount(1);
  }
});

test("event path cards scroll within the page instead of navigating away", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#paths a[href]");
  await expect(cards).toHaveCount(4);
  for (const href of await cards.evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
    expect(href, "event path cards must be in-page anchors").toMatch(/^#(weddings|shaadi|parties|corporate)$/);
  }

  await cards.filter({ hasText: "Shaadi" }).click();
  await expect(page).toHaveURL(/#shaadi$/);
  await expect(page.locator("#shaadi")).toBeInViewport();
});

test("primary navigation targets homepage anchors", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const label of ["Weddings", "Shaadi", "Parties", "Corporate", "Pricing"]) {
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", /^#/);
  }
  // From a supporting page the same links must cross-navigate back to the homepage.
  await page.goto("/guides/");
  await expect(nav.getByRole("link", { name: "Weddings", exact: true })).toHaveAttribute("href", "/#weddings");
});

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

test("every indexable route declares a self-referencing canonical", async ({ page }) => {
  for (const route of indexableRoutes) {
    await page.goto(route);
    await expect(page.locator("link[rel=canonical]"), route + " should declare one canonical").toHaveCount(1);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", new RegExp(`${route}$`));
  }
});

test("the duplicate event routes no longer publish a second copy", async ({ request }) => {
  for (const duplicate of ["/parties/", "/corporate/"]) {
    const response = await request.get(duplicate, { maxRedirects: 0 });
    expect(response.status(), `${duplicate} must not serve a duplicate page`).not.toBe(200);
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
