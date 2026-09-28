import { expect, test } from "@playwright/test";

test("an explicit CMS snapshot renders the exact pricing and FAQ draft", async ({ page }) => {
  test.skip(!process.env.FOCUS_CMS_SNAPSHOT_PATH, "requires an explicit CMS snapshot build");

  await page.goto("/pricing/");
  await expect(page.getByText("3-Hour Party Preview", { exact: true })).toBeVisible();
  await expect(page.getByText("$676", { exact: true })).toBeVisible();
  await expect(page.getByText("CMS Pricing FAQ Preview", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("3-Hour Party — $650");

  await page.goto("/");
  await expect(page.getByText("CMS Common FAQ Preview", { exact: true })).toBeVisible();

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(contentWidth).toBeLessThanOrEqual(viewportWidth);
});

test("an explicit snapshot label follows the stable service id into an inquiry", async ({ page }) => {
  test.skip(!process.env.FOCUS_CMS_SNAPSHOT_PATH, "requires an explicit CMS snapshot build");
  let inquiry: { services?: string[] } | undefined;

  await page.route("https://challenges.cloudflare.com/turnstile/**", (route) => route.fulfill({
    contentType: "application/javascript",
    body: `window.turnstile={render:function(_container,options){setTimeout(function(){options.callback("test-token")},0);return "test-widget"},remove:function(){},reset:function(){}};`,
  }));
  await page.route("https://api.example.test/v1/inquiries", async (route) => {
    inquiry = route.request().postDataJSON() as { services?: string[] };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true, inquiryId: "inquiry_preview", eventId: "event_preview",
        createdAt: "2026-09-28T12:00:00.000Z", status: "received_for_review", message: "Received.",
      }),
    });
  });

  await page.goto("/check-availability/?interest=party-3h");
  await expect(page.getByText("Services you selected")).toHaveCount(0);
  await page.getByRole("button", { name: "Party / Celebration" }).click();
  await page.locator('input[type="date"]').fill("2027-04-17");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Name").fill("Preview Customer");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("preview@example.com");
  await expect(page.getByText("Security verification complete.")).toHaveCount(1);
  await page.getByRole("button", { name: "Send Inquiry" }).click();
  await expect(page.getByText("Thanks — we have your inquiry.")).toBeVisible();

  expect(inquiry?.services).toContain("3-Hour Party Preview");
  expect(inquiry?.services).not.toContain("3-Hour Party");
});
