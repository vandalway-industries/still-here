// S3 (still-here-3yo) — research in every engine: three papers, covers drawn, the Enterprise line,
// each paper's sections. garage/pack/ACCEPTANCE.md § S3 items 2–3.
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { RESEARCH_ENTERPRISE } from '../helpers/strings.ts';

const PAPERS = ['competitive-landscape', 'directionality-of-here', 'six-feet-to-the-left'];

test('/research/: three papers, each with a cover drawn in code', async ({ page }) => {
  await page.goto('/research/');
  const main = page.getByRole('main');
  for (const slug of PAPERS) await expect(main.locator(`a[href="/research/${slug}"]`).first()).toBeVisible();
  expect(await main.locator('svg').count()).toBeGreaterThanOrEqual(3);
  await expect(main.getByText('Dr. Petra Voss')).toHaveCount(3);
});

for (const slug of PAPERS) {
  test(`/research/${slug}: every section of the source`, async ({ page }) => {
    const md = readFileSync(new URL(`../../company/research/${slug}.md`, import.meta.url), 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
    const r = await page.goto(`/research/${slug}`);
    expect(r?.status()).toBe(200);
    for (const m of md.matchAll(/^#{2,4}\s+(.+?)\s*$/gm)) {
      await expect(page.getByRole('heading', { name: m[1].replace(/[*_`]/g, '').trim(), exact: true })).toBeAttached();
    }
    if (slug === 'competitive-landscape') await expect(page.getByText(RESEARCH_ENTERPRISE, { exact: true })).toBeVisible();
  });
}
