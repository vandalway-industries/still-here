// Registers the service worker (/sw.js) once the page has loaded, so it never competes with the
// page's own first load. From then on the site works offline (PRD R37). Every page includes this
// from the shell's footer. (Jules, 2026-10-05)
if ('serviceWorker' in navigator) {
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
