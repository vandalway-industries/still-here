// N3 (still-here-tfr) — W-DoD, the launch walk, on production: W1, W2, W3, W4 with every
// sub-walk, W5, W6, W7, W8, W9, in that order, in Chromium and WebKit at both sizes
// (garage/pack/WALKS.md § W-DoD). Skipped (never passed) until https://isitstillhere.com answers.
// Substitute steps call their named helpers inside e2e/helpers/walks.ts; the † steps are Clive's
// production re-check (CHECKPOINTS.md). Role and visible-text locators only.
import { test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { readCounterGif } from '../helpers/counter.ts';
import { isLive, onlyEngines, PRODUCTION, PRODUCTION_VANDALWAY } from '../helpers/site.ts';
import * as W from '../helpers/walks.ts';

onlyEngines('chromium', 'webkit');
test.use({ baseURL: PRODUCTION });
test.describe.configure({ mode: 'serial' });
const REPO = 'https://github.com/vandalway-industries/still-here';
const people = [...readFileSync(new URL('../../company/staff/staff.yaml', import.meta.url), 'utf8').matchAll(/^ {4}name: (.+)$/gm)].map((m) => ({ name: m[1].trim() }));

let live = false;
test.beforeAll(async () => {
  live = (await isLive(PRODUCTION)) && (await isLive(PRODUCTION_VANDALWAY));
});
test.beforeEach(async ({ context, browserName }) => {
  test.skip(!live, 'production is not live yet; skipped, not passed');
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});
test.afterEach(async () => W.closeSecondWindow());

async function readCounter(page: Page): Promise<number> {
  const src = (await page.evaluate(() => [...document.images].map((i) => i.src))).find((s) => /counter/i.test(s));
  if (!src) throw new Error('no counter image on the page');
  return readCounterGif(page, await (await page.request.get(src)).body());
}

let link: string | undefined;

test('W1 — the ritual', async ({ page, browser }, info) => {
  test.setTimeout(240_000);
  const w = W.startWalk(page, browser, info);
  for (const step of [W.W1_1, W.W1_2, W.W1_3, W.W1_4, W.W1_5, W.W1_6, W.W1_7, W.W1_8, W.W1_9, W.W1_10]) await step(w);
});

test('W2 — reopen and verify', async ({ page, browser }, info) => {
  test.setTimeout(240_000);
  const w = W.startWalk(page, browser, info);
  for (const step of [W.W2_1, W.W2_2, W.W2_3, W.W2_4, W.W2_5, W.W2_6, W.W2_7]) await step(w);
  link = w.state.link;
});

test('W3 — the portfolio', async ({ page, browser }, info) => {
  test.setTimeout(240_000);
  const w = W.startWalk(page, browser, info);
  w.state.link = link;
  for (const step of [W.W3_1, W.W3_2, W.W3_3, W.W3_4, W.W3_5]) await step(w);
});

test('W4 — the company, with every sub-walk', async ({ page, browser }, info) => {
  test.setTimeout(300_000);
  const w = W.startWalk(page, browser, info);
  await W.W4_1(w);
  await W.W4_leadership(w, people);
  for (const step of [W.W4_research, W.W4_caseStudies, W.W4_status, W.W4_careers, W.W4_legal_terms, W.W4_legal_privacy, W.W4_404]) await step(w);
  await page.goto('/');
  await W.W4_2(w);
});

test('W5 — Enterprise', async ({ page, browser }, info) => {
  const w = W.startWalk(page, browser, info);
  for (const step of [W.W5_1, W.W5_2, W.W5_3]) await step(w);
});

test('W6 — offline', async ({ page, browser, browserName }, info) => {
  test.setTimeout(300_000);
  const w = W.startWalk(page, browser, info);
  if (browserName === 'chromium') for (const step of [W.W6_1, W.W6_2, W.W6_3, W.W6_4, W.W6_5, W.W6_6, W.W6_7]) await step(w);
  else await W.W6_8(w);
});

test('W7 — 1997, on production', async ({ page, browser }, info) => {
  test.setTimeout(15 * 60_000);
  const w = W.startWalk(page, browser, info);
  await W.W7_1(w, PRODUCTION_VANDALWAY);
  await W.W7_2(w, PRODUCTION_VANDALWAY, readCounter);
  await W.W7_3(w, PRODUCTION_VANDALWAY);
  await W.W7_4(w, PRODUCTION_VANDALWAY);
  await W.W7_5(w, PRODUCTION_VANDALWAY);
});

test('W8 — reduced motion', async ({ page, browser }, info) => {
  const w = W.startWalk(page, browser, info);
  await W.W8_1(w);
  await W.W8_2(w);
});

test('W9 — the repository on github.com, and its identifier on the live Verify page', async ({ page, browser }, info) => {
  test.setTimeout(180_000);
  const w = W.startWalk(page, browser, info);
  await W.W9_1(w, REPO);
  await W.W9_2(w);
  await W.W9_3(w);
  await W.W9_4(w, `${PRODUCTION}/verify`);
  await W.W9_5(w);
});
