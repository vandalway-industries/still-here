// S3 (still-here-3yo) — research, with the papers written.
// garage/pack/ACCEPTANCE.md § S3, items 1–4. Run: node --test tests/unit/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RESEARCH_ENTERPRISE } from '../../e2e/helpers/strings.ts';
import { buildWithReadLog, frontMatter, inDom, readMust, siteText, words } from '../helpers/repo.ts';

const ABSTRACT =
  "Here remains the company's strongest position. There possesses an apparent advantage in destinations but insufficient evidence of local presence. Somewhere benefits from ambiguity and a concerning lack of oversight. WHERE-r-YOU demonstrates strong technological alignment with STILL HERE; interviews were conducted with the same developer twice to broaden the evidence base.";
const PAPERS = [
  { slug: 'competitive-landscape', title: 'Competitive Landscape: Here, There, and Emerging Elsewhere', date: '2026-10-01', long: true },
  { slug: 'directionality-of-here', title: 'On the Directionality of Here', date: '2026-09-14', long: false },
  { slug: 'six-feet-to-the-left', title: 'Six Feet to the Left: A Note on Displacement Within Here', date: '2026-10-02', long: false },
];

const headings = (md: string) => [...md.matchAll(/^#{2,4}\s+(.+?)\s*$/gm)].map((m) => m[1].replace(/[*_`]/g, '').trim());

test('1. three papers as Markdown with front matter; RESEARCH-001\'s abstract verbatim and 86 pages of contents; short papers 900–2,000 words with numbered sections and footnotes', () => {
  for (const p of PAPERS) {
    const { data, body } = frontMatter(readMust(`company/research/${p.slug}.md`));
    for (const k of ['title', 'author', 'date', 'pages', 'abstract']) assert.ok(data[k] !== undefined && data[k] !== '', `${p.slug}: front matter ${k}`);
    assert.equal(data.title, p.title, `${p.slug}: title`);
    assert.equal(String(data.date).slice(0, 10), p.date, `${p.slug}: date`);
    if (p.long) {
      assert.equal(String(data.abstract).trim(), ABSTRACT, 'RESEARCH-001\'s abstract, verbatim');
      assert.equal(Number(data.pages), 86);
      const contents = body.split(/^#{2,3}\s+Contents\s*$/m)[1];
      assert.ok(contents, 'a Contents section');
      const lines = contents.split(/^#{1,3}\s/m)[0].split('\n').filter((l) => /^\s*(?:[-*]|\d+\.)\s/.test(l));
      const counts = lines.map((l) => Number((/(\d+)\s*(?:pp?\.|pages?)?\s*$/.exec(l) ?? [])[1] ?? NaN));
      assert.ok(lines.length >= 3 && counts.every((n) => Number.isFinite(n)), 'each contents entry ends in its page count');
      assert.equal(counts.reduce((a, b) => a + b, 0), 86, 'the contents sum to 86 pages');
    } else {
      const n = words(body);
      assert.ok(n >= 900 && n <= 2000, `${p.slug}: ${n} words (900–2,000)`);
      assert.ok(Number(data.pages) >= 2 && Number(data.pages) <= 4, `${p.slug}: 2–4 pages`);
      const numbered = headings(body).filter((h) => /^(§\s*)?\d+[.)]?\s/.test(h));
      assert.ok(numbered.length >= 3, `${p.slug}: numbered sections`);
      const refs = new Set([...body.matchAll(/\[\^([^\]]+)\](?!:)/g)].map((m) => m[1]));
      const defs = new Set([...body.matchAll(/^\[\^([^\]]+)\]:/gm)].map((m) => m[1]));
      assert.ok(refs.size >= 2, `${p.slug}: footnotes`);
      for (const r of refs) assert.ok(defs.has(r), `${p.slug}: footnote ${r} is defined`);
    }
  }
});

test('2. /research/ lists exactly three papers by Dr. Petra Voss with title, author, date, abstract and a cover drawn in code; the long paper\'s page carries the Enterprise line', async () => {
  const [r] = await inDom<{ links: string[]; text: string; svgs: number; photos: number }>(
    [siteText('research/index.html')],
    `const main = doc.querySelector('main') || doc.body;
     return {
       links: [...new Set([...main.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /^\\/research\\/./.test(h)))],
       text: main.textContent.replace(/\\s+/g, ' '),
       svgs: main.querySelectorAll('svg').length,
       photos: [...main.querySelectorAll('img')].filter(i => /\\.(png|jpe?g|webp)/.test(i.getAttribute('src') || '') && !/s02/.test(i.getAttribute('src') || '')).length,
     };`,
  );
  assert.deepEqual(r.links.sort(), PAPERS.map((p) => `/research/${p.slug}`).sort(), 'exactly the three papers');
  assert.equal((r.text.match(/Dr\. Petra Voss/g) ?? []).length >= 3, true, 'each by Dr. Petra Voss');
  // each paper's own entry on the listing (the element around its link) carries its title, its
  // author, its date and its whole abstract
  const entries = await inDom<string[]>(
    [siteText('research/index.html')],
    `return arg.map(slug => {
       const a = (doc.querySelector('main') || doc.body).querySelector('a[href="/research/' + slug + '"]');
       const e = a && a.closest('article, li, section');
       return e ? e.textContent.replace(/\\s+/g, ' ') : '';
     });`,
    PAPERS.map((p) => p.slug),
  ).then((r) => r[0] as unknown as string[]);
  const norm = (x: string) => x.replace(/\s+/g, ' ').trim();
  for (const [i, p] of PAPERS.entries()) {
    const e = entries[i];
    assert.ok(e, `${p.slug}: its own entry on the listing`);
    assert.ok(e.includes(p.title), `${p.slug}: title`);
    assert.ok(e.includes('Dr. Petra Voss'), `${p.slug}: author`);
    const words = new Date(`${p.date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    assert.ok(e.includes(p.date) || e.includes(words), `${p.slug}: its date (${p.date} or ${words})`);
    const abs = norm(String(frontMatter(readMust(`company/research/${p.slug}.md`)).data.abstract ?? ''));
    assert.ok(abs && norm(e).includes(abs), `${p.slug}: its whole abstract`);
  }
  assert.ok(r.svgs >= 3, 'a cover drawn in code for each');
  assert.equal(r.photos, 0, 'covers are drawn, not photographed');
  assert.ok(siteText('research/competitive-landscape.html').includes(RESEARCH_ENTERPRISE));
});

test("3. each paper's page renders every section of its source", async () => {
  for (const p of PAPERS) {
    const src = headings(frontMatter(readMust(`company/research/${p.slug}.md`)).body);
    assert.ok(src.length > 0, `${p.slug} has sections`);
    const [shown] = await inDom<string[]>([siteText(`research/${p.slug}.html`)], "return [...doc.querySelectorAll('h1,h2,h3,h4')].map(h => h.textContent.replace(/\\s+/g, ' ').trim());");
    for (const h of src) assert.ok(shown.includes(h), `${p.slug}: section "${h}" on the page`);
  }
});

test('4. the build reads company/research/ and company/status/status-updates.xml and nothing else under company/', () => {
  const { reads } = buildWithReadLog();
  const company = reads.filter((r) => r === 'company' || r.startsWith('company/'));
  const other = company.filter((r) => !r.startsWith('company/research/') && r !== 'company/research' && r !== 'company/status/status-updates.xml');
  assert.deepEqual(other, [], 'paths the build read under company/');
  assert.ok(company.some((r) => r.startsWith('company/research')), 'the build reads the papers');
  assert.ok(company.includes('company/status/status-updates.xml'), 'the build reads the status updates');
});
