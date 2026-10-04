// X4 (still-here-dzc) — walk W6, offline (garage/pack/WALKS.md § W6). Chromium plays steps 1–7
// (step 1–2 played (substitute) with checkInstallable(); step 4 with openDownload()); WebKit plays
// step 8, which repeats steps 3–6 in the tab without an install. The real install and Home Screen
// launch are phone checklist item 8 †. Role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W6_1, W6_2, W6_3, W6_4, W6_5, W6_6, W6_7, W6_8 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test.beforeEach(async ({ context, browserName }) => {
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});

test('W6 — offline', async ({ page, browser, browserName }, info) => {
  test.setTimeout(240_000);
  const w = startWalk(page, browser, info);
  if (browserName === 'chromium') {
    await W6_1(w);
    await W6_2(w);
    await W6_3(w);
    await W6_4(w);
    await W6_5(w);
    await W6_6(w);
    await W6_7(w);
  } else {
    await W6_8(w);
  }
});
