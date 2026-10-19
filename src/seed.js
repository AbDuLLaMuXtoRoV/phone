// Demo listings so the marketplace is not empty. iPhone prices are computed with the real engine;
// other categories have no price list, so their demo asking prices are written here.
// Each demo has a fixed token, so seeding adds only the ones that are missing and never duplicates.
import { createHash } from 'node:crypto';
import { byId } from './catalog.js';
import { insertListing, hasToken } from './db.js';
import { estimate, conditionGrade } from '../public/assets/pricing.js';
import { CATEGORIES, applies } from '../public/assets/categories.js';
import config from './config.js';

const H = 3600e3;
const BASE = { powersOn: 'yes', imeiOk: 'yes', icloudOff: 'yes', refurbished: 'no', lens: 'ok', bent: 'none', backGlass: 'ok', glass: 'ok', display: 'ok', faults: [] };

// [model, storage, colour, answers, region, seller, price factor vs estimate, hours ago, description, extras]
export const DEMO = [
  ['iphone-15-pro-max', '256 GB', 'natural', { screen: 'A', body: 'A', battery: 94 }, 'seoul', 'Minjun', 1.04, 2, 'Perfect condition, always kept in a case. Box and cable included.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-13', '128 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 86 }, 'busan', 'Seoyeon', 1.0, 5, 'One owner, never opened for repair.', { box: 1 }],
  ['iphone-14-pro', '128 GB', 'deeppurple', { screen: 'A', body: 'B+', battery: 88 }, 'seoul', 'Jihoon', 1.08, 9, 'Small dent on the frame, otherwise great.', { cable: 1 }],
  ['iphone-12', '64 GB', 'blue', { screen: 'B', body: 'B', battery: 79, parts: { battery: 'genuine' } }, 'incheon', 'Jiwoo', 0.95, 14, 'Battery replaced at a service centre with a genuine part.', {}],
  ['iphone-16-pro', '256 GB', 'deserttitan', { screen: 'A', body: 'A', battery: 100 }, 'seoul', 'Hyunwoo', 1.02, 20, 'Like new, used for 3 months. Still under warranty.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-11', '128 GB', 'white', { screen: 'A-', body: 'B+', battery: 83 }, 'daegu', 'Yuna', 1.06, 27, '', { box: 1 }],
  ['iphone-15', '128 GB', 'pink', { screen: 'A', body: 'A-', battery: 91 }, 'daejeon', 'Dohyun', 0.98, 31, 'Bought new in a store, always in a case.', { box: 1, cable: 1 }],
  ['iphone-13-pro-max', '256 GB', 'sierra', { screen: 'A-', body: 'A-', battery: 84, faults: ['trueTone'] }, 'gwangju', 'Haeun', 1.0, 40, 'True Tone doesn’t work; the screen is original.', {}],
  ['iphone-xr', '64 GB', 'red', { screen: 'B', body: 'B', battery: 78 }, 'ulsan', 'Sungmin', 1.1, 52, 'Works fine, no problems.', {}],
  ['iphone-14', '128 GB', 'blue', { screen: 'A', body: 'A', battery: 90 }, 'gyeonggi', 'Eunji', 0.9, 60, 'Quick sale, price negotiable.', { box: 1, cable: 1 }],
  ['iphone-17-pro', '256 GB', 'orange', { screen: 'A', body: 'A', battery: 100 }, 'seoul', 'Junseo', 1.03, 70, 'New, only activated.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-12-pro', '128 GB', 'graphite', { screen: 'A-', body: 'B', battery: 80, glass: 'cracked' }, 'chungnam', 'Taeyang', 1.0, 76, 'Screen glass cracked at the edge; the display works.', {}],
  ['iphone-se-3', '64 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 92 }, 'gyeongnam', 'Soyeon', 1.05, 90, 'Small and handy, great for parents.', { box: 1 }],
  ['iphone-16', '128 GB', 'ultramarine', { screen: 'A', body: 'A-', battery: 97 }, 'busan', 'Minji', 1.0, 100, '', { cable: 1 }],
  ['iphone-14-pro-max', '256 GB', 'spaceblack', { screen: 'A-', body: 'B+', battery: 86, parts: { screen: 'unknown' } }, 'seoul', 'Jaehyun', 0.97, 120, 'Screen replaced (not original).', {}],
  ['iphone-11-pro', '256 GB', 'midgreen', { screen: 'B', body: 'B', battery: 77 }, 'jeonbuk', 'Siwoo', 1.12, 150, '', {}],
  ['iphone-air', '256 GB', 'sky', { screen: 'A', body: 'A', battery: 99 }, 'seoul', 'Chaewon', 1.0, 160, 'Very thin and light, perfect condition.', { box: 1, cable: 1 }],
  ['iphone-8-plus', '64 GB', 'gold', { screen: 'B', body: 'C', battery: 74 }, 'jeju', 'Joonho', 1.15, 200, 'Works; the body is worn.', {}],
];

// Other categories: [model, storage/SSD/case size, colour, answers, region, seller, asking price (KRW), hours ago, description, extras]
export const DEMO_OTHER = [
  ['galaxy-s24-ultra', '256 GB', 'titaniumgray', { screen: 'A', body: 'A-', batteryLevel: 'good', repair: 'none' }, 'seoul', 'Donghyun', 1_080_000, 4, 'S Pen included, still under warranty until December.', { box: 1, cable: 1 }],
  ['galaxy-z-flip6', '256 GB', 'mint', { screen: 'A-', body: 'A-', inner: 'minor', batteryLevel: 'good', repair: 'none' }, 'busan', 'Subin', 810_000, 11, 'Light crease on the inner screen, everything else is perfect.', { box: 1 }],
  ['galaxy-a55', '128 GB', 'navy', { screen: 'A-', body: 'B+', batteryLevel: 'ok', repair: 'none' }, 'incheon', 'Youngho', 360_000, 26, 'Always in a case, a small mark on the frame.', {}],
  ['ipad-air-11-m2', '128 GB', 'blue', { connectivity: 'wifi', screen: 'A', body: 'A', batteryLevel: 'good', repair: 'none' }, 'seoul', 'Hayoon', 740_000, 7, 'Comes with Apple Pencil Pro.', { box: 1, cable: 1, pencil: 1 }],
  ['ipad-10th-gen', '64 GB', 'silver', { connectivity: 'wifi', screen: 'A-', body: 'B+', batteryLevel: 'ok', repair: 'none' }, 'daejeon', 'Kyungsoo', 400_000, 45, '', { cable: 1 }],
  ['macbook-air-13-m2', '256 GB', 'midnight', { ram: 8, screen: 'A', body: 'A-', macBattery: 'normal', cycles: 94, repair: 'none' }, 'seoul', 'Seojun', 1_020_000, 16, '94 battery cycles, like new.', { box: 1, cable: 1 }],
  ['macbook-pro-14-m3-pro-max', '512 GB', 'spaceblack', { ram: 18, screen: 'A', body: 'A', macBattery: 'normal', cycles: 210, repair: 'none' }, 'seoul', 'Woojin', 2_530_000, 33, 'Used for design work, no scratches.', { box: 1, cable: 1, receipt: 1 }],
  ['apple-watch-series-9', '45 mm', 'midnight', { material: 'aluminum', connectivity: 'gps', screen: 'A-', body: 'A-', battery: 92, repair: 'none' }, 'gwangju', 'Dahye', 340_000, 58, 'Two extra bands included.', { box: 1, cable: 1, band: 1 }],
  ['apple-watch-ultra-2', '49 mm', 'natural', { material: 'titanium', connectivity: 'cellular', screen: 'A', body: 'B+', battery: 89, repair: 'none' }, 'gyeonggi', 'Sangwoo', 870_000, 80, '', { cable: 1 }],
];

const token = (key) => createHash('sha256').update(key).digest('hex');

export function seed() {
  const now = Date.now();
  let added = 0;
  const add = (key, model, storage, color, answers, region, name, price, est, hoursAgo, description, extras, i) => {
    if (!model || hasToken(token(key))) return;
    const phone = CATEGORIES[model.category].kind === 'phone';
    insertListing({
      category: model.category, model_id: model.id, model_name: model.name, series: model.series, storage, color,
      grade: conditionGrade(answers), battery: answers.battery || 0, answers, est_krw: est, price_krw: price,
      // Made-up numbers (010-0000-xxxx), so a public demo never sends calls to a real person.
      region, seller_name: name, phone: `+82100000${String(i + 10).padStart(4, '0')}`, kakao: null,
      description, photos: [], extras,
      token_hash: token(key), views: 12 + ((i * 37) % 180), created_at: now - hoursAgo * H,
    });
    added++;
  };
  DEMO.forEach(([modelId, storage, color, answers, region, name, factor, hoursAgo, description, extras], i) => {
    const model = byId(modelId);
    const a = { ...BASE, ...answers };
    const est = model && estimate(model, storage, a, config.pricing);
    if (est?.status !== 'ok') return;
    add(`demo-${i}`, model, storage, color, a, region, name, Math.round((est.krw * factor) / 10000) * 10000, est.krw, hoursAgo, description, extras, i);
  });
  DEMO_OTHER.forEach(([modelId, storage, color, answers, region, name, price, hoursAgo, description, extras], j) => {
    const model = byId(modelId);
    if (!model) { console.warn(`[seed] unknown model ${modelId}`); return; }
    add(`demo-other-${j}`, model, storage, color, { ...BASE, ...answers }, region, name, price, 0, hoursAgo, description, extras, 100 + j);
  });
  if (added) console.log(`[seed] Added ${added} demo listings`);
}
