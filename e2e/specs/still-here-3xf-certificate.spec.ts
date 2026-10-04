// E3 (still-here-3xf) — the certificate as each visitor's browser issues it.
// garage/pack/ACCEPTANCE.md § E3 items 2, 3, 5 and 6 through the ritual in the browser (items 1 and
// 4 with draw.js directly: the unit test; item 7: the critic after C2).
import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { certificateSvg, issue, ROOT } from '../helpers/site.ts';
import * as R from '../helpers/reference.ts';
import { ZONE_LABEL } from '../helpers/strings.ts';

// the spec injects jsQR to read the QR code; the page's own CSP would refuse it
test.use({ bypassCSP: true });

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

test.describe('5–6. America/Chicago, a German-language browser', () => {
  test.use({ timezoneId: 'America/Chicago', locale: 'de-DE' });
  test('the QR code decodes to this origin\'s /c/ link; the result reads "3 October 2026, 05:52:00" beside the zone', async ({ page }) => {
    const id = await issue(page, 'Folding chair', { at: AT });
    expect(id).toBe('SH-00PP-9AGR-1GTB');
    const date = page.getByText('3 October 2026, 05:52:00', { exact: true }).first();
    await expect(date).toBeVisible();
    const zone = page.getByText(`${ZONE_LABEL} America/Chicago`).first();
    await expect(zone).toBeVisible();
    const a = (await date.boundingBox())!;
    const b = (await zone.boundingBox())!;
    expect(Math.abs(a.y - b.y) < 80 || Math.abs(a.x - b.x) < 400, 'the date and the zone sit together').toBe(true);
    await page.addScriptTag({ path: join(ROOT, 'node_modules/jsqr/dist/jsQR.js') });
    const decoded = await certificateSvg(page).evaluate(async (svg) => {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('width', '3300');
      clone.setAttribute('height', '2550');
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(clone))));
      await img.decode();
      const c = document.createElement('canvas');
      c.width = 3300;
      c.height = 2550;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      // @ts-ignore jsQR global
      const f = window.jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
      return f ? f.data : null;
    });
    expect(decoded).toBe(R.link(new URL(page.url()).origin, 'SH-00PP-9AGR-1GTB', 'Folding chair', 'America/Chicago'));
  });
});
