// L1 (still-here-xg9) — staging. garage/pack/ACCEPTANCE.md § L1, items 1–7. Staging's address is
// STAGING_URL, from the uncommitted .env.staging; live checks run when it is set (items 2–4), and
// item 5 reads STAGING_ACCESS_LOG, a copy of staging's one-day access log fetched after W2 (also
// uncommitted). Items 6 and 7 always run. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import * as R from '../../e2e/helpers/reference.ts';
import { abs, DEPLOY_LOG, files, read, readMust, run, sh } from '../helpers/repo.ts';

function staging(): string | null {
  if (process.env.STAGING_URL) return process.env.STAGING_URL.replace(/\/$/, '');
  if (existsSync(abs('.env.staging'))) {
    const m = /STAGING_URL\s*=\s*["']?(https?:\/\/[^\s"']+)/.exec(read('.env.staging'));
    if (m) return m[1].replace(/\/$/, '');
  }
  return null;
}
const S = staging();
const live = S ? false : 'STAGING_URL unset (from the uncommitted .env.staging); staging is checked when it is configured';

test('1. isSecureContext on staging (the browser spec: e2e/specs/still-here-xg9-staging.spec.ts)', () => {
  assert.match(readMust('e2e/specs/still-here-xg9-staging.spec.ts'), /isSecureContext/);
  assert.match(S ?? 'https:', /^https:/, 'staging is HTTPS');
});

test('2. staging /build.txt equals git rev-parse HEAD of the deploy', { skip: live }, async () => {
  const head = sh('git', ['rev-parse', 'HEAD']).trim();
  assert.equal((await (await fetch(`${S}/build.txt`, { cache: 'no-store' })).text()).trim(), head);
});

test("3. research 3's URL table answers on staging as on the local server", { skip: live }, async () => {
  const get = (p: string) => fetch(S + p, { redirect: 'manual' });
  assert.equal((await get('/index')).status, 200);
  assert.equal((await get('/index.html')).status, 200);
  assert.equal((await get('/index/')).status, 404);
  const r = await get('/research');
  assert.equal(r.status, 301);
  assert.match(r.headers.get('location') ?? '', /\/research\/$/);
  assert.equal((await get('/no-such-page')).status, 404);
  assert.equal((await get('/company/tracker/TRACKER.md')).status, 404);
});

test('4. presence.json carries access-control-allow-origin: * on staging', { skip: live }, async () => {
  const r = await fetch(`${S}/api/v1/presence.json`);
  assert.equal(r.headers.get('access-control-allow-origin'), '*');
});

test('5. during W2 on staging the one-day access log holds no name, base64url name or identifier', { skip: process.env.STAGING_ACCESS_LOG ? false : 'STAGING_ACCESS_LOG unset: a copy of the staging log after W2 (uncommitted)' }, () => {
  const log = readFileSync(process.env.STAGING_ACCESS_LOG!, 'utf8');
  const id = R.identifier('Folding chair', new Date());
  for (const s of ['Folding chair', 'Folding%20chair', 'Folding+chair', R.base64url('Folding chair'), id.slice(0, 7), 'SH-0']) assert.ok(!log.includes(s), `the log carries ${s}`);
  const caddy = files('deploy', /\.caddy$/).map((f) => read(f)).join('\n');
  assert.match(caddy, /roll_keep_for 24h/, 'staging keeps one day of log');
});

test('6. the staging hostname occurs in no tracked file', { skip: S ? false : 'no staging address known to this run' }, () => {
  const host = new URL(S!).hostname;
  const hits = sh('git', ['ls-files', '-z']).split('\0').filter(Boolean).filter((f) => existsSync(abs(f)) && statSync(abs(f)).isFile() && readFileSync(abs(f)).includes(host));
  assert.deepEqual(hits, []);
});

test('7. staging is installed and removed by its scripts, on a new internal port of its own; the undo ran once and the install re-ran', () => {
  for (const s of ['deploy/staging-install.sh', 'deploy/staging-uninstall.sh']) {
    readMust(s);
    assert.ok(statSync(abs(s)).mode & 0o111, `${s} is executable`);
    assert.equal(run('bash', ['-n', abs(s)]).status, 0, `${s} parses`);
  }
  const log = readMust(DEPLOY_LOG);
  assert.match(log, /staging-install\.sh/);
  assert.match(log, /staging-uninstall\.sh[^\n]*(ran|run|returned)/i, 'the undo ran');
  assert.match(log, /staging-install\.sh[^\n]*(re-?run|again)/i, 'the install re-ran');
  assert.match(log, /staging[^\n]*(new port|port of its own|own port)/i);
});
