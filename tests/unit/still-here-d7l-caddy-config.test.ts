// V2 (still-here-d7l) — vandalwayind.com served on the production server, internally.
// garage/pack/ACCEPTANCE.md § V2, items 1–3. The deploy log (deploy/deploy-log.md) records what
// was run on the server; addresses and hostnames never appear in it. Item 3 runs against
// VANDALWAY_INTERNAL_URL (uncommitted) when it is set. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { abs, DEPLOY_LOG, readMust, run } from '../helpers/repo.ts';

const CADDY = 'deploy/caddy/vandalwayind.caddy';

test('1. the Caddy snippet binds to localhost only and serves /srv/vandalwayind/ with file_server on a port of its own', () => {
  const c = readMust(CADDY).replace(/#.*$/gm, '');
  const addresses = [...c.matchAll(/^\s*([^\s{#][^{]*?)\s*\{/gm)].map((m) => m[1].trim()).filter((a) => !/^(handle|route|header|log|@|file_server|encode|root|respond|try_files)/.test(a));
  assert.ok(addresses.length >= 1, 'a site address');
  for (const a of addresses) assert.match(a, /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\]):\d{2,5}$/, `bound to localhost on its own port: ${a}`);
  assert.match(c, /\broot\s+(\*\s+)?\/srv\/vandalwayind\/?\b/);
  assert.match(c, /\bfile_server\b/);
  const log = readMust(DEPLOY_LOG);
  assert.match(log, /vandalwayind/i);
  assert.match(log, /new port|port of its own|own port/i, 'the internal network reaches it on a new port');
  assert.match(log, /no (existing )?route (was )?changed|other routes? unchanged/i);
});

test('2. install and undo scripts; the log shows the backup, validate, reload, the other blocks unchanged, the undo run and the install re-run', () => {
  for (const s of ['deploy/vandalwayind-install.sh', 'deploy/vandalwayind-uninstall.sh']) {
    const t = readMust(s);
    assert.ok(statSync(abs(s)).mode & 0o111, `${s} is executable`);
    assert.equal(run('bash', ['-n', abs(s)]).status, 0, `${s} parses`);
    assert.match(t, /^set -[a-z]*e[a-z]*u?/m, `${s} stops on error`);
  }
  const install = readMust('deploy/vandalwayind-install.sh');
  assert.match(install, /cp\b[^\n]*Caddyfile[^\n]*\$\(date|date[^\n]*\n[^\n]*cp\b[^\n]*Caddyfile/i, 'backs up the Caddyfile with a timestamp');
  assert.match(install, /caddy validate/);
  assert.match(install, /caddy reload|systemctl reload caddy/);
  const log = readMust(DEPLOY_LOG);
  for (const [what, re] of [
    ['the backup', /backed up[^\n]*Caddyfile|Caddyfile[^\n]*backed up/i],
    ['caddy validate passed', /caddy validate[^\n]*(passed|valid configuration)/i],
    ['the reload', /reload(ed)?\b[^\n]*(done|ok|succeeded)|reloaded/i],
    ['every other site block byte-identical', /(other|every other) site blocks?[^\n]*(byte-identical|unchanged|identical)/i],
    ['the undo run on the server', /vandalwayind-uninstall\.sh[^\n]*(ran|run|returned)/i],
    ['back to the backed-up state', /(returned|restored)[^\n]*backed-up state|identical to the backup/i],
    ['the install re-run', /vandalwayind-install\.sh[^\n]*(re-?run|again)/i],
  ] as const) assert.match(log, re, `the deploy log records ${what}`);
});

const URL_ = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
test('3. /cgi-bin/guestbook.html answers 200; a POST to any path answers 405', { skip: URL_ ? false : 'VANDALWAY_INTERNAL_URL unset (uncommitted); the served copy is checked when it is configured' }, async () => {
  assert.equal((await fetch(`${URL_}/cgi-bin/guestbook.html`)).status, 200);
  for (const p of ['/', '/index.html', '/cgi-bin/guestbook.html', '/no-such-page']) assert.equal((await fetch(URL_ + p, { method: 'POST', body: 'x' })).status, 405, `POST ${p}`);
});
