// X3 (still-here-wha) — the 404 in every engine, on whichever server the run targets (the local
// Pages server, or staging with STAGING_URL). garage/pack/ACCEPTANCE.md § X3 items 1–2.
import { expect, test } from '@playwright/test';
import { HOME_HEADING, NOT_FOUND, RETURN_HOME } from '../helpers/strings.ts';

test('1. /no-such-page: status 404, the sentence, the shell, and Return home works', async ({ page }) => {
  const r = await page.goto('/no-such-page');
  expect(r?.status()).toBe(404);
  await expect(page.getByText(NOT_FOUND, { exact: true })).toBeVisible();
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.getByRole('link', { name: RETURN_HOME, exact: true }).click();
  await expect(page).toHaveURL((u) => new URL(u).pathname === '/');
  await expect(page.getByRole('heading', { name: HOME_HEADING })).toBeVisible();
  await expect(page.getByRole('main').getByRole('textbox')).toBeVisible();
});

test('2. the records and the README are not served', async ({ request }) => {
  for (const p of ['/company/tracker/TRACKER.md', '/README.md']) expect((await request.get(p, { maxRedirects: 0 })).status(), p).toBe(404);
});
