const CACHE_NAME = 'lucas-begins-v2';
const FONT_CACHE_NAME = 'lucas-begins-fonts-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// Instalação: Cacheia arquivos da própria origem (same-origin)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== FONT_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Estratégia para fontes do Google: Cache First com fallback para rede
  // Fontes são imutáveis (URL muda quando o arquivo muda), então cache agressivo é seguro
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request, { mode: 'cors' }).then((networkResponse) => {
            // Fontes do gstatic são opacas (mode: no-cors), mas o CSS é cors
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Ignora requisições de outros domínios (ex: Firebase, APIs externas)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Estratégia para assets da própria origem: Stale-While-Revalidate
  // Retorna do cache imediatamente e atualiza em background
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Offline: retorna o cache se existir
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
