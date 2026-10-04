#!/usr/bin/env node
// Screenshot the home and leadership candidates for Clive's C2 review, full page, in Chromium:
//   garage/pack/exemplars/candidates/home-390.png, home-1440.png, leadership-1440.png
// Builds the site, serves it with the local Pages server, waits for the faces and every image,
// and stops on any console error. Run by hand: `node scripts/page-candidates.mjs`.
// (Jules, 2026-10-04)
import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'garage/pack/exemplars/candidates');
const PORT = 5331;
const SHOTS = [
  ['/', 390, 844, 'home-390.png'],
  ['/', 1440, 900, 'home-1440.png'],
  ['/leadership', 1440, 900, 'leadership-1440.png'],
];

execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: ROOT, stdio: 'inherit' });
const server = spawn(process.execPath, ['scripts/serve-pages.mjs', 'site', String(PORT)], { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ok) => server.stdout.on('data', (b) => String(b).includes(String(PORT)) && ok()));
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [path, width, height, file] of SHOTS) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // lazy images: bring each into view once, then wait for all of them
    for (const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => undefined))));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(OUT, file), fullPage: true });
    if (errors.length) throw new Error(`${path} at ${width}: console errors: ${errors.join(' | ')}`);
    console.log(`page candidates: wrote ${file}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
