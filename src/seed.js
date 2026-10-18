// Demo listings so the marketplace is not empty on first run. Prices are computed with the real engine.
import { createHash } from 'node:crypto';
import { byId } from './catalog.js';
import { countListings, insertListing } from './db.js';
import { estimate, conditionGrade } from '../public/assets/pricing.js';
import config from './config.js';

const H = 3600e3;
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
      // Operator code 00 does not exist, so a public demo never sends calls to a real person.
      region, seller_name: name, phone: `+9980000000${String(i + 10).padStart(2, '0')}`, telegram: null,
      description, photos: [], extras, uzimei: i % 4 === 3 ? 'unknown' : 'yes',
      token_hash: createHash('sha256').update(`demo-${i}`).digest('hex'),
      views: 12 + ((i * 37) % 180), created_at: now - hoursAgo * H,
    });
  });
  console.log(`[seed] Added ${countListings()} demo listings`);
}
