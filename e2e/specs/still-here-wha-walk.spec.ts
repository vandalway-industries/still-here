// X3 (still-here-wha) — walk W4.404 (garage/pack/WALKS.md § W4, sub-walks).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W4_404 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W4.404 — a wrong address', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W4_404(w);
});
