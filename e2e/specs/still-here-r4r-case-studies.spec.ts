// S4 (still-here-r4r) — case studies in every engine: three pages, Eileen Webb on each, the
// photographs loaded with alt text. garage/pack/ACCEPTANCE.md § S4 items 1–3.
import { expect, test } from '@playwright/test';

const SLUGS = ['municipal-infrastructure', 'public-seating', 'civic-rest-sector'];

test('/case-studies/ lists three', async ({ page }) => {
  await page.goto('/case-studies/');
  for (const s of SLUGS) await expect(page.getByRole('main').locator(`a[href="/case-studies/${s}"]`).first()).toBeVisible();
});

for (const s of SLUGS) {
  test(`/case-studies/${s}: Eileen Webb, the bench, photographs with alt text`, async ({ page }) => {
    const r = await page.goto(`/case-studies/${s}`);
    expect(r?.status()).toBe(200);
    const main = page.getByRole('main');
    await expect(main.getByText(/Eileen Webb/).first()).toBeVisible();
    const imgs = main.locator('img');
    expect(await imgs.count()).toBeGreaterThan(0);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('alt', /\S.{9,}/);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth)).toBeGreaterThan(0);
    }
  });
}
