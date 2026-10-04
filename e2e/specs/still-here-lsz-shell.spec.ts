// E0 (still-here-lsz) — the shell on every page, in a browser.
// garage/pack/ACCEPTANCE.md § E0 items 1, 2 and 6 as a visitor's browser shows them; the menu
// opens and closes at 390 by its button and by Escape, focus returning to the button.
import { expect, test } from '@playwright/test';
import { FOOTER_LINKS, MENU, NOT_FOUND, PAGES, RETURN_HOME } from '../helpers/strings.ts';

const menuButton = (page: import('@playwright/test').Page) => page.getByRole('banner').getByRole('button', { name: /menu/i });
const menuNav = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation').filter({ has: page.getByRole('link', { name: 'Verify', exact: true }) });

for (const p of PAGES) {
  test(`1–2. ${p.path}: heading, header home link, the menu's eight, the footer's three`, async ({ page }) => {
    const r = await page.goto(p.path);
    expect(r?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const home = page.getByRole('banner').getByRole('link', { name: /STILL HERE/ }).first();
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute('href', '/');
    const narrow = page.viewportSize()!.width < 600;
    if (narrow) {
      await expect(menuButton(page)).toBeVisible();
      await menuButton(page).click();
    }
    const links = menuNav(page).getByRole('link');
    await expect(links).toHaveText(MENU.map(([n]) => n));
    for (const [n, href] of MENU) await expect(menuNav(page).getByRole('link', { name: n, exact: true })).toHaveAttribute('href', href);
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link')).toHaveText(FOOTER_LINKS.map(([n]) => n));
    for (const [n, href] of FOOTER_LINKS) await expect(footer.getByRole('link', { name: n, exact: true })).toHaveAttribute('href', href);
  });
}

test('2. at 390 the menu opens and closes by its button and by Escape; focus returns to the button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = menuButton(page);
  await expect(button).toBeVisible();
  await expect(menuNav(page)).toBeHidden();
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(menuNav(page)).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menuNav(page)).toBeHidden();
  await button.click();
  await expect(menuNav(page)).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(menuNav(page)).toBeHidden();
  await expect(button).toBeFocused();
});

test('6. the 404 page: the sentence and Return home', async ({ page }) => {
  const r = await page.goto('/no-such-page');
  expect(r?.status()).toBe(404);
  await expect(page.getByText(NOT_FOUND, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: RETURN_HOME, exact: true })).toHaveAttribute('href', '/');
});
