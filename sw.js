const CACHE_NAME = 'ishin-v24';
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
  '/Cup_down.png',
  '/Cup-top.png',
  '/cup-flower.png',
  '/你-head.png',
  '/政道-head.png',
  '/fish-head.png',
  '/winnie-head.png',
  '/蔡旻辰-head.png',
  '/小光頭-head.png',
  '/manifest.json'
];

// Install — cache all assets for offline use
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

// Fetch — NETWORK FIRST: always try server, fallback to cache if offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(response => {
      // Got fresh response from server — update cache
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      // Network failed — use cached version (offline mode)
      return caches.match(e.request);
    })
  );
});
