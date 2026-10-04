// E7 (still-here-c29) — Your Presence Portfolio, in every engine.
// garage/pack/ACCEPTANCE.md § E7 items 1, 2, 4 and 5 (items 3 and 6: the unit test).
import { expect, test, type Page } from '@playwright/test';
import { downloadBytes } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { PORTFOLIO_EMPTY, PORTFOLIO_HEADING, PORTFOLIO_KEY, RESULT_HEADING } from '../helpers/strings.ts';
import { clearSiteData, openDownload } from '../helpers/substitutes.ts';

test.use({ timezoneId: 'America/Chicago' });
const TIMES = ['2026-10-03T10:52:00Z', '2026-10-03T10:53:00Z', '2026-10-03T10:54:00Z'];
const NAMES = ['Car keys', 'The Moon', 'My car keys'];

async function three(page: Page) {
  await page.clock.install({ time: new Date(TIMES[0]) });
  for (const [i, name] of NAMES.entries()) {
    if (i) await page.clock.setSystemTime(new Date(TIMES[i]));
    await page.goto('/');
    const input = page.getByRole('main').getByRole('textbox');
    await input.fill(name);
    await input.press('Enter');
    await page.clock.runFor(5500);
    await expect(page.getByRole('heading', { name: RESULT_HEADING, exact: true })).toBeVisible();
  }
}
const entry = (page: Page, name: string) =>
  page.getByRole('listitem').or(page.getByRole('article')).filter({ has: page.getByText(name, { exact: true }) }).first();

test('1–2. three checks, the page closed and reopened: three entries newest first, dated, identified; Open and the downloads match', async ({ page, context }) => {
  await three(page);
  await page.close();
  const p = await context.newPage();
  await p.goto('/portfolio');
  await expect(p.getByRole('heading', { name: PORTFOLIO_HEADING })).toBeVisible();
  let y = -1;
  for (const i of [2, 1, 0]) {
    const name = NAMES[i];
    const id = R.identifier(name, TIMES[i]);
    const e = entry(p, name);
    await expect(e).toBeVisible();
    await expect(e.getByText(R.portfolioDate(TIMES[i], 'America/Chicago'), { exact: true })).toBeVisible();
    await expect(e.getByText(id, { exact: true })).toBeVisible();
    const b = (await e.boundingBox())!;
    expect(b.y, `${name} is newer than the one below`).toBeGreaterThan(y);
    y = b.y;
    await expect(e.getByRole('link', { name: 'Open', exact: true })).toHaveAttribute('href', `/c/#${R.fragment(id, name, 'America/Chicago')}`);
    for (const label of ['Download PDF', 'Download PNG']) {
      const [d] = await Promise.all([p.waitForEvent('download'), e.getByRole('button', { name: label, exact: true }).or(e.getByRole('link', { name: label, exact: true })).first().click()]);
      expect(d.suggestedFilename()).toBe(R.filename(name, id, label.endsWith('PDF') ? 'pdf' : 'png'));
      if (label.endsWith('PDF')) expect((await openDownload(p, d)).text?.replace(/\s+/g, '')).toContain(id.replace(/\s+/g, ''));
      else expect((await downloadBytes(d)).length).toBeGreaterThan(1000);
    }
  }
});

test('4. after clearing site data the portfolio says it is empty', async ({ page }) => {
  await three(page);
  await page.goto('/portfolio');
  const origin = new URL(page.url()).origin;
  const p = await clearSiteData(page);
  await p.goto(`${origin}/portfolio`);
  await expect(p.getByText(PORTFOLIO_EMPTY, { exact: true })).toBeVisible();
});

test('5. a corrupt stored value breaks nothing; the next issue replaces it', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await page.evaluate((k) => localStorage.setItem(k, '{not json'), PORTFOLIO_KEY);
  for (const path of ['/', '/portfolio', '/verify']) await page.goto(path);
  await page.goto('/portfolio');
  await expect(page.getByText(PORTFOLIO_EMPTY, { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
