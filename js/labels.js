// Раздел «Печать наклеек» (используется на Mac): пробные наклейки с QR для термопринтера 203 dpi.
// Каждая наклейка — отдельная печатная страница точного размера (@page).

import { $, $$, el, fmt, store } from './state.js';
import { makeQr, qrSvg } from './qr.js';

const DOT_MM = 25.4 / 203; // одна точка термопринтера 203 dpi ≈ 0,125 мм
const QUIET = 2; // тихая зона, модулей

// numMaxMm 9,8 мм — высота заглавных букв и цифр около 7 мм.
const SIZES = {
  '58x40': { w: 58, h: 40, moduleDots: 8, maxQrMm: 30, marginDots: 16, gapMm: 1.5, rightMm: 1.5, numMaxMm: 9.8, caption: 'Пробная наклейка' },
  '30x20': { w: 30, h: 20, moduleDots: 5, maxQrMm: 16.5, marginDots: 8, gapMm: 1, rightMm: 1, numMaxMm: 8, caption: null },
};

const LOOKALIKE = { А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', Х: 'X', У: 'Y' };

const mm = (v) => `${Number(v.toFixed(4))}mm`;

/** Геометрия наклейки: размер модуля QR — целое число точек принтера. */
export function labelGeometry(sizeKey, modules) {
  const s = SIZES[sizeKey] || SIZES['58x40'];
  const total = modules + QUIET * 2;
  let dots = s.moduleDots;
  while (dots > 1 && total * dots * DOT_MM > s.maxQrMm) dots--;
  const qrDots = total * dots;
  const qrMm = qrDots * DOT_MM;
  const leftMm = s.marginDots * DOT_MM;
  const topMm = Math.round((s.h / DOT_MM - qrDots) / 2) * DOT_MM;
  const textLeftMm = leftMm + qrMm + s.gapMm;
  const textWidthMm = s.w - textLeftMm - s.rightMm;
  return { ...s, key: sizeKey, dots, moduleMm: dots * DOT_MM, qrMm, leftMm, topMm, textLeftMm, textWidthMm };
}

/** «T0001» → {prefix: 'T', start: 1, width: 4}. Кириллические «Т», «Н» и т. п. заменяются латинскими. */
export function parseStart(text) {
  const s = String(text || '')
    .trim()
    .toUpperCase()
    .replace(/[АВЕКМНОРСТХУ]/g, (c) => LOOKALIKE[c]);
  const m = s.match(/^([A-Z]{0,3})-?(\d{1,6})$/);
  if (!m) return null;
  return { prefix: m[1], start: Number(m[2]), width: Math.max(4, m[2].length) };
}

export function initLabels() {
  const saved = store.get('print', {});
  if (saved.size && SIZES[saved.size]) {
    const radio = $(`input[name="label-size"][value="${saved.size}"]`);
    if (radio) radio.checked = true;
  }
  if (saved.count) $('#pr-count').value = String(saved.count);
  if (saved.start) $('#pr-start').value = saved.start;

  for (const r of $$('input[name="label-size"]')) r.addEventListener('change', renderLabels);
  $('#pr-count').addEventListener('change', renderLabels);
  $('#pr-start').addEventListener('change', renderLabels);
  $('#pr-render').addEventListener('click', renderLabels);
  $('#pr-print').addEventListener('click', () => {
    renderLabels();
    window.print();
  });
  window.addEventListener('beforeprint', () => {
    if (!$('#labels').children.length) renderLabels();
  });
}

function readForm() {
  const sizeInput = $('input[name="label-size"]:checked');
  const size = sizeInput && SIZES[sizeInput.value] ? sizeInput.value : '58x40';
  let count = parseInt($('#pr-count').value, 10);
  if (!Number.isFinite(count) || count < 1) count = 20;
  count = Math.min(count, 200);
  $('#pr-count').value = String(count);
  return { size, count, startText: $('#pr-start').value };
}

function setPageSize(g) {
  let style = document.getElementById('page-size-style');
  if (!style) {
    style = el('style', { id: 'page-size-style' });
    document.head.append(style);
  }
  style.textContent = `@page { size: ${g.w}mm ${g.h}mm; margin: 0; }`;
}

export function renderLabels() {
  const { size, count, startText } = readForm();
  const start = parseStart(startText);
  const err = $('#pr-error');
  if (!start) {
    err.hidden = false;
    err.textContent = 'Начальный номер должен быть вида T0001 (буква и цифры).';
    return;
  }
  err.hidden = true;
  store.set('print', { size, count, start: startText.trim() });

  const container = $('#labels');
  const nodes = [];
  let g = null;
  let version = 0;
  for (let i = 0; i < count; i++) {
    const text = start.prefix + String(start.start + i).padStart(start.width, '0');
    const matrix = makeQr(text, 'M');
    g = labelGeometry(size, matrix.n);
    version = Math.max(version, matrix.version);
    const svg = qrSvg(matrix, g.qrMm, QUIET);
    svg.setAttribute('class', 'label-qr');
    svg.style.left = mm(g.leftMm);
    svg.style.top = mm(g.topMm);
    const textBox = el(
      'div',
      { class: 'label-text' },
      el('div', { class: 'label-num', text }),
      g.caption ? el('div', { class: 'label-cap', text: g.caption }) : null,
    );
    textBox.style.left = mm(g.textLeftMm);
    textBox.style.width = mm(g.textWidthMm);
    const label = el('div', { class: `label label-${size}`, 'data-text': text }, svg, textBox);
    label.style.width = mm(g.w);
    label.style.height = mm(g.h);
    nodes.push(label);
  }
  container.replaceChildren(...nodes);
  container.dataset.size = size;
  setPageSize(g);
  fitNumbers(container, g);

  $('#pr-info').textContent =
    `Наклеек: ${count} · размер ${g.w}×${g.h} мм · QR ${fmt.num(g.qrMm, 2)} мм ` +
    `(версия ${version}, коррекция M, тихая зона ${QUIET} модуля) · модуль ${g.dots} точек = ${fmt.num(g.moduleMm, 3)} мм при 203 dpi.`;
}

// Номер — максимально крупный, но в пределах ширины текстовой зоны.
function fitNumbers(container, g) {
  const nums = $$('.label-num', container);
  if (!nums.length) return;
  const probe = nums[0];
  probe.style.fontSize = mm(g.numMaxMm);
  const pxPerMm = 96 / 25.4;
  const widthPx = probe.scrollWidth;
  let fontMm = g.numMaxMm;
  if (widthPx > 0) {
    const available = g.textWidthMm * pxPerMm;
    if (widthPx > available) fontMm = (g.numMaxMm * available) / widthPx;
  } else {
    // раздел скрыт — оценка по ширине цифр Helvetica (~0,58 em)
    fontMm = Math.min(g.numMaxMm, g.textWidthMm / (probe.textContent.length * 0.6));
  }
  fontMm = Math.floor(fontMm * 0.97 * 10) / 10;
  for (const n of nums) n.style.fontSize = mm(fontMm);
}
