// Sell page: everything on one page. Brand → device → model at the top; once a model is chosen every
// question that applies to it appears below, so any answer can be changed in place by scrolling up.
// A live price (iPhone) or condition grade (other devices) sits in the bottom bar, answers are kept as a
// draft, photos are shrunk on the device before upload. Which questions appear is set in categories.js.
import { estimate, priceVerdict, BATTERY_MIN } from './pricing.js';
import { qText, opt, faultText, koreanMobile, kakaoContact } from './questions.js';
import { CATEGORIES, BRANDS, brandOf, applies, faultsFor, extrasFor, batteryMode, hasParts, stepsFor } from './categories.js';
import { phoneArtSvg } from './art.js';
import { $, $$, L, store, toast, digits, fold, escHtml, icon } from './ui.js';
import { toKrw, fromKrw } from './money.js';
import { EXAMPLES } from './examples.js';

const t = L.t;
const boot = JSON.parse($('#boot').textContent);
const { models, settings, maxPhotos } = boot;
const form = $('#sell-form');
const btnNext = $('[data-next]');
const DRAFT = 'fb_sell_draft';
const CONTACT = 'fb_contact';

let cat = boot.startCat; // category shown in the model list
let browsing = true; // model list open (false = collapsed to the picked model)
let photos = []; // data URLs, already resized
let priceTouched = false;
let submitting = false;
const answeredOnce = new Set(); // questions answered at least once: only their first answer scrolls onward

// ---------- reading the form ----------
const val = (name) => {
  const el = form.elements[name];
  if (!el) return undefined;
  return el instanceof RadioNodeList || el.type === 'radio' ? form.querySelector(`input[name="${name}"]:checked`)?.value : el.value;
};
const model = () => models.find((m) => m.id === val('model')) || null;
const alive = () => val('powersOn') !== 'no';
const conf = (m) => CATEGORIES[m.category];

function answers() {
  const m = model();
  if (!m) return {};
  const c = conf(m);
  const mode = batteryMode(m);
  const a = {
    powersOn: val('powersOn'), icloudOff: val('icloudOff'), refurbished: val('refurbished'),
    connectivity: c.config.includes('connectivity') ? val('connectivity') : undefined,
    material: c.config.includes('material') ? val('material') : undefined,
    ram: c.config.includes('ram') && val('ram') ? +val('ram') : undefined,
    screen: val('screen'), body: val('body'),
    backGlass: applies('backGlass', m) ? val('backGlass') : 'ok',
    lens: c.looks.includes('lens') ? val('lens') : 'ok',
    bent: c.looks.includes('bent') ? val('bent') : 'none',
    inner: applies('inner', m) ? val('inner') : undefined,
    glass: val('glass'), display: val('display'),
    battery: mode === 'percent' && form.elements.battery.value ? +form.elements.battery.value : undefined,
    batteryLevel: mode === 'level' ? val('batteryLevel') : undefined,
    macBattery: mode === 'mac' ? val('macBattery') : undefined,
    cycles: mode === 'mac' && form.elements.cycles.value !== '' ? +form.elements.cycles.value : undefined,
    repair: hasParts(m) ? undefined : val('repair'),
    parts: hasParts(m) ? { screen: val('part_screen'), battery: val('part_battery'), camera: val('part_camera') } : undefined,
  };
  a.imeiOk = applies('imeiOk', m, a) ? val('imeiOk') : undefined;
  a.faults = $$('input[name="faults"]:checked').map((x) => x.value).filter((k) => faultsFor(m, a).includes(k));
  for (const k of Object.keys(a)) if (a[k] === undefined || a[k] === '') delete a[k];
  return a;
}

// ---------- sections ----------
const activeSections = () => (model() ? stepsFor(model(), alive()) : ['model']);

// Returns the first unanswered question (element) in a section, or null if the section is complete.
function missing(k) {
  const m = model();
  const need = (name) => (val(name) ? null : form.querySelector(`[data-q="${name}"]`) || form.querySelector(`[name="${name}"]`));
  if (!m) return k === 'model' ? $('.model-list') : null;
  const c = conf(m);
  const a = answers();
  switch (k) {
    case 'config':
      if (c.config.includes('ram') && !val('ram')) return $('[data-ram]');
      if (!val('storage')) return $('[data-storages]');
      if (c.config.includes('material') && need('material')) return need('material');
      if (c.config.includes('connectivity') && need('connectivity')) return need('connectivity');
      return val('color') ? null : $('[data-colors]');
    case 'basic':
      return need('powersOn') || (alive() && applies('imeiOk', m, a) && need('imeiOk')) || need('icloudOff') || (alive() && need('refurbished'));
    case 'looks':
      return need('screen') || (applies('inner', m) && need('inner')) || need('body') || (applies('backGlass', m) && need('backGlass'))
        || (c.looks.includes('lens') && need('lens')) || (c.looks.includes('bent') && need('bent'));
    case 'screen': {
      if (need('glass')) return need('glass');
      if (!alive()) return null;
      if (need('display')) return need('display');
      const mode = batteryMode(m);
      if (mode === 'percent') { const b = +form.elements.battery.value; return b >= 1 && b <= 100 ? null : form.elements.battery.closest('.q'); }
      if (mode === 'level') return need('batteryLevel');
      if (need('macBattery')) return need('macBattery');
      const cy = form.elements.cycles.value;
      return cy === '' || (Number.isInteger(+cy) && +cy >= 0 && +cy <= 5000) ? null : form.elements.cycles.closest('.field');
    }
    case 'faults': return hasParts(m) ? null : need('repair');
    case 'details': {
      if (!(L.toKrw(+digits(form.elements.price.value)) >= 10000)) return form.elements.price.closest('.field');
      if (!form.elements.region.value) return form.elements.region.closest('.field');
      if (form.elements.name.value.trim().length < 2) return form.elements.name.closest('.field');
      if (!koreanMobile(form.elements.phone.value)) return form.elements.phone.closest('.field');
      if (kakaoContact(form.elements.kakao.value) === null) return form.elements.kakao.closest('.field');
      return null;
    }
    default: return null;
  }
}
const blocked = () => val('icloudOff') === 'no';

// The first thing still to do, top to bottom (or null when the listing can be published).
function firstGap() {
  if (!model()) return $('.model-list');
  for (const s of activeSections()) {
    if (s === 'model' || s === 'result') continue;
    const g = missing(s);
    if (g) return g;
    if (s === 'basic' && blocked()) return $('[data-icloud-block]');
  }
  return null;
}

// Show the sections that apply, number them, tick the complete ones, collapse the model list.
function layoutSections() {
  const m = model();
  const list = activeSections();
  let n = 0;
  let done = 0;
  let total = 0;
  for (const sec of $$('.step')) {
    const k = sec.dataset.step;
    const on = list.includes(k);
    sec.hidden = !on;
    if (!on) continue;
    n++;
    const num = sec.querySelector('[data-sec-num]');
    if (num) num.textContent = n;
    if (k === 'result') continue;
    total++;
    const complete = k === 'model' ? !!m : !missing(k) && !(k === 'basic' && blocked());
    sec.classList.toggle('is-done', complete);
    if (complete) done++;
  }
  $('[data-progress]').style.width = `${m ? (done / total) * 100 : 0}%`;
  $('[data-model-picked]').hidden = !m || browsing;
  $('[data-model-browser]').hidden = !!m && !browsing;
  if (m) {
    const color = m.colors.find((c) => c.k === val('color'));
    $('[data-picked-art]').innerHTML = phoneArtSvg(m.art, color?.hex, m.name);
    $('[data-picked-name]').textContent = m.name;
    $('[data-picked-sub]').textContent = [m.year, specText(m), color && L.colors[color.k]].filter(Boolean).join(' · ');
  }
  btnNext.textContent = firstGap() ? t.continue : t.publish;
}

function highlight(el, message) {
  el.classList.add('is-missing');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => el.classList.remove('is-missing'), 1600);
  if (message) toast(message);
}
// Bottom button: takes you to the next unanswered question, or publishes when everything is filled in.
function goNext() {
  const gap = firstGap();
  if (!gap) return submit();
  if (gap === $('.model-list')) { browsing = true; layoutSections(); }
  highlight(gap, gap.matches('[data-icloud-block]') ? t.toastIcloud : step(gap) === 'details' ? t.toastFill : t.toastAnswer);
}
const step = (el) => el.closest('.step')?.dataset.step;
btnNext.addEventListener('click', goNext);

// ---------- model picker: brand, device, series, search ----------
const search = $('[data-model-search]');
// Series chips only: model groups in the list also carry data-series, so always scope to the filter row.
const SERIES_CHIPS = '.series-filter [data-series]';
let series = $(`${SERIES_CHIPS}.is-on`)?.dataset.series || '';
function setSeries(s) {
  series = s;
  for (const c of $$(SERIES_CHIPS)) {
    const on = c.dataset.series === s;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', String(on));
  }
}
// Brand first (Apple / Samsung), then that brand's devices: only the chosen brand's categories are shown.
const lastCatOfBrand = {};
function setCat(c, { keepSeries = false } = {}) {
  cat = c;
  const brand = brandOf(c);
  lastCatOfBrand[brand] = c;
  for (const b of $$('[data-brand]')) {
    const on = b.dataset.brand === brand;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  }
  $('.cat-pick').hidden = BRANDS[brand].length < 2;
  for (const b of $$('[data-cat]')) {
    const on = b.dataset.cat === c;
    b.hidden = b.dataset.catBrand !== brand;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  }
  for (const chip of $$('[data-series-cat]')) chip.hidden = chip.dataset.seriesCat !== c;
  if (!keepSeries) setSeries('');
}
$$('[data-cat]').forEach((b) => b.addEventListener('click', () => { setCat(b.dataset.cat); search.value = ''; filterModels(); }));
$$('[data-brand]').forEach((b) => b.addEventListener('click', () => {
  const brand = b.dataset.brand;
  if (brandOf(cat) === brand) return;
  setCat(lastCatOfBrand[brand] || BRANDS[brand][0]);
  search.value = '';
  filterModels();
}));
$$(SERIES_CHIPS).forEach((c) => c.addEventListener('click', () => { setSeries(c.dataset.series); search.value = ''; filterModels(); }));
$('[data-change-model]').addEventListener('click', () => {
  browsing = true;
  if (model()) setCat(model().category, { keepSeries: true });
  filterModels();
  layoutSections();
  $('[data-step="model"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function filterModels() {
  const words = fold(search.value).replace(/iphone|айфон|ayfon/g, ' ').split(' ').filter(Boolean);
  let any = false;
  for (const g of $$('[data-group]')) {
    // Typing searches every category; otherwise show the chosen category (and series).
    const inView = words.length ? true : g.dataset.groupCat === cat && (!series || g.dataset.series === series);
    let n = 0;
    for (const o of $$('.model-opt', g)) {
      const hay = ` ${o.dataset.name}`;
      const ok = inView && words.every((w) => hay.includes(` ${w}`));
      o.hidden = !ok;
      if (ok) n++;
    }
    g.hidden = n === 0;
    any ||= n > 0;
  }
  $('[data-model-empty]').hidden = any;
}
search.addEventListener('input', filterModels);

form.addEventListener('change', (e) => {
  const el = e.target;
  if (el.name === 'model') {
    // Picking a model collapses the list and brings up its first questions.
    applyModel();
    browsing = false;
    update();
    $('[data-step="config"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (['powersOn', 'icloudOff', 'connectivity'].includes(el.name)) applyConditions();
  if (el.type === 'radio' || el.type === 'checkbox') markChecked();
  const firstAnswer = el.type === 'radio' && !el.name.startsWith('_') && !answeredOnce.has(el.name);
  if (el.type === 'radio') answeredOnce.add(el.name);
  update();
  // On a question's first answer, bring the next open question into view — only if it is below the visible
  // area, so the page never moves under a finger that is about to tap. Changing an earlier answer later
  // does not jump the page.
  if (firstAnswer) {
    const gap = firstGap();
    if (gap && gap.matches('.q, [data-storages], [data-ram], [data-colors]') && (el.compareDocumentPosition(gap) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      setTimeout(() => {
        const bar = $('.sell-bar')?.offsetHeight || 0;
        if (gap.getBoundingClientRect().top > window.innerHeight - bar - 80) gap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  }
});
form.addEventListener('input', (e) => {
  // Quick asking prices (−5% / estimate / +5%). Handled on 'input': update() redraws these buttons, so their
  // 'change' event would fire on a detached element and never reach a listener.
  const quick = e.target.closest('[data-quick]');
  if (quick) {
    form.elements.price.value = L.group(quickPrice(currentEstimate(), +quick.dataset.quick));
    priceTouched = true;
  }
  if (e.target === form.elements.price) priceTouched = true;
  if (e.target.matches('[data-phone]')) formatPhone(e.target);
  if (e.target.matches('[data-counter]')) $('[data-counter-out]').textContent = `${e.target.value.length} / 1000`;
  update();
});
form.addEventListener('submit', (e) => { e.preventDefault(); goNext(); });
// Enter in a text field shows the next open question instead of submitting half a form.
form.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || !e.target.matches('input:not([type=search])')) return;
  e.preventDefault();
  const gap = firstGap();
  if (gap) highlight(gap);
});

// ---------- per-model options and wording ----------
const radio = (name, value, label, checked) => `<label class="opt" data-v="${escHtml(value)}"><input type="radio" name="${name}" value="${escHtml(value)}" required ${checked ? 'checked' : ''}><span class="opt-box"><span class="opt-t">${escHtml(label)}</span></span><span class="opt-check">${icon('check')}</span></label>`;

function applyModel() {
  const m = model();
  if (!m) return;
  const keep = { storage: val('storage'), color: val('color'), ram: val('ram'), material: val('material'), connectivity: val('connectivity') };
  $('[data-storage-legend]').textContent = m.category === 'macbook' ? t.ssdQ : m.category === 'watch' ? t.sizeQ : t.storageQ;
  // A spec with only one possible value (e.g. Apple Watch Ultra: 49 mm, titanium, cellular) is pre-selected.
  const only = (list) => (list || []).length === 1;
  $('[data-storages]').innerHTML = m.storages.map((s) => radio('storage', s.label, s.label, s.label === keep.storage || only(m.storages))).join('');
  $('[data-ram]').innerHTML = (m.ram || []).map((r) => radio('ram', String(r), `${r} GB`, String(r) === keep.ram || only(m.ram))).join('');
  $('[data-q="material"] [data-opts]').innerHTML = (m.materials || []).map((v) => radio('material', v, opt(L, 'material', v, m.category).t, v === keep.material || only(m.materials))).join('');
  $('[data-q="connectivity"] [data-opts]').innerHTML = (m.connectivity || []).map((v) => radio('connectivity', v, opt(L, 'connectivity', v, m.category).t, v === keep.connectivity || only(m.connectivity))).join('');
  $('[data-colors]').innerHTML = m.colors.map((col) => `<label class="swatch-opt"><input type="radio" name="color" value="${col.k}" required ${col.k === keep.color ? 'checked' : ''}><span class="swatch-dot" style="--c:${col.hex}"></span>${escHtml(L.colors[col.k] || col.k)}</label>`).join('');
  // Reword every question for this category (e.g. Samsung account instead of iCloud, "Case" on a watch).
  for (const fs of $$('[data-q]')) {
    const q = qText(L, fs.dataset.q, m.category);
    const title = fs.querySelector('[data-q-title]');
    if (title && q.title) title.textContent = q.title;
    const hint = fs.querySelector('[data-q-hint]');
    if (hint) { hint.hidden = !q.hint; hint.querySelector('span').textContent = q.hint || ''; }
    for (const o of $$('.opt[data-v]', fs)) {
      const w = opt(L, fs.dataset.q, o.dataset.v, m.category);
      o.querySelector('.opt-t').textContent = w.t;
      const d = o.querySelector('.opt-d');
      if (d) d.textContent = w.d;
    }
  }
  for (const row of $$('[data-fault]')) row.querySelector('[data-fault-label]').textContent = faultText(L, row.dataset.fault, m).q;
  setCat(m.category, { keepSeries: true });
  applyConditions();
  markChecked();
}

// Show only the questions, faults and extras that apply to this model and the answers so far.
const COND = {
  imeiOk: (m, a) => alive() && applies('imeiOk', m, a),
  ram: (m) => conf(m).config.includes('ram'),
  material: (m) => conf(m).config.includes('material'),
  connectivity: (m) => conf(m).config.includes('connectivity'),
  inner: (m) => applies('inner', m),
  backGlass: (m) => applies('backGlass', m),
  lens: (m) => conf(m).looks.includes('lens'),
  bent: (m) => conf(m).looks.includes('bent'),
  'battery-percent': (m) => batteryMode(m) === 'percent',
  'battery-level': (m) => batteryMode(m) === 'level',
  'battery-mac': (m) => batteryMode(m) === 'mac',
  repair: (m) => !hasParts(m),
};
function applyConditions() {
  const m = model();
  const a = answers();
  for (const el of $$('[data-if]')) {
    const test = COND[el.dataset.if];
    el.hidden = !(el.dataset.if === 'powersOn' ? alive() : m && test && test(m, a));
  }
  const faults = m ? faultsFor(m, a) : [];
  for (const row of $$('[data-fault]')) row.hidden = !faults.includes(row.dataset.fault);
  const extras = m ? extrasFor(m) : [];
  for (const x of $$('[data-extra]')) x.hidden = !extras.includes(x.dataset.extra);
  $('[data-icloud-block]').hidden = !blocked();
}

// Fallback highlight for browsers without :has().
function markChecked() {
  for (const el of $$('.opt, .model-opt, .swatch-opt, .check')) el.classList.toggle('is-checked', !!el.querySelector('input:checked'));
}

// ---------- battery ----------
const range = $('[data-battery-range]');
const num = $('[data-battery-num]');
range.addEventListener('input', () => { num.value = range.value; batteryHint(); update(); });
num.addEventListener('input', () => {
  const v = Math.min(100, +digits(num.value).slice(0, 3));
  if (num.value !== '' && String(v) !== num.value) num.value = v || '';
  range.value = Math.max(50, v || 100);
  batteryHint();
});
// Price effect of battery health is only known for iPhones (they have a price list).
function batteryHint() {
  const b = +num.value;
  const el = $('[data-battery-hint]');
  if (!b || !model()?.priced) { el.textContent = ''; return; }
  const h = t.batteryHints;
  el.textContent = b >= BATTERY_MIN.A ? h.great : b >= BATTERY_MIN['B+'] ? h.good : b >= BATTERY_MIN.B ? h.fair : h.poor;
}

// ---------- live price / grade ----------
function currentEstimate() {
  const m = model();
  const storage = val('storage');
  if (!m || !storage) return null;
  return estimate(m, storage, answers(), settings);
}
const conditionDone = () => !missing('basic') && !missing('looks') && !missing('screen');
const specText = (m) => [m?.category === 'macbook' && val('ram') ? `${val('ram')} GB` : null, val('storage')].filter(Boolean).join(' · ');

function update() {
  const m = model();
  const est = currentEstimate();
  const label = $('[data-bar-label]');
  const out = $('[data-bar-price]');
  if (!m || !est) { label.textContent = m && !m.priced ? t.barGrade : t.estPrice; out.textContent = '—'; }
  else if (!m.priced) {
    label.textContent = t.barGrade;
    out.textContent = est.status === 'blocked' ? t.barNoPrice : conditionDone() ? `${est.grade.replace('-', '−')} · ${L.grades[est.grade].name}` : '—';
  } else if (est.status === 'blocked') {
    label.textContent = t.barIcloud;
    out.textContent = t.barNoPrice;
  } else if (!conditionDone()) {
    // Unanswered questions count as "perfect", so this is the ceiling until the condition questions are done.
    label.textContent = t.barMax;
    out.textContent = L.price(est.krw);
  } else {
    label.textContent = t.estPrice;
    out.textContent = L.price(est.krw);
  }

  // Desktop summary card.
  const color = m?.colors.find((c) => c.k === val('color'));
  $('[data-summary-art]').innerHTML = m ? phoneArtSvg(m.art, color?.hex, m.name) : '';
  $('[data-summary-model]').textContent = m ? m.name : t.pickModel;
  $('[data-summary-sub]').textContent = [specText(m), color && L.colors[color.k]].filter(Boolean).join(' · ');
  $('[data-summary-label]').textContent = m && !m.priced ? t.barGrade : t.estPrice;
  $('[data-summary-price]').textContent = out.textContent;
  $('[data-summary-lines]').innerHTML = conditionDone() && est?.lines?.length ? linesHtml(est) : '';

  renderResult();
  // Until the seller types their own price, the asking price follows the estimate.
  if (!priceTouched && est?.krw && conditionDone()) form.elements.price.value = L.money(est.krw);
  priceHint();
  $('[data-all-ok]').hidden = $$('input[name="faults"]:checked').some((x) => !x.closest('[hidden]'));
  layoutSections();
  saveDraft();
}

const linesHtml = (est) => est.lines.map((l) => `<li><span>${escHtml(L.line(l, model()))}</span><b class="${l.units < 0 ? 'neg' : ''}">${l.units < 0 ? '−' : ''}${L.price(Math.abs(l.krw))}</b></li>`).join('');
const gradeChip = (g) => `<span class="grade grade-${g === 'A' || g === 'A-' ? 'a' : g === 'C' ? 'c' : 'b'}">${g.replace('-', '−')} · ${L.grades[g].name}</span>`;

function renderResult() {
  const box = $('[data-result]');
  const m = model();
  const est = currentEstimate();
  if (!m) { box.innerHTML = ''; return; }
  if (!est || est.status === 'blocked' || !conditionDone()) {
    box.innerHTML = `<p class="result-pending muted">${icon('info')}<span>${escHtml(t.resultPending)}</span></p>`;
    return;
  }
  const color = m.colors.find((c) => c.k === val('color'));
  const a = answers();
  const top = `<div class="result-top">${phoneArtSvg(m.art, color?.hex, m.name)}
      <div><h3>${escHtml(m.name)}, ${escHtml(specText(m))}</h3>
      <p>${gradeChip(est.grade)}${color ? ` <span>${escHtml(L.colors[color.k])}</span>` : ''}${a.battery ? ` <span class="bat">${icon('battery')}${a.battery}%</span>` : ''}</p></div>
    </div>`;
  if (est.status === 'unpriced') {
    box.innerHTML = `<div class="result-card">${top}
      <div class="notice notice-info">${icon('info')}<div><b>${escHtml(t.noAutoTitle(L.cats[m.category]))}</b> ${escHtml(t.noAutoText)}</div></div></div>`;
    return;
  }
  const reason = est.status === 'scrap'
    ? `<div class="notice notice-warn">${icon('info')}<div>${a.powersOn === 'no' ? t.scrapDead : t.scrapImei}</div></div>` : '';
  const floor = est.floored ? `<p class="result-note">${icon('info')}${t.floorNote}</p>` : '';
  box.innerHTML = `<div class="result-card">${top}
    <p class="result-label">${t.estPrice}</p>
    <p class="result-price">${L.price(est.krw)}</p>
    <p class="price-alt">≈ ${L.alt(est.krw)}</p>
    <p class="result-range">${t.resultRange} ${L.price(est.low)} – ${L.price(est.high)}</p>
    ${reason}
    <ul class="result-lines">${linesHtml(est)}<li class="total"><span>${t.total}</span><b>${L.price(est.krw)}</b></li></ul>
    ${floor}
    <p class="result-note">${icon('info')}${t.resultNote}${L.cur === 'USD' ? ` ${t.rateNote(L.group(L.krwPerUsd))}` : ''}</p>
  </div>`;
}

// ---------- listing details ----------
// Quick asking prices: the estimate itself, or 5% either side rounded to a tidy amount.
const quickPrice = (est, f) => (f === 1 ? fromKrw(est.krw, L.cur, L.krwPerUsd) : L.round(est.krw * f));
function priceHint() {
  const est = currentEstimate();
  const el = $('[data-price-hint]');
  if (est?.status === 'unpriced') { el.textContent = t.setOwnPrice; return; }
  const p = +digits(form.elements.price.value);
  if (!est || est.status === 'blocked' || !conditionDone()) { el.innerHTML = ''; return; }
  const v = p ? priceVerdict(L.toKrw(p), est.krw) : null;
  el.innerHTML = `${v ? `<span class="verdict verdict-${v.k}">${L.verdict[v.k]}</span>` : ''} ${t.systemEst} <b>${L.price(est.krw)}</b>
    <span class="seg" role="group" aria-label="${t.quickAria}">
      ${[['0.95', '−5%'], ['1', t.quickEst], ['1.05', '+5%']].map(([f, text]) => `<label><input type="radio" name="_quick" data-quick="${f}"${p === quickPrice(est, +f) ? ' checked' : ''}><span>${text}</span></label>`).join('')}
    </span>`;
}

// Korean mobile number as typed: 010-1234-5678 (a pasted +82 10… becomes 010…).
function formatPhone(el) {
  let d = digits(el.value);
  if (d.startsWith('82')) d = `0${d.slice(2).replace(/^0/, '')}`;
  d = d.slice(0, 11);
  const mid = d.length === 10 && !d.startsWith('010') ? 6 : 7; // old 10-digit numbers: 011-123-4567
  el.value = [d.slice(0, 3), d.slice(3, mid), d.slice(mid)].filter(Boolean).join('-');
}

// ---------- photos: resized on the phone so uploads are small on mobile data ----------
const photoInput = $('[data-photo-input]');
photoInput.addEventListener('change', async () => {
  const files = [...photoInput.files].slice(0, maxPhotos - photos.length);
  if (photoInput.files.length > files.length) toast(t.maxPhotos(maxPhotos));
  photoInput.value = '';
  for (const f of files) {
    try { photos.push(await shrink(f)); } catch { toast(t.badPhoto); }
  }
  renderPhotos();
});
async function shrink(file, max = 1280) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(async () => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();
    return img;
  });
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.82);
}
function renderPhotos() {
  const box = $('[data-photos]');
  $$('.photo', box).forEach((x) => x.remove());
  const add = $('.photo-add', box);
  photos.forEach((src, i) => {
    const d = document.createElement('div');
    d.className = 'photo';
    d.innerHTML = `<img src="${src}" alt="${escHtml(t.photos)} ${i + 1}">${i === 0 ? `<span class="photo-main">${escHtml(t.mainPhoto)}</span>` : ''}<button type="button" data-remove="${i}" aria-label="${escHtml(t.removePhoto)}">${icon('close')}</button>`;
    box.insertBefore(d, add);
  });
  add.hidden = photos.length >= maxPhotos;
}
$('[data-photos]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-remove]');
  if (!b) return;
  photos.splice(+b.dataset.remove, 1);
  renderPhotos();
});

// ---------- submit ----------
async function submit() {
  if (submitting) return;
  const errBox = $('[data-submit-error]');
  errBox.hidden = true;
  submitting = true;
  btnNext.disabled = true;
  btnNext.textContent = t.publishing;
  const el = form.elements;
  const m = model();
  const a = answers();
  const payload = {
    model: m.id, storage: val('storage'), color: val('color'), answers: a,
    price: digits(el.price.value), currency: L.cur, region: el.region.value, name: el.name.value.trim(),
    phone: digits(el.phone.value), kakao: el.kakao.value.trim(), description: el.description.value.trim(),
    extras: Object.fromEntries(extrasFor(m).map((k) => [k, el[`extra_${k}`].checked])),
    photos,
  };
  try {
    const r = await fetch('/api/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || t.saveFailed);
    store.set('fb_mine', [{ id: data.id, token: data.token }, ...store.get('fb_mine', [])].slice(0, 50));
    store.set(CONTACT, { region: payload.region, name: payload.name, phone: el.phone.value, kakao: payload.kakao });
    store.session.del(DRAFT);
    location.href = data.url;
  } catch (err) {
    errBox.innerHTML = `${icon('alert')}<div>${escHtml(err.message === 'Failed to fetch' ? t.offline : err.message)}</div>`;
    errBox.hidden = false;
    errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitting = false;
    btnNext.disabled = false;
    btnNext.textContent = t.publish;
  }
}

// ---------- draft: survive reloads and the browser killing a background tab ----------
function saveDraft() {
  const data = {};
  for (const el of form.elements) {
    if (!el.name || el.name.startsWith('_') || el.type === 'file') continue;
    if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; }
    else if (el.type === 'checkbox') { if (el.checked) (data[el.name] ||= []).push(el.value); }
    else if (el.value) data[el.name] = el.value;
  }
  data._priceTouched = priceTouched;
  data._cur = L.cur;
  store.session.set(DRAFT, data);
}
function restoreDraft(data) {
  if (data.model) {
    const r = form.querySelector(`input[name="model"][value="${CSS.escape(data.model)}"]`);
    if (r) { r.checked = true; applyModel(); }
  }
  for (const [name, v] of Object.entries(data)) {
    if (name === 'model' || name.startsWith('_')) continue;
    const els = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
    for (const el of els) {
      if (el.type === 'radio') el.checked = el.value === v;
      else if (el.type === 'checkbox') el.checked = [].concat(v).includes(el.value);
      else el.value = v;
    }
  }
  priceTouched = !!data._priceTouched;
  // The currency was switched since the draft was saved: the typed price is in the old one.
  const typed = +digits(form.elements.price.value);
  if (typed && data._cur && data._cur !== L.cur) form.elements.price.value = L.money(toKrw(typed, data._cur, L.krwPerUsd));
  if (num.value) { range.value = Math.max(50, +num.value); batteryHint(); }
}

// ---------- example pictures: the "?" on the screen and body questions ----------
// A sheet with one picture per answer; "Choose this" answers the question and closes it.
const exDialog = $('[data-examples-dialog]');
let exOpener = null;
const gradeTag = (g) => `<span class="grade grade-${g === 'A' || g === 'A-' ? 'a' : g === 'C' ? 'c' : 'b'}">${g.replace('-', '−')}</span>`;

function openExamples(name, opener) {
  const c = model()?.category || cat;
  const current = val(name);
  $('[data-examples-title]', exDialog).textContent = t.exTitle(qText(L, name, c).title);
  $('[data-examples-tip]', exDialog).textContent = t.exTip[name];
  $('[data-examples-list]', exDialog).innerHTML = Object.entries(EXAMPLES[name]).map(([g, ex]) => {
    const o = opt(L, name, g, c);
    const picked = current === g;
    const credit = ex.credit
      ? `<a class="ex-credit" href="${escHtml(ex.credit.url)}" target="_blank" rel="noopener">${escHtml(t.exPhoto(ex.credit.by, ex.credit.license))}</a>`
      : `<span class="ex-credit">${escHtml(t.exDrawing)}</span>`;
    return `<div class="ex-card${picked ? ' is-picked' : ''}">
      <div class="ex-img"><img src="/assets/examples/${ex.img}" alt="${escHtml(t.exAlt(g.replace('-', '−'), o.t))}" width="720" height="450" loading="lazy" decoding="async">${credit}</div>
      <div class="ex-body">
        <p class="ex-name">${gradeTag(g)} <b>${escHtml(o.t)}</b></p>
        ${o.d ? `<p class="ex-d">${escHtml(o.d)}</p>` : ''}
        <button type="button" class="btn ${picked ? 'btn-primary' : 'btn-ghost'} btn-block" data-ex-pick="${g}">${picked ? `${icon('check')}${escHtml(t.exChosen)}` : escHtml(t.exChoose)}</button>
      </div>
    </div>`;
  }).join('');
  exDialog.dataset.q = name;
  exOpener = opener;
  $('.pick-panel', exDialog).scrollTop = 0;
  exDialog.classList.add('is-open');
  document.documentElement.style.overflow = 'hidden';
  $('.icon-btn[data-close-examples]', exDialog).focus({ preventScroll: true });
}
function closeExamples() {
  if (!exDialog.classList.contains('is-open')) return;
  exDialog.classList.remove('is-open');
  document.documentElement.style.overflow = '';
  exOpener?.focus({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const help = e.target.closest('[data-examples]');
  if (help) { e.preventDefault(); openExamples(help.dataset.examples, help); return; }
  if (e.target.closest('[data-close-examples]')) { e.preventDefault(); closeExamples(); return; }
  const pick = e.target.closest('[data-ex-pick]');
  if (!pick) return;
  const input = form.querySelector(`input[name="${exDialog.dataset.q}"][value="${CSS.escape(pick.dataset.exPick)}"]`);
  closeExamples();
  // Answer exactly as a tap on the option would (marks the option, updates the price, moves on).
  if (input && !input.checked) { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeExamples(); });

// ---------- start ----------
const draft = store.session.get(DRAFT, null);
if (boot.preModel) {
  if (draft && draft.model === boot.preModel) restoreDraft(draft);
  form.querySelector(`input[name="model"][value="${CSS.escape(boot.preModel)}"]`).checked = true;
  applyModel();
} else if (draft) restoreDraft(draft);
browsing = !model();
const linkParams = new URLSearchParams(location.search);
if (model() && !boot.preModel && boot.startCat !== model().category && (linkParams.has('cat') || linkParams.has('series'))) {
  // The link asked for another category (or a series of one) than the saved draft: honour the link.
  setCat(boot.startCat, { keepSeries: !!series });
  browsing = true;
} else if (model()) setCat(model().category, { keepSeries: !!series });
// Contact details from the last listing on this device.
const contact = store.get(CONTACT, {});
// Saved details from an earlier listing; an old Uzbek number or region is left out so it can't block publishing.
if (contact.phone && !koreanMobile(contact.phone)) delete contact.phone;
for (const k of ['region', 'name', 'phone', 'kakao']) if (contact[k] && !form.elements[k].value) form.elements[k].value = contact[k];
for (const r of $$('input[type=radio]:checked')) answeredOnce.add(r.name);
applyConditions();
markChecked();
filterModels();
// Arriving from a series link: make sure the active filter chip is visible in its scrolling row.
const seriesRow = $('.series-filter');
const activeChip = seriesRow?.querySelector('.is-on');
if (activeChip && series) {
  seriesRow.scrollLeft += activeChip.getBoundingClientRect().left - seriesRow.getBoundingClientRect().left - (seriesRow.clientWidth - activeChip.offsetWidth) / 2;
}
// Old step links (#basic, #details…) from the multi-step version mean nothing now.
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
batteryHint();
update();
