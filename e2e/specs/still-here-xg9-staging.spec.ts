// L1 (still-here-xg9) — staging in the browser: a secure context, the build id, the URL table,
// presence.json's header, and W2's network log. Runs with STAGING_URL set (the config then targets
// staging); skipped, never passed, without it. garage/pack/ACCEPTANCE.md § L1 items 1–5.
import { expect, test } from '@playwright/test';
import { action, certificateSvg, issue, requestLog } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';

test.skip(!process.env.STAGING_URL, 'STAGING_URL unset (uncommitted .env.staging); skipped, not passed');

test('1. window.isSecureContext', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => window.isSecureContext)).toBe(true);
});

test('2–4. build.txt, the URL table, presence.json', async ({ request }) => {
  expect((await (await request.get('/build.txt')).text()).trim()).toMatch(/^[0-9a-f]{40}$/);
  expect((await request.get('/index', { maxRedirects: 0 })).status()).toBe(200);
  expect((await request.get('/index/', { maxRedirects: 0 })).status()).toBe(404);
  expect((await request.get('/research', { maxRedirects: 0 })).status()).toBe(301);
  expect((await request.get('/no-such-page', { maxRedirects: 0 })).status()).toBe(404);
  expect((await request.get('/api/v1/presence.json')).headers()['access-control-allow-origin']).toBe('*');
});

test('5. during W2 no request carries the name, its base64url or the identifier', async ({ page, context }) => {
  const urls = requestLog(context);
  const id = await issue(page, 'Folding chair');
  const zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  await action(page, 'Copy certificate link').click();
  const p2 = await context.newPage();
  await p2.goto(R.link(new URL(page.url()).origin, id, 'Folding chair', zone));
  await expect(certificateSvg(p2)).toBeVisible();
  const secrets = ['Folding chair', 'Folding%20chair', R.base64url('Folding chair'), id];
  expect(urls.filter((u) => secrets.some((s) => u.includes(s)))).toEqual([]);
});
