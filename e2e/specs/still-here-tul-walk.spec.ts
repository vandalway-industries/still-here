// S2 (still-here-tul) — walk W4.leadership (garage/pack/WALKS.md § W4, sub-walks).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W4_leadership } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

// the twelve, as company/staff/staff.yaml names them
const people = [...readFileSync(new URL('../../company/staff/staff.yaml', import.meta.url), 'utf8').matchAll(/^ {4}name: (.+)$/gm)].map((m) => ({ name: m[1].trim() }));

test('W4.leadership — the people', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W4_leadership(w, people);
});
