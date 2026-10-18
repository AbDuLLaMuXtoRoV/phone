import { html, som } from '../util.js';
import { icon } from './icons.js';
import { layout } from './layout.js';
import { cards, phoneArt, gradeChip } from './components.js';
import { MODELS, SERIES, seriesLabel, byId } from '../catalog.js';
import { GRADES } from '../../public/assets/questions.js';
import { estimate } from '../../public/assets/pricing.js';
import config from '../config.js';

const POPULAR = ['iphone-17-pro-max', 'iphone-16-pro', 'iphone-15-pro-max', 'iphone-15', 'iphone-14-pro', 'iphone-13', 'iphone-12', 'iphone-11'];

const FAQ = [
  ['Narx qanday hisoblanadi?', 'Har bir model va xotira hajmi uchun holat darajasi (A, A−, B+, B) boʻyicha asosiy narx olinadi. Soʻng har bir nosozlik uchun belgilangan summa ayiriladi: singan oyna, ishlamaydigan Face ID, almashtirilgan qismlar va hokazo. Hisob-kitobning har bir qatori sizga koʻrsatiladi.'],
  ['Eʼlon joylash pullikmi?', 'Yoʻq, eʼlon joylash va baholash butunlay bepul. Roʻyxatdan oʻtish ham shart emas.'],
  ['Nega iCloud’dan chiqish shart?', 'iCloud (Find My) yoqilgan telefonni yangi egasi ishlata olmaydi. Bu oʻgʻirlangan telefonlar savdosini ham toʻsadi, shuning uchun bunday telefonlar qabul qilinmaydi.'],
  ['Batareya holatini qayerdan bilaman?', 'Sozlamalar → Batareya → Batareya holati va zaryadlash → “Maksimal sigʻim”. Shu foizni kiriting.'],
  ['IMEI roʻyxati nima uchun kerak?', 'Oʻzbekistonda IMEI roʻyxatdan oʻtmagan telefon mahalliy SIM karta bilan bloklanadi. Xaridor buni eʼlonning oʻzida koʻradi.'],
  ['Hozir qaysi telefonlarni sotish mumkin?', 'Hozircha iPhone SE 2’dan iPhone 17 Pro Max’gacha boʻlgan barcha iPhone modellari. Samsung va Xiaomi tez orada qoʻshiladi.'],
];

export function homePage({ latest, total }) {
  const sample = byId('iphone-15-pro-max');
  const sampleEst = estimate(sample, '256 GB', { battery: 93 }, config.pricing);
  return layout({
    active: 'home',
    body: html`
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow">${icon('shield')} Faqat telefonlar · shaffof narx</p>
      <h1>Telefoningiz qancha turadi? <span>1 daqiqada</span> biling</h1>
      <p class="lead">Modelni tanlang, holatini belgilang va narxni soʻmda darhol koʻring. Eʼlon joylash bepul.</p>
      <form class="hero-search" action="/sotish" role="search">
        ${icon('search')}
        <input name="q" type="search" placeholder="Masalan: 13 Pro" aria-label="Telefon modeli" enterkeyhint="go" autocomplete="off">
        <button class="btn btn-primary" type="submit">Baholash</button>
      </form>
      <div class="chips chips-scroll" aria-label="Ommabop modellar">
        ${POPULAR.map((id) => byId(id)).filter(Boolean).map((m) => html`<a class="chip" href="/sotish?model=${m.id}">${m.name.replace('iPhone ', '')}</a>`)}
      </div>
      <a class="hero-alt" href="/telefonlar">Telefon sotib olmoqchimisiz? <b>${total} ta eʼlonni koʻring</b> ${icon('right')}</a>
    </div>
    <div class="hero-demo" aria-hidden="true">
      <div class="demo-card">
        <div class="demo-art">${phoneArt(sample, 'natural')}</div>
        <div class="demo-info">
          <p class="demo-model">${sample.name} · 256 GB</p>
          <p class="demo-tags">${gradeChip('A', { long: true })} <span class="bat">${icon('battery')}93%</span></p>
          <p class="demo-label">Taxminiy narx</p>
          <p class="demo-price">${som(sampleEst.uzs)}</p>
          <ul class="demo-lines">
            <li><span>${icon('check')}Face ID</span><span>ishlaydi</span></li>
            <li><span>${icon('check')}Ekran</span><span>chiziqsiz</span></li>
            <li><span>${icon('check')}Qismlar</span><span>original</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="wrap" aria-label="Raqamlarda">
  <div class="stats">
    <div><b>${total}</b><span>faol eʼlon</span></div>
    <div><b>${MODELS.length}</b><span>iPhone modeli</span></div>
    <div><b>0 soʻm</b><span>eʼlon narxi</span></div>
    <div><b>~1 daqiqa</b><span>baholash</span></div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>Seriya boʻyicha</h2></div>
  <div class="chips chips-scroll">
    ${SERIES.map((s) => html`<a class="chip chip-lg" href="/telefonlar?series=${encodeURIComponent(s)}">${seriesLabel(s)}</a>`)}
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2>Yangi eʼlonlar</h2><a class="link" href="/telefonlar">Barchasi ${icon('right')}</a></div>
  ${cards(latest)}
</section>

<section class="wrap section">
  <div class="section-head"><h2>Qanday ishlaydi</h2></div>
  <ol class="steps">
    <li><span class="step-n">1</span><div><h3>Modelni tanlang</h3><p>42 ta iPhone modeli va har bir xotira hajmi.</p></div></li>
    <li><span class="step-n">2</span><div><h3>Holatini belgilang</h3><p>Oddiy savollar: ekran, korpus, batareya, nosozliklar.</p></div></li>
    <li><span class="step-n">3</span><div><h3>Narxni biling</h3><p>Soʻmdagi narx va har bir ayirma qatori ochiq koʻrsatiladi.</p></div></li>
    <li><span class="step-n">4</span><div><h3>Eʼlon joylang</h3><p>Rasm qoʻshing — xaridorlar qoʻngʻiroq yoki Telegram orqali yozadi.</p></div></li>
  </ol>
  <a class="btn btn-primary btn-lg btn-block-m" href="/sotish">Telefonni baholash</a>
</section>

<section class="wrap section">
  <div class="section-head"><h2>Holat darajalari</h2></div>
  <p class="muted section-sub">Barcha eʼlonlarda bir xil oʻlchov. Xaridor nimani olishini aniq biladi.</p>
  <div class="grades">
    ${Object.entries(GRADES).map(([g, x]) => html`<div class="grade-card">${gradeChip(g)}<div><h3>${x.name}</h3><p>${x.desc}</p></div></div>`)}
  </div>
</section>

<section class="wrap section" id="xavfsizlik">
  <div class="section-head"><h2>Xavfsiz savdo</h2></div>
  <div class="tips">
    <div class="tip">${icon('shield')}<div><h3>iCloud tekshirilgan</h3><p>iCloud’dan chiqilmagan telefonni eʼlonga qoʻyib boʻlmaydi.</p></div></div>
    <div class="tip">${icon('sim')}<div><h3>IMEI roʻyxati koʻrinadi</h3><p>Telefon Oʻzbekistonda roʻyxatdan oʻtganmi — eʼlonda yozilgan.</p></div></div>
    <div class="tip">${icon('pin')}<div><h3>Gavjum joyda uchrashing</h3><p>Telefonni qoʻlingizda tekshirmaguncha pul oʻtkazmang.</p></div></div>
    <div class="tip">${icon('alert')}<div><h3>Oldindan toʻlov qilmang</h3><p>“Yetkazib beraman, avval pul tashlang” — eng koʻp uchraydigan firibgarlik.</p></div></div>
  </div>
</section>

<section class="wrap section" id="savollar">
  <div class="section-head"><h2>Koʻp soʻraladigan savollar</h2></div>
  <div class="faq">
    ${FAQ.map(([q, a]) => html`<details><summary>${q}${icon('down')}</summary><p>${a}</p></details>`)}
  </div>
</section>

<section class="wrap section">
  <div class="cta-band">
    <div><h2>Telefoningizni sotmoqchimisiz?</h2><p>Baholash bepul va roʻyxatdan oʻtishsiz.</p></div>
    <a class="btn btn-light btn-lg" href="/sotish">Boshlash ${icon('right')}</a>
  </div>
</section>`,
  });
}
