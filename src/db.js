import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './paths.js';

mkdirSync(join(ROOT, 'data'), { recursive: true });
const db = new DatabaseSync(join(ROOT, 'data', 'app.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS listings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id    TEXT NOT NULL,
    model_name  TEXT NOT NULL,
    series      TEXT NOT NULL,
    storage     TEXT NOT NULL,
    color       TEXT,
    grade       TEXT NOT NULL,
    battery     INTEGER NOT NULL,
    answers     TEXT NOT NULL,
    est_krw     INTEGER NOT NULL,
    price_krw   INTEGER NOT NULL,
    region      TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    phone       TEXT NOT NULL,
    telegram    TEXT,       -- unused: Telegram username, asked until October 2026 (KakaoTalk since)
    description TEXT,
    photos      TEXT NOT NULL DEFAULT '[]',
    extras      TEXT NOT NULL DEFAULT '{}',
    uzimei      TEXT,       -- unused: Uzbek IMEI registration, asked until October 2026
    status      TEXT NOT NULL DEFAULT 'active',
    token_hash  TEXT NOT NULL,
    views       INTEGER NOT NULL DEFAULT 0,
    created_at  INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS listings_status_created ON listings(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS listings_model ON listings(model_id);
`);
// Added when categories beyond iPhone arrived; listings from before are iPhones.
if (!db.prepare('PRAGMA table_info(listings)').all().some((c) => c.name === 'category')) {
  db.exec("ALTER TABLE listings ADD COLUMN category TEXT NOT NULL DEFAULT 'iphone'");
}
db.exec('CREATE INDEX IF NOT EXISTS listings_category ON listings(category, status)');
// KakaoTalk ID or open chat link, added when the site moved from Uzbekistan to Korea.
if (!db.prepare('PRAGMA table_info(listings)').all().some((c) => c.name === 'kakao')) db.exec('ALTER TABLE listings ADD COLUMN kakao TEXT');
// Prices were stored in Uzbek som (8.5 som per won) until October 2026; they are in won now.
if (db.prepare('PRAGMA table_info(listings)').all().some((c) => c.name === 'price_uzs')) {
  db.exec(`BEGIN;
    ALTER TABLE listings RENAME COLUMN est_uzs TO est_krw;
    ALTER TABLE listings RENAME COLUMN price_uzs TO price_krw;
    UPDATE listings SET est_krw = CAST(ROUND(est_krw / 8.5) AS INTEGER), price_krw = CAST(ROUND(price_krw / 8.5 / 1000) * 1000 AS INTEGER);
    COMMIT;`);
}

const hydrate = (r) => r && ({
  ...r,
  answers: JSON.parse(r.answers),
  photos: JSON.parse(r.photos),
  extras: JSON.parse(r.extras),
});

export function insertListing(l) {
  const res = db.prepare(`
    INSERT INTO listings (category, model_id, model_name, series, storage, color, grade, battery, answers, est_krw, price_krw,
      region, seller_name, phone, kakao, description, photos, extras, token_hash, views, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    l.category, l.model_id, l.model_name, l.series, l.storage, l.color ?? null, l.grade, l.battery, JSON.stringify(l.answers),
    l.est_krw, l.price_krw, l.region, l.seller_name, l.phone, l.kakao ?? null, l.description ?? null,
    JSON.stringify(l.photos || []), JSON.stringify(l.extras || {}), l.token_hash, l.views || 0,
    l.created_at || Date.now(),
  );
  return Number(res.lastInsertRowid);
}

export const setPhotos = (id, photos) => db.prepare('UPDATE listings SET photos = ? WHERE id = ?').run(JSON.stringify(photos), id);
export const getListing = (id) => hydrate(db.prepare('SELECT * FROM listings WHERE id = ?').get(id));
export const addView = (id) => db.prepare('UPDATE listings SET views = views + 1 WHERE id = ?').run(id);
export const countListings = () => db.prepare("SELECT COUNT(*) AS n FROM listings WHERE status = 'active'").get().n;
export const countByCategory = () => Object.fromEntries(
  db.prepare("SELECT category, COUNT(*) AS n FROM listings WHERE status = 'active' GROUP BY category").all().map((r) => [r.category, r.n]));
export const hasToken = (tokenHash) => !!db.prepare('SELECT 1 FROM listings WHERE token_hash = ?').get(tokenHash);

export function setStatus(id, tokenHash, status) {
  return db.prepare('UPDATE listings SET status = ? WHERE id = ? AND token_hash = ?').run(status, id, tokenHash).changes > 0;
}

export function listByIds(ids) {
  if (!ids.length) return [];
  const rows = db.prepare(`SELECT * FROM listings WHERE id IN (${ids.map(() => '?').join(',')}) AND status != 'deleted'`).all(...ids);
  return rows.map(hydrate).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}

export function similar(modelId, series, excludeId, limit = 4) {
  return db.prepare(`
    SELECT * FROM listings WHERE status = 'active' AND id != ? AND series = ?
    ORDER BY (model_id = ?) DESC, created_at DESC LIMIT ?
  `).all(excludeId, series, modelId, limit).map(hydrate);
}

const GRADE_GROUPS = { a: ['A', 'A-'], b: ['B+', 'B'], c: ['C'] };
const SORTS = {
  new: 'created_at DESC',
  cheap: 'price_krw ASC',
  expensive: 'price_krw DESC',
  battery: 'battery DESC, created_at DESC',
};

export function search(f, { limit = 24 } = {}) {
  const where = ["status = 'active'"];
  const args = [];
  if (f.q) {
    // Every word must appear in the model name ("13 pro" matches "iPhone 13 Pro" and "iPhone 13 Pro Max").
    for (const w of f.q.toLowerCase().replace(/iphone|айфон|ayfon/g, ' ').split(/\s+/).filter(Boolean).slice(0, 5)) {
      where.push("(' ' || lower(model_name) || ' ') LIKE ? ESCAPE '\\'");
      args.push(`% ${w.replace(/[\\%_]/g, '\\$&')}%`); // a typed % or _ is literal, not a wildcard
    }
  }
  if (f.cat) { where.push('category = ?'); args.push(f.cat); }
  if (f.series) { where.push('series = ?'); args.push(f.series); }
  if (f.model) { where.push('model_id = ?'); args.push(f.model); }
  if (f.storage) { where.push('storage = ?'); args.push(f.storage); }
  if (f.region) { where.push('region = ?'); args.push(f.region); }
  if (GRADE_GROUPS[f.grade]) {
    where.push(`grade IN (${GRADE_GROUPS[f.grade].map(() => '?').join(',')})`);
    args.push(...GRADE_GROUPS[f.grade]);
  }
  if (f.min) { where.push('price_krw >= ?'); args.push(f.min); }
  if (f.max) { where.push('price_krw <= ?'); args.push(f.max); }
  if (f.bat) { where.push('battery >= ?'); args.push(f.bat); }
  const w = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) AS n FROM listings WHERE ${w}`).get(...args).n;
  const pages = Math.max(1, Math.ceil(total / limit));
  // A page past the end shows the last one; an absurd ?page= would also overflow SQLite's integer OFFSET.
  const page = Math.min(Math.max(1, f.page || 1), pages);
  const items = db.prepare(`SELECT * FROM listings WHERE ${w} ORDER BY ${SORTS[f.sort] || SORTS.new} LIMIT ? OFFSET ?`)
    .all(...args, limit, (page - 1) * limit).map(hydrate);
  return { items, total, page, pages };
}

export default db;
