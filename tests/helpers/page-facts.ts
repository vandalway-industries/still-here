// Facts about one built page, through the browser's parser: headings, form controls, links,
// images, text. Shared by the page beads' unit tests (S6–S9). Locked at specs-v1.
// (Diane, 2026-10-04)
import { inDom, siteText } from './repo.ts';

export type PageFacts = {
  title: string;
  h1: string;
  headings: string[];
  controls: number;
  forms: { action: string | null }[];
  links: { href: string; text: string }[];
  imgs: { src: string; alt: string }[];
  text: string;
  blockquotes: { text: string; attribution: string }[];
};

export async function pageFacts(file: string): Promise<PageFacts> {
  const [f] = await inDom<PageFacts>(
    [siteText(file)],
    `const main = doc.querySelector('main') || doc.body;
     return {
       title: doc.title.trim(),
       h1: ((main.querySelector('h1') || {}).textContent || '').replace(/\\s+/g, ' ').trim(),
       headings: [...main.querySelectorAll('h1,h2,h3,h4')].map(h => h.textContent.replace(/\\s+/g, ' ').trim()),
       controls: doc.querySelectorAll('form, input, textarea, select').length,
       forms: [...doc.querySelectorAll('form')].map(f => ({ action: f.getAttribute('action') })),
       links: [...doc.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), text: a.textContent.replace(/\\s+/g, ' ').trim() })),
       imgs: [...main.querySelectorAll('img')].map(i => ({ src: (i.getAttribute('src') || '') + ' ' + (i.getAttribute('srcset') || ''), alt: i.getAttribute('alt') || '' })),
       text: main.textContent.replace(/\\s+/g, ' ').trim(),
       blockquotes: [...main.querySelectorAll('blockquote')].map(b => {
         const fig = b.closest('figure');
         const cap = fig ? fig.querySelector('figcaption') : null;
         const after = b.nextElementSibling;
         return { text: [...b.querySelectorAll('p')].map(p => p.textContent).join(' ').replace(/\\s+/g, ' ').trim() || b.textContent.replace(/\\s+/g, ' ').trim(),
                  attribution: ((cap || b.querySelector('cite, footer') || after || {}).textContent || '').replace(/\\s+/g, ' ').trim() };
       }),
     };`,
  );
  return f;
}

/** An image placed by its manifest id, the courthouse variants kept apart. */
export function placed(imgs: { src: string; alt: string }[], id: string): { src: string; alt: string }[] {
  const re = new RegExp(`(^|/)${id}(-[a-z][a-z-]*)?-\\d+\\.(webp|jpe?g|png)`);
  return imgs.filter((i) => re.test(i.src) && (id.includes('courthouse') || !/courthouse/.test(i.src)));
}
