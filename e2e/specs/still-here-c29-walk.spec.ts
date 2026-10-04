// E7 (still-here-c29) — walk W3, the portfolio (garage/pack/WALKS.md § W3). W2 step 1 first, in
// its own window, so step 5 has the link "I copied in W2". Step 4 is played (substitute) with
// clearSiteData(). Role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W2_1, W3_1, W3_2, W3_3, W3_4, W3_5 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W3 — Your Presence Portfolio', async ({ page, browser }, info) => {
  test.setTimeout(180_000);
  // W2 step 1, in another window of another visitor, for the copied link
  const other = await browser.newContext({ baseURL: info.project.use.baseURL, viewport: page.viewportSize() ?? undefined, locale: 'en-GB' });
  if (browser.browserType().name() === 'chromium') await other.grantPermissions(['clipboard-read', 'clipboard-write']);
  const before = startWalk(await other.newPage(), browser, info);
  await W2_1(before);
  await other.close();

  const w = startWalk(page, browser, info);
  w.state.link = before.state.link;
  await W3_1(w);
  await W3_2(w);
  await W3_3(w);
  await W3_4(w);
  await W3_5(w);
});
