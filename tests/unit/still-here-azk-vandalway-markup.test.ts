// DS6 (still-here-azk) — the 1997 page candidate.
// garage/pack/ACCEPTANCE.md § DS6, items 1–7. The element-by-element checks are shared with V1
// (tests/helpers/vandalway.ts). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { abs, bytes, files, isDir, mustExist, pngInfo, read, withBrowser } from '../helpers/repo.ts';
import { checkMarkup, DOCTYPE } from '../helpers/vandalway.ts';

test('1. the HTML 3.2 doctype on the first line; quirks mode', async () => {
  mustExist('vandalwayind/index.html');
  assert.equal(read('vandalwayind/index.html').split(/\r?\n/)[0], DOCTYPE);
  const mode = await withBrowser(async (b) => {
    const p = await b.newPage();
    await p.goto(pathToFileURL(abs('vandalwayind/index.html')).href);
    return p.evaluate(() => document.compatMode);
  });
  assert.equal(mode, 'BackCompat');
});

test('2–5. every element of PRD R42; GIFs, s09 a captionless JPEG; 555-01xx and a time zone; the guestbook', async () => {
  await checkMarkup();
});

test('6. exemplars/1997/: research 6\'s archived pages with SOURCES.md, or the refusals recorded', () => {
  assert.ok(isDir('garage/pack/exemplars/1997'), 'garage/pack/exemplars/1997/ exists');
  const sources = read('garage/pack/exemplars/1997/SOURCES.md');
  const pages = files('garage/pack/exemplars/1997', /\.html?$/i);
  if (pages.length === 0) {
    assert.match(sources, /refus/i, 'no pages, so SOURCES.md records which fetches were refused');
    return;
  }
  for (const p of pages) {
    const name = p.split('/').pop()!;
    const line = sources.split('\n').find((l) => l.includes(name));
    assert.ok(line, `SOURCES.md lists ${name}`);
    assert.match(line!, /https?:\/\//, `${name}: its URL`);
    assert.ok((line!.match(/\b(19|20)\d\d-?\d\d-?\d\d/g) ?? []).length >= 2, `${name}: capture date and fetch date`);
  }
});

test('7. candidates/vandalway-1997.png: 1024 wide, full page', () => {
  const rel = 'garage/pack/exemplars/candidates/vandalway-1997.png';
  mustExist(rel);
  const p = pngInfo(bytes(rel));
  assert.equal(p.width, 1024);
  assert.ok(p.height > 768, 'the full page');
});
