import { html, raw, fold } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { MODELS_NEWEST, SERIES, seriesLabel } from '../catalog.js';
import { LOOKS, SCREEN, BASIC, FAULTS, PARTS, EXTRAS, UZIMEI, REGIONS, opt, pick } from '../../public/assets/questions.js';
import { priceSpan, toUzs } from '../../public/assets/pricing.js';
import config from '../config.js';

const STEPS = ['model', 'config', 'basic', 'looks', 'screen', 'faults', 'parts', 'result', 'details'];

export function sellPage(L, { here, preModel, preSeries, q }) {
  const t = L.t;

  // Radio question. `cols` = 2 renders short answers side by side.
  const question = (name, values, { cols = 1 } = {}) => html`<fieldset class="q" data-q="${name}">
    <legend>${L.q[name].title}</legend>
    ${L.q[name].hint ? html`<p class="q-hint">${icon('info')}${L.q[name].hint}</p>` : ''}
    <div class="opts${cols === 2 ? ' opts-2' : ''}">
      ${values.map((v) => {
        const o = opt(L, name, v);
        return html`<label class="opt">
          <input type="radio" name="${name}" value="${v}" required>
          <span class="opt-box"><span class="opt-t">${o.t}</span>${o.d ? html`<span class="opt-d">${o.d}</span>` : ''}</span>
          <span class="opt-check">${icon('check')}</span>
        </label>`;
      })}
    </div>
  </fieldset>`;

  const clientCatalog = MODELS_NEWEST.map(({ id, name, series, year, bio, glassBack, trueTone, cameraButton, esimQ, cam, colors, storages, deductions, tiers, scrap }) =>
    ({ id, name, series, year, bio, glassBack, trueTone, cameraButton, esimQ, cam, colors, storages, deductions, tiers, scrap }));
  const boot = { models: clientCatalog, settings: config.pricing, steps: STEPS, preModel: preModel || null, maxPhotos: config.maxPhotos };

  return layout(L, {
    here,
    title: t.sellTitle,
    description: t.sellDesc,
    back: { href: '/', label: t.sellHeader },
    focus: true,
    active: 'sell',
    scripts: ['sell.js'],
    body: html`
<div class="wrap sell" data-sell>
  <div class="sell-progress" aria-hidden="true"><span data-progress></span></div>
  <p class="sell-stepname"><span data-step-num>1</span>/<span data-step-total>${STEPS.length}</span> · <span data-step-name>${t.stepNames.model}</span></p>

  <div class="sell-grid">
  <form class="sell-form" id="sell-form" novalidate autocomplete="on">
    <noscript><div class="notice notice-warn">${icon('alert')}<div>${t.noscript}</div></div></noscript>

    <section class="step" data-step="model">
      <h1 tabindex="-1">${t.whichPhone}</h1>
      <label class="search-field search-field-lg">
        ${icon('search')}
        <input type="search" data-model-search value="${q || ''}" placeholder="${t.modelSearchPh}" aria-label="${t.modelSearchAria}" autocomplete="off">
      </label>
      <div class="chips chips-scroll series-filter" role="group" aria-label="${t.seriesFilterAria}">
        <button type="button" class="chip${preSeries ? '' : ' is-on'}" data-series="" aria-pressed="${preSeries ? 'false' : 'true'}">${t.all}</button>
        ${SERIES.map((s) => html`<button type="button" class="chip${preSeries === s ? ' is-on' : ''}" data-series="${s}" aria-pressed="${preSeries === s ? 'true' : 'false'}">${seriesLabel(s)}</button>`)}
      </div>
      <div class="model-list" role="radiogroup" aria-label="${t.modelsAria}">
        ${SERIES.map((s) => html`<div class="model-group" data-group data-series="${s}" ${raw(preSeries && preSeries !== s ? 'hidden' : '')}>
          <h2 class="model-group-h">${seriesLabel(s)}</h2>
          ${MODELS_NEWEST.filter((m) => m.series === s).map((m) => {
            const span = priceSpan(m);
            return html`<label class="model-opt" data-name="${fold(`${m.name} ${m.name.replace('iPhone ', '')}`)}">
              <input type="radio" name="model" value="${m.id}" required>
              <span class="model-opt-t">${m.name}<small>${m.year}</small></span>
              <span class="model-opt-p">${L.range(toUzs(span.min, config.pricing), toUzs(span.max, config.pricing))}</span>
              ${icon('right')}
            </label>`;
          })}
        </div>`)}
        <p class="empty-inline" data-model-empty hidden>${t.noModel}</p>
      </div>
    </section>

    <section class="step" data-step="config" hidden>
      <h2 class="step-title" tabindex="-1" data-model-title></h2>
      <fieldset class="q"><legend>${t.storageQ}</legend><div class="opts opts-chips" data-storages></div></fieldset>
      <fieldset class="q"><legend>${t.colorQ}</legend><div class="swatches" data-colors></div></fieldset>
      <div data-if="esimQ">${question('sim', BASIC.sim)}</div>
    </section>

    <section class="step" data-step="basic" hidden>
      <h2 class="step-title" tabindex="-1">${t.basicTitle}</h2>
      ${question('powersOn', BASIC.powersOn, { cols: 2 })}
      <div data-if="powersOn">${question('imeiOk', BASIC.imeiOk, { cols: 2 })}</div>
      ${question('icloudOff', BASIC.icloudOff, { cols: 2 })}
      <div class="notice notice-bad" data-icloud-block hidden>${icon('alert')}<div><b>${t.icloudBlockTitle}</b> ${t.icloudBlockText}</div></div>
      <div data-if="powersOn">${question('refurbished', BASIC.refurbished, { cols: 2 })}</div>
    </section>

    <section class="step" data-step="looks" hidden>
      <h2 class="step-title" tabindex="-1">${t.looksTitle2}</h2>
      ${question('screen', LOOKS.screen)}
      ${question('body', LOOKS.body)}
      <div data-if="glassBack">${question('backGlass', LOOKS.backGlass, { cols: 2 })}</div>
      ${question('lens', LOOKS.lens)}
      ${question('bent', LOOKS.bent)}
    </section>

    <section class="step" data-step="screen" hidden>
      <h2 class="step-title" tabindex="-1">${t.screenTitle}</h2>
      ${question('glass', SCREEN.glass, { cols: 2 })}
      <div data-if="powersOn">
      ${question('display', SCREEN.display)}
      <fieldset class="q">
        <legend>${t.batteryQ}</legend>
        <p class="q-hint">${icon('info')}${t.batteryHint}</p>
        <div class="battery">
          <input type="range" min="50" max="100" step="1" value="100" data-battery-range aria-label="${t.batteryAria}">
          <label class="battery-num"><input type="number" name="battery" min="1" max="100" inputmode="numeric" value="" placeholder="—" required data-battery-num><span>%</span></label>
        </div>
        <p class="battery-hint muted small" data-battery-hint></p>
      </fieldset>
      </div>
    </section>

    <section class="step" data-step="faults" hidden>
      <h2 class="step-title" tabindex="-1">${t.faultsTitle}</h2>
      <p class="muted">${t.faultsSub}</p>
      <div class="checks">
        ${FAULTS.map((f) => html`<label class="check" data-fault="${f.k}">
          <input type="checkbox" name="faults" value="${f.k}">
          <span class="check-t" data-fault-label>${pick(L.faults[f.k].q, { bio: 'face' })}</span>
          <span class="switch" aria-hidden="true"></span>
        </label>`)}
      </div>
      <p class="all-ok" data-all-ok>${icon('check')}${t.allWork}</p>
    </section>

    <section class="step" data-step="parts" hidden>
      <h2 class="step-title" tabindex="-1">${L.parts.title}</h2>
      <p class="q-hint">${icon('info')}${L.parts.hint}</p>
      ${PARTS.items.map((p) => html`<fieldset class="q q-inline"><legend>${L.parts.items[p]}</legend>
        <div class="seg">${PARTS.options.map((v, i) => html`<label><input type="radio" name="part_${p}" value="${v}" ${raw(i === 0 ? 'checked' : '')}><span>${L.parts.opts[v]}</span></label>`)}</div>
      </fieldset>`)}
      <p class="muted small">${t.partsNote}</p>
    </section>

    <section class="step" data-step="result" hidden>
      <div class="result" data-result></div>
    </section>

    <section class="step" data-step="details" hidden>
      <h2 class="step-title" tabindex="-1">${t.detailsTitle}</h2>

      <fieldset class="q">
        <legend>${t.photos} <span class="muted">${t.photosUpTo(config.maxPhotos)}</span></legend>
        <p class="q-hint">${icon('camera')}${t.photosHint}</p>
        <div class="photos" data-photos>
          <label class="photo-add">
            <input type="file" accept="image/*" multiple data-photo-input>
            ${icon('camera')}<span>${t.addPhoto}</span>
          </label>
        </div>
      </fieldset>

      <label class="field field-lg">
        <span>${t.askPrice}</span>
        <span class="input-suffix"><input type="text" name="price" inputmode="numeric" required data-money data-price><span>${L.currency}</span></span>
        <span class="price-hint" data-price-hint></span>
      </label>

      <label class="field"><span>${t.region}</span>
        <select name="region" required><option value="">${t.choose}</option>${REGIONS.map((r) => html`<option value="${r}">${L.regions[r]}</option>`)}</select>
      </label>
      <label class="field"><span>${t.name}</span>
        <input type="text" name="name" required minlength="2" maxlength="40" autocomplete="given-name" placeholder="${t.namePh}">
      </label>
      <label class="field"><span>${t.phone}</span>
        <span class="input-prefix"><span>+998</span><input type="tel" name="phone" required inputmode="tel" autocomplete="tel-national" placeholder="90 123 45 67" data-phone></span>
      </label>
      <label class="field"><span>${t.telegramLabel} <span class="muted">${t.optional}</span></span>
        <span class="input-prefix"><span>@</span><input type="text" name="telegram" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="username" pattern="[A-Za-z0-9_]{5,32}"></span>
      </label>

      ${question('uzimei', UZIMEI)}

      <fieldset class="q"><legend>${t.inBox}</legend>
        <div class="toggles">${EXTRAS.map((k) => html`<label class="toggle"><input type="checkbox" name="extra_${k}"><span>${icon('check')}${L.extras[k]}</span></label>`)}</div>
      </fieldset>

      <label class="field"><span>${t.desc} <span class="muted">${t.optional}</span></span>
        <textarea name="description" rows="4" maxlength="1000" placeholder="${t.descPh}" data-counter></textarea>
        <span class="counter muted small" data-counter-out>0 / 1000</span>
      </label>

      <p class="muted small">${t.confirm}</p>
      <div class="notice notice-bad" data-submit-error hidden></div>
    </section>
  </form>

  <aside class="sell-summary" aria-label="${t.summaryAria}">
    <div class="summary-card" data-summary>
      <div class="summary-art" data-summary-art></div>
      <p class="summary-model" data-summary-model>${t.pickModel}</p>
      <p class="summary-sub muted" data-summary-sub></p>
      <p class="summary-label">${t.estPrice}</p>
      <p class="summary-price" data-summary-price>—</p>
      <ul class="summary-lines" data-summary-lines></ul>
    </div>
  </aside>
  </div>
</div>

<div class="sell-bar">
  <div class="sell-bar-in">
    <button class="icon-btn" type="button" data-prev aria-label="${t.prevAria}" hidden>${icon('back')}</button>
    <div class="sell-bar-price" aria-live="polite">
      <span class="muted small" data-bar-label>${t.estPrice}</span>
      <b data-bar-price>—</b>
    </div>
    <button class="btn btn-primary btn-lg" type="button" data-next disabled>${t.continue}</button>
  </div>
</div>
<script type="application/json" id="boot">${raw(JSON.stringify(boot).replace(/</g, '\\u003c'))}</script>`,
  });
}
