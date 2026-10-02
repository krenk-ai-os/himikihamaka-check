// Построение QR-кода (матрица, SVG для печати, canvas для самопроверки)
// на основе встроенной библиотеки qrcode-generator.

import qrcode from '../vendor/qrcode-generator/qrcode.esm.js';

const ALNUM_RE = /^[0-9A-Z $%*+\-./:]*$/;
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Матрица QR-кода. ecl — уровень коррекции ошибок (M по умолчанию). */
export function makeQr(text, ecl = 'M') {
  const qr = qrcode(0, ecl);
  // Только ASCII-тексты: заглавные буквы и цифры кодируются компактнее (Alphanumeric).
  qr.addData(text, ALNUM_RE.test(text) ? 'Alphanumeric' : 'Byte');
  qr.make();
  const n = qr.getModuleCount();
  return { n, version: (n - 17) / 4, isDark: (r, c) => qr.isDark(r, c) };
}

/** Путь SVG: тёмные модули, склеенные в горизонтальные полоски. Координаты — в модулях. */
export function qrPathData(matrix, quiet) {
  let d = '';
  for (let r = 0; r < matrix.n; r++) {
    let c = 0;
    while (c < matrix.n) {
      if (!matrix.isDark(r, c)) {
        c++;
        continue;
      }
      let len = 1;
      while (c + len < matrix.n && matrix.isDark(r, c + len)) len++;
      d += `M${c + quiet} ${r + quiet}h${len}v1h-${len}z`;
      c += len;
    }
  }
  return d;
}

/**
 * SVG-элемент QR-кода заданного физического размера.
 * sideMm — сторона вместе с тихой зоной; quiet — тихая зона в модулях.
 */
export function qrSvg(matrix, sideMm, quiet) {
  const total = matrix.n + quiet * 2;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('viewBox', `0 0 ${total} ${total}`);
  svg.setAttribute('width', `${sideMm}mm`);
  svg.setAttribute('height', `${sideMm}mm`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('width', String(total));
  bg.setAttribute('height', String(total));
  bg.setAttribute('fill', '#fff');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', qrPathData(matrix, quiet));
  path.setAttribute('fill', '#000');
  svg.append(bg, path);
  return svg;
}

/** Рисует QR-код на canvas (для самопроверки декодера). */
export function qrCanvas(text, { modulePx = 8, quiet = 4, ecl = 'M' } = {}) {
  const m = makeQr(text, ecl);
  const size = (m.n + quiet * 2) * modulePx;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000';
  for (let r = 0; r < m.n; r++) {
    for (let c = 0; c < m.n; c++) {
      if (m.isDark(r, c)) ctx.fillRect((c + quiet) * modulePx, (r + quiet) * modulePx, modulePx, modulePx);
    }
  }
  return canvas;
}
