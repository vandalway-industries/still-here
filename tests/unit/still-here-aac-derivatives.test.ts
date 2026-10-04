// DS3 (still-here-aac) — image derivatives.
// garage/pack/ACCEPTANCE.md § DS3, items 1–3. Run: node --test tests/unit/
// Derivatives are named `<id>-<width>.webp` (ASSET_MANIFEST.md § Rules), where <id> is the file's
// stem or a part of it that names no other file (`p01`, `b3-wide`, `hero`). The 1997 page's two
// images (the parent logo GIF and s09's JPEG) are DS6's and live under vandalwayind/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';
import { abs, bytes, files, imageMetadata, imageSize, read } from '../helpers/repo.ts';

type Row = { file: string; stem: string; derivatives: string };

function manifestRows(): Row[] {
  const rows: Row[] = [];
  let header: string[] | null = null;
  for (const line of read('garage/pack/ASSET_MANIFEST.md').split('\n')) {
    if (!line.startsWith('|')) {
      header = null;
      continue;
    }
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (!header) {
      header = cells;
      continue;
    }
    if (/^-+$/.test(cells[0].replace(/[:\s]/g, ''))) continue;
    const m = /`([^`]+\.png)`/.exec(cells[0]);
    if (!m) continue;
    const d = header.findIndex((h) => /^Derivatives?$/.test(h));
    rows.push({ file: m[1], stem: m[1].replace(/^.*\//, '').replace(/\.png$/, ''), derivatives: d >= 0 ? cells[d] : '' });
  }
  return rows;
}

const rows = manifestRows().filter((r) => !/vandalway-industries-logo|s09-sunday-market/.test(r.file));
const stems = rows.map((r) => r.stem);

function owner(id: string): string | undefined {
  if (stems.includes(id)) return id;
  const hits = stems.filter((s) => `-${s}-`.includes(`-${id}-`));
  return hits.length === 1 ? hits[0] : undefined;
}

function widthsOf(r: Row): number[] {
  if (/none/i.test(r.derivatives) || !r.derivatives) return [];
  const cell = r.derivatives.split(/Open Graph/i)[0];
  return [...cell.matchAll(/\b(\d{3,4})\b/g)].map((m) => Number(m[1]));
}

test('1. every placement has its 1x and 2x derivatives under src/images/, each ≤ 250 KB', () => {
  assert.equal(rows.length, 31, 'ASSET_MANIFEST.md rows read (32 files and the parent logo, less the 1997 page\'s two)');
  const derivs = files('src/images');
  assert.ok(derivs.length > 0, 'src/images/ holds no derivatives');
  const byStem = new Map<string, Map<number, string>>();
  for (const f of derivs) {
    const m = /\/([^/]+)-(\d+)\.webp$/.exec(f);
    if (!m) continue;
    const s = owner(m[1]);
    if (!s) continue;
    if (!byStem.has(s)) byStem.set(s, new Map());
    byStem.get(s)!.set(Number(m[2]), f);
  }
  for (const r of rows) {
    for (const w of widthsOf(r)) {
      const f = byStem.get(r.stem)?.get(w);
      assert.ok(f, `${r.file}: no ${w}-wide WebP derivative under src/images/`);
      const size = statSync(abs(f!)).size;
      assert.ok(size <= 250 * 1024, `${f} is ${Math.round(size / 1024)} KB (bar: 250 KB)`);
      assert.equal(imageSize(bytes(f!)).width, w, `${f} is ${w} pixels wide`);
    }
  }
  const og = derivs.filter((f) => /\.jpe?g$/i.test(f)).filter((f) => {
    const s = imageSize(bytes(f));
    return s.width === 1200 && s.height === 630;
  });
  assert.equal(og.length, 1, 'one Open Graph JPEG, 1200 × 630');
  assert.ok(statSync(abs(og[0])).size <= 250 * 1024, `${og[0]} ≤ 250 KB`);
});

test('2. no derivative carries caBX, iTXt, tEXt, zTXt, eXIf, APP1 or APP13 (D21)', () => {
  const imgs = files('src/images', /\.(png|jpe?g|webp|gif)$/i);
  assert.ok(imgs.length > 0, 'src/images/ holds no derivatives');
  const carrying = imgs.map((f) => [f, imageMetadata(bytes(f))] as const).filter(([, m]) => m.length);
  assert.deepEqual(carrying, [], 'web copies carry metadata');
});

test('3. assets/ originals are byte-identical to garage/assets/', () => {
  const hash = (rel: string) => createHash('sha256').update(bytes(rel)).digest('hex');
  const originals = files('garage/assets');
  assert.ok(originals.length >= 32);
  for (const g of originals) assert.equal(hash(g.replace(/^garage\//, '')), hash(g), `${g} differs from its copy in assets/`);
});
