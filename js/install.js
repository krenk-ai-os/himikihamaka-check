// Раздел «Установка»: режим приложения, Service Worker и офлайн-кэш.

import { results, live, saveResults, $, renderKV, errorText, toast, onReset } from './state.js';
import { isStandalone } from './device.js';

let registration = null;

export function initInstall() {
  renderMode();
  $('#inst-offline-yes').addEventListener('click', () => answerOffline('да'));
  $('#inst-offline-no').addEventListener('click', () => answerOffline('нет'));
  $('#inst-refresh').addEventListener('click', refreshSwStatus);
  renderOfflineAnswer();
  onReset(renderOfflineAnswer);
  registerServiceWorker();
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', renderMode);
}

export function renderMode() {
  const standalone = isStandalone();
  const node = $('#inst-mode');
  node.textContent = standalone
    ? 'Сейчас страница открыта как приложение с экрана «Домой».'
    : 'Сейчас страница открыта во вкладке браузера (не как приложение).';
  node.className = `status ${standalone ? 'ok' : 'warn'}`;
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    live.sw = { supported: false, registered: false, error: 'Service Worker не поддерживается' };
    renderSw();
    return;
  }
  try {
    // При самой первой установке страницей ещё никто не управляет — это не «обновление».
    const hadController = Boolean(navigator.serviceWorker.controller);
    registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    live.sw.registered = true;
    live.sw.scope = registration.scope;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      refreshSwStatus();
      if (hadController) toast('Офлайн-версия обновлена — изменения применятся при следующем запуске');
    });
    await navigator.serviceWorker.ready;
    await refreshSwStatus();
    // Пока кэш заполняется при первой установке — проверяем ещё раз.
    if (!live.sw.cache || !live.sw.cache.complete) setTimeout(refreshSwStatus, 2500);
  } catch (err) {
    live.sw.registered = false;
    live.sw.error = errorText(err);
    renderSw();
  }
}

function askWorker(worker, message, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('Service Worker не ответил')), timeoutMs);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data);
    };
    worker.postMessage(message, [channel.port2]);
  });
}

export async function refreshSwStatus() {
  live.sw.controlled = Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);
  const worker = (registration && (registration.active || registration.waiting || registration.installing)) || null;
  if (worker) {
    try {
      live.sw.cache = await askWorker(worker, { type: 'status' });
      live.sw.error = null;
    } catch (err) {
      live.sw.error = errorText(err);
    }
  }
  renderSw();
}

function renderSw() {
  const sw = live.sw;
  const c = sw.cache;
  renderKV($('#inst-sw'), [
    ['Service Worker', sw.supported === false ? 'не поддерживается' : sw.registered ? 'зарегистрирован' : sw.registered === false ? 'ошибка' : 'регистрация…', sw.registered ? 'ok' : sw.registered === false ? 'bad' : ''],
    ['Управляет страницей', sw.controlled ? 'да' : 'пока нет (после перезапуска — да)', sw.controlled ? 'ok' : 'warn'],
    ['Офлайн-кэш', c ? (c.complete ? `готов: ${c.cached} из ${c.expected} файлов` : `заполняется: ${c.cached} из ${c.expected}`) : '—', c ? (c.complete ? 'ok' : 'warn') : ''],
    ['Версия кэша', c ? c.cacheName : '—'],
    ...(sw.error ? [['Ошибка', sw.error, 'bad']] : []),
  ]);
}

function answerOffline(value) {
  results.install.offlineOpened = value;
  results.install.offlineAnsweredStandalone = isStandalone();
  saveResults();
  renderOfflineAnswer();
  toast(`Записано: в авиарежиме открылось — ${value}`);
}

function renderOfflineAnswer() {
  const v = results.install.offlineOpened;
  $('#inst-offline-answer').textContent = v ? `Ответ записан: ${v}` : 'Ответ ещё не записан.';
  $('#inst-offline-yes').setAttribute('aria-pressed', String(v === 'да'));
  $('#inst-offline-no').setAttribute('aria-pressed', String(v === 'нет'));
}
