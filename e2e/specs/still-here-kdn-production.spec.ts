// N1 (still-here-kdn) — https://isitstillhere.com in every engine: every page answers, the
// certificate issues, the 404 is the site's. Skipped, never passed, until production answers.
// garage/pack/ACCEPTANCE.md § N1 items 3–5 as a browser meets them.
import { expect, test } from '@playwright/test';
import { isLive, PRODUCTION } from '../helpers/site.ts';
import { NOT_FOUND, PAGES, RESULT_HEADING } from '../helpers/strings.ts';

test.use({ baseURL: PRODUCTION });
let live = false;
test.beforeAll(async () => {
  live = await isLive(PRODUCTION);
});
test.beforeEach(() => test.skip(!live, 'isitstillhere.com is not live yet; skipped, not passed'));

test('every page answers over HTTPS in a secure context', async ({ page }) => {
  for (const p of PAGES) {
    const r = await page.goto(p.path);
    expect(r?.status(), p.path).toBe(200);
  }
  expect(await page.evaluate(() => window.isSecureContext)).toBe(true);
});

test('the ritual issues a certificate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('main').getByRole('textbox').fill('Folding chair');
  await page.getByRole('main').getByRole('textbox').press('Enter');
  await expect(page.getByRole('heading', { name: RESULT_HEADING, exact: true })).toBeVisible({ timeout: 8000 });
});

test('the 404 and the records paths', async ({ page, request }) => {
  const r = await page.goto('/no-such-page');
  expect(r?.status()).toBe(404);
  await expect(page.getByText(NOT_FOUND, { exact: true })).toBeVisible();
  for (const p of ['/company/tracker/TRACKER.md', '/README.md']) expect((await request.get(p)).status()).toBe(404);
});
