// N2 (still-here-vi0) — vandalwayind.com live. garage/pack/ACCEPTANCE.md § N2, items 1–3 (item 4,
// the counter on production, is W7 in e2e/specs/still-here-vi0-walk.spec.ts). The production
// server's address is PRODUCTION_SERVER_IP (uncommitted) when the closer sets it.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Resolver } from 'node:dns/promises';
import { connect } from 'node:tls';
import { PAGES_IPV4 } from '../../e2e/helpers/strings.ts';
import { abs, DEPLOY_LOG, files, readMust, run } from '../helpers/repo.ts';

const SITE = 'https://vandalwayind.com';

test('1. A records point at the production server; www redirects to the apex; the public Caddy block came from a deploy/ script with its undo, by the V2 procedure', async () => {
  const r = new Resolver({ timeout: 5000, tries: 2 });
  const servers = process.env.NULL_MX_RESOLVER?.split(',').map((s) => s.trim()).filter(Boolean);
  if (servers?.length) r.setServers(servers);
  const a = await r.resolve4('vandalwayind.com');
  assert.ok(a.length > 0, 'an A record');
  assert.ok(a.every((ip) => !(PAGES_IPV4 as readonly string[]).includes(ip)), 'not GitHub Pages: our own server');
  if (process.env.PRODUCTION_SERVER_IP) assert.deepEqual(a, [process.env.PRODUCTION_SERVER_IP]);
  const www = await fetch('https://www.vandalwayind.com/', { redirect: 'manual' });
  assert.ok([301, 308].includes(www.status));
  assert.match(www.headers.get('location') ?? '', /^https:\/\/vandalwayind\.com\/?$/);
  const scripts = files('deploy', /\.sh$/);
  const pub = scripts.filter((f) => /install\.sh$/.test(f) && !/uninstall/.test(f) && /vandalwayind\.com\s*(,|\{|$)/m.test(readMust(f)));
  assert.ok(pub.length >= 1, 'a deploy/ script adds the public block');
  for (const p of pub) {
    const undo = p.replace(/install\.sh$/, 'uninstall.sh');
    assert.ok(scripts.includes(undo), `${p} has its undo, ${undo}`);
    const t = readMust(p);
    assert.match(t, /caddy validate/);
    assert.match(t, /cp\b[^\n]*Caddyfile/);
    assert.equal(run('bash', ['-n', abs(p)]).status, 0);
  }
  assert.match(readMust(DEPLOY_LOG), /vandalwayind\.com[^\n]*(public block|public site)[^\n]*(other (site )?blocks?[^\n]*(unchanged|identical))?/i);
});

test('2. http answers 301 to https; the certificate is valid; Last-Modified per V4', async () => {
  const r = await fetch('http://vandalwayind.com/', { redirect: 'manual' });
  assert.equal(r.status, 301);
  assert.match(r.headers.get('location') ?? '', /^https:\/\/vandalwayind\.com\/?$/);
  await new Promise<void>((ok, fail) => {
    const s = connect({ host: 'vandalwayind.com', port: 443, servername: 'vandalwayind.com' }, () => {
      s.authorized ? ok() : fail(new Error(String(s.authorizationError)));
      s.end();
    });
    s.on('error', fail);
  });
  const head = await fetch(`${SITE}/`, { method: 'HEAD' });
  assert.equal(new Date(head.headers.get('last-modified') ?? 0).toISOString().slice(0, 10), '1997-08-22');
  const gb = await fetch(`${SITE}/cgi-bin/guestbook.html`, { method: 'HEAD' });
  assert.equal(new Date(gb.headers.get('last-modified') ?? 0).toISOString().slice(0, 10), '1999-03-02');
});

test('3. at go-live the total is reset to 0 and the counter line dated the go-live day by the deploy script, and index.html set back to 1997-08-22', async () => {
  const scripts = files('deploy', /\.sh$/).map((f) => readMust(f)).join('\n');
  assert.match(scripts, /go-?live/i);
  assert.match(scripts, /(echo|printf)[^\n]*\b0\b[^\n]*>[^\n]*total|reset[^\n]*total/i, 'resets the running total');
  assert.match(scripts, /touch\b[^\n]*(1997-08-22|19970822)[^\n]*index\.html|index\.html[^\n]*touch[^\n]*(1997-08-22|19970822)/);
  const html = await (await fetch(`${SITE}/`)).text();
  const m = /This page has been visited[\s\S]{0,400}?since (January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})/.exec(html.replace(/<[^>]+>/g, ' '));
  assert.ok(m, 'the counter line names the date counting began');
  assert.ok(Number(m![3]) >= 2026, 'counting began at go-live');
  // the go-live step's own record (written by the deploy script into the deploy log):
  //   go-live <YYYY-MM-DD> total <the internal copy's total> -> 0
  const g = /^go-live (\d{4}-\d\d-\d\d) total (\d+) -> 0$/m.exec(readMust(DEPLOY_LOG));
  assert.ok(g, 'the deploy log records the go-live reset');
  assert.ok(Number(g![2]) > 0, 'internal testing had made loads, and they were not carried over');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const lineDate = `${m![3]}-${String(months.indexOf(m![1]) + 1).padStart(2, '0')}-${m![2].padStart(2, '0')}`;
  assert.equal(lineDate, g![1], "the counter line's date is the go-live date");
  assert.match(scripts, /go-?live[\s\S]{0,800}(echo|printf)[^\n]*\b0\b[^\n]*>[^\n]*total|(echo|printf)[^\n]*\b0\b[^\n]*>[^\n]*total[\s\S]{0,800}go-?live/i, 'the reset to 0 is the go-live step');
});
