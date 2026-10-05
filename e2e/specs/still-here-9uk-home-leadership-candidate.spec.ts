// DS5 (still-here-9uk) — home and leadership candidates, rendered, in Chromium and WebKit at 390
// and 1440. garage/pack/ACCEPTANCE.md § DS5 items 1–3 (item 4's files: the unit test).
import { expect, test, type Page } from '@playwright/test';
import { checkButton, consoleErrors, exampleChip, objectInput, onlyEngines } from '../helpers/site.ts';
import { DESIGN_COLOURS, EXAMPLES, FONT_FAMILIES, HOME_HEADING, LEADERSHIP } from '../helpers/strings.ts';
import { staff } from '../helpers/staff.ts';

onlyEngines('chromium', 'webkit');

// each card's name: the staff record's, except Lucas's card, which reads "Lucas" (C2 red-pen)
const NAMES = staff().map((p) => [p.id, p.cardName] as const);

async function paletteAndFaces(page: Page): Promise<{ colours: string[]; families: string[] }> {
  return page.evaluate(() => {
    const colours = new Set<string>();
    const families = new Set<string>();
    for (const el of [document.documentElement, ...document.querySelectorAll('body *')]) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const props = ['color', 'background-color'];
      for (const side of ['top', 'right', 'bottom', 'left']) if (parseFloat(cs.getPropertyValue(`border-${side}-width`)) > 0) props.push(`border-${side}-color`);
      if (el instanceof SVGElement) props.push('fill', 'stroke');
      for (const p of props) {
        const v = cs.getPropertyValue(p);
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(v);
        if (!m || (m[4] !== undefined && Number(m[4]) === 0)) continue;
        if (p === 'color' && !(el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))) continue;
        colours.add(`${m[1]},${m[2]},${m[3]}`);
      }
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) families.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
    }
    return { colours: [...colours], families: [...families] };
  });
}

test('1. / renders the heading, the input, Check presence and the ten examples, the chair placed; zero console errors', async ({ page }) => {
  const errors = consoleErrors(page);
  await page.goto('/');
  const heading = page.getByRole('heading', { name: HOME_HEADING });
  await expect(heading).toBeVisible();
  await expect(objectInput(page)).toHaveCount(1);
  await expect(checkButton(page)).toBeVisible();
  for (const e of EXAMPLES) await expect(exampleChip(page, e)).toBeVisible();
  const chair = page.locator('img[src*="hero"], picture:has(source[srcset*="hero"]) img').first();
  await expect(chair).toBeVisible();
  const c = (await chair.boundingBox())!;
  const h = (await heading.boundingBox())!;
  const vw = page.viewportSize()!.width;
  if (vw >= 1440) expect(c.x, 'the chair is on the right at 1440').toBeGreaterThanOrEqual(vw / 2 - 1);
  else expect(c.y + c.height, 'the chair is above the heading at 390').toBeLessThanOrEqual(h.y + 1);
  expect(errors).toEqual([]);
});

test("2. /leadership renders twelve cards in PRD R26's order", async ({ page }) => {
  await page.goto('/leadership');
  const main = page.getByRole('main');
  const ys: number[] = [];
  const xs: number[] = [];
  for (const [id] of LEADERSHIP) {
    const name = NAMES.find(([i]) => i === id)![1];
    const el = main.getByText(name, { exact: true }).first();
    await expect(el).toBeVisible();
    const b = (await el.boundingBox())!;
    ys.push(b.y);
    xs.push(b.x);
  }
  for (let i = 1; i < ys.length; i++) expect(ys[i] > ys[i - 1] + 2 || (Math.abs(ys[i] - ys[i - 1]) <= 2 && xs[i] > xs[i - 1]), `card ${i + 1} follows card ${i}`).toBe(true);
  await expect(main.locator('img')).toHaveCount(12);
});

test("3. every computed colour is one of DESIGN.md's; every font family one of its four", async ({ page }) => {
  const allowed = new Set(Object.values(DESIGN_COLOURS).map((c) => c.join(',')));
  for (const path of ['/', '/leadership']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const r = await paletteAndFaces(page);
    expect(r.colours.filter((c) => !allowed.has(c)), `${path}: colours outside DESIGN.md`).toEqual([]);
    expect(r.families.filter((f) => !(FONT_FAMILIES as readonly string[]).includes(f)), `${path}: families outside DESIGN.md`).toEqual([]);
  }
});
