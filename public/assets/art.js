// Drawn back view of an iPhone (used when a listing has no photos). Camera layout and colour follow the
// real model. Shared by the server (listing cards) and the browser (sell wizard summary).

let n = 0;
const escAttr = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function phoneArtSvg(cam, hex = '#C9CDD3', label = 'iPhone', cls = '') {
  const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#151618" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * 0.48}" fill="#26303d"/><circle cx="${x - r * 0.22}" cy="${y - r * 0.22}" r="${r * 0.14}" fill="rgba(255,255,255,.55)"/>`;
  const dot = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.75)" stroke="rgba(0,0,0,.15)"/>`;
  const bump = (x, y, w, h, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="rgba(0,0,0,.09)" stroke="rgba(255,255,255,.45)" stroke-width="1"/>`;
  const cams = {
    single: lens(30, 30, 9) + dot(48, 26),
    dualv: bump(18, 15, 24, 48, 12) + lens(30, 27, 8) + lens(30, 51, 8) + dot(48, 30),
    dual: bump(16, 14, 46, 46, 13) + lens(29, 27, 9) + lens(49, 47, 9) + dot(50, 26),
    triple: bump(15, 13, 52, 52, 14) + lens(29, 27, 10) + lens(29, 51, 10) + lens(52, 39, 10) + dot(52, 22) + dot(52, 56),
    plateau: '<path d="M10 30a20 20 0 0 1 20-20h60a20 20 0 0 1 20 20v38H10z" fill="rgba(0,0,0,.10)" stroke="rgba(255,255,255,.45)"/>' + lens(28, 28, 9) + lens(28, 52, 9) + lens(49, 40, 9) + dot(92, 32, 3),
    air: '<rect x="10" y="16" width="100" height="30" rx="15" fill="rgba(0,0,0,.10)" stroke="rgba(255,255,255,.45)"/>' + lens(27, 31, 9) + dot(47, 31),
  };
  const id = `sheen${++n}`;
  return `<svg class="art ${cls}" viewBox="0 0 120 240" role="img" aria-label="${escAttr(label)}">`
    + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>`
    + `<rect x="10" y="6" width="100" height="228" rx="20" fill="${escAttr(hex)}" stroke="rgba(0,0,0,.18)"/>`
    + `<rect x="10" y="6" width="100" height="228" rx="20" fill="url(#${id})"/>`
    + (cams[cam] || cams.triple)
    + '</svg>';
}
