// S7 (still-here-5ki) — enterprise in every engine: the call to action, no form, testimonials
// attributed, photographs loaded. garage/pack/ACCEPTANCE.md § S7 items 1–4.
import { expect, test } from '@playwright/test';
import { ENTERPRISE_CTA } from '../helpers/strings.ts';

test('the call to action; nothing to fill in; the testimonials; the photographs', async ({ page }) => {
  await page.goto('/enterprise');
  await expect(page.getByText(ENTERPRISE_CTA, { exact: true })).toBeVisible();
  await expect(page.locator('form, input, textarea, select')).toHaveCount(0);
  await expect(page.getByText(/Eileen Webb, Municipal Archivist/).first()).toBeVisible();
  for (const id of ['s08', 'b3-wide-courthouse', 'p12-eileen-courthouse']) {
    const img = page.getByRole('main').locator(`img[src*="/${id}-"], img[srcset*="/${id}-"]`).first();
    await expect(img).toHaveAttribute('alt', /\S.{9,}/);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth)).toBeGreaterThan(0);
  }
});
