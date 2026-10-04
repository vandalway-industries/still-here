// S8 (still-here-hng) — Terms of Presence in every engine. garage/pack/ACCEPTANCE.md § S8.
import { expect, test } from '@playwright/test';
import { TERMS } from '../helpers/strings.ts';

test('the title and the four sentences', async ({ page }) => {
  await page.goto('/legal/terms');
  await expect(page).toHaveTitle(/^Terms of Presence\b/);
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of Presence', exact: true })).toBeVisible();
  for (const s of TERMS) await expect(page.getByText(s).first()).toBeAttached();
});
