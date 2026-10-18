import { html, raw, qs, money } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, empty } from './components.js';
import { MODELS_NEWEST, SERIES, seriesLabel, byId } from '../catalog.js';
import { REGIONS } from '../../public/assets/questions.js';

const STORAGES = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB'];
const SORTS = [['new', 'Eng yangi'], ['cheap', 'Avval arzon'], ['expensive', 'Avval qimmat'], ['battery', 'Batareya boʻyicha']];
const GRADE_FILTER = [['', 'Barchasi'], ['a', 'A · Ideal, aʼlo'], ['b', 'B · Yaxshi, oʻrtacha'], ['c', 'C · Ishlatilgan']];
const BATTERY = [['', 'Farqi yoʻq'], ['80', '80% dan yuqori'], ['85', '85% dan yuqori'], ['90', '90% dan yuqori']];

const sel = (a, b) => raw(String(a) === String(b) ? 'selected' : '');
const chk = (a, b) => raw(String(a) === String(b) ? 'checked' : '');

export function catalogPage({ f, result, focusSearch }) {
  const { items, total, page, pages } = result;
  // Active filters, each with a link that removes it.
  const without = (k) => `/telefonlar${qs({ ...f, [k]: '', page: '' })}`;
  const active = [
    f.q && ['q', `“${f.q}”`],
    f.series && ['series', seriesLabel(f.series)],
    f.model && ['model', byId(f.model)?.name || f.model],
    f.storage && ['storage', f.storage],
    f.grade && ['grade', GRADE_FILTER.find(([v]) => v === f.grade)?.[1].split(' · ')[0]],
    f.region && ['region', f.region],
    f.min && ['min', `${money(f.min)} soʻmdan`],
    f.max && ['max', `${money(f.max)} soʻmgacha`],
    f.bat && ['bat', `Batareya ${f.bat}%+`],
  ].filter(Boolean);
  const filterCount = active.filter(([k]) => k !== 'q').length;
  const title = f.model ? byId(f.model)?.name : f.series ? seriesLabel(f.series) : 'Barcha telefonlar';

  return layout({
    title,
    active: 'buy',
    body: html`
<form class="wrap catalog" action="/telefonlar" method="get" id="catalog-form">
  <div class="catalog-head">
    <h1>${title} <span class="count">${total}</span></h1>
    <div class="catalog-bar">
      <label class="search-field">
        ${icon('search')}
        <input type="search" name="q" value="${f.q}" placeholder="Model, masalan 14 Pro Max" aria-label="Qidirish" enterkeyhint="search" ${raw(focusSearch ? 'autofocus' : '')}>
      </label>
      <a class="btn btn-ghost filter-open" href="#filters" data-open-filters aria-controls="filters">
        ${icon('sliders')}<span>Filtr</span>${filterCount ? html`<span class="pill">${filterCount}</span>` : ''}
      </a>
      <label class="sort">
        <span class="sr">Saralash</span>
        <select name="sort" data-autosubmit>${SORTS.map(([v, t]) => html`<option value="${v}" ${sel(f.sort || 'new', v)}>${t}</option>`)}</select>
      </label>
    </div>
    <div class="chips chips-scroll">
      <a class="chip${!f.series ? ' is-on' : ''}" href="/telefonlar${qs({ ...f, series: '', model: '', page: '' })}">Barchasi</a>
      ${SERIES.map((s) => html`<a class="chip${f.series === s ? ' is-on' : ''}" href="/telefonlar${qs({ ...f, series: s, model: '', page: '' })}">${s === 'SE' ? 'SE' : s}</a>`)}
    </div>
    ${active.length ? html`<div class="active-filters">
      ${active.map(([k, t]) => html`<a class="chip chip-x" href="${without(k)}" aria-label="${t} filtrini olib tashlash">${t}${icon('close')}</a>`)}
      <a class="link" href="/telefonlar">Tozalash</a>
    </div>` : ''}
  </div>

  <div class="catalog-body">
    <aside class="filters" id="filters" aria-label="Filtrlar">
      <div class="sheet-backdrop" data-close-filters></div>
      <div class="sheet">
        <div class="sheet-head">
          <h2>Filtrlar</h2>
          <a class="icon-btn" href="#" data-close-filters aria-label="Yopish">${icon('close')}</a>
        </div>
        <div class="sheet-body">
          <input type="hidden" name="series" value="${f.series}">
          <label class="field"><span>Model</span>
            <select name="model">
              <option value="">Barcha modellar</option>
              ${SERIES.map((s) => html`<optgroup label="${seriesLabel(s)}">${MODELS_NEWEST.filter((m) => m.series === s).map((m) => html`<option value="${m.id}" ${sel(f.model, m.id)}>${m.name}</option>`)}</optgroup>`)}
            </select>
          </label>
          <fieldset class="field"><legend>Xotira</legend>
            <div class="seg seg-wrap">
              <label><input type="radio" name="storage" value="" ${chk(f.storage, '')}><span>Barchasi</span></label>
              ${STORAGES.map((s) => html`<label><input type="radio" name="storage" value="${s}" ${chk(f.storage, s)}><span>${s}</span></label>`)}
            </div>
          </fieldset>
          <fieldset class="field"><legend>Holati</legend>
            <div class="seg seg-col">
              ${GRADE_FILTER.map(([v, t]) => html`<label><input type="radio" name="grade" value="${v}" ${chk(f.grade, v)}><span>${t}</span></label>`)}
            </div>
          </fieldset>
          <fieldset class="field"><legend>Narx, soʻm</legend>
            <div class="range">
              <input type="text" inputmode="numeric" name="min" value="${f.min ? money(f.min) : ''}" placeholder="dan" aria-label="Eng kam narx" data-money>
              <span>—</span>
              <input type="text" inputmode="numeric" name="max" value="${f.max ? money(f.max) : ''}" placeholder="gacha" aria-label="Eng koʻp narx" data-money>
            </div>
          </fieldset>
          <label class="field"><span>Batareya</span>
            <select name="bat">${BATTERY.map(([v, t]) => html`<option value="${v}" ${sel(f.bat || '', v)}>${t}</option>`)}</select>
          </label>
          <label class="field"><span>Hudud</span>
            <select name="region"><option value="">Butun Oʻzbekiston</option>${REGIONS.map((r) => html`<option ${sel(f.region, r)}>${r}</option>`)}</select>
          </label>
        </div>
        <div class="sheet-foot">
          <a class="btn btn-ghost" href="/telefonlar">Tozalash</a>
          <button class="btn btn-primary" type="submit">Koʻrsatish</button>
        </div>
      </div>
    </aside>

    <section class="results" aria-live="polite">
      ${items.length
        ? html`${cards(items, { eagerFirst: true })}
          ${pages > 1 ? html`<nav class="pager" aria-label="Sahifalar">
            ${page > 1 ? html`<a class="btn btn-ghost" href="/telefonlar${qs({ ...f, page: page - 1 })}">${icon('back')} Oldingi</a>` : html`<span></span>`}
            <span class="muted">${page} / ${pages}</span>
            ${page < pages ? html`<a class="btn btn-ghost" href="/telefonlar${qs({ ...f, page: page + 1 })}">Keyingi ${icon('right')}</a>` : html`<span></span>`}
          </nav>` : ''}`
        : empty('Hech narsa topilmadi', 'Filtrlarni yumshatib koʻring yoki boshqa model qidiring.', html`<a class="btn btn-ghost" href="/telefonlar">Filtrlarni tozalash</a>`)}
    </section>
  </div>
</form>`,
  });
}
