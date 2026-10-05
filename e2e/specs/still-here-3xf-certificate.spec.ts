// E3 (still-here-3xf) — the certificate as each visitor's browser issues it.
// garage/pack/ACCEPTANCE.md § E3 items 2, 3, 5 and 6 through the ritual in the browser (items 1 and
// 4 with draw.js directly: the unit test; item 7: the critic after C2).
import { expect, test, type Page } from '@playwright/test';
import { action, certificateSvg, downloadBytes, issue } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { ZONE_LABEL } from '../helpers/strings.ts';
import { decodeQr } from '../helpers/substitutes.ts';

const AT = '2026-10-03T10:52:00Z';

for (const zone of ['Europe/Brussels', 'America/Chicago', 'Pacific/Chatham']) {
  test.describe(`2. ${zone}`, () => {
    test.use({ timezoneId: zone });
    test(`prints "${ZONE_LABEL} ${zone}" and the local time`, async ({ page }) => {
      await issue(page, 'Folding chair', { at: AT });
      await expect(page.getByText(`${ZONE_LABEL} ${zone}`).first()).toBeVisible();
      await expect(certificateSvg(page).getByText(`${ZONE_LABEL} ${zone}`)).toHaveCount(1);
      const local = R.localTime(AT, zone);
      await expect(page.getByText(R.resultDate(AT, zone), { exact: true }).first()).toBeVisible();
      expect(await certificateSvg(page).locator('[data-field="date"]').textContent()).toContain(local);
    });
  });
}

test.describe('3. 23:30 in America/Chicago', () => {
  test.use({ timezoneId: 'America/Chicago' });
  test('the local date in the date line, the next day in the UTC line, both true', async ({ page }) => {
    const id = await issue(page, 'Folding chair', { at: '2026-10-03T04:30:00Z' });
    expect(id).toBe(R.identifier('Folding chair', '2026-10-03T04:30:00Z'));
    const date = (await certificateSvg(page).locator('[data-field="date"]').textContent())!.replace(/\s+/g, ' ');
    expect(date).toMatch(/\b2 October\b|\bsecond day of October\b/);
    expect(date).toMatch(/23:30:00/);
    await expect(certificateSvg(page).locator('[data-field="utc"]')).toHaveText('Recorded 2026-10-03 04:30:00 UTC');
  });
});

/** The files a person keeps: the exported PNG and PDF of the certificate on screen. */
async function exported(page: Page): Promise<{ png: Buffer; pdf: Buffer }> {
  const file = async (label: string) => {
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), action(page, label).click()]);
    return downloadBytes(d);
  };
  return { png: await file('Download PNG'), pdf: await file('Download PDF') };
}

// Item 5 decodes the files people keep (C2 test change 8): the exported PNG, and the PDF as pdf.js
// renders it, at 200 dpi (pdf.js in WebKit needs 200 for the longest name's code; 150 is too few).
async function decodesFromFiles(page: Page, want: string, what: string): Promise<void> {
  const files = await exported(page);
  expect(await decodeQr(page.context(), { png: files.png }), `${what}: the exported PNG's QR code`).toBe(want);
  expect(await decodeQr(page.context(), { pdf: files.pdf, dpi: 200 }), `${what}: the exported PDF's QR code (pdf.js, 200 dpi)`).toBe(want);
}

test.describe('5–6. America/Chicago, a German-language browser', () => {
  test.use({ timezoneId: 'America/Chicago', locale: 'de-DE' });
  test('the QR code in the exported PNG and PDF decodes to this origin\'s /c/ link; the result reads "3 October 2026, 05:52:00" beside the zone', async ({ page }) => {
    test.setTimeout(120_000);
    const id = await issue(page, 'Folding chair', { at: AT });
    expect(id).toBe('SH-00PP-9AGR-1GTB');
    const date = page.getByText('3 October 2026, 05:52:00', { exact: true }).first();
    await expect(date).toBeVisible();
    const zone = page.getByText(`${ZONE_LABEL} America/Chicago`).first();
    await expect(zone).toBeVisible();
    const a = (await date.boundingBox())!;
    const b = (await zone.boundingBox())!;
    expect(Math.abs(a.y - b.y) < 80 || Math.abs(a.x - b.x) < 400, 'the date and the zone sit together').toBe(true);
    await decodesFromFiles(page, R.link(new URL(page.url()).origin, 'SH-00PP-9AGR-1GTB', 'Folding chair', 'America/Chicago'), 'Folding chair');
  });

  test('5. at the longest name, 80 four-byte code points, the exported PNG and PDF decode to its /c/ link', async ({ page }) => {
    test.setTimeout(180_000);
    const longest = '\u{1FA91}'.repeat(80);
    expect([...longest].length).toBe(80);
    const id = await issue(page, longest, { at: AT });
    expect(id).toBe(R.identifier(longest, AT));
    await decodesFromFiles(page, R.link(new URL(page.url()).origin, id, longest, 'America/Chicago'), '80 × U+1FA91');
  });
});
