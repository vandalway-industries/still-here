#!/usr/bin/env node
// The STILL HERE mark, drawn as geometry: four corner brackets and the dot, measured from the
// horizontal logo (assets/still-here-logo-horizontal.png, 2172 × 724) in its own pixels, then
// moved to the origin. The colour comes from the verification-green token in src/js/tokens.js,
// written as rgb() so no hex literal leaves the token files.
//
// Writes src/brand/mark.svg and src/favicon.svg. Run by the build before it copies src/, and by
// hand with `node scripts/brand.mjs`. A file is rewritten only when its content changes.
// The raster icons (favicon.ico, apple-touch-icon, manifest icons) are rendered from the same
// drawing by scripts/icons.mjs. (Jules, 2026-10-04)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Measured on the logo: the green extends x 118–464 and y 174–518. Bracket arms are 51 units
// thick; horizontal arms run 124 units, vertical arms 125. The dot sits at (291, 346), r 64.7.
// Coordinates below are relative to (118, 174).
export const MARK = Object.freeze({
  width: 346,
  height: 344,
  brackets: [
    // top left, top right, bottom left, bottom right: each an L, drawn clockwise
    'M0 0H124V51H52V125H0Z',
    'M222 0H346V125H295V51H222Z',
    'M0 218H52V294H124V344H0Z',
    'M295 218H346V344H222V294H295Z',
  ],
  dot: { cx: 173, cy: 172, r: 64.7 },
});

export function rgb(hex) {
  const h = hex.replace('#', '');
  return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
}

/** The mark's drawing (no outer <svg>), in the mark's own units. */
export function markShapes(fill) {
  return [
    `<g fill="${fill}">`,
    ...MARK.brackets.map((d) => `  <path d="${d}"/>`),
    `  <circle cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}"/>`,
    `</g>`,
  ].join('\n');
}

export function markSvg(fill) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK.width} ${MARK.height}" width="${MARK.width}" height="${MARK.height}" role="img" aria-labelledby="t">`,
    `<title id="t">STILL HERE</title>`,
    markShapes(fill),
    `</svg>`,
    '',
  ].join('\n');
}

/** The favicon: the mark centred in a square with a little air around it. */
export function faviconSvg(fill) {
  const side = 400;
  const x = (side - MARK.width) / 2;
  const y = (side - MARK.height) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" width="${side}" height="${side}">`,
    `<g transform="translate(${x} ${y})">`,
    markShapes(fill),
    `</g>`,
    `</svg>`,
    '',
  ].join('\n');
}

async function tokens(root) {
  const p = join(root, 'src/js/tokens.js');
  return import(pathToFileURL(p).href);
}

function writeIfChanged(path, text) {
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return false;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  return true;
}

export async function generateBrand(root = ROOT) {
  const { colors } = await tokens(root);
  const green = rgb(colors['verification-green']);
  const wrote = [];
  if (writeIfChanged(join(root, 'src/brand/mark.svg'), markSvg(green))) wrote.push('src/brand/mark.svg');
  if (writeIfChanged(join(root, 'src/favicon.svg'), faviconSvg(green))) wrote.push('src/favicon.svg');
  return wrote;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const wrote = await generateBrand();
  console.log(wrote.length ? `brand: wrote ${wrote.join(', ')}` : 'brand: unchanged');
}
