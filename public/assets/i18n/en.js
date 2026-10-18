// English text. ko.js must have the same keys. Shared by the server and the browser.

const money = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const trim = (s) => s.replace(/\.?0+$/, '');
const short = (n) => (n >= 1e6 ? `${trim((n / 1e6).toFixed(n >= 1e7 ? 1 : 2))}M` : `${Math.round(n / 1000)}K`);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  lang: 'en',
  switchTo: { code: 'ko', label: '한국어' },
  currency: 'UZS',
  money,
  price: (n) => `${money(n)} UZS`,
  range: (a, b) => `${short(a)}–${short(b)} UZS`,
  date: (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  ago(ts, now = Date.now()) {
    const s = Math.max(0, (now - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    if (s < 172800) return 'yesterday';
    if (s < 7 * 86400) return `${Math.floor(s / 86400)} days ago`;
    const d = new Date(ts);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  },

  t: {
    // layout
    skip: 'Skip to content',
    titleDefault: 'Buy and sell used iPhones',
    descDefault: 'Price your used iPhone in a minute and list it for free. Transparent prices, iCloud check, contact by phone or Telegram.',
    back: 'Back', home: 'home', navMain: 'Main menu',
    navPhones: 'Phones', navPrices: 'Prices', navSaved: 'Saved', navMine: 'My listings',
    searchPh: 'Search models, e.g. 13 Pro', searchAria: 'Search phones', searchIcon: 'Search',
    sellCta: 'Sell a phone', langSwitch: 'Change language',
    footerBlurb: 'A transparent marketplace for used iPhones. Prices are calculated from each phone’s condition.',
    footerNav: 'More', footerPhones: 'Phones', footerSell: 'Sell a phone', footerPrices: 'Price guide', footerSafety: 'Safe trading', footerFaq: 'FAQ',
    footerNote: 'Prices are estimates based on what sellers report and don’t replace checking the phone in person.',
    tabsAria: 'Bottom menu', tabHome: 'Home', tabPhones: 'Phones', tabSell: 'Sell', tabSaved: 'Saved', tabMine: 'My ads',

    // home
    eyebrow: 'Phones only · transparent prices',
    heroTitle: 'What’s your phone worth? Find out in ', heroHighlight: '1 minute', heroTitleEnd: '',
    lead: 'Pick your model, answer a few questions about its condition and see the price instantly. Listing is free.',
    heroPh: 'e.g. 13 Pro', heroAria: 'Phone model', heroBtn: 'Get price', heroChipsAria: 'Choose a series',
    heroAltText: 'Looking to buy?', heroAltLink: (n) => `See ${n} listings`,
    demoLabel: 'Estimated price', demoFaceId: 'Face ID', demoWorks: 'works', demoScreen: 'Screen', demoNoScratches: 'no scratches', demoParts: 'Parts', demoOriginal: 'original',
    statsAria: 'In numbers', statListings: 'active listings', statModels: 'iPhone models', statFreeValue: 'Free', statFree: 'to list', statTimeValue: '~1 min', statTime: 'to get a price',
    seriesTitle: 'Browse by series', latestTitle: 'New listings', seeAll: 'See all',
    howTitle: 'How it works', howCta: 'Price my phone',
    steps: [
      ['Pick your model', '42 iPhone models, every storage size.'],
      ['Describe the condition', 'Simple questions: screen, body, battery, faults.'],
      ['See the price', 'The price and every deduction, shown line by line.'],
      ['Post your listing', 'Add photos; buyers call you or message you on Telegram.'],
    ],
    gradesTitle: 'Condition grades', gradesSub: 'Every listing uses the same scale, so buyers know exactly what they get.',
    safetyTitle: 'Safe trading',
    tips: [
      ['iCloud checked', 'Phones still signed in to iCloud can’t be listed.'],
      ['IMEI registration shown', 'Each listing says whether the phone is registered in Uzbekistan.'],
      ['Meet in a busy place', 'Check the phone in your hands before you pay.'],
      ['Never pay in advance', '“I’ll deliver it, send the money first” is the most common scam.'],
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      ['How is the price calculated?', 'We take the price for your model, storage and condition grade (A, A−, B+, B), then subtract a fixed amount for each fault: cracked glass, Face ID not working, replaced parts and so on. You see every line of the calculation.'],
      ['Does listing cost anything?', 'No. Getting a price and posting a listing are free, and you don’t need an account.'],
      ['Why must I sign out of iCloud?', 'A phone still linked to iCloud (Find My) can’t be used by its new owner. Requiring sign-out also blocks stolen phones, so such phones can’t be listed.'],
      ['Where do I find battery health?', 'Settings → Battery → Battery Health & Charging → “Maximum Capacity”. Enter that percentage.'],
      ['Why does IMEI registration matter?', 'In Uzbekistan, a phone whose IMEI isn’t registered is blocked on local SIM cards. Buyers see the status on every listing.'],
      ['Which phones can I sell?', 'Every iPhone from the iPhone 6 to the iPhone 17 Pro Max, plus the SE 2 and SE 3. Samsung and Xiaomi are coming soon.'],
    ],
    ctaTitle: 'Want to sell your phone?', ctaText: 'Getting a price is free and needs no sign-up.', ctaBtn: 'Get started',

    // catalogue
    allPhones: 'All phones', catSearchPh: 'Model, e.g. 14 Pro Max', catSearchAria: 'Search', filter: 'Filters', sortAria: 'Sort',
    sorts: { new: 'Newest', cheap: 'Price: low to high', expensive: 'Price: high to low', battery: 'Best battery' },
    all: 'All', removeFilter: (t) => `Remove filter: ${t}`, clear: 'Clear',
    filtersTitle: 'Filters', close: 'Close', model: 'Model', allModels: 'All models', storage: 'Storage', condition: 'Condition',
    gradeOpts: { a: 'A · Ideal, excellent', b: 'B · Good, fair', c: 'C · Worn' },
    priceRange: 'Price, UZS', from: 'from', to: 'to', minAria: 'Minimum price', maxAria: 'Maximum price',
    chipFrom: (v) => `from ${v} UZS`, chipTo: (v) => `up to ${v} UZS`, chipBattery: (b) => `Battery ${b}%+`,
    battery: 'Battery', batteryOpts: { '': 'Any', 80: '80% or more', 85: '85% or more', 90: '90% or more' },
    region: 'Region', allRegions: 'All of Uzbekistan', show: 'Show results',
    pagesAria: 'Pages', prev: 'Previous', next: 'Next',
    emptyTitle: 'Nothing found', emptyText: 'Try fewer filters or a different model.', emptyBtn: 'Clear filters',

    // cards + favourites
    save: 'Save', unsave: 'Remove from saved', saved: 'Saved', savedAdded: 'Saved', savedRemoved: 'Removed from saved',

    // listing
    posted: 'Your listing is live!', postedText: 'Share it with friends or manage it from “My listings”.', share: 'Share', linkCopied: 'Link copied',
    soldNotice: 'This phone has been sold.',
    photosAria: 'Photos', photoAlt: (title, i) => `${title}, photo ${i}`, noPhotos: 'The seller hasn’t added photos yet',
    systemEst: 'System estimate:', howCalc: 'How the estimate was calculated', estTotal: 'System estimate',
    factCondition: 'Condition', factBattery: 'Battery', unknown: 'Unknown', factStorage: 'Storage', factColor: 'Color', factSim: 'SIM',
    factImei: 'IMEI registration', regYes: 'Registered', regNo: 'Not registered',
    reportTitle: 'Condition report', reportNote: 'Filled in by the seller. Check the phone yourself when you meet.',
    basics: 'Basic checks', looksTitle: 'Body and screen', funcsTitle: 'Functions', partsTitle: 'Parts',
    faultsN: (n) => `${n} fault${n > 1 ? 's' : ''}`, allWork: 'Everything works',
    rowIcloud: 'iCloud', signedOut: 'Signed out', rowImei: 'IMEI', shown: 'Shown', notShown: 'Not shown',
    rowPowers: 'Turns on', yes: 'Yes', no: 'No', rowRefurb: 'Refurbished / demo',
    rowScreen: 'Screen surface', rowBody: 'Body', rowBack: 'Back glass', rowLens: 'Camera lens', rowBent: 'Bent', rowGlass: 'Screen glass', rowDisplay: 'Display',
    cantCheck: 'Can’t be checked', deadPhone: 'Phone doesn’t turn on', works: 'Works', broken: 'Not working',
    descTitle: 'Description', boxTitle: 'In the box', phoneOnly: 'Phone only', views: (n) => `${n} views`,
    safeTitle: 'Safe buying',
    safeTips: ['Meet in a busy place and check the phone in your hands.', 'Dial *#06# to check the IMEI and compare it with the box.', 'Make sure the phone is signed out of iCloud in Settings.', 'Never pay in advance.'],
    manage: 'Manage listing', reactivate: 'Mark as available', markSold: 'Mark as sold', remove: 'Delete',
    confirmDelete: 'Delete this listing for good?', error: 'Something went wrong',
    call: 'Call', telegram: 'Message on Telegram', telegramShort: 'Telegram', similar: 'Similar listings',
    metaDesc: (title, grade, battery, region, price) => `${title}, ${grade.toLowerCase()} condition${battery ? `, battery ${battery}%` : ''}. ${region}. ${price}.`,

    // sell
    sellTitle: 'Price and sell your phone', sellDesc: 'Describe your iPhone’s condition and get its price instantly. Free listing.', sellHeader: 'Sell a phone',
    stepNames: { model: 'Model', config: 'Storage & color', basic: 'Basic checks', looks: 'Body & glass', screen: 'Screen & battery', faults: 'Functions', parts: 'Parts', result: 'Price', details: 'Listing' },
    noscript: 'JavaScript must be enabled to get a price.',
    whichPhone: 'Which iPhone are you selling?', modelSearchPh: 'e.g. 13 Pro Max', modelSearchAria: 'Search models',
    seriesFilterAria: 'Filter by series', modelsAria: 'Models', noModel: 'No such model. Only iPhones can be priced for now.',
    storageQ: 'Storage', colorQ: 'Color', basicTitle: 'Basic checks',
    icloudBlockTitle: 'You can’t list the phone until you sign out of iCloud.',
    icloudBlockText: 'Otherwise the new owner can’t use it. Go to Settings → your name → Find My → Find My iPhone, turn it off, then come back.',
    looksTitle2: 'Body and glass', screenTitle: 'Screen and battery',
    batteryQ: 'Battery health (maximum capacity)', batteryHint: 'Settings → Battery → Battery Health → “Maximum Capacity”.', batteryAria: 'Battery percentage',
    batteryHints: { great: 'Excellent — no effect on the price.', good: 'Good. Below 90%, so the price drops slightly.', fair: 'Average. The price drops.', poor: 'Needs a new battery — the price drops noticeably.' },
    faultsTitle: 'What doesn’t work?', faultsSub: 'Tick anything that doesn’t work. If everything works, just continue.',
    partsNote: '“Genuine part”: an Apple part fitted during a repair. “Unknown part”: the iPhone shows an “Unknown Part” message.',
    detailsTitle: 'Listing details', photos: 'Photos', photosUpTo: (n) => `(up to ${n})`,
    photosHint: 'Shoot the front, back, sides and the Battery Health screen. Listings with photos sell faster.', addPhoto: 'Add photo',
    askPrice: 'Asking price', choose: 'Choose', name: 'Your name', namePh: 'e.g. Jasur', phone: 'Your phone number',
    telegramLabel: 'Telegram', optional: '(optional)', inBox: 'What’s in the box?', desc: 'Description',
    descPh: 'e.g. Always kept in a case, never opened for repair.',
    confirm: 'By tapping “Publish” you confirm the information is accurate.',
    summaryAria: 'Your choices', pickModel: 'Choose a model', estPrice: 'Estimated price',
    prevAria: 'Previous step', continue: 'Continue', postListing: 'Post listing', publish: 'Publish', publishing: 'Publishing…',
    barModelPrice: (name) => `${name} price`, barIcloud: 'iCloud is on', barNoPrice: 'Not priced', barMax: 'Maximum price',
    toastIcloud: 'Sign out of iCloud first', toastAnswer: 'Please answer the question', toastFill: 'Please fill in the fields',
    resultRange: 'Negotiation range:', scrapDead: 'The phone was priced as parts because it doesn’t turn on.',
    scrapImei: 'The phone was priced as parts because no IMEI is shown.', floorNote: 'Many faults, so the parts value is shown.',
    resultNote: 'The price is based on your answers. The final price may change once a buyer sees the phone.',
    changeAnswers: 'Change answers', total: 'Total', quickAria: 'Quick pick', quickEst: 'Estimate',
    maxPhotos: (n) => `Up to ${n} photos`, badPhoto: 'Couldn’t open this photo', mainPhoto: 'Main', removePhoto: 'Remove photo',
    offline: 'No internet connection. Please try again.', saveFailed: 'Couldn’t save the listing',

    // other pages
    pricesTitle: 'iPhone prices', pricesDesc: 'Used iPhone prices in UZS for every model and storage size, in ideal and used condition.',
    pricesH1: 'Used iPhone prices', pricesSub: (date) => `Estimated prices in ideal (A) and used condition, in UZS. Updated ${date}.`,
    pricesSearch: 'Search models', colStorage: 'Storage', colIdeal: 'Ideal', colUsed: 'Used', exact: 'Get an exact price',
    pricesNote: '“Ideal”: no scratches, battery 90%+. “Used”: the base price whatever the grade. The exact price depends on faults and replaced parts.',
    noModelShort: 'No such model.',
    savedTitle: 'Saved', savedEmptyTitle: 'Nothing saved yet', savedEmptyText: 'Tap ♡ on phones you like and they’ll be kept here.', browse: 'Browse phones', loading: 'Loading…',
    mineTitle: 'My listings', mineSub: 'Listings posted from this device. Open one to manage it.',
    mineEmptyTitle: 'You haven’t posted anything yet', mineEmptyText: 'Price your phone in a minute and list it for free.',
    notFoundTitle: 'Page not found', notFoundText: 'This listing may have been deleted, or the link is wrong.',
  },

  grades: {
    A: { name: 'Ideal', desc: 'No scratches, dents, camera damage or screen burn-in. Battery 90% or more.' },
    'A-': { name: 'Excellent', desc: 'Very fine scratches, no dents. Battery 90% or more.' },
    'B+': { name: 'Good', desc: 'Fine screen scratches, 1–2 small dents on the edges. Battery 85% or more.' },
    B: { name: 'Fair', desc: 'Light screen scratches, 2–3 dents on the edges. Battery 81% or more.' },
    C: { name: 'Worn', desc: 'Deep scratches, many dents or broken glass.' },
  },

  q: {
    powersOn: { title: 'Does the phone turn on?', opts: { yes: 'Yes, it turns on', no: 'No, it doesn’t' } },
    imeiOk: { title: 'Does the IMEI appear when you dial *#06#?', hint: 'Open the Phone app and dial *#06#.', opts: { yes: 'Yes, it appears', no: 'No, it doesn’t' } },
    icloudOff: { title: 'Have you signed out of iCloud (Find My)?', hint: 'Settings → your name → Find My → Find My iPhone → Off.', opts: { yes: 'Yes, signed out', no: 'Not yet' } },
    refurbished: { title: 'Is it a refurbished or demo unit?', opts: { no: 'No', yes: 'Yes' } },
    sim: { title: 'SIM type', hint: 'iPhone 14 and newer sold in the US have no SIM tray.', opts: { sim: 'SIM card + eSIM', esim: 'eSIM only (US model)' } },
    screen: {
      title: 'Screen surface', hint: 'Turn the screen off and look at it under a light.',
      opts: { A: ['No scratches', 'Like new, no marks at all'], 'A-': ['Very fine scratches', 'Only visible up close under light'], B: ['Light scratches', 'Visible at a normal glance'], C: ['Deep or many scratches', 'You can feel them with a fingernail'] },
    },
    body: {
      title: 'Body (frame and back)',
      opts: { A: ['Perfect', 'No scratches or dents'], 'A-': ['Fine scratches', 'No dents'], 'B+': ['1–2 small dents', 'On corners or edges'], B: ['2–3 dents', 'Or many visible scratches'], C: ['Heavily worn', 'Deep dents, chipped paint'] },
    },
    backGlass: { title: 'Back glass', opts: { ok: 'Intact', cracked: 'Cracked or broken' } },
    lens: { title: 'Camera lens', opts: { ok: 'Clean and intact', scratched: 'Fine scratches', cracked: 'Cracked or stained inside' } },
    bent: { title: 'Is the body bent or swollen?', opts: { none: 'No', light: 'Slightly bent', severe: 'Badly bent or battery swollen' } },
    glass: { title: 'Screen glass', opts: { ok: 'Intact', cracked: 'Cracked or broken' } },
    display: {
      title: 'How does the display look?', hint: 'Open a grey or white background to check.',
      opts: { ok: ['Perfect', 'No spots, lines or marks'], minor: ['Light marks or yellow tint', 'Ghost image (burn-in) or a slight color shift'], major: ['Faulty', 'Lines, black spots or poor touch response'] },
    },
    uzimei: { title: 'Is the IMEI registered in Uzbekistan?', hint: 'An unregistered phone gets blocked on local SIM cards.', opts: { yes: 'Yes', no: 'No', unknown: 'Not sure' } },
  },

  // q = seller question, s = short name in the buyer's report
  faults: {
    biometric: { q: { face: 'Face ID doesn’t work', touch: 'Touch ID or Home button doesn’t work' }, s: { face: 'Face ID', touch: 'Touch ID' } },
    camera: { q: 'Camera doesn’t work or won’t focus', s: 'Camera' },
    wifi: { q: 'Wi‑Fi, Bluetooth, compass or Apple Pay doesn’t work', s: 'Wi‑Fi, Bluetooth, Apple Pay' },
    mic: { q: 'Microphone or voice recording doesn’t work', s: 'Microphone' },
    speaker: { q: 'Speaker doesn’t work (no sound)', s: 'Speaker' },
    charging: { q: 'Doesn’t charge', s: 'Charging' },
    vibration: { q: 'No vibration', s: 'Vibration' },
    buttons: { q: 'Buttons don’t work (volume, power)', s: 'Buttons' },
    trueTone: { q: 'True Tone doesn’t work', s: 'True Tone' },
    cameraButton: { q: 'Camera Control button is faulty', s: 'Camera Control' },
  },

  parts: {
    title: 'Replaced parts', hint: 'Settings → General → About → check “Parts and Service History”.',
    items: { screen: 'Screen', battery: 'Battery', camera: 'Camera' },
    opts: { none: 'Not replaced', genuine: 'Genuine part', unknown: 'Unknown part' },
  },
  extras: { box: 'Box', cable: 'Cable / charger', receipt: 'Receipt or papers' },
  verdict: { deal: 'Good deal', fair: 'Fair price', high: 'Above market', sold: 'Sold' },

  regions: {
    'tashkent-city': 'Tashkent City', 'tashkent-region': 'Tashkent Region', andijan: 'Andijan', bukhara: 'Bukhara', fergana: 'Fergana',
    jizzakh: 'Jizzakh', khorezm: 'Khorezm', namangan: 'Namangan', navoi: 'Navoi', kashkadarya: 'Kashkadarya',
    karakalpakstan: 'Karakalpakstan', samarkand: 'Samarkand', syrdarya: 'Syrdarya', surkhandarya: 'Surkhandarya',
  },

  colors: {
    black: 'Black', white: 'White', red: 'Red', silver: 'Silver', gold: 'Gold', gray: 'Space Gray', rose: 'Rose Gold', jet: 'Jet Black',
    blue: 'Blue', yellow: 'Yellow', coral: 'Coral', green: 'Green', purple: 'Purple', midgreen: 'Midnight Green', graphite: 'Graphite',
    pacific: 'Pacific Blue', midnight: 'Midnight', starlight: 'Starlight', pink: 'Pink', sierra: 'Sierra Blue', alpine: 'Alpine Green',
    deeppurple: 'Deep Purple', spaceblack: 'Space Black', natural: 'Natural Titanium', bluetitan: 'Blue Titanium', whitetitan: 'White Titanium',
    blacktitan: 'Black Titanium', deserttitan: 'Desert Titanium', teal: 'Teal', ultramarine: 'Ultramarine', lavender: 'Lavender', sage: 'Sage',
    mistblue: 'Mist Blue', cloud: 'Cloud White', lightgold: 'Light Gold', sky: 'Sky Blue', orange: 'Cosmic Orange', deepblue: 'Deep Blue',
  },

  // Price breakdown lines produced by pricing.js ({ k, ...params }).
  line(l, model) {
    switch (l.k) {
      case 'gradePrice': return `Grade ${l.g} price`;
      case 'battBelow': return `Grade ${l.g}, battery under ${l.min}%`;
      case 'gradeAtBattery': return `Grade ${l.g} price (battery ${l.battery}%)`;
      case 'base': return 'Base price';
      case 'baseBelowB': return 'Base price (condition below B)';
      case 'baseBattery': return `Base price (battery ${l.battery}%)`;
      case 'scrapDead': return 'Doesn’t turn on (parts value)';
      case 'scrapImei': return 'No IMEI shown (parts value)';
      case 'display': return 'Display defect';
      case 'glass': return 'Cracked screen glass';
      case 'displayMinor': return 'Light marks on display';
      case 'backGlass': return 'Cracked back glass';
      case 'lens': return 'Cracked or stained camera lens';
      case 'bentLight': return 'Body slightly bent';
      case 'bentSevere': return 'Body badly bent / swollen';
      case 'fault': return {
        biometric: model?.bio === 'touch' ? 'Touch ID not working' : 'Face ID not working', camera: 'Camera not working',
        wifi: 'Wi‑Fi / Bluetooth / compass fault', mic: 'Microphone not working', trueTone: 'True Tone not working',
        speaker: 'Speaker not working', charging: 'Doesn’t charge', vibration: 'No vibration', buttons: 'Buttons not working',
        cameraButton: 'Camera Control fault',
      }[l.f];
      case 'genuine': return `Replaced with genuine parts (${l.n})`;
      case 'unknown': return `Unknown part message (${l.n})`;
      case 'seItems': return `Replaced parts / low battery (${l.n})`;
      case 'refurbished': return 'Refurbished or demo unit';
      case 'esim': return 'eSIM-only model';
      default: return l.k;
    }
  },

  err: {
    notFound: 'Page not found', badRequest: 'Invalid request', tooLarge: 'Upload too large. Use fewer photos.',
    incomplete: 'Please answer all the condition questions.', modelNotFound: 'Model not found.', storage: 'Choose a storage size.',
    icloud: 'A phone signed in to iCloud can’t be sold.', price: 'Enter a valid price.', region: 'Choose a region.', name: 'Enter your name.',
    phone: 'Enter the full phone number: +998 XX XXX XX XX.', telegram: 'Invalid Telegram username.',
    photoFormat: 'Unsupported photo format.', photoSize: 'Photo is too large.', photoBroken: 'Photo file is damaged.',
    rate: 'Too many listings. Please try again later.', status: 'Invalid status.', forbidden: 'You can’t manage this listing.',
    server: 'Server error. Please try again shortly.',
  },
};
