// DS6 (still-here-azk) — the 1997 page in Chromium and WebKit: quirks mode and every PRD R42
// element present as the engine parses it. garage/pack/ACCEPTANCE.md § DS6 BROWSER PASS.
import { expect, test } from '@playwright/test';
import { onlyEngines, serveDir } from '../helpers/site.ts';

onlyEngines('chromium', 'webkit');

let site: { url: string; close: () => void };
test.beforeAll(async () => {
  site = await serveDir('vandalwayind');
});
test.afterAll(() => site?.close());

test('items 1–5 as the engine renders them', async ({ page }) => {
  await page.goto(`${site.url}/`);
  expect(await page.evaluate(() => document.compatMode)).toBe('BackCompat');
  const r = await page.evaluate(() => ({
    banned: document.querySelectorAll('script, blink, marquee, frame, frameset, iframe, embed, bgsound').length,
    text: document.body.innerText,
    imgs: [...document.images].map((i) => ({ src: i.getAttribute('src') ?? '', w: i.naturalWidth, complete: i.complete })),
    background: document.body.getAttribute('background'),
  }));
  expect(r.banned).toBe(0);
  expect(r.text).toMatch(/Welcome to Vandalway Industries/);
  expect(r.text).toMatch(/555-01\d\d/);
  expect(r.text).not.toMatch(/monovision/i);
  expect(r.background).toMatch(/\.gif$/i);
  for (const i of r.imgs) expect(i.w, `${i.src} loads`).toBeGreaterThan(0);
  const s09 = r.imgs.find((i) => /s09/i.test(i.src));
  expect(s09?.w).toBeGreaterThanOrEqual(200);
  expect(s09?.w).toBeLessThanOrEqual(410);
  await page.getByRole('link', { name: /Guestbook/ }).first().click();
  await expect(page).toHaveURL(/\/cgi-bin\/guestbook\.html$/);
});
