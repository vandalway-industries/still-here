// RC1 (still-here-7i1) — correspondence, chat, notes, calendar.
// garage/pack/ACCEPTANCE.md § RC1, items 1–5. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exists, files, frontMatter, read, words } from '../helpers/repo.ts';
import { cited, definedIds, headers } from '../helpers/records.ts';
import { records } from '../helpers/seeds.ts';

const STAFF = ['clive', 'diane', 'martin', 'jules', 'petra', 'susan', 'lucas', 'graham', 'len', 'adrian', 'bev', 'malcolm'];
const ADDRESS = new RegExp(`^(?:(?:${STAFF.join('|')})@vandalway\\.example|eileen\\.webb@municipal\\.example)$`);
const ISO_OFFSET = /^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?(Z|[+-]\d\d:\d\d)$/;
const markdown = () => records().filter((r) => /Markdown/.test(r.format) && !/^tracker/.test(r.path) && !/^research\//.test(r.path));

test('1. every Markdown record exists in full; mail carries From, To, Date (ISO 8601 with offset), Subject and Message-ID, with company and customer addresses', () => {
  const list = markdown();
  assert.ok(list.length >= 14, `${list.length} Markdown records listed`);
  for (const r of list) {
    const rel = `company/${r.path}`;
    assert.ok(exists(rel), `${r.id}: ${rel}`);
    const text = read(rel);
    assert.ok(words(frontMatter(text).body) >= 15, `${r.id}: written in full`);
    if (!/mail/i.test(r.format)) continue;
    const h = headers(text);
    for (const k of ['from', 'to', 'date', 'subject', 'message-id']) assert.ok(h[k], `${r.id}: ${k} header`);
    assert.match(h.date, ISO_OFFSET, `${r.id}: Date is ISO 8601 with its offset`);
    assert.match(h['message-id'], /^<[^@\s>]+@[^>\s]+>$/, `${r.id}: Message-ID`);
    const addrs = [h.from, ...h.to.split(/,\s*/), ...(h.cc ? h.cc.split(/,\s*/) : [])].map((a) => a.replace(/^.*<([^>]+)>$/, '$1').trim());
    for (const a of addrs) assert.match(a, ADDRESS, `${r.id}: ${a}`);
  }
});

test("2. CHAT-001: Len's fifteen messages, in order, verbatim, timestamped 2026-09-29 from 11:42", () => {
  const chat = read('company/chat/general-2026-09-29.md');
  const msgs = [...chat.matchAll(/^\*\*(\w+)\*\* · (\d\d:\d\d)\n\n(.+)$/gm)];
  const len = msgs.filter((m) => m[1] === 'len');
  assert.deepEqual(
    len.map((m) => m[3].trim()),
    ['h', 'hey', 'sorry', 'quick', 'thing', 'about', 'the', 'presence', 'numbers', 'are', 'we', 'counting', 'people', 'or', 'chairs?'],
  );
  assert.ok(len.every((m, i) => m[2] >= '11:42' && (i === 0 || m[2] >= len[i - 1][2])), 'from 11:42, in order');
  assert.match(chat, /2026-09-29/);
});

test('3. every In-Reply-To and every record id cited in any record resolves', () => {
  const { ids, messageIds } = definedIds();
  const missing: string[] = [];
  for (const f of files('company')) {
    const t = read(f);
    for (const id of cited(t)) if (!ids.has(id)) missing.push(`${f}: ${id}`);
    const h = /\.md$/.test(f) ? headers(t) : {};
    for (const k of ['in-reply-to', 'references']) for (const ref of (h[k] ?? '').match(/<[^>\s]+>/g) ?? []) if (!messageIds.has(ref)) missing.push(`${f}: ${k} ${ref}`);
  }
  assert.deepEqual(missing, []);
  const replies = files('company/correspondence').filter((f) => headers(read(f))['in-reply-to']);
  assert.ok(replies.length >= 3, 'the threads are threaded (In-Reply-To)');
});

test('4. every record\'s date falls within 2026-09-28 – 2026-10-02 unless the list gives another', () => {
  for (const r of markdown()) {
    const h = headers(read(`company/${r.path}`));
    const dates = [h.date, h.created, h.canceled].filter(Boolean).map((d) => String(d).slice(0, 10));
    assert.ok(dates.length > 0, `${r.id}: dated`);
    const listed = (r.when.match(/\d{4}-\d\d-\d\d/g) ?? []) as string[];
    const lo = listed[0] && listed[0] < '2026-09-28' ? listed[0] : '2026-09-28';
    const hi = listed[listed.length - 1] && listed[listed.length - 1] > '2026-10-02' ? listed[listed.length - 1] : '2026-10-02';
    for (const d of dates) assert.ok(d >= lo && d <= hi, `${r.id}: ${d}`);
  }
});

test('5. SUPPORT-001 carries the attachment header verbatim', () => {
  const h = headers(read('company/correspondence/SUPPORT-001.md'));
  assert.equal(h['x-attachment'], 'STILL-HERE-memorial-bench-00PHHEGCM3Y.pdf (certificate SH-00PH-HEGC-M3YK)');
});
