import { html, raw, somShort, fold } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { MODELS_NEWEST, SERIES, seriesLabel } from '../catalog.js';
import { BASIC, LOOKS, SCREEN, FAULTS, PARTS, EXTRAS, UZIMEI, REGIONS } from '../../public/assets/questions.js';
import { priceSpan, toUzs } from '../../public/assets/pricing.js';
import config from '../config.js';

// Radio question. `cols` = 2 renders short answers side by side.
const question = (name, q, { cols = 1, required = true } = {}) => html`<fieldset class="q" data-q="${name}">
  <legend>${q.title}</legend>
  ${q.hint ? html`<p class="q-hint">${icon('info')}${q.hint}</p>` : ''}
  <div class="opts${cols === 2 ? ' opts-2' : ''}">
    ${q.options.map((o) => html`<label class="opt">
      <input type="radio" name="${name}" value="${o.v}" ${raw(required ? 'required' : '')}>
      <span class="opt-box"><span class="opt-t">${o.t}</span>${o.d ? html`<span class="opt-d">${o.d}</span>` : ''}</span>
      <span class="opt-check">${icon('check')}</span>
    </label>`)}
  </div>
</fieldset>`;

const STEPS = [
  ['model', 'Model'], ['config', 'Xotira va rang'], ['basic', 'Asosiy tekshiruv'], ['looks', 'Tashqi holat'],
  ['screen', 'Ekran va batareya'], ['faults', 'Funksiyalar'], ['parts', 'Qismlar'], ['result', 'Narx'], ['details', 'Eʼlon'],
];

export function sellPage({ preModel, preSeries, q }) {
  const clientCatalog = MODELS_NEWEST.map(({ id, name, series, year, bio, glassBack, trueTone, cameraButton, esimQ, cam, colors, storages, deductions, tiers, scrap }) =>
    ({ id, name, series, year, bio, glassBack, trueTone, cameraButton, esimQ, cam, colors, storages, deductions, tiers, scrap }));
  const boot = { models: clientCatalog, settings: config.pricing, steps: STEPS, preModel: preModel || null, maxPhotos: config.maxPhotos };

  return layout({
    title: 'Telefonni baholash va sotish',
    description: 'iPhone’ingiz holatini belgilang va narxini soʻmda darhol biling. Bepul eʼlon.',
    back: { href: '/', label: 'Telefon sotish' },
    focus: true,
    active: 'sell',
    scripts: ['sell.js'],
    body: html`
<div class="wrap sell" data-sell>
  <div class="sell-progress" aria-hidden="true"><span data-progress></span></div>
  <p class="sell-stepname"><span data-step-num>1</span>/<span data-step-total>${STEPS.length}</span> · <span data-step-name>Model</span></p>

  <div class="sell-grid">
  <form class="sell-form" id="sell-form" novalidate autocomplete="on">
    <noscript><div class="notice notice-warn">${icon('alert')}<div>Baholash uchun brauzeringizda JavaScript yoqilgan boʻlishi kerak.</div></div></noscript>

    <section class="step" data-step="model">
      <h1 tabindex="-1">Qaysi iPhone’ni sotasiz?</h1>
      <label class="search-field search-field-lg">
        ${icon('search')}
        <input type="search" data-model-search value="${q || ''}" placeholder="Masalan: 13 Pro Max" aria-label="Model qidirish" autocomplete="off">
      </label>
      <div class="chips chips-scroll series-filter" role="group" aria-label="Seriya boʻyicha filtr">
        <button type="button" class="chip${preSeries ? '' : ' is-on'}" data-series="" aria-pressed="${preSeries ? 'false' : 'true'}">Barchasi</button>
        ${SERIES.map((s) => html`<button type="button" class="chip${preSeries === s ? ' is-on' : ''}" data-series="${s}" aria-pressed="${preSeries === s ? 'true' : 'false'}">${seriesLabel(s)}</button>`)}
      </div>
      <div class="model-list" role="radiogroup" aria-label="Modellar">
        ${SERIES.map((s) => html`<div class="model-group" data-group data-series="${s}" ${raw(preSeries && preSeries !== s ? 'hidden' : '')}>
          <h2 class="model-group-h">${seriesLabel(s)}</h2>
          ${MODELS_NEWEST.filter((m) => m.series === s).map((m) => {
            const span = priceSpan(m);
            return html`<label class="model-opt" data-name="${fold(`${m.name} ${m.name.replace('iPhone ', '')}`)}">
              <input type="radio" name="model" value="${m.id}" required>
              <span class="model-opt-t">${m.name}<small>${m.year}</small></span>
              <span class="model-opt-p">${somShort(toUzs(span.min, config.pricing))} – ${somShort(toUzs(span.max, config.pricing))}</span>
              ${icon('right')}
            </label>`;
          })}
        </div>`)}
        <p class="empty-inline" data-model-empty hidden>Bunday model topilmadi. Hozircha faqat iPhone’lar baholanadi.</p>
      </div>
    </section>

    <section class="step" data-step="config" hidden>
      <h2 class="step-title" tabindex="-1" data-model-title></h2>
      <fieldset class="q"><legend>Xotira hajmi</legend><div class="opts opts-chips" data-storages></div></fieldset>
      <fieldset class="q"><legend>Rangi</legend><div class="swatches" data-colors></div></fieldset>
      <div data-if="esimQ">${question('sim', BASIC.sim)}</div>
    </section>

    <section class="step" data-step="basic" hidden>
      <h2 class="step-title" tabindex="-1">Asosiy tekshiruv</h2>
      ${question('powersOn', BASIC.powersOn, { cols: 2 })}
      <div data-if="powersOn">
        ${question('imeiOk', BASIC.imeiOk, { cols: 2 })}
      </div>
      ${question('icloudOff', BASIC.icloudOff, { cols: 2 })}
      <div class="notice notice-bad" data-icloud-block hidden>${icon('alert')}<div><b>iCloud’dan chiqmaguningizcha eʼlon joylab boʻlmaydi.</b> Yangi egasi telefonni ishlata olmaydi. Sozlamalar → ismingiz → <i>Find My</i> → <i>Find My iPhone</i> ni oʻchiring, soʻng shu yerga qayting.</div></div>
      <div data-if="powersOn">${question('refurbished', BASIC.refurbished, { cols: 2 })}</div>
    </section>

    <section class="step" data-step="looks" hidden>
      <h2 class="step-title" tabindex="-1">Tashqi holat</h2>
      ${question('screen', LOOKS.screen)}
      ${question('body', LOOKS.body)}
      <div data-if="glassBack">${question('backGlass', LOOKS.backGlass, { cols: 2 })}</div>
      ${question('lens', LOOKS.lens)}
      ${question('bent', LOOKS.bent)}
    </section>

    <section class="step" data-step="screen" hidden>
      <h2 class="step-title" tabindex="-1">Ekran va batareya</h2>
      ${question('glass', SCREEN.glass, { cols: 2 })}
      <div data-if="powersOn">
      ${question('display', SCREEN.display)}
      <fieldset class="q">
        <legend>Batareya holati (maksimal sigʻim)</legend>
        <p class="q-hint">${icon('info')}Sozlamalar → Batareya → Batareya holati → “Maksimal sigʻim”.</p>
        <div class="battery">
          <input type="range" min="50" max="100" step="1" value="100" data-battery-range aria-label="Batareya foizi">
          <label class="battery-num"><input type="number" name="battery" min="1" max="100" inputmode="numeric" value="" placeholder="—" required data-battery-num><span>%</span></label>
        </div>
        <p class="battery-hint muted small" data-battery-hint></p>
      </fieldset>
      </div>
    </section>

    <section class="step" data-step="faults" hidden>
      <h2 class="step-title" tabindex="-1">Nimalar ishlamaydi?</h2>
      <p class="muted">Ishlamaydiganlarini belgilang. Hammasi ishlasa, shunchaki davom eting.</p>
      <div class="checks">
        ${FAULTS.map((f) => html`<label class="check" data-fault="${f.k}">
          <input type="checkbox" name="faults" value="${f.k}">
          <span class="check-t" data-fault-label>${f.t({ bio: 'face' })}</span>
          <span class="switch" aria-hidden="true"></span>
        </label>`)}
      </div>
      <p class="all-ok" data-all-ok>${icon('check')}Hammasi ishlaydi</p>
    </section>

    <section class="step" data-step="parts" hidden>
      <h2 class="step-title" tabindex="-1">${PARTS.title}</h2>
      <p class="q-hint">${icon('info')}${PARTS.hint}</p>
      ${PARTS.items.map((p) => html`<fieldset class="q q-inline"><legend>${p.t}</legend>
        <div class="seg">${PARTS.options.map((o, i) => html`<label><input type="radio" name="part_${p.k}" value="${o.v}" ${raw(i === 0 ? 'checked' : '')}><span>${o.t}</span></label>`)}</div>
      </fieldset>`)}
      <p class="muted small">“Original qism” — Apple qismi oʻrnatilgan, lekin servisda almashtirilgan. “Nomaʼlum qism” — iPhone “Unknown part” deb koʻrsatadi.</p>
    </section>

    <section class="step" data-step="result" hidden>
      <div class="result" data-result></div>
    </section>

    <section class="step" data-step="details" hidden>
      <h2 class="step-title" tabindex="-1">Eʼlon tafsilotlari</h2>

      <fieldset class="q">
        <legend>Rasmlar <span class="muted">(${config.maxPhotos} tagacha)</span></legend>
        <p class="q-hint">${icon('camera')}Old va orqa tomoni, yonlari hamda “Batareya holati” ekranini suratga oling. Rasmli eʼlonlar tezroq sotiladi.</p>
        <div class="photos" data-photos>
          <label class="photo-add">
            <input type="file" accept="image/*" multiple data-photo-input>
            ${icon('camera')}<span>Rasm qoʻshish</span>
          </label>
        </div>
      </fieldset>

      <label class="field field-lg">
        <span>Sotish narxi</span>
        <span class="input-suffix"><input type="text" name="price" inputmode="numeric" required data-money data-price><span>soʻm</span></span>
        <span class="price-hint" data-price-hint></span>
      </label>

      <label class="field"><span>Hudud</span>
        <select name="region" required><option value="">Tanlang</option>${REGIONS.map((r) => html`<option>${r}</option>`)}</select>
      </label>
      <label class="field"><span>Ismingiz</span>
        <input type="text" name="name" required minlength="2" maxlength="40" autocomplete="given-name" placeholder="Masalan: Jasur">
      </label>
      <label class="field"><span>Telefon raqamingiz</span>
        <span class="input-prefix"><span>+998</span><input type="tel" name="phone" required inputmode="tel" autocomplete="tel-national" placeholder="90 123 45 67" data-phone></span>
      </label>
      <label class="field"><span>Telegram <span class="muted">(ixtiyoriy)</span></span>
        <span class="input-prefix"><span>@</span><input type="text" name="telegram" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="username" pattern="[A-Za-z0-9_]{5,32}"></span>
      </label>

      ${question('uzimei', UZIMEI, { cols: 1 })}

      <fieldset class="q"><legend>Toʻplamda nimalar bor?</legend>
        <div class="toggles">${EXTRAS.map((e) => html`<label class="toggle"><input type="checkbox" name="extra_${e.k}"><span>${icon('check')}${e.t}</span></label>`)}</div>
      </fieldset>

      <label class="field"><span>Tavsif <span class="muted">(ixtiyoriy)</span></span>
        <textarea name="description" rows="4" maxlength="1000" placeholder="Masalan: doim gʻilofda yurgan, servisda ochilmagan." data-counter></textarea>
        <span class="counter muted small" data-counter-out>0 / 1000</span>
      </label>

      <p class="muted small">“Joylash” tugmasini bosib, kiritilgan maʼlumotlar toʻgʻri ekanini tasdiqlaysiz.</p>
      <div class="notice notice-bad" data-submit-error hidden></div>
    </section>
  </form>

  <aside class="sell-summary" aria-label="Tanlovlaringiz">
    <div class="summary-card" data-summary>
      <div class="summary-art" data-summary-art></div>
      <p class="summary-model" data-summary-model>Modelni tanlang</p>
      <p class="summary-sub muted" data-summary-sub></p>
      <p class="summary-label">Taxminiy narx</p>
      <p class="summary-price" data-summary-price>—</p>
      <ul class="summary-lines" data-summary-lines></ul>
    </div>
  </aside>
  </div>
</div>

<div class="sell-bar">
  <div class="sell-bar-in">
    <button class="icon-btn" type="button" data-prev aria-label="Oldingi qadam" hidden>${icon('back')}</button>
    <div class="sell-bar-price" aria-live="polite">
      <span class="muted small" data-bar-label>Taxminiy narx</span>
      <b data-bar-price>—</b>
    </div>
    <button class="btn btn-primary btn-lg" type="button" data-next disabled>Davom etish</button>
  </div>
</div>
<script type="application/json" id="boot">${raw(JSON.stringify(boot).replace(/</g, '\\u003c'))}</script>`,
  });
}
