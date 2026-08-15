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
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const media = page.locator("[data-reduced-motion-fallback=poster]");
  await expect(media).toBeVisible();

  // The hero ships a landscape and a portrait still; exactly one is shown.
  await expect(media.locator(".cinematic-poster")).toHaveCount(2);
  const shown = media.locator(".cinematic-poster:visible");
  await expect(shown).toHaveCount(1);
  await expect(shown).toHaveCSS("animation-name", "none");
});

test("the hero rotates between clips without looping either", async ({ page }) => {
  await page.goto("/");
  const videos = page.locator("video.cinematic-video");

  // Rotation runs on two stacked elements so the incoming clip is already
  // decoded — swapping src on one element would flash while it reloads.
  await expect(videos).toHaveCount(2);

  for (const v of await videos.all()) {
    // `loop` would restart instantly and never fire `ended`, leaving nowhere
    // to hang the hold or the handover.
    expect(await v.evaluate((el: HTMLVideoElement) => el.loop)).toBe(false);
    expect(await v.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
    await expect(v).toHaveAttribute("playsinline", "");
    await expect(v).toHaveAttribute("aria-hidden", "true");

    // Motion-free visitors download no video at all.
    const media = await v.locator("source").evaluateAll((els) =>
      els.map((el) => el.getAttribute("media")),
    );
    expect(media.length).toBeGreaterThan(0);
    for (const m of media) expect(m).toContain("prefers-reduced-motion: no-preference");
  }

  // Exactly one clip is on screen at a time — no gap, no double exposure.
  const opaque = await videos.evaluateAll((els) =>
    els.filter((el) => getComputedStyle(el).opacity === "1").length,
  );
  expect(opaque).toBe(1);

  // The two elements carry different clips, which is what makes it a rotation.
  const sources = await videos.evaluateAll((els) =>
    els.map((el) => el.querySelector("source")?.getAttribute("src")),
  );
  expect(new Set(sources).size).toBe(2);
});
