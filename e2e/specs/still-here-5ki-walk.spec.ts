// S7 (still-here-5ki) — walk W5, Enterprise (garage/pack/WALKS.md § W5).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W5_1, W5_2, W5_3 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W5 — Enterprise: read it, find no form, reach the call to action', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W5_1(w);
  await W5_2(w);
  await W5_3(w);
});
