import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { join, normalize as normPath, extname, sep } from 'node:path';
import { networkInterfaces } from 'node:os';

import config from './src/config.js';
import { ROOT } from './src/paths.js';
import { byId, MODELS, SERIES } from './src/catalog.js';
import * as db from './src/db.js';
import { seedIfEmpty } from './src/seed.js';
import { LANGS, pickLang, langCookie } from './src/i18n.js';
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

// `key` names a message in the language packs' `err` section; it is worded for the visitor when sent.
class HttpError extends Error {
  constructor(status, key) { super(key); this.status = status; this.key = key; }
}

function send(req, res, status, body, type = 'text/html; charset=utf-8', headers = {}) {
  let buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const h = { ...SECURITY_HEADERS, 'Content-Type': type, ...headers };
  if (buf.length > 1024 && COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    buf = gzipSync(buf);
    h['Content-Encoding'] = 'gzip';
    h.Vary = [h.Vary, 'Accept-Encoding'].filter(Boolean).join(', ');
  }
  h['Content-Length'] = buf.length;
  res.writeHead(status, h);
  res.end(req.method === 'HEAD' ? undefined : buf);
}
// Pages differ by language, which comes from the cookie or the browser's language.
const sendHtml = (req, res, html, status = 200) => send(req, res, status, html, MIME['.html'], { 'Cache-Control': 'no-cache', Vary: 'Cookie, Accept-Language' });
const sendJson = (req, res, obj, status = 200) => send(req, res, status, JSON.stringify(obj), MIME['.json'], { 'Cache-Control': 'no-store' });
const redirect = (res, to, status = 302) => { res.writeHead(status, { Location: to }); res.end(); };

async function serveFile(req, res, baseDir, relPath, cacheControl) {
  const file = normPath(join(baseDir, decodeURIComponent(relPath)));
  if (!file.startsWith(baseDir + sep)) throw new HttpError(404, 'notFound');
  let data;
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    data = await readFile(file);
  } catch { throw new HttpError(404, 'notFound'); }
  send(req, res, 200, data, MIME[extname(file).toLowerCase()] || 'application/octet-stream', { 'Cache-Control': cacheControl });
}

async function readJson(req, limit = 25 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw new HttpError(413, 'tooLarge');
    chunks.push(c);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { throw new HttpError(400, 'badRequest'); }
}

// ---- validation -------------------------------------------------------------------------------

const oneOf = (values, v) => (values.includes(v) ? v : undefined);
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
  if (out.powersOn === 'yes') {
    Object.assign(out, {
      imeiOk: oneOf(BASIC.imeiOk, a.imeiOk),
      refurbished: oneOf(BASIC.refurbished, a.refurbished),
      display: oneOf(SCREEN.display, a.display),
      battery: Number.isInteger(+a.battery) && +a.battery >= 1 && +a.battery <= 100 ? +a.battery : undefined,
      faults: [...new Set((Array.isArray(a.faults) ? a.faults : []).filter((f) => FAULTS.some((x) => x.k === f && (!x.when || x.when(model)))))],
      parts: Object.fromEntries(PARTS.items.map((p) => [p, oneOf(PARTS.options, a.parts?.[p]) || 'none'])),
    });
  } else {
    // A phone that does not turn on cannot be tested; record that instead of guessing.
    Object.assign(out, { imeiOk: 'no', refurbished: 'no', display: 'unknown', battery: 0, faults: [], parts: { screen: 'none', battery: 'none', camera: 'none' }, untested: true });
  }
  if (Object.values(out).some((v) => v === undefined)) throw new HttpError(400, 'incomplete');
  return out;
}

// Behind a tunnel or reverse proxy every request arrives from the proxy, so read the visitor's address from
// its header. Headers are only trusted when the direct peer is this machine (a local tunnel such as
// cloudflared) or TRUST_PROXY=1 is set (a hosting platform's load balancer).
function clientIp(req) {
  const direct = req.socket.remoteAddress || '';
  if (!config.trustProxy && !/^(::1|127\.|::ffff:127\.)/.test(direct)) return direct;
  return req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || direct;
}

// Simple abuse guard: at most 10 published listings per hour per IP. Failed attempts are not counted,
// so someone fixing a validation error is never locked out.
const createHits = new Map(); // ip -> timestamps of successful creates
function checkRate(ip) {
  const hits = (createHits.get(ip) || []).filter((t) => Date.now() - t < 3600e3);
  createHits.set(ip, hits);
  if (hits.length >= 10) throw new HttpError(429, 'rate');
}
const recordHit = (ip) => createHits.get(ip).push(Date.now());

function decodePhoto(dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) throw new HttpError(400, 'photoFormat');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > config.maxPhotoBytes) throw new HttpError(400, 'photoSize');
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf.subarray(0, 4).toString('hex') === '89504e47';
  const isWebp = buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  if (!(isJpeg || isPng || isWebp)) throw new HttpError(400, 'photoBroken');
  return { buf, ext: isJpeg ? 'jpg' : isPng ? 'png' : 'webp' };
}

async function createListing(req, res) {
  const ip = clientIp(req);
  checkRate(ip);
  const b = await readJson(req);
  const model = byId(b.model);
  if (!model) throw new HttpError(400, 'modelNotFound');
  const storage = model.storages.find((s) => s.label === b.storage)?.label;
  if (!storage) throw new HttpError(400, 'storage');
  const answers = sanitizeAnswers(b.answers, model);
  const est = estimate(model, storage, answers, config.pricing);
  if (est.status === 'blocked') throw new HttpError(400, 'icloud');

  const price = parseInt(String(b.price ?? '').replace(/\D/g, ''), 10);
  if (!(price >= 10_000 && price <= 500_000_000)) throw new HttpError(400, 'price');
  const region = REGIONS.includes(b.region) ? b.region : null;
  if (!region) throw new HttpError(400, 'region');
  const name = clean(b.name, 40);
  if (name.length < 2) throw new HttpError(400, 'name');
  let phone = String(b.phone ?? '').replace(/\D/g, '');
  if (phone.length === 9) phone = `998${phone}`;
  if (!/^998\d{9}$/.test(phone)) throw new HttpError(400, 'phone');
  const telegram = clean(b.telegram, 40).replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
  if (telegram && !/^[A-Za-z0-9_]{5,32}$/.test(telegram)) throw new HttpError(400, 'telegram');
  const photos = Array.isArray(b.photos) ? b.photos.slice(0, config.maxPhotos).map(decodePhoto) : [];

  const token = randomBytes(18).toString('base64url');
  const id = db.insertListing({
    model_id: model.id, model_name: model.name, series: model.series, storage,
    color: model.colors.some((c) => c.k === b.color) ? b.color : null,
    grade: est.status === 'scrap' ? 'C' : conditionGrade(answers),
    battery: answers.battery, answers, est_uzs: est.uzs, price_uzs: price, region,
    seller_name: name, phone: `+${phone}`, telegram: telegram || null,
    description: clean(b.description, 1000) || null,
    extras: Object.fromEntries(EXTRAS.map((k) => [k, b.extras?.[k] ? 1 : 0])),
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
  sendJson(req, res, { id, token, url: `/phone/${id}?new=1` }, 201);
}

// ---- routing ----------------------------------------------------------------------------------

const intParam = (v) => { const n = parseInt(String(v || '').replace(/\D/g, ''), 10); return Number.isFinite(n) && n > 0 ? n : 0; };
const idList = (v) => [...new Set(String(v || '').split(',').map((x) => parseInt(x, 10)).filter((n) => n > 0))].slice(0, 100);

// The first version used Uzbek URLs; links to them may already be shared.
const OLD_PATHS = [
  [/^\/telefonlar$/, '/phones'], [/^\/telefon\/(\d+)$/, '/phone/$1'], [/^\/sotish$/, '/sell'],
  [/^\/narxlar$/, '/prices'], [/^\/sevimlilar$/, '/saved'], [/^\/elonlarim$/, '/my-listings'],
];

async function route(req, res, url, L) {
  const p = url.pathname;
  const q = Object.fromEntries(url.searchParams);
  const here = p + url.search;
  const isGet = req.method === 'GET' || req.method === 'HEAD';

  if (isGet) {
    const old = OLD_PATHS.find(([re]) => re.test(p));
    if (old) return redirect(res, p.replace(old[0], old[1]) + url.search, 301);
  }
  if (isGet && p === '/') {
    return sendHtml(req, res, homePage(L, { here, latest: db.search({ sort: 'new' }, { limit: 8 }).items, total: db.countListings() }));
  }
  if (isGet && p === '/phones') {
    const f = {
      q: clean(q.q, 60), series: SERIES.includes(q.series) ? q.series : '', model: byId(q.model) ? q.model : '', storage: clean(q.storage, 10),
      grade: ['a', 'b', 'c'].includes(q.grade) ? q.grade : '', region: REGIONS.includes(q.region) ? q.region : '',
      min: intParam(q.min), max: intParam(q.max), bat: intParam(q.bat), sort: clean(q.sort, 10), page: intParam(q.page) || 1,
    };
    if (f.model) f.series = '';
    if (f.min && f.max && f.min > f.max) [f.min, f.max] = [f.max, f.min];
    const result = db.search(f);
    f.min ||= ''; f.max ||= ''; f.bat ||= ''; f.page = f.page > 1 ? f.page : '';
    if (f.sort === 'new') f.sort = '';
    return sendHtml(req, res, catalogPage(L, { here, f, result, focusSearch: q.focus === 'q' }));
  }
  let m;
  if (isGet && (m = /^\/phone\/(\d+)$/.exec(p))) {
    const l = db.getListing(+m[1]);
    if (!l || l.status === 'deleted') return sendHtml(req, res, notFoundPage(L, { here }), 404);
    if (req.method === 'GET') db.addView(l.id);
    return sendHtml(req, res, listingPage(L, { here, l, similar: db.similar(l.model_id, l.series, l.id), isNew: q.new === '1' }));
  }
  if (isGet && p === '/sell') {
    return sendHtml(req, res, sellPage(L, {
      here,
      preModel: byId(q.model) ? q.model : null,
      preSeries: SERIES.includes(q.series) ? q.series : null,
      q: clean(q.q, 40),
    }));
  }
  if (isGet && p === '/prices') return sendHtml(req, res, pricesPage(L, { here }));
  if (isGet && p === '/saved') {
    return sendHtml(req, res, favoritesPage(L, { here, items: db.listByIds(idList(q.ids)), hasIds: 'ids' in q }));
  }
  if (isGet && p === '/my-listings') {
    return sendHtml(req, res, minePage(L, { here, items: db.listByIds(idList(q.ids)), hasIds: 'ids' in q }));
  }

  // API
  if (req.method === 'POST' && p === '/api/estimate') {
    const b = await readJson(req, 64 * 1024);
    const model = byId(b.model);
    if (!model) throw new HttpError(400, 'modelNotFound');
    const est = estimate(model, b.storage, b.answers || {}, config.pricing);
    return sendJson(req, res, { ...est, lines: est.lines?.map((l) => ({ ...l, label: L.line(l, model) })) });
  }
  if (req.method === 'POST' && p === '/api/listings') return createListing(req, res);
  if (req.method === 'POST' && (m = /^\/api\/listings\/(\d+)\/status$/.exec(p))) {
    const b = await readJson(req, 4096);
    if (!['active', 'sold', 'deleted'].includes(b.status)) throw new HttpError(400, 'status');
    const ok = db.setStatus(+m[1], createHash('sha256').update(String(b.token || '')).digest('hex'), b.status);
    if (!ok) throw new HttpError(403, 'forbidden');
    return sendJson(req, res, { ok: true });
  }
  if (isGet && p === '/api/models') {
    return sendJson(req, res, MODELS.map(({ id, name, year, storages }) => ({ id, name, year, storages: storages.map((s) => s.label) })));
  }

  // Static
  if (isGet && p.startsWith('/assets/')) return serveFile(req, res, join(PUBLIC, 'assets'), p.slice(8), url.search ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  if (isGet && p.startsWith('/uploads/')) return serveFile(req, res, UPLOADS, p.slice(9), 'public, max-age=86400');
  if (isGet && ['/favicon.svg', '/manifest.webmanifest', '/robots.txt'].includes(p)) return serveFile(req, res, PUBLIC, p.slice(1), 'public, max-age=86400');
  if (isGet && p === '/healthz') return sendJson(req, res, { ok: true, listings: db.countListings() });

  throw new HttpError(404, 'notFound');
}

const server = createServer(async (req, res) => {
  const t = Date.now();
  const url = new URL(req.url, 'http://local');
  const { lang, remember } = pickLang(req, url);
  const L = LANGS[lang];
  if (remember) res.setHeader('Set-Cookie', langCookie(lang));
  try {
    await route(req, res, url, L);
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    if (res.headersSent) return res.end();
    if (url.pathname.startsWith('/api/')) sendJson(req, res, { error: L.err[status === 500 ? 'server' : err.key] || L.err.badRequest }, status);
    else sendHtml(req, res, notFoundPage(L, { here: url.pathname + url.search }), status === 500 ? 500 : 404);
  } finally {
    if (process.env.LOG !== '0') console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - t}ms`);
  }
});

server.listen(config.port, config.host, () => {
  const lan = Object.values(networkInterfaces()).flat().find((i) => i?.family === 'IPv4' && !i.internal)?.address;
  console.log(`\n  ${config.siteName} is running`);
  console.log(`  On this computer:  http://localhost:${config.port}`);
  if (lan) console.log(`  On your phone (same Wi‑Fi):  http://${lan}:${config.port}`);
  console.log(`  Rate: 1 KRW = ${config.pricing.krwToUzs} UZS, multiplier ${config.pricing.multiplier}\n`);
});
