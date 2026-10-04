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
import { abs, DEPLOY_LOG, files, gifInfo, mustExist, readMust, sh } from '../helpers/repo.ts';

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
