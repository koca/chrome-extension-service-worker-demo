const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

// No need to cache local resources since this is a chrome-extension
const PRECACHE_URLS = [
  // 'index.html',
  // './', // Alias for index.html
  // 'styles.css',
  // 'demo.js'
  // "https://images.unsplash.com/photo-1534113578008-2092a17e5277?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3a68088bab23c9bf0194becf75de0abe&auto=format&fit=crop&w=800&q=60"
  "https://unpkg.com/tailwindcss/dist/tailwind.css"
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener("fetch", event => {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  ) {
    return;
  }
  // skip requests from other chrome extensions
  if (event.request.url.indexOf("chrome-extension") === -1) {
    // Todo: Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.indexOf("unsplash")) {
      console.log("UNSPLASH");
    }
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  } else {
    // not caching
    return fetch(event.request).then(response => response);
  }
});
