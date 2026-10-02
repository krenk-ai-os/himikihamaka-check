// Web Worker (type: module): распознавание QR через zxing-cpp, собранный в WebAssembly (zxing-wasm).
// Файл .wasm загружается только из папки vendor этого сайта.

import {
  prepareZXingModule,
  readBarcodes,
  ZXING_WASM_VERSION,
  ZXING_CPP_COMMIT,
} from '../vendor/zxing-wasm/reader/index.js';
import { ZXING_OVERRIDES, ZXING_READER_OPTIONS } from './zxing-options.js';

let modulePromise = null;

function init() {
  if (!modulePromise) {
    modulePromise = prepareZXingModule({ overrides: ZXING_OVERRIDES, fireImmediately: true });
  }
  return modulePromise;
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  if (msg.type === 'init') {
    try {
      await init();
      self.postMessage({
        type: 'ready',
        id: msg.id,
        info: { library: 'zxing-wasm', version: ZXING_WASM_VERSION, zxingCpp: String(ZXING_CPP_COMMIT).slice(0, 7) },
      });
    } catch (err) {
      modulePromise = null;
      self.postMessage({ type: 'error', id: msg.id, error: String((err && err.message) || err) });
    }
    return;
  }

  if (msg.type === 'decode') {
    const t0 = performance.now();
    try {
      await init();
      const image = { data: new Uint8ClampedArray(msg.buffer), width: msg.width, height: msg.height };
      const found = await readBarcodes(image, ZXING_READER_OPTIONS);
      const hit = found.find((r) => r.isValid);
      self.postMessage({
        type: 'result',
        id: msg.id,
        text: hit ? hit.text : null,
        ms: performance.now() - t0,
      });
    } catch (err) {
      self.postMessage({
        type: 'result',
        id: msg.id,
        text: null,
        error: String((err && err.message) || err),
        ms: performance.now() - t0,
      });
    }
  }
};
