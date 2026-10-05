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
  // site addresses are the block openers at depth 0; a nested opener (log's `output file … {`, a
  // handle, a matcher) is never an address (C2, Phase 6 critic item 26)
  const addresses: string[] = [];
  let depth = 0;
  for (const line of c.split('\n')) {
    const m = /^\s*([^\s{#][^{]*?)\s*\{/.exec(line);
    if (m && depth === 0) addresses.push(m[1].trim());
    for (const ch of line) depth += ch === '{' ? 1 : ch === '}' ? -1 : 0;
  }
  const named = addresses.filter((a) => !/^(handle|route|header|log|output|@|file_server|encode|root|respond|try_files)/.test(a));
  assert.ok(named.length >= 1, 'a site address');
  for (const a of named) assert.match(a, /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\]):\d{2,5}$/, `bound to localhost on its own port: ${a}`);
  assert.match(c, /\broot\s+(\*\s+)?\/srv\/vandalwayind\/?\b/);
  assert.match(c, /\bfile_server\b/);
  const log = readMust(DEPLOY_LOG);
  assert.match(log, /vandalwayind/i);
  assert.match(log, /new port|port of its own|own port/i, 'the internal network reaches it on a new port');
  assert.match(log, /no (existing )?route (was )?changed|other routes? unchanged/i);
  // and the server's evidence for it: every other block's hash unchanged (item 2's lines)
  const blocks = [...log.matchAll(/^block (\S+) sha256 before ([0-9a-f]{64}) after ([0-9a-f]{64})$/gm)];
  assert.ok(blocks.length >= 1 && blocks.every((b) => b[2] === b[3]), 'every other site block hashed, unchanged');
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
  // the server's own evidence, captured by the scripts into the log (sha256sum on the server):
  //   backup <Caddyfile backup path, with its timestamp> sha256 <hex>
  //   block <site address> sha256 before <hex> after <hex>     (one line per other site block)
  //   uninstall Caddyfile sha256 <hex>                          (after the undo: equals the backup)
  assert.match(install, /sha256sum/, 'the install script hashes the Caddyfile and each site block');
  assert.match(readMust('deploy/vandalwayind-uninstall.sh'), /sha256sum/, 'the undo script hashes the restored Caddyfile');
  const backup = /^backup \S*Caddyfile\S*(?:19|20)\d\d-?\d\d-?\d\d\S* sha256 ([0-9a-f]{64})$/m.exec(log);
  assert.ok(backup, 'the backup, with a timestamp in its name, and its sha256');
  const blocks = [...log.matchAll(/^block (\S+) sha256 before ([0-9a-f]{64}) after ([0-9a-f]{64})$/gm)];
  assert.ok(blocks.length >= 1, 'each other site block hashed before and after');
  for (const b of blocks) assert.equal(b[3], b[2], `${b[1]}: byte-identical before and after`);
  assert.ok(!blocks.some((b) => /vandalwayind/.test(b[1])), 'the hashed blocks are the other sites');
  const undo = /^uninstall Caddyfile sha256 ([0-9a-f]{64})$/m.exec(log);
  assert.ok(undo, 'the Caddyfile hashed after the undo');
  assert.equal(undo![1], backup![1], 'the undo returned the server to its backed-up state');
  assert.match(log, /^caddy validate: Valid configuration$/m, "caddy validate's own output");
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
