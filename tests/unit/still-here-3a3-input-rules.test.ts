// E2 (still-here-3a3) — the ritual: input rules.
// garage/pack/ACCEPTANCE.md § E2, items 1–4 in Chromium on the built site (the browser specs run
// them in every engine with items 5–13: e2e/specs/still-here-3a3-ritual.spec.ts and -timing).
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHECK_BUTTON, EMPTY_INPUT, EXAMPLES, LINES, RESULT_HEADING } from '../../e2e/helpers/strings.ts';
import { withSitePage } from '../helpers/repo.ts';

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
type Page = import('playwright').Page;
const input = (p: Page) => p.getByRole('main').getByRole('textbox');
const button = (p: Page) => p.getByRole('button', { name: CHECK_BUTTON, exact: true });

test('1. ten example chips in Q10\'s order, equal to PRD R2; a tap fills the input, which stays editable', async () => {
  await withSitePage(async (page) => {
    await page.goto('/');
    const chips = await page.getByRole('main').getByRole('button').allTextContents();
    const ex = chips.map((c) => c.trim()).filter((c) => EXAMPLES.some((e) => e.toLowerCase() === c.toLowerCase()));
    assert.deepEqual(ex.map((c) => c.toLowerCase()), EXAMPLES.map((e) => e.toLowerCase()));
    for (const e of EXAMPLES) {
      await page.getByRole('button', { name: new RegExp(`^\\s*${esc(e)}\\s*$`, 'i') }).click();
      assert.equal((await input(page).inputValue()).toLowerCase(), e.toLowerCase(), `tapping ${e}`);
      assert.equal(await input(page).isEditable(), true);
    }
    await input(page).press('End');
    await page.keyboard.type('!');
    assert.match(await input(page).inputValue(), /!$/);
  });
});

test('2. empty or whitespace-only: aria-disabled, and pressing or Enter shows the sentence and issues nothing; Enter in a filled input starts the check', async () => {
  await withSitePage(async (page, url) => {
    for (const value of ['', '   ']) {
      await page.goto(`${url}/`);
      await input(page).fill(value);
      assert.equal(await button(page).getAttribute('aria-disabled'), 'true', `aria-disabled with ${JSON.stringify(value)}`);
      await button(page).click({ force: true });
      await page.getByText(EMPTY_INPUT, { exact: true }).waitFor({ timeout: 3000 });
      await input(page).press('Enter');
      await page.waitForTimeout(1200);
      assert.equal(await page.getByText(LINES[0], { exact: true }).count(), 0, 'nothing issued');
      assert.equal(await page.getByText(EMPTY_INPUT, { exact: true }).isVisible(), true);
    }
    await page.goto(`${url}/`);
    await input(page).fill('Wallet');
    assert.notEqual(await button(page).getAttribute('aria-disabled'), 'true');
    await input(page).press('Enter');
    await page.getByText(LINES[0], { exact: true }).waitFor({ timeout: 3000 });
  });
});

test('3. an 81st code point is not accepted; pasting 100 code points keeps the first 80', async () => {
  await withSitePage(
    async (page, url, context) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: url });
      await page.goto(`${url}/`);
      await input(page).click();
      await page.keyboard.type('a'.repeat(80));
      await page.keyboard.type('b');
      assert.equal([...(await input(page).inputValue())].length, 80);
      assert.ok(!(await input(page).inputValue()).includes('b'), 'the 81st code point is refused');
      // four-byte characters count as one code point each
      const chairs = '🪑'.repeat(100);
      await input(page).fill('');
      await page.evaluate((t) => navigator.clipboard.writeText(t), chairs);
      await input(page).click();
      await page.keyboard.press('ControlOrMeta+V');
      const v = await input(page).inputValue();
      assert.equal([...v].length, 80, 'pasting 100 keeps 80 code points');
      assert.equal(v, '🪑'.repeat(80));
    },
  );
});

test('4. <script>alert(1)</script> & "x" is literal text in the result and the certificate; no dialog opens', async () => {
  await withSitePage(async (page, url) => {
    const dialogs: string[] = [];
    page.on('dialog', (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    const name = '<script>alert(1)</script> & "x"';
    await page.clock.install({ time: new Date('2026-10-03T10:52:00Z') });
    await page.goto(`${url}/`);
    await input(page).fill(name);
    await input(page).press('Enter');
    await page.clock.runFor(5500);
    await page.getByRole('heading', { name: RESULT_HEADING, exact: true }).waitFor({ timeout: 5000 });
    assert.ok(await page.getByText(name, { exact: true }).first().isVisible(), 'the name, as typed, in the result');
    const inSvg = await page.evaluate((n) => [...document.querySelectorAll('svg[viewBox="0 0 1100 850"] text')].some((t) => (t.textContent ?? '').includes(n)), name);
    assert.ok(inSvg, 'the name, as typed, in the certificate');
    assert.equal(await page.evaluate(() => document.querySelectorAll('main script').length), 0, 'no script element made from the name');
    assert.deepEqual(dialogs, []);
  });
});
