// V4 (still-here-aqv) — walk W7, 1997, on the internal copy (garage/pack/WALKS.md § W7).
// Runs against VANDALWAY_INTERNAL_URL (uncommitted); without it the walk is skipped, never passed.
// Step 3 is played (substitute) with checkNullMx() († phone checklist item 9). Step 2 waits as a
// person waits (page.waitForTimeout, allowed only there). Role and visible-text locators only.
import { test, type Page } from '@playwright/test';
import { readCounterGif } from '../helpers/counter.ts';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W7_1, W7_2, W7_3, W7_4, W7_5 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');
const ORIGIN = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
test.skip(!ORIGIN, 'W7 on the internal copy needs VANDALWAY_INTERNAL_URL (uncommitted); skipped, not passed');

/** What the counter shows: the counter image a person looks at, read digit by digit. */
async function readCounter(page: Page): Promise<number> {
  const src = (await page.evaluate(() => [...document.images].map((i) => i.src))).find((s) => /counter/i.test(s));
  if (!src) throw new Error('no counter image on the page');
  const gif = await (await page.request.get(src, { headers: { 'cache-control': 'no-cache' } })).body();
  return readCounterGif(page, gif);
}

test('W7 — the 1997 page, internal copy', async ({ page, browser }, info) => {
  test.setTimeout(15 * 60_000);
  const w = startWalk(page, browser, info);
  await W7_1(w, ORIGIN!);
  await W7_2(w, ORIGIN!, readCounter);
  await W7_3(w, ORIGIN!);
  await W7_4(w, ORIGIN!);
  await W7_5(w, ORIGIN!);
});
