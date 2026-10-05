// STILL HERE, offline (PRD R37). After one visit the site keeps working with the network off: the
// ritual, both downloads, copying and reopening a certificate link, Verify by hand and the portfolio.
//
// On install it precaches every page, the 404 page, all styles, scripts and fonts, the export
// libraries, the icons and the home page's chair, under a cache named with the build id; on
// activate it deletes the caches of earlier builds. Pages are fetched from the network first and
// revalidated, so a visitor who loaded build N sees build N+1 on the next page they open; with no
// network, the cached page is served, and an address the site does not have gets the cached 404
// page with status 404. Everything else comes from the cache first; an image not precached is
// cached the first time it is shown, and one never shown has no copy, so offline it shows its
// description instead. When the browser reports that it has no network, the network is not tried.
// Only this origin's own GET requests are handled; /build.txt and /api/ always
// go to the network. Nothing is ever sent anywhere.
//
// The build (scripts/build.mjs) writes the two lines marked "set by the build". (Jules, 2026-10-05)
const BUILD = 'dev'; // set by the build
const PRECACHE = []; // set by the build
const PREFIX = 'still-here-';
const CACHE = `${PREFIX}${BUILD}`;
const NOT_FOUND = '/404.html';
const IMAGE = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // 'reload': fetched from the server, never from the browser's HTTP cache of an earlier build
      await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/build.txt' || url.pathname === '/sw.js' || url.pathname.startsWith('/api/')) return;
  event.respondWith(request.mode === 'navigate' ? page(url) : asset(request));
});

/** The cached copy of a page, by the forms its address can take. */
async function cachedPage(cache, path) {
  const forms = [path, path.endsWith('/') ? `${path}index.html` : `${path}/`, path.replace(/\.html$/, ''), path.replace(/index\.html$/, '')];
  for (const form of forms) {
    const hit = await cache.match(form, { ignoreSearch: true, ignoreVary: true });
    if (hit) return hit;
  }
  return null;
}

// When the browser reports no network, nothing is attempted: the cache answers at once
const offline = () => self.navigator.onLine === false;

async function page(url) {
  try {
    if (offline()) throw new TypeError('offline');
    // revalidated, never the HTTP cache's copy, so a new build is seen on the next page opened;
    // redirects are handed back to the browser to follow
    return await fetch(url.href, { cache: 'no-cache', credentials: 'same-origin', redirect: 'manual' });
  } catch {
    const cache = await caches.open(CACHE);
    const hit = await cachedPage(cache, url.pathname);
    if (hit) return hit;
    const missing = await cache.match(NOT_FOUND, { ignoreVary: true });
    if (!missing) return Response.error();
    return new Response(missing.body, { status: 404, statusText: 'Not Found', headers: missing.headers });
  }
}

async function asset(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  if (offline()) return Response.error();
  try {
    const response = await fetch(request);
    const url = new URL(request.url);
    if (response.ok && response.type === 'basic' && (request.destination === 'image' || IMAGE.test(url.pathname))) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}
