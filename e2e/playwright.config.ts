// Browser specs for STILL HERE. Run from e2e/: `npx playwright test`.
// Every spec runs in Chromium, WebKit and Firefox at 1440×900 and 390×844 unless the spec names
// an engine or a size (garage/pack/ACCEPTANCE.md, Conventions). The server is the local Pages
// server on port 5320, serving a fresh build of site/.
import { defineConfig, devices } from '@playwright/test';

const PORT = 5320;
const BASE_URL = process.env.STAGING_URL ?? `http://127.0.0.1:${PORT}`;
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

export default defineConfig({
  testDir: './specs',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'en-GB',
    acceptDownloads: true,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: DESKTOP } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: DESKTOP } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: DESKTOP } },
    { name: 'chromium-390', use: { ...devices['Desktop Chrome'], viewport: PHONE, hasTouch: true } },
    { name: 'webkit-390', use: { ...devices['Desktop Safari'], viewport: PHONE, hasTouch: true } },
    { name: 'firefox-390', use: { ...devices['Desktop Firefox'], viewport: PHONE } },
  ],
  // Staging and production runs set STAGING_URL and start no server.
  webServer: process.env.STAGING_URL
    ? undefined
    : {
        command: `node ../scripts/build.mjs && node ../scripts/serve-pages.mjs ../site ${PORT}`,
        url: `http://127.0.0.1:${PORT}/index.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
