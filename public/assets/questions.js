// Condition questions shown to sellers, and the labels used in the buyer-facing condition report.
// Shared by the browser (sell wizard) and the server (listing page), so wording stays in one place.

export const GRADES = {
  A: { name: 'Ideal', desc: 'Chiziq, zarba izi va ekranda iz yoʻq. Batareya 90% va yuqori.' },
  'A-': { name: 'Aʼlo', desc: 'Juda mayda chiziqlar bor, zarba izi yoʻq. Batareya 90% va yuqori.' },
  'B+': { name: 'Yaxshi', desc: 'Ekranda mayda chiziqlar, chetlarida 1–2 ta kichik zarba izi. Batareya 85% va yuqori.' },
  B: { name: 'Oʻrtacha', desc: 'Ekranda yengil chiziqlar, chetlarida 2–3 ta zarba izi. Batareya 81% va yuqori.' },
  C: { name: 'Ishlatilgan', desc: 'Chuqur chiziqlar, koʻp zarba izlari yoki singan oyna.' },
};

export const BASIC = {
  powersOn: {
    title: 'Telefon yoqiladimi?',
    options: [{ v: 'yes', t: 'Ha, yoqiladi' }, { v: 'no', t: 'Yoʻq, yoqilmaydi' }],
  },
  imeiOk: {
    title: '*#06# terganda IMEI chiqadimi?',
    hint: 'Telefon ilovasida *#06# raqamini tering.',
    options: [{ v: 'yes', t: 'Ha, chiqadi' }, { v: 'no', t: 'Yoʻq, chiqmaydi' }],
  },
  icloudOff: {
    title: 'iCloud (Find My) dan chiqqansizmi?',
    hint: 'Sozlamalar → ismingiz → Find My → Find My iPhone → Oʻchirish.',
    options: [{ v: 'yes', t: 'Ha, chiqqanman' }, { v: 'no', t: 'Yoʻq, hali chiqmaganman' }],
  },
  refurbished: {
    title: 'Telefon refurbished (qayta tiklangan) yoki demo-namunami?',
    options: [{ v: 'no', t: 'Yoʻq' }, { v: 'yes', t: 'Ha' }],
  },
  sim: {
    title: 'SIM karta turi',
    hint: 'AQShda sotilgan 14-seriya va undan yangi modellarda SIM uyasi boʻlmaydi.',
    options: [{ v: 'sim', t: 'SIM karta + eSIM' }, { v: 'esim', t: 'Faqat eSIM (AQSh versiyasi)' }],
  },
};

export const LOOKS = {
  screen: {
    title: 'Ekran yuzasi',
    hint: 'Ekranni oʻchirib, yorugʻlikka tutib qarang.',
    options: [
      { v: 'A', t: 'Chiziqlar yoʻq', d: 'Yangidek, hech qanday iz yoʻq' },
      { v: 'A-', t: 'Juda mayda chiziqlar', d: 'Faqat yorugʻlikda, yaqindan koʻrinadi' },
      { v: 'B', t: 'Yengil chiziqlar', d: 'Oddiy qaraganda ham koʻrinadi' },
      { v: 'C', t: 'Chuqur yoki koʻp chiziqlar', d: 'Tirnoq bilan seziladigan chiziqlar' },
    ],
  },
  body: {
    title: 'Korpus (ramka va orqa tomon)',
    options: [
      { v: 'A', t: 'Ideal', d: 'Chiziq va zarba izlari yoʻq' },
      { v: 'A-', t: 'Mayda chiziqlar', d: 'Zarba izlari yoʻq' },
      { v: 'B+', t: '1–2 ta kichik zarba izi', d: 'Burchak yoki chetlarda' },
      { v: 'B', t: '2–3 ta zarba izi', d: 'Yoki koʻp sezilarli chiziqlar' },
      { v: 'C', t: 'Kuchli eskirgan', d: 'Chuqur zarbalar, boʻyoq koʻchgan' },
    ],
  },
  backGlass: {
    title: 'Orqa oyna',
    glassOnly: true,
    options: [{ v: 'ok', t: 'Butun' }, { v: 'cracked', t: 'Yorilgan yoki singan' }],
  },
  lens: {
    title: 'Kamera oynasi',
    options: [
      { v: 'ok', t: 'Toza va butun' },
      { v: 'scratched', t: 'Mayda chiziqlar bor' },
      { v: 'cracked', t: 'Yorilgan yoki ichida dogʻ bor' },
    ],
  },
  bent: {
    title: 'Korpus egilganmi yoki shishganmi?',
    options: [
      { v: 'none', t: 'Yoʻq' },
      { v: 'light', t: 'Biroz egilgan' },
      { v: 'severe', t: 'Kuchli egilgan yoki batareya shishgan' },
    ],
  },
};

export const SCREEN = {
  glass: {
    title: 'Ekran oynasi',
    options: [{ v: 'ok', t: 'Butun' }, { v: 'cracked', t: 'Yorilgan yoki singan' }],
  },
  display: {
    title: 'Displey qanday ishlaydi?',
    hint: 'Kulrang yoki oq fonni ochib tekshiring.',
    options: [
      { v: 'ok', t: 'Mukammal', d: 'Dogʻ, chiziq va iz yoʻq' },
      { v: 'minor', t: 'Yengil iz yoki sargʻayish', d: 'Eski tasvir izi (burn-in) yoki rang biroz oʻzgargan' },
      { v: 'major', t: 'Nosoz', d: 'Chiziqlar, qora dogʻlar yoki sensor yaxshi ishlamaydi' },
    ],
  },
};

// t = seller question, s = short name in the buyer report.
// `when` decides whether the fault applies to a model (based on src/model-meta.js features).
export const FAULTS = [
  { k: 'biometric', t: (m) => (m.bio === 'touch' ? 'Touch ID yoki Home tugmasi ishlamaydi' : 'Face ID ishlamaydi'), s: (m) => (m.bio === 'touch' ? 'Touch ID' : 'Face ID') },
  { k: 'camera', t: () => 'Kamera ishlamaydi yoki fokus qilmaydi', s: () => 'Kamera' },
  { k: 'wifi', t: () => 'Wi‑Fi, Bluetooth, kompas yoki Apple Pay ishlamaydi', s: () => 'Wi‑Fi, Bluetooth, Apple Pay' },
  { k: 'mic', t: () => 'Mikrofon yoki ovoz yozish ishlamaydi', s: () => 'Mikrofon' },
  { k: 'speaker', t: () => 'Dinamik ishlamaydi (ovoz yoʻq)', s: () => 'Dinamik' },
  { k: 'charging', t: () => 'Zaryad olmaydi', s: () => 'Zaryadlash' },
  { k: 'vibration', t: () => 'Vibratsiya ishlamaydi', s: () => 'Vibratsiya' },
  { k: 'buttons', t: () => 'Tugmalar ishlamaydi (ovoz, yoqish)', s: () => 'Tugmalar' },
  { k: 'trueTone', t: () => 'True Tone ishlamaydi', s: () => 'True Tone', when: (m) => m.trueTone },
  { k: 'cameraButton', t: () => 'Camera Control tugmasi nosoz', s: () => 'Camera Control', when: (m) => m.cameraButton },
];

export const PARTS = {
  title: 'Almashtirilgan qismlar',
  hint: 'Sozlamalar → Umumiy → Ushbu qurilma haqida → “Qismlar va xizmat tarixi” boʻlimini tekshiring.',
  items: [
    { k: 'screen', t: 'Ekran' },
    { k: 'battery', t: 'Batareya' },
    { k: 'camera', t: 'Kamera' },
  ],
  options: [
    { v: 'none', t: 'Almashtirilmagan' },
    { v: 'genuine', t: 'Original qism' },
    { v: 'unknown', t: 'Nomaʼlum qism' },
  ],
};

export const EXTRAS = [
  { k: 'box', t: 'Quti' },
  { k: 'cable', t: 'Kabel / zaryadlovchi' },
  { k: 'receipt', t: 'Chek yoki hujjat' },
];

export const UZIMEI = {
  title: 'IMEI Oʻzbekistonda roʻyxatdan oʻtganmi?',
  hint: 'Roʻyxatdan oʻtmagan telefon mahalliy SIM karta bilan bloklanadi.',
  options: [{ v: 'yes', t: 'Ha' }, { v: 'no', t: 'Yoʻq' }, { v: 'unknown', t: 'Bilmayman' }],
};

export const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Andijon', 'Buxoro', 'Fargʻona', 'Jizzax', 'Xorazm',
  'Namangan', 'Navoiy', 'Qashqadaryo', 'Qoraqalpogʻiston', 'Samarqand', 'Sirdaryo', 'Surxondaryo',
];

export const optionLabel = (q, v) => q.options.find((o) => o.v === v)?.t ?? '—';
