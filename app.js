// HimikiHamaka · проверка этапа 0 — точка входа.
// Разделы переключаются только показом/скрытием блоков: адрес страницы (location, hash, history)
// не меняется никогда, иначе iOS заново спрашивает разрешение на камеру.

import { store, resetResults, $, $$, toast, APP_VERSION, APP_BUILD } from './js/state.js';
import { renderDevice, isStandalone } from './js/device.js';
import { initInstall, renderMode, refreshSwStatus } from './js/install.js';
import { initCamera, setCameraSectionVisible } from './js/camera.js';
import { initDictation } from './js/dictation.js';
import { initStorage, refreshStorage } from './js/storage.js';
import { initLabels, renderLabels } from './js/labels.js';
import { initSummary, renderSummary } from './js/summary.js';

const SECTIONS = ['device', 'install', 'camera', 'dictation', 'storage', 'print', 'summary'];

function showSection(name, { scroll = true } = {}) {
  const target = SECTIONS.includes(name) ? name : 'device';
  for (const s of SECTIONS) document.getElementById(`sec-${s}`).hidden = s !== target;
  for (const b of $$('.nav-btn')) {
    const active = b.dataset.section === target;
    b.classList.toggle('active', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  }
  store.set('section', target);
  setCameraSectionVisible(target === 'camera');
  if (target === 'device') renderDevice();
  if (target === 'install') {
    renderMode();
    refreshSwStatus();
  }
  if (target === 'storage') refreshStorage();
  if (target === 'print') renderLabels();
  if (target === 'summary') renderSummary();
  if (scroll) window.scrollTo(0, 0);
}

function renderHeaderChips() {
  const net = $('#chip-net');
  net.textContent = navigator.onLine ? 'онлайн' : 'офлайн';
  net.className = `chip ${navigator.onLine ? '' : 'warn'}`.trim();
  const mode = $('#chip-mode');
  mode.textContent = isStandalone() ? 'приложение' : 'вкладка браузера';
  mode.className = `chip ${isStandalone() ? 'ok' : ''}`.trim();
}

function init() {
  $('#app-version').textContent = `Версия ${APP_VERSION} (${APP_BUILD})`;

  for (const b of $$('.nav-btn')) b.addEventListener('click', () => showSection(b.dataset.section));
  for (const b of $$('[data-goto]')) b.addEventListener('click', () => showSection(b.dataset.goto));

  window.addEventListener('online', () => {
    renderHeaderChips();
    if (!$('#sec-device').hidden) renderDevice();
  });
  window.addEventListener('offline', () => {
    renderHeaderChips();
    if (!$('#sec-device').hidden) renderDevice();
  });

  $('#sum-reset').addEventListener('click', () => {
    if (window.confirm('Сбросить все записанные результаты на этом устройстве?')) {
      resetResults();
      renderSummary();
      toast('Результаты сброшены');
    }
  });

  renderHeaderChips();
  renderDevice();
  initInstall();
  initCamera();
  initDictation();
  initStorage();
  initLabels();
  initSummary();
  showSection(store.get('section', 'device'), { scroll: false });
}

init();
