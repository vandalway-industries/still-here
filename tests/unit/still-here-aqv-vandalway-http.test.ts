// V4 (still-here-aqv) — HTTP-layer truth. garage/pack/ACCEPTANCE.md § V4, items 1–3. The served
// checks run against VANDALWAY_INTERNAL_URL (uncommitted) when it is set; the deploy script that
// sets the file times, the page's own dates and the mailto: are checked here always. Quirks mode in
// both engines is W7 (e2e/specs/still-here-aqv-walk.spec.ts) and DS6's spec.
// Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inDom, readMust } from '../helpers/repo.ts';

test('1. the install script dates index.html and every image but counter.gif 1997-08-22 and the guestbook 1999-03-02, matching the pages', async () => {
  const install = readMust('deploy/vandalwayind-install.sh');
  assert.match(install, /touch\b[^\n]*(-d|--date|-t)[^\n]*(1997-08-22|19970822)/, 'files set to 1997-08-22');
  assert.match(install, /touch\b[^\n]*(-d|--date|-t)[^\n]*(1999-03-02|19990302)[^\n]*guestbook|guestbook[^\n]*\n?[^\n]*touch\b[^\n]*(1999-03-02|19990302)/, 'the guestbook set to 1999-03-02');
  const [text] = await inDom<string>([readMust('vandalwayind/index.html')], "return doc.body.textContent.replace(/\\s+/g, ' ');");
  assert.match(text, /Last Updated August 22, 1997/);
  const [gb] = await inDom<string>([readMust('vandalwayind/cgi-bin/guestbook.html')], "return doc.body.textContent.replace(/\\s+/g, ' ');");
  assert.match(gb, /March 2, 1999/);
});

const URL_ = process.env.VANDALWAY_INTERNAL_URL?.replace(/\/$/, '');
test('1 (served). Last-Modified: 1997-08-22 for the page and its images, 1999-03-02 for the guestbook, the write time for counter.gif', { skip: URL_ ? false : 'VANDALWAY_INTERNAL_URL unset (uncommitted); served headers are checked when it is configured' }, async () => {
  const lm = async (p: string) => new Date((await fetch(URL_ + p, { method: 'HEAD' })).headers.get('last-modified') ?? 0);
  assert.equal((await lm('/')).toISOString().slice(0, 10), '1997-08-22');
  const html = await (await fetch(`${URL_}/`)).text();
  const [imgs] = await inDom<string[]>([html], "return [...doc.images].map(i => i.getAttribute('src'));");
  for (const src of imgs.filter((s) => !/counter/i.test(s))) assert.equal((await lm(`/${src.replace(/^\//, '')}`)).toISOString().slice(0, 10), '1997-08-22', src);
  assert.equal((await lm('/cgi-bin/guestbook.html')).toISOString().slice(0, 10), '1999-03-02');
  assert.ok(Date.now() - (await lm('/counter.gif')).getTime() < 11 * 60_000, 'counter.gif: the time it was last written (within one timer period)');
});

test('2. the served page renders in quirks mode in Chromium and WebKit (W7 step 1, the walk spec)', () => {
  const walk = readMust('e2e/specs/still-here-aqv-walk.spec.ts');
  assert.match(walk, /W7_1/);
  assert.match(readMust('e2e/helpers/walks.ts'), /compatMode[\s\S]{0,80}BackCompat/);
});

test('3. the mailto: address is webmaster@vandalwayind.com', async () => {
  const [hrefs] = await inDom<string[]>([readMust('vandalwayind/index.html')], "return [...doc.querySelectorAll('a[href^=\"mailto:\" i]')].map(a => a.getAttribute('href'));");
  // every e-mail link on the page goes to the one address (the golden shows two: the menu's and the address line's; specs-v6)
  assert.ok(hrefs.length >= 1, 'at least one mailto: link');
  for (const h of hrefs) assert.equal(h, 'mailto:webmaster@vandalwayind.com');
});
