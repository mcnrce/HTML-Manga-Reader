const CACHE = 'manga-reader-v1';
const CORE = [
  '/hub.html',
  '/index.html',
  '/manifest.json'
];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip non-GET and cross-origin requests
  if (e.request.method !== 'GET') return;

  const url = e.request.url;

  // ── Intercept intent:// URLs and redirect to https:// fallback ──
  if (url.startsWith('intent://')) {
    const fallbackMatch = url.match(/S\.browser_fallback_url=([^;]+)/);
    if (fallbackMatch) {
      const fallback = decodeURIComponent(fallbackMatch[1]);
      e.respondWith(Response.redirect(fallback, 302));
      return;
    }
    // Reconstruct from intent parts
    const schemeMatch = url.split('#')[1]?.match(/\bscheme=(\w+)/);
    const scheme = schemeMatch ? schemeMatch[1] : 'https';
    const rest = url.replace(/^intent:\/\//, '').split('#')[0];
    e.respondWith(Response.redirect(scheme + '://' + rest, 302));
    return;
  }

  if (!url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for core files
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
