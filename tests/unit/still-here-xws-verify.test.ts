// E6 (still-here-xws) — reopen and verify.
// garage/pack/ACCEPTANCE.md § E6, items 1–7 in Chromium on the built site; item 5 (every single
// substitution and adjacent swap of the four published vectors) runs here only, through the Verify
// page, eight tabs at a time. The browser spec repeats items 1–4, 6 and 7 in every engine.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAILURE_LINKS, FUTURE, NOT_LOCATED, PORTFOLIO_KEY, RESULT_ACTIONS, VECTORS, VERIFY_EMPTY, VERIFY_LABELS } from '../../e2e/helpers/strings.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { withSitePage } from '../helpers/repo.ts';

type Page = import('playwright').Page;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Fill Verify and submit by Enter in `enterIn`; returns the page's main text afterwards. */
async function verify(page: Page, id: string, name: string, enterIn: 'identifier' | 'name' = 'name'): Promise<string> {
  await page.goto('/verify');
  await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
  await page.getByLabel(VERIFY_LABELS.name).fill(name);
  await page.getByLabel(enterIn === 'name' ? VERIFY_LABELS.name : VERIFY_LABELS.identifier).press('Enter');
  await page
    .getByText(/^Issued by STILL HERE for |^We could not locate this certificate\.|^This certificate has not been issued yet\./)
    .first()
    .waitFor({ timeout: 5000 });
  return norm(await page.getByRole('main').innerText());
}

test('1. /c/#<valid link> redraws and states the issue in the link\'s zone, from any zone; the four actions; nothing added to the portfolio', async () => {
  await withSitePage(
    async (page) => {
      const link = `/c/#${R.fragment('SH-00PP-9AGR-1GTB', 'Folding chair', 'America/Chicago')}`;
      await page.goto(link);
      await page.locator('svg[viewBox="0 0 1100 850"]').waitFor({ timeout: 5000 });
      const text = norm(await page.getByRole('main').innerText());
      assert.ok(text.includes("Issued by STILL HERE for 'Folding chair' on 3 October 2026 at 05:52:00 (America/Chicago)."), text.slice(0, 200));
      for (const a of RESULT_ACTIONS) {
        const el = page.getByRole('button', { name: a, exact: true }).or(page.getByRole('link', { name: a, exact: true })).first();
        assert.ok(await el.isVisible(), `${a} under it`);
      }
      assert.equal(await page.getByRole('link', { name: 'Check another', exact: true }).getAttribute('href'), '/');
      assert.equal(await page.evaluate((k) => localStorage.getItem(k), PORTFOLIO_KEY), null, 'opening a link adds nothing to the portfolio');
    },
    { timezoneId: 'Asia/Tokyo' },
  );
});

test('2. /verify confirms each published vector in UTC; Enter in either field submits', async () => {
  await withSitePage(async (page) => {
    for (const [i, v] of VECTORS.entries()) {
      const text = await verify(page, v.id, v.name, i % 2 ? 'identifier' : 'name');
      assert.ok(text.includes(norm(R.confirmation(v.name, v.time, 'UTC'))), `${v.name}: ${text.slice(0, 160)}`);
    }
  });
});

test('3. malformed, then wrong name or typo, each the mismatch sentence; only a matching name is judged for the future; over 80 code points: mismatch', async () => {
  await withSitePage(async (page) => {
    const cases: [string, string][] = [
      ['hello', 'Folding chair'],
      ['SH-00PP-9AGR', 'Folding chair'],
      ['SH-00PP-9AGR-1GTB-00', 'Folding chair'],
      ['SH-00PP-9AGR-1GTB', 'Folding chairs'],
      ['SH-00PP-9AGR-1GTB', 'Foldng chair'],
      ['SH-01MR-P6G7-6TA1', 'Folding chair'],
      [R.identifier('a'.repeat(81), '2026-10-03T10:52:00Z'), 'a'.repeat(81)],
    ];
    for (const [id, name] of cases) {
      const text = await verify(page, id, name);
      assert.ok(text.includes(NOT_LOCATED), `${id} / ${name.slice(0, 20)}: ${text.slice(0, 120)}`);
      assert.ok(!text.includes(FUTURE));
    }
    await page.goto(`/c/#${R.fragment('SH-00PP-9AGR-1GTX', 'Folding chair', 'America/Chicago')}`);
    await page.getByText(NOT_LOCATED, { exact: true }).waitFor({ timeout: 5000 });
    await page.goto('/c/#not-a-link');
    await page.getByText(NOT_LOCATED, { exact: true }).waitFor({ timeout: 5000 });
  });
});

test('4. more than five minutes ahead of the viewer\'s clock: the future sentence; four minutes ahead verifies', async () => {
  await withSitePage(async (page) => {
    const now = new Date('2026-10-04T12:00:00Z');
    await page.clock.install({ time: now });
    const six = R.identifier('Folding chair', new Date(now.getTime() + 6 * 60_000));
    const four = R.identifier('Folding chair', new Date(now.getTime() + 4 * 60_000));
    let text = await verify(page, six, 'Folding chair');
    assert.ok(text.includes(FUTURE), text.slice(0, 160));
    text = await verify(page, four, 'Folding chair');
    assert.ok(text.includes(norm(R.confirmation('Folding chair', R.issued(four), 'UTC'))), text.slice(0, 160));
    text = await verify(page, 'SH-01MR-P6G7-6TA1', 'A time capsule (contents unknown)');
    assert.ok(text.includes(FUTURE));
  });
});

test('5. every single substitution and adjacent swap of each published vector gets the mismatch sentence', async () => {
  await withSitePage(async (_page, _url, context) => {
    const work = VECTORS.filter((v, i) => VECTORS.findIndex((w) => w.id === v.id) === i).flatMap((v) => R.mutations(v.id).map((id) => [id, v.name] as const));
    assert.ok(work.length > 1000, `${work.length} altered identifiers`);
    const pages = await Promise.all([...Array(8)].map(() => context.newPage()));
    const wrong: string[] = [];
    let next = 0;
    await Promise.all(
      pages.map(async (p) => {
        while (next < work.length) {
          const [id, name] = work[next++];
          const text = await verify(p, id, name);
          if (!text.includes(NOT_LOCATED)) wrong.push(id);
        }
      }),
    );
    assert.deepEqual(wrong.slice(0, 20), [], `${wrong.length} altered identifiers were not refused`);
  });
});

test('6. lower case, o for zero, no SH-; an empty field: Verify is aria-disabled and pressing it asks for both', async () => {
  await withSitePage(async (page) => {
    const text = await verify(page, 'oopp-9agr-1gtb', 'folding chair');
    assert.ok(text.includes(norm(R.confirmation('folding chair', '2026-10-03T10:52:00Z', 'UTC'))), text.slice(0, 160));
    for (const [id, name] of [['', 'Folding chair'], ['SH-00PP-9AGR-1GTB', ''], ['', '']]) {
      await page.goto('/verify');
      await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
      await page.getByLabel(VERIFY_LABELS.name).fill(name);
      const button = page.getByRole('button', { name: VERIFY_LABELS.button, exact: true });
      assert.equal(await button.getAttribute('aria-disabled'), 'true');
      await button.click({ force: true });
      await page.getByText(VERIFY_EMPTY, { exact: true }).waitFor({ timeout: 3000 });
    }
  });
});

test('7. a mismatch or future draws no certificate: the sentence and two links; bare /c/ shows the Verify form', async () => {
  await withSitePage(async (page) => {
    for (const [id, name, sentence] of [['hello', 'x', NOT_LOCATED], ['SH-01MR-P6G7-6TA1', 'A time capsule (contents unknown)', FUTURE]]) {
      await verify(page, id, name);
      assert.ok(await page.getByText(sentence, { exact: true }).isVisible());
      assert.equal(await page.locator('svg[viewBox="0 0 1100 850"]').count(), 0, 'no certificate');
      assert.equal(await page.getByRole('link', { name: FAILURE_LINKS[0], exact: true }).getAttribute('href'), '/verify');
      assert.equal(await page.getByRole('link', { name: FAILURE_LINKS[1], exact: true }).getAttribute('href'), '/');
    }
    await page.goto('/c/');
    assert.ok(await page.getByLabel(VERIFY_LABELS.identifier).isVisible(), 'bare /c/: the identifier field');
    assert.ok(await page.getByLabel(VERIFY_LABELS.name).isVisible(), 'bare /c/: the name field');
    assert.ok(await page.getByRole('button', { name: VERIFY_LABELS.button, exact: true }).isVisible(), 'bare /c/: Verify');
  });
});
