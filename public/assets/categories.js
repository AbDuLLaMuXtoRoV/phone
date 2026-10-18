// Device categories: which specs, questions, faults and extras each one uses.
// Shared by the browser (sell wizard) and the server (validation, listing pages).
// Only iPhone has a price list; the other categories are listed with a seller-set price.

export const CATEGORY_KEYS = ['iphone', 'samsung', 'ipad', 'macbook', 'watch'];

// battery: percent = health % (iPhone, Watch) · level = good/ok/weak (Samsung, iPad) · mac = condition + cycle count
// config: specs asked on the second step (storage = storage, SSD or case size depending on the category)
export const CATEGORIES = {
  iphone: {
    kind: 'phone', battery: 'percent', parts: true,
    config: ['storage', 'color', 'sim'],
    looks: ['screen', 'body', 'backGlass', 'lens', 'bent'],
    faults: ['biometric', 'camera', 'wifi', 'mic', 'speaker', 'charging', 'vibration', 'buttons', 'trueTone', 'cameraButton'],
    extras: ['box', 'cable', 'receipt'],
  },
  samsung: {
    kind: 'phone', battery: 'level',
    config: ['storage', 'color'],
    looks: ['screen', 'body', 'backGlass', 'lens', 'bent', 'inner'],
    faults: ['fingerprint', 'camera', 'wifi', 'mic', 'speaker', 'charging', 'vibration', 'buttons', 'spen', 'hinge'],
    extras: ['box', 'cable', 'receipt'],
  },
  ipad: {
    kind: 'tablet', battery: 'level',
    config: ['storage', 'connectivity', 'color'],
    looks: ['screen', 'body', 'lens', 'bent'],
    faults: ['biometric', 'camera', 'wifi', 'mic', 'speaker', 'charging', 'buttons', 'pencil', 'cellular'],
    extras: ['box', 'cable', 'receipt', 'pencil', 'keyboard'],
  },
  macbook: {
    kind: 'laptop', battery: 'mac',
    config: ['ram', 'storage', 'color'],
    looks: ['screen', 'body', 'bent'],
    faults: ['keyboard', 'trackpad', 'touchId', 'camera', 'wifi', 'mic', 'speaker', 'ports', 'charging'],
    extras: ['box', 'cable', 'receipt'],
  },
  watch: {
    kind: 'watch', battery: 'percent',
    config: ['storage', 'material', 'connectivity', 'color'],
    looks: ['screen', 'body', 'backGlass'],
    faults: ['sensors', 'buttons', 'wifi', 'mic', 'speaker', 'charging', 'cellular'],
    extras: ['box', 'cable', 'receipt', 'band'],
  },
};

const catOf = (model) => CATEGORIES[model?.category] || CATEGORIES.iphone;

// Whether a question / fault applies to this model, given the answers so far.
export function applies(key, model, a = {}) {
  const c = catOf(model);
  switch (key) {
    case 'backGlass': return model.category === 'watch' || !!model.glassBack;
    case 'inner': case 'hinge': return !!model.fold;
    case 'sim': return !!model.esimQ;
    case 'imeiOk': case 'uzimei': return c.kind === 'phone' || (model.category === 'ipad' && a.connectivity === 'cellular');
    case 'trueTone': return !!model.trueTone;
    case 'cameraButton': return !!model.cameraButton;
    case 'spen': return !!model.spen;
    case 'cellular': return a.connectivity === 'cellular';
    default: return true;
  }
}

export const looksFor = (model, a) => catOf(model).looks.filter((k) => applies(k, model, a));
export const faultsFor = (model, a) => catOf(model).faults.filter((k) => applies(k, model, a));
export const extrasFor = (model) => catOf(model).extras;
export const batteryMode = (model) => catOf(model).battery;
export const hasParts = (model) => !!catOf(model).parts;
// Steps of the sell wizard for this category. A phone that does not turn on skips the checks it can't pass.
export function stepsFor(model, alive = true) {
  const steps = ['model', 'config', 'basic', 'looks', 'screen'];
  if (alive) steps.push('faults');
  if (alive && hasParts(model)) steps.push('parts');
  steps.push('result', 'details');
  return steps;
}
