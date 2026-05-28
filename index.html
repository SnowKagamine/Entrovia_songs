// 安特羅迦 PWA Service Worker
// 策略:
//  - 靜態檔(index.html/manifest/icon)用 stale-while-revalidate
//  - GAS API 不快取(避免拿到舊資料)
//  - YT iframe 等第三方資源不攔截

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
      // 個別 try/catch:某個資源 404 不會炸整個快取
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

  // GAS / YouTube / 第三方:不攔截,直接走網路
  if (url.hostname.includes('script.google.com') ||
      url.hostname.includes('youtube.com') ||
      url.hostname.includes('ytimg.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('googleusercontent.com') ||
      url.hostname.includes('gstatic.com')) {
    return;
  }

  // 同源:stale-while-revalidate
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
