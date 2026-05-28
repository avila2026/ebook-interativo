// service-worker.js — Mounjaro sem Mitos (PWA)
// Estratégia: precache do app shell + cache-first para estáticos com fallback de rede.

const CACHE_VERSION = 'v9';
const CACHE_NAME = `mounjaro-sem-mitos-${CACHE_VERSION}`;

// Recursos essenciais para funcionamento offline (app shell).
// Imagens pesadas (molecule_structure.png) ficam fora do precache: são
// armazenadas sob demanda pela estratégia cache-first no primeiro acesso,
// mantendo a instalação do PWA leve e rápida.
const APP_SHELL = [
  './',
  './index.html',
  './login.html',
  './privacidade.html',
  './css/main.css',
  './css/components.css',
  './css/auth-gateway.css',
  './js/config.js',
  './js/data.js',
  './js/app.js',
  './js/integrations.js',
  './js/voice-agent.js',
  './js/vendor/chart.umd.min.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/images/mounjaro_box.jpg',
  './assets/images/mounjaro_device.jpg',
  './assets/images/mounjaro_hand.jpg',
  './assets/images/body_map.svg'
];

// Instalação: faz o precache do app shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Ativação: remove caches antigos de versões anteriores.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('mounjaro-sem-mitos-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: apenas GET de mesma origem são tratados.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Navegações (HTML): network-first com fallback ao app shell em cache (offline).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Demais estáticos: cache-first, atualizando o cache em segundo plano.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
