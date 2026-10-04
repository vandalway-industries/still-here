// V2 (still-here-d7l) — the page as the internal network serves it, against VANDALWAY_INTERNAL_URL
// (uncommitted). Skipped, never passed, while it is unset. garage/pack/ACCEPTANCE.md § V2.
import { expect, test } from '@playwright/test';
import { GUESTBOOK_TITLE } from '../helpers/strings.ts';

const ORIGIN = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
test.skip(!ORIGIN, 'VANDALWAY_INTERNAL_URL unset; skipped, not passed');

test('the page, its guestbook, and no POST', async ({ page, request }) => {
  const r = await page.goto(`${ORIGIN}/`);
  expect(r?.status()).toBe(200);
  expect(await page.evaluate(() => document.compatMode)).toBe('BackCompat');
  const g = await page.goto(`${ORIGIN}/cgi-bin/guestbook.html`);
  expect(g?.status()).toBe(200);
  await expect(page).toHaveTitle(GUESTBOOK_TITLE);
  expect((await request.post(`${ORIGIN}/`, { data: 'x' })).status()).toBe(405);
});
