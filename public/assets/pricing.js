// Price engine. Runs in the browser (live estimate in the sell wizard) and on the server
// (the price stored with a listing is always recomputed there, never trusted from the client).
//
// Source: Apple_Used_Price_List_EN.xlsx. Values are in units of 10,000 KRW.
//   price = grade price (A / A- / B+ / B) for model + storage   — or the battery-below-standard price,
//                                                                  or the base "as-is" price
//         − deductions for each defect
//   never below the model's scrap price.

export const GRADE_ORDER = ['A', 'A-', 'B+', 'B', 'C'];
// Battery health required for each grade (from the list's grade criteria).
export const BATTERY_MIN = { A: 90, 'A-': 90, 'B+': 85, B: 81 };

// Fixed deductions taken from the "details & deduction criteria" notes in the list (10k KRW units).
const NOTE_DEDUCTIONS = {
  vibration: 2, charging: 2, buttons: 2, speaker: 2, // "No vibration / does not charge / buttons / no sound: -2 each"
  cameraButton: 2, // "iPhone 16 series and above: camera button defect or crack = -2"
  lensCracked: 2, // "Camera lens discoloration = -2"
  bentLight: 3, bentSevere: 15, // "Body damage / bulging body: -3 to -15"
  refurbished: 3, // "Overseas version / demo unit = -3"
  esimOnly: 10, // "eSIM overseas version = -10"
};
// The iPhone 17 rows have no scrap price; use the latest listed one (iPhone 16 series).
const SCRAP_FALLBACK = 5;

export const DEFAULTS = {
  powersOn: 'yes', imeiOk: 'yes', icloudOff: 'yes', refurbished: 'no', sim: 'sim',
  screen: 'A', body: 'A', backGlass: 'ok', lens: 'ok', bent: 'none',
  glass: 'ok', display: 'ok', battery: 100,
  faults: [], parts: { screen: 'none', battery: 'none', camera: 'none' },
};

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const worst = (...gs) => gs.reduce((w, g) => (g && GRADE_ORDER.indexOf(g) > GRADE_ORDER.indexOf(w) ? g : w), 'A');

export function normalize(answers = {}) {
  const a = { ...DEFAULTS, ...answers, parts: { ...DEFAULTS.parts, ...(answers.parts || {}) } };
  a.battery = Math.max(1, Math.min(100, Math.round(Number(a.battery) || 100)));
  a.faults = Array.isArray(a.faults) ? a.faults : [];
  return a;
}

// Cosmetic grade from the seller's answers. A cracked screen/back glass, a broken display or a badly
// bent body takes the phone out of the graded prices to the base ("as-is") price, as the list does.
export function conditionGrade(answers) {
  const a = normalize(answers);
  let g = worst(a.screen, a.body);
  if (a.lens === 'scratched') g = worst(g, 'B+');
  if (a.lens === 'cracked') g = worst(g, 'B');
  if (a.display === 'minor') g = worst(g, 'B+'); // A/A- require no image retention
  if (a.glass === 'cracked' || a.display === 'major' || a.backGlass === 'cracked' || a.bent === 'severe') g = 'C';
  return g;
}

export function toUzs(units, s) {
  const raw = units * s.unitKRW * s.krwToUzs * (s.multiplier || 1);
  const step = s.roundTo || 1000;
  return Math.max(0, Math.round(raw / step) * step);
}

// Highest and lowest list price for a model (or one storage), used for "from … to …" hints.
export function priceSpan(model, storageLabel) {
  const rows = storageLabel ? model.storages.filter((r) => r.label === storageLabel) : model.storages;
  const vals = rows.flatMap((r) => [r.A, r['A-'], r['B+'], r.B, r.battA, r.battBp, r.base]).filter(isNum);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function basePrice(row, grade, battery, batteryAsItem) {
  const gradeName = (g) => `${g} holat narxi`;
  if (grade === 'C' || !isNum(row[grade])) {
    return { units: row.base, label: grade === 'C' ? 'Asosiy narx (holati B dan past)' : 'Asosiy narx', batteryItem: 0 };
  }
  if (battery >= BATTERY_MIN[grade]) return { units: row[grade], label: gradeName(grade), batteryItem: 0 };
  // iPhone SE 2/3: low battery is counted as one "item" in the combined parts deduction instead.
  if (batteryAsItem) return { units: row[grade], label: gradeName(grade), batteryItem: 1 };
  if ((grade === 'A' || grade === 'A-') && isNum(row.battA)) {
    return { units: row.battA, label: `${grade} holat, batareya ${BATTERY_MIN[grade]}% dan past`, batteryItem: 0 };
  }
  if (grade === 'B+' && isNum(row.battBp)) {
    return { units: row.battBp, label: 'B+ holat, batareya 85% dan past', batteryItem: 0 };
  }
  // No battery column for this model: fall to the best lower grade whose battery requirement is met.
  const lower = GRADE_ORDER.slice(GRADE_ORDER.indexOf(grade) + 1, 4).find((g) => battery >= BATTERY_MIN[g] && isNum(row[g]));
  if (lower) return { units: row[lower], label: `${lower} holat narxi (batareya ${battery}%)`, batteryItem: 0 };
  return { units: row.base, label: `Asosiy narx (batareya ${battery}%)`, batteryItem: 0 };
}

/**
 * @returns {{status:'ok'|'scrap'|'blocked', reason?:string, grade?:string, units?:number, uzs?:number,
 *            low?:number, high?:number, lines?:{label:string, units:number, uzs:number}[], floored?:boolean}}
 */
export function estimate(model, storageLabel, answers, settings) {
  const a = normalize(answers);
  const row = model.storages.find((r) => r.label === storageLabel);
  if (!row) return { status: 'blocked', reason: 'storage' };
  if (a.icloudOff === 'no') return { status: 'blocked', reason: 'icloud' };

  const d = model.deductions;
  const scrap = isNum(model.scrap) ? model.scrap : SCRAP_FALLBACK;
  const lines = [];
  const take = (label, units) => { if (isNum(units) && units > 0) lines.push({ label, units: -units }); };

  if (a.powersOn === 'no' || a.imeiOk === 'no') {
    lines.push({ label: a.powersOn === 'no' ? 'Yoqilmaydigan telefon (ehtiyot qism narxi)' : 'IMEI koʻrinmaydi (ehtiyot qism narxi)', units: scrap });
    return finish('scrap', 'C', lines, scrap, false, settings);
  }

  const grade = conditionGrade(a);
  const base = basePrice(row, grade, a.battery, !!model.tiers?.batteryAsItem);
  lines.push({ label: base.label, units: base.units });

  // Screen: a broken display costs the full display deduction; otherwise glass and minor marks add up.
  if (a.display === 'major') take('Displey nosoz', d.display);
  else {
    if (a.glass === 'cracked') take('Ekran oynasi singan', d.glass);
    // When the list has no separate minor value, use half the display deduction ("…or at half the LCD price").
    if (a.display === 'minor') take('Displeyda yengil iz', isNum(d.displayMinor) ? d.displayMinor : d.display / 2);
  }
  if (a.backGlass === 'cracked') take('Orqa oyna singan', d.backGlass);
  if (a.lens === 'cracked') take('Kamera oynasi singan yoki dogʻli', NOTE_DEDUCTIONS.lensCracked);
  if (a.bent === 'light') take('Korpus biroz egilgan', NOTE_DEDUCTIONS.bentLight);
  if (a.bent === 'severe') take('Korpus kuchli egilgan / shishgan', NOTE_DEDUCTIONS.bentSevere);

  const faultLabels = {
    biometric: model.bio === 'touch' ? 'Touch ID ishlamaydi' : 'Face ID ishlamaydi',
    camera: 'Kamera ishlamaydi', wifi: 'Wi‑Fi / Bluetooth / kompas nosoz', mic: 'Mikrofon ishlamaydi',
    trueTone: 'True Tone ishlamaydi', speaker: 'Dinamik ishlamaydi', charging: 'Zaryad olmaydi',
    vibration: 'Vibratsiya ishlamaydi', buttons: 'Tugmalar ishlamaydi', cameraButton: 'Camera Control nosoz',
  };
  for (const f of a.faults) {
    if (!(f in faultLabels)) continue;
    if (f === 'trueTone' && !model.trueTone) continue;
    if (f === 'cameraButton' && !model.cameraButton) continue;
    take(faultLabels[f], f in NOTE_DEDUCTIONS ? NOTE_DEDUCTIONS[f] : d[f]);
  }

  const parts = Object.values(a.parts);
  const genuine = parts.filter((p) => p === 'genuine').length;
  const unknown = parts.filter((p) => p === 'unknown').length;
  if (model.tiers?.batteryAsItem) {
    // SE 2/3: battery below standard + every replaced-part message count as items: 1 → -4, 2 → -6, 3+ → -8.
    const items = genuine + unknown + base.batteryItem;
    if (items > 0) {
      const what = [genuine + unknown > 0 ? 'almashtirilgan qism' : null, base.batteryItem ? 'batareya past' : null].filter(Boolean).join(', ');
      take(`${what[0].toUpperCase()}${what.slice(1)} (${items} ta)`, model.tiers.values[Math.min(items, model.tiers.values.length) - 1]);
    }
  } else {
    if (genuine > 0 && model.tiers) {
      const tier = model.tiers.values[Math.min(genuine, model.tiers.values.length) - 1];
      take(`Original qism almashtirilgan (${genuine} ta)`, tier === 'nonGenuine' ? d.nonGenuine : tier);
    }
    // Unknown-part deductions stack: one per part ("applied twice" for screen + battery).
    if (unknown > 0 && isNum(d.nonGenuine)) take(`Nomaʼlum qism xabari (${unknown} ta)`, unknown * d.nonGenuine);
  }

  if (a.refurbished === 'yes') take('Refurbished yoki demo', NOTE_DEDUCTIONS.refurbished);
  if (model.esimQ && a.sim === 'esim') take('Faqat eSIM versiya', NOTE_DEDUCTIONS.esimOnly);

  let total = lines.reduce((s, l) => s + l.units, 0);
  const floored = total < scrap;
  if (floored) total = scrap;
  return finish('ok', grade, lines, total, floored, settings);
}

function finish(status, grade, lines, units, floored, s) {
  const uzs = toUzs(units, s);
  const band = (k) => Math.round((uzs * k) / 10000) * 10000;
  return {
    status, grade, units, uzs, floored,
    low: band(0.95), high: band(1.05),
    lines: lines.map((l) => ({ ...l, uzs: toUzs(Math.abs(l.units), s) * Math.sign(l.units) })),
  };
}

// How an asking price compares to the system estimate (shown as a badge to buyers).
export function priceVerdict(price, est) {
  if (!est) return null;
  const r = price / est;
  if (r <= 0.92) return { k: 'deal', t: 'Arzon narx' };
  if (r <= 1.1) return { k: 'fair', t: 'Adolatli narx' };
  return { k: 'high', t: 'Qimmatroq' };
}
