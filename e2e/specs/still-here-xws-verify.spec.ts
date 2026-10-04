// E6 (still-here-xws) — reopen and verify, in every engine.
// garage/pack/ACCEPTANCE.md § E6 items 1–4, 6 and 7 (item 5, the exhaustive alterations, runs in
// the unit test).
import { expect, test, type Page } from '@playwright/test';
import { action, certificateSvg, storedPortfolio } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { FAILURE_LINKS, FUTURE, NOT_LOCATED, RESULT_ACTIONS, VECTORS, VERIFY_EMPTY, VERIFY_LABELS } from '../helpers/strings.ts';

async function verify(page: Page, id: string, name: string, enterIn: 'identifier' | 'name' = 'name') {
  await page.goto('/verify');
  await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
  await page.getByLabel(VERIFY_LABELS.name).fill(name);
  await page.getByLabel(enterIn === 'name' ? VERIFY_LABELS.name : VERIFY_LABELS.identifier).press('Enter');
}

test.describe('1. a link opened in another zone', () => {
  test.use({ timezoneId: 'Australia/Sydney' });
  test('redraws, states the issue in the link\'s zone, offers the four actions, adds nothing', async ({ page }) => {
    await page.goto(`/c/#${R.fragment('SH-00PP-9AGR-1GTB', 'Folding chair', 'America/Chicago')}`);
    await expect(certificateSvg(page)).toBeVisible();
    await expect(page.getByText("Issued by STILL HERE for 'Folding chair' on 3 October 2026 at 05:52:00 (America/Chicago).", { exact: true })).toBeVisible();
    for (const a of RESULT_ACTIONS) await expect(action(page, a)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Check another', exact: true })).toHaveAttribute('href', '/');
    expect(await storedPortfolio(page)).toBeNull();
  });
});

test('2. each published vector verifies in UTC; Enter in either field submits', async ({ page }) => {
  for (const [i, v] of VECTORS.entries()) {
    await verify(page, v.id, v.name, i % 2 ? 'identifier' : 'name');
    await expect(page.getByText(R.confirmation(v.name, v.time, 'UTC').replace(/\s+/g, ' '))).toBeVisible();
  }
});

test('3. malformed, wrong name, typo, future with a wrong name, over 80 code points: the mismatch sentence', async ({ page }) => {
  for (const [id, name] of [
    ['hello', 'Folding chair'],
    ['SH-00PP-9AGR-1GTB', 'Folding chairs'],
    ['SH-00PP-9AGR-1GTB', 'Foldng chair'],
    ['SH-01MR-P6G7-6TA1', 'Folding chair'],
    [R.identifier('b'.repeat(81), '2026-10-03T10:52:00Z'), 'b'.repeat(81)],
  ]) {
    await verify(page, id, name);
    await expect(page.getByText(NOT_LOCATED, { exact: true })).toBeVisible();
  }
});

test('4. the five-minute bar', async ({ page }) => {
  const now = new Date('2026-10-04T12:00:00Z');
  await page.clock.install({ time: now });
  await verify(page, R.identifier('Folding chair', new Date(now.getTime() + 6 * 60_000)), 'Folding chair');
  await expect(page.getByText(FUTURE, { exact: true })).toBeVisible();
  const four = R.identifier('Folding chair', new Date(now.getTime() + 4 * 60_000));
  await verify(page, four, 'Folding chair');
  await expect(page.getByText(R.confirmation('Folding chair', R.issued(four), 'UTC'), { exact: true })).toBeVisible();
});

test('6. lower case, o for zero, no SH-; empty fields: aria-disabled and the sentence', async ({ page }) => {
  await verify(page, 'oopp-9agr-1gtb', 'folding chair');
  await expect(page.getByText(R.confirmation('folding chair', '2026-10-03T10:52:00Z', 'UTC'), { exact: true })).toBeVisible();
  await page.goto('/verify');
  const button = page.getByRole('button', { name: VERIFY_LABELS.button, exact: true });
  await expect(button).toHaveAttribute('aria-disabled', 'true');
  await button.click({ force: true });
  await expect(page.getByText(VERIFY_EMPTY, { exact: true })).toBeVisible();
});

test('7. failures draw nothing and offer two ways on; bare /c/ is the Verify form', async ({ page }) => {
  await verify(page, 'hello', 'Folding chair');
  await expect(page.getByText(NOT_LOCATED, { exact: true })).toBeVisible();
  await expect(certificateSvg(page)).toHaveCount(0);
  await expect(page.getByRole('link', { name: FAILURE_LINKS[0], exact: true })).toHaveAttribute('href', '/verify');
  await expect(page.getByRole('link', { name: FAILURE_LINKS[1], exact: true })).toHaveAttribute('href', '/');
  await page.goto(`/c/#${R.fragment('SH-00PP-9AGR-1GTX', 'Folding chair', 'America/Chicago')}`);
  await expect(page.getByText(NOT_LOCATED, { exact: true })).toBeVisible();
  await expect(certificateSvg(page)).toHaveCount(0);
  await page.goto('/c/');
  await expect(page.getByLabel(VERIFY_LABELS.identifier)).toBeVisible();
  await expect(page.getByLabel(VERIFY_LABELS.name)).toBeVisible();
  await expect(page.getByRole('button', { name: VERIFY_LABELS.button, exact: true })).toBeVisible();
});
