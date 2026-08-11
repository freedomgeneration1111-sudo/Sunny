import { defineConfig, devices } from "@playwright/test";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browserOverride = executablePath ? { launchOptions: { executablePath } } : {};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], ...browserOverride } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"], ...browserOverride } },
  ],
  webServer: {
    command: "NEXT_PUBLIC_INQUIRY_API_URL=https://api.example.test NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED=true NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
