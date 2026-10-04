// E6 (still-here-xws) — walk W2, reopen and verify, steps 1–7 (garage/pack/WALKS.md § W2).
// Step 7 is played (substitute) with decodeQr(); the camera scan is phone checklist item 6 †.
// Role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { closeSecondWindow, startWalk, W2_1, W2_2, W2_3, W2_4, W2_5, W2_6, W2_7 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test.beforeEach(async ({ context, browserName }) => {
  // a person's clipboard: Chromium lets the spec read back what was copied
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});
test.afterEach(async () => closeSecondWindow());

test('W2 — reopen and verify', async ({ page, browser }, info) => {
  test.setTimeout(180_000);
  const w = startWalk(page, browser, info);
  await W2_1(w);
  await W2_2(w);
  await W2_3(w);
  await W2_4(w);
  await W2_5(w);
  await W2_6(w);
  await W2_7(w);
});
