// X5 (still-here-eli) — accessibility in the browser. garage/pack/ACCEPTANCE.md § X5 items 1, 2
// and 4 (item 3 is computed in the unit test). axe-core through @axe-core/playwright: the package
// is added, pinned exactly, with its licence row, by this bead (it is imported here when the test
// runs, so its absence fails the test rather than the run).
import { expect, test, type Page } from '@playwright/test';
import { LINES, PAGES } from '../helpers/strings.ts';

const ALL = [...PAGES.map((p) => p.path), '/no-such-page'];

test('1. axe: zero serious and zero critical findings on every page', async ({ page }) => {
  test.setTimeout(180_000);
  const { default: AxeBuilder } = (await import('@axe-core/playwright')) as { default: new (o: { page: Page }) => { analyze: () => Promise<{ violations: { id: string; impact: string; nodes: unknown[] }[] }> } };
  const found: string[] = [];
  for (const p of ALL) {
    await page.goto(p);
    const r = await new AxeBuilder({ page }).analyze();
    for (const v of r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) found.push(`${p}: ${v.id} (${v.impact}, ${v.nodes.length})`);
  }
  expect(found).toEqual([]);
});

test('2. Tab reaches every control on every page, each with a visible focus indicator of at least 3:1', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', "WebKit's Tab key skips links unless full keyboard access is switched on in the browser's preferences; the walk is in Chromium and Firefox");
  test.setTimeout(180_000);
  for (const p of ALL) {
    await page.goto(p);
    const total = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((e) => (e as HTMLElement).getClientRects().length > 0 && !(e as HTMLElement).closest('[inert], [hidden]'));
      els.forEach((e, i) => e.setAttribute('data-a11y-control', String(i)));
      return els.length;
    });
    const reached = new Set<string>();
    const weak: string[] = [];
    for (let i = 0; i < total + 10 && reached.size < total; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const rgb = (s: string) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
        const lum = (c: number[]) => {
          const v = c.map((x) => {
            x /= 255;
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
        };
        const contrast = (a: string, b: string) => {
          const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m);
          return (x + 0.05) / (y + 0.05);
        };
        const cs = getComputedStyle(el);
        let bg = 'rgb(250, 247, 240)';
        for (let e: HTMLElement | null = el.parentElement; e; e = e.parentElement) {
          const c = getComputedStyle(e).backgroundColor;
          if (!/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(c)) {
            bg = c;
            break;
          }
        }
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 ? contrast(cs.outlineColor, bg) : 0;
        const shadow = cs.boxShadow && cs.boxShadow !== 'none' ? contrast(cs.boxShadow, bg) : 0;
        return { id: el.getAttribute('data-a11y-control'), label: `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 20)}"`, best: Math.max(outline, shadow) };
      });
      if (!r || r.id === null) continue;
      reached.add(r.id);
      if (r.best < 3) weak.push(`${p}: ${r.label} (${r.best.toFixed(2)}:1)`);
    }
    expect(reached.size, `${p}: Tab reached ${reached.size} of ${total} controls`).toBe(total);
    expect(weak).toEqual([]);
  }
});

test('4. the verification lines are in a polite live region; the result heading takes focus', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-03T10:52:00Z') });
  await page.goto('/');
  await page.getByRole('main').getByRole('textbox').fill('Folding chair');
  await page.getByRole('main').getByRole('textbox').press('Enter');
  await page.clock.runFor(300);
  await expect(page.locator('[aria-live="polite"]').getByText(LINES[0], { exact: true }).first()).toBeAttached();
  await page.clock.runFor(5500);
  await expect(page.getByRole('heading', { name: 'STILL HERE.', exact: true })).toBeFocused();
});
