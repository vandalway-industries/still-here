// X4 (still-here-dzc) — offline in every engine. garage/pack/ACCEPTANCE.md § X4 items 3 and 4
// (installability, Chromium only, is item 1 in the unit test and W6 step 1).
import { expect, test, type Page } from '@playwright/test';
import { action, certificateSvg, objectInput } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { NOT_FOUND, PORTFOLIO_HEADING, RESULT_HEADING, VERIFY_LABELS } from '../helpers/strings.ts';

async function oneVisit(page: Page) {
  await page.goto('/');
  const ready = await page.evaluate(
    () =>
      new Promise<boolean>((ok) => {
        if (!('serviceWorker' in navigator)) return ok(false);
        setTimeout(() => ok(false), 15_000);
        navigator.serviceWorker.ready.then(() => ok(true));
      }),
  );
  expect(ready, 'a service worker after one visit').toBe(true);
  await page.reload();
}

test('3. after one visit, offline: the ritual, both downloads, copying and reopening a link, Verify by hand, the portfolio', async ({ page, context, browserName }) => {
  test.setTimeout(120_000);
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await oneVisit(page);
  await context.setOffline(true);
  await page.goto('/');
  await objectInput(page).fill('Wallet');
  await objectInput(page).press('Enter');
  await expect(page.getByRole('heading', { name: RESULT_HEADING, exact: true })).toBeVisible({ timeout: 8000 });
  const id = ((await page.getByText(/^SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}$/).first().textContent()) ?? '').trim();
  for (const label of ['Download PDF', 'Download PNG']) {
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), action(page, label).click()]);
    expect(d.suggestedFilename()).toMatch(/^STILL-HERE-wallet-/);
  }
  await action(page, 'Copy certificate link').click();
  const zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  await page.goto(R.link(new URL(page.url()).origin, id, 'Wallet', zone));
  await expect(certificateSvg(page)).toBeVisible();
  await page.goto('/verify');
  await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
  await page.getByLabel(VERIFY_LABELS.name).fill('Wallet');
  await page.getByLabel(VERIFY_LABELS.name).press('Enter');
  await expect(page.getByText(R.confirmation('Wallet', R.issued(id), 'UTC'), { exact: true })).toBeVisible();
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: PORTFOLIO_HEADING })).toBeVisible();
  await expect(page.getByText('Wallet', { exact: true }).first()).toBeVisible();
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30_000 }), page.getByRole('main').getByRole('button', { name: 'Download PDF' }).or(page.getByRole('main').getByRole('link', { name: 'Download PDF' })).first().click()]);
  expect(d.suggestedFilename()).toBe(R.filename('Wallet', id, 'pdf'));
  await page.getByRole('main').getByRole('link', { name: 'Open' }).first().click();
  await expect(certificateSvg(page)).toBeVisible();
});

test('4. offline: a page never visited opens; an image never shown shows its alt text; an unknown path shows the cached 404', async ({ page, context }) => {
  await oneVisit(page);
  await context.setOffline(true);
  const r = await page.goto('/enterprise');
  expect(r?.ok() ?? true).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const img = page.getByRole('main').locator('img').first();
  await expect(img).toHaveAttribute('alt', /\S{3,}/);
  await page.goto(`/no-such-page-${Date.now()}`);
  await expect(page.getByText(NOT_FOUND, { exact: true })).toBeVisible();
});
