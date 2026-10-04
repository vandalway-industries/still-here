#!/usr/bin/env node
// Render the raster icons from the mark (scripts/brand.mjs) with Chromium, and commit them under
// src/ so the build copies them to the site:
//   src/favicon.ico              16 and 32, the mark on transparent
//   src/apple-touch-icon.png     180, the mark on paper
//   src/icons/icon-192.png       192, the mark on paper
//   src/icons/icon-512.png       512, the mark on paper
//   src/icons/maskable-512.png   512, the mark on paper, inside the central 80% safe zone
// Run by hand after the mark or the tokens change: `node scripts/icons.mjs`. The PNGs carry no
// text chunks (Chromium's screenshots write none). (Jules, 2026-10-04)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MARK, markShapes, rgb } from './brand.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** An SVG of `size` px square with the mark `markWidth` px wide, centred, on `background` or none. */
function iconSvg(size, markWidth, fill, background) {
  const s = markWidth / MARK.width;
  const x = (size - MARK.width * s) / 2;
  const y = (size - MARK.height * s) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : '',
    `<g transform="translate(${x} ${y}) scale(${s})">`,
    markShapes(fill),
    `</g></svg>`,
  ].join('');
}

/** An ICO file holding PNG images (Vista and later; every current browser reads it). */
function ico(pngs) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, png }, i) => {
    const e = i * 16;
    dir[e] = size >= 256 ? 0 : size;
    dir[e + 1] = size >= 256 ? 0 : size;
    dir[e + 2] = 0;
    dir[e + 3] = 0;
    dir.writeUInt16LE(1, e + 4);
    dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(png.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, dir, ...pngs.map((p) => p.png)]);
}

export async function renderIcons(root = ROOT) {
  const { colors } = await import(pathToFileURL(join(root, 'src/js/tokens.js')).href);
  const green = rgb(colors['verification-green']);
  const paper = rgb(colors.paper);
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shot = async (size, svg, transparent) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
    return page.screenshot({ clip: { x: 0, y: 0, width: size, height: size }, omitBackground: transparent });
  };
  const out = {
    'src/apple-touch-icon.png': await shot(180, iconSvg(180, 112, green, paper), false),
    'src/icons/icon-192.png': await shot(192, iconSvg(192, 120, green, paper), false),
    'src/icons/icon-512.png': await shot(512, iconSvg(512, 320, green, paper), false),
    // the safe zone is a circle of radius 40% (204.8 px); the mark's half-diagonal at 256 px wide
    // is about 181 px, which leaves room for the anti-aliased edge
    'src/icons/maskable-512.png': await shot(512, iconSvg(512, 256, green, paper), false),
  };
  const ico16 = await shot(16, iconSvg(16, 15, green), true);
  const ico32 = await shot(32, iconSvg(32, 30, green), true);
  out['src/favicon.ico'] = ico([{ size: 16, png: ico16 }, { size: 32, png: ico32 }]);
  await browser.close();
  for (const [rel, buf] of Object.entries(out)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), buf);
  }
  return Object.keys(out);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const wrote = await renderIcons();
  console.log(`icons: wrote ${wrote.join(', ')}`);
}
