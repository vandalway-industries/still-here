// RC5 (still-here-zhf) — the papers as records. garage/pack/ACCEPTANCE.md § RC5, items 1–3.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frontMatter, inDom, readMust, siteText } from '../helpers/repo.ts';
import { cited, definedIds, tracker } from '../helpers/records.ts';

const SLUGS = ['competitive-landscape', 'directionality-of-here', 'six-feet-to-the-left'];
const paper = (s: string) => frontMatter(readMust(`company/research/${s}.md`));

test('1. every footnote and citation resolves to a record here or to one of the other papers', () => {
  const { ids } = definedIds();
  const titles = SLUGS.map((s) => String(paper(s).data.title ?? ''));
  for (const s of SLUGS) {
    const { body } = paper(s);
    for (const id of cited(body)) assert.ok(ids.has(id), `${s}: ${id} resolves`);
    const notes = [...body.matchAll(/^\[\^([^\]]+)\]:\s*(.+)$/gm)];
    if (s !== 'competitive-landscape') assert.ok(notes.length >= 2, `${s}: footnotes`);
    for (const [, n, text] of notes) {
      const toRecord = cited(text).some((id) => ids.has(id));
      const toPaper = titles.some((t, i) => SLUGS[i] !== s && t && (text.includes(t) || text.includes(SLUGS[i])));
      assert.ok(toRecord || toPaper, `${s}: footnote ${n} cites a record or another paper: ${text.slice(0, 80)}`);
    }
  }
});

test('2. On the Directionality of Here has a §3 of that title; Six Feet to the Left agrees with QA-001 and sh-051 on every time and distance', () => {
  const dir = paper('directionality-of-here').body;
  assert.match(dir, /^#{2,4}\s+(§\s*)?3[.)]?\s+On the Directionality of Here\s*$/m, '§3 "On the Directionality of Here" (sh-030 cites it)');
  const six = paper('six-feet-to-the-left').body;
  const sh051 = tracker().find((i) => i.external_ref === 'sh-051')!;
  const src = `${readMust('company/notes/QA-001.md')}\n${sh051.description}`;
  const srcTimes = new Set([...src.matchAll(/\b(\d\d:\d\d)\b/g)].map((m) => m[1]));
  for (const t of ['09:00', '2026-10-02']) assert.ok(six.includes(t), `the paper states ${t}`);
  for (const m of six.matchAll(/\b(\d\d:\d\d)\b/g)) assert.ok(srcTimes.has(m[1]), `${m[1]} is not a time QA-001 or sh-051 records`);
  for (const m of six.matchAll(/\b(\w+(?:\.\d+)?)\s*(feet|foot|ft|metres?|meters?|m)\b/gi)) {
    assert.match(`${m[1]} ${m[2]}`, /^(six|6) (feet|foot|ft)$/i, `a distance that is not six feet: ${m[0]}`);
  }
});

test('3. after the build each site/research/<slug>.html carries every section heading of its source', async () => {
  for (const s of SLUGS) {
    const src = [...paper(s).body.matchAll(/^#{2,4}\s+(.+?)\s*$/gm)].map((m) => m[1].replace(/[*_`]/g, '').trim());
    const [shown] = await inDom<string[]>([siteText(`research/${s}.html`)], "return [...doc.querySelectorAll('h1,h2,h3,h4')].map(h => h.textContent.replace(/\\s+/g, ' ').trim());");
    for (const h of src) assert.ok(shown.includes(h), `${s}: "${h}"`);
  }
});
