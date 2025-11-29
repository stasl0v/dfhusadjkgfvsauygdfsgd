// Cache name
const CACHE_NAME = "mojaapp-v2";

// Install – nic nie cacheujemy na sztywno
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate – czyścimy stare cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch – cache first, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(response => {
          // zapisujemy odpowiedź w cache
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cloned);
          });
          return response;
        })
      );
    })
  );
});
