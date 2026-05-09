// 1. CHANGE LE NUMÉRO DE VERSION ICI (Passe à v3 pour forcer la mise à jour d'aujourd'hui)
const CACHE_NAME = 'fr-app-cache-v22'; 

const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap'
];
self.addEventListener('install', event => {
  // 2. FORCE L'INSTALLATION IMMÉDIATE
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 3. FORCE LA PRISE DE CONTRÔLE DE LA PAGE IMMÉDIATEMENT
      return self.clients.claim();
    })
  );
});
