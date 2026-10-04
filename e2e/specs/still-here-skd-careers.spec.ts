// S6 (still-here-skd) — careers in every engine: three postings, nothing to fill in, photographs
// loaded. garage/pack/ACCEPTANCE.md § S6 items 1–3.
import { expect, test } from '@playwright/test';
import { CAREERS_TITLES } from '../helpers/strings.ts';

test('three postings; no form; no mail link; photographs with alt text', async ({ page }) => {
  await page.goto('/careers');
  for (const t of CAREERS_TITLES) await expect(page.getByRole('heading', { name: t, exact: true })).toBeVisible();
  await expect(page.locator('form, input, textarea, select')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:" i]')).toHaveCount(0);
  const imgs = page.getByRole('main').locator('img');
  expect(await imgs.count()).toBeGreaterThanOrEqual(5);
  for (const img of await imgs.all()) {
    await expect(img).toHaveAttribute('alt', /\S.{9,}/);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth)).toBeGreaterThan(0);
  }
});
