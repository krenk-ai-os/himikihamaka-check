// Общие настройки zxing-wasm для Web Worker и для запуска в основном потоке.

export const ZXING_MODULE_URL = new URL('../vendor/zxing-wasm/reader/index.js', import.meta.url).href;
export const ZXING_WASM_URL = new URL('../vendor/zxing-wasm/reader/zxing_reader.wasm', import.meta.url).href;

// .wasm берётся только из папки vendor этого сайта, никогда из CDN.
export const ZXING_OVERRIDES = {
  locateFile: (path, prefix) => (path.endsWith('.wasm') ? ZXING_WASM_URL : prefix + path),
};

// Только QR, один код на кадр. Инверсия выключена: наклейки всегда тёмные на светлом.
// Поворот QR распознаётся и без tryRotate (эта опция нужна только линейным штрихкодам).
export const ZXING_READER_OPTIONS = {
  formats: ['QRCode'],
  tryHarder: true,
  tryRotate: false,
  tryInvert: false,
  tryDownscale: true,
  maxNumberOfSymbols: 1,
};
