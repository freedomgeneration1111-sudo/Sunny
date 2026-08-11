import { expect, test } from "@playwright/test";

test("homepage header moves from expanded to compact without losing conversion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const header = page.getByTestId("site-header");
  await expect(header).toHaveAttribute("data-header-state", "expanded");
  await expect(page.locator("[data-media-mode=simulated]")).toBeVisible();

  const availability = header.getByRole("link", { name: "Check Availability" });
  await expect(availability).toHaveAttribute("href", "/check-availability/");

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-header-state", "compact");
  await expect(availability).toBeVisible();
  await availability.click();
  await expect(page).toHaveURL(/\/check-availability\/$/,{timeout:30_000});
});

test("mobile hero navigation remains usable in both identity states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNavigation = page.getByRole("navigation", { name: "Mobile primary" });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Check Availability" })).toHaveAttribute(
    "href",
    "/check-availability/",
  );

  await page.getByRole("button", { name: "Close menu" }).click();
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await expect(page.getByTestId("site-header")).toHaveAttribute("data-header-state", "compact");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(mobileNavigation).toBeVisible();
});

test("reduced motion uses a static hero poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const media = page.locator("[data-reduced-motion-fallback=poster]");
  await expect(media).toBeVisible();
  await expect(media.locator(".cinematic-poster")).toHaveCSS("animation-name", "none");
});
