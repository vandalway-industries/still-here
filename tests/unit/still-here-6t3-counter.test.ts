// V3 (still-here-6t3) — the counter. garage/pack/ACCEPTANCE.md § V3, items 1, 2, 3 and 5; item 4
// (n+3 within eleven minutes on the served page) is e2e/specs/still-here-6t3-counter.spec.ts.
// The contract with count.mjs (also e2e/helpers/counter.ts):
//   node deploy/counter/count.mjs --log <access log> --total <running-total file> --gif <counter.gif>
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { abs, DEPLOY_LOG, files, gifInfo, mustExist, python, readMust, sh } from '../helpers/repo.ts';

const line = (method: string, uri: string, status: number, ts: number) =>
  JSON.stringify({ level: 'info', ts, logger: 'http.log.access.log0', msg: 'handled request', request: { remote_ip: '127.0.0.1', proto: 'HTTP/1.1', method, host: 'vandalwayind.example', uri, headers: {} }, bytes_read: 0, duration: 0.001, size: 512, status, resp_headers: {} });

test('1. the access log is JSON in its own file, rolled with seven days kept', () => {
  const c = readMust('deploy/caddy/vandalwayind.caddy');
  const log = /\blog\s*\{([\s\S]*?)\n\s*\}/.exec(c);
  assert.ok(log, 'a log block');
  assert.match(log![1], /output file \S+/);
  assert.match(log![1], /roll_keep_for 168h/);
  assert.doesNotMatch(log![1], /format console/, 'JSON, not console');
});

test('2 and 5. count.mjs adds the GETs of / and /index.html answered 200 or 304 since its last run; the total file holds a number and a timestamp; counter.gif is written', () => {
  mustExist('deploy/counter/count.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'still-here-count-'));
  const [logf, total, gif] = ['access.log', 'total', 'counter.gif'].map((f) => join(dir, f));
  const t0 = Date.now() / 1000;
  writeFileSync(
    logf,
    [
      line('GET', '/', 200, t0 + 1),
      line('GET', '/index.html', 304, t0 + 2),
      line('HEAD', '/', 200, t0 + 3),
      line('GET', '/counter.gif', 200, t0 + 4),
      line('GET', '/', 404, t0 + 5),
      line('POST', '/', 405, t0 + 6),
      line('GET', '/cgi-bin/guestbook.html', 200, t0 + 7),
      line('GET', '/index.html', 200, t0 + 8),
    ].join('\n') + '\n',
  );
  const count = () => sh(process.execPath, [abs('deploy/counter/count.mjs'), '--log', logf, '--total', total, '--gif', gif]);
  const value = () => {
    const t = readFileSync(total, 'utf8').trim();
    let tokens: string[];
    try {
      const j = JSON.parse(t);
      tokens = typeof j === 'number' ? [String(j)] : Object.values(j).map(String);
    } catch {
      tokens = t.split(/\s+/);
    }
    assert.equal(tokens.length, 2, `a number and a timestamp, nothing else: ${t}`);
    const n = tokens.find((x) => /^\d+$/.test(x) && x.length < 10);
    const ts = tokens.find((x) => x !== n);
    assert.ok(n !== undefined && ts !== undefined && (/^\d{4}-\d\d-\d\dT/.test(ts) || /^\d{9,}(\.\d+)?$/.test(ts)), `a number and a timestamp: ${t}`);
    return Number(n);
  };
  count();
  assert.equal(value(), 3, 'GET / 200, GET /index.html 304 and GET /index.html 200 count; HEAD, the counter image, 404 and POST do not');
  const g = gifInfo(readFileSync(gif));
  assert.ok(g.width > 0 && g.height > 0, 'counter.gif is a GIF');
  appendFileSync(logf, [line('GET', '/', 200, t0 + 20), line('GET', '/', 304, t0 + 21)].join('\n') + '\n');
  count();
  assert.equal(value(), 5, 'only what is new since the last run is added');
  count();
  assert.equal(value(), 5, 'a run with nothing new adds nothing');
  const c = readMust('deploy/caddy/vandalwayind.caddy');
  assert.match(c, /Cache-Control\s+"?no-cache"?/i, 'the HTML and counter.gif are sent with Cache-Control: no-cache');
});

/** counter.gif for a total reached by `n` counted loads, in a fresh scratch counter. */
function gifFor(n: number): string {
  const dir = mkdtempSync(join(tmpdir(), 'still-here-digits-'));
  const t0 = Date.now() / 1000;
  writeFileSync(join(dir, 'access.log'), [...Array(n).keys()].map((i) => line('GET', '/', 200, t0 + i)).join('\n') + '\n');
  sh(process.execPath, [abs('deploy/counter/count.mjs'), '--log', join(dir, 'access.log'), '--total', join(dir, 'total'), '--gif', join(dir, 'counter.gif')]);
  return join(dir, 'counter.gif');
}

test('2. counter.gif shows the total as odometer digits: each digit its own cell, the same digit drawn the same way', () => {
  mustExist('deploy/counter/count.mjs');
  const [g1, g2, g11, g12] = [1, 2, 11, 12].map(gifFor);
  // cells are found from the right edge: units, then tens; a cell is the columns where two totals
  // that differ only in that digit differ
  const out = python(
    'import sys\nfrom PIL import Image\n' +
      'a, b, c, d = [Image.open(p).convert("RGB") for p in sys.argv[1:5]]\n' +
      // columns counted from the right edge, so padded and growing counters read alike
      // ink, not exact colour: each GIF has its own palette
      'def ink(im, x, y):\n  p = im.getpixel((x, y)); q = im.getpixel((0, 0))\n  return sum(abs(p[i] - q[i]) for i in range(3)) > 150\n' +
      'def col(im, xr):\n  w, h = im.size; x = w - 1 - xr\n  return tuple(ink(im, x, y) for y in range(h)) if 0 <= x < w else None\n' +
      'def same(x, r0, y, s0, n):\n  return all(col(x, r0 + i) == col(y, s0 + i) and col(x, r0 + i) is not None for i in range(n))\n' +
      'units = [r for r in range(max(a.size[0], b.size[0])) if col(a, r) != col(b, r)]\n' +
      'u0, n = (min(units), max(units) - min(units) + 1) if units else (0, 0)\n' +
      // the pitch: the shift at which 11 repeats its units digit as its tens digit
      'pitch = next((p for p in range(n, max(c.size[0], 1)) if same(c, u0 + p, c, u0, n)), 0)\n' +
      'checks = [n > 0, pitch > 0,\n' +
      '  same(c, u0, a, u0, n),\n' +
      '  same(d, u0, b, u0, n),\n' +
      '  same(d, u0 + pitch, c, u0 + pitch, n),\n' +
      '  a.size[1] == b.size[1] == c.size[1] == d.size[1]]\n' +
      'print(" ".join("1" if x else "0" for x in checks))',
    [g1, g2, g11, g12],
  ).trim();
  assert.equal(out, '1 1 1 1 1 1', `digit cells (a units cell, a pitch at which 11 repeats its 1, 11 ends as 1 does, 12 ends as 2 does, 12's tens is 11's, one height): ${out}`);
});

test('2. served: the page and counter.gif carry Cache-Control: no-cache', { skip: process.env.VANDALWAY_INTERNAL_URL ? false : 'VANDALWAY_INTERNAL_URL unset (uncommitted); served headers are checked when it is configured' }, async () => {
  const origin = process.env.VANDALWAY_INTERNAL_URL!.replace(/\/$/, '');
  for (const p of ['/', '/index.html', '/counter.gif']) assert.match((await fetch(origin + p)).headers.get('cache-control') ?? '', /no-cache/, p);
});

test('3. a systemd timer every ten minutes, installed and removed by the V2 scripts; Node present or installed', () => {
  const timers = files('deploy', /\.timer$/);
  assert.equal(timers.length, 1, 'one timer');
  const timer = readMust(timers[0]);
  assert.match(timer, /OnUnitActiveSec\s*=\s*10\s*min|OnCalendar\s*=\s*\*:0\/10|OnCalendar\s*=\s*\*-\*-\* \*:0\/10(:00)?/);
  const unit = timers[0].split('/').pop()!.replace(/\.timer$/, '');
  const service = readMust(timers[0].replace(/\.timer$/, '.service'));
  assert.match(service, /count\.mjs/);
  const install = readMust('deploy/vandalwayind-install.sh');
  const uninstall = readMust('deploy/vandalwayind-uninstall.sh');
  assert.match(install, new RegExp(`systemctl[^\\n]*enable[^\\n]*${unit}`), 'installed');
  assert.match(uninstall, new RegExp(`systemctl[^\\n]*disable[^\\n]*${unit}|rm[^\\n]*${unit}\\.timer`), 'removed');
  assert.match(install, /command -v node|which node|node --version/, 'Node checked, installed if absent');
  assert.match(readMust(DEPLOY_LOG), new RegExp(`list-timers[\\s\\S]{0,400}${unit}`), 'systemctl list-timers shows it');
});
