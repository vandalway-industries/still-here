// V1 (still-here-bdd) — the 1997 page, finished. garage/pack/ACCEPTANCE.md § V1, items 1–3;
// item 4 is the critic's blind pick after C2. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUESTBOOK_TITLE } from '../../e2e/helpers/strings.ts';
import { inDom, read, readMust, sentences } from '../helpers/repo.ts';
import { checkMarkup } from '../helpers/vandalway.ts';

test("1. DS6's checks all pass on the finished page, with C2's red-pen applied", async () => {
  await checkMarkup();
  const record = read('garage/pack/CHECKPOINTS.md').split('## Record')[1] ?? '';
  assert.match(record, /\*\*C2\b/, "C2 is recorded in CHECKPOINTS.md (its red-pen, if any, listed there, is applied)");
});

test('2. the guestbook page: a period page titled "Guestbook temporarily unavailable", dated March 2, 1999', async () => {
  const html = readMust('vandalwayind/cgi-bin/guestbook.html');
  assert.match(html.split(/\r?\n/)[0], /^<!DOCTYPE HTML PUBLIC "-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/EN">$/);
  const [r] = await inDom<{ title: string; text: string }>([html], "return { title: doc.title.trim(), text: doc.body.textContent.replace(/\\s+/g, ' ') };");
  assert.equal(r.title, GUESTBOOK_TITLE);
  assert.match(r.text, /March 2, 1999/);
});

test('3. the relocation line is present, and the only sentence about the move', async () => {
  const [text] = await inDom<string>([readMust('vandalwayind/index.html')], "return doc.body.textContent.replace(/\\s+/g, ' ');");
  const moves = sentences(text).filter((s) => /\b(moved|moving|move|relocat\w*|new (home|address)|bookmarks?)\b/i.test(s));
  assert.ok(moves.length >= 1, 'the relocation line');
  const about = moves.filter((s) => /\b(moved|moving|move|relocat\w*|new (home|address))\b/i.test(s));
  assert.equal(about.length, 1, `one sentence about the move: ${about.join(' | ')}`);
});

test('4. (after C2) critic blind pick against vandalway-1997-golden.png', { skip: "HUMAN-JUDGED after C2: the critic's blind pick" }, () => {});
