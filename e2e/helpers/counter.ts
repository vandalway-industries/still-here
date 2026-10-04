// Reading the 1997 page's hit counter the way a person does: by looking at its digits.
// The counter is an image (counter.gif) of odometer digits written by deploy/counter/count.mjs
// (V3). To read a number from it without guessing at fonts, this helper asks count.mjs itself to
// draw reference counters for chosen totals, then matches the live image against them digit by
// digit. Used by V3's counter spec and by W7 step 2 (V4, N2). Locked at specs-v1.
//
// The contract with count.mjs (V3 item 2):
//   node deploy/counter/count.mjs --log <access log> --total <running-total file> --gif <counter.gif>
// It adds every countable request in the log newer than the timestamp in the total file, writes the
// total file (a number and a timestamp, nothing else, V3 item 5) and draws counter.gif.
// (Diane, 2026-10-04)
import { expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './site.ts';

export const COUNT_SCRIPT = join(ROOT, 'deploy/counter/count.mjs');

/** One Caddy JSON access-log line (Caddy's default `format json`). */
export function accessLine(o: { method?: string; uri?: string; status?: number; ts: number }): string {
  return JSON.stringify({
    level: 'info',
    ts: o.ts,
    logger: 'http.log.access.log0',
    msg: 'handled request',
    request: { remote_ip: '127.0.0.1', proto: 'HTTP/1.1', method: o.method ?? 'GET', host: 'vandalwayind.example', uri: o.uri ?? '/', headers: {} },
    bytes_read: 0,
    user_id: '',
    duration: 0.001,
    size: 512,
    status: o.status ?? 200,
    resp_headers: {},
  });
}

export function runCount(dir: string): void {
  execFileSync(process.execPath, [COUNT_SCRIPT, '--log', join(dir, 'access.log'), '--total', join(dir, 'total'), '--gif', join(dir, 'counter.gif')], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/** A scratch counter: a log, a total file and a GIF, in a temporary folder. */
export function scratchCounter(): { dir: string; hit: (n?: number, extra?: Partial<{ method: string; uri: string; status: number }>) => void; run: () => void; total: () => number; gif: () => Buffer } {
  expect(existsSync(COUNT_SCRIPT), 'deploy/counter/count.mjs exists').toBe(true);
  const dir = mkdtempSync(join(tmpdir(), 'still-here-counter-'));
  writeFileSync(join(dir, 'access.log'), '');
  let clock = Date.now() / 1000 + 1;
  return {
    dir,
    hit(n = 1, extra = {}) {
      for (let i = 0; i < n; i++) appendFileSync(join(dir, 'access.log'), `${accessLine({ ...extra, ts: (clock += 0.01) })}\n`);
    },
    run: () => runCount(dir),
    total: () => totalOf(readFileSync(join(dir, 'total'), 'utf8')),
    gif: () => readFileSync(join(dir, 'counter.gif')),
  };
}

/** The running total in a total file: its one integer that is not part of the timestamp. */
export function totalOf(text: string): number {
  const t = text.trim();
  let candidates: string[] = [];
  try {
    const j = JSON.parse(t);
    if (typeof j === 'number') return j;
    candidates = Object.values(j as Record<string, unknown>)
      .filter((v) => typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v)))
      .map(String);
  } catch {
    candidates = t.split(/\s+/).filter((x) => /^\d+$/.test(x));
  }
  // a Unix timestamp is also an integer: the total is the smaller one
  const nums = candidates.map(Number).sort((a, b) => a - b);
  expect(nums.length, `a total in: ${t}`).toBeGreaterThan(0);
  return nums[0];
}

/** Draw reference counters for chosen totals by seeding the total file. */
function referenceMaker(): (total: number) => Buffer {
  const c = scratchCounter();
  c.hit(3);
  c.run();
  const seed = readFileSync(join(c.dir, 'total'), 'utf8');
  expect(c.total(), 'count.mjs counts three GETs of /').toBe(3);
  const cache = new Map<number, Buffer>();
  return (total: number) => {
    if (cache.has(total)) return cache.get(total)!;
    // replace the integer 3 with the wanted total, keeping the file's own format and timestamp
    const next = seed.replace(/(^|[^\d])3(?!\d)/, `$1${total}`);
    writeFileSync(join(c.dir, 'total'), next);
    c.run();
    const gif = c.gif();
    cache.set(total, gif);
    return gif;
  };
}

type Pixels = { w: number; h: number; data: number[] };

async function pixels(page: Page, gifs: Buffer[]): Promise<Pixels[]> {
  const urls = gifs.map((g) => `data:image/gif;base64,${g.toString('base64')}`);
  const p = await page.context().newPage();
  try {
    await p.setContent('<!doctype html><title>counter</title>');
    return await p.evaluate(async (urls) => {
      const out: { w: number; h: number; data: number[] }[] = [];
      for (const u of urls) {
        const img = new Image();
        img.src = u;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const grey: number[] = [];
        for (let i = 0; i < d.length; i += 4) grey.push(Math.round((d[i] + d[i + 1] + d[i + 2]) / 3));
        out.push({ w: c.width, h: c.height, data: grey });
      }
      return out;
    }, urls);
  } finally {
    await p.close();
  }
}

function bandDiff(a: Pixels, b: Pixels, cols: number[]): number {
  let d = 0;
  for (let y = 0; y < a.h; y++) for (const x of cols) d += Math.abs(a.data[y * a.w + x] - b.data[y * b.w + x]);
  return d;
}

/** Read the number shown by a counter GIF. */
let maker: ((total: number) => Buffer) | undefined;
export async function readCounterGif(page: Page, live: Buffer): Promise<number> {
  // the references never change within a run: draw them once
  const ref = (maker ??= referenceMaker());
  const [L] = await pixels(page, [live]);
  // how many digits: the reference whose width matches (a padded counter matches every width)
  const widths = await pixels(page, [1, 10, 100, 1000, 10000, 100000, 1000000].map(ref));
  // m = the number of digit positions: the most digits a counter of the live image's size shows
  let m = 0;
  widths.forEach((p, i) => {
    if (p.w === L.w && p.h === L.h) m = i + 1;
  });
  expect(m, 'the live counter has the size of a counter count.mjs draws').toBeGreaterThan(0);
  const unpadded = widths[0].w !== L.w;
  let total = 0;
  for (let k = 0; k < m; k++) {
    // a reference of k+1 digits has the live width only if the counter is padded that far; if not,
    // a leading 1 keeps the width, and the leading position itself is never 0
    const lead = widths[k].w === L.w ? 0 : 10 ** (m - 1);
    const digits = [...Array(10).keys()].filter((d) => !(unpadded && k === m - 1 && m > 1 && d === 0));
    const refs = await pixels(page, digits.map((d) => ref(lead + d * 10 ** k)));
    const cols: number[] = [];
    for (let x = 0; x < L.w; x++) {
      for (let y = 0; y < L.h; y++) {
        const v0 = refs[0].data[y * L.w + x];
        if (refs.some((r) => r.w === L.w && r.data[y * L.w + x] !== v0)) {
          cols.push(x);
          break;
        }
      }
    }
    expect(cols.length, `position ${k} of the counter`).toBeGreaterThan(0);
    let best = -1;
    let bestDiff = Infinity;
    refs.forEach((r, i) => {
      if (r.w !== L.w) return;
      const d = bandDiff(L, r, cols);
      if (d < bestDiff) {
        bestDiff = d;
        best = digits[i];
      }
    });
    total += best * 10 ** k;
  }
  // the leading digit of an unpadded counter was read against references that carried it
  return total;
}
