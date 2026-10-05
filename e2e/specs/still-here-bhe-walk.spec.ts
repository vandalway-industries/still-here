// L5 (still-here-bhe) — W1–W9 on staging, in Chromium and WebKit at both sizes
// (garage/pack/WALKS.md). Runs with STAGING_URL set (the config then serves nothing locally and
// every walk goes to staging); W7 goes to VANDALWAY_INTERNAL_URL. Without them, skipped, never
// passed. Substitute steps call their named helpers inside e2e/helpers/walks.ts. Role and
// visible-text locators only.
import { test, type Page } from '@playwright/test';
import { readCounterGif } from '../helpers/counter.ts';
import { REPOSITORY, serveRepository } from '../helpers/markdown.ts';
import { onlyEngines } from '../helpers/site.ts';
import * as W from '../helpers/walks.ts';
import { leadershipPeople } from '../helpers/staff.ts';

onlyEngines('chromium', 'webkit');
test.skip(!process.env.STAGING_URL, 'L5 walks on staging: set STAGING_URL (from the uncommitted .env.staging); skipped, not passed');
const VW = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
// the twelve cards' names: the staff record's, Lucas's card reading "Lucas" (C2 red-pen)
const people = leadershipPeople();

test.beforeEach(async ({ context, browserName }) => {
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});
test.afterEach(async () => W.closeSecondWindow());

async function readCounter(page: Page): Promise<number> {
  const src = (await page.evaluate(() => [...document.images].map((i) => i.src))).find((s) => /counter/i.test(s));
  if (!src) throw new Error('no counter image on the page');
  return readCounterGif(page, await (await page.request.get(src)).body());
}

test('W1 — the ritual', async ({ page, browser }, info) => {
  test.setTimeout(240_000);
  const w = W.startWalk(page, browser, info);
  for (const step of [W.W1_1, W.W1_2, W.W1_3, W.W1_4, W.W1_5, W.W1_6, W.W1_7, W.W1_8, W.W1_9, W.W1_10]) await step(w);
});

test('W2 then W3 — reopen and verify; the portfolio', async ({ page, browser }, info) => {
  test.setTimeout(300_000);
  const w = W.startWalk(page, browser, info);
  for (const step of [W.W2_1, W.W2_2, W.W2_3, W.W2_4, W.W2_5, W.W2_6, W.W2_7]) await step(w);
  await W.closeSecondWindow();
  // W3 starts from a fresh visitor who keeps W2's copied link
  const ctx = await browser.newContext({ baseURL: info.project.use.baseURL, viewport: page.viewportSize() ?? undefined, locale: 'en-GB', acceptDownloads: true });
  const v = W.startWalk(await ctx.newPage(), browser, info);
  v.state.link = w.state.link;
  for (const step of [W.W3_1, W.W3_2, W.W3_3, W.W3_4, W.W3_5]) await step(v);
});

test('W4 — the company, every sub-walk; W5 — Enterprise', async ({ page, browser }, info) => {
  test.setTimeout(300_000);
  const w = W.startWalk(page, browser, info);
  await W.W4_1(w);
  await W.W4_2(w);
  await W.W4_leadership(w, people);
  for (const step of [W.W4_research, W.W4_caseStudies, W.W4_status, W.W4_careers, W.W4_legal_terms, W.W4_legal_privacy, W.W4_404]) await step(w);
  for (const step of [W.W5_1, W.W5_2, W.W5_3]) await step(w);
});

test('W6 — offline', async ({ page, browser, browserName }, info) => {
  test.setTimeout(300_000);
  const w = W.startWalk(page, browser, info);
  if (browserName === 'chromium') for (const step of [W.W6_1, W.W6_2, W.W6_3, W.W6_4, W.W6_5, W.W6_6, W.W6_7]) await step(w);
  else await W.W6_8(w);
});

test('W7 — 1997, internal copy', async ({ page, browser }, info) => {
  test.skip(!VW, 'W7 needs VANDALWAY_INTERNAL_URL; skipped, not passed');
  test.setTimeout(15 * 60_000);
  const w = W.startWalk(page, browser, info);
  await W.W7_1(w, VW!);
  await W.W7_2(w, VW!, readCounter);
  await W.W7_3(w, VW!);
  await W.W7_4(w, VW!);
  await W.W7_5(w, VW!);
});

test('W8 — reduced motion', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const w = W.startWalk(page, browser, info);
  await W.W8_1(w);
  await W.W8_2(w);
});

test('W9 — the repository (local rendered Markdown; step 4 is N3\'s)', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  await serveRepository(page);
  const w = W.startWalk(page, browser, info);
  await W.W9_1(w, `${REPOSITORY}/`);
  await W.W9_2(w);
  await W.W9_3(w);
  await W.W9_5(w);
});
