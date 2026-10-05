// Registers the service worker (/sw.js) once the page has loaded, so it never competes with the
// page's own first load. From then on the site works offline (PRD R37). Every page includes this
// from the shell's footer. (Jules, 2026-10-05)
if ('serviceWorker' in navigator) {
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
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
