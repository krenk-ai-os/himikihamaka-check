// Раздел «Итог»: все результаты одним текстом (по-русски) и в JSON. Ничего никуда не отправляется.

import { results, live, APP_VERSION, APP_BUILD, fmt, $, toast } from './state.js';
import { collectDevice } from './device.js';
import { seriesStats, SERIES_TARGET } from './camera.js';
import { formatQty } from './parse.js';

let current = null;

export function initSummary() {
  $('#sum-refresh').addEventListener('click', renderSummary);
  $('#sum-copy').addEventListener('click', copySummary);
}

function yn(v) {
  if (v === true || v === 'да') return 'да';
  if (v === false || v === 'нет') return 'нет';
  return 'не отмечено';
}

function line(label, value) {
  return `• ${label}: ${value === null || value === undefined || value === '' ? '—' : value}`;
}

export function buildSummary() {
  const d = collectDevice();
  const sw = live.sw || {};
  const c = results.camera;
  const st = seriesStats(c.series);
  const dict = results.dictation;
  const s = results.storage;
  const out = [];

  out.push('HimikiHamaka · проверка этапа 0 — результаты');
  out.push(`Страница: версия ${APP_VERSION} (${APP_BUILD}); итог собран ${fmt.time()}`);

  out.push('', 'УСТРОЙСТВО');
  out.push(line('Платформа и браузер', `${d.platform}, ${d.browser}`));
  out.push(line('iOS по UA', d.iosVersionUA ? `${d.iosVersionUA}${d.iosVersionNote ? ` (${d.iosVersionNote})` : ''}` : '—'));
  out.push(line('Safari по UA', d.safariVersion || '—'));
  if (d.chromeVersion) out.push(line('Chrome по UA', d.chromeVersion));
  if (d.macVersionUA) out.push(line('macOS по UA', d.macVersionUA));
  out.push(line('Запущено', d.standalone ? 'как приложение с экрана «Домой»' : 'во вкладке браузера'));
  out.push(line('Экран', `${d.screen} pt, плотность ${fmt.num(d.devicePixelRatio, 2)}×, окно ${d.viewport}${d.modelGuess ? `; вероятно ${d.modelGuess}` : ''}`));
  out.push(line('Сеть / язык', `${d.online ? 'онлайн' : 'офлайн'} / ${d.language}`));
  out.push(line('User agent', d.userAgent));

  out.push('', 'УСТАНОВКА И ОФЛАЙН');
  out.push(line('Service Worker', sw.supported === false ? 'не поддерживается' : sw.registered ? `зарегистрирован; управляет страницей: ${fmt.yesNo(Boolean(sw.controlled))}` : `не зарегистрирован${sw.error ? ` (${sw.error})` : ''}`));
  out.push(line('Офлайн-кэш', sw.cache ? `${sw.cache.complete ? 'готов' : 'не полный'}: ${sw.cache.cached} из ${sw.cache.expected} (${sw.cache.cacheName})` : '—'));
  out.push(line('В авиарежиме приложение открылось', yn(results.install.offlineOpened)));

  out.push('', 'КАМЕРА И QR');
  const dec = c.decoder;
  out.push(line('Декодер', dec ? (dec.label ? `${dec.label}; ${dec.library} ${dec.version || ''}${dec.zxingCpp ? ` (zxing-cpp ${dec.zxingCpp})` : ''}; запуск ${fmt.ms(dec.initMs)}${dec.failed && dec.failed.length ? `; не запустились: ${dec.failed.join('; ')}` : ''}` : `ошибка: ${dec.error}`) : 'ещё не запускался'));
  const t = c.selfTest;
  out.push(line('Самопроверка декодера', t ? (t.error ? `ошибка: ${t.error}` : `${t.ok ? 'пройдена' : 'НЕ пройдена'} (чистый QR: «${t.clean?.text ?? '—'}» за ${fmt.ms(t.clean?.ms)}; искажённый: ${t.distorted?.ok ? 'прочитан' : 'не прочитан'}${t.fallback ? `; запасной jsQR: ${t.fallback.ok ? 'прочитал' : 'не прочитал'}` : ''})`) : 'не запускалась'));
  out.push(line('Камера', c.camera ? `«${c.camera.label}» (${c.camera.choice}), кадр ${c.camera.video}` : 'не включалась'));
  if (Array.isArray(c.deviceList) && c.deviceList.length) out.push(line('Камеры в системе', c.deviceList.join('; ')));
  const set = c.settings || {};
  const cap = c.capabilities || {};
  if (c.camera) {
    out.push(line('Разрешение', set.width ? `${set.width}×${set.height}, ${fmt.num(set.frameRate, 1)} кадр/с` : '—'));
    out.push(line('Фокус', `${set.focusMode || '—'}${Array.isArray(cap.focusMode) ? ` (доступно: ${cap.focusMode.join(', ')})` : ''}${set.focusDistance !== undefined ? `, дистанция ${fmt.num(set.focusDistance, 3)}` : ''}${cap.focusDistance ? `, диапазон ${fmt.num(cap.focusDistance.min, 3)}…${fmt.num(cap.focusDistance.max, 3)}` : ''}`));
    out.push(line('Зум', c.zoom ? `${fmt.num(c.zoom.min, 2)}…${fmt.num(c.zoom.max, 2)}${set.zoom !== undefined ? ` (сейчас ${fmt.num(set.zoom, 2)}×)` : ''}` : 'не поддерживается'));
    out.push(line('Фонарик', c.torch ? `поддерживается${c.torchWorked === true ? ', включался' : c.torchWorked === false ? `, ошибка: ${c.torchError}` : ''}` : 'недоступен в этом браузере'));
    out.push(line('getCapabilities()', c.capabilitiesSupported ? 'есть' : 'нет'));
    out.push(line('Зона распознавания', `${c.cropPercent || 70} % короткой стороны кадра`));
  }
  if (st) {
    const verdict = st.targetMet === true ? 'цель выполнена' : st.targetMet === false ? 'цель НЕ выполнена' : 'серия не закончена';
    out.push(line(`Серия из ${SERIES_TARGET}`, `попыток ${st.count}, успешно ${st.success}, медиана ${fmt.sec(st.medianMs)}, максимум ${fmt.sec(st.maxMs)}, не дольше 1,5 с: ${st.within} из ${st.count} (${fmt.pct(st.withinShare)}) — ${verdict}`));
    out.push(line('Серия: камера / декодер / зона', `${c.series.camera || '—'} / ${c.series.decoder || '—'} / ${c.series.cropPercent || '—'} %`));
    out.push(line('Серия: время по попыткам', c.series.attempts.map((a) => (a.ok ? fmt.sec(a.ms) : `✗(${a.reason})`)).join(', ')));
  } else {
    out.push(line(`Серия из ${SERIES_TARGET}`, 'не запускалась'));
  }
  const r = c.restart;
  out.push(line('Перезапуск камеры ×3', r ? `${r.runs.filter((x) => x.ok).length} из ${r.runs.length} успешно (${r.runs.map((x) => (x.ok ? fmt.ms(x.ms) : `ошибка: ${x.error}`)).join(', ')}); permissions: ${r.permissionBefore} → ${r.permissionAfter}` : 'не запускался'));
  out.push(line('iOS спросил разрешение снова', r && r.askedAgain ? r.askedAgain : 'не отмечено'));
  out.push(line('Разрешение камеры сейчас (permissions.query)', c.permission || '—'));
  if (c.lastScans && c.lastScans.length) out.push(line('Последние сканы', c.lastScans.map((x) => `${x.text} ${fmt.sec(x.ms)}`).join('; ')));

  out.push('', 'ДИКТОВКА');
  out.push(line('Диктовка без сети работала', yn(dict.offlineWorked)));
  out.push(line('Продиктованный список', dict.listText ? `«${dict.listText.replace(/\s*\n\s*/g, ' / ')}»` : '—'));
  if (dict.items && dict.items.length) {
    out.push(line('Разбор', dict.items.map((i) => `${i.name} — ${formatQty(i.qty)} ${i.unit}${i.guessed ? '*' : ''}`).join('; ') + ' (* — не названо, по умолчанию)'));
  }
  out.push(line('Номер наклейки', dict.labelText ? `«${dict.labelText}» → ${dict.label && dict.label.ok ? dict.label.value : 'не распознан'}` : '—'));

  out.push('', 'ХРАНИЛИЩЕ');
  out.push(line('Постоянное хранение (persisted)', s.persisted === true ? 'да' : s.persisted === false ? 'нет' : String(s.persisted ?? '—')));
  out.push(line('Запрос persist()', s.persistRequest === undefined ? 'не запрашивали' : s.persistRequest === true ? 'разрешено' : s.persistRequest === false ? 'отказано' : String(s.persistRequest)));
  out.push(line('Квота', `занято ${fmt.bytes(s.usage)} из ${fmt.bytes(s.quota)}`));
  const idb = s.idb;
  out.push(line('IndexedDB, 1000 записей', idb ? (idb.error ? `ошибка: ${idb.error}` : `${idb.ok ? 'OK' : 'данные не совпали'}; открытие ${fmt.ms(idb.openMs)}, запись ${fmt.ms(idb.writeMs)}, чтение ${fmt.ms(idb.readMs)}`) : 'не запускался'));
  out.push(line('localStorage', s.localStorage === undefined ? '—' : s.localStorage ? 'доступен' : 'недоступен'));

  const json = {
    app: { name: 'HimikiHamaka check', version: APP_VERSION, build: APP_BUILD, collectedAt: new Date().toISOString() },
    device: d,
    install: { serviceWorker: sw, offlineOpened: results.install.offlineOpened },
    camera: { ...c, seriesStats: st },
    dictation: dict,
    storage: s,
  };
  return { text: out.join('\n'), json };
}

export function renderSummary() {
  current = buildSummary();
  $('#sum-text').textContent = current.text;
  $('#sum-json').textContent = JSON.stringify(current.json, null, 2);
}

function copySummary() {
  // Текст собирается синхронно: writeText должен вызываться прямо в обработчике нажатия.
  current = buildSummary();
  $('#sum-text').textContent = current.text;
  $('#sum-json').textContent = JSON.stringify(current.json, null, 2);
  const payload = `${current.text}\n\nJSON:\n${JSON.stringify(current.json, null, 2)}`;
  const status = $('#sum-copy-status');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(payload).then(
      () => {
        status.textContent = 'Скопировано. Вставьте результаты в чат.';
        status.className = 'status ok';
        $('#sum-copyarea').hidden = true;
        toast('Результаты скопированы');
      },
      () => selectForManualCopy(payload),
    );
  } else {
    selectForManualCopy(payload);
  }
}

function selectForManualCopy(payload) {
  const area = $('#sum-copyarea');
  const status = $('#sum-copy-status');
  area.hidden = false;
  area.value = payload;
  area.focus();
  area.select();
  area.setSelectionRange(0, payload.length);
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  status.textContent = copied
    ? 'Скопировано (запасным способом). Вставьте результаты в чат.'
    : 'Автоматически скопировать не удалось. Текст выделен в поле ниже — нажмите «Скопировать» в меню (или ⌘C).';
  status.className = copied ? 'status ok' : 'status warn';
}
