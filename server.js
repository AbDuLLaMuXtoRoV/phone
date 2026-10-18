import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { join, normalize as normPath, extname, sep } from 'node:path';
import { networkInterfaces } from 'node:os';

import config from './src/config.js';
import { ROOT } from './src/paths.js';
import { byId, MODELS } from './src/catalog.js';
import * as db from './src/db.js';
import { seedIfEmpty } from './src/seed.js';
import { estimate, conditionGrade } from './public/assets/pricing.js';
import { BASIC, LOOKS, SCREEN, FAULTS, PARTS, EXTRAS, UZIMEI, REGIONS } from './public/assets/questions.js';
import { homePage } from './src/views/home.js';
import { catalogPage } from './src/views/catalog.js';
import { listingPage } from './src/views/listing.js';
import { sellPage } from './src/views/sell.js';
import { pricesPage, favoritesPage, minePage, notFoundPage } from './src/views/misc.js';

const PUBLIC = join(ROOT, 'public');
const UPLOADS = join(ROOT, 'uploads');
await mkdir(UPLOADS, { recursive: true });
seedIfEmpty();

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};
const COMPRESSIBLE = /^(text\/|application\/(json|manifest)|image\/svg)/;

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function send(req, res, status, body, type = 'text/html; charset=utf-8', headers = {}) {
  let buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const h = { ...SECURITY_HEADERS, 'Content-Type': type, ...headers };
  if (buf.length > 1024 && COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    buf = gzipSync(buf);
    h['Content-Encoding'] = 'gzip';
    h.Vary = 'Accept-Encoding';
  }
  h['Content-Length'] = buf.length;
  res.writeHead(status, h);
  res.end(req.method === 'HEAD' ? undefined : buf);
}
const sendHtml = (req, res, html, status = 200) => send(req, res, status, html, MIME['.html'], { 'Cache-Control': 'no-cache' });
const sendJson = (req, res, obj, status = 200) => send(req, res, status, JSON.stringify(obj), MIME['.json'], { 'Cache-Control': 'no-store' });

async function serveFile(req, res, baseDir, relPath, cacheControl) {
  const file = normPath(join(baseDir, decodeURIComponent(relPath)));
  if (!file.startsWith(baseDir + sep)) throw new HttpError(404, 'Not found');
  let data;
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    data = await readFile(file);
  } catch { throw new HttpError(404, 'Not found'); }
  send(req, res, 200, data, MIME[extname(file).toLowerCase()] || 'application/octet-stream', { 'Cache-Control': cacheControl });
}

async function readJson(req, limit = 25 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw new HttpError(413, 'Maʼlumot hajmi juda katta. Rasmlar sonini kamaytiring.');
    chunks.push(c);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { throw new HttpError(400, 'Notoʻgʻri soʻrov'); }
}

// ---- validation -------------------------------------------------------------------------------

const oneOf = (q, v) => (q.options.some((o) => o.v === v) ? v : undefined);
const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

// Keep only known answers with allowed values. Throws if a required answer is missing.
function sanitizeAnswers(input, model) {
  const a = input && typeof input === 'object' ? input : {};
  const out = {
    powersOn: oneOf(BASIC.powersOn, a.powersOn),
    icloudOff: oneOf(BASIC.icloudOff, a.icloudOff),
    screen: oneOf(LOOKS.screen, a.screen),
    body: oneOf(LOOKS.body, a.body),
    lens: oneOf(LOOKS.lens, a.lens),
    bent: oneOf(LOOKS.bent, a.bent),
    glass: oneOf(SCREEN.glass, a.glass),
    backGlass: model.glassBack ? oneOf(LOOKS.backGlass, a.backGlass) : 'ok',
    sim: model.esimQ ? oneOf(BASIC.sim, a.sim) : 'sim',
  };
  const alive = out.powersOn === 'yes';
  if (alive) {
    Object.assign(out, {
      imeiOk: oneOf(BASIC.imeiOk, a.imeiOk),
      refurbished: oneOf(BASIC.refurbished, a.refurbished),
      display: oneOf(SCREEN.display, a.display),
      battery: Number.isInteger(+a.battery) && +a.battery >= 1 && +a.battery <= 100 ? +a.battery : undefined,
      faults: [...new Set((Array.isArray(a.faults) ? a.faults : []).filter((f) => FAULTS.some((x) => x.k === f && (!x.when || x.when(model)))))],
      parts: Object.fromEntries(PARTS.items.map((p) => [p.k, oneOf(PARTS, a.parts?.[p.k]) || 'none'])),
    });
  } else {
    // A phone that does not turn on cannot be tested; record that instead of guessing.
    Object.assign(out, { imeiOk: 'no', refurbished: 'no', display: 'unknown', battery: 0, faults: [], parts: { screen: 'none', battery: 'none', camera: 'none' }, untested: true });
  }
  const missing = Object.entries(out).filter(([, v]) => v === undefined).map(([k]) => k);
  if (missing.length) throw new HttpError(400, `Holat savollariga toʻliq javob bering (${missing.join(', ')}).`);
  return out;
}

// Simple abuse guard: at most 10 published listings per hour per IP. Failed attempts are not counted,
// so someone fixing a validation error is never locked out.
const createHits = new Map(); // ip -> timestamps of successful creates
function checkRate(ip) {
  const hits = (createHits.get(ip) || []).filter((t) => Date.now() - t < 3600e3);
  createHits.set(ip, hits);
  if (hits.length >= 10) throw new HttpError(429, 'Juda koʻp eʼlon. Birozdan soʻng qayta urinib koʻring.');
}
const recordHit = (ip) => createHits.get(ip).push(Date.now());

function decodePhoto(dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) throw new HttpError(400, 'Rasm formati notoʻgʻri.');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > config.maxPhotoBytes) throw new HttpError(400, 'Rasm hajmi juda katta.');
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf.subarray(0, 4).toString('hex') === '89504e47';
  const isWebp = buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  if (!(isJpeg || isPng || isWebp)) throw new HttpError(400, 'Rasm fayli buzilgan.');
  return { buf, ext: isJpeg ? 'jpg' : isPng ? 'png' : 'webp' };
}

async function createListing(req, res) {
  const ip = req.socket.remoteAddress;
  checkRate(ip);
  const b = await readJson(req);
  const model = byId(b.model);
  if (!model) throw new HttpError(400, 'Model topilmadi.');
  const storage = model.storages.find((s) => s.label === b.storage)?.label;
  if (!storage) throw new HttpError(400, 'Xotira hajmini tanlang.');
  const answers = sanitizeAnswers(b.answers, model);
  const est = estimate(model, storage, answers, config.pricing);
  if (est.status === 'blocked') throw new HttpError(400, 'iCloud’dan chiqilmagan telefonni sotib boʻlmaydi.');

  const price = parseInt(String(b.price ?? '').replace(/\D/g, ''), 10);
  if (!(price >= 10_000 && price <= 500_000_000)) throw new HttpError(400, 'Narxni toʻgʻri kiriting.');
  const region = REGIONS.includes(b.region) ? b.region : null;
  if (!region) throw new HttpError(400, 'Hududni tanlang.');
  const name = clean(b.name, 40);
  if (name.length < 2) throw new HttpError(400, 'Ismingizni kiriting.');
  let phone = String(b.phone ?? '').replace(/\D/g, '');
  if (phone.length === 9) phone = `998${phone}`;
  if (!/^998\d{9}$/.test(phone)) throw new HttpError(400, 'Telefon raqamini toʻliq kiriting: +998 XX XXX XX XX.');
  const telegram = clean(b.telegram, 40).replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
  if (telegram && !/^[A-Za-z0-9_]{5,32}$/.test(telegram)) throw new HttpError(400, 'Telegram foydalanuvchi nomi notoʻgʻri.');
  const photos = Array.isArray(b.photos) ? b.photos.slice(0, config.maxPhotos).map(decodePhoto) : [];

  const token = randomBytes(18).toString('base64url');
  const id = db.insertListing({
    model_id: model.id, model_name: model.name, series: model.series, storage,
    color: model.colors.some((c) => c.k === b.color) ? b.color : null,
    grade: est.status === 'scrap' ? 'C' : conditionGrade(answers),
    battery: answers.battery, answers, est_uzs: est.uzs, price_uzs: price, region,
    seller_name: name, phone: `+${phone}`, telegram: telegram || null,
    description: clean(b.description, 1000) || null,
    extras: Object.fromEntries(EXTRAS.map((e) => [e.k, b.extras?.[e.k] ? 1 : 0])),
    uzimei: oneOf(UZIMEI, b.uzimei) || 'unknown',
    token_hash: createHash('sha256').update(token).digest('hex'),
  });
  if (photos.length) {
    const dir = join(UPLOADS, String(id));
    await mkdir(dir, { recursive: true });
    const urls = [];
    for (const [i, p] of photos.entries()) {
      await writeFile(join(dir, `${i + 1}.${p.ext}`), p.buf);
      urls.push(`/uploads/${id}/${i + 1}.${p.ext}`);
    }
    db.setPhotos(id, urls);
  }
  recordHit(ip);
  sendJson(req, res, { id, token, url: `/telefon/${id}?new=1` }, 201);
}

// ---- routing ----------------------------------------------------------------------------------

const intParam = (v) => { const n = parseInt(String(v || '').replace(/\D/g, ''), 10); return Number.isFinite(n) && n > 0 ? n : 0; };
const idList = (v) => [...new Set(String(v || '').split(',').map((x) => parseInt(x, 10)).filter((n) => n > 0))].slice(0, 100);

async function route(req, res) {
  const url = new URL(req.url, 'http://local');
  const p = url.pathname;
  const q = Object.fromEntries(url.searchParams);
  const isGet = req.method === 'GET' || req.method === 'HEAD';

  if (isGet && p === '/') {
    return sendHtml(req, res, homePage({ latest: db.search({ sort: 'new' }, { limit: 8 }).items, total: db.countListings() }));
  }
  if (isGet && p === '/telefonlar') {
    const f = {
      q: clean(q.q, 60), series: clean(q.series, 8), model: byId(q.model) ? q.model : '', storage: clean(q.storage, 10),
      grade: ['a', 'b', 'c'].includes(q.grade) ? q.grade : '', region: REGIONS.includes(q.region) ? q.region : '',
      min: intParam(q.min), max: intParam(q.max), bat: intParam(q.bat), sort: clean(q.sort, 10), page: intParam(q.page) || 1,
    };
    if (f.model) f.series = '';
    if (f.min && f.max && f.min > f.max) [f.min, f.max] = [f.max, f.min];
    const result = db.search(f);
    f.min ||= ''; f.max ||= ''; f.bat ||= ''; f.page = f.page > 1 ? f.page : '';
    if (f.sort === 'new') f.sort = '';
    return sendHtml(req, res, catalogPage({ f, result: { ...result, page: result.page }, focusSearch: q.focus === 'q' }));
  }
  let m;
  if (isGet && (m = /^\/telefon\/(\d+)$/.exec(p))) {
    const l = db.getListing(+m[1]);
    if (!l || l.status === 'deleted') return sendHtml(req, res, notFoundPage(), 404);
    if (req.method === 'GET') db.addView(l.id);
    return sendHtml(req, res, listingPage({ l, similar: db.similar(l.model_id, l.series, l.id), isNew: q.new === '1' }));
  }
  if (isGet && p === '/sotish') {
    return sendHtml(req, res, sellPage({ preModel: byId(q.model) ? q.model : null, q: clean(q.q, 40) }));
  }
  if (isGet && p === '/narxlar') return sendHtml(req, res, pricesPage());
  if (isGet && p === '/sevimlilar') {
    const ids = idList(q.ids);
    return sendHtml(req, res, favoritesPage({ items: db.listByIds(ids), hasIds: 'ids' in q }));
  }
  if (isGet && p === '/elonlarim') {
    const ids = idList(q.ids);
    return sendHtml(req, res, minePage({ items: db.listByIds(ids), hasIds: 'ids' in q }));
  }

  // API
  if (req.method === 'POST' && p === '/api/estimate') {
    const b = await readJson(req, 64 * 1024);
    const model = byId(b.model);
    if (!model) throw new HttpError(400, 'Model topilmadi.');
    return sendJson(req, res, estimate(model, b.storage, b.answers || {}, config.pricing));
  }
  if (req.method === 'POST' && p === '/api/listings') return createListing(req, res);
  if (req.method === 'POST' && (m = /^\/api\/listings\/(\d+)\/status$/.exec(p))) {
    const b = await readJson(req, 4096);
    if (!['active', 'sold', 'deleted'].includes(b.status)) throw new HttpError(400, 'Notoʻgʻri holat.');
    const ok = db.setStatus(+m[1], createHash('sha256').update(String(b.token || '')).digest('hex'), b.status);
    if (!ok) throw new HttpError(403, 'Bu eʼlonni boshqarishga ruxsat yoʻq.');
    return sendJson(req, res, { ok: true });
  }
  if (isGet && p === '/api/models') {
    return sendJson(req, res, MODELS.map(({ id, name, year, storages }) => ({ id, name, year, storages: storages.map((s) => s.label) })));
  }

  // Static
  if (isGet && p.startsWith('/assets/')) return serveFile(req, res, join(PUBLIC, 'assets'), p.slice(8), url.search ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  if (isGet && p.startsWith('/uploads/')) return serveFile(req, res, UPLOADS, p.slice(9), 'public, max-age=86400');
  if (isGet && ['/favicon.svg', '/manifest.webmanifest', '/robots.txt', '/icon-192.png', '/icon-512.png'].includes(p)) return serveFile(req, res, PUBLIC, p.slice(1), 'public, max-age=86400');
  if (isGet && p === '/healthz') return sendJson(req, res, { ok: true, listings: db.countListings() });

  throw new HttpError(404, 'Sahifa topilmadi');
}

const server = createServer(async (req, res) => {
  const t = Date.now();
  try {
    await route(req, res);
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    if (res.headersSent) return res.end();
    const wantsJson = req.url.startsWith('/api/');
    if (wantsJson) sendJson(req, res, { error: status === 500 ? 'Server xatosi. Birozdan soʻng qayta urinib koʻring.' : err.message }, status);
    else sendHtml(req, res, notFoundPage(), status === 500 ? 500 : 404);
  } finally {
    if (process.env.LOG !== '0') console.log(`${req.method} ${req.url.split('?')[0]} ${res.statusCode} ${Date.now() - t}ms`);
  }
});

server.listen(config.port, config.host, () => {
  const lan = Object.values(networkInterfaces()).flat().find((i) => i?.family === 'IPv4' && !i.internal)?.address;
  console.log(`\n  ${config.siteName} ishga tushdi`);
  console.log(`  Kompyuterda:  http://localhost:${config.port}`);
  if (lan) console.log(`  Telefonda (bir xil Wi‑Fi):  http://${lan}:${config.port}`);
  console.log(`  Kurs: 1 KRW = ${config.pricing.krwToUzs} soʻm, koeffitsiyent ${config.pricing.multiplier}\n`);
});
