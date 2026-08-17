import { expect, test } from "@playwright/test";

test("homepage header moves from expanded to compact without losing conversion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const header = page.getByTestId("site-header");
  await expect(header).toHaveAttribute("data-header-state", "expanded");
  await expect(page.locator("[data-media-mode=video-ready]")).toBeVisible();

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
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/focuslab-desktop-hero-selection-\d+\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const media = page.locator("[data-reduced-motion-fallback=poster]");
  await expect(media).toBeVisible();

  // The hero ships a landscape and a portrait still; exactly one is shown.
  await expect(media.locator(".cinematic-poster")).toHaveCount(2);
  const shown = media.locator(".cinematic-poster:visible");
  await expect(shown).toHaveCount(1);
  await expect(shown).toHaveCSS("animation-name", "none");
  await expect(media.locator("video")).toHaveCount(0);
  expect(videoRequests).toEqual([]);
});

test("desktop hero loads only the selected looping candidate", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/focuslab-desktop-hero-selection-\d+\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });
  await page.goto("/");
  const video = page.getByTestId("desktop-hero-video");
  const hero = page.locator("#hero");
  const initialHeroBox = await hero.boundingBox();
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("data-candidate", "selection-08");
  expect(await video.evaluate((el: HTMLVideoElement) => el.loop)).toBe(true);
  expect(await video.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("poster", /selection-08-poster\.jpg$/);

  const sourceUrls = await video.locator("source").evaluateAll((sources) =>
    sources.map((source) => source.getAttribute("src")),
  );
  expect(sourceUrls.every((url) => url?.includes("selection-08"))).toBe(true);
  await expect(page.getByRole("heading", { name: "One event. One crew. Zero handoffs." })).toBeVisible();
  await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
  expect(videoRequests.every((url) => url.includes("selection-08"))).toBe(true);

  await page.getByRole("button", { name: "Show Arrival and couple moment" }).click();
  await expect(video).toHaveAttribute("data-candidate", "selection-31");
  await expect(video.locator("source").first()).toHaveAttribute("src", /selection-31\.webm$/);

  await page.getByRole("button", { name: "Show Blue atmospheric couple moment" }).click();
  await expect(video).toHaveAttribute("data-candidate", "selection-43");
  await expect(video).toHaveAttribute("poster", /selection-43-poster\.jpg$/);
  await expect(video.locator("source").first()).toHaveAttribute("src", /selection-43\.webm$/);
  expect(await hero.boundingBox()).toEqual(initialHeroBox);

  const pause = page.getByRole("button", { name: "Pause hero video" });
  await pause.click();
  await expect(page.getByRole("button", { name: "Play hero video" })).toBeVisible();
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("mobile mounts no desktop player and requests no approved video", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/focuslab-desktop-hero-selection-\d+\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("[data-reduced-motion-fallback=poster]")).toBeVisible();
  await expect(page.getByTestId("desktop-hero-video")).toHaveCount(0);
  await page.waitForTimeout(1_000);
  expect(videoRequests).toEqual([]);
});
