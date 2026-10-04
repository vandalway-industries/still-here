// V3 (still-here-6t3) — the counter moves: n on a first load; two more loads; within eleven
// minutes of the third, a reload shows at least n+3. garage/pack/ACCEPTANCE.md § V3 item 4, against
// VANDALWAY_INTERNAL_URL (uncommitted); skipped, never passed, while it is unset. The number is
// read from counter.gif by e2e/helpers/counter.ts.
import { expect, test, type Page } from '@playwright/test';
import { readCounterGif } from '../helpers/counter.ts';
import { onlyEngines } from '../helpers/site.ts';

onlyEngines('chromium');
const ORIGIN = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
test.skip(!ORIGIN, 'VANDALWAY_INTERNAL_URL unset; skipped, not passed');

async function shown(page: Page): Promise<number> {
  const gif = await (await page.request.get(`${ORIGIN}/counter.gif`, { headers: { 'cache-control': 'no-cache' } })).body();
  return readCounterGif(page, gif);
}

test('n, two loads, then n+3 within eleven minutes', async ({ page }) => {
  test.setTimeout(13 * 60_000);
  await page.goto(`${ORIGIN}/`);
  const n = await shown(page);
  await page.reload();
  await page.reload();
  const last = Date.now();
  let seen = n;
  while (Date.now() - last < 11 * 60_000 && seen < n + 3) {
    await page.waitForTimeout(30_000);
    await page.reload();
    seen = await shown(page);
  }
  expect(seen).toBeGreaterThanOrEqual(n + 3);
  const r = await page.request.get(`${ORIGIN}/`);
  expect(r.headers()['cache-control']).toMatch(/no-cache/);
});
