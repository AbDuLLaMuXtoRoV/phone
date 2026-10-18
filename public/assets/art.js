// Drawn devices, used when a listing has no photos. Camera layout and colour follow the real model.
// Shared by the server (listing cards) and the browser (sell wizard).

let n = 0;
const escAttr = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#151618" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * 0.48}" fill="#26303d"/><circle cx="${x - r * 0.22}" cy="${y - r * 0.22}" r="${r * 0.14}" fill="rgba(255,255,255,.55)"/>`;
// Galaxy-style lens: a metal ring around the glass.
const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 1.8}" fill="rgba(0,0,0,.18)" stroke="rgba(255,255,255,.5)" stroke-width="1"/>${lens(x, y, r)}`;
const dot = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.75)" stroke="rgba(0,0,0,.15)"/>`;
const bump = (x, y, w, h, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="rgba(0,0,0,.09)" stroke="rgba(255,255,255,.45)" stroke-width="1"/>`;
const sheen = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>`;
const body = (x, y, w, h, rx, fill, id) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="rgba(0,0,0,.18)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${id})"/>`;

// Phone backs share one 120×240 canvas; other devices have their own proportions.
const PHONE_CAMS = {
  single: lens(30, 30, 9) + dot(48, 26),
  dualv: bump(18, 15, 24, 48, 12) + lens(30, 27, 8) + lens(30, 51, 8) + dot(48, 30),
  dual: bump(16, 14, 46, 46, 13) + lens(29, 27, 9) + lens(49, 47, 9) + dot(50, 26),
  triple: bump(15, 13, 52, 52, 14) + lens(29, 27, 10) + lens(29, 51, 10) + lens(52, 39, 10) + dot(52, 22) + dot(52, 56),
  plateau: '<path d="M10 30a20 20 0 0 1 20-20h60a20 20 0 0 1 20 20v38H10z" fill="rgba(0,0,0,.10)" stroke="rgba(255,255,255,.45)"/>' + lens(28, 28, 9) + lens(28, 52, 9) + lens(49, 40, 9) + dot(92, 32, 3),
  air: '<rect x="10" y="16" width="100" height="30" rx="15" fill="rgba(0,0,0,.10)" stroke="rgba(255,255,255,.45)"/>' + lens(27, 31, 9) + dot(47, 31),
  'samsung-s': ring(30, 28, 8) + ring(30, 54, 8) + ring(30, 80, 8) + dot(50, 30),
  'samsung-ultra': ring(30, 28, 9) + ring(30, 56, 9) + ring(30, 84, 9) + ring(54, 42, 6) + ring(54, 66, 6) + dot(54, 88, 2.4),
  'samsung-bump': bump(14, 12, 40, 90, 12) + lens(32, 30, 8) + lens(32, 54, 8) + lens(32, 78, 8) + dot(48, 30, 2.4),
};

function draw(kind, fill, id) {
  switch (kind) {
    case 'fold': // closed Galaxy Z Fold: tall, narrow
      return { vb: '0 0 120 240', svg: body(24, 6, 72, 228, 10, fill, id) + bump(34, 16, 24, 76, 12) + lens(46, 30, 7.5) + lens(46, 52, 7.5) + lens(46, 74, 7.5) + dot(68, 30, 2.4) };
    case 'flip': // closed Galaxy Z Flip: square with the cover screen
      return { vb: '0 0 120 150', svg: body(10, 8, 100, 134, 16, fill, id) + '<rect x="17" y="15" width="86" height="64" rx="11" fill="#101113"/>' + lens(32, 30, 7.5) + lens(54, 30, 7.5) + '<line x1="10" y1="88" x2="110" y2="88" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>' };
    case 'tablet':
      return { vb: '0 0 180 240', svg: body(8, 6, 164, 228, 16, fill, id) + lens(28, 26, 7) };
    case 'tablet-pro':
      return { vb: '0 0 180 240', svg: body(8, 6, 164, 228, 16, fill, id) + bump(16, 14, 40, 40, 11) + lens(29, 27, 7) + lens(29, 43, 7) + dot(45, 27, 2.2) + dot(45, 43, 3) };
    case 'laptop': // open MacBook, front view: dark screen, coloured base
      return {
        vb: '0 0 240 160',
        svg: '<rect x="30" y="8" width="180" height="118" rx="9" fill="#1b1c1f"/>'
          + `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b7ea6"/><stop offset=".5" stop-color="#7a6aa6"/><stop offset="1" stop-color="#2e3c58"/></linearGradient></defs>`
          + `<rect x="36" y="14" width="168" height="106" rx="3" fill="url(#${id}s)"/>`
          + '<rect x="108" y="14" width="24" height="5" rx="2.5" fill="#1b1c1f"/>'
          + `<path d="M8 128h224l-6 14q-2 6-9 6H23q-7 0-9-6z" fill="${fill}" stroke="rgba(0,0,0,.2)"/>`
          + `<path d="M8 128h224l-6 14q-2 6-9 6H23q-7 0-9-6z" fill="url(#${id})"/>`
          + '<rect x="104" y="128" width="32" height="5" rx="2.5" fill="rgba(0,0,0,.14)"/>',
      };
    case 'watch':
    case 'watch-ultra': {
      const ultra = kind === 'watch-ultra';
      const [x, w, rx] = ultra ? [18, 84, 18] : [22, 76, 24];
      return {
        vb: '0 0 120 200',
        svg: '<rect x="34" y="0" width="52" height="52" rx="8" fill="#2b2d31"/><rect x="34" y="148" width="52" height="52" rx="8" fill="#2b2d31"/>'
          + body(x, 38, w, 124, rx, fill, id)
          + `<rect x="${x + 7}" y="46" width="${w - 14}" height="108" rx="${rx - 6}" fill="#0d0e10"/>`
          + `<rect x="${x + w - 1}" y="70" width="7" height="20" rx="3" fill="${fill}" stroke="rgba(0,0,0,.25)"/>`
          + `<rect x="${x + w - 1}" y="98" width="5" height="22" rx="2" fill="${fill}" stroke="rgba(0,0,0,.25)"/>`
          + (ultra ? `<rect x="${x - 5}" y="80" width="6" height="26" rx="2" fill="#E5782F"/>` : ''),
      };
    }
    default: { // phone backs
      const samsung = kind.startsWith('samsung');
      return { vb: '0 0 120 240', svg: body(10, 6, 100, 228, kind === 'samsung-ultra' ? 9 : samsung ? 16 : 20, fill, id) + (PHONE_CAMS[kind] || PHONE_CAMS.triple) };
    }
  }
}

export function phoneArtSvg(kind, hex = '#C9CDD3', label = 'device', cls = '') {
  const id = `sheen${++n}`;
  const { vb, svg } = draw(kind || 'triple', escAttr(hex || '#C9CDD3'), id);
  return `<svg class="art ${cls}" viewBox="${vb}" role="img" aria-label="${escAttr(label)}">${sheen(id)}${svg}</svg>`;
}
