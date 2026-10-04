// RC6 (still-here-62x) — continuity and identifiers: the records check.
// garage/pack/ACCEPTANCE.md § RC6, items 1–7. It imports src/js/identifier.js, the module the
// site ships (E1 item 5). Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { files, frontMatter, importProduct, read, sentences, sh, siteFiles, siteText, TEXT_EXT } from '../helpers/repo.ts';
import { comments, fixture, headers, phraseHashes, tracker } from '../helpers/records.ts';

type Ident = {
  makeIdentifier: (name: string, time: Date) => Promise<string>;
  parseIdentifier: (text: string) => { time: Date } | null;
};
const SH = /SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=U]{4}/g;
/** Each record's text; the tracker's JSON lines read as the text they hold, one issue at a time. */
const companyText = () =>
  files('company', TEXT_EXT).flatMap((f) =>
    f.endsWith('.jsonl')
      ? read(f)
          .split('\n')
          .filter(Boolean)
          .map((l) => {
            const j = JSON.parse(l);
            return { f: `${f} (${j.external_ref})`, t: `${j.title}\n\n${j.description}\n\n${j.close_reason ?? ''}` };
          })
      : [{ f, t: read(f) }],
  );

test("1. every SH- identifier under company/ recomputes from its record's object name and time with src/js/identifier.js", async () => {
  const m = await importProduct<Ident>('src/js/identifier.js');
  const found: string[] = [];
  for (const { f, t } of companyText()) {
    for (const hit of new Set(t.match(SH) ?? [])) {
      found.push(hit);
      const p = m.parseIdentifier(hit);
      assert.ok(p, `${f}: ${hit} parses`);
      // names the record gives: object fields, quoted names, and names written as filename slugs
      const names = new Set<string>();
      for (const x of t.matchAll(/"object"\s*:\s*"([^"]+)"|Object:\s*([^\n.]+)/g)) names.add((x[1] ?? x[2]).trim());
      for (const x of t.matchAll(/[“"'`]([^”"'`\n]{2,80}?)[.,]?[”"'`]/g)) names.add(x[1]);
      for (const x of t.matchAll(/STILL-HERE-([a-z0-9-]+)-[0-9A-Z]{11}\.(pdf|png)/g)) names.add(x[1].replace(/-/g, ' '));
      let ok = false;
      for (const n of names) if ((await m.makeIdentifier(n, p!.time)) === hit) ok = true;
      assert.ok(ok, `${f}: ${hit} does not recompute from any name the record gives`);
      if (f.endsWith('.json')) {
        const j = JSON.parse(t);
        if (j.identifier === hit) assert.equal(new Date(j.issued_at).getTime(), p!.time.getTime(), `${f}: issued_at is the identifier's time`);
      }
    }
  }
  assert.ok(found.includes('SH-00PK-EEC2-0EPR'), "CERT-001's identifier");
  assert.ok(found.includes('SH-00PH-HEGC-M3YK'), "SUPPORT-001's identifier");
  assert.ok(new Set(found).size >= 2, 'a scan that finds fewer than two fails');
});

test('2. no record dated before 2026-01-01 carries an SH- identifier', () => {
  const pattern = /SH-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z*~$=]{4}/;
  for (const i of tracker()) {
    if (i.created_at < '2026-01-01') {
      const own = [i.title, i.description.split('### Comments')[0], ...comments(i).filter((c) => c.date < '2026-01-01').map((c) => c.text)].join('\n');
      assert.doesNotMatch(own, pattern, `${i.external_ref} (${i.created_at.slice(0, 10)})`);
    }
  }
  for (const { f, t } of companyText()) {
    const h = /\.md$/.test(f) ? headers(t) : {};
    const d = String(h.date ?? h.created ?? '');
    if (d && d < '2026-01-01') assert.doesNotMatch(t, pattern, `${f} (${d})`);
  }
});

test("3. every ownership share stated in company/ or site/ is the right one: Diane 51%, Vandalway 49%", () => {
  const texts = [...companyText().map((x) => x.t), ...siteFiles(/\.html$/).map((f) => siteText(f))];
  let stated = 0;
  for (const t of texts) {
    for (const s of sentences(t.replace(/<[^>]+>/g, ' '))) {
      // a share is a percentage tied to holding something: "holds 51%", "49% of STILL HERE", "a 49% stake"
      const shares = [
        ...s.matchAll(/\b(?:holds?|held|owns?|owned|represents|controls?|stake of|share of|ownership of)\s+(?:a\s+|the\s+|its\s+|\w+(?:'s)?\s+)?(\d{1,3})\s?(?:%|percent)/gi),
        ...s.matchAll(/\b(\d{1,3})\s?(?:%|percent)\s+(?:of\s+(?:STILL HERE|the company|the business|its shares|the shares)|stake|share(?:holding)?|ownership|owner|holding|interest)\b/gi),
      ].map((m) => m[1]);
      if (!shares.length) continue;
      stated++;
      for (const n of shares) assert.ok(n === '51' || n === '49', `a share of ${n}%: "${s.slice(0, 100)}"`);
      if (shares.includes('51')) assert.match(s, /Diane/, `51% is Diane's: "${s.slice(0, 100)}"`);
      if (shares.includes('49')) assert.match(s, /Vandalway|Malcolm/, `49% is Vandalway's: "${s.slice(0, 100)}"`);
    }
  }
  assert.ok(stated >= 2, 'the shares are stated somewhere');
});

test('4. no staff-authored record states where Lucas works now (unknown-to-staff hashes)', () => {
  const fx = fixture();
  const list = new Set(fx['unknown-to-staff']);
  assert.ok(list.size > 0);
  const hits: string[] = [];
  const all = [...companyText().map(({ f, t }) => ({ f, t })), ...siteFiles(/\.html$/).map((f) => ({ f: `site/${f}`, t: siteText(f).replace(/<[^>]+>/g, ' ') }))];
  for (const { f, t } of all) for (const h of phraseHashes(t, fx.salt)) if (list.has(h)) hits.push(f);
  assert.deepEqual([...new Set(hits)], [], 'files with a phrase on the unknown-to-staff list (the phrase is never printed)');
});

test('5. every message by adrian after 2022-12-16 is automated', () => {
  const late: string[] = [];
  for (const i of tracker()) for (const c of comments(i)) if (c.author === 'adrian' && c.date > '2022-12-16' && !/^(Automatic reply:|Calendar:)/.test(c.text)) late.push(`${i.external_ref} ${c.date}`);
  for (const { f, t } of companyText()) {
    if (!/\.md$/.test(f)) continue;
    const h = headers(t);
    if (/^adrian@/.test(h.from ?? '') && String(h.date ?? '').slice(0, 10) > '2022-12-16' && !/^(Automatic reply:|Calendar:)/.test(frontMatter(t).body.trim())) late.push(f);
    for (const m of t.matchAll(/^\*\*adrian\*\* · (\d{4}-\d\d-\d\d)?[^\n]*\n\n(?:> )?(.+)$/gm)) if ((!m[1] || m[1] > '2022-12-16') && !/^(Automatic reply:|Calendar:)/.test(m[2])) late.push(`${f}: ${m[1] ?? 'chat'}`);
  }
  assert.deepEqual(late, []);
});

test('6. .beads/ holds no issue labelled record; tracker.jsonl holds only record issues', () => {
  const beads: { id: string; labels?: string[] }[] = JSON.parse(sh('bd', ['--readonly', 'list', '--all', '--limit', '0', '--json']));
  assert.deepEqual(beads.filter((b) => (b.labels ?? []).includes('record')).map((b) => b.id), []);
  assert.ok(tracker().every((i) => i.labels.includes('record')));
});

test('7. no record shows Eileen Webb being asked for, or giving, permission for the case studies', () => {
  for (const { f, t } of companyText()) {
    // mail to or from her: nothing in it asks or answers about permission, consent or the case studies
    const h = /\.md$/.test(f) ? headers(t) : {};
    if (/eileen\.webb@/.test(`${h.from ?? ''} ${h.to ?? ''} ${h.cc ?? ''}`)) {
      assert.doesNotMatch(frontMatter(t).body, /\b(permission|consent|case stud(y|ies)|may we (name|feature|use)|ok(ay)? to (use|publish|name))\b/i, `${f}: Eileen is asked, or answers`);
    }
    // anywhere: no statement (a question is not one) that she agreed, consented or gave permission
    for (const s of sentences(t)) {
      if (/\?\s*$/.test(s)) continue;
      assert.doesNotMatch(s, /\b(Eileen(?: Webb)?|Ms\.? Webb|the customer|she)\s+(?:has\s+|had\s+)?(agreed|consented|approved|signed off|gave (?:her |us )?(?:permission|consent)|said yes)\b/i, `${f}: "${s.slice(0, 100)}"`);
    }
  }
});
