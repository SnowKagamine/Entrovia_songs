// Antrovia PWA Service Worker
// Cache strategy:
//   - Static assets: stale-while-revalidate
//   - GAS API: no cache (always fresh data)
//   - YouTube and 3rd party: bypass (no intercept)

const CACHE_NAME = 'antrovia-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './bg.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each asset individually so one 404 doesn't break the whole install
      return Promise.all(STATIC_ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('SW skip cache:', url, err))
      ));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Bypass GAS / YouTube / third party hosts
  if (url.hostname.includes('script.google.com') ||
      url.hostname.includes('youtube.com') ||
      url.hostname.includes('ytimg.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('googleusercontent.com') ||
      url.hostname.includes('gstatic.com')) {
    return;
  }

  // Same origin: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          const fetchPromise = fetch(req).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              cache.put(req, networkRes.clone()).catch(() => {});
            }
            return networkRes;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
  }
});
