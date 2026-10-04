// RC2 (still-here-8je) — the inventory. garage/pack/ACCEPTANCE.md § RC2, items 1–4.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs, buildWithReadLog, files, jsonSchemaErrors, python, read, readMust, yaml } from '../helpers/repo.ts';
import { definedIds } from '../helpers/records.ts';

const inventory = () => yaml(readMust('company/inventory/inventory.yaml')) as { items: Record<string, unknown>[] };

test('1. inventory.yaml validates against inventory/schema.json', () => {
  assert.deepEqual(jsonSchemaErrors(inventory(), 'company/inventory/schema.json'), []);
});

test('2. HERE_FINAL_2008_USE_THIS_ONE.xml is SpreadsheetML 2003 and holds the same entities and statuses', () => {
  const rel = 'company/inventory/HERE_FINAL_2008_USE_THIS_ONE.xml';
  const xml = readMust(rel);
  assert.match(xml, /<\?mso-application progid="Excel\.Sheet"\?>/);
  assert.match(xml, /xmlns="urn:schemas-microsoft-com:office:spreadsheet"/);
  const rows: string[][] = JSON.parse(
    python(
      'import sys, json\nfrom lxml import etree\nns = {"ss": "urn:schemas-microsoft-com:office:spreadsheet"}\n' +
        'doc = etree.parse(sys.argv[1])\nrows = []\n' +
        'for r in doc.iterfind(".//ss:Worksheet/ss:Table/ss:Row", ns):\n' +
        '  rows.append(["".join(c.itertext()).strip() for c in r.iterfind("ss:Cell", ns)])\n' +
        'print(json.dumps(rows))',
      [abs(rel)],
    ),
  );
  const head = rows.findIndex((r) => r.some((c) => /^id$/i.test(c)) && r.some((c) => /^status$/i.test(c)));
  assert.ok(head >= 0, 'a header row with id and status');
  const id = rows[head].findIndex((c) => /^id$/i.test(c));
  const st = rows[head].findIndex((c) => /^status$/i.test(c));
  const sheet = rows.slice(head + 1).filter((r) => r[id]).map((r) => `${r[id]}=${r[st]}`).sort();
  const yamlSet = inventory().items.map((i) => `${i.id}=${i.status}`).sort();
  assert.deepEqual(sheet, yamlSet);
});

test('3. each entity carries its evidence as record ids that resolve; no field states where anyone works', () => {
  const { ids } = definedIds();
  for (const item of inventory().items) {
    const refs = (item.records ?? item.evidence_records ?? []) as string[];
    assert.ok(Array.isArray(refs) && refs.length > 0, `${item.id}: evidence as record ids`);
    for (const r of refs) assert.ok(ids.has(r), `${item.id}: ${r} resolves`);
    const keys = Object.keys(item).join(' ');
    assert.doesNotMatch(keys, /employ|employer|works?_?(at|for)|workplace|job|location_now|current_location/i, `${item.id}: no field for where anyone works`);
  }
});

test('4. nothing under site/ or src/ reads either file', () => {
  const grep = [...files('src'), ...files('scripts')].filter((f) => /inventory\.yaml|HERE_FINAL_2008|company\/inventory/.test(read(f)));
  assert.deepEqual(grep, []);
  const { reads } = buildWithReadLog();
  assert.deepEqual(reads.filter((r) => r.startsWith('company/inventory')), [], 'the build read the inventory');
});
