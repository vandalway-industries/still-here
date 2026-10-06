// s07 (still-here-txf) — the second-floor printer on careers, beside the stapler under "Your
// equipment" (C3, garage/pack/CHECKPOINTS.md § Record, 2026-10-05). Discovered from S6
// (still-here-skd). Run in Chromium and WebKit at 1440×900 and 390×844.
import { expect, test } from '@playwright/test';

const PRINTER = 'An office printer with an "Out of order" sign, covered in dated sticky notes, its bottom tray hanging open.';
const STAPLER = 'A black office stapler on a white backdrop.';

test('s07 is visible, decoded, under "Your equipment" beside the stapler', async ({ page }) => {
  await page.goto('/careers');
  const main = page.getByRole('main');
  const printer = main.getByRole('img', { name: PRINTER, exact: true });
  await expect(printer).toHaveCount(1);
  await printer.scrollIntoViewIfNeeded();
  await expect(printer).toBeVisible();
  await expect(printer).toBeInViewport();
  await expect.poll(() => printer.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth)).toBeGreaterThan(0);

  // the "Your equipment" block: the innermost element holding that heading
  const heading = page.getByRole('heading', { name: 'Your equipment', exact: true });
  await expect(main.getByRole('heading', { name: 'Your equipment', exact: true })).toBeVisible();
  const equipment = main.locator('div, section').filter({ has: heading }).last();
  await expect(equipment.getByRole('img', { name: PRINTER, exact: true })).toHaveCount(1);
  const stapler = equipment.getByRole('img', { name: STAPLER, exact: true });
  await expect(stapler).toHaveCount(1);
  await expect(equipment.getByRole('heading')).toHaveText(['Your equipment']);

  // beside: the stapler comes immediately before the printer, and the two share a row
  const before = await printer.evaluate((e) => {
    const fig = e.closest('figure') ?? e;
    const prev = fig.previousElementSibling;
    const img = prev ? (prev.matches('img') ? prev : prev.querySelector('img')) : null;
    return img?.getAttribute('alt') ?? '';
  });
  expect(before).toBe(STAPLER);
  const p = (await printer.boundingBox())!;
  const s = (await stapler.boundingBox())!;
  expect(p.x).toBeGreaterThan(s.x + s.width - 1);
  expect(Math.min(p.y + p.height, s.y + s.height) - Math.max(p.y, s.y)).toBeGreaterThan(0);
});
