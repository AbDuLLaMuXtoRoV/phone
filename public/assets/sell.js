// Sell wizard: one short step per screen, a live price in the bottom bar, answers saved as a draft,
// the phone's back button moves between steps, photos are shrunk on the device before upload.
import { estimate, priceSpan, toUzs, priceVerdict, BATTERY_MIN } from './pricing.js';
import { FAULTS, faultApplies, pick } from './questions.js';
import { phoneArtSvg } from './art.js';
import { $, $$, L, store, toast, digits, fold, escHtml, icon } from './ui.js';

const boot = JSON.parse($('#boot').textContent);
const { models, settings, maxPhotos } = boot;
const t = L.t;
const STEP_NAMES = t.stepNames;
const form = $('#sell-form');
const btnNext = $('[data-next]');
const btnPrev = $('[data-prev]');
const DRAFT = 'fb_sell_draft';
const CONTACT = 'fb_contact';

let step = 'model';
let photos = []; // data URLs, already resized
let priceTouched = false;
let submitting = false;

// ---------- reading the form ----------
const val = (name) => {
  const el = form.elements[name];
  if (!el) return undefined;
  return el instanceof RadioNodeList || el.type === 'radio' ? form.querySelector(`input[name="${name}"]:checked`)?.value : el.value;
};
const model = () => models.find((m) => m.id === val('model')) || null;
const alive = () => val('powersOn') !== 'no';

function answers() {
  const m = model();
  const a = {
    powersOn: val('powersOn'), imeiOk: val('imeiOk'), icloudOff: val('icloudOff'), refurbished: val('refurbished'),
    sim: m?.esimQ ? val('sim') : 'sim',
    screen: val('screen'), body: val('body'), backGlass: m?.glassBack ? val('backGlass') : 'ok', lens: val('lens'), bent: val('bent'),
    glass: val('glass'), display: val('display'),
    battery: form.elements.battery.value ? +form.elements.battery.value : undefined,
    faults: $$('input[name="faults"]:checked').map((x) => x.value).filter((k) => faultApplies(k, m)),
    parts: { screen: val('part_screen'), battery: val('part_battery'), camera: val('part_camera') },
  };
  for (const k of Object.keys(a)) if (a[k] === undefined || a[k] === '') delete a[k];
  return a;
}

// ---------- steps ----------
function activeSteps() {
  return boot.steps.filter((k) => alive() || (k !== 'faults' && k !== 'parts'));
}

// Returns the first unanswered question (element) in a step, or null if the step is complete.
function missing(k) {
  const m = model();
  const need = (name) => (val(name) ? null : form.querySelector(`[data-q="${name}"]`) || form.querySelector(`[name="${name}"]`));
  switch (k) {
    case 'model': return m ? null : $('.model-list');
    case 'config':
      if (!val('storage')) return $('[data-storages]');
      if (!val('color')) return $('[data-colors]');
      return m.esimQ ? need('sim') : null;
    case 'basic':
      return need('powersOn') || (alive() && need('imeiOk')) || need('icloudOff') || (alive() && need('refurbished'));
    case 'looks':
      return need('screen') || need('body') || (m?.glassBack && need('backGlass')) || need('lens') || need('bent');
    case 'screen': {
      if (need('glass')) return need('glass');
      if (!alive()) return null;
      if (need('display')) return need('display');
      const b = +form.elements.battery.value;
      return b >= 1 && b <= 100 ? null : form.elements.battery.closest('.q');
    }
    case 'details': {
      if (!(+digits(form.elements.price.value) >= 10000)) return form.elements.price.closest('.field');
      if (!form.elements.region.value) return form.elements.region.closest('.field');
      if (form.elements.name.value.trim().length < 2) return form.elements.name.closest('.field');
      if (digits(form.elements.phone.value).length !== 9) return form.elements.phone.closest('.field');
      const tg = form.elements.telegram.value.trim().replace(/^@/, '');
      if (tg && !/^[A-Za-z0-9_]{5,32}$/.test(tg)) return form.elements.telegram.closest('.field');
      return need('uzimei');
    }
    default: return null;
  }
}
const blocked = () => val('icloudOff') === 'no';

function show(k, { push = true, focus = true } = {}) {
  const list = activeSteps();
  if (!list.includes(k)) k = list[0];
  // Never show a step whose earlier steps are incomplete (e.g. reload on #details with an empty form).
  for (const s of list.slice(0, list.indexOf(k))) if (missing(s) || (s === 'basic' && blocked())) { k = s; break; }
  step = k;
  for (const sec of $$('.step')) sec.hidden = sec.dataset.step !== k;
  const i = list.indexOf(k);
  $('[data-step-num]').textContent = i + 1;
  $('[data-step-total]').textContent = list.length;
  $('[data-step-name]').textContent = STEP_NAMES[k];
  $('[data-progress]').style.width = `${((i + 1) / list.length) * 100}%`;
  btnPrev.hidden = i === 0;
  btnNext.disabled = false;
  btnNext.textContent = k === 'result' ? t.postListing : k === 'details' ? t.publish : t.continue;
  if (k === 'result') renderResult();
  if (k === 'details') prepareDetails();
  if (push && history.state?.step !== k) history.pushState({ step: k }, '', `#${k}`);
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) $(`.step[data-step="${k}"] h1, .step[data-step="${k}"] .step-title, .step[data-step="${k}"] .result-card`)?.focus?.({ preventScroll: true });
  update();
}

function next() {
  if (step === 'details') return submit();
  const gap = missing(step);
  if (gap || (step === 'basic' && blocked())) {
    const target = gap || $('[data-icloud-block]');
    target.classList.add('is-missing');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => target.classList.remove('is-missing'), 1600);
    toast(step === 'basic' && blocked() ? t.toastIcloud : t.toastAnswer);
    return;
  }
  const list = activeSteps();
  show(list[list.indexOf(step) + 1]);
}
function prev() {
  if (history.state?.step && activeSteps().indexOf(step) > 0) history.back();
  else { const list = activeSteps(); show(list[Math.max(0, list.indexOf(step) - 1)]); }
}
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);
window.addEventListener('popstate', (e) => show(e.state?.step || 'model', { push: false }));
// Header back arrow = previous step (runs before app.js's handler).
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-back]') || activeSteps().indexOf(step) === 0) return;
  e.preventDefault();
  prev();
}, true);

// ---------- model step ----------
const search = $('[data-model-search]');
let series = $('[data-series].is-on')?.dataset.series || '';
function setSeries(s) {
  series = s;
  for (const c of $$('[data-series]')) {
    const on = c.dataset.series === s;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', String(on));
  }
}
$$('[data-series]').forEach((c) => c.addEventListener('click', () => {
  setSeries(c.dataset.series);
  search.value = '';
  filterModels();
}));
function filterModels() {
  const words = fold(search.value).replace(/iphone|айфон|ayfon/g, ' ').split(' ').filter(Boolean);
  // Typing searches every series, so "13 pro" is found even when "iPhone 15" was picked on the home page.
  if (words.length && series) setSeries('');
  let any = false;
  for (const g of $$('[data-group]')) {
    if (series && g.dataset.series !== series) { g.hidden = true; continue; }
    let n = 0;
    for (const opt of $$('.model-opt', g)) {
      const hay = ` ${opt.dataset.name}`;
      const ok = words.every((w) => hay.includes(` ${w}`));
      opt.hidden = !ok;
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
  if (el.name === 'model') applyModel();
  if (el.name === 'storage' || el.name === 'color') markChecked();
  if (el.name === 'powersOn' || el.name === 'icloudOff') applyConditions();
  if (el.type === 'radio' || el.type === 'checkbox') markChecked();
  update();
});
form.addEventListener('input', (e) => {
  if (e.target === form.elements.price) priceTouched = true;
  if (e.target.matches('[data-phone]')) formatPhone(e.target);
  if (e.target.matches('[data-counter]')) $('[data-counter-out]').textContent = `${e.target.value.length} / 1000`;
  update();
});
form.addEventListener('submit', (e) => { e.preventDefault(); next(); });
// Tapping a model moves straight on. Keyboard clicks (detail 0, e.g. arrow keys) do not, so the list stays browsable.
form.addEventListener('click', (e) => {
  if (e.detail > 0 && step === 'model' && e.target.closest('.model-opt')) setTimeout(() => model() && show('config'), 180);
});
// Enter in a text field should move on, not submit half a form.
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('input:not([type=search])')) { e.preventDefault(); next(); }
});

// Model-specific options: storage sizes, real colours, which questions apply.
function applyModel() {
  const m = model();
  if (!m) return;
  $('[data-model-title]').textContent = m.name;
  const prevStorage = val('storage');
  const prevColor = val('color');
  $('[data-storages]').innerHTML = m.storages.map((s) => `<label class="opt"><input type="radio" name="storage" value="${escHtml(s.label)}" required ${s.label === prevStorage ? 'checked' : ''}><span class="opt-box"><span class="opt-t">${escHtml(s.label)}</span></span><span class="opt-check">${icon('check')}</span></label>`).join('');
  $('[data-colors]').innerHTML = m.colors.map((c) => `<label class="swatch-opt"><input type="radio" name="color" value="${c.k}" required ${c.k === prevColor ? 'checked' : ''}><span class="swatch-dot" style="--c:${c.hex}"></span>${escHtml(L.colors[c.k] || c.k)}</label>`).join('');
  $$('[data-if="esimQ"]').forEach((el) => { el.hidden = !m.esimQ; });
  $$('[data-if="glassBack"]').forEach((el) => { el.hidden = !m.glassBack; });
  for (const f of FAULTS) {
    const row = $(`[data-fault="${f.k}"]`);
    row.hidden = !(!f.when || f.when(m));
    row.querySelector('[data-fault-label]').textContent = pick(L.faults[f.k].q, m);
  }
  markChecked();
}

function applyConditions() {
  $$('[data-if="powersOn"]').forEach((el) => { el.hidden = !alive(); });
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
function batteryHint() {
  const b = +num.value;
  const el = $('[data-battery-hint]');
  if (!b) { el.textContent = ''; return; }
  const h = t.batteryHints;
  el.textContent = b >= BATTERY_MIN.A ? h.great : b >= BATTERY_MIN['B+'] ? h.good : b >= BATTERY_MIN.B ? h.fair : h.poor;
}

// ---------- live price ----------
function currentEstimate() {
  const m = model();
  const storage = val('storage');
  if (!m || !storage) return null;
  return estimate(m, storage, answers(), settings);
}
const conditionDone = () => !missing('basic') && !missing('looks') && !missing('screen');

function update() {
  const m = model();
  const est = currentEstimate();
  const label = $('[data-bar-label]');
  const out = $('[data-bar-price]');
  let lineHtml = '';
  if (!m) { label.textContent = t.estPrice; out.textContent = '—'; }
  else if (!est) {
    const span = priceSpan(m);
    label.textContent = t.barModelPrice(m.name);
    out.textContent = L.range(toUzs(span.min, settings), toUzs(span.max, settings));
  } else if (est.status === 'blocked') {
    label.textContent = t.barIcloud;
    out.textContent = t.barNoPrice;
  } else if (!conditionDone()) {
    // Unanswered questions count as "perfect", so this is the ceiling until the condition steps are done.
    label.textContent = t.barMax;
    out.textContent = L.price(est.uzs);
  } else {
    label.textContent = t.estPrice;
    out.textContent = L.price(est.uzs);
  }
  if (est?.lines) lineHtml = linesHtml(est);

  // Desktop summary card.
  const color = m?.colors.find((c) => c.k === val('color'));
  $('[data-summary-art]').innerHTML = m ? phoneArtSvg(m.cam, color?.hex, m.name) : '';
  $('[data-summary-model]').textContent = m ? m.name : t.pickModel;
  $('[data-summary-sub]').textContent = [val('storage'), color && L.colors[color.k]].filter(Boolean).join(' · ');
  $('[data-summary-price]').textContent = out.textContent;
  $('[data-summary-lines]').innerHTML = conditionDone() ? lineHtml : '';

  if (step === 'details') priceHint();
  $('[data-all-ok]').hidden = $$('input[name="faults"]:checked').some((x) => !x.closest('[hidden]'));
  saveDraft();
}

const linesHtml = (est) => est.lines.map((l) => `<li><span>${escHtml(L.line(l, model()))}</span><b class="${l.units < 0 ? 'neg' : ''}">${l.units < 0 ? '−' : ''}${L.price(Math.abs(l.uzs))}</b></li>`).join('');
const gradeChip = (g) => `<span class="grade grade-${g === 'A' || g === 'A-' ? 'a' : g === 'C' ? 'c' : 'b'}">${g.replace('-', '−')} · ${L.grades[g].name}</span>`;

function renderResult() {
  const m = model();
  const est = currentEstimate();
  const color = m.colors.find((c) => c.k === val('color'));
  const a = answers();
  const reason = est.status === 'scrap'
    ? `<div class="notice notice-warn">${icon('info')}<div>${a.powersOn === 'no' ? t.scrapDead : t.scrapImei}</div></div>` : '';
  const floor = est.floored ? `<p class="result-note">${icon('info')}${t.floorNote}</p>` : '';
  $('[data-result]').innerHTML = `<div class="result-card" tabindex="-1">
    <div class="result-top">${phoneArtSvg(m.cam, color?.hex, m.name)}
      <div><h2>${escHtml(m.name)}, ${escHtml(val('storage'))}</h2>
      <p>${gradeChip(est.grade)}${color ? ` <span>${escHtml(L.colors[color.k])}</span>` : ''}${a.battery ? ` <span class="bat">${icon('battery')}${a.battery}%</span>` : ''}</p></div>
    </div>
    <p class="result-label">${t.estPrice}</p>
    <p class="result-price">${L.price(est.uzs)}</p>
    <p class="result-range">${t.resultRange} ${L.money(est.low)} – ${L.price(est.high)}</p>
    ${reason}
    <ul class="result-lines">${linesHtml(est)}<li class="total"><span>${t.total}</span><b>${L.price(est.uzs)}</b></li></ul>
    ${floor}
    <p class="result-note">${icon('info')}${t.resultNote}</p>
    <div class="result-actions"><button class="btn btn-ghost" type="button" data-goto="looks">${icon('refresh')}${t.changeAnswers}</button></div>
  </div>`;
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-goto]');
  if (b) show(alive() ? b.dataset.goto : 'basic');
});

// ---------- details step ----------
function prepareDetails() {
  const est = currentEstimate();
  if (!priceTouched && est) form.elements.price.value = L.money(est.uzs);
  const c = store.get(CONTACT, {});
  for (const k of ['region', 'name', 'phone', 'telegram']) if (c[k] && !form.elements[k].value) form.elements[k].value = c[k];
  priceHint();
}
function priceHint() {
  const est = currentEstimate();
  const el = $('[data-price-hint]');
  const p = +digits(form.elements.price.value);
  if (!est || est.status === 'blocked') { el.innerHTML = ''; return; }
  const v = p ? priceVerdict(p, est.uzs) : null;
  el.innerHTML = `${v ? `<span class="verdict verdict-${v.k}">${L.verdict[v.k]}</span>` : ''} ${t.systemEst} <b>${L.price(est.uzs)}</b>
    <span class="seg" role="group" aria-label="${t.quickAria}">
      <label><input type="radio" name="_quick" data-quick="0.95"><span>−5%</span></label>
      <label><input type="radio" name="_quick" data-quick="1"><span>${t.quickEst}</span></label>
      <label><input type="radio" name="_quick" data-quick="1.05"><span>+5%</span></label>
    </span>`;
}
document.addEventListener('change', (e) => {
  const q = e.target.closest('[data-quick]');
  if (!q) return;
  const est = currentEstimate();
  form.elements.price.value = L.money(Math.round((est.uzs * +q.dataset.quick) / 10000) * 10000);
  priceTouched = true;
  update();
});

function formatPhone(el) {
  let d = digits(el.value);
  if (d.startsWith('998') && d.length > 9) d = d.slice(3);
  d = d.slice(0, 9);
  el.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
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
  const gap = missing('details');
  if (gap) {
    gap.classList.add('is-missing');
    gap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => gap.classList.remove('is-missing'), 1600);
    toast(t.toastFill);
    return;
  }
  const errBox = $('[data-submit-error]');
  errBox.hidden = true;
  submitting = true;
  btnNext.disabled = true;
  btnNext.textContent = t.publishing;
  const el = form.elements;
  const payload = {
    model: val('model'), storage: val('storage'), color: val('color'), answers: answers(),
    price: digits(el.price.value), region: el.region.value, name: el.name.value.trim(),
    phone: digits(el.phone.value), telegram: el.telegram.value.trim(), description: el.description.value.trim(),
    uzimei: val('uzimei'),
    extras: Object.fromEntries(['box', 'cable', 'receipt'].map((k) => [k, el[`extra_${k}`].checked])),
    photos,
  };
  try {
    const r = await fetch('/api/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || t.saveFailed);
    store.set('fb_mine', [{ id: data.id, token: data.token }, ...store.get('fb_mine', [])].slice(0, 50));
    store.set(CONTACT, { region: payload.region, name: payload.name, phone: el.phone.value, telegram: payload.telegram });
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
  if (num.value) { range.value = Math.max(50, +num.value); batteryHint(); }
}

// ---------- start ----------
const draft = store.session.get(DRAFT, null);
if (boot.preModel) {
  if (draft && draft.model === boot.preModel) restoreDraft(draft);
  const r = form.querySelector(`input[name="model"][value="${CSS.escape(boot.preModel)}"]`);
  r.checked = true;
  applyModel();
} else if (draft) restoreDraft(draft);
applyConditions();
markChecked();
if (search.value || series) filterModels();
// Arriving from a home-page series chip: make sure the active filter chip is visible in its scrolling row.
const seriesRow = $('.series-filter');
const activeChip = seriesRow?.querySelector('.is-on');
if (activeChip && series) {
  seriesRow.scrollLeft += activeChip.getBoundingClientRect().left - seriesRow.getBoundingClientRect().left - (seriesRow.clientWidth - activeChip.offsetWidth) / 2;
}

const startAt = boot.preModel ? 'config' : (location.hash.slice(1) || 'model');
history.replaceState({ step: 'model' }, '', location.pathname + location.search + '#model');
if (startAt !== 'model') show(startAt, { focus: false });
else show('model', { push: false, focus: false });
