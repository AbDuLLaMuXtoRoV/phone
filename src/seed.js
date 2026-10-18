// Demo listings so the marketplace is not empty on first run. Prices are computed with the real engine.
import { createHash } from 'node:crypto';
import { byId } from './catalog.js';
import { countListings, insertListing } from './db.js';
import { estimate, conditionGrade } from '../public/assets/pricing.js';
import config from './config.js';

const H = 3600e3;
const DEMO = [
  ['iphone-15-pro-max', '256 GB', 'natural', { screen: 'A', body: 'A', battery: 94 }, 'Toshkent shahri', 'Jasur', 1.04, 2, 'Ideal holatda, doim gʻilofda yurgan. Quti va kabel bor.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-13', '128 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 86 }, 'Samarqand', 'Dilnoza', 1.0, 5, 'Bir qoʻlda ishlatilgan, hech qayeri ochilmagan.', { box: 1 }],
  ['iphone-14-pro', '128 GB', 'deeppurple', { screen: 'A', body: 'B+', battery: 88 }, 'Toshkent shahri', 'Aziz', 1.08, 9, 'Ramkada kichik zarba izi bor, qolgani zoʻr.', { cable: 1 }],
  ['iphone-12', '64 GB', 'blue', { screen: 'B', body: 'B', battery: 79, parts: { battery: 'genuine' } }, 'Fargʻona', 'Malika', 0.95, 14, 'Batareya servisda original bilan almashtirilgan.', {}],
  ['iphone-16-pro', '256 GB', 'deserttitan', { screen: 'A', body: 'A', battery: 100 }, 'Toshkent shahri', 'Sardor', 1.02, 20, 'Yangidek, 3 oy ishlatilgan. Kafolati bor.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-11', '128 GB', 'white', { screen: 'A-', body: 'B+', battery: 83 }, 'Andijon', 'Nodira', 1.06, 27, '', { box: 1 }],
  ['iphone-15', '128 GB', 'pink', { screen: 'A', body: 'A-', battery: 91, sim: 'esim' }, 'Buxoro', 'Bekzod', 0.98, 31, 'AQSh versiyasi, faqat eSIM.', { box: 1, cable: 1 }],
  ['iphone-13-pro-max', '256 GB', 'sierra', { screen: 'A-', body: 'A-', battery: 84, faults: ['trueTone'] }, 'Namangan', 'Shahzoda', 1.0, 40, 'True Tone ishlamaydi, ekran oʻzimniki.', {}],
  ['iphone-xr', '64 GB', 'red', { screen: 'B', body: 'B', battery: 78 }, 'Qashqadaryo', 'Otabek', 1.1, 52, 'Ishlab turibdi, hech qanday muammo yoʻq.', {}],
  ['iphone-14', '128 GB', 'blue', { screen: 'A', body: 'A', battery: 90 }, 'Toshkent viloyati', 'Gulnora', 0.9, 60, 'Tez sotaman, narxi kelishiladi.', { box: 1, cable: 1 }],
  ['iphone-17-pro', '256 GB', 'orange', { screen: 'A', body: 'A', battery: 100 }, 'Toshkent shahri', 'Timur', 1.03, 70, 'Yangi, faqat aktivatsiya qilingan.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-12-pro', '128 GB', 'graphite', { screen: 'A-', body: 'B', battery: 80, glass: 'cracked' }, 'Xorazm', 'Ulugʻbek', 1.0, 76, 'Ekran oynasi chetidan yorilgan, displey ishlaydi.', {}],
  ['iphone-se-3', '64 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 92 }, 'Navoiy', 'Zarina', 1.05, 90, 'Kichkina va qulay, ota-onaga zoʻr.', { box: 1 }],
  ['iphone-16', '128 GB', 'ultramarine', { screen: 'A', body: 'A-', battery: 97 }, 'Samarqand', 'Kamola', 1.0, 100, '', { cable: 1 }],
  ['iphone-14-pro-max', '256 GB', 'spaceblack', { screen: 'A-', body: 'B+', battery: 86, parts: { screen: 'unknown' } }, 'Toshkent shahri', 'Rustam', 0.97, 120, 'Ekran almashtirilgan (original emas).', {}],
  ['iphone-11-pro', '256 GB', 'midgreen', { screen: 'B', body: 'B', battery: 77 }, 'Jizzax', 'Javohir', 1.12, 150, '', {}],
  ['iphone-air', '256 GB', 'sky', { screen: 'A', body: 'A', battery: 99 }, 'Toshkent shahri', 'Madina', 1.0, 160, 'Juda yupqa va yengil, ideal holatda.', { box: 1, cable: 1 }],
  ['iphone-8-plus', '64 GB', 'gold', { screen: 'B', body: 'C', battery: 74 }, 'Surxondaryo', 'Sherzod', 1.15, 200, 'Ishlaydi, korpusi eskirgan.', {}],
];

export function seedIfEmpty() {
  if (countListings() > 0) return;
  const now = Date.now();
  DEMO.forEach(([modelId, storage, color, answers, region, name, factor, hoursAgo, description, extras], i) => {
    const model = byId(modelId);
    if (!model) return;
    const est = estimate(model, storage, answers, config.pricing);
    if (est.status !== 'ok') return;
    insertListing({
      model_id: model.id, model_name: model.name, series: model.series, storage, color,
      grade: conditionGrade(answers), battery: answers.battery, answers,
      est_uzs: est.uzs, price_uzs: Math.round((est.uzs * factor) / 50000) * 50000,
      region, seller_name: name, phone: `+9989000000${String(i + 10).padStart(2, '0')}`, telegram: null,
      description, photos: [], extras, uzimei: i % 4 === 3 ? 'unknown' : 'yes',
      token_hash: createHash('sha256').update(`demo-${i}`).digest('hex'),
      views: 12 + ((i * 37) % 180), created_at: now - hoursAgo * H,
    });
  });
  console.log(`[seed] Added ${countListings()} demo listings`);
}
