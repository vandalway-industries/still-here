// Registers the service worker (/sw.js) once the page has settled, so its first download (the
// offline copy, about 4 MB) never competes with the page or with a check in progress: three
// seconds after the load event, when the browser is idle, and not while the home page's check runs
// (it marks the page with data-checking). On a first visit Safari otherwise gave the copy's
// requests the network before the check's own code, and the result came seconds late. From then
// on the site works offline (PRD R37). Every page includes this from the shell's footer.
// (Jules, 2026-10-05; the wait, 2026-10-10)
if ('serviceWorker' in navigator) {
  const root = document.documentElement;
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  const whenNoCheck = () => {
    if (!root.hasAttribute('data-checking')) return void register();
    const watch = new MutationObserver(() => {
      if (root.hasAttribute('data-checking')) return;
      watch.disconnect();
      register();
    });
    watch.observe(root, { attributes: true, attributeFilter: ['data-checking'] });
  };
  const settle = () =>
    setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(whenNoCheck, { timeout: 5000 }) : whenNoCheck()), 3000);
  if (document.readyState === 'complete') settle();
  else window.addEventListener('load', settle, { once: true });
}

// A photograph that does not arrive (offline and never seen, or a failed request) shows its
// description in its place, in every browser. Some browsers paint a broken image's alt text only
// when it fits on one line, and otherwise paint an empty box, so we lay the description over the
// image's box ourselves. The image itself is left as it is: its box, its style and its accessible
// name are unchanged; the laid-over text is aria-hidden so nothing is read twice. Nothing is
// requested. (Jules, 2026-10-05)
const FRAME = 'img-frame';
const MISSING = 'img-missing';
const ALT = 'img-missing-alt';

const frameOf = (img) => (img.parentElement && img.parentElement.classList.contains(FRAME) ? img.parentElement : null);

const showDescription = (img) => {
  const alt = (img.getAttribute('alt') || '').trim();
  if (!alt || !img.parentNode) return;
  let frame = frameOf(img);
  if (!frame) {
    frame = document.createElement('span');
    frame.className = FRAME;
    img.parentNode.insertBefore(frame, img);
    frame.appendChild(img);
  }
  if (frame.classList.contains(MISSING)) return;
  const text = document.createElement('span');
  text.className = ALT;
  text.setAttribute('aria-hidden', 'true');
  text.textContent = img.getAttribute('alt');
  frame.appendChild(text);
  frame.classList.add(MISSING);
};

const hideDescription = (img) => {
  const frame = frameOf(img);
  if (!frame || !frame.classList.contains(MISSING)) return;
  frame.classList.remove(MISSING);
  for (const el of frame.querySelectorAll(`:scope > .${ALT}`)) el.remove();
};

document.addEventListener('error', (e) => {
  if (e.target instanceof HTMLImageElement) showDescription(e.target);
}, true);
document.addEventListener('load', (e) => {
  if (e.target instanceof HTMLImageElement && e.target.naturalWidth > 0) hideDescription(e.target);
}, true);
for (const img of Array.from(document.images)) {
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) showDescription(img);
}
