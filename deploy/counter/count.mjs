#!/usr/bin/env node
// count.mjs — the hit counter of vandalwayind.com.
//
//   node deploy/counter/count.mjs --log <access log> --total <running-total file> --gif <counter.gif>
//
// Reads the site's own Caddy access log (JSON, one request per line) and adds to the running total
// every GET of "/" or "/index.html" answered 200 or 304 that is newer than the last request counted.
// HEAD requests, the counter image and every other path or status are not counted. The total file
// holds two things and nothing else: the total and the Unix time of the last request counted. With
// no total file yet, the whole log counts. Then it draws counter.gif: the total as odometer digits,
// six at least, green on black, one 13 x 19 cell per digit inside a 1-pixel frame (80 x 21 for six).
// Both files are written to a temporary name and renamed, so the web server never serves half a
// file; counter.gif is rewritten on every run, so its Last-Modified is the time of the last run.
//
// Runs on the server's own Node (v18 or later) with nothing installed: no packages, no build.
// The ten-minute timer is deploy/counter/vandalwayind-counter.timer. (Jules, 2026-10-05)

import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const COUNTED_PATHS = new Set(['/', '/index.html']);
const COUNTED_STATUS = new Set([200, 304]);
const MIN_DIGITS = 6;

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i];
    if (!['--log', '--total', '--gif'].includes(k) || argv[i + 1] === undefined) usage();
    out[k.slice(2)] = argv[i + 1];
  }
  if (!out.log || !out.total || !out.gif) usage();
  return out;
}

function usage() {
  process.stderr.write('usage: count.mjs --log <access log> --total <running-total file> --gif <counter.gif>\n');
  process.exit(2);
}

/** The running total and the time of the last request counted; null before the first run. */
function readTotal(file) {
  if (!existsSync(file)) return null;
  const [n, ts, ...rest] = readFileSync(file, 'utf8').trim().split(/\s+/);
  if (rest.length || !/^\d+$/.test(n ?? '') || !/^\d+(\.\d+)?$/.test(ts ?? '')) {
    throw new Error(`${file}: expected "<total> <unix time>", found something else`);
  }
  return { total: Number(n), since: Number(ts) };
}

/** Count the log's requests newer than `since`; returns how many and the newest time counted. */
function countLog(file, since) {
  if (!existsSync(file)) return { added: 0, newest: null };
  let added = 0;
  let newest = null;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    // An emptied log regains a NUL-filled prefix at Caddy's next write (it keeps its old offset),
    // so a line may begin with NUL bytes before its JSON; they are skipped.
    const line = raw.replace(/^\0+/, '');
    if (!line.trim()) continue;
    let e;
    try {
      e = JSON.parse(line);
    } catch {
      continue; // a line being written as we read; the next run sees it whole
    }
    const ts = Number(e.ts);
    if (!Number.isFinite(ts) || ts <= since) continue;
    const req = e.request ?? {};
    const path = String(req.uri ?? '').split('?')[0];
    if (req.method === 'GET' && COUNTED_PATHS.has(path) && COUNTED_STATUS.has(Number(e.status))) {
      added++;
      if (newest === null || ts > newest) newest = ts;
    }
  }
  return { added, newest };
}

function writeAtomic(file, bytes) {
  const tmp = join(dirname(file), `.${basename(file)}.tmp`);
  writeFileSync(tmp, bytes);
  renameSync(tmp, file);
}

// ── The digits ────────────────────────────────────────────────────────────────────────────────
// Drawn once in Courier Bold, green on black, and kept here as pixels so the server needs nothing
// but Node to draw them. '.' black, '-' the grey rule at the top and bottom of each wheel, and
// 'a'–'d' four greens from dim to bright.
const PALETTE = [
  [0x00, 0x00, 0x00], // .
  [0x33, 0x33, 0x33], // -
  [0x00, 0x66, 0x00], // a
  [0x00, 0x99, 0x00], // b
  [0x33, 0xcc, 0x33], // c
  [0x33, 0xff, 0x33], // d
  [0x00, 0x00, 0x00],
  [0x00, 0x00, 0x00],
];
const INK = { '.': 0, '-': 1, a: 2, b: 3, c: 4, d: 5 };
const CELL_W = 13;
const CELL_H = 19;
const DIGITS = [
  // 0
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '....bccb.....',
    '...bdccdc....',
    '...db..bda...',
    '..ada...db...',
    '..bd....dc...',
    '..bd....dc...',
    '..bd....dc...',
    '..ada...db...',
    '..adb..bda...',
    '...bdccdc....',
    '....bccb.....',
    '.............',
    '.............',
    '-------------',
  ],
  // 1
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '.....ab......',
    '..acddd......',
    '..acbcd......',
    '.....cd......',
    '.....bd......',
    '.....cd......',
    '.....cd......',
    '.....cd......',
    '.....cd......',
    '..abbcdbba...',
    '..acdddddb...',
    '.............',
    '.............',
    '-------------',
  ],
  // 2
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '...abccb.....',
    '..addccdc....',
    '..bda..bda...',
    '..ab...adb...',
    '.......cda...',
    '......cdb....',
    '.....cdb.....',
    '...acdb......',
    '..addb..ba...',
    '..dddbbbdb...',
    '..dddddddb...',
    '.............',
    '.............',
    '-------------',
  ],
  // 3
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '...abccba....',
    '..addccdda...',
    '...b...adb...',
    '.......bda...',
    '.....bcdb....',
    '.....cddb....',
    '.......bdb...',
    '........cd...',
    '.......adc...',
    '..cdcbcdda...',
    '..abcdcba....',
    '.............',
    '.............',
    '-------------',
  ],
  // 4
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '......cdb....',
    '.....bddb....',
    '....adddb....',
    '....cdadb....',
    '...adb.db....',
    '...dc..db....',
    '..bdcbcdca...',
    '..bdddddda...',
    '.......db....',
    '.....abdca...',
    '.....bddda...',
    '.............',
    '.............',
    '-------------',
  ],
  // 5
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '...dddddc....',
    '...dcbbbb....',
    '...dc........',
    '...dcbbb.....',
    '...dddddc....',
    '...bb..adb...',
    '........cc...',
    '........cd...',
    '..aa...adc...',
    '..cdcbcdda...',
    '...bcdcba....',
    '.............',
    '.............',
    '-------------',
  ],
  // 6
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '......bccb...',
    '....acddcc...',
    '...adda......',
    '...cda.......',
    '...dcbcca....',
    '..adddcdda...',
    '..adda..dd...',
    '...dc...bd...',
    '...cda..dd...',
    '...addcddb...',
    '....abdcb....',
    '.............',
    '.............',
    '-------------',
  ],
  // 7
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '..cddddddb...',
    '..cdcbbcdb...',
    '..aa...ada...',
    '.......cd....',
    '.......dc....',
    '......ada....',
    '......cd.....',
    '......dc.....',
    '.....adb.....',
    '.....bd......',
    '.....bb......',
    '.............',
    '.............',
    '-------------',
  ],
  // 8
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '....bccb.....',
    '...cdccdd....',
    '..adb..adb...',
    '..adb..adb...',
    '...bdccdb....',
    '...bddddb....',
    '..adba.bda...',
    '..bda...db...',
    '..bdb..adb...',
    '...dddcdda...',
    '....bcdba....',
    '.............',
    '.............',
    '-------------',
  ],
  // 9
  [
    '-------------',
    '.............',
    '.............',
    '.............',
    '.............',
    '....bddba....',
    '...bddddda...',
    '...dd..adb...',
    '...db...dd...',
    '...dd..add...',
    '...bdddddd...',
    '....addbdd...',
    '.......adb...',
    '......add....',
    '...ddddda....',
    '...bddb......',
    '.............',
    '.............',
    '-------------',
  ],
];

/** The counter as palette indexes: a black frame, then one cell per digit. */
function draw(total) {
  const text = String(total).padStart(MIN_DIGITS, '0');
  const w = text.length * CELL_W + 2;
  const h = CELL_H + 2;
  const px = new Uint8Array(w * h); // all black: the frame
  [...text].forEach((ch, i) => {
    const glyph = DIGITS[Number(ch)];
    for (let y = 0; y < CELL_H; y++) {
      for (let x = 0; x < CELL_W; x++) px[(y + 1) * w + 1 + i * CELL_W + x] = INK[glyph[y][x]];
    }
  });
  return { w, h, px };
}

/** GIF LZW, variable code width, a clear code whenever the table fills. */
function lzw(minCodeSize, px) {
  const out = [];
  let acc = 0;
  let bits = 0;
  const clear = 1 << minCodeSize;
  const eoi = clear + 1;
  let width = minCodeSize + 1;
  let next = eoi + 1;
  let table = new Map();
  const emit = (code) => {
    acc |= code << bits;
    bits += width;
    while (bits >= 8) {
      out.push(acc & 0xff);
      acc >>>= 8;
      bits -= 8;
    }
  };
  emit(clear);
  let prefix = px[0];
  for (let i = 1; i < px.length; i++) {
    const k = px[i];
    const key = prefix * 256 + k;
    const hit = table.get(key);
    if (hit !== undefined) {
      prefix = hit;
      continue;
    }
    emit(prefix);
    if (next === 4096) {
      emit(clear);
      table = new Map();
      width = minCodeSize + 1;
      next = eoi + 1;
    } else {
      if (next >= 1 << width) width++;
      table.set(key, next++);
    }
    prefix = k;
  }
  emit(prefix);
  emit(eoi);
  if (bits > 0) out.push(acc & 0xff);
  return out;
}

function gif({ w, h, px }) {
  const b = [];
  const u16 = (n) => b.push(n & 0xff, (n >> 8) & 0xff);
  b.push(...Buffer.from('GIF89a', 'latin1'));
  u16(w);
  u16(h);
  b.push(0xf2, 0, 0); // global colour table of 8, 8 bits per primary; background 0; square pixels
  for (const c of PALETTE) b.push(...c);
  b.push(0x2c);
  u16(0);
  u16(0);
  u16(w);
  u16(h);
  b.push(0); // no local table, not interlaced
  const data = lzw(3, px);
  b.push(3);
  for (let i = 0; i < data.length; i += 255) {
    const chunk = data.slice(i, i + 255);
    b.push(chunk.length, ...chunk);
  }
  b.push(0, 0x3b);
  return Buffer.from(b);
}

// ── The run ───────────────────────────────────────────────────────────────────────────────────
const opt = args(process.argv.slice(2));
const prev = readTotal(opt.total);
const { added, newest } = countLog(opt.log, prev ? prev.since : -Infinity);
const total = (prev ? prev.total : 0) + added;
const since = newest ?? prev?.since ?? Date.now() / 1000;
writeAtomic(opt.total, `${total} ${since}\n`);
writeAtomic(opt.gif, gif(draw(total)));
