// S2 (still-here-tul) — leadership in every engine: twelve cards in order, portraits loaded, alt
// text, Jules's line. garage/pack/ACCEPTANCE.md § S2 items 1–3.
import { expect, test } from '@playwright/test';
import { JULES_PHRASE, LEADERSHIP } from '../helpers/strings.ts';

test('twelve people, in order, each photographed and described', async ({ page }) => {
  await page.goto('/leadership');
  const main = page.getByRole('main');
  const imgs = main.locator('img');
  await expect(imgs).toHaveCount(12);
  for (const [i, [id, p]] of LEADERSHIP.entries()) {
    const card = main.locator(`[id="${id}"], [id$="-${id}"]`).first();
    await expect(card).toBeVisible();
    const img = card.locator('img').first();
    await expect(img).toHaveAttribute('alt', /\S{3,}.{16,}/);
    expect(await img.evaluate((e: HTMLImageElement) => e.currentSrc || e.src)).toMatch(new RegExp(p));
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth)).toBeGreaterThan(0);
    if (i) {
      const prev = main.locator(`[id="${LEADERSHIP[i - 1][0]}"], [id$="-${LEADERSHIP[i - 1][0]}"]`).first();
      const order = await prev.evaluate((a, b) => !!(a.compareDocumentPosition(b as Node) & Node.DOCUMENT_POSITION_FOLLOWING), await card.elementHandle());
      expect(order, `${id} follows ${LEADERSHIP[i - 1][0]}`).toBe(true);
    }
  }
  await expect(main.locator('[id="jules"], [id$="-jules"]').getByText(new RegExp(JULES_PHRASE))).toBeVisible();
});
