// X3 (still-here-wha) — the 404 on every server. garage/pack/ACCEPTANCE.md § X3, items 1–2, on
// the local Pages server and, when STAGING_URL is set, on staging. The 404 answered is the site's
// own 404 page (PRD R24 lists it among the pages): the sentence, Return home, and the shell.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOT_FOUND, RETURN_HOME } from '../../e2e/helpers/strings.ts';
import { inDom, servedSite } from '../helpers/repo.ts';

async function notFound(origin: string): Promise<void> {
  const r = await fetch(`${origin}/no-such-page`, { redirect: 'manual' });
  assert.equal(r.status, 404);
  const [f] = await inDom<{ text: string; home: boolean; header: boolean; footer: boolean; menu: number }>(
    [await r.text()],
    `return { text: doc.body.textContent.replace(/\\s+/g, ' '),
       home: [...doc.querySelectorAll('a')].some(a => a.textContent.trim() === ${JSON.stringify(RETURN_HOME)} && a.getAttribute('href') === '/'),
       header: !!doc.querySelector('header a[href="/"]'), footer: !!doc.querySelector('footer'),
       menu: [...doc.querySelectorAll('nav a')].length };`,
  );
  assert.ok(f.text.includes(NOT_FOUND), 'the 404 sentence');
  assert.ok(f.home, 'a Return home link to /');
  assert.ok(f.header && f.footer && f.menu >= 8, 'the 404 is the site\'s own page: header, menu, footer');
  const home = await fetch(`${origin}/`);
  assert.equal(home.status, 200, 'Return home works');
  for (const p of ['/company/tracker/TRACKER.md', '/README.md']) assert.equal((await fetch(origin + p, { redirect: 'manual' })).status, 404, `${p} answers 404`);
}

test('1–2. the local Pages server: /no-such-page 404 with the page; the records and the README 404', async () => {
  await notFound((await servedSite()).url);
});

test('1–2. staging', { skip: process.env.STAGING_URL ? false : 'STAGING_URL unset: staging is checked when it is configured' }, async () => {
  await notFound(process.env.STAGING_URL!.replace(/\/$/, ''));
});
