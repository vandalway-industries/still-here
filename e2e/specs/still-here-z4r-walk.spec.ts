// S5 (still-here-z4r) — walk W4.status (garage/pack/WALKS.md § W4, sub-walks).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W4_status } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W4.status — the status page', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W4_status(w);
});
