// Раздел «Устройство»: что за браузер, какая версия, открыто ли как приложение, экран и т. п.

import { live, fmt, $, renderKV } from './state.js';

// Размеры экрана iPhone в точках (pt) и плотность — только для подсказки «вероятная модель».
const IPHONE_SCREENS = [
  { w: 402, h: 874, dpr: 3, name: 'iPhone 17 / 17 Pro / 16 Pro' },
  { w: 440, h: 956, dpr: 3, name: 'iPhone 17 Pro Max / 16 Pro Max' },
  { w: 420, h: 912, dpr: 3, name: 'iPhone Air' },
  { w: 393, h: 852, dpr: 3, name: 'iPhone 16 / 15 / 15 Pro / 14 Pro' },
  { w: 430, h: 932, dpr: 3, name: 'iPhone 16 Plus / 15 Plus / 15 Pro Max / 14 Pro Max' },
  { w: 428, h: 926, dpr: 3, name: 'iPhone 13 Pro Max / 12 Pro Max / 14 Plus' },
  { w: 390, h: 844, dpr: 3, name: 'iPhone 12 / 13 / 14 / 12 Pro / 13 Pro / 16e' },
  { w: 375, h: 812, dpr: 3, name: 'iPhone X / XS / 11 Pro / 12 mini / 13 mini' },
  { w: 414, h: 896, dpr: 2, name: 'iPhone XR / 11' },
  { w: 414, h: 896, dpr: 3, name: 'iPhone XS Max / 11 Pro Max' },
  { w: 375, h: 667, dpr: 2, name: 'iPhone SE (2-е/3-е поколение) / 8' },
];

export function isStandalone() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

function parseUA(ua) {
  const ios = ua.match(/(?:iPhone|iPad|iPod|CPU) OS (\d+)[_.](\d+)(?:[_.](\d+))?/);
  const safari = ua.match(/Version\/(\d+(?:\.\d+){0,2})/);
  const chrome = ua.match(/(?:Chrome|CriOS)\/(\d+(?:\.\d+){0,3})/);
  const mac = ua.match(/Mac OS X (\d+)[_.](\d+)(?:[_.](\d+))?/);
  const isiPadDesktopUA = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || isiPadDesktopUA;
  const iosVersion = ios ? [ios[1], ios[2], ios[3]].filter(Boolean).join('.') : null;
  const safariVersion = safari ? safari[1] : null;
  // С iOS 26 Safari сообщает «замороженную» версию ОС 18_6, а настоящую — только через Version/26.x.
  const frozen = Boolean(iosVersion && /^18\.6/.test(iosVersion) && safariVersion && parseInt(safariVersion, 10) >= 26);
  let browser = 'другой';
  if (/CriOS/.test(ua)) browser = 'Chrome (iOS)';
  else if (/FxiOS/.test(ua)) browser = 'Firefox (iOS)';
  else if (/EdgiOS|Edg\//.test(ua)) browser = 'Edge';
  else if (chrome) browser = 'Chrome/Chromium';
  else if (safari) browser = 'Safari';
  else if (isIOS) browser = 'WebKit (приложение с экрана «Домой» или встроенный браузер)';
  return {
    isIOS,
    iosVersion,
    safariVersion,
    chromeVersion: chrome ? chrome[1] : null,
    macVersion: mac && !isIOS ? [mac[1], mac[2], mac[3]].filter(Boolean).join('.') : null,
    frozen,
    browser,
  };
}

function guessModel(isIOS) {
  if (!isIOS) return null;
  const w = Math.min(screen.width, screen.height);
  const h = Math.max(screen.width, screen.height);
  const dpr = Math.round(window.devicePixelRatio || 1);
  const hit = IPHONE_SCREENS.find((m) => m.w === w && m.h === h && m.dpr === dpr);
  return hit ? hit.name : 'не определена по размеру экрана';
}

export function collectDevice() {
  const ua = navigator.userAgent || '';
  const p = parseUA(ua);
  const standalone = isStandalone();
  const info = {
    userAgent: ua,
    platform: p.isIOS ? 'iOS / iPadOS' : p.macVersion ? 'macOS' : navigator.platform || '—',
    browser: p.browser,
    iosVersionUA: p.iosVersion,
    iosVersionNote: p.frozen ? 'в UA заморожено 18.6 (так делает iOS 26+); реальная версия iOS ≈ версии Safari' : null,
    safariVersion: p.safariVersion,
    chromeVersion: p.chromeVersion,
    macVersionUA: p.macVersion,
    standalone,
    navigatorStandalone: window.navigator.standalone === undefined ? null : window.navigator.standalone,
    displayModeStandalone: window.matchMedia('(display-mode: standalone)').matches,
    screen: `${screen.width}×${screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    modelGuess: guessModel(p.isIOS),
    online: navigator.onLine,
    language: navigator.language,
    languages: Array.isArray(navigator.languages) ? navigator.languages.join(', ') : null,
    hardwareConcurrency: navigator.hardwareConcurrency || null,
    maxTouchPoints: navigator.maxTouchPoints,
    secureContext: window.isSecureContext,
    features: {
      serviceWorker: 'serviceWorker' in navigator,
      getUserMedia: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      webWorker: typeof Worker === 'function',
      webAssembly: typeof WebAssembly === 'object',
      indexedDB: typeof indexedDB === 'object' && indexedDB !== null,
      storageManager: Boolean(navigator.storage),
      clipboard: Boolean(navigator.clipboard && navigator.clipboard.writeText),
      permissions: Boolean(navigator.permissions),
    },
  };
  live.device = info;
  return info;
}

export function renderDevice() {
  const d = collectDevice();
  const f = d.features;
  const yes = (v) => (v ? 'есть' : 'нет');
  renderKV($('#dev-kv'), [
    ['Платформа', d.platform],
    ['Браузер', d.browser],
    ['iOS (из UA)', d.iosVersionUA || '—'],
    ['Safari (из UA)', d.safariVersion || (d.platform.startsWith('iOS') ? 'нет в UA (режим приложения?)' : '—')],
    ...(d.chromeVersion ? [['Chrome (из UA)', d.chromeVersion]] : []),
    ...(d.macVersionUA ? [['macOS (из UA)', d.macVersionUA]] : []),
    ['Запущено', d.standalone ? 'как приложение с экрана «Домой»' : 'во вкладке браузера', d.standalone ? 'ok' : 'warn'],
    ['navigator.standalone', d.navigatorStandalone === null ? 'нет свойства' : String(d.navigatorStandalone)],
    ['display-mode: standalone', String(d.displayModeStandalone)],
    ['Экран', `${d.screen} pt, плотность ${fmt.num(d.devicePixelRatio, 2)}×`],
    ['Окно', d.viewport],
    ...(d.modelGuess ? [['Вероятная модель', d.modelGuess]] : []),
    ['Сеть', d.online ? 'онлайн' : 'офлайн', d.online ? 'ok' : 'warn'],
    ['Язык', d.languages ? `${d.language} (${d.languages})` : d.language],
    ['Потоков процессора', d.hardwareConcurrency ? String(d.hardwareConcurrency) : '—'],
    ['Защищённый контекст', d.secureContext ? 'да (https)' : 'нет', d.secureContext ? 'ok' : 'bad'],
    ['Камера (getUserMedia)', yes(f.getUserMedia), f.getUserMedia ? 'ok' : 'bad'],
    ['Service Worker', yes(f.serviceWorker), f.serviceWorker ? 'ok' : 'bad'],
    ['Web Worker / WebAssembly', `${yes(f.webWorker)} / ${yes(f.webAssembly)}`],
    ['IndexedDB', yes(f.indexedDB)],
    ['Буфер обмена (clipboard)', yes(f.clipboard)],
  ]);
  $('#dev-ua').textContent = d.userAgent;
  const note = $('#dev-note');
  note.hidden = !d.iosVersionNote;
  note.textContent = d.iosVersionNote
    ? 'Начиная с iOS 26 Safari всегда пишет в user agent «iPhone OS 18_6». Настоящую версию iOS смотрите в Настройки → Основные → Об этом устройстве; версия Safari в UA совпадает с основной версией iOS.'
    : '';
}
