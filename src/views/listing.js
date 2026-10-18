import { html, raw, som, ago, formatPhone } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, gradeChip, phoneArt, estFor } from './components.js';
import { byId, colorOf } from '../catalog.js';
import { BASIC, LOOKS, SCREEN, FAULTS, PARTS, EXTRAS, UZIMEI, GRADES, optionLabel } from '../../public/assets/questions.js';
import { estimate, normalize, priceVerdict } from '../../public/assets/pricing.js';
import config from '../config.js';

const row = (label, value, state = 'ok') => ({ label, value, state });
const STATE_ICON = { ok: 'check', warn: 'alert', bad: 'close' };

function report(model, answers) {
  const a = normalize(answers);
  const bad = (v, okVals) => (okVals.includes(v) ? 'ok' : 'bad');
  const looks = [
    row(LOOKS.screen.title, optionLabel(LOOKS.screen, a.screen), a.screen === 'C' ? 'bad' : a.screen === 'B' ? 'warn' : 'ok'),
    row('Korpus', optionLabel(LOOKS.body, a.body), a.body === 'C' ? 'bad' : a.body.startsWith('B') ? 'warn' : 'ok'),
    model.glassBack && row(LOOKS.backGlass.title, optionLabel(LOOKS.backGlass, a.backGlass), bad(a.backGlass, ['ok'])),
    row(LOOKS.lens.title, optionLabel(LOOKS.lens, a.lens), a.lens === 'ok' ? 'ok' : a.lens === 'scratched' ? 'warn' : 'bad'),
    row('Egilish', optionLabel(LOOKS.bent, a.bent), a.bent === 'none' ? 'ok' : a.bent === 'light' ? 'warn' : 'bad'),
    row(SCREEN.glass.title, optionLabel(SCREEN.glass, a.glass), bad(a.glass, ['ok'])),
    row('Displey', optionLabel(SCREEN.display, a.display), a.display === 'ok' ? 'ok' : a.display === 'minor' ? 'warn' : 'bad'),
  ].filter(Boolean);
  if (a.untested) {
    // Phone does not turn on: nothing beyond the looks could be checked.
    looks[looks.length - 1] = row('Displey', 'Tekshirib boʻlmaydi', 'warn');
    const na = [row('Telefon yoqilmaydi', 'Tekshirib boʻlmaydi', 'bad')];
    return { looks, funcs: na, parts: na, basics: [row('iCloud', 'Chiqilgan', 'ok'), row('Yoqiladi', 'Yoʻq', 'bad')] };
  }
  const funcs = FAULTS.filter((f) => !f.when || f.when(model)).map((f) => {
    const broken = a.faults.includes(f.k);
    return row(f.s(model), broken ? 'Ishlamaydi' : 'Ishlaydi', broken ? 'bad' : 'ok');
  });
  const parts = PARTS.items.map((p) => row(p.t, optionLabel(PARTS, a.parts[p.k]), a.parts[p.k] === 'none' ? 'ok' : a.parts[p.k] === 'genuine' ? 'warn' : 'bad'));
  const basics = [
    row('iCloud', 'Chiqilgan', 'ok'),
    row('IMEI', a.imeiOk === 'yes' ? 'Koʻrinadi' : 'Koʻrinmaydi', a.imeiOk === 'yes' ? 'ok' : 'bad'),
    row('Yoqiladi', a.powersOn === 'yes' ? 'Ha' : 'Yoʻq', a.powersOn === 'yes' ? 'ok' : 'bad'),
    row('Refurbished / demo', a.refurbished === 'yes' ? 'Ha' : 'Yoʻq', a.refurbished === 'yes' ? 'warn' : 'ok'),
  ];
  return { looks, funcs, parts, basics };
}

const rows = (list) => html`<ul class="report">${list.map((r) => html`<li class="is-${r.state}"><span class="report-ic">${icon(STATE_ICON[r.state])}</span><span class="report-l">${r.label}</span><span class="report-v">${r.value}</span></li>`)}</ul>`;

export function listingPage({ l, similar, isNew }) {
  const model = byId(l.model_id);
  const a = normalize(l.answers);
  const color = colorOf(model, l.color);
  const est = estimate(model, l.storage, l.answers, config.pricing);
  const verdict = priceVerdict(l.price_uzs, estFor(l));
  const rep = report(model, l.answers);
  const faultsCount = a.untested ? 0 : rep.funcs.filter((r) => r.state === 'bad').length;
  const extras = EXTRAS.filter((e) => l.extras?.[e.k]);
  const tg = l.telegram ? l.telegram.replace(/^@/, '') : null;
  const sold = l.status === 'sold';
  const title = `${l.model_name}, ${l.storage}`;
  const photos = l.photos.length ? l.photos : null;

  return layout({
    title: `${title} — ${som(l.price_uzs)}`,
    description: `${title}, ${GRADES[l.grade].name.toLowerCase()} holatda, batareya ${l.battery}%. ${l.region}. ${som(l.price_uzs)}.`,
    back: { href: '/telefonlar', label: l.model_name },
    focus: true,
    body: html`
<div class="wrap listing" data-listing="${l.id}">
  ${isNew ? html`<div class="notice notice-ok" role="status">
    ${icon('check')}<div><b>Eʼloningiz joylandi!</b> Uni doʻstlaringizga ulashing yoki “Eʼlonlarim” boʻlimidan boshqaring.</div>
    <button class="btn btn-ghost btn-sm" type="button" data-share>${icon('share')}Ulashish</button>
  </div>` : ''}
  ${sold ? html`<div class="notice notice-warn" role="status">${icon('info')}<div>Bu telefon sotilgan.</div></div>` : ''}

  <div class="listing-grid">
    <div class="gallery">
      <div class="gallery-track" tabindex="0" aria-label="Rasmlar">
        ${photos
          ? photos.map((p, i) => html`<img src="${p}" alt="${title}, rasm ${i + 1}" width="900" height="900" ${raw(i === 0 ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`)
          : html`<div class="gallery-art">${phoneArt(model, l.color)}<span class="muted">Sotuvchi hali rasm qoʻshmagan</span></div>`}
      </div>
      ${photos && photos.length > 1 ? html`<span class="gallery-count" data-gallery-count>1 / ${photos.length}</span>` : ''}
    </div>

    <div class="listing-main">
      <div class="listing-head">
        <h1>${title}</h1>
        <p class="muted">${color ? html`${color.uz} · ` : ''}${l.region} · ${ago(l.created_at)}</p>
      </div>

      <div class="price-box">
        <p class="price-big">${som(l.price_uzs)}</p>
        ${verdict && !sold ? html`<p class="verdict-line"><span class="verdict verdict-${verdict.k}">${verdict.t}</span> Tizim bahosi: <b>${som(estFor(l))}</b></p>` : ''}
        ${est.status !== 'blocked' ? html`<details class="breakdown">
          <summary>Baho qanday hisoblandi ${icon('down')}</summary>
          <ul>${est.lines.map((x) => html`<li><span>${x.label}</span><b class="${x.units < 0 ? 'neg' : ''}">${x.units < 0 ? '−' : ''}${som(Math.abs(x.uzs))}</b></li>`)}
            <li class="total"><span>Tizim bahosi</span><b>${som(est.uzs)}</b></li></ul>
        </details>` : ''}
      </div>

      <div class="facts">
        <div class="fact"><span>Holati</span><b>${gradeChip(l.grade, { long: true })}</b></div>
        <div class="fact"><span>Batareya</span><b class="${l.battery < 80 ? 'warn-text' : ''}">${icon('battery')}${l.battery ? `${l.battery}%` : 'Nomaʼlum'}</b></div>
        <div class="fact"><span>Xotira</span><b>${l.storage}</b></div>
        <div class="fact"><span>Rang</span><b>${color ? html`<i class="swatch" style="--c:${color.hex}"></i>${color.uz}` : '—'}</b></div>
        ${model.esimQ ? html`<div class="fact"><span>SIM</span><b>${optionLabel(BASIC.sim, a.sim)}</b></div>` : ''}
        <div class="fact"><span>IMEI roʻyxati</span><b class="${l.uzimei === 'yes' ? 'ok-text' : 'warn-text'}">${l.uzimei === 'yes' ? 'Oʻtgan' : l.uzimei === 'no' ? 'Oʻtmagan' : 'Nomaʼlum'}</b></div>
      </div>

      <section class="block">
        <h2>Holat hisoboti</h2>
        <p class="muted small">Sotuvchi tomonidan toʻldirilgan. Uchrashuvda telefonni oʻzingiz tekshiring.</p>
        <h3 class="report-h">Asosiy tekshiruv</h3>${rows(rep.basics)}
        <h3 class="report-h">Tashqi holat va ekran</h3>${rows(rep.looks)}
        ${a.untested
          ? html`<h3 class="report-h">Funksiyalar</h3>${rows(rep.funcs)}`
          : html`<details class="report-more" ${raw(faultsCount ? 'open' : '')}>
          <summary><h3 class="report-h">Funksiyalar</h3><span class="${faultsCount ? 'bad-text' : 'ok-text'}">${faultsCount ? `${faultsCount} ta nosozlik` : 'Hammasi ishlaydi'}</span>${icon('down')}</summary>
          ${rows(rep.funcs)}
        </details>`}
        <h3 class="report-h">Qismlar</h3>${rows(rep.parts)}
      </section>

      ${l.description ? html`<section class="block"><h2>Tavsif</h2><p class="desc">${l.description}</p></section>` : ''}

      <section class="block">
        <h2>Toʻplamda</h2>
        <p>${extras.length ? extras.map((e) => html`<span class="tag">${icon('box')}${e.t}</span>`) : html`<span class="muted">Faqat telefon</span>`}</p>
      </section>

      <section class="block seller">
        <div class="avatar" aria-hidden="true">${l.seller_name.slice(0, 1)}</div>
        <div><b>${l.seller_name}</b><p class="muted small">${icon('pin')}${l.region} · ${icon('eye')}${l.views} marta koʻrilgan</p></div>
      </section>

      <section class="block tips-compact">
        <h2>${icon('shield')}Xavfsiz xarid</h2>
        <ul>
          <li>Gavjum joyda uchrashing va telefonni qoʻlingizda tekshiring.</li>
          <li>*#06# orqali IMEI ni tekshiring va qutidagi raqam bilan solishtiring.</li>
          <li>Sozlamalarda iCloud’dan chiqilganiga ishonch hosil qiling.</li>
          <li>Oldindan pul oʻtkazmang.</li>
        </ul>
      </section>

      <section class="block owner" data-owner-panel hidden>
        <h2>Eʼlonni boshqarish</h2>
        <div class="owner-actions">
          ${sold
            ? html`<button class="btn btn-ghost" type="button" data-status="active">${icon('refresh')}Qayta faollashtirish</button>`
            : html`<button class="btn btn-ghost" type="button" data-status="sold">${icon('check')}Sotildi deb belgilash</button>`}
          <button class="btn btn-danger-ghost" type="button" data-status="deleted">${icon('trash')}Oʻchirish</button>
        </div>
      </section>
    </div>

    <aside class="contact-card">
      <p class="price-big">${som(l.price_uzs)}</p>
      ${verdict && !sold ? html`<p class="verdict-line"><span class="verdict verdict-${verdict.k}">${verdict.t}</span></p>` : ''}
      <a class="btn btn-primary btn-lg btn-block" href="tel:${l.phone}">${icon('phone')}${formatPhone(l.phone)}</a>
      ${tg ? html`<a class="btn btn-tg btn-lg btn-block" href="https://t.me/${tg}" target="_blank" rel="noopener">${icon('send')}Telegramda yozish</a>` : ''}
      <button class="btn btn-ghost btn-block" type="button" data-fav="${l.id}" aria-pressed="false">${icon('heart')}<span data-fav-label>Sevimlilarga qoʻshish</span></button>
      <p class="muted small">${icon('user')}${l.seller_name} · ${l.region}</p>
    </aside>
  </div>

  ${similar.length ? html`<section class="section"><div class="section-head"><h2>Oʻxshash eʼlonlar</h2></div>${cards(similar)}</section>` : ''}
</div>

<div class="actionbar">
  <button class="icon-btn icon-btn-lg" type="button" data-fav="${l.id}" aria-pressed="false" aria-label="Sevimlilarga qoʻshish">${icon('heart')}</button>
  ${tg ? html`<a class="btn btn-tg btn-lg" href="https://t.me/${tg}" target="_blank" rel="noopener">${icon('send')}Telegram</a>` : ''}
  <a class="btn btn-primary btn-lg" href="tel:${l.phone}">${icon('phone')}Qoʻngʻiroq</a>
</div>`,
  });
}
