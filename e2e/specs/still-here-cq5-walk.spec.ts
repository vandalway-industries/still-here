// E4 (still-here-cq5) — walk W1 steps 6–7: the downloads, opened (garage/pack/WALKS.md § W1).
// Steps 1 and 3–5 bring the visitor to the result first. Steps 6–7 are played (substitute) with
// openDownload(). Role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W1_1, W1_3, W1_4, W1_5, W1_6, W1_7 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W1 steps 6–7 — Download PDF and Download PNG, each opened', async ({ page, browser }, info) => {
  test.setTimeout(180_000);
  const w = startWalk(page, browser, info);
  await W1_1(w);
  await W1_3(w);
  await W1_4(w);
  await W1_5(w);
  await W1_6(w);
  await W1_7(w);
});
