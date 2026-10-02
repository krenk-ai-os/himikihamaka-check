// Web Worker (классический): запасной декодер jsQR на чистом JavaScript.
// Используется, только если декодер zxing-wasm не смог запуститься.

/* global jsQR */
importScripts('../vendor/jsqr/jsQR.js');

self.onmessage = (event) => {
  const msg = event.data || {};
  if (msg.type === 'init') {
    if (typeof self.jsQR === 'function') {
      self.postMessage({ type: 'ready', id: msg.id, ms: 0, info: { library: 'jsQR', version: '1.4.0' } });
    } else {
      self.postMessage({ type: 'error', id: msg.id, error: 'jsQR не загрузился' });
    }
    return;
  }
  if (msg.type === 'decode') {
    const t0 = performance.now();
    try {
      const code = jsQR(new Uint8ClampedArray(msg.buffer), msg.width, msg.height, { inversionAttempts: 'dontInvert' });
      self.postMessage({
        type: 'result',
        id: msg.id,
        text: code && code.data ? code.data : null,
        position: code ? code.location : null,
        ms: performance.now() - t0,
      });
    } catch (err) {
      self.postMessage({ type: 'result', id: msg.id, text: null, error: String((err && err.message) || err), ms: performance.now() - t0 });
    }
  }
};
