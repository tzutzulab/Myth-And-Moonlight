/**
 * Service Worker (sw.js)
 */

const CACHE_NAME = 'glimmer-tales-v2'; // 更新版本號以強制更新快取

// 需要快取的靜態資源清單 - 統一使用 index.html
const ASSETS = [
  './index.html',
  './枕邊故事.html',
  './符文大地故事館.html',
  './manifest_hub.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 正在快取專案資源...');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] 清理舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});