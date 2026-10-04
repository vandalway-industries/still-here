// RC8 (still-here-382) — walk W9, the repository, on the local checkout's rendered Markdown
// (garage/pack/WALKS.md § W9). Step 4 needs the live Verify page and is played in N3 (W-DoD).
// Role and visible-text locators only (e2e/helpers/walks.ts); e2e/helpers/markdown.ts renders the
// working tree's Markdown on a private origin, as a reader's Markdown viewer would.
import { test } from '@playwright/test';
import { REPOSITORY, serveRepository } from '../helpers/markdown.ts';
import { onlyEngines } from '../helpers/site.ts';
import { startWalk, W9_1, W9_2, W9_3, W9_5 } from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');

test('W9 — the repository, read from its README (step 4 is N3\'s)', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  await serveRepository(page);
  const w = startWalk(page, browser, info);
  await W9_1(w, `${REPOSITORY}/`);
  await W9_2(w);
  await W9_3(w);
  await W9_5(w);
});
