// Раздел «Диктовка»: обычные текстовые поля (с микрофоном на клавиатуре iOS) и разбор продиктованного.

import { results, saveResults, $, el, toast, onReset } from './state.js';
import { parseList, parseLabelNumber, formatQty } from './parse.js';

const EXAMPLE = 'молоток, отвёртка, шурупы 3 штуки\n2,5 метра кабеля, две пачки соли';

export function initDictation() {
  const list = $('#dict-list');
  const label = $('#dict-label');
  list.value = results.dictation.listText || '';
  label.value = results.dictation.labelText || '';

  list.addEventListener('input', onListInput);
  label.addEventListener('input', onLabelInput);
  $('#dict-example').addEventListener('click', () => {
    list.value = EXAMPLE;
    onListInput();
  });
  $('#dict-clear').addEventListener('click', () => {
    list.value = '';
    onListInput();
    list.focus();
  });
  $('#dict-offline-yes').addEventListener('click', () => answer('да'));
  $('#dict-offline-no').addEventListener('click', () => answer('нет'));

  renderList();
  renderLabel();
  renderAnswer();
  onReset(() => {
    list.value = '';
    label.value = '';
    renderList();
    renderLabel();
    renderAnswer();
  });
}

function onListInput() {
  results.dictation.listText = $('#dict-list').value;
  results.dictation.items = parseList(results.dictation.listText).map((it) => ({
    name: it.name,
    qty: it.qty,
    unit: it.unit,
    guessed: it.qtyGuessed || it.unitGuessed,
  }));
  saveResults();
  renderList();
}

function renderList() {
  const items = parseList(results.dictation.listText || '');
  const body = $('#dict-table tbody');
  if (!items.length) {
    body.replaceChildren(el('tr', {}, el('td', { colspan: '3', class: 'muted', text: 'Пока пусто — продиктуйте список в поле выше.' })));
    return;
  }
  body.replaceChildren(
    ...items.map((it) =>
      el('tr', {},
        el('td', { text: it.name }),
        el('td', { class: it.qtyGuessed ? 'num muted' : 'num', title: it.qtyGuessed ? 'не названо — по умолчанию' : null, text: formatQty(it.qty) }),
        el('td', { class: it.unitGuessed ? 'muted' : null, title: it.unitGuessed ? 'не названо — по умолчанию' : null, text: it.unit }),
      ),
    ),
  );
}

function onLabelInput() {
  results.dictation.labelText = $('#dict-label').value;
  const r = parseLabelNumber(results.dictation.labelText);
  results.dictation.label = results.dictation.labelText.trim() ? r : null;
  saveResults();
  renderLabel();
}

function renderLabel() {
  const out = $('#dict-label-out');
  const text = results.dictation.labelText || '';
  if (!text.trim()) {
    out.textContent = '—';
    out.className = 'label-out muted';
    $('#dict-label-note').textContent = 'Например: «H0042», «Н0042», «аш 42», «h42», «аш сорок два».';
    return;
  }
  const r = parseLabelNumber(text);
  out.textContent = r.ok ? r.value : 'не распознано';
  out.className = `label-out ${r.ok ? '' : 'bad'}`.trim();
  $('#dict-label-note').textContent = r.note ? `Примечание: ${r.note}.` : 'Номер распознан.';
}

function answer(value) {
  results.dictation.offlineWorked = value;
  saveResults();
  renderAnswer();
  toast(`Записано: диктовка без сети работала — ${value}`);
}

function renderAnswer() {
  const v = results.dictation.offlineWorked;
  $('#dict-offline-answer').textContent = v ? `Ответ записан: ${v}` : 'Ответ ещё не записан.';
  $('#dict-offline-yes').setAttribute('aria-pressed', String(v === 'да'));
  $('#dict-offline-no').setAttribute('aria-pressed', String(v === 'нет'));
}
