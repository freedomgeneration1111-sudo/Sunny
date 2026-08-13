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
  "/privacy/",
  "/terms/",
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
  "/privacy/",
  "/terms/",
] as const;

/** The structural contract of the homepage, in page order. */
const homepageAnchors = [
  "hero",
  "trust-strip",
  "why-one-crew",
  "paths",
  "weddings",
  "shaadi",
  "parties",
  "corporate",
  "capabilities",
  "pricing-menu",
  "how-it-works",
  "cta",
] as const;

test("the homepage carries every section in order", async ({ page }) => {
  await page.goto("/");
  for (const anchor of homepageAnchors) {
    await expect(page.locator(`#${anchor}`), `#${anchor} should exist on the homepage`).toHaveCount(1);
  }

  // Why One Crew must come before the event shopping starts.
  const top = async (id: string) =>
    page.evaluate((anchor) => document.getElementById(anchor)!.getBoundingClientRect().top, id);
  expect(await top("why-one-crew")).toBeLessThan(await top("paths"));
  expect(await top("paths")).toBeLessThan(await top("weddings"));
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

test("primary navigation is event anchors plus pricing, without guides", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  for (const label of ["Weddings", "Shaadi", "Parties", "Corporate"]) {
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", /^#/);
  }
  await expect(nav.getByRole("link", { name: "Pricing", exact: true })).toHaveAttribute("href", "/pricing/");
  await expect(nav.getByRole("link", { name: "Guides", exact: true })).toHaveCount(0);

  await page.goto("/guides/");
  await expect(nav.getByRole("link", { name: "Weddings", exact: true })).toHaveAttribute("href", "/#weddings");
});

test("each event section links to its own pricing category", async ({ page }) => {
  await page.goto("/");
  for (const [anchor, target] of [
    ["weddings", "/pricing/#pricing-weddings"],
    ["shaadi", "/pricing/#pricing-shaadi"],
    ["parties", "/pricing/#pricing-parties"],
    ["corporate", "/pricing/#pricing-corporate"],
  ] as const) {
    const section = page.locator(`#${anchor}`);
    await expect(section.locator(`a[href="${target}"]`), `#${anchor} should link to ${target}`).toHaveCount(1);
    await expect(section.locator('a[href^="/check-availability"]')).not.toHaveCount(0);
  }
});

test("the footer carries every planning checklist and the legal routes", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  const checklists = footer.getByRole("navigation", { name: "Planning checklists" });
  await expect(checklists.getByRole("link")).toHaveCount(6);

  // Header and footer must not use the same label for different destinations.
  await expect(footer.getByRole("link", { name: "Wedding Planning Guide" })).toHaveAttribute("href", "/weddings/");
  await expect(footer.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy/");
  await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms/");
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

test("no customer-facing route narrates the development process", async ({ page }) => {
  const banned = /\b(draft|DEV reference|provisional|prototype|review build|pending approval|not yet approved|unsupported claim)\b/i;
  for (const route of ["/", "/pricing/", "/weddings/", "/events/corporate/", "/about/", "/guides/"]) {
    await page.goto(route);
    const text = await page.locator("main").innerText();
    expect(text, `${route} should read as a customer website`).not.toMatch(banned);
  }
});

test("work stays unpublished and out of the primary navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toHaveCount(0);

  await page.goto("/work/");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
});
