// L3 (still-here-5v0) — DNS, before launch. garage/pack/ACCEPTANCE.md § L3, items 1–4.
// Lookups go to the system resolver, or to the public resolvers named in NULL_MX_RESOLVER
// (comma-separated, kept out of the repository). The challenge value Clive handed over is
// PAGES_CHALLENGE (uncommitted). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Resolver } from 'node:dns/promises';
import { randomBytes } from 'node:crypto';
import { DEPLOY_LOG, readMust } from '../helpers/repo.ts';

const DOMAINS = ['isitstillhere.com', 'vandalwayind.com'];
function resolver(): Resolver {
  const r = new Resolver({ timeout: 5000, tries: 2 });
  const s = process.env.NULL_MX_RESOLVER?.split(',').map((x) => x.trim()).filter(Boolean);
  if (s?.length) r.setServers(s);
  return r;
}

test('1–2. a zone snapshot of each domain before the first write, its id in the deploy log; a validation dry run before each write', () => {
  const log = readMust(DEPLOY_LOG);
  for (const d of DOMAINS) {
    assert.match(log, new RegExp(`snapshot[^\\n]*${d.replace('.', '\\.')}[^\\n]*\\b(id|ID)\\b[:= ]+\\S+|${d.replace('.', '\\.')}[^\\n]*snapshot[^\\n]*\\b(id|ID)\\b[:= ]+\\S+`), `${d}: snapshot id`);
    const lines = log.split('\n');
    const snap = lines.findIndex((l) => l.includes(d) && /snapshot/i.test(l));
    const write = lines.findIndex((l) => l.includes(d) && /\b(write|wrote|created|added) [^\n]*record/i.test(l));
    assert.ok(snap >= 0 && write > snap, `${d}: the snapshot comes before the first write`);
    const writes = lines.map((l, i) => [l, i] as const).filter(([l]) => l.includes(d) && /\b(write|wrote|created|added) [^\n]*record/i.test(l));
    for (const [, i] of writes) assert.ok(lines.slice(Math.max(0, i - 5), i).some((l) => /dry run[^\n]*(passed|ok)/i.test(l)), `${d}: a dry run passed before the write at line ${i + 1}`);
  }
});

test('3. null MX, SPF -all and DMARC reject on both; the Pages challenge TXT', async () => {
  const r = resolver();
  for (const d of DOMAINS) {
    const mx = await r.resolveMx(d);
    assert.equal(mx.length, 1, `${d}: one MX`);
    assert.equal(mx[0].priority, 0);
    assert.ok(['', '.'].includes(mx[0].exchange), `${d}: MX 0 .`);
    const txt = (await r.resolveTxt(d)).map((x) => x.join(''));
    assert.ok(txt.includes('v=spf1 -all'), `${d}: SPF`);
    const dmarc = (await r.resolveTxt(`_dmarc.${d}`)).map((x) => x.join(''));
    assert.ok(dmarc.includes('v=DMARC1; p=reject'), `${d}: DMARC`);
  }
  const challenge = (await r.resolveTxt('_github-pages-challenge-vandalway-industries.isitstillhere.com')).map((x) => x.join(''));
  assert.equal(challenge.length, 1, 'the Pages challenge record');
  if (process.env.PAGES_CHALLENGE) assert.equal(challenge[0], process.env.PAGES_CHALLENGE);
});

test('4. no wildcard record; every other record equals the snapshot (recorded in the deploy log)', async () => {
  const r = resolver();
  for (const d of DOMAINS) {
    const probe = `zz-${randomBytes(6).toString('hex')}.${d}`;
    await assert.rejects(r.resolveAny(probe), (e: NodeJS.ErrnoException) => ['ENOTFOUND', 'ENODATA'].includes(e.code ?? ''), `${d}: no wildcard`);
    assert.match(readMust(DEPLOY_LOG), new RegExp(`${d.replace('.', '\\.')}[^\\n]*(every other record|other records)[^\\n]*(equal|unchanged|match)`, 'i'), `${d}: compared with its snapshot`);
  }
});
