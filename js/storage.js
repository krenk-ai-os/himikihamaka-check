// Раздел «Хранилище»: постоянное хранение, квота, тест IndexedDB на 1000 записей, localStorage.

import { results, saveResults, fmt, $, renderKV, setStatus, errorText, onReset } from './state.js';

const DB_NAME = 'hh-check-test';
const STORE = 'items';
const RECORDS = 1000;

export function initStorage() {
  $('#st-persist').addEventListener('click', requestPersist);
  $('#st-idb-run').addEventListener('click', runIdbTest);
  $('#st-refresh').addEventListener('click', refreshStorage);
  if (!navigator.storage || !navigator.storage.persist) $('#st-persist').disabled = true;
  renderIdb();
  refreshStorage();
  onReset(() => {
    renderIdb();
    refreshStorage();
  });
}

function checkLocalStorage() {
  try {
    const key = 'hh-check.__probe__';
    window.localStorage.setItem(key, '1');
    const ok = window.localStorage.getItem(key) === '1';
    window.localStorage.removeItem(key);
    return ok;
  } catch {
    return false;
  }
}

export async function refreshStorage() {
  const s = results.storage;
  s.localStorage = checkLocalStorage();
  if (navigator.storage && navigator.storage.persisted) {
    try {
      s.persisted = await navigator.storage.persisted();
    } catch (err) {
      s.persisted = `ошибка: ${errorText(err)}`;
    }
  } else {
    s.persisted = 'API недоступно';
  }
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const e = await navigator.storage.estimate();
      s.usage = e.usage;
      s.quota = e.quota;
    } catch (err) {
      s.estimateError = errorText(err);
    }
  }
  saveResults();
  renderStorage();
}

function renderStorage() {
  const s = results.storage;
  const persistedText = s.persisted === true ? 'да' : s.persisted === false ? 'нет' : String(s.persisted ?? '—');
  renderKV($('#st-kv'), [
    ['Постоянное хранение (persisted)', persistedText, s.persisted === true ? 'ok' : 'warn'],
    ['Запрос persist()', s.persistRequest === undefined ? 'не запрашивали' : s.persistRequest === true ? 'разрешено' : s.persistRequest === false ? 'отказано' : String(s.persistRequest)],
    ['Занято', fmt.bytes(s.usage)],
    ['Доступно (квота)', fmt.bytes(s.quota)],
    ['localStorage', s.localStorage ? 'доступен' : 'недоступен', s.localStorage ? 'ok' : 'bad'],
  ]);
}

async function requestPersist() {
  const btn = $('#st-persist');
  btn.disabled = true;
  try {
    results.storage.persistRequest = await navigator.storage.persist();
  } catch (err) {
    results.storage.persistRequest = `ошибка: ${errorText(err)}`;
  }
  saveResults();
  await refreshStorage();
  btn.disabled = false;
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('транзакция прервана'));
  });
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('база заблокирована другой вкладкой'));
  });
}

async function runIdbTest() {
  const out = $('#st-idb-out');
  const btn = $('#st-idb-run');
  btn.disabled = true;
  setStatus(out, 'Идёт тест…');
  const r = { records: RECORDS, at: new Date().toISOString() };
  let db = null;
  try {
    if (typeof indexedDB !== 'object' || !indexedDB) throw new Error('IndexedDB недоступна');
    let t0 = performance.now();
    db = await openDb();
    r.openMs = Math.round(performance.now() - t0);

    // Запись 1000 небольших записей одной транзакцией.
    t0 = performance.now();
    const wtx = db.transaction(STORE, 'readwrite');
    const ws = wtx.objectStore(STORE);
    ws.clear();
    for (let i = 1; i <= RECORDS; i++) {
      ws.put({ id: i, label: `T${String(i).padStart(4, '0')}`, name: `тестовая вещь ${i}`, qty: (i % 7) + 1, unit: 'шт', ts: Date.now() });
    }
    await txDone(wtx);
    r.writeMs = Math.round(performance.now() - t0);

    // Чтение и проверка.
    t0 = performance.now();
    const rtx = db.transaction(STORE, 'readonly');
    const all = await promisify(rtx.objectStore(STORE).getAll());
    await txDone(rtx);
    r.readMs = Math.round(performance.now() - t0);
    const sample = all.find((x) => x.id === 42);
    r.readCount = all.length;
    r.ok = all.length === RECORDS && Boolean(sample) && sample.label === 'T0042' && sample.name === 'тестовая вещь 42';

    // Уборка: тестовые записи не оставляем.
    const ctx = db.transaction(STORE, 'readwrite');
    ctx.objectStore(STORE).clear();
    await txDone(ctx);
  } catch (err) {
    r.ok = false;
    r.error = errorText(err);
  } finally {
    if (db) db.close();
    try {
      indexedDB.deleteDatabase(DB_NAME);
    } catch {
      /* не важно */
    }
  }
  results.storage.idb = r;
  saveResults();
  renderIdb();
  btn.disabled = false;
  refreshStorage();
}

function renderIdb() {
  const r = results.storage.idb;
  const out = $('#st-idb-out');
  if (!r) {
    setStatus(out, 'Тест ещё не запускался.');
    return;
  }
  if (r.error) {
    setStatus(out, `Ошибка IndexedDB: ${r.error}`, 'bad');
    return;
  }
  setStatus(
    out,
    `${r.ok ? 'Успешно' : 'Данные не совпали'}: открытие ${fmt.ms(r.openMs)}, запись ${r.records} записей ${fmt.ms(r.writeMs)}, чтение ${fmt.ms(r.readMs)} (прочитано ${r.readCount}).`,
    r.ok ? 'ok' : 'bad',
  );
}
