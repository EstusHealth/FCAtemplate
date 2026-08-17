/* Service worker for the FCA Builder.

   Why this exists: opened from disk the builder needs no network, and hosting it
   must not take that away. An FCA is written in a family's living room, where
   reception is whatever it is — so the app has to survive losing the network
   mid-assessment. Everything here is same-origin only; the worker never talks to
   a third party, and it never touches a draft (drafts live in localStorage and
   are not cached, fetched or transmitted).

   Strategy:
     · navigations  → network first, fall back to the cached shell, so a deploy
                      lands on the next reload but a dead connection still opens
     · everything   → cache first, then network, because fonts and icons are
       else           immutable and the point is to work offline
*/
const VERSION = 'fca-v1';
const SHELL = ['./', './index.html', './fonts.css', './manifest.webmanifest',
               './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    /* addAll is all-or-nothing; add individually so one 404 cannot fail the install */
    await Promise.all(SHELL.map(u => cache.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(VERSION);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === 'basic') {
        const cache = await caches.open(VERSION);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      return Response.error();
    }
  })());
});
