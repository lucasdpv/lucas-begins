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
          .filter((name) => 
            name !== CACHE_NAME && 
            name !== FONT_CACHE_NAME && 
            name !== 'lucas-begins-images-v1'
          )
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

  // 4. Estratégia para imagens do Firebase Storage: Cache-First com fallback de rede
  // Como as URLs do Firebase Storage têm tokens únicos por versão de arquivo, elas são imutáveis.
  // Salvamos em um cache persistente separado para que atualizações do app não obriguem a rebaixar as imagens.
  if (url.hostname === 'firebasestorage.googleapis.com') {
    event.respondWith(
      caches.open('lucas-begins-images-v1').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request).then((networkResponse) => {
            // Aceita respostas normais (200) e respostas opacas (0 - no-cors do img tag)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
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

  // 1. Estratégia Network-First para páginas HTML / Navegação
  // Evita tela branca após deploys: busca o index.html novo da rede primeiro, salvando no cache.
  // Se estiver offline, serve do cache.
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
              return cachedResponse || cache.match('/index.html') || cache.match('/');
            });
          });
        })
    );
    return;
  }

  // 2. Estratégia Cache-First para assets com hash (JS, CSS em /assets/)
  // Como o Vite usa hashes nos nomes dos arquivos compilados, eles são imutáveis.
  // Se o arquivo já está no cache, podemos servir diretamente sem bater na rede.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 3. Estratégia Stale-While-Revalidate para outros assets locais (imagens, favicon, manifest, etc.)
  // Retorna do cache imediatamente e atualiza em background.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso se falhar a rede (ex: offline)
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
