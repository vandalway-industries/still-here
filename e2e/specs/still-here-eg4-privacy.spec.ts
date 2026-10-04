// S9 (still-here-eg4) — Privacy in every engine: the eight sentences and the two documentation
// links. garage/pack/ACCEPTANCE.md § S9.
import { expect, test } from '@playwright/test';
import { GITHUB_PAGES_LOGGING_DOC, PRIVACY, WEBKIT_TRACKING_PREVENTION_DOC } from '../helpers/strings.ts';

test('the eight sentences and the two links', async ({ page }) => {
  await page.goto('/legal/privacy');
  for (const s of PRIVACY) await expect(page.getByText(s).first()).toBeAttached();
  await expect(page.locator(`a[href="${GITHUB_PAGES_LOGGING_DOC}"]`).first()).toBeVisible();
  await expect(page.locator(`a[href="${WEBKIT_TRACKING_PREVENTION_DOC}"]`).first()).toBeVisible();
});
