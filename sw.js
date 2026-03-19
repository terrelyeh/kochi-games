const CACHE_NAME = 'ishin-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/bekuhai.html',
  '/kikuhai.html',
  '/hashiken.html',
  '/bgm-kenshinso.mp3',
  '/cup-tengu-clear.png',
  '/cup-hyottoko-clear.png',
  '/cup-okame-clear.png',
  '/cup-tengu-splash.png',
  '/koma-1.png',
  '/koma-2.png',
  '/koma-3.png',
  '/manifest.json'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, then network
self.addEventListener('fetch', e => {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // For Google Fonts, use network first (they have their own caching)
  if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // For app assets: cache first, fallback to network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache new assets dynamically
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
