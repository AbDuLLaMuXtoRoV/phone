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
  ['iphone-15-pro-max', '256 GB', 'natural', { screen: 'A', body: 'A', battery: 94 }, 'tashkent-city', 'Jasur', 1.04, 2, 'Perfect condition, always kept in a case. Box and cable included.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-13', '128 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 86 }, 'samarkand', 'Dilnoza', 1.0, 5, 'One owner, never opened for repair.', { box: 1 }],
  ['iphone-14-pro', '128 GB', 'deeppurple', { screen: 'A', body: 'B+', battery: 88 }, 'tashkent-city', 'Aziz', 1.08, 9, 'Small dent on the frame, otherwise great.', { cable: 1 }],
  ['iphone-12', '64 GB', 'blue', { screen: 'B', body: 'B', battery: 79, parts: { battery: 'genuine' } }, 'fergana', 'Malika', 0.95, 14, 'Battery replaced at a service centre with a genuine part.', {}],
  ['iphone-16-pro', '256 GB', 'deserttitan', { screen: 'A', body: 'A', battery: 100 }, 'tashkent-city', 'Sardor', 1.02, 20, 'Like new, used for 3 months. Still under warranty.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-11', '128 GB', 'white', { screen: 'A-', body: 'B+', battery: 83 }, 'andijan', 'Nodira', 1.06, 27, '', { box: 1 }],
  ['iphone-15', '128 GB', 'pink', { screen: 'A', body: 'A-', battery: 91, sim: 'esim' }, 'bukhara', 'Bekzod', 0.98, 31, 'US model, eSIM only.', { box: 1, cable: 1 }],
  ['iphone-13-pro-max', '256 GB', 'sierra', { screen: 'A-', body: 'A-', battery: 84, faults: ['trueTone'] }, 'namangan', 'Shahzoda', 1.0, 40, 'True Tone doesn’t work; the screen is original.', {}],
  ['iphone-xr', '64 GB', 'red', { screen: 'B', body: 'B', battery: 78 }, 'kashkadarya', 'Otabek', 1.1, 52, 'Works fine, no problems.', {}],
  ['iphone-14', '128 GB', 'blue', { screen: 'A', body: 'A', battery: 90 }, 'tashkent-region', 'Gulnora', 0.9, 60, 'Quick sale, price negotiable.', { box: 1, cable: 1 }],
  ['iphone-17-pro', '256 GB', 'orange', { screen: 'A', body: 'A', battery: 100 }, 'tashkent-city', 'Timur', 1.03, 70, 'New, only activated.', { box: 1, cable: 1, receipt: 1 }],
  ['iphone-12-pro', '128 GB', 'graphite', { screen: 'A-', body: 'B', battery: 80, glass: 'cracked' }, 'khorezm', 'Ulugbek', 1.0, 76, 'Screen glass cracked at the edge; the display works.', {}],
  ['iphone-se-3', '64 GB', 'midnight', { screen: 'A-', body: 'A-', battery: 92 }, 'navoi', 'Zarina', 1.05, 90, 'Small and handy, great for parents.', { box: 1 }],
  ['iphone-16', '128 GB', 'ultramarine', { screen: 'A', body: 'A-', battery: 97 }, 'samarkand', 'Kamola', 1.0, 100, '', { cable: 1 }],
  ['iphone-14-pro-max', '256 GB', 'spaceblack', { screen: 'A-', body: 'B+', battery: 86, parts: { screen: 'unknown' } }, 'tashkent-city', 'Rustam', 0.97, 120, 'Screen replaced (not original).', {}],
  ['iphone-11-pro', '256 GB', 'midgreen', { screen: 'B', body: 'B', battery: 77 }, 'jizzakh', 'Javohir', 1.12, 150, '', {}],
  ['iphone-air', '256 GB', 'sky', { screen: 'A', body: 'A', battery: 99 }, 'tashkent-city', 'Madina', 1.0, 160, 'Very thin and light, perfect condition.', { box: 1, cable: 1 }],
  ['iphone-8-plus', '64 GB', 'gold', { screen: 'B', body: 'C', battery: 74 }, 'surkhandarya', 'Sherzod', 1.15, 200, 'Works; the body is worn.', {}],
];

// Other categories: [model, storage/SSD/case size, colour, answers, region, seller, asking price (UZS), hours ago, description, extras]
export const DEMO_OTHER = [
  ['galaxy-s24-ultra', '256 GB', 'titaniumgray', { screen: 'A', body: 'A-', batteryLevel: 'good', repair: 'none' }, 'tashkent-city', 'Bobur', 9_200_000, 4, 'S Pen included, still under warranty until December.', { box: 1, cable: 1 }],
  ['galaxy-z-flip6', '256 GB', 'mint', { screen: 'A-', body: 'A-', inner: 'minor', batteryLevel: 'good', repair: 'none' }, 'samarkand', 'Laylo', 6_900_000, 11, 'Light crease on the inner screen, everything else is perfect.', { box: 1 }],
  ['galaxy-a55', '128 GB', 'navy', { screen: 'A-', body: 'B+', batteryLevel: 'ok', repair: 'none' }, 'fergana', 'Sanjar', 3_100_000, 26, 'Always in a case, a small mark on the frame.', {}],
  ['ipad-air-11-m2', '128 GB', 'blue', { connectivity: 'wifi', screen: 'A', body: 'A', batteryLevel: 'good', repair: 'none' }, 'tashkent-city', 'Nigora', 6_300_000, 7, 'Comes with Apple Pencil Pro.', { box: 1, cable: 1, pencil: 1 }],
  ['ipad-10th-gen', '64 GB', 'silver', { connectivity: 'wifi', screen: 'A-', body: 'B+', batteryLevel: 'ok', repair: 'none' }, 'bukhara', 'Akmal', 3_400_000, 45, '', { cable: 1 }],
  ['macbook-air-13-m2', '256 GB', 'midnight', { ram: 8, screen: 'A', body: 'A-', macBattery: 'normal', cycles: 94, repair: 'none' }, 'tashkent-city', 'Diyor', 8_700_000, 16, '94 battery cycles, like new.', { box: 1, cable: 1 }],
  ['macbook-pro-14-m3-pro-max', '512 GB', 'spaceblack', { ram: 18, screen: 'A', body: 'A', macBattery: 'normal', cycles: 210, repair: 'none' }, 'tashkent-city', 'Kamron', 21_500_000, 33, 'Used for design work, no scratches.', { box: 1, cable: 1, receipt: 1 }],
  ['apple-watch-series-9', '45 mm', 'midnight', { material: 'aluminum', connectivity: 'gps', screen: 'A-', body: 'A-', battery: 92, repair: 'none' }, 'namangan', 'Shoira', 2_900_000, 58, 'Two extra bands included.', { box: 1, cable: 1, band: 1 }],
  ['apple-watch-ultra-2', '49 mm', 'natural', { material: 'titanium', connectivity: 'cellular', screen: 'A', body: 'B+', battery: 89, repair: 'none' }, 'tashkent-region', 'Ravshan', 7_400_000, 80, '', { cable: 1 }],
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
      grade: conditionGrade(answers), battery: answers.battery || 0, answers, est_uzs: est, price_uzs: price,
      // Operator code 00 does not exist, so a public demo never sends calls to a real person.
      region, seller_name: name, phone: `+998000000${String(i + 10).padStart(3, '0')}`, telegram: null,
      description, photos: [], extras, uzimei: applies('uzimei', model, answers) ? (i % 4 === 3 ? 'unknown' : 'yes') : (phone ? 'yes' : null),
      token_hash: token(key), views: 12 + ((i * 37) % 180), created_at: now - hoursAgo * H,
    });
    added++;
  };
  DEMO.forEach(([modelId, storage, color, answers, region, name, factor, hoursAgo, description, extras], i) => {
    const model = byId(modelId);
    const a = { ...BASE, ...answers };
    const est = model && estimate(model, storage, a, config.pricing);
    if (est?.status !== 'ok') return;
    add(`demo-${i}`, model, storage, color, a, region, name, Math.round((est.uzs * factor) / 50000) * 50000, est.uzs, hoursAgo, description, extras, i);
  });
  DEMO_OTHER.forEach(([modelId, storage, color, answers, region, name, price, hoursAgo, description, extras], j) => {
    const model = byId(modelId);
    if (!model) { console.warn(`[seed] unknown model ${modelId}`); return; }
    add(`demo-other-${j}`, model, storage, color, { ...BASE, ...answers }, region, name, price, 0, hoursAgo, description, extras, 100 + j);
  });
  if (added) console.log(`[seed] Added ${added} demo listings`);
}
