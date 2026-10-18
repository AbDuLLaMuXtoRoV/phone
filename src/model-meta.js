// Facts about each iPhone that the price list does not contain: release year, hardware features
// (decide which questions the seller is asked), real colours and the camera layout used for the
// drawn placeholder image. Keyed by the model id produced by scripts/import-prices.mjs.

// Hex values for the drawn phone images. Colour names are in public/assets/i18n/*.js.
export const COLORS = {
  // Galaxy colours (iPad, MacBook and Apple Watch reuse the Apple ones below)
  titaniumsilver: '#A9B3BD',
  titaniumgray: '#8A8A86',
  navy: '#2B3448',
  mint: '#BFE3D2',
  violet: '#8B7DB8',
  cream: '#EFE6D2',
  black: '#232326',
  white: '#F2F2F0',
  red: '#B3202B',
  silver: '#D9DADC',
  gold: '#EBD3B0',
  gray: '#5E5F62',
  rose: '#E9C2B8',
  jet: '#101012',
  blue: '#3E6FA8',
  yellow: '#F3D86A',
  coral: '#F07D69',
  green: '#A9D5BF',
  purple: '#C9BFE0',
  midgreen: '#3E4A43',
  graphite: '#4A4947',
  pacific: '#2F4A5C',
  midnight: '#1E2228',
  starlight: '#F4EEE3',
  pink: '#F3CFD4',
  sierra: '#9BB5CE',
  alpine: '#576856',
  deeppurple: '#594F63',
  spaceblack: '#2E2C2E',
  natural: '#BEB8AE',
  bluetitan: '#3F4756',
  whitetitan: '#EEEDE8',
  blacktitan: '#3B3B3C',
  deserttitan: '#C4AA90',
  teal: '#A3C9C3',
  ultramarine: '#6F7DEB',
  lavender: '#C9B7DE',
  sage: '#B7C2A7',
  mistblue: '#A7BDD6',
  cloud: '#F1F1EE',
  lightgold: '#E8DCC2',
  sky: '#C6D9EA',
  orange: '#E5782F',
  deepblue: '#2F3A57',
};

// cam: camera layout for the drawn image — single | dualv (vertical pill) | dual (square bump) | triple | air | plateau
// bio: touch | face. glassBack: has a glass back. trueTone: has True Tone.
// cameraButton: has the Camera Control button. esimQ: ask if it is an eSIM-only (US) unit.
const M = (series, year, cam, bio, colors, extra = {}) => ({
  series, year, cam, bio, colors, glassBack: true, trueTone: true, cameraButton: false, esimQ: false, ...extra,
});
const OLD = { glassBack: false, trueTone: false };

export const MODEL_META = {
  'iphone-se-2': M('SE', 2020, 'single', 'touch', ['black', 'white', 'red'], { name: 'iPhone SE 2 (2020)' }),
  'iphone-se-3': M('SE', 2022, 'single', 'touch', ['midnight', 'starlight', 'red'], { name: 'iPhone SE 3 (2022)' }),
  'iphone-6': M('6', 2014, 'single', 'touch', ['gray', 'silver', 'gold'], OLD),
  'iphone-6-plus': M('6', 2014, 'single', 'touch', ['gray', 'silver', 'gold'], OLD),
  'iphone-6s': M('6', 2015, 'single', 'touch', ['gray', 'silver', 'gold', 'rose'], OLD),
  'iphone-6s-plus': M('6', 2015, 'single', 'touch', ['gray', 'silver', 'gold', 'rose'], OLD),
  'iphone-7': M('7', 2016, 'single', 'touch', ['black', 'jet', 'silver', 'gold', 'rose', 'red'], OLD),
  'iphone-7-plus': M('7', 2016, 'dualv', 'touch', ['black', 'jet', 'silver', 'gold', 'rose', 'red'], OLD),
  'iphone-8': M('8', 2017, 'single', 'touch', ['gray', 'silver', 'gold', 'red']),
  'iphone-8-plus': M('8', 2017, 'dualv', 'touch', ['gray', 'silver', 'gold', 'red']),
  'iphone-x': M('X', 2017, 'dualv', 'face', ['gray', 'silver']),
  'iphone-xr': M('X', 2018, 'single', 'face', ['black', 'white', 'blue', 'yellow', 'coral', 'red']),
  'iphone-xs': M('X', 2018, 'dualv', 'face', ['gray', 'silver', 'gold']),
  'iphone-xs-max': M('X', 2018, 'dualv', 'face', ['gray', 'silver', 'gold']),
  'iphone-11': M('11', 2019, 'dual', 'face', ['black', 'white', 'green', 'yellow', 'purple', 'red']),
  'iphone-11-pro': M('11', 2019, 'triple', 'face', ['gray', 'silver', 'gold', 'midgreen']),
  'iphone-11-pro-max': M('11', 2019, 'triple', 'face', ['gray', 'silver', 'gold', 'midgreen']),
  'iphone-12-mini': M('12', 2020, 'dual', 'face', ['black', 'white', 'blue', 'green', 'purple', 'red']),
  'iphone-12': M('12', 2020, 'dual', 'face', ['black', 'white', 'blue', 'green', 'purple', 'red']),
  'iphone-12-pro': M('12', 2020, 'triple', 'face', ['graphite', 'silver', 'gold', 'pacific']),
  'iphone-12-pro-max': M('12', 2020, 'triple', 'face', ['graphite', 'silver', 'gold', 'pacific']),
  'iphone-13-mini': M('13', 2021, 'dual', 'face', ['midnight', 'starlight', 'blue', 'pink', 'green', 'red']),
  'iphone-13': M('13', 2021, 'dual', 'face', ['midnight', 'starlight', 'blue', 'pink', 'green', 'red']),
  'iphone-13-pro': M('13', 2021, 'triple', 'face', ['graphite', 'silver', 'gold', 'sierra', 'alpine']),
  'iphone-13-pro-max': M('13', 2021, 'triple', 'face', ['graphite', 'silver', 'gold', 'sierra', 'alpine']),
  'iphone-14': M('14', 2022, 'dual', 'face', ['midnight', 'starlight', 'blue', 'purple', 'yellow', 'red'], { esimQ: true }),
  'iphone-14-plus': M('14', 2022, 'dual', 'face', ['midnight', 'starlight', 'blue', 'purple', 'yellow', 'red'], { esimQ: true }),
  'iphone-14-pro': M('14', 2022, 'triple', 'face', ['spaceblack', 'silver', 'gold', 'deeppurple'], { esimQ: true }),
  'iphone-14-pro-max': M('14', 2022, 'triple', 'face', ['spaceblack', 'silver', 'gold', 'deeppurple'], { esimQ: true }),
  'iphone-15': M('15', 2023, 'dual', 'face', ['black', 'blue', 'green', 'yellow', 'pink'], { esimQ: true }),
  'iphone-15-plus': M('15', 2023, 'dual', 'face', ['black', 'blue', 'green', 'yellow', 'pink'], { esimQ: true }),
  'iphone-15-pro': M('15', 2023, 'triple', 'face', ['natural', 'bluetitan', 'whitetitan', 'blacktitan'], { esimQ: true }),
  'iphone-15-pro-max': M('15', 2023, 'triple', 'face', ['natural', 'bluetitan', 'whitetitan', 'blacktitan'], { esimQ: true }),
  'iphone-16': M('16', 2024, 'dualv', 'face', ['black', 'white', 'pink', 'teal', 'ultramarine'], { esimQ: true, cameraButton: true }),
  'iphone-16-plus': M('16', 2024, 'dualv', 'face', ['black', 'white', 'pink', 'teal', 'ultramarine'], { esimQ: true, cameraButton: true }),
  'iphone-16-pro': M('16', 2024, 'triple', 'face', ['blacktitan', 'whitetitan', 'natural', 'deserttitan'], { esimQ: true, cameraButton: true }),
  'iphone-16-pro-max': M('16', 2024, 'triple', 'face', ['blacktitan', 'whitetitan', 'natural', 'deserttitan'], { esimQ: true, cameraButton: true }),
  'iphone-16e': M('16', 2025, 'single', 'face', ['black', 'white'], { esimQ: true }),
  'iphone-17': M('17', 2025, 'dualv', 'face', ['black', 'white', 'lavender', 'sage', 'mistblue'], { esimQ: true, cameraButton: true }),
  // iPhone Air is eSIM-only everywhere, so the list price already assumes it — no eSIM question.
  'iphone-air': M('17', 2025, 'air', 'face', ['spaceblack', 'cloud', 'lightgold', 'sky'], { cameraButton: true }),
  'iphone-17-pro': M('17', 2025, 'plateau', 'face', ['orange', 'deepblue', 'silver'], { esimQ: true, cameraButton: true }),
  'iphone-17-pro-max': M('17', 2025, 'plateau', 'face', ['orange', 'deepblue', 'silver'], { esimQ: true, cameraButton: true }),
};

// Used for a model that appears in a future price list before it is added above.
export const DEFAULT_META = M('?', new Date().getFullYear(), 'triple', 'face', ['black', 'white', 'silver'], { esimQ: true, cameraButton: true });
