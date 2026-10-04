// E2 (still-here-3a3) — walk W1 steps 1–5 and 8–10, and W8 (garage/pack/WALKS.md).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W1_1, W1_10, W1_2, W1_3, W1_4, W1_5, W1_8, W1_9, W8_1, W8_2 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W1 — the ritual, steps 1–5 and 8–10', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W1_1(w);
  await W1_2(w);
  await W1_3(w);
  await W1_4(w);
  await W1_5(w);
  await W1_8(w);
  await W1_9(w);
  await W1_10(w);
});

test('W8 — reduced motion', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W8_1(w);
  await W8_2(w);
});
