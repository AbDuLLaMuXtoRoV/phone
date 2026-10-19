import { html } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, phoneArt, gradeChip, empty } from './components.js';
import { MODELS, byId, CATEGORY_SHOWCASE, seriesLabel } from '../catalog.js';
import { BRANDS } from './brands.js';
import { GRADE_KEYS } from '../../public/assets/questions.js';
import { CATEGORY_KEYS } from '../../public/assets/categories.js';
import { estimate } from '../../public/assets/pricing.js';
import config from '../config.js';

const TIP_ICONS = ['shield', 'sim', 'pin', 'alert'];
const showcaseArt = (cat) => { const [id, color] = CATEGORY_SHOWCASE[cat]; return phoneArt(byId(id), color); };

// Brand chooser: a bottom sheet on phones, a dialog on desktop. Works without JS through #pick-<brand>.
function brandPicker(L, b) {
  const t = L.t;
  return html`<div class="picker" id="pick-${b.key}" role="dialog" aria-modal="true" aria-labelledby="pick-${b.key}-title">
  <a class="pick-backdrop" href="#" data-close-picker tabindex="-1" aria-hidden="true"></a>
  <div class="pick-panel">
    <div class="pick-head">
      <h2 id="pick-${b.key}-title">${b.logo}<span class="sr">${L.brands[b.key]}</span></h2>
      <a class="icon-btn" href="#" data-close-picker aria-label="${t.close}">${icon('close')}</a>
    </div>
    <p class="muted pick-sub">${t.pickTitle(L.brands[b.key])}</p>
    <div class="pick-grid">
      ${b.items.map((it) => {
        const [id, color] = it.show;
        const models = MODELS.filter((m) => (it.cat ? m.category === it.cat : m.series === it.series));
        return html`<a class="pick-tile" href="/sell?${it.cat ? `cat=${it.cat}` : `series=${it.series}`}">
          <span class="pick-art">${phoneArt(byId(id), color)}</span>
          <b>${it.cat ? L.cats[it.cat] : seriesLabel(it.series)}</b>
          <span class="muted small">${t.modelsN(models.length)}</span>
        </a>`;
      })}
    </div>
  </div>
</div>`;
}

export function homePage(L, { here, latest, total, counts }) {
  const t = L.t;
  const sample = byId('iphone-15-pro-max');
  const sampleEst = estimate(sample, '256 GB', { battery: 93 }, config.pricing);
  return layout(L, {
    here,
    active: 'home',
    body: html`
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">${icon('shield')} ${t.eyebrow}</p>
      <h1>${t.heroTitle}<span>${t.heroHighlight}</span>${t.heroTitleEnd}</h1>
      <p class="lead">${t.lead}</p>
      <form class="hero-search" action="/sell" role="search">
        ${icon('search')}
        <input name="q" type="search" placeholder="${t.heroPh}" aria-label="${t.heroAria}" enterkeyhint="go" autocomplete="off">
        <button class="btn btn-primary" type="submit">${t.heroBtn}</button>
      </form>
      <div class="chips brand-chips" aria-label="${t.heroChipsAria}">
        ${BRANDS.map((b) => html`<a class="chip chip-brand" href="#pick-${b.key}" data-open-picker aria-haspopup="dialog" aria-label="${L.brands[b.key]}">${b.logo}</a>`)}
      </div>
      ${total ? html`<a class="hero-alt" href="/phones">${t.heroAltText} <b>${t.heroAltLink(total)}</b> ${icon('right')}</a>` : ''}
    </div>
    <div class="hero-demo" aria-hidden="true">
      <div class="demo-card">
        <div class="demo-art">${phoneArt(sample, 'natural')}</div>
        <div class="demo-info">
          <p class="demo-model">${sample.name} · 256 GB</p>
          <p class="demo-tags">${gradeChip(L, 'A', { long: true })} <span class="bat">${icon('battery')}93%</span></p>
          <p class="demo-label">${t.demoLabel}</p>
          <p class="demo-price">${L.price(sampleEst.krw)}</p>
          <ul class="demo-lines">
            <li><span>${icon('check')}${t.demoFaceId}</span><span>${t.demoWorks}</span></li>
            <li><span>${icon('check')}${t.demoScreen}</span><span>${t.demoNoScratches}</span></li>
            <li><span>${icon('check')}${t.demoParts}</span><span>${t.demoOriginal}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="wrap" aria-label="${t.statsAria}">
  <div class="stats">
    ${total
      ? html`<div><b>${total}</b><span>${t.statListings}</span></div>`
      : html`<div><b>${CATEGORY_KEYS.length}</b><span>${t.statTypes}</span></div>`}
    <div><b>${MODELS.length}</b><span>${t.statModels}</span></div>
    <div><b>${t.statFreeValue}</b><span>${t.statFree}</span></div>
    <div><b>${t.statTimeValue}</b><span>${t.statTime}</span></div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.categoriesTitle}</h2></div>
  <div class="cat-tiles">
    ${CATEGORY_KEYS.map((c) => html`<a class="cat-tile" href="/phones?cat=${c}">
      <span class="cat-art">${showcaseArt(c)}</span>
      <b>${L.cats[c]}</b>
      <span class="muted small">${counts[c] ? t.listingsN(counts[c]) : t.modelsN(MODELS.filter((m) => m.category === c).length)}</span>
    </a>`)}
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.latestTitle}</h2>${latest.length ? html`<a class="link" href="/phones">${t.seeAll} ${icon('right')}</a>` : ''}</div>
  ${latest.length
    ? cards(L, latest)
    : html`<div class="block first-listing">${empty(t.noListingsTitle, t.noListingsText, html`<a class="btn btn-primary" href="/sell">${icon('plus')}${t.sellCta}</a>`)}</div>`}
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.howTitle}</h2></div>
  <ol class="steps">
    ${t.steps.map(([h, p], i) => html`<li><span class="step-n">${i + 1}</span><div><h3>${h}</h3><p>${p}</p></div></li>`)}
  </ol>
  <a class="btn btn-primary btn-lg btn-block-m" href="/sell">${t.howCta}</a>
</section>

<section class="wrap section">
  <div class="section-head"><h2>${t.gradesTitle}</h2></div>
  <p class="muted section-sub">${t.gradesSub}</p>
  <div class="grades">
    ${GRADE_KEYS.map((g) => html`<div class="grade-card">${gradeChip(L, g)}<div><h3>${L.grades[g].name}</h3><p>${L.grades[g].desc}</p></div></div>`)}
  </div>
</section>

<section class="wrap section" id="safety">
  <div class="section-head"><h2>${t.safetyTitle}</h2></div>
  <div class="tips">
    ${t.tips.map(([h, p], i) => html`<div class="tip">${icon(TIP_ICONS[i])}<div><h3>${h}</h3><p>${p}</p></div></div>`)}
  </div>
</section>

<section class="wrap section" id="faq">
  <div class="section-head"><h2>${t.faqTitle}</h2></div>
  <div class="faq">
    ${t.faq.map(([q, a]) => html`<details><summary>${q}${icon('down')}</summary><p>${a}</p></details>`)}
  </div>
</section>

<section class="wrap section">
  <div class="cta-band">
    <div><h2>${t.ctaTitle}</h2><p>${t.ctaText}</p></div>
    <a class="btn btn-light btn-lg" href="/sell">${t.ctaBtn} ${icon('right')}</a>
  </div>
</section>
${BRANDS.map((b) => brandPicker(L, b))}`,
  });
}
