// E5 (still-here-wlr) — the certificate link in every engine.
// garage/pack/ACCEPTANCE.md § E5 items 1–4: the link's form and round trip, the redraw, Copy
// (Chromium, with the permission granted and refused), and the network log during W1 and W2.
import { expect, test } from '@playwright/test';
import { action, certificateSvg, issue, requestLog } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { CLIPBOARD_REFUSED, COPIED } from '../helpers/strings.ts';

const AT = '2026-10-03T10:52:00Z';
const ZONE = 'Europe/Brussels';
test.use({ timezoneId: ZONE });

for (const name of ['Folding  chair ', '🪑 chair', 'A & B #1']) {
  test(`1–2. ${JSON.stringify(name)}: the link round-trips and redraws byte for byte`, async ({ page, context }) => {
    await issue(page, name, { at: AT });
    const svg = await certificateSvg(page).evaluate((e) => new XMLSerializer().serializeToString(e));
    const id = R.identifier(name, AT);
    const link = R.link(new URL(page.url()).origin, id, name, ZONE);
    const p2 = await context.newPage();
    await p2.goto(link);
    await expect(certificateSvg(p2)).toBeVisible();
    expect(await certificateSvg(p2).evaluate((e) => new XMLSerializer().serializeToString(e))).toBe(svg);
    await expect(p2.getByText(R.confirmation(name, R.issued(id), ZONE).replace(/\s+/g, ' ').trim()).first()).toBeAttached();
  });
}

test.describe('3. Copy certificate link (Chromium)', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'the clipboard permission is Chromium\'s (ACCEPTANCE E5 item 3)');
  test('granted: exactly the link and the confirmation', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await issue(page, 'Folding chair', { at: AT });
    await action(page, 'Copy certificate link').click();
    await expect(page.getByText(COPIED, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(R.link(new URL(page.url()).origin, 'SH-00PP-9AGR-1GTB', 'Folding chair', ZONE));
  });
  test('refused: the link selected in a read-only field under the sentence', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('denied', 'NotAllowedError')) } });
    });
    await issue(page, 'Folding chair', { at: AT });
    await action(page, 'Copy certificate link').click();
    await expect(page.getByText(CLIPBOARD_REFUSED, { exact: true })).toBeVisible();
    const field = page.locator('input[readonly], textarea[readonly]');
    await expect(field).toHaveValue(R.link(new URL(page.url()).origin, 'SH-00PP-9AGR-1GTB', 'Folding chair', ZONE));
    await expect(field).toBeFocused();
    const n = R.link(new URL(page.url()).origin, 'SH-00PP-9AGR-1GTB', 'Folding chair', ZONE).length;
    expect(await field.evaluate((e: HTMLInputElement) => [e.selectionStart, e.selectionEnd])).toEqual([0, n]);
  });
});

test('4. during W1 and W2 no request URL contains the name, its base64url form or the identifier', async ({ page, context }) => {
  const urls = requestLog(context);
  const name = 'Folding chair';
  await issue(page, name, { at: AT });
  const id = R.identifier(name, AT);
  await action(page, 'Download PDF').click();
  await page.waitForEvent('download');
  const p2 = await context.newPage();
  await p2.goto(R.link(new URL(page.url()).origin, id, name, ZONE));
  await expect(certificateSvg(p2)).toBeVisible();
  await p2.goto('/verify');
  await p2.getByLabel('Certificate identifier').fill(id);
  await p2.getByLabel('Object name').fill(name);
  await p2.getByLabel('Object name').press('Enter');
  await expect(p2.getByText(R.confirmation(name, R.issued(id), 'UTC'))).toBeVisible();
  const secrets = [name, encodeURIComponent(name), name.replace(/ /g, '+'), R.base64url(name), id, id.replace(/-/g, ''), ZONE, encodeURIComponent(ZONE)];
  expect(urls.length).toBeGreaterThan(0);
  expect(urls.filter((u) => secrets.some((s) => u.includes(s)))).toEqual([]);
});
