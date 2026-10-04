// E2 (still-here-3a3) — the ritual's timing and stillness, measured in the page.
// garage/pack/ACCEPTANCE.md § E2 items 5, 6 and 7. Times are first-visible moments sampled every
// animation frame (performance.now), so each bar carries one frame (17 ms) of measuring tolerance.
import { expect, test, type Page } from '@playwright/test';
import { EXAMPLES, LINES, PORTFOLIO_KEY } from '../helpers/strings.ts';

const FRAME = 17;

/** Installed before the page loads: records the press, each line's first visible frame, the certificate's, animations, and the green marks' boxes every 250 ms. */
const RECORDER = `(() => {
  const LINES = ${JSON.stringify(LINES)};
  const r = window.__sh = { press: null, presses: 0, seen: {}, cert: null, maxAnimations: 0, samples: [] };
  const visible = (el) => el && el.isConnected && el.getClientRects().length > 0 &&
    (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const byText = (t) => {
    const w = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) if (n.data.trim() === t && visible(n.parentElement)) return n.parentElement;
    return null;
  };
  const isGreen = (v) => /rgb\\(\\s*6,\\s*152,\\s*82/.test(v || '');
  const marks = () => [...document.querySelectorAll('body *')].filter((e) => {
    if (!visible(e) || e.closest('svg[viewBox="0 0 1100 850"]')) return false;
    const cs = getComputedStyle(e);
    return isGreen(cs.color) && e.childElementCount === 0 && !e.textContent.trim() || isGreen(cs.backgroundColor) || isGreen(cs.fill) || isGreen(cs.stroke) || isGreen(cs.borderTopColor) && parseFloat(cs.borderTopWidth) > 0;
  });
  const ids = new WeakMap(); let next = 0;
  const id = (e) => (ids.has(e) || ids.set(e, ++next), ids.get(e));
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter') { r.presses++; if (r.press === null) r.press = performance.now(); } }, true);
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('button'); if (b && /Check presence/.test(b.textContent)) { r.presses++; if (r.press === null) r.press = performance.now(); } }, true);
  const tick = () => {
    const now = performance.now();
    if (r.press !== null) {
      LINES.forEach((t, i) => { if (r.seen[i] === undefined && byText(t)) r.seen[i] = now; });
      if (r.cert === null && visible(document.querySelector('svg[viewBox="0 0 1100 850"]'))) r.cert = now;
      r.maxAnimations = Math.max(r.maxAnimations, document.getAnimations().length);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setInterval(() => {
    if (r.press === null || r.cert !== null) return;
    r.samples.push(marks().map((e) => { const b = e.getBoundingClientRect(); return [id(e), b.x, b.y, b.width, b.height, getComputedStyle(e).transform].join('|'); }).sort());
  }, 250);
})();`;

type Run = { press: number; presses: number; seen: { [i: number]: number }; cert: number | null; maxAnimations: number; samples: string[][] };

async function ritual(page: Page, name: string): Promise<Run> {
  await page.goto('/');
  const input = page.getByRole('main').getByRole('textbox');
  await input.fill(name);
  await input.press('Enter');
  await page.waitForFunction(() => (window as unknown as { __sh: { cert: number | null } }).__sh.cert !== null, null, { timeout: 8000 });
  return page.evaluate(() => (window as unknown as { __sh: Run }).__sh);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(RECORDER);
});

test('5. one press; three lines in order, each ≥ 1,000 ms before the next; the certificate at 4,000–5,000 ms; ten names within 200 ms', async ({ page }) => {
  test.setTimeout(180_000);
  // a second press does nothing
  await page.goto('/');
  const input = page.getByRole('main').getByRole('textbox');
  await input.fill('Folding chair');
  await input.press('Enter');
  await page.waitForTimeout(300);
  await input.press('Enter').catch(() => undefined);
  await page.getByRole('button', { name: 'Check presence', exact: true }).click({ force: true, timeout: 1000 }).catch(() => undefined);
  await page.waitForFunction(() => (window as unknown as { __sh: { cert: number | null } }).__sh.cert !== null, null, { timeout: 8000 });
  expect(await page.getByText(LINES[0], { exact: true }).count()).toBeLessThanOrEqual(1);
  const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '[]'), PORTFOLIO_KEY);
  expect(stored.length, 'one press, one certificate').toBe(1);

  const after: number[] = [];
  for (const name of EXAMPLES) {
    const r = await ritual(page, name);
    const t = [0, 1, 2].map((i) => r.seen[i]);
    expect(t.every((x) => typeof x === 'number'), `${name}: all three lines appeared`).toBe(true);
    expect(t[1] - t[0], `${name}: line 1 held`).toBeGreaterThanOrEqual(1000 - FRAME);
    expect(t[2] - t[1], `${name}: line 2 held`).toBeGreaterThanOrEqual(1000 - FRAME);
    expect(r.cert! - t[2], `${name}: line 3 held`).toBeGreaterThanOrEqual(1000 - FRAME);
    const at = r.cert! - r.press;
    expect(at, `${name}: certificate at ${Math.round(at)} ms`).toBeGreaterThanOrEqual(4000 - FRAME);
    expect(at).toBeLessThanOrEqual(5000 + FRAME);
    after.push(at);
  }
  expect(Math.max(...after) - Math.min(...after), 'spread across ten names').toBeLessThanOrEqual(200);
});

test("6. the indicator's box and transform are identical in every sample from press to result", async ({ page }) => {
  const r = await ritual(page, 'Folding chair');
  expect(r.samples.length, 'samples every 250 ms').toBeGreaterThanOrEqual(15);
  expect(r.samples[0].length, 'a green indicator during the sequence').toBeGreaterThan(0);
  for (const s of r.samples) expect(s, 'the indicator never moves').toEqual(r.samples[0]);
});

test('7. reduced motion: no animation at any point; the lines in order; the timing of item 5', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const r = await ritual(page, 'Folding chair');
  expect(r.maxAnimations, 'document.getAnimations() stayed empty').toBe(0);
  expect(r.seen[0]).toBeLessThan(r.seen[1]);
  expect(r.seen[1]).toBeLessThan(r.seen[2]);
  expect(r.seen[1] - r.seen[0]).toBeGreaterThanOrEqual(1000 - FRAME);
  expect(r.seen[2] - r.seen[1]).toBeGreaterThanOrEqual(1000 - FRAME);
  const at = r.cert! - r.press;
  expect(at).toBeGreaterThanOrEqual(4000 - FRAME);
  expect(at).toBeLessThanOrEqual(5000 + FRAME);
});
