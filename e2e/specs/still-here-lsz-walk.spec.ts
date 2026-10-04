// E0 (still-here-lsz) — walk W4 steps 1–2 on the shell (garage/pack/WALKS.md § W4).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W4_1, W4_2 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W4 steps 1–2 — the menu, the mark, the footer, the way out to vandalwayind.com', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W4_1(w);
  await W4_2(w);
});
