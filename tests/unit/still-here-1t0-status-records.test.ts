// RC3 (still-here-1t0) — status records. garage/pack/ACCEPTANCE.md § RC3, items 1–3.
// Floor counts are elements whose name contains "count", carrying (as attributes or child
// elements) date, time, floor and value; an amendment is a child whose name contains "amend",
// with its value and its note. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs, buildWithReadLog, files, python, read, readMust, statusUpdates, xsdErrors } from '../helpers/repo.ts';
import { headers } from '../helpers/records.ts';

type Count = { date: string; time: string; floor: string; value: string; amendments: { value: string; note: string }[] };

function counts(): Count[] {
  readMust('company/status/notes.xml');
  return JSON.parse(
    python(
      'import sys, json\nfrom lxml import etree\n' +
        'doc = etree.parse(sys.argv[1])\nout = []\n' +
        'def get(e, k):\n' +
        '  v = e.get(k)\n' +
        '  if v is None:\n' +
        '    c = e.find(k)\n' +
        '    v = "".join(c.itertext()).strip() if c is not None else ""\n' +
        '  return v\n' +
        'for e in doc.iter():\n' +
        '  if not isinstance(e.tag, str) or "count" not in e.tag.lower() or "amend" in e.tag.lower(): continue\n' +
        '  t = get(e, "time") or get(e, "at")\n' +
        '  d = get(e, "date") or t[:10]\n' +
        '  am = [{"value": get(a, "value") or (a.text or "").strip(), "note": " ".join(a.itertext()).strip() + " " + (a.get("note") or "")} for a in e.iter() if isinstance(a.tag, str) and "amend" in a.tag.lower()]\n' +
        '  out.append({"date": d, "time": t, "floor": get(e, "floor"), "value": get(e, "value") or (e.text or "").strip(), "amendments": am})\n' +
        'print(json.dumps(out))',
      [abs('company/status/notes.xml')],
    ),
  );
}

test('1. notes.xml holds INC-001 and the 11:50 floor counts for the sample week, valid against notes.xsd; the status page never reads it', () => {
  const xml = read('company/status/notes.xml');
  assert.match(xml, /id="INC-001"/);
  const c = counts();
  for (const day of ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']) {
    const at = c.filter((x) => x.date === day && /11:50/.test(x.time));
    assert.ok(at.length > 0, `${day}: the 11:50 counts`);
  }
  assert.equal(xsdErrors('company/status/notes.xml', 'company/status/notes.xsd'), '');
  const readers = [...files('src'), ...files('scripts')].filter((f) => /notes\.xml/.test(read(f)));
  assert.deepEqual(readers, [], 'nothing in the site reads notes.xml');
  const { reads } = buildWithReadLog();
  assert.ok(!reads.includes('company/status/notes.xml'), 'the build never opens notes.xml');
});

test('2. Tuesday 2026-09-29, floor three: 0 at 11:50, amended to 1 "on reflection" (sh-014)', () => {
  const tue = counts().filter((x) => x.date === '2026-09-29' && /11:50/.test(x.time) && /^(3|three|third)$/i.test(x.floor));
  assert.equal(tue.length, 1, 'one floor-three count on Tuesday at 11:50');
  assert.equal(tue[0].value, '0');
  assert.ok(tue[0].amendments.some((a) => a.value === '1' && /on reflection/.test(a.note)), 'amended to 1 "on reflection"');
});

test('3. STATUS-001–003 agree with INC-001, QA-001 and SUPPORT-001/002 on every time and fact', () => {
  const u = statusUpdates();
  assert.equal(u.length, 3, 'three public updates (S5)');
  const sources: Record<string, string[]> = {
    'STATUS-001': [read('company/status/notes.xml')],
    'STATUS-002': [read('company/notes/QA-001.md')],
    'STATUS-003': [read('company/correspondence/SUPPORT-001.md'), read('company/correspondence/SUPPORT-002.md')],
  };
  const when: Record<string, string> = { 'STATUS-001': '2026-09-29T11:45:00Z', 'STATUS-002': '2026-10-02T09:00:00Z', 'STATUS-003': '2026-10-02T09:32:00Z' };
  for (const x of u) {
    const src = sources[x.id].join('\n');
    // a public update follows the record it reports on
    assert.ok(Date.parse(x.time) >= Date.parse(when[x.id]), `${x.id} is published after its source`);
    // every clock time it states is one its sources state
    const srcTimes = new Set([...src.matchAll(/\b(\d\d):(\d\d)\b/g)].map((m) => `${m[1]}:${m[2]}`));
    for (const h of Object.values(headers(src))) for (const m of String(h).matchAll(/T(\d\d:\d\d)/g)) srcTimes.add(m[1]);
    for (const m of x.body.matchAll(/\b(\d\d):(\d\d)\b/g)) assert.ok(srcTimes.has(`${m[1]}:${m[2]}`), `${x.id}: ${m[0]} is not in its source`);
    // distances, floors and months it states are its sources'
    for (const m of x.body.matchAll(/\b(\w+) feet\b/gi)) assert.match(src, new RegExp(`\\b${m[1]} feet\\b`, 'i'), `${x.id}: ${m[0]}`);
    for (const m of x.body.matchAll(/\bfloor (\w+)\b/gi)) assert.match(src, new RegExp(`\\bfloor ${m[1]}\\b|\\b${m[1]} floor\\b`, 'i'), `${x.id}: ${m[0]}`);
    for (const m of x.body.matchAll(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g)) assert.match(src, new RegExp(m[1]), `${x.id}: ${m[0]}`);
  }
  // HUMAN-JUDGED at C3: the rest of "every fact" is read in the table read.
});
