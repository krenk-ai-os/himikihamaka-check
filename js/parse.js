// Разбор продиктованного текста: список вещей и номер наклейки.
// Модуль без DOM, чтобы его можно было проверять отдельно.

// ---------- числа словами ----------

const NUMBER_WORDS = {
  'ноль': 0, 'нуль': 0,
  'один': 1, 'одна': 1, 'одно': 1, 'одну': 1, 'одной': 1,
  'два': 2, 'две': 2, 'три': 3, 'четыре': 4, 'пять': 5,
  'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9,
  'десять': 10, 'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13,
  'четырнадцать': 14, 'пятнадцать': 15, 'шестнадцать': 16,
  'семнадцать': 17, 'восемнадцать': 18, 'девятнадцать': 19,
  'двадцать': 20, 'тридцать': 30, 'сорок': 40, 'пятьдесят': 50,
  'шестьдесят': 60, 'семьдесят': 70, 'восемьдесят': 80, 'девяносто': 90,
  'сто': 100, 'двести': 200, 'триста': 300, 'четыреста': 400, 'пятьсот': 500,
  'шестьсот': 600, 'семьсот': 700, 'восемьсот': 800, 'девятьсот': 900,
};

const THOUSAND_WORDS = new Set(['тысяча', 'тысячи', 'тысяч', 'тысячу']);

// Слова, которые сами означают количество.
const QUANTITY_WORDS = {
  'десяток': 10, 'десятка': 10, 'десятков': 10,
  'дюжина': 12, 'дюжину': 12, 'дюжины': 12,
  'полтора': 1.5, 'полторы': 1.5,
};

// Единицы: каноническое обозначение -> формы, которые может выдать диктовка.
const UNIT_FORMS = [
  ['шт', ['шт', 'штук', 'штука', 'штуки', 'штуку', 'штучка', 'штучки', 'штучек']],
  ['м', ['м', 'метр', 'метра', 'метров', 'метре']],
  ['см', ['см', 'сантиметр', 'сантиметра', 'сантиметров']],
  ['мм', ['мм', 'миллиметр', 'миллиметра', 'миллиметров']],
  ['кг', ['кг', 'килограмм', 'килограмма', 'килограммов', 'кило']],
  ['г', ['г', 'гр', 'грамм', 'грамма', 'граммов']],
  ['л', ['л', 'литр', 'литра', 'литров']],
  ['мл', ['мл', 'миллилитр', 'миллилитра', 'миллилитров']],
  ['пачка', ['пачка', 'пачки', 'пачек', 'пачку', 'пач']],
  ['упаковка', ['упаковка', 'упаковки', 'упаковок', 'упаковку', 'уп', 'упак']],
  ['рулон', ['рулон', 'рулона', 'рулонов']],
  ['коробка', ['коробка', 'коробки', 'коробок', 'коробку', 'кор']],
  ['мешок', ['мешок', 'мешка', 'мешков']],
  ['банка', ['банка', 'банки', 'банок', 'банку']],
  ['бутылка', ['бутылка', 'бутылки', 'бутылок', 'бутылку']],
  ['пара', ['пара', 'пары', 'пар', 'пару']],
  ['комплект', ['комплект', 'комплекта', 'комплектов', 'компл']],
  ['набор', ['набор', 'набора', 'наборов']],
];

const UNIT_LOOKUP = new Map();
for (const [canon, forms] of UNIT_FORMS) {
  for (const f of forms) UNIT_LOOKUP.set(f, canon);
}

const DECIMAL_RE = /^\d+(?:[.,]\d+)?$/;
const NUMBER_WITH_UNIT_RE = /^(\d+(?:[.,]\d+)?)([a-zа-я]+)\.?$/;

function norm(word) {
  return word.toLowerCase().replace(/ё/g, 'е').replace(/^[«"'(]+|[»"').!?:;]+$/g, '');
}

function toNumber(text) {
  return Number(text.replace(',', '.'));
}

// ---------- разбиение на позиции ----------

/**
 * Делит текст по запятым, точкам с запятой, переводам строки и концам предложений,
 * но не трогает запятую или точку между цифрами («2,5», «1.5»).
 */
export function splitItems(text) {
  const items = [];
  let current = '';
  const s = String(text || '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prev = s[i - 1] || '';
    const next = s[i + 1] || '';
    const betweenDigits = /\d/.test(prev) && /\d/.test(next);
    const isSeparator =
      ch === '\n' || ch === '\r' || ch === ';' ||
      (ch === ',' && !betweenDigits) ||
      (ch === '.' && !betweenDigits && (next === '' || /\s/.test(next)));
    if (isSeparator) {
      items.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  items.push(current);
  return items.map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

// ---------- разбор одной позиции ----------

// Пытается прочитать число начиная с токена i. Возвращает {value, length} или null.
function readNumberAt(tokens, i) {
  const t = tokens[i].norm;
  if (DECIMAL_RE.test(t)) return { value: toNumber(t), length: 1 };
  if (t in QUANTITY_WORDS) return { value: QUANTITY_WORDS[t], length: 1 };
  if (!(t in NUMBER_WORDS) && !THOUSAND_WORDS.has(t)) return null;

  // Составное число словами: «двадцать пять», «сто двадцать», «две тысячи».
  let total = 0;
  let group = 0;
  let lastMagnitude = Infinity;
  let j = i;
  while (j < tokens.length) {
    const w = tokens[j].norm;
    if (THOUSAND_WORDS.has(w)) {
      total += (group || 1) * 1000;
      group = 0;
      lastMagnitude = 1000;
      j++;
      continue;
    }
    if (!(w in NUMBER_WORDS)) break;
    const v = NUMBER_WORDS[w];
    const magnitude = v >= 100 ? 100 : v >= 20 ? 10 : 1;
    if (j > i && (magnitude >= lastMagnitude || v === 0)) break;
    group += v;
    lastMagnitude = v >= 10 && v < 20 ? 1 : magnitude; // «двенадцать» закрывает разряд единиц
    j++;
  }
  total += group;
  // «два десятка» = 20
  if (j < tokens.length && /^десятк/.test(tokens[j].norm)) {
    return { value: total * 10, length: j - i + 1 };
  }
  return { value: total, length: j - i };
}

function unitAt(tokens, i) {
  if (i < 0 || i >= tokens.length) return null;
  return UNIT_LOOKUP.get(tokens[i].norm) || null;
}

/**
 * Разбирает одну позицию: «шурупы 3 штуки», «2,5 метра кабеля», «две пачки соли».
 * Возвращает {name, qty, unit, qtyGuessed, unitGuessed, source}.
 */
export function parseItem(source) {
  const raw = String(source || '').trim();
  let tokens = raw.split(/\s+/).filter(Boolean).flatMap((w) => {
    const n = norm(w);
    const m = n.match(NUMBER_WITH_UNIT_RE);
    if (m && UNIT_LOOKUP.has(m[2])) {
      return [{ raw: m[1], norm: m[1] }, { raw: m[2], norm: m[2] }];
    }
    return [{ raw: w, norm: n }];
  });
  // Ведущее «и» («…, и шурупы»)
  if (tokens.length > 1 && tokens[0].norm === 'и') tokens = tokens.slice(1);

  let qty = null;
  let unit = null;
  const used = new Set();

  for (let i = 0; i < tokens.length && qty === null; i++) {
    const num = readNumberAt(tokens, i);
    if (!num || num.length === 0) continue;
    qty = num.value;
    for (let k = 0; k < num.length; k++) used.add(i + k);
    const after = unitAt(tokens, i + num.length);
    if (after) {
      unit = after;
      used.add(i + num.length);
    } else {
      const before = unitAt(tokens, i - 1);
      if (before && !used.has(i - 1)) {
        unit = before;
        used.add(i - 1);
      }
    }
  }

  // Единица без числа: «пачка соли», «рулон скотча».
  if (unit === null) {
    for (let i = 0; i < tokens.length; i++) {
      if (used.has(i)) continue;
      const u = unitAt(tokens, i);
      // Однобуквенные «м», «г», «л» без числа — скорее часть названия.
      if (u && tokens[i].norm.length > 2) {
        unit = u;
        used.add(i);
        break;
      }
    }
  }

  const name = tokens
    .filter((_, i) => !used.has(i))
    .map((t) => t.raw)
    .join(' ')
    .replace(/^[\s,.:;–—-]+|[\s,.:;–—-]+$/g, '');

  const qtyGuessed = qty === null;
  const unitGuessed = unit === null;
  return {
    source: raw,
    name: name || '—',
    qty: qtyGuessed ? 1 : qty,
    unit: unitGuessed ? 'шт' : unit,
    qtyGuessed,
    unitGuessed,
  };
}

export function parseList(text) {
  return splitItems(text).map(parseItem);
}

export function formatQty(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 3 });
}

// ---------- номер наклейки ----------

// Буква-префикс: латинская или кириллическая, а также её название словами.
const PREFIXES = [
  { letter: 'H', re: /^(?:h|н|аш|аж|эйч|эш|хэ)(?![a-zа-я])/ },
  { letter: 'T', re: /^(?:t|т|тэ|ти)(?![a-zа-я])/ },
];

/**
 * «H0042», «Н0042» (кириллица), «аш 42», «h42», «аш сорок два», «аш ноль ноль четыре два» → «H0042».
 * Возвращает {ok, value, note}.
 */
export function parseLabelNumber(input) {
  let s = String(input || '').trim().toLowerCase().replace(/ё/g, 'е');
  if (!s) return { ok: false, value: '', note: 'пусто' };
  s = s.replace(/^(?:номер|наклейка|метка)\s+/, '');

  let letter = null;
  for (const p of PREFIXES) {
    const m = s.match(p.re);
    if (m) {
      letter = p.letter;
      s = s.slice(m[0].length);
      break;
    }
  }
  s = s.replace(/[\s\-–—_:#№.]+/g, ' ').trim();

  // Цифры и числа словами склеиваются по группам: «ноль ноль сорок два» → «0» «0» «42».
  const tokens = s.split(' ').filter(Boolean).map((w) => ({ raw: w, norm: norm(w) }));
  let digits = '';
  for (let i = 0; i < tokens.length;) {
    const t = tokens[i].norm;
    if (/^\d+$/.test(t)) {
      digits += t;
      i++;
      continue;
    }
    if (t in NUMBER_WORDS || THOUSAND_WORDS.has(t)) {
      const num = readNumberAt(tokens, i);
      if (num && num.length > 0) {
        digits += String(num.value);
        i += num.length;
        continue;
      }
    }
    return { ok: false, value: '', note: `не понял «${tokens[i].raw}»` };
  }

  if (!digits) return { ok: false, value: '', note: 'нет цифр' };
  const note = letter ? '' : 'буква не распознана — подставлена H';
  return { ok: true, value: (letter || 'H') + digits.padStart(4, '0'), note };
}
