#!/usr/bin/env node
// checkpoint-screens.mjs — photographs every page of a running copy of the site for a checkpoint
// packet: each listed page and the 404, at 390 (the phone, the first screen) and 1440 (the whole page).
//
//   STAGING_URL=<address> node scripts/checkpoint-screens.mjs docs/checkpoints/c4/screens
//
// Optional: VANDALWAY_INTERNAL_URL adds the 1997 page. Files are named after the page's path
// ("home" for /, slashes as hyphens) and the width, e.g. research-competitive-landscape-1440.png.
// Uses the Chromium that e2e/ already installs. Prints one line per file, never the address.
// (Jules, 2026-10-06)
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'e2e', 'package.json'));
const { chromium } = require('@playwright/test');
const { PAGES } = await import(join(ROOT, 'e2e', 'helpers', 'strings.ts'));

const BASE = process.env.STAGING_URL?.replace(/\/$/, '');
if (!BASE) throw new Error('STAGING_URL is not set (it lives in the uncommitted .env.staging)');
const OUT = resolve(process.argv[2] ?? join(ROOT, 'docs/checkpoints/c4/screens'));
mkdirSync(OUT, { recursive: true });

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const targets = [
  ...PAGES.map((p) => [slug(p.path), BASE + p.path]),
  ['404', `${BASE}/no-such-page-for-the-packet`],
  ...(process.env.VANDALWAY_INTERNAL_URL ? [['vandalwayind-1997', process.env.VANDALWAY_INTERNAL_URL.replace(/\/$/, '') + '/']] : []),
];

const browser = await chromium.launch();
try {
  for (const [width, height, full] of [[390, 844, false], [1440, 900, true]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce', ignoreHTTPSErrors: true });
    const page = await context.newPage();
    for (const [name, url] of targets) {
      await page.goto(url, { waitUntil: 'networkidle' });
      // scroll to the end and back, so lazy images have loaded before the photograph
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        scrollTo(0, 0);
        await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
        await document.fonts.ready;
      });
      const file = join(OUT, `${name}-${width}.png`);
      await page.screenshot({ path: file, fullPage: full });
      console.log(`${name}-${width}.png`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
