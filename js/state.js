// Общее состояние страницы, сохранение результатов на устройстве и мелкие помощники.

export const APP_VERSION = '1.0.0';
export const APP_BUILD = '2026-10-02';

const KEY_PREFIX = 'hh-check.';

// Безопасная обёртка над localStorage: в частном режиме или при запрете он может бросать исключения.
export const store = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(KEY_PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(KEY_PREFIX + key);
    } catch {
      /* недоступно — ничего не делаем */
    }
  },
};

function emptyResults() {
  return {
    install: { offlineOpened: null },
    camera: {
      decoder: null,
      selfTest: null,
      camera: null,
      settings: null,
      capabilities: null,
      torch: null,
      zoom: null,
      cropPercent: null,
      lastScans: [],
      series: null,
      restart: null,
      permission: null,
    },
    dictation: { offlineWorked: null, listText: '', items: [], labelText: '', label: null },
    storage: {},
  };
}

// Результаты сохраняются на устройстве, чтобы пережить закрытие приложения
// (например, во время проверки офлайн-запуска). Никуда не отправляются.
const saved = store.get('results', null);
export const results = mergeDeep(emptyResults(), saved && typeof saved === 'object' ? saved : {});

// Живые данные, которые собираются заново при каждом открытии.
export const live = {
  device: null,
  sw: { supported: 'serviceWorker' in navigator, registered: null, controlled: null, cache: null, error: null },
};

let saveTimer = 0;
export function saveResults() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => store.set('results', results), 150);
}

const resetHooks = [];

/** Модули регистрируют здесь перерисовку после «Сбросить результаты». */
export function onReset(fn) {
  resetHooks.push(fn);
}

export function resetResults() {
  const fresh = emptyResults();
  for (const key of Object.keys(results)) delete results[key];
  Object.assign(results, fresh);
  store.set('results', results);
  for (const fn of resetHooks) {
    try {
      fn();
    } catch (err) {
      console.warn('reset hook failed', err);
    }
  }
}

function mergeDeep(target, source) {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      mergeDeep(target[k], v);
    } else {
      target[k] = v;
    }
  }
  return target;
}

// ---------- форматирование ----------

export const fmt = {
  num(n, digits = 2) {
    return Number.isFinite(n) ? n.toLocaleString('ru-RU', { maximumFractionDigits: digits }) : '—';
  },
  ms(ms) {
    return Number.isFinite(ms) ? `${Math.round(ms).toLocaleString('ru-RU')} мс` : '—';
  },
  sec(ms) {
    return Number.isFinite(ms)
      ? `${(ms / 1000).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} с`
      : '—';
  },
  pct(x) {
    return Number.isFinite(x) ? `${Math.round(x * 100)} %` : '—';
  },
  bytes(b) {
    if (!Number.isFinite(b)) return '—';
    const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    let i = 0;
    let v = b;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toLocaleString('ru-RU', { maximumFractionDigits: i ? 1 : 0 })} ${units[i]}`;
  },
  yesNo(v) {
    return v === true ? 'да' : v === false ? 'нет' : '—';
  },
  time(date = new Date()) {
    return date.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium' });
  },
};

// ---------- DOM ----------

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Создаёт элемент. Текст всегда вставляется как текст (textContent), не как HTML. */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

/** Заполняет <dl class="kv"> парами [название, значение, класс-значения?]. */
export function renderKV(dl, rows) {
  dl.replaceChildren(
    ...rows.flatMap(([k, v, cls]) => [el('dt', { text: k }), el('dd', { class: cls || null, text: v ?? '—' })]),
  );
}

export function setStatus(node, text, kind = '') {
  node.textContent = text;
  node.className = `status ${kind}`.trim();
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function median(values) {
  if (!values.length) return NaN;
  const a = [...values].sort((x, y) => x - y);
  const mid = a.length >> 1;
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export function errorText(e) {
  if (!e) return 'неизвестная ошибка';
  const name = e.name && e.name !== 'Error' ? `${e.name}: ` : '';
  return `${name}${e.message || String(e)}`;
}

// Маленькое всплывающее уведомление внизу экрана.
let toastTimer = 0;
export function toast(text) {
  let node = document.getElementById('toast');
  if (!node) {
    node = el('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(node);
  }
  node.textContent = text;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
}
