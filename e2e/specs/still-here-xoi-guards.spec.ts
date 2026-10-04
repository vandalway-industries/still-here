// X6 (still-here-xoi) — network and weight guards in the browser. garage/pack/ACCEPTANCE.md § X6
// items 1 and 3 (items 2, 4 and 5: the unit test). Item 1 replays walks W1–W6 whole (the steps of
// e2e/helpers/walks.ts) with every request of the context recorded; the substitutes' own private
// origin (substitutes.invalid, the test's file viewer) is not the site's and is left out.
import { expect, test } from '@playwright/test';
import { PAGES } from '../helpers/strings.ts';
import * as W from '../helpers/walks.ts';
import { readFileSync } from 'node:fs';

const people = [...readFileSync(new URL('../../company/staff/staff.yaml', import.meta.url), 'utf8').matchAll(/^ {4}name: (.+)$/gm)].map((m) => ({ name: m[1].trim() }));

test.describe('1. over walks W1–W6 every request is same-origin', () => {
  test.skip(({ browserName }) => browserName === 'firefox', 'the walks are played in Chromium and WebKit (WALKS.md)');
  test('W1–W6', async ({ page, browser, context, browserName }, info) => {
    test.setTimeout(600_000);
    if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const urls: string[] = [];
    const record = (c: typeof context) => c.on('request', (r) => urls.push(r.url()));
    record(context);
    W.newContextHooks.push(record);
    const w = W.startWalk(page, browser, info);
    for (const step of [W.W1_1, W.W1_2, W.W1_3, W.W1_4, W.W1_5, W.W1_6, W.W1_7, W.W1_8, W.W1_9, W.W1_10]) await step(w);
    for (const step of [W.W2_1, W.W2_2, W.W2_3, W.W2_4, W.W2_5, W.W2_6, W.W2_7]) await step(w);
    await W.closeSecondWindow();
    for (const step of [W.W3_1, W.W3_2, W.W3_3]) await step(w);
    const before = w.context;
    await W.W3_4(w);
    // clearing site data may hand the walk a fresh context (WebKit); its requests count too
    if (w.context !== before) record(w.context);
    await W.W3_5(w);
    await W.W4_1(w);
    await W.W4_2(w);
    await W.W4_leadership(w, people);
    for (const step of [W.W4_research, W.W4_caseStudies, W.W4_status, W.W4_careers, W.W4_legal_terms, W.W4_legal_privacy, W.W4_404]) await step(w);
    for (const step of [W.W5_1, W.W5_2, W.W5_3]) await step(w);
    if (browserName === 'chromium') for (const step of [W.W6_1, W.W6_2, W.W6_3, W.W6_4, W.W6_5, W.W6_6, W.W6_7]) await step(w);
    else await W.W6_8(w);
    const origin = new URL(info.project.use.baseURL!).origin;
    const foreign = urls.filter((u) => !u.startsWith(`${origin}/`) && !/^(data|blob):/.test(u) && !u.startsWith('https://substitutes.invalid/'));
    expect(urls.length).toBeGreaterThan(50);
    expect([...new Set(foreign)]).toEqual([]);
  });
});

test('3. the first load of each page transfers at most 1.5 MB to the load event, the precache excluded', async ({ browser }, info) => {
  test.setTimeout(180_000);
  const heavy: string[] = [];
  for (const p of [...PAGES.map((x) => x.path)]) {
    const ctx = await browser.newContext({ serviceWorkers: 'block', baseURL: info.project.use.baseURL, viewport: info.project.use.viewport ?? undefined });
    const page = await ctx.newPage();
    const sizes: Promise<number>[] = [];
    page.on('requestfinished', (r) => {
      sizes.push(
        r
          .sizes()
          .then((s) => s.responseBodySize + s.responseHeadersSize)
          .catch(() => 0),
      );
    });
    await page.goto(p, { waitUntil: 'load' });
    const total = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
    if (total > 1.5 * 1024 * 1024) heavy.push(`${p}: ${(total / 1024 / 1024).toFixed(2)} MB`);
    expect(total, `${p} loads something`).toBeGreaterThan(0);
    await ctx.close();
  }
  expect(heavy).toEqual([]);
});
