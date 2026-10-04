// S5 (still-here-z4r) — status in every engine: the constant at the top, three incidents, and no
// request but same-origin static files. garage/pack/ACCEPTANCE.md § S5 items 2–4.
import { expect, test } from '@playwright/test';
import { STATUS_CONSTANT, STATUS_TITLES } from '../helpers/strings.ts';

test('the constant, the three titles in order, and only same-origin requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/status');
  await page.waitForLoadState('networkidle');
  const top = page.getByText(STATUS_CONSTANT, { exact: true }).first();
  await expect(top).toBeVisible();
  let y = (await top.boundingBox())!.y;
  // at the top: no text of the page's main content sits above it but the page heading
  const above = await page.getByRole('main').evaluate((main, y0) => {
    const h1 = main.querySelector('h1');
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const out: string[] = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent!.trim();
      const el = n.parentElement!;
      if (!t || (h1 && h1.contains(el))) continue;
      if (el.getBoundingClientRect().bottom <= y0) out.push(t);
    }
    return out;
  }, y);
  expect(above, 'nothing above the status constant but the heading').toEqual([]);
  for (const [i, t] of STATUS_TITLES.entries()) {
    const el = page.getByText(t, { exact: true }).first();
    await expect(el).toBeVisible();
    const b = (await el.boundingBox())!;
    expect(b.y).toBeGreaterThan(y);
    y = b.y;
    await expect(page.getByText(new RegExp(`STATUS-00${i + 1}`)).first()).toBeVisible();
  }
  const origin = new URL(page.url()).origin;
  expect(requests.filter((u) => !u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:'))).toEqual([]);
  // static files only: nothing measured live, no API call, no query
  expect(requests.filter((u) => /^\/api\//.test(new URL(u).pathname) || new URL(u).search !== '')).toEqual([]);
});
