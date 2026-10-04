// E5 (still-here-wlr) — the certificate link.
// garage/pack/ACCEPTANCE.md § E5, items 1–4 in Chromium on the built site (the browser spec repeats
// them across engines). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLIPBOARD_REFUSED, COPIED, RESULT_HEADING } from '../../e2e/helpers/strings.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { withSitePage } from '../helpers/repo.ts';

type Page = import('playwright').Page;
const AT = '2026-10-03T10:52:00Z';
const ZONE = 'America/Chicago';

async function issue(page: Page, name: string): Promise<void> {
  await page.clock.install({ time: new Date(AT) });
  await page.goto('/');
  const input = page.getByRole('main').getByRole('textbox');
  await input.fill(name);
  await input.press('Enter');
  await page.clock.runFor(5500);
  await page.clock.resume();
  await page.getByRole('heading', { name: RESULT_HEADING, exact: true }).waitFor({ timeout: 5000 });
}
const copy = (page: Page) => page.getByRole('button', { name: 'Copy certificate link', exact: true }).or(page.getByRole('link', { name: 'Copy certificate link', exact: true })).first();
const svgOf = (page: Page) => page.locator('svg[viewBox="0 0 1100 850"]').evaluate((e) => new XMLSerializer().serializeToString(e));

test('1–3. the link is /c/#<identifier>.<base64url name as typed>.<zone>; three vectors round-trip; the redraw is byte-identical; Copy writes exactly the link', async () => {
  for (const name of ['Folding  chair ', '🪑 chair', 'A & B #1']) {
    await withSitePage(
      async (page, url, context) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: url });
        await issue(page, name);
        const issuedSvg = await svgOf(page);
        await copy(page).click();
        await page.getByText(COPIED, { exact: true }).waitFor({ timeout: 3000 });
        const link = await page.evaluate(() => navigator.clipboard.readText());
        const id = R.identifier(name, AT);
        assert.equal(link, `${url}/c/#${id}.${R.base64url(name)}.${ZONE}`, `${JSON.stringify(name)}: the link`);
        const frag = link.split('#')[1].split('.');
        assert.equal(R.fromBase64url(frag[1]), name, 'the name round-trips exactly, as typed');
        const p2 = await context.newPage();
        await p2.goto(link);
        await p2.locator('svg[viewBox="0 0 1100 850"]').waitFor({ timeout: 5000 });
        assert.equal(await svgOf(p2), issuedSvg, `${JSON.stringify(name)}: the redraw is byte-identical to the issue`);
      },
      { timezoneId: ZONE },
    );
  }
});

test('3. with the clipboard refused, the link is shown selected in a read-only field under the refusal sentence', async () => {
  await withSitePage(
    async (page, url) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('denied', 'NotAllowedError')), readText: () => Promise.reject(new DOMException('denied', 'NotAllowedError')) } });
      });
      await issue(page, 'Folding chair');
      await copy(page).click();
      const sentence = page.getByText(CLIPBOARD_REFUSED, { exact: true });
      await sentence.waitFor({ timeout: 3000 });
      const field = page.locator('input[readonly], textarea[readonly]').first();
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        return el && 'value' in el ? { value: el.value, readOnly: el.readOnly, start: el.selectionStart, end: el.selectionEnd } : null;
      });
      assert.ok(r, 'the field holding the link has focus');
      assert.equal(r!.value, `${url}/c/#${R.fragment('SH-00PP-9AGR-1GTB', 'Folding chair', ZONE)}`);
      assert.equal(r!.readOnly, true);
      assert.deepEqual([r!.start, r!.end], [0, r!.value.length], 'the whole link is selected');
      const sb = (await sentence.boundingBox())!;
      const fb = (await field.boundingBox())!;
      assert.ok(fb.y >= sb.y, 'the field is under the sentence');
    },
    { timezoneId: ZONE },
  );
});

test('4. no request URL carries the name, its base64url form or the identifier (the fragment is never sent)', async () => {
  await withSitePage(
    async (page, url, context) => {
      const urls: string[] = [];
      context.on('request', (r) => urls.push(r.url()));
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: url });
      const name = 'Folding chair';
      await issue(page, name);
      await copy(page).click();
      const link = await page.evaluate(() => navigator.clipboard.readText());
      const p2 = await context.newPage();
      await p2.goto(link);
      await p2.locator('svg[viewBox="0 0 1100 850"]').waitFor({ timeout: 5000 });
      await p2.goto('/verify');
      const id = R.identifier(name, AT);
      const secrets = [name, encodeURIComponent(name), name.replace(/ /g, '+'), R.base64url(name), id, id.replace(/-/g, ''), ZONE, encodeURIComponent(ZONE)];
      const leaks = urls.filter((u) => secrets.some((s) => u.includes(s)));
      assert.ok(urls.length > 0);
      assert.deepEqual(leaks, []);
    },
    { timezoneId: ZONE },
  );
});
