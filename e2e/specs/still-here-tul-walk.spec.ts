// S2 (still-here-tul) — walk W4.leadership (garage/pack/WALKS.md § W4, sub-walks).
// Played as a person: role and visible-text locators only (e2e/helpers/walks.ts).
import { test } from '@playwright/test';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W4_leadership } from '../helpers/walks.ts';
import { leadershipPeople } from '../helpers/staff.ts';

onlyEngines('chromium', 'webkit');

// the twelve cards' names: the staff record's, Lucas's card reading "Lucas" (C2 red-pen)
const people = leadershipPeople();

test('W4.leadership — the people', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = startWalk(page, browser, info);
  await W4_leadership(w, people);
});
