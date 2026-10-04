// V1 (still-here-bdd) — the finished 1997 page in Chromium and WebKit: quirks mode, every image
// loaded, the guestbook page, nothing that moves but the e-mail icon. garage/pack/ACCEPTANCE.md § V1.
import { expect, test } from '@playwright/test';
import { onlyEngines, serveDir } from '../helpers/site.ts';
import { GUESTBOOK_TITLE } from '../helpers/strings.ts';

onlyEngines('chromium', 'webkit');

let site: { url: string; close: () => void };
test.beforeAll(async () => {
  site = await serveDir('vandalwayind');
});
test.afterAll(() => site?.close());

test('the page and its guestbook', async ({ page }) => {
  await page.goto(`${site.url}/`);
  expect(await page.evaluate(() => document.compatMode)).toBe('BackCompat');
  const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.getAttribute('src'), w: i.naturalWidth })));
  expect(imgs.length).toBeGreaterThanOrEqual(6);
  for (const i of imgs) expect(i.w, `${i.src} loads`).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.querySelectorAll('script, blink, marquee, iframe, frame, embed, bgsound').length)).toBe(0);
  await page.getByRole('link', { name: /Guestbook/ }).first().click();
  await expect(page).toHaveTitle(GUESTBOOK_TITLE);
  expect(await page.evaluate(() => document.compatMode)).toBe('BackCompat');
  await expect(page.getByText(/March 2, 1999/)).toBeVisible();
});
