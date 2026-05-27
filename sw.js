// sw.js — Service Worker: Mounjaro sem Mitos
// Estratégia: Cache-First para assets estáticos, Network-First para fontes externas

const CACHE_NAME = 'mounjaro-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/components.css',
  './js/data.js',
  './js/app.js',
  './assets/images/mounjaro_box.jpg',
  './assets/images/mounjaro_device.jpg',
  './assets/images/mounjaro_hand.jpg',
  './assets/images/molecule_structure.png',
  './assets/images/copilot_3d.gif',
  './manifest.json'
];

// Instala e faz cache dos assets estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Remove caches de versões antigas na ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Fontes e CDN externos: Network-First (se falhar, tenta cache)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets locais: Cache-First (se não estiver em cache, busca na rede e armazena)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
