// X1 (still-here-q15) — presence.json. garage/pack/ACCEPTANCE.md § X1, items 1–2.
// Item 2 on staging runs when STAGING_URL is set (from the uncommitted .env.staging); production is
// N3's. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PRESENCE_BODY } from '../../e2e/helpers/strings.ts';
import { builtSite, servedSite } from '../helpers/repo.ts';

const PATHS = ['/api/v1/presence.json', '/api/v1/presence.json?object=Lucas', '/api/v1/presence.json?object=Adrian%20Vale'];

async function check(origin: string): Promise<Response[]> {
  const rs = await Promise.all(PATHS.map((p) => fetch(origin + p, { redirect: 'manual' })));
  const bodies = await Promise.all(rs.map((r) => r.clone().arrayBuffer()));
  rs.forEach((r, i) => {
    assert.equal(r.status, 200, `${PATHS[i]}: 200`);
    assert.match(r.headers.get('content-type') ?? '', /^application\/json\b/, `${PATHS[i]}: application/json`);
  });
  const first = Buffer.from(bodies[0]);
  for (const b of bodies) assert.ok(Buffer.from(b).equals(first), 'byte-identical bodies');
  assert.deepEqual(JSON.parse(first.toString('utf8')), JSON.parse(PRESENCE_BODY));
  return rs;
}

test('1. presence.json, with and without a query, answers 200 application/json, byte-identical, {"status":"STILL HERE"}', async () => {
  const file = join(builtSite(), 'api/v1/presence.json');
  assert.ok(existsSync(file), 'site/api/v1/presence.json');
  assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), { status: 'STILL HERE' });
  const { url } = await servedSite();
  await check(url);
});

test('2. the local server sends access-control-allow-origin: *', async () => {
  const { url } = await servedSite();
  for (const r of await check(url)) assert.equal(r.headers.get('access-control-allow-origin'), '*');
});

test('2. staging sends access-control-allow-origin: *', { skip: process.env.STAGING_URL ? false : 'STAGING_URL unset: staging is checked when it is configured (L1 item 4 again)' }, async () => {
  for (const r of await check(process.env.STAGING_URL!.replace(/\/$/, ''))) assert.equal(r.headers.get('access-control-allow-origin'), '*');
});
