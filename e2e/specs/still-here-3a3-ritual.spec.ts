// E2 (still-here-3a3) — the ritual. garage/pack/ACCEPTANCE.md § E2 items 1–4 and 8–13; items 5–7
// are in the timing spec; item 14 is the critic's blind pick after C2. Where the clock does not
// matter, the page clock (page.clock) runs the sequence forward instead of waiting.
import { expect, test, type Page } from '@playwright/test';
import { certificateSvg, checkButton, exampleChip, objectInput, resultHeading, storedPortfolio } from '../helpers/site.ts';
import {
  BEFORE_2026,
  EMPTY_INPUT,
  EXAMPLES,
  LINES,
  NO_TELLS,
  PORTFOLIO_LINE,
} from '../helpers/strings.ts';

const AT = '2026-10-03T10:52:00.400Z';

/**
 * Install the page clock (once per page) ten seconds before `at`, open home, type the name, pause
 * the clock at `at` and press Enter, so the press lands on that second however long the load took.
 * The clock then runs again, unless `paused`: then it stays paused and every runFor is exact.
 */
const installed = new WeakSet<Page>();
async function press(page: Page, name: string, at = AT, paused = false): Promise<void> {
  const first = !installed.has(page);
  if (first) {
    await page.clock.install({ time: new Date(new Date(at).getTime() - 10_000) });
    installed.add(page);
  }
  await page.goto('/');
  await objectInput(page).fill(name);
  if (first) await page.clock.pauseAt(new Date(at));
  await objectInput(page).press('Enter');
  if (first && !paused) await page.clock.resume();
}

const stored = async (page: Page) => {
  const v = await storedPortfolio(page);
  return Array.isArray(v) ? v.length : v == null ? 0 : -1;
};

test('1. ten example chips in order, equal to PRD R2; a tap fills the input, which stays editable', async ({ page }) => {
  await page.goto('/');
  let prev = -1;
  for (const e of EXAMPLES) {
    const chip = exampleChip(page, e);
    await expect(chip).toBeVisible();
    const b = (await chip.boundingBox())!;
    const order = b.y * 10_000 + b.x;
    expect(order, `${e} follows the example before it`).toBeGreaterThan(prev);
    prev = order;
  }
  await exampleChip(page, 'The Moon').click();
  await expect(objectInput(page)).toHaveValue(/^the moon$/i);
  await expect(objectInput(page)).toBeEditable();
  await objectInput(page).press('End');
  await page.keyboard.type('s');
  await expect(objectInput(page)).toHaveValue(/^the moons$/i);
});

test('2. empty or whitespace-only: aria-disabled; pressing or Enter shows the sentence and issues nothing; Enter in a filled input starts the check', async ({ page }) => {
  for (const v of ['', '  \t ']) {
    await page.goto('/');
    await objectInput(page).fill(v);
    await expect(checkButton(page)).toHaveAttribute('aria-disabled', 'true');
    await checkButton(page).click({ force: true });
    await expect(page.getByText(EMPTY_INPUT, { exact: true })).toBeVisible();
    await objectInput(page).press('Enter');
    await expect(page.getByText(EMPTY_INPUT, { exact: true })).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page.getByText(LINES[0], { exact: true })).toHaveCount(0);
    expect(await stored(page)).toBe(0);
  }
  await page.goto('/');
  await objectInput(page).fill('Phone');
  await expect(checkButton(page)).not.toHaveAttribute('aria-disabled', 'true');
  await objectInput(page).press('Enter');
  await expect(page.getByText(LINES[0], { exact: true })).toBeVisible();
});

test('3. an 81st code point is not accepted; pasting 100 code points keeps the first 80', async ({ page, browserName, context }) => {
  await page.goto('/');
  await objectInput(page).click();
  await page.keyboard.type('x'.repeat(80) + 'y');
  await expect(objectInput(page)).toHaveValue('x'.repeat(80));
  await objectInput(page).fill('');
  const hundred = '椅'.repeat(50) + '🪑'.repeat(50);
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate((t) => navigator.clipboard.writeText(t), hundred);
    await objectInput(page).click();
    await page.keyboard.press('ControlOrMeta+V');
  } else {
    await objectInput(page).click();
    await page.keyboard.insertText(hundred);
  }
  const v = await objectInput(page).inputValue();
  expect([...v].length).toBe(80);
  expect(v).toBe([...hundred].slice(0, 80).join(''));
});

test('4. markup in a name is literal text in the result and the certificate; no dialog', async ({ page }) => {
  const dialogs: string[] = [];
  page.on('dialog', (d) => {
    dialogs.push(d.message());
    void d.dismiss();
  });
  const name = '<script>alert(1)</script> & "x"';
  await press(page, name);
  await page.clock.runFor(5500);
  await expect(resultHeading(page)).toBeVisible();
  await expect(page.getByRole('main').getByText(name, { exact: true }).first()).toBeVisible();
  await expect(certificateSvg(page).getByText(name, { exact: true })).toHaveCount(1);
  expect(dialogs).toEqual([]);
});

test('8. the lines are in an aria-live="polite" region; focus moves to the result heading', async ({ page }) => {
  await press(page, 'Glasses');
  await page.clock.runFor(200);
  const live = page.locator('[aria-live="polite"]');
  await expect(live.getByText(LINES[0], { exact: true }).first()).toBeAttached();
  await page.clock.runFor(1100);
  await expect(live.getByText(LINES[1], { exact: true }).first()).toBeAttached();
  await page.clock.runFor(1100);
  await expect(live.getByText(LINES[2], { exact: true }).first()).toBeAttached();
  await page.clock.runFor(3000);
  await expect(resultHeading(page)).toBeFocused();
});

test('9. no tells: the sequence DOM is identical for the fourteen names of PRD R7', async ({ page }) => {
  test.setTimeout(120_000);
  const doms: string[] = [];
  for (const name of NO_TELLS) {
    await press(page, name, AT, true);
    const stages: string[] = [];
    for (const step of [300, 1100, 1100]) {
      await page.clock.runFor(step);
      stages.push(await page.evaluate(() => [...document.querySelectorAll('[aria-live="polite"]')].map((e) => e.outerHTML).join('\n')));
    }
    doms.push(stages.join('\n'));
  }
  for (let i = 1; i < doms.length; i++) expect(doms[i], `${NO_TELLS[i]} tells something Folding chair does not`).toBe(doms[0]);
});

test('10. during the sequence the input and chips are inert; the identifier encodes the second of the press; leaving issues nothing', async ({ page }) => {
  await press(page, 'Folding chair', AT, true);
  await page.clock.runFor(1000);
  await expect(objectInput(page)).toHaveAttribute('aria-disabled', 'true');
  await expect(objectInput(page)).not.toBeEditable();
  for (const e of EXAMPLES) await expect(exampleChip(page, e)).toHaveAttribute('aria-disabled', 'true');
  // saved only when the result appears: nothing is stored during the sequence
  expect(await stored(page), 'nothing saved at 1 s').toBe(0);
  await page.clock.runFor(2500);
  expect(await stored(page), 'nothing saved at 3.5 s').toBe(0);
  await expect(resultHeading(page)).toHaveCount(0);
  await page.clock.runFor(2000);
  await expect(resultHeading(page)).toBeVisible();
  // pressed at 10:52:00.4, shown at 10:52:05: the identifier is the press's second
  await expect(page.getByText('SH-00PP-9AGR-1GTB', { exact: true }).first()).toBeVisible();
  const saved = (await storedPortfolio(page)) as { identifier: string }[];
  expect(saved.map((s) => s.identifier)).toEqual(['SH-00PP-9AGR-1GTB']);

  const leave: [string, (p: Page) => Promise<unknown>][] = [
    ['reload', (p) => p.reload()],
    ['Back', (p) => p.goBack()],
    ['the mark', (p) => p.getByRole('banner').getByRole('link', { name: /STILL HERE/ }).first().click()],
    [
      'a menu link',
      async (p) => {
        const b = p.getByRole('banner').getByRole('button', { name: /menu/i });
        if (await b.isVisible()) await b.click();
        await p.getByRole('navigation').getByRole('link', { name: 'Leadership', exact: true }).click();
      },
    ],
  ];
  for (const [how, go] of leave) {
    const p = await page.context().newPage();
    await p.goto('/leadership');
    await p.evaluate(() => localStorage.clear());
    await press(p, 'Wallet', AT, true);
    await p.clock.runFor(1500);
    await go(p);
    await p.clock.runFor(6000);
    await p.goto('/');
    await p.clock.runFor(6000);
    await expect(resultHeading(p), `${how}: nothing issued`).toHaveCount(0);
    expect(await stored(p), `${how}: nothing saved`).toBe(0);
    await p.close();
  }
});

test('11. the address stays /, no history entry; the result replaces the form; a reload shows an empty home; the portfolio line links /portfolio', async ({ page }) => {
  await page.clock.install({ time: new Date(AT) });
  await page.goto('/');
  const before = await page.evaluate(() => history.length);
  await objectInput(page).fill('Car keys');
  await objectInput(page).press('Enter');
  await page.clock.runFor(5500);
  await expect(resultHeading(page)).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/');
  expect(new URL(page.url()).hash).toBe('');
  expect(await page.evaluate(() => history.length)).toBe(before);
  await expect(objectInput(page)).toBeHidden();
  const line = page.getByText(PORTFOLIO_LINE).first();
  await expect(line).toBeVisible();
  const link = page.getByRole('link').filter({ hasText: /Portfolio|device/ }).first();
  await expect(link).toHaveAttribute('href', '/portfolio');
  await page.reload();
  await expect(objectInput(page)).toBeVisible();
  await expect(objectInput(page)).toHaveValue('');
  await expect(resultHeading(page)).toHaveCount(0);
});

test('12. Check another empties the input, restores the form, and puts focus in it', async ({ page }) => {
  await press(page, 'A lighthouse');
  await page.clock.runFor(5500);
  await expect(resultHeading(page)).toBeVisible();
  await page.getByRole('button', { name: 'Check another', exact: true }).or(page.getByRole('link', { name: 'Check another', exact: true })).first().click();
  await expect(objectInput(page)).toBeVisible();
  await expect(objectInput(page)).toHaveValue('');
  await expect(objectInput(page)).toBeFocused();
});

test('13. a clock before 2026: the same sequence, then the pre-2026 sentence; nothing drawn or saved', async ({ page }) => {
  await press(page, 'Folding chair', '2025-12-31T23:00:00Z');
  for (const l of LINES) {
    await page.clock.runFor(1100);
    await expect(page.getByText(l, { exact: true })).toBeAttached();
  }
  await page.clock.runFor(3000);
  await expect(page.getByText(BEFORE_2026, { exact: true })).toBeVisible();
  await expect(certificateSvg(page)).toHaveCount(0);
  expect(await stored(page)).toBe(0);
});

test('14. (after C2) critic blind pick of the result screen against home-390-golden.png and home-1440-golden.png', async () => {
  test.skip(true, 'HUMAN-JUDGED: item 14 is the critic\'s blind pick once C2 is recorded in CHECKPOINTS.md (ACCEPTANCE conventions)');
});
