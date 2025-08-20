const CACHE_NAME = "foodeck-cache-v2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/offline.html"
];

// Install event → cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event → clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event → serve cached, then fallback to network
self.addEventListener("fetch", event => {
  const { request } = event;

  // Handle API requests (ingredients + recipes)
  if (request.url.includes("/api/")) {
    event.respondWith(
      caches.match(request).then(cachedRes => {
        if (cachedRes) return cachedRes;
        return fetch(request)
          .then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
    return;
  }

  // Handle images (ingredient/recipe images)
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(cachedRes => {
        if (cachedRes) return cachedRes;
        return fetch(request)
          .then(networkRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, networkRes.clone());
              return networkRes;
            });
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
    return;
  }

  // Default: static assets (JS, CSS, etc.)
  event.respondWith(
    caches.match(request).then(cachedRes => {
      return (
        cachedRes ||
        fetch(request).catch(() => caches.match("/offline.html"))
      );
    })
  );
});
