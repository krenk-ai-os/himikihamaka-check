// Service Worker: заранее кладёт все файлы приложения в кэш, чтобы установленное приложение
// открывалось без сети (в авиарежиме). Запросы к другим сайтам не обрабатываются и не делаются.

const VERSION = '1.0.0';
const CACHE_PREFIX = 'hh-check-';
const CACHE_NAME = `${CACHE_PREFIX}v${VERSION}`;

// Все файлы, нужные для работы без сети (пути — относительно этого файла).
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.webmanifest',
  './js/state.js',
  './js/device.js',
  './js/install.js',
  './js/camera.js',
  './js/decoder.js',
  './js/zxing-options.js',
  './js/decoder-worker-zxing.js',
  './js/decoder-worker-jsqr.js',
  './js/qr.js',
  './js/parse.js',
  './js/dictation.js',
  './js/storage.js',
  './js/labels.js',
  './js/summary.js',
  './vendor/zxing-wasm/reader/index.js',
  './vendor/zxing-wasm/reader/zxing_reader.wasm',
  './vendor/jsqr/jsQR.js',
  './vendor/qrcode-generator/qrcode.esm.js',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // cache: 'reload' — берём свежие файлы с сервера, а не из HTTP-кэша браузера.
      await cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      try {
        return await fetch(request);
      } catch (err) {
        if (request.mode === 'navigate') {
          const page = (await cache.match('./index.html')) || (await cache.match('./'));
          if (page) return page;
        }
        throw err;
      }
    })(),
  );
});

// Страница спрашивает состояние офлайн-кэша (раздел «Установка»).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  const port = event.ports && event.ports[0];
  if (data.type !== 'status' || !port) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      let cached = 0;
      for (const url of ASSETS) {
        if (await cache.match(new URL(url, self.location.href).href)) cached++;
      }
      port.postMessage({ version: VERSION, cacheName: CACHE_NAME, expected: ASSETS.length, cached, complete: cached === ASSETS.length });
    })(),
  );
});
