// N3 (still-here-tfr) — after launch. garage/pack/ACCEPTANCE.md § N3, items 1–7 (item 4, W-DoD,
// is e2e/specs/still-here-tfr-walk.spec.ts). Red until launch. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { files, read, readMust, withBrowser } from '../helpers/repo.ts';
import * as R from '../../e2e/helpers/reference.ts';
import { PRESENCE_BODY, VERIFY_LABELS } from '../../e2e/helpers/strings.ts';

const PROD = 'https://isitstillhere.com';
const DAY = 86_400_000;

async function securityTxt(): Promise<{ expires: number; type: string; status: number }> {
  const r = await fetch(`${PROD}/.well-known/security.txt`);
  const text = await r.text();
  const e = /^Expires:\s*(\S+)/m.exec(text)?.[1] ?? '';
  return { expires: Date.parse(e), type: r.headers.get('content-type') ?? '', status: r.status };
}

test('1. production security.txt: 200 text/plain, Expires within 365 days', async () => {
  const s = await securityTxt();
  assert.equal(s.status, 200);
  assert.match(s.type, /^text\/plain\b/);
  assert.ok(s.expires > Date.now() && s.expires <= Date.now() + 366 * DAY);
});

test('2. production presence.json meets X1 item 1; its access-control-allow-origin header, or the recorded finding and the amended R34', async () => {
  const bodies: string[] = [];
  let acao: string | null = null;
  for (const q of ['', '?object=Lucas', '?object=Adrian%20Vale']) {
    const r = await fetch(`${PROD}/api/v1/presence.json${q}`);
    assert.equal(r.status, 200);
    assert.match(r.headers.get('content-type') ?? '', /^application\/json\b/);
    acao = r.headers.get('access-control-allow-origin');
    bodies.push(await r.text());
  }
  assert.equal(new Set(bodies).size, 1);
  assert.deepEqual(JSON.parse(bodies[0]), JSON.parse(PRESENCE_BODY));
  if (acao !== '*') {
    const phase8 = read('PLAN.md').split(/^##+ .*Phase 8/m)[1] ?? '';
    assert.match(phase8, /access-control-allow-origin/i, 'PLAN.md Phase 8 Result records what production sends');
    const r34 = /\*\*R34\*\*[\s\S]*?(?=\n- \[)/.exec(read('PRD.md'))?.[0] ?? '';
    assert.doesNotMatch(r34, /`access-control-allow-origin: \*` on staging and\s+production/, 'PRD R34 is amended to what production sends');
  }
});

test('3. every SH- identifier in company/ verifies on the production /verify page', async () => {
  const ids = new Map<string, string>();
  for (const f of files('company')) {
    const t = read(f);
    for (const id of t.match(/SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}/g) ?? []) {
      const name = /"object"\s*:\s*"([^"]+)"/.exec(t)?.[1] ?? /STILL-HERE-([a-z0-9-]+)-[0-9A-Z]{11}\./.exec(t)?.[1].replace(/-/g, ' ');
      if (name) ids.set(id, name);
    }
  }
  assert.ok(ids.size >= 2);
  await withBrowser(async (b) => {
    const page = await b.newPage();
    for (const [id, name] of ids) {
      await page.goto(`${PROD}/verify`);
      await page.getByLabel(VERIFY_LABELS.identifier).fill(id);
      await page.getByLabel(VERIFY_LABELS.name).fill(name);
      await page.getByLabel(VERIFY_LABELS.name).press('Enter');
      await page.getByText(R.confirmation(name, R.issued(id), 'UTC'), { exact: true }).waitFor({ timeout: 8000 });
    }
  });
});

test('4. W-DoD on production (the walk spec)', () => {
  assert.match(readMust('e2e/specs/still-here-tfr-walk.spec.ts'), /W-DoD/);
  const plan = read('PLAN.md').split(/^##+ .*Phase 8/m)[1] ?? '';
  assert.match(plan, /W-DoD[^\n]*(played|passed)[^\n]*(Chromium|WebKit)/i, 'W-DoD is recorded as played on production');
});

test("5. Clive's production phone re-check is recorded in CHECKPOINTS.md", () => {
  const rec = read('garage/pack/CHECKPOINTS.md').split('## Record')[1] ?? '';
  assert.match(rec, /production[^\n]*phone|phone[^\n]*production/i);
});

test('6. PROJECT.md: the security.txt renewal date (Expires minus 30 days), its owner Martin, the reminder workflow', async () => {
  const s = await securityTxt();
  const renew = new Date(s.expires - 30 * DAY).toISOString().slice(0, 10);
  const p = readMust('PROJECT.md');
  assert.ok(p.includes(renew), `PROJECT.md names ${renew}`);
  assert.match(p, /Martin/);
  assert.match(p, /security-txt-reminder\.yml/);
});

test("7. /goal's final audit passes against PRD.md, recorded in PLAN.md Phase 8", () => {
  const plan = read('PLAN.md').split(/^##+ .*Phase 8/m)[1] ?? '';
  assert.match(plan, /final audit[^\n]*(pass|PASS)/i);
});
