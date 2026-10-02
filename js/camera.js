// Раздел «Камера и QR»: камера, выбор объектива, зум, фонарик, непрерывное распознавание,
// серия из 20 сканов, перезапуск камеры и самопроверка декодера.
// ВАЖНО: адрес страницы (location, hash, history) здесь никогда не меняется —
// иначе iOS заново спрашивает разрешение на камеру.

import { results, saveResults, store, fmt, el, renderKV, setStatus, sleep, median, errorText, toast, onReset } from './state.js';
import { createDecoder } from './decoder.js';
import { qrCanvas } from './qr.js';

export const SERIES_TARGET = 20;
export const TARGET_MS = 1500;
const ATTEMPT_TIMEOUT_MS = 15000;
const MAX_DECODE_SIDE = 800; // сторона кадра, который уходит в декодер, px
const CROP_CHOICES = [50, 70, 90];
const DEFAULT_CROP = 70;

const ui = {};
let stream = null;
let track = null;
let decoder = null;
let decoderPromise = null;
let decoderMode = 'auto';
let loopActive = false;
let rafId = 0;
let busy = false;
let attempt = null; // { start, active, series }
let sectionVisible = false;
let cropPercent = DEFAULT_CROP;
let frameCanvas = null;
let frameCtx = null;
let perf = { frames: 0, decodeMs: 0, since: 0, lastFrameSize: 0 };
let seriesActive = false;
let lastSeriesText = null;
let torchOn = false;
let zoomTimer = 0;
let restartRunning = false;
let permissionStatus = null;
const decoderLog = [];

// ---------------------------------------------------------------- инициализация

export function initCamera() {
  for (const id of [
    'cam-box', 'cam-video', 'cam-guide', 'cam-placeholder', 'cam-status', 'cam-decoder', 'cam-start', 'cam-stop',
    'cam-select', 'cam-select-note', 'cam-crop', 'cam-zoom-row', 'cam-zoom', 'cam-zoom-value', 'cam-torch',
    'cam-torch-note', 'scan-text', 'scan-time', 'scan-hint', 'scan-next', 'scan-history', 'series-start',
    'series-fail', 'series-abort', 'series-skiprepeat', 'series-progress', 'series-stats', 'series-verdict',
    'series-list', 'cam-caps', 'cam-raw', 'restart-run', 'restart-log', 'restart-question', 'restart-yes',
    'restart-no', 'restart-answer', 'cam-permission', 'selftest-run', 'selftest-out', 'decoder-mode', 'decoder-log',
  ]) {
    ui[id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = document.getElementById(id);
  }

  frameCanvas = document.createElement('canvas');
  frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true });

  cropPercent = CROP_CHOICES.includes(store.get('cropPercent')) ? store.get('cropPercent') : DEFAULT_CROP;
  ui.camCrop.value = String(cropPercent);
  applyGuideSize();
  ui.seriesSkiprepeat.checked = store.get('skipRepeat', true) !== false;

  ui.camStart.addEventListener('click', onStartClick);
  ui.camStop.addEventListener('click', () => {
    stopCamera();
    setStatus(ui.camStatus, 'Камера выключена.');
  });
  ui.camSelect.addEventListener('change', onCameraChosen);
  ui.camCrop.addEventListener('change', () => {
    cropPercent = Number(ui.camCrop.value) || DEFAULT_CROP;
    store.set('cropPercent', cropPercent);
    results.camera.cropPercent = cropPercent;
    saveResults();
    applyGuideSize();
  });
  ui.camZoom.addEventListener('input', onZoomInput);
  ui.camTorch.addEventListener('click', toggleTorch);
  ui.scanNext.addEventListener('click', nextScan);
  ui.seriesStart.addEventListener('click', startSeries);
  ui.seriesFail.addEventListener('click', () => failAttempt('пропущено вручную'));
  ui.seriesAbort.addEventListener('click', abortSeries);
  ui.seriesSkiprepeat.addEventListener('change', () => store.set('skipRepeat', ui.seriesSkiprepeat.checked));
  ui.restartRun.addEventListener('click', runRestartTest);
  ui.restartYes.addEventListener('click', () => answerRestart('да'));
  ui.restartNo.addEventListener('click', () => answerRestart('нет'));
  ui.selftestRun.addEventListener('click', runSelfTest);
  ui.decoderMode.addEventListener('change', onDecoderModeChange);

  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    ui.camStart.disabled = true;
    setStatus(ui.camStatus, 'Камера недоступна: нужна защищённая страница (https) и поддержка getUserMedia.', 'bad');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
      return;
    }
    if (stream) {
      // После возврата из фона iOS может поставить видео на паузу.
      ui.camVideo.play().catch(() => {});
      if (sectionVisible) startLoop();
    }
  });

  watchPermission();
  renderAll();
  onReset(() => {
    seriesActive = false;
    lastSeriesText = null;
    ui.restartLog.replaceChildren();
    ui.restartQuestion.hidden = true;
    ui.selftestOut.textContent = '';
    ui.scanText.textContent = '—';
    ui.scanTime.textContent = '';
    if (track) readTrackInfo();
    if (decoder) {
      decoder.terminate();
      decoder = null;
      decoderPromise = null;
      ensureDecoder().catch(() => {});
    }
    renderAll();
  });
}

/** Вызывается при переключении разделов: распознавание идёт только когда раздел на экране. */
export function setCameraSectionVisible(visible) {
  sectionVisible = visible;
  if (visible) {
    ensureDecoder().catch(() => {});
    if (stream) startLoop();
  } else {
    stopLoop();
  }
}

// ---------------------------------------------------------------- декодер

function logDecoder(line) {
  decoderLog.push(`${new Date().toLocaleTimeString('ru-RU')}  ${line}`);
  if (decoderLog.length > 60) decoderLog.shift();
  if (ui.decoderLog) ui.decoderLog.textContent = decoderLog.join('\n');
}

function ensureDecoder() {
  if (decoder) return Promise.resolve(decoder);
  if (decoderPromise) return decoderPromise;
  ui.camDecoder.textContent = 'Декодер: запуск…';
  decoderPromise = createDecoder(decoderMode, logDecoder)
    .then((d) => {
      decoder = d;
      results.camera.decoder = {
        id: d.id,
        label: d.label,
        library: d.info.library,
        version: d.info.version,
        zxingCpp: d.info.zxingCpp || null,
        thread: d.info.thread,
        initMs: Math.round(d.info.initMs),
        failed: (d.failures || []).map((f) => `${f.id}: ${f.error}`),
        mode: decoderMode,
      };
      saveResults();
      renderDecoderLine();
      return d;
    })
    .catch((err) => {
      decoderPromise = null;
      ui.camDecoder.textContent = `Декодер: ошибка — ${errorText(err)}`;
      ui.camDecoder.className = 'status bad';
      results.camera.decoder = { label: null, error: errorText(err), failed: (err.failures || []).map((f) => `${f.id}: ${f.error}`) };
      saveResults();
      throw err;
    });
  return decoderPromise;
}

function renderDecoderLine() {
  if (!decoder) return;
  const i = decoder.info;
  const ver = i.version ? ` ${i.version}` : '';
  let note = '';
  if (decoderMode === 'jsqr') note = ' — выбран для сравнения';
  else if (decoder.failures && decoder.failures.length) {
    note = decoder.id.startsWith('jsqr') ? ' — запасной: zxing-wasm не запустился' : ' — запасной вариант';
  }
  let line = `Декодер: ${decoder.label}${note} · ${i.library}${ver}`;
  if (perf.frames > 0) {
    const avg = perf.decodeMs / perf.frames;
    const secs = (performance.now() - perf.since) / 1000;
    const fps = secs > 0 ? perf.frames / secs : 0;
    line += ` · кадр ${perf.lastFrameSize}×${perf.lastFrameSize} · ${Math.round(avg)} мс · ${fmt.num(fps, 1)} кадр/с`;
  }
  ui.camDecoder.textContent = line;
  ui.camDecoder.className = decoder.id.startsWith('zxing') ? 'status ok' : 'status warn';
}

async function onDecoderModeChange() {
  decoderMode = ui.decoderMode.value === 'jsqr' ? 'jsqr' : 'auto';
  if (decoder) decoder.terminate();
  decoder = null;
  decoderPromise = null;
  perf = { frames: 0, decodeMs: 0, since: performance.now(), lastFrameSize: 0 };
  logDecoder(decoderMode === 'jsqr' ? 'переключение на jsQR (сравнение)' : 'переключение на авто (zxing-wasm)');
  try {
    await ensureDecoder();
    toast(`Декодер: ${decoder.label}`);
  } catch {
    /* ошибка уже показана */
  }
}

// ---------------------------------------------------------------- камера

function buildConstraints(deviceId) {
  const size = { width: { ideal: 1920 }, height: { ideal: 1080 } };
  return {
    audio: false,
    video: deviceId ? { ...size, deviceId: { exact: deviceId } } : { ...size, facingMode: { ideal: 'environment' } },
  };
}

async function onStartClick() {
  // getUserMedia вызывается сразу в обработчике нажатия — до любых других await.
  ui.camStart.disabled = true;
  setStatus(ui.camStatus, 'Запрашиваю камеру…');
  try {
    await startCamera();
  } catch (err) {
    showCameraError(err);
  } finally {
    ui.camStart.disabled = Boolean(stream);
  }
}

async function startCamera(options = {}) {
  const saved = options.deviceId !== undefined ? options.deviceId : store.get('cameraId', '');
  let s;
  let fellBack = false;
  try {
    s = await navigator.mediaDevices.getUserMedia(buildConstraints(saved));
  } catch (err) {
    if (saved && (err.name === 'OverconstrainedError' || err.name === 'NotFoundError')) {
      fellBack = true;
      store.remove('cameraId');
      s = await navigator.mediaDevices.getUserMedia(buildConstraints(''));
    } else {
      throw err;
    }
  }
  if (fellBack) {
    // Идентификатор камеры мог смениться — ищем ту же камеру по названию.
    const lostLabel = store.get('cameraLabel', '');
    let same = null;
    if (lostLabel) {
      same = (await navigator.mediaDevices.enumerateDevices()).find((d) => d.kind === 'videoinput' && d.label === lostLabel) || null;
      const current = s.getVideoTracks()[0];
      if (same && (!current || current.label !== lostLabel)) {
        for (const t of s.getTracks()) t.stop();
        s = await navigator.mediaDevices.getUserMedia(buildConstraints(same.deviceId));
      }
    }
    if (same) {
      store.set('cameraId', same.deviceId);
    } else {
      store.remove('cameraLabel');
      toast('Сохранённая камера не найдена — включена камера по умолчанию');
    }
  }
  await attachStream(s);
  ensureDecoder().catch(() => {});
  await refreshDeviceList();
  readTrackInfo();
  if (!options.keepAttempt) newAttempt();
  if (sectionVisible) startLoop();
  updateButtons();
  setStatus(ui.camStatus, 'Камера включена. Наведите на QR-код в рамке (10–20 см).', 'ok');
}

async function attachStream(s) {
  stream = s;
  track = s.getVideoTracks()[0] || null;
  torchOn = false;
  const video = ui.camVideo;
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.srcObject = s;
  try {
    await Promise.race([video.play(), sleep(3000)]);
  } catch {
    /* autoplay + muted + playsinline обычно достаточно; если нет — кадры всё равно придут */
  }
  if (!video.videoWidth) {
    await new Promise((resolve) => {
      const done = () => resolve();
      video.addEventListener('loadedmetadata', done, { once: true });
      setTimeout(done, 3000);
    });
  }
  ui.camPlaceholder.hidden = true;
  if (track) {
    const own = track;
    own.addEventListener('ended', () => {
      if (track === own) {
        setStatus(ui.camStatus, 'Камера остановлена системой. Нажмите «Включить камеру».', 'warn');
        stopCamera();
      }
    });
    own.addEventListener('mute', () => {
      if (track === own) setStatus(ui.camStatus, 'Система приостановила камеру (например, приложение ушло в фон).', 'warn');
    });
    own.addEventListener('unmute', () => {
      if (track === own) setStatus(ui.camStatus, 'Камера снова работает.', 'ok');
    });
  }
}

function stopTracks() {
  if (stream) for (const t of stream.getTracks()) t.stop();
  stream = null;
  track = null;
  torchOn = false;
  ui.camVideo.srcObject = null;
}

function stopCamera() {
  stopLoop();
  stopTracks();
  if (attempt) attempt.active = false;
  ui.camPlaceholder.hidden = false;
  updateButtons();
  renderTorch(null);
  ui.camZoomRow.hidden = true;
}

function showCameraError(err) {
  const name = err && err.name;
  let text = `Не удалось включить камеру: ${errorText(err)}`;
  if (name === 'NotAllowedError') {
    text = 'Доступ к камере запрещён. Разрешите камеру: в Safari нажмите «аА» (или «•••») → «Настройки веб-сайта» → «Камера» → «Разрешить». Для приложения с экрана «Домой» — Настройки iPhone → Safari → Камера.';
  } else if (name === 'NotReadableError') {
    text = 'Камера занята другим приложением или системой. Закройте другие приложения с камерой и попробуйте снова.';
  } else if (name === 'NotFoundError') {
    text = 'Камера не найдена.';
  }
  setStatus(ui.camStatus, text, 'bad');
}

async function refreshDeviceList() {
  let devices = [];
  try {
    devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput');
  } catch (err) {
    ui.camSelectNote.textContent = `Список камер недоступен: ${errorText(err)}`;
    return;
  }
  const saved = store.get('cameraId', '');
  const activeId = track && track.getSettings ? track.getSettings().deviceId : '';
  const options = [el('option', { value: '', text: 'Авто — задняя камера (facingMode: environment)' })];
  devices.forEach((d, i) => {
    const label = d.label || `Камера ${i + 1} (название появится после разрешения)`;
    const isActive = d.deviceId && d.deviceId === activeId;
    options.push(el('option', { value: d.deviceId, 'data-label': d.label, text: isActive ? `${label} — сейчас` : label }));
  });
  ui.camSelect.replaceChildren(...options);
  ui.camSelect.value = saved && devices.some((d) => d.deviceId === saved) ? saved : '';
  const rear = devices.filter((d) => /задн|back|rear|environment/i.test(d.label)).length;
  ui.camSelectNote.textContent = devices.length
    ? `Найдено камер: ${devices.length}${rear ? `, из них задних: ${rear}` : ''}. Если вблизи не фокусируется — попробуйте по очереди каждую заднюю камеру, включая «двойную» и «тройную».`
    : 'Камеры не найдены.';
  results.camera.deviceList = devices.map((d) => d.label || '(без названия)');
  saveResults();
}

async function onCameraChosen() {
  const id = ui.camSelect.value;
  const option = ui.camSelect.selectedOptions[0];
  if (id) {
    store.set('cameraId', id);
    store.set('cameraLabel', option ? option.dataset.label || '' : '');
  } else {
    store.remove('cameraId');
    store.remove('cameraLabel');
  }
  if (!stream) {
    toast('Камера выбрана. Нажмите «Включить камеру».');
    return;
  }
  stopLoop();
  stopTracks();
  setStatus(ui.camStatus, 'Переключаю камеру…');
  try {
    await startCamera({ deviceId: id, keepAttempt: true });
    if (attempt && !attempt.active && !seriesActive) newAttempt();
  } catch (err) {
    showCameraError(err);
    updateButtons();
  }
}

// ---------------------------------------------------------------- параметры дорожки

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

const SETTING_KEYS = ['width', 'height', 'frameRate', 'aspectRatio', 'facingMode', 'resizeMode', 'focusMode', 'focusDistance', 'zoom', 'torch', 'exposureMode', 'whiteBalanceMode'];

function torchSupported(caps) {
  if (!caps || caps.torch === undefined) return false;
  return Array.isArray(caps.torch) ? caps.torch.includes(true) : caps.torch === true;
}

function rangeText(r) {
  if (!r || typeof r !== 'object') return '—';
  const step = r.step ? `, шаг ${fmt.num(r.step, 3)}` : '';
  return `${fmt.num(r.min, 3)}…${fmt.num(r.max, 3)}${step}`;
}

function readTrackInfo() {
  if (!track) return;
  const settings = track.getSettings ? track.getSettings() : {};
  let caps = null;
  try {
    caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : null;
  } catch {
    caps = null;
  }
  const chosen = store.get('cameraId', '');
  results.camera.camera = {
    label: track.label || '(без названия)',
    choice: chosen ? 'выбрана вручную' : 'авто (facingMode: environment)',
    deviceIdShort: settings.deviceId ? settings.deviceId.slice(0, 8) : null,
    video: `${ui.camVideo.videoWidth}×${ui.camVideo.videoHeight}`,
  };
  results.camera.settings = pick(settings, SETTING_KEYS);
  results.camera.capabilities = caps
    ? pick(caps, ['width', 'height', 'frameRate', 'facingMode', 'resizeMode', 'focusMode', 'focusDistance', 'zoom', 'torch', 'exposureMode', 'whiteBalanceMode'])
    : null;
  results.camera.capabilitiesSupported = Boolean(caps);
  results.camera.torch = torchSupported(caps);
  results.camera.zoom = caps && caps.zoom ? { min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step } : null;
  results.camera.cropPercent = cropPercent;
  saveResults();
  renderCaps(settings, caps);
  renderZoom(settings, caps);
  renderTorch(caps);
}

function renderCaps(settings, caps) {
  const c = caps || {};
  const focusModes = Array.isArray(c.focusMode) ? c.focusMode.join(', ') : '—';
  renderKV(ui.camCaps, [
    ['Камера', track ? track.label || '(без названия)' : '—'],
    ['Выбор', results.camera.camera ? results.camera.camera.choice : '—'],
    ['Разрешение (settings)', settings.width ? `${settings.width}×${settings.height}` : '—'],
    ['Кадр видео', `${ui.camVideo.videoWidth}×${ui.camVideo.videoHeight}`],
    ['Частота кадров', settings.frameRate ? `${fmt.num(settings.frameRate, 1)} кадр/с` : '—'],
    ['Направление', settings.facingMode || '—'],
    ['Фокус: режим', settings.focusMode || '—'],
    ['Фокус: доступные режимы', focusModes],
    ['Фокус: дистанция', settings.focusDistance !== undefined ? fmt.num(settings.focusDistance, 3) : '—'],
    ['Фокус: диапазон', rangeText(c.focusDistance)],
    ['Зум', settings.zoom !== undefined ? `${fmt.num(settings.zoom, 2)}×` : '—'],
    ['Зум: диапазон', rangeText(c.zoom)],
    ['Фонарик', torchSupported(caps) ? 'поддерживается' : 'недоступен', torchSupported(caps) ? 'ok' : 'warn'],
    ['Макс. разрешение', c.width && c.height ? `${c.width.max}×${c.height.max}` : '—'],
    ['getCapabilities()', caps ? 'есть' : 'нет в этом браузере', caps ? '' : 'warn'],
  ]);
  ui.camRaw.textContent = JSON.stringify({ settings, capabilities: caps }, null, 2);
}

function renderZoom(settings, caps) {
  const z = caps && caps.zoom;
  if (!z || !(z.max > z.min)) {
    ui.camZoomRow.hidden = true;
    return;
  }
  ui.camZoomRow.hidden = false;
  ui.camZoom.min = String(z.min);
  ui.camZoom.max = String(z.max);
  ui.camZoom.step = String(z.step || 0.1);
  ui.camZoom.value = String(settings.zoom !== undefined ? settings.zoom : z.min);
  ui.camZoomValue.textContent = `${fmt.num(Number(ui.camZoom.value), 2)}×`;
}

function onZoomInput() {
  const value = Number(ui.camZoom.value);
  ui.camZoomValue.textContent = `${fmt.num(value, 2)}×`;
  clearTimeout(zoomTimer);
  zoomTimer = setTimeout(async () => {
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ zoom: value }] });
      const s = track.getSettings();
      results.camera.settings = pick(s, SETTING_KEYS);
      results.camera.lastZoom = s.zoom !== undefined ? s.zoom : value;
      saveResults();
    } catch (err) {
      toast(`Зум не применился: ${errorText(err)}`);
    }
  }, 60);
}

function renderTorch(caps) {
  const supported = torchSupported(caps);
  ui.camTorch.hidden = !supported;
  ui.camTorch.setAttribute('aria-pressed', String(torchOn));
  ui.camTorch.textContent = torchOn ? 'Фонарик: вкл' : 'Фонарик: выкл';
  if (!track) ui.camTorchNote.textContent = 'Фонарик: включите камеру, чтобы проверить.';
  else ui.camTorchNote.textContent = supported ? '' : 'Фонарик недоступен в этом браузере (или у этой камеры нет вспышки).';
}

async function toggleTorch() {
  if (!track) return;
  const want = !torchOn;
  try {
    await track.applyConstraints({ advanced: [{ torch: want }] });
    const s = track.getSettings ? track.getSettings() : {};
    torchOn = s.torch !== undefined ? Boolean(s.torch) : want;
    results.camera.torchWorked = true;
    saveResults();
  } catch (err) {
    results.camera.torchWorked = false;
    results.camera.torchError = errorText(err);
    saveResults();
    toast(`Фонарик: ${errorText(err)}`);
  }
  ui.camTorch.setAttribute('aria-pressed', String(torchOn));
  ui.camTorch.textContent = torchOn ? 'Фонарик: вкл' : 'Фонарик: выкл';
}

// ---------------------------------------------------------------- рамка и вспышка

function applyGuideSize() {
  ui.camGuide.style.width = `${cropPercent}%`;
  ui.camGuide.style.height = `${cropPercent}%`;
}

let flashTimer = 0;
function flash() {
  ui.camBox.classList.remove('hit');
  // перезапуск анимации
  void ui.camBox.offsetWidth;
  ui.camBox.classList.add('hit');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => ui.camBox.classList.remove('hit'), 900);
}

// ---------------------------------------------------------------- цикл распознавания

function startLoop() {
  if (loopActive || !stream) return;
  loopActive = true;
  if (!perf.since) perf.since = performance.now();
  rafId = requestAnimationFrame(tick);
}

function stopLoop() {
  loopActive = false;
  cancelAnimationFrame(rafId);
}

function tick() {
  if (!loopActive) return;
  rafId = requestAnimationFrame(tick);
  if (!attempt || !attempt.active) return;
  const elapsed = performance.now() - attempt.start;
  if (seriesActive && elapsed > ATTEMPT_TIMEOUT_MS) {
    failAttempt('тайм-аут 15 с');
    return;
  }
  if (busy || !decoder || !stream) return;
  const video = ui.camVideo;
  if (video.readyState < 2 || !video.videoWidth) return;
  decodeFrame(video);
}

async function decodeFrame(video) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const side = Math.max(16, Math.round((Math.min(vw, vh) * cropPercent) / 100));
  const sx = Math.round((vw - side) / 2);
  const sy = Math.round((vh - side) / 2);
  const out = Math.min(side, MAX_DECODE_SIDE);
  if (frameCanvas.width !== out) {
    frameCanvas.width = out;
    frameCanvas.height = out;
  }
  busy = true;
  const current = attempt;
  const d = decoder;
  try {
    frameCtx.drawImage(video, sx, sy, side, side, 0, 0, out, out);
    const image = frameCtx.getImageData(0, 0, out, out);
    const res = await d.decode(image);
    perf.frames++;
    perf.decodeMs += res.ms || 0;
    perf.lastFrameSize = out;
    if (perf.frames % 10 === 0) renderDecoderLine();
    if (res.error) logDecoder(`ошибка кадра: ${res.error}`);
    if (res.text && current === attempt && current.active) onDecoded(res.text);
  } catch (err) {
    logDecoder(`ошибка распознавания: ${errorText(err)}`);
    if (d === decoder && /остановлен|не ответил/.test(String(err.message))) {
      // декодер завис — перезапускаем
      decoder.terminate();
      decoder = null;
      decoderPromise = null;
      ensureDecoder().catch(() => {});
    }
  } finally {
    busy = false;
  }
}

// ---------------------------------------------------------------- попытки и серия

function newAttempt() {
  attempt = { start: performance.now(), active: true, series: seriesActive };
  ui.scanNext.disabled = true;
  ui.scanHint.textContent = seriesActive
    ? `Попытка ${results.camera.series.attempts.length + 1} из ${SERIES_TARGET}: наведите на наклейку…`
    : 'Сканирую… наведите на QR-код.';
  ui.scanText.classList.add('muted');
  updateButtons();
}

function onDecoded(text) {
  const now = performance.now();
  if (seriesActive && ui.seriesSkiprepeat.checked && lastSeriesText !== null && text === lastSeriesText) {
    ui.scanHint.textContent = `Это снова ${text} — наведите на следующую наклейку.`;
    return;
  }
  const ms = now - attempt.start;
  attempt.active = false;
  ui.scanText.textContent = text;
  ui.scanText.classList.remove('muted');
  ui.scanTime.textContent = `Прочитано за ${fmt.sec(ms)}${ms <= TARGET_MS ? '' : ' (дольше 1,5 с)'}`;
  ui.scanTime.className = ms <= TARGET_MS ? 'scan-time ok' : 'scan-time warn';
  flash();
  const entry = { text: text.slice(0, 80), ms: Math.round(ms), at: new Date().toISOString(), series: seriesActive };
  results.camera.lastScans = [entry, ...(results.camera.lastScans || [])].slice(0, 10);
  if (seriesActive) {
    lastSeriesText = text;
    recordSeriesAttempt({ ok: true, ms: Math.round(ms), text: text.slice(0, 80) });
  } else {
    ui.scanHint.textContent = 'Нажмите «Следующий скан», когда наведёте на следующую наклейку.';
  }
  saveResults();
  ui.scanNext.disabled = false;
  renderHistory();
}

function failAttempt(reason) {
  if (!seriesActive || !attempt || !attempt.active) return;
  const ms = performance.now() - attempt.start;
  attempt.active = false;
  ui.scanText.textContent = '—';
  ui.scanText.classList.add('muted');
  ui.scanTime.textContent = `Не прочитано (${reason})`;
  ui.scanTime.className = 'scan-time bad';
  recordSeriesAttempt({ ok: false, ms: Math.round(ms), reason });
  saveResults();
  ui.scanNext.disabled = false;
}

function recordSeriesAttempt(a) {
  const s = results.camera.series;
  s.attempts.push({ n: s.attempts.length + 1, ...a });
  if (s.attempts.length >= SERIES_TARGET) {
    seriesActive = false;
    s.finished = true;
    s.finishedAt = new Date().toISOString();
    ui.scanHint.textContent = 'Серия завершена. Итог — ниже и в разделе «Итог».';
    ui.scanNext.disabled = false;
    toast('Серия из 20 завершена');
  } else {
    ui.scanHint.textContent = `Готово: ${s.attempts.length} из ${SERIES_TARGET}. Наведите на следующую наклейку и нажмите «Следующий скан».`;
  }
  renderSeries();
  updateButtons();
}

function nextScan() {
  if (!stream) {
    toast('Сначала включите камеру');
    return;
  }
  newAttempt();
  if (sectionVisible) startLoop();
}

function startSeries() {
  if (!stream) {
    toast('Сначала включите камеру');
    return;
  }
  results.camera.series = {
    target: SERIES_TARGET,
    startedAt: new Date().toISOString(),
    finished: false,
    attempts: [],
    camera: track ? track.label : null,
    decoder: decoder ? decoder.label : null,
    cropPercent,
  };
  seriesActive = true;
  lastSeriesText = null;
  saveResults();
  renderSeries();
  newAttempt();
}

function abortSeries() {
  if (!seriesActive) return;
  seriesActive = false;
  if (attempt) attempt.active = false;
  results.camera.series.aborted = true;
  saveResults();
  ui.scanHint.textContent = 'Серия прервана.';
  ui.scanNext.disabled = false;
  renderSeries();
  updateButtons();
}

export function seriesStats(series) {
  if (!series || !Array.isArray(series.attempts)) return null;
  const count = series.attempts.length;
  const okTimes = series.attempts.filter((a) => a.ok).map((a) => a.ms);
  const within = series.attempts.filter((a) => a.ok && a.ms <= TARGET_MS).length;
  return {
    count,
    success: okTimes.length,
    medianMs: okTimes.length ? median(okTimes) : NaN,
    maxMs: okTimes.length ? Math.max(...okTimes) : NaN,
    within,
    withinShare: count ? within / count : NaN,
    targetMet: count >= SERIES_TARGET ? within / count >= 0.95 : null,
  };
}

function renderSeries() {
  const s = results.camera.series;
  const st = seriesStats(s);
  if (!s || !st) {
    ui.seriesProgress.textContent = 'Серия ещё не запускалась.';
    renderKV(ui.seriesStats, []);
    ui.seriesVerdict.textContent = '';
    ui.seriesList.replaceChildren();
    return;
  }
  ui.seriesProgress.textContent = seriesActive
    ? `Идёт серия: попытка ${Math.min(st.count + 1, SERIES_TARGET)} из ${SERIES_TARGET}`
    : s.finished
      ? `Серия завершена: ${st.count} из ${SERIES_TARGET}`
      : `Серия остановлена на ${st.count} из ${SERIES_TARGET}`;
  renderKV(ui.seriesStats, [
    ['Попыток', `${st.count} из ${SERIES_TARGET}`],
    ['Успешно', String(st.success)],
    ['Медиана', fmt.sec(st.medianMs)],
    ['Максимум', fmt.sec(st.maxMs)],
    ['Не дольше 1,5 с', st.count ? `${st.within} из ${st.count} (${fmt.pct(st.withinShare)})` : '—', st.count ? (st.withinShare >= 0.95 ? 'ok' : 'warn') : ''],
  ]);
  if (st.targetMet === true) {
    ui.seriesVerdict.textContent = 'Цель выполнена: не менее 95 % сканов за 1,5 с.';
    ui.seriesVerdict.className = 'status ok';
  } else if (st.targetMet === false) {
    ui.seriesVerdict.textContent = 'Цель не выполнена: меньше 95 % сканов уложились в 1,5 с.';
    ui.seriesVerdict.className = 'status bad';
  } else {
    ui.seriesVerdict.textContent = 'Цель: не менее 95 % сканов за 1,5 с на 10–20 см при одной лампочке.';
    ui.seriesVerdict.className = 'status';
  }
  ui.seriesList.replaceChildren(
    ...s.attempts.map((a) =>
      el('li', { class: a.ok ? (a.ms <= TARGET_MS ? 'ok' : 'warn') : 'bad' },
        a.ok ? `${a.text} — ${fmt.sec(a.ms)}` : `не прочитано (${a.reason}) — ${fmt.sec(a.ms)}`),
    ),
  );
}

function renderHistory() {
  const list = results.camera.lastScans || [];
  ui.scanHistory.replaceChildren(
    ...list.map((s) => el('li', {}, `${s.text} — ${fmt.sec(s.ms)}${s.series ? ' (серия)' : ''}`)),
  );
}

function updateButtons() {
  const on = Boolean(stream);
  ui.camStart.hidden = on;
  ui.camStart.disabled = on;
  ui.camStop.hidden = !on;
  ui.seriesStart.disabled = !on || seriesActive;
  ui.seriesFail.disabled = !seriesActive;
  ui.seriesAbort.disabled = !seriesActive;
  ui.restartRun.disabled = restartRunning || seriesActive;
  if (!on) ui.scanNext.disabled = true;
}

// ---------------------------------------------------------------- перезапуск камеры 3 раза

async function queryPermission() {
  try {
    if (!navigator.permissions || !navigator.permissions.query) return 'API недоступно';
    const s = await navigator.permissions.query({ name: 'camera' });
    return s.state;
  } catch (err) {
    return `не поддерживается (${errorText(err)})`;
  }
}

async function watchPermission() {
  try {
    if (!navigator.permissions || !navigator.permissions.query) {
      showPermission('API navigator.permissions недоступно');
      return;
    }
    permissionStatus = await navigator.permissions.query({ name: 'camera' });
    showPermission(permissionStatus.state);
    permissionStatus.onchange = () => showPermission(permissionStatus.state);
  } catch (err) {
    showPermission(`запрос не поддерживается (${errorText(err)})`);
  }
}

const PERMISSION_RU = { granted: 'разрешено (granted)', prompt: 'будет спрашивать (prompt)', denied: 'запрещено (denied)' };

function showPermission(state) {
  results.camera.permission = state;
  saveResults();
  ui.camPermission.textContent = `Разрешение камеры (permissions.query): ${PERMISSION_RU[state] || state}`;
}

async function runRestartTest() {
  if (restartRunning) return;
  restartRunning = true;
  updateButtons();
  ui.restartQuestion.hidden = true;
  const runs = [];
  const before = await queryPermission();
  const deviceId = store.get('cameraId', '');
  const logLine = (text, cls) => ui.restartLog.append(el('li', { class: cls || null, text }));
  ui.restartLog.replaceChildren();
  stopLoop();
  for (let i = 1; i <= 3; i++) {
    stopTracks();
    ui.camPlaceholder.hidden = false;
    await sleep(400);
    const t0 = performance.now();
    try {
      const s = await navigator.mediaDevices.getUserMedia(buildConstraints(deviceId));
      await attachStream(s);
      const ms = Math.round(performance.now() - t0);
      runs.push({ n: i, ok: true, ms });
      logLine(`Запуск ${i}: камера включилась за ${fmt.ms(ms)}`, 'ok');
    } catch (err) {
      runs.push({ n: i, ok: false, error: errorText(err) });
      logLine(`Запуск ${i}: ошибка — ${errorText(err)}`, 'bad');
      break;
    }
    await sleep(900);
  }
  const after = await queryPermission();
  results.camera.restart = { runs, permissionBefore: before, permissionAfter: after, askedAgain: null, at: new Date().toISOString() };
  saveResults();
  if (stream) {
    readTrackInfo();
    if (!attempt || !attempt.active) newAttempt();
    if (sectionVisible) startLoop();
  } else {
    ui.camPlaceholder.hidden = false;
  }
  restartRunning = false;
  updateButtons();
  ui.restartQuestion.hidden = false;
  renderRestartAnswer();
}

function answerRestart(value) {
  if (!results.camera.restart) results.camera.restart = { runs: [], askedAgain: null };
  results.camera.restart.askedAgain = value;
  saveResults();
  renderRestartAnswer();
  toast(`Записано: iOS спросил разрешение снова — ${value}`);
}

function renderRestartAnswer() {
  const r = results.camera.restart;
  if (!r) {
    ui.restartAnswer.textContent = '';
    return;
  }
  ui.restartQuestion.hidden = false;
  ui.restartAnswer.textContent = r.askedAgain ? `Ответ записан: ${r.askedAgain}` : 'Ответ ещё не записан.';
  ui.restartYes.setAttribute('aria-pressed', String(r.askedAgain === 'да'));
  ui.restartNo.setAttribute('aria-pressed', String(r.askedAgain === 'нет'));
  if (!ui.restartLog.children.length && Array.isArray(r.runs)) {
    ui.restartLog.replaceChildren(
      ...r.runs.map((x) => el('li', { class: x.ok ? 'ok' : 'bad', text: x.ok ? `Запуск ${x.n}: ${fmt.ms(x.ms)}` : `Запуск ${x.n}: ошибка — ${x.error}` })),
    );
  }
}

// ---------------------------------------------------------------- самопроверка декодера

function imageDataOf(canvas) {
  return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
}

// Искажённый вариант: поворот, уменьшение, серый фон, низкий контраст и шум.
function distortedImage(text) {
  const src = qrCanvas(text, { modulePx: 6, quiet: 4 });
  const size = 640;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#8c8781';
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size / 2, size / 2);
  ctx.rotate((17 * Math.PI) / 180);
  ctx.scale(0.9, 0.9);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < d.length; i += 4) {
    const noise = (rnd() - 0.5) * 50;
    for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, d[i + k] * 0.6 + 45 + noise));
  }
  return img;
}

async function decodeWith(d, image) {
  const t0 = performance.now();
  const res = await d.decode(image);
  return { text: res.text, ms: Math.round(performance.now() - t0) };
}

export async function runSelfTest() {
  const expected = 'T0007';
  ui.selftestRun.disabled = true;
  ui.selftestOut.textContent = 'Проверяю…';
  ui.selftestOut.className = 'status';
  const lines = [];
  const report = { expected, at: new Date().toISOString() };
  try {
    const d = await ensureDecoder();
    report.decoder = d.label;
    const clean = await decodeWith(d, imageDataOf(qrCanvas(expected, { modulePx: 8, quiet: 4 })));
    report.clean = { ...clean, ok: clean.text === expected };
    lines.push(`${d.label}: чистый QR → ${clean.text === null ? 'не прочитан' : `«${clean.text}»`} за ${fmt.ms(clean.ms)} ${report.clean.ok ? '✓' : '✗'}`);
    const hard = await decodeWith(d, distortedImage(expected));
    report.distorted = { ...hard, ok: hard.text === expected };
    lines.push(`${d.label}: искажённый QR (поворот 17°, шум) → ${hard.text === null ? 'не прочитан' : `«${hard.text}»`} за ${fmt.ms(hard.ms)} ${report.distorted.ok ? '✓' : '✗'}`);

    // Запасной декодер проверяем отдельно, если основной — не он.
    if (!d.id.startsWith('jsqr')) {
      try {
        const fb = await createDecoder('jsqr', logDecoder);
        const r = await decodeWith(fb, imageDataOf(qrCanvas(expected, { modulePx: 8, quiet: 4 })));
        report.fallback = { decoder: fb.label, ...r, ok: r.text === expected };
        lines.push(`Запасной декодер, ${fb.label}: чистый QR → ${r.text === null ? 'не прочитан' : `«${r.text}»`} за ${fmt.ms(r.ms)} ${report.fallback.ok ? '✓' : '✗'}`);
        fb.terminate();
      } catch (err) {
        report.fallback = { error: errorText(err), ok: false };
        lines.push(`Запасной jsQR: ошибка — ${errorText(err)}`);
      }
    }
    report.ok = report.clean.ok;
    ui.selftestOut.textContent = `${report.ok ? 'Самопроверка пройдена.' : 'Самопроверка НЕ пройдена.'}\n${lines.join('\n')}`;
    ui.selftestOut.className = report.ok ? 'status ok pre' : 'status bad pre';
  } catch (err) {
    report.ok = false;
    report.error = errorText(err);
    ui.selftestOut.textContent = `Ошибка самопроверки: ${errorText(err)}`;
    ui.selftestOut.className = 'status bad';
  }
  results.camera.selfTest = report;
  saveResults();
  ui.selftestRun.disabled = false;
  return report;
}

// ---------------------------------------------------------------- начальная отрисовка

function renderAll() {
  renderSeries();
  renderHistory();
  renderRestartAnswer();
  renderTorch(null);
  if (results.camera.selfTest) {
    const t = results.camera.selfTest;
    ui.selftestOut.textContent = `Последняя самопроверка: ${t.ok ? 'пройдена' : 'не пройдена'} (${t.decoder || '—'})`;
  }
  updateButtons();
}
