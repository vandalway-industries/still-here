// E7 (still-here-c29) — Your Presence Portfolio.
// garage/pack/ACCEPTANCE.md § E7, items 3, 5 and 6 here (Chromium on the built site, and site/);
// items 1, 2 and 4 in e2e/specs/still-here-c29-portfolio.spec.ts and the W3 walk.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PORTFOLIO_EMPTY, PORTFOLIO_KEY, RESULT_HEADING } from '../../e2e/helpers/strings.ts';
import { mustExist, siteFiles, siteText, withSitePage } from '../helpers/repo.ts';

type Page = import('playwright').Page;

async function issueAt(page: Page, name: string): Promise<void> {
  await page.goto('/');
  const input = page.getByRole('main').getByRole('textbox');
  await input.fill(name);
  await input.press('Enter');
  await page.clock.runFor(5500);
  await page.getByRole('heading', { name: RESULT_HEADING, exact: true }).waitFor({ timeout: 5000 });
}

test('1–2. three entries newest first with Open and the downloads (browser spec)', () => {
  mustExist('e2e/specs/still-here-c29-portfolio.spec.ts', 'items 1, 2 and 4 are played in the browser');
});

test('3. storage holds name, time, zone and identifier only, under stillhere.portfolio.v1', async () => {
  await withSitePage(
    async (page) => {
      await page.clock.install({ time: new Date('2026-10-03T10:52:00Z') });
      await issueAt(page, 'Folding chair');
      const raw = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
      assert.deepEqual(Object.keys(raw), [PORTFOLIO_KEY], 'one key');
      const list = JSON.parse(raw[PORTFOLIO_KEY]);
      assert.ok(Array.isArray(list) && list.length === 1);
      assert.deepEqual(Object.keys(list[0]).sort(), ['identifier', 'name', 'time', 'zone']);
      assert.equal(list[0].name, 'Folding chair');
      assert.equal(list[0].identifier, 'SH-00PP-9AGR-1GTB');
      assert.equal(list[0].zone, 'America/Chicago');
      assert.equal(new Date(list[0].time).getTime(), Date.parse('2026-10-03T10:52:00Z'));
      assert.ok(raw[PORTFOLIO_KEY].length < 400, 'no file data stored');
    },
    { timezoneId: 'America/Chicago' },
  );
});

test('5. with {not json stored, /, /portfolio and /verify load without console errors; the portfolio says it is empty; the next issue replaces the value', async () => {
  await withSitePage(async (page) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.addInitScript((k) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem(k, '{not json');
        sessionStorage.setItem('seeded', '1');
      }
    }, PORTFOLIO_KEY);
    for (const p of ['/', '/portfolio', '/verify']) {
      await page.goto(p);
      await page.waitForLoadState('load');
    }
    await page.goto('/portfolio');
    await page.getByText(PORTFOLIO_EMPTY, { exact: true }).waitFor({ timeout: 3000 });
    assert.deepEqual(errors, [], 'console errors');
    await page.clock.install({ time: new Date('2026-10-03T10:52:00Z') });
    await issueAt(page, 'Wallet');
    const v = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), PORTFOLIO_KEY))!);
    assert.equal(v.length, 1);
    assert.equal(v[0].name, 'Wallet');
  });
});

test('6. no call to navigator.storage.persist anywhere in site/', () => {
  const callers = siteFiles(/\.(m?js|html)$/).filter((f) => /\.persist\s*\(|\bpersist\s*\(\s*\)/.test(siteText(f)));
  assert.ok(siteFiles(/\.m?js$/).length > 0, 'site/ has scripts to search');
  assert.deepEqual(callers, []);
});
