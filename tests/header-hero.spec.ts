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
    if (/focuslab-desktop-hero-flp-v002\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const media = page.locator("[data-reduced-motion-fallback=poster]");
  await expect(media).toBeVisible();

  // With no mobile stills for the sole candidate, the desktop poster is the
  // only `.cinematic-poster` element and doubles as the mobile fallback.
  await expect(media.locator(".cinematic-poster")).toHaveCount(1);
  const shown = media.locator(".cinematic-poster:visible");
  await expect(shown).toHaveCount(1);
  await expect(shown).toHaveCSS("animation-name", "none");
  await expect(media.locator("video")).toHaveCount(0);
  expect(videoRequests).toEqual([]);
});

test("desktop hero plays the single flp-v002 candidate at half speed", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/focuslab-desktop-hero-flp-v002\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });
  await page.goto("/");
  const video = page.getByTestId("desktop-hero-video");
  const hero = page.locator("#hero");
  const initialHeroBox = await hero.boundingBox();
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("data-candidate", "flp-v002");
  await expect(video).toHaveAttribute("style", /translateY\(4%\).*scale\(1\.11\).*object-position: center top/);
  expect(await video.evaluate((el: HTMLVideoElement) => el.loop)).toBe(false);
  expect(await video.evaluate((el: HTMLVideoElement) => el.playbackRate)).toBe(0.5);
  expect(await video.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("poster", /flp-v002-poster\.jpg$/);

  const sourceUrls = await video.locator("source").evaluateAll((sources) =>
    sources.map((source) => source.getAttribute("src")),
  );
  expect(sourceUrls.every((url) => url?.includes("flp-v002"))).toBe(true);
  await expect(page.getByRole("heading", { name: "One event. One crew. Zero handoffs." })).toBeVisible();
  await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
  expect(videoRequests.every((url) => url.includes("flp-v002"))).toBe(true);
  expect(await hero.boundingBox()).toEqual(initialHeroBox);

  // No candidate switcher when there's only one video to switch between.
  await expect(page.getByRole("button", { name: /^Show / })).toHaveCount(0);

  const pause = page.getByRole("button", { name: "Pause hero video" });
  await pause.click();
  await expect(page.getByRole("button", { name: "Play hero video" })).toBeVisible();
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("desktop hero pauses on end and replays only after a 20-second gap", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const video = page.getByTestId("desktop-hero-video");
  await expect(video).toHaveAttribute("data-candidate", "flp-v002");

  await page.clock.install();
  await video.evaluate((el: HTMLVideoElement) => {
    el.pause();
    el.currentTime = 1; // marker so a later reset to 0 is observable
    el.dispatchEvent(new Event("ended"));
  });

  await page.clock.fastForward(19_000);
  expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBe(1);

  await page.clock.fastForward(2_000);
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeLessThan(1);
});

test("mobile mounts no desktop player and requests no approved video", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (/focuslab-desktop-hero-flp-v002\.(mp4|webm)$/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("[data-reduced-motion-fallback=poster]")).toBeVisible();
  await expect(page.getByTestId("desktop-hero-video")).toHaveCount(0);
  await page.waitForTimeout(1_000);
  expect(videoRequests).toEqual([]);
});
