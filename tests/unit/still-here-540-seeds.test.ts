// G2 (still-here-540) — record seeds filed.
// Checks garage/pack/ACCEPTANCE.md § G2 items 1–6 mechanically. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const COMPANY = join(ROOT, 'company');
const read = (rel: string): string => readFileSync(join(ROOT, rel), 'utf8');
const sh = (cmd: string, args: string[], cwd = ROOT): string =>
  execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });

// The sample week's records filed at P0 (garage/pack/CONTENT_SEEDS.md § Records), with the
// company's own text of each, as filed. Dates per D12: Monday 2026-09-28 to Friday 2026-10-02.
type Seed = { id: string; path: string; date: string; text: string[] };
const SEEDS: Seed[] = [
  {
    "id": "MAIL-001",
    "path": "correspondence/MAIL-001.md",
    "date": "2026-09-28T09:05:00Z",
    "text": [
      "Clive,",
      "Vandalway would like to see movement on the stillness roadmap before Friday. Please demonstrate expanded coverage without compromising the core promise that nothing has changed.",
      "One customer appearing in three case studies remains one customer for reporting purposes.",
      "Malcolm"
    ]
  },
  {
    "id": "MAIL-002",
    "path": "correspondence/MAIL-002.md",
    "date": "2026-09-28T09:18:00Z",
    "text": [
      "Malcolm,",
      "We are already seeing strong engagement across municipal infrastructure, public seating, and the civic rest sector. Diane will validate the expanded footprint against our flagship research asset.",
      "The chair is ready.",
      "Clive"
    ]
  },
  {
    "id": "CHAT-001",
    "path": "chat/general-2026-09-29.md",
    "date": "2026-09-29",
    "text": [
      "h",
      "hey",
      "sorry",
      "quick",
      "thing",
      "about",
      "the",
      "presence",
      "numbers",
      "are",
      "we",
      "counting",
      "people",
      "or",
      "chairs?"
    ]
  },
  {
    "id": "FAC-001",
    "path": "notes/FAC-001.md",
    "date": "2026-09-29T11:44:00Z",
    "text": [
      "Microwave is working again. Testing with salmon. Please do not unplug equipment during a test."
    ]
  },
  {
    "id": "INC-001",
    "path": "status/notes.xml",
    "date": "2026-09-29T11:45:00Z",
    "text": [
      "Observed: Staff have left the third floor. The product continues to confirm their presence. Graham remains available near the microwave.",
      "Customer impact: None reported. Internal impact: Several reported, loudly.",
      "Mitigation: Open windows. Do not ask Graham what tomorrow's lunch is."
    ]
  },
  {
    "id": "STATUS-001",
    "path": "status/status-updates.xml",
    "date": "2026-09-29T12:10:00Z",
    "text": [
      "All systems operational. We are investigating reports of an unexpected concentration of elsewhere on floor three."
    ]
  },
  {
    "id": "EXP-001",
    "path": "correspondence/EXP-001.md",
    "date": "2026-09-30T10:16:00Z",
    "text": [
      "Hi Martin! Attaching this week's stuff: fog fluid, two sandwiches, and Dracula parking. They gave me a radio now so probably best to text. Do we reimburse capes if they're technically PPE?"
    ]
  },
  {
    "id": "MAIL-003",
    "path": "correspondence/MAIL-003.md",
    "date": "2026-09-30T10:31:00Z",
    "text": [
      "Lucas,",
      "As previously noted, a lanyard is not a purchase order. Please identify the department authorizing the fog, the name of the person consuming the sandwiches, and whether Dracula is the driver or the location.",
      "Your gum reimbursement remains pending flavor disclosure.",
      "Susan"
    ]
  },
  {
    "id": "CAL-001",
    "path": "calendar/CAL-001.md",
    "date": "2026-10-01",
    "text": [
      "Invite history: Thursday 09:00 → Thursday 13:00 → Friday 10:00 → Friday 14:00 → canceled.",
      "Cancellation note: “The temporal coordinates remain provisional. Please review the attached paper in lieu of attendance.”"
    ]
  },
  {
    "id": "RESEARCH-001",
    "path": "research/competitive-landscape.md",
    "date": "2026-10-01",
    "text": [
      "Abstract: Here remains the company's strongest position. There possesses an apparent advantage in destinations but insufficient evidence of local presence. Somewhere benefits from ambiguity and a concerning lack of oversight. WHERE-r-YOU demonstrates strong technological alignment with STILL HERE; interviews were conducted with the same developer twice to broaden the evidence base.",
      "Recommendation: Commission a follow-up investigation into whether “nearby” is a market segment or an admission."
    ]
  },
  {
    "id": "MAIL-004",
    "path": "correspondence/MAIL-004.md",
    "date": "2026-10-01T15:02:00Z",
    "text": [
      "Clive,",
      "Your shareholder history does not grant access to individual chewing relationships. “Potential enterprise mint synergies” is not an accounting purpose.",
      "For convenience, I've reattached the attachment referenced in the attached correspondence.",
      "Susan"
    ]
  },
  {
    "id": "NOTE-001",
    "path": "notes/NOTE-001.md",
    "date": "2026-10-01T15:20:00Z",
    "text": [
      "Adrian quit at the 2022 party. He handed you the letter beside the cheese. I put a copy in the spreadsheet. His status is not “camera optional.”"
    ]
  },
  {
    "id": "QA-001",
    "path": "notes/QA-001.md",
    "date": "2026-10-02T09:00:00Z",
    "text": [
      "Moved the folding chair six feet to the left. This is the normal Friday test. Please stop describing it as an attack."
    ]
  },
  {
    "id": "CERT-001",
    "path": "certificates/CERT-001.json",
    "date": "2026-10-02T09:01:00Z",
    "text": [
      "Object: Folding chair",
      "Result: STILL HERE.",
      "Location evidence: None collected.",
      "Linked issue: ISSUE-001."
    ]
  },
  {
    "id": "SUPPORT-001",
    "path": "correspondence/SUPPORT-001.md",
    "date": "2026-10-02T09:14:00Z",
    "text": [
      "Good morning. The certificate came through beautifully. Does it remain valid if the bench was removed in April? We need something for the audit."
    ]
  },
  {
    "id": "SUPPORT-002",
    "path": "correspondence/SUPPORT-002.md",
    "date": "2026-10-02T09:32:00Z",
    "text": [
      "The certificate confirms that our system processed the words “Memorial bench.” It cannot establish the bench's whereabouts. I appreciate that this distinction may affect your audit and our business model."
    ]
  },
  {
    "id": "MAIL-005",
    "path": "correspondence/MAIL-005.md",
    "date": "2026-10-02T16:00:00Z",
    "text": [
      "We maintained uninterrupted certification through a facilities event, expanded into theme-park-adjacent expenditure, and validated the platform against deliberate furniture displacement.",
      "No material change to the core product."
    ]
  },
  {
    "id": "MAIL-006",
    "path": "correspondence/MAIL-006.md",
    "date": "2026-10-02T16:04:00Z",
    "text": [
      "That last sentence is accurate."
    ]
  }
];

const ISSUE_001 = [
  "Steps: Enter “Folding chair.” Check. Remove chair. Check again.",
  "Expected: A meaningful difference if we intend to sell physical verification.",
  "Actual: Two certificates and no chair.",
  "The implementation conforms to the advertised constant-presence response contract. The physical-verification requirement does not currently exist.",
  "Correct. Leaving this open for the advertised part."
];
const ISSUE_002 = ["Lucas remains `unknown`. Receipt evidence suggests employment, but does not establish employment here. Please do not resolve this ticket solely because he answered an email."];
const SUSAN_ANNOTATION = "Matching flavor is an observation. Your interpretation is not reimbursable.";

const MON = '2026-09-28';
const FRI = '2026-10-02';
const unescapeXml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

test('1. every P0 seed is filed at its path, with its id, its text verbatim and its D12 date', () => {
  assert.equal(SEEDS.length, 18);
  for (const s of SEEDS) {
    const rel = `company/${s.path}`;
    assert.ok(existsSync(join(ROOT, rel)), `${s.id}: ${rel} missing`);
    const raw = read(rel);
    const text = s.path.endsWith('.xml') ? unescapeXml(raw) : raw;
    assert.ok(text.includes(s.id), `${s.id}: id not in ${rel}`);
    let body = text;
    if (s.path.endsWith('.json')) {
      const j = JSON.parse(raw);
      assert.equal(j.id, s.id);
      body = (j.record as string[]).join('\n');
    }
    // verbatim, in order
    let at = 0;
    for (const line of s.text) {
      const i = body.indexOf(line, at);
      assert.ok(i >= 0, `${s.id}: text not verbatim or out of order: ${line.slice(0, 50)}…`);
      at = i + line.length;
    }
    assert.ok(text.includes(s.date), `${s.id}: date ${s.date} not recorded`);
    // every date the record carries falls in the sample week (Monday to Friday)
    for (const m of raw.matchAll(/\b(20\d\d-\d\d-\d\d)/g)) {
      assert.ok(m[1] >= MON && m[1] <= FRI, `${s.id}: date ${m[1]} outside ${MON}–${FRI}`);
    }
  }
  // the chat is fifteen messages from len, all at 11:42
  const chat = read('company/chat/general-2026-09-29.md');
  assert.equal((chat.match(/^\*\*len\*\* · 11:42$/gm) ?? []).length, 15);
  // mail carries its sender and recipients as addresses
  for (const s of SEEDS.filter((x) => x.path.startsWith('correspondence/'))) {
    const fm = read(`company/${s.path}`).split('\n---\n')[0];
    assert.match(fm, /^from: \S+@(vandalway|municipal)\.example$/m, `${s.id}: sender`);
    assert.match(fm, /^ {2}- \S+@(vandalway|municipal)\.example$/m, `${s.id}: recipients`);
  }
  // CERT-001 is the public product's certificate, with the identifier the pack derives
  const cert = JSON.parse(read('company/certificates/CERT-001.json'));
  assert.equal(cert.identifier, 'SH-00PK-EEC2-0EPR');
  assert.equal(cert.object, 'Folding chair');
  assert.equal(cert.result, 'STILL HERE.');
  // the gum graph seed is a conformant OKF bundle, with Susan's annotation
  const okf = sh('python3', ['tools/okf/okf_validate.py', 'company/gum-graph', '--strict']);
  assert.match(okf, /conformant/);
  const graph = [...walk(join(COMPANY, 'gum-graph'))].map((f) => readFileSync(f, 'utf8')).join('\n');
  assert.ok(graph.includes(SUSAN_ANNOTATION), 'Susan\'s annotation is not in the gum graph');
  for (const p of ['diane', 'jules', 'clive', 'lucas', 'susan']) assert.ok(existsSync(join(COMPANY, `gum-graph/people/${p}.md`)), `gum graph lacks ${p}`);
});

// minimal YAML reading for the flat lists these files use: "- id: x" then "key: value" lines
function yamlList(rel: string, key: string): Record<string, string>[] {
  const out: Record<string, string>[] = [];
  let inList = false;
  for (const line of read(rel).split('\n')) {
    if (/^\S/.test(line)) inList = line.startsWith(`${key}:`);
    if (!inList) continue;
    const item = /^ {2}- (\w+): (.*)$/.exec(line);
    const field = /^ {4}(\w+): (.*)$/.exec(line);
    if (item) out.push({ [item[1]]: item[2] });
    else if (field && out.length) out[out.length - 1][field[1]] = field[2];
  }
  return out;
}

test('2. staff.yaml: exactly the twelve, matching the tracker\'s People; customers.yaml: eileen', () => {
  const people = new Map<string, { name: string; role: string }>();
  const tracker = read('company/tracker/TRACKER.md').split('## People')[1].split('\n## ')[0];
  for (const m of tracker.matchAll(/^\| (\w+) \| ([^|]+?) \| ([^|]+?) \|$/gm)) {
    if (m[1] !== 'ID') people.set(m[1], { name: m[2], role: m[3] });
  }
  const ids = ['clive', 'diane', 'martin', 'jules', 'petra', 'susan', 'lucas', 'graham', 'len', 'adrian', 'bev', 'malcolm'];
  assert.deepEqual([...people.keys()].sort(), [...ids].sort(), 'TRACKER.md § People');
  const staff = yamlList('company/staff/staff.yaml', 'staff');
  assert.deepEqual(staff.map((s) => s.id).sort(), [...ids].sort());
  for (const s of staff) {
    assert.equal(s.name, people.get(s.id)!.name, `${s.id} name`);
    assert.equal(s.role, people.get(s.id)!.role, `${s.id} role`);
    assert.equal(s.email, `${s.id}@vandalway.example`);
  }
  const customers = yamlList('company/staff/customers.yaml', 'customers');
  assert.deepEqual(customers.map((c) => [c.id, c.name, c.role]), [['eileen', 'Eileen Webb', 'Municipal archivist']]);
});

test('3. inventory.yaml holds exactly the five items and their recorded states', () => {
  const items = yamlList('company/inventory/inventory.yaml', 'items');
  assert.deepEqual(
    items.map((i) => [i.id, i.status]),
    [['stapler-01', 'present'], ['chair-01', 'present'], ['lucas', 'unknown'], ['adrian', 'unknown'], ['bench-01', 'absent']],
  );
  assert.match(read('company/inventory/inventory.yaml'), /^as_of: 2026-10-02$/m);
});

test('4. bd import into a throwaway database gives 55 issues; .beads/ is unchanged', () => {
  const hashBeads = () => {
    const h = createHash('sha256');
    for (const f of walk(join(ROOT, '.beads'))) h.update(f).update(readFileSync(f));
    return h.digest('hex');
  };
  const before = hashBeads();
  const dir = mkdtempSync(join(tmpdir(), 'still-here-tracker-'));
  try {
    sh('git', ['init', '-q'], dir);
    sh('bd', ['init', '--prefix', 'sh', '--sandbox', '--quiet'], dir);
    const db = join(dir, '.beads');
    sh('bd', ['--db', db, '--sandbox', 'import', join(COMPANY, 'tracker/tracker.jsonl')], dir);
    const issues: { status: string; labels?: string[]; external_ref?: string }[] = JSON.parse(
      sh('bd', ['--db', db, '--sandbox', 'list', '--all', '--limit', '0', '--json'], dir),
    );
    assert.equal(issues.length, 55);
    const source = read('company/tracker/tracker.jsonl').split('\n').filter(Boolean).map((l) => JSON.parse(l));
    const byRef = new Map(issues.map((i) => [i.external_ref, i]));
    const want = Array.from({ length: 55 }, (_, i) => `sh-${String(i + 1).padStart(3, '0')}`);
    assert.deepEqual([...byRef.keys()].sort(), want);
    for (const s of source) {
      const got = byRef.get(s.external_ref)!;
      assert.equal(got.status, s.status, `${s.external_ref} status`);
      assert.deepEqual([...(got.labels ?? [])].sort(), [...s.labels].sort(), `${s.external_ref} labels`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.equal(hashBeads(), before, 'the repository\'s .beads/ changed');
  // and the record label never entered the repository's beads
  for (const line of read('.beads/issues.jsonl').split('\n').filter(Boolean)) {
    assert.ok(!(JSON.parse(line).labels ?? []).includes('record'), 'a bead carries the record label');
  }
});

test('5. tracker.jsonl validates against schema.json; ISSUE-001 and ISSUE-002 verbatim; sh-051\'s label history', async () => {
  const { validateTracker } = await import('../../scripts/validate-tracker.mjs');
  const { count, errors } = validateTracker();
  assert.deepEqual(errors, []);
  assert.equal(count, 55);
  const schema = JSON.parse(read('company/tracker/schema.json'));
  assert.ok(schema.required.includes('external_ref') && schema.required.includes('created_by'));
  assert.deepEqual(schema.properties.labels.contains, { const: 'record' });
  const rows = read('company/tracker/tracker.jsonl').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const sh051 = rows.find((r) => r.external_ref === 'sh-051');
  const sh054 = rows.find((r) => r.external_ref === 'sh-054');
  assert.ok(sh051.description.includes('Record ID: ISSUE-001'));
  assert.ok(sh054.description.includes('Record ID: ISSUE-002'));
  assert.equal(sh051.created_at, '2026-09-28T09:27:00Z');
  assert.equal(sh054.created_at, '2026-09-30T11:03:00Z');
  for (const t of ISSUE_001) assert.ok(sh051.description.includes(t), `sh-051 lacks: ${t.slice(0, 50)}…`);
  for (const t of ISSUE_002) assert.ok(sh054.description.includes(t), `sh-054 lacks: ${t.slice(0, 50)}…`);
  // bug -> market-education -> bug, in that order, and the issue is labelled bug today
  const d: string = sh051.description;
  const relabel = d.indexOf('Relabeled `bug` → `market-education`');
  const restore = d.indexOf('Restored `bug`.');
  assert.ok(relabel > 0 && restore > relabel, 'sh-051 comments lose the label history');
  assert.ok(sh051.labels.includes('bug') && !sh051.labels.includes('market-education'));
});

test('6. the continuity fixture is the handed-over file, unchanged; no company phrase matches confidential', async () => {
  const raw = readFileSync(join(ROOT, 'tests/fixtures/continuity-hashes.json'));
  assert.equal(createHash('sha256').update(raw).digest('hex'), 'fa072e437e40a7e951391455d2d4df3c969d02160cbbf6a63d016d81b4d18cfc', 'the fixture was edited');
  const f = JSON.parse(raw.toString('utf8'));
  assert.match(f.salt, /^[0-9a-f]{32}$/);
  for (const list of ['confidential', 'unknown-to-staff']) {
    assert.ok(Array.isArray(f[list]) && f[list].length > 0, `${list} missing`);
    for (const h of f[list]) assert.match(h, /^[0-9a-f]{64}$/);
  }
  const { check, hashPhrase, normalize, phrases } = await import('../../scripts/continuity-check.mjs');
  // the rule, on a sentence of our own
  assert.equal(normalize('Is it STILL   here? Diane’s chair—six feet.'), "is it still here diane's chair six feet");
  assert.deepEqual(phrases('Still here, really'), ['still here', 'still here really', 'here really']);
  assert.equal(hashPhrase(f.salt, 'still here'), createHash('sha256').update(`${f.salt}\nstill here`).digest('hex'));
  const hits = check().filter((h: { list: string }) => h.list === 'confidential');
  assert.deepEqual(hits, [], `company/ matches the confidential list: ${hits.map((h: { file: string }) => h.file).join(', ')}`);
});
