// Выбор и запуск декодера QR.
// Порядок: zxing-wasm в Web Worker → zxing-wasm в основном потоке → jsQR в Web Worker → jsQR в основном потоке.

import { ZXING_MODULE_URL, ZXING_OVERRIDES, ZXING_READER_OPTIONS } from './zxing-options.js';

const ZXING_WORKER_URL = new URL('./decoder-worker-zxing.js', import.meta.url);
const JSQR_WORKER_URL = new URL('./decoder-worker-jsqr.js', import.meta.url);
const JSQR_SCRIPT_URL = new URL('../vendor/jsqr/jsQR.js', import.meta.url).href;

const INIT_TIMEOUT_MS = 20000;
const DECODE_TIMEOUT_MS = 10000;

function describeError(err) {
  if (!err) return 'неизвестная ошибка';
  return String(err.message || err);
}

class WorkerDecoder {
  constructor({ id, label, url, type }) {
    this.id = id;
    this.label = label;
    this.url = url;
    this.type = type;
    this.worker = null;
    this.seq = 0;
    this.pending = new Map();
    this.info = null;
  }

  async init() {
    const t0 = performance.now();
    this.worker = new Worker(this.url, { type: this.type });
    this.worker.onmessage = (e) => this.handle(e.data || {});
    this.worker.onerror = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      this.failAll(new Error((e && e.message) || 'Web Worker не запустился'));
    };
    const reply = await this.request({ type: 'init' }, [], INIT_TIMEOUT_MS);
    this.info = { ...reply.info, initMs: performance.now() - t0, thread: 'Web Worker' };
    return this.info;
  }

  decode(imageData) {
    const buffer = imageData.data.buffer;
    return this.request(
      { type: 'decode', width: imageData.width, height: imageData.height, buffer },
      [buffer],
      DECODE_TIMEOUT_MS,
    );
  }

  request(message, transfer, timeoutMs) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('декодер не ответил вовремя'));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      try {
        this.worker.postMessage({ ...message, id }, transfer);
      } catch (err) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(err);
      }
    });
  }

  handle(data) {
    const entry = this.pending.get(data.id);
    if (!entry) return;
    this.pending.delete(data.id);
    clearTimeout(entry.timer);
    if (data.type === 'error') entry.reject(new Error(data.error));
    else entry.resolve(data);
  }

  failAll(err) {
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(err);
    }
    this.pending.clear();
  }

  terminate() {
    if (this.worker) this.worker.terminate();
    this.worker = null;
    this.failAll(new Error('декодер остановлен'));
  }
}

class MainThreadZxing {
  constructor() {
    this.id = 'zxing-main';
    this.label = 'zxing-wasm (WebAssembly), основной поток';
    this.lib = null;
    this.info = null;
  }

  async init() {
    const t0 = performance.now();
    this.lib = await import(ZXING_MODULE_URL);
    await this.lib.prepareZXingModule({ overrides: ZXING_OVERRIDES, fireImmediately: true });
    this.info = {
      library: 'zxing-wasm',
      version: this.lib.ZXING_WASM_VERSION,
      zxingCpp: String(this.lib.ZXING_CPP_COMMIT).slice(0, 7),
      initMs: performance.now() - t0,
      thread: 'основной поток',
    };
    return this.info;
  }

  async decode(imageData) {
    const t0 = performance.now();
    const found = await this.lib.readBarcodes(imageData, ZXING_READER_OPTIONS);
    const hit = found.find((r) => r.isValid);
    return { text: hit ? hit.text : null, ms: performance.now() - t0 };
  }

  terminate() {}
}

class MainThreadJsqr {
  constructor() {
    this.id = 'jsqr-main';
    this.label = 'jsQR, основной поток';
    this.info = null;
  }

  async init() {
    const t0 = performance.now();
    // UMD-сборка jsQR при загрузке кладёт функцию в self.jsQR.
    if (typeof self.jsQR !== 'function') await import(JSQR_SCRIPT_URL);
    if (typeof self.jsQR !== 'function') throw new Error('jsQR не загрузился');
    this.info = { library: 'jsQR', version: '1.4.0', initMs: performance.now() - t0, thread: 'основной поток' };
    return this.info;
  }

  async decode(imageData) {
    const t0 = performance.now();
    const code = self.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    return { text: code && code.data ? code.data : null, ms: performance.now() - t0 };
  }

  terminate() {}
}

const FACTORIES = {
  'zxing-worker': () =>
    new WorkerDecoder({ id: 'zxing-worker', label: 'zxing-wasm (WebAssembly) в Web Worker', url: ZXING_WORKER_URL, type: 'module' }),
  'zxing-main': () => new MainThreadZxing(),
  'jsqr-worker': () =>
    new WorkerDecoder({ id: 'jsqr-worker', label: 'jsQR в Web Worker', url: JSQR_WORKER_URL, type: 'classic' }),
  'jsqr-main': () => new MainThreadJsqr(),
};

const CHAINS = {
  auto: ['zxing-worker', 'zxing-main', 'jsqr-worker', 'jsqr-main'],
  jsqr: ['jsqr-worker', 'jsqr-main'],
};

/**
 * Запускает первый работающий декодер из цепочки.
 * mode: 'auto' (zxing-wasm с запасным jsQR) или 'jsqr' (только jsQR — для сравнения).
 */
export async function createDecoder(mode = 'auto', onLog = () => {}) {
  const failures = [];
  for (const id of CHAINS[mode] || CHAINS.auto) {
    const decoder = FACTORIES[id]();
    try {
      await decoder.init();
      decoder.failures = failures;
      onLog(`запущен: ${decoder.label} (${Math.round(decoder.info.initMs)} мс)`);
      return decoder;
    } catch (err) {
      failures.push({ id, error: describeError(err) });
      onLog(`не запустился ${decoder.label}: ${describeError(err)}`);
      decoder.terminate();
    }
  }
  const err = new Error('не удалось запустить ни один декодер');
  err.failures = failures;
  throw err;
}
