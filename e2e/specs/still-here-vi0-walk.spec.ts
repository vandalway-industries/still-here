// N2 (still-here-vi0) — walk W7 on production, https://vandalwayind.com (garage/pack/WALKS.md
// § W7). Skipped (never passed) until production answers. Step 3 is played (substitute) with
// checkNullMx() († phone checklist item 9). Role and visible-text locators only.
import { test, type Page } from '@playwright/test';
import { readCounterGif } from '../helpers/counter.ts';
import { isLive, onlyEngines, PRODUCTION_VANDALWAY } from '../helpers/site.ts';
import { startWalk, W7_1, W7_2, W7_3, W7_4, W7_5 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');
let live = false;
test.beforeAll(async () => {
  live = await isLive(PRODUCTION_VANDALWAY);
});

async function readCounter(page: Page): Promise<number> {
  const src = (await page.evaluate(() => [...document.images].map((i) => i.src))).find((s) => /counter/i.test(s));
  if (!src) throw new Error('no counter image on the page');
  const gif = await (await page.request.get(src, { headers: { 'cache-control': 'no-cache' } })).body();
  return readCounterGif(page, gif);
}

test('W7 — the 1997 page on production', async ({ page, browser }, info) => {
  test.skip(!live, 'vandalwayind.com is not live yet; skipped, not passed');
  test.setTimeout(15 * 60_000);
  const w = startWalk(page, browser, info);
  await W7_1(w, PRODUCTION_VANDALWAY);
  await W7_2(w, PRODUCTION_VANDALWAY, readCounter);
  await W7_3(w, PRODUCTION_VANDALWAY);
  await W7_4(w, PRODUCTION_VANDALWAY);
  await W7_5(w, PRODUCTION_VANDALWAY);
});
