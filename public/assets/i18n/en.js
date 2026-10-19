// English text. ko.js must have the same keys (checked by test/i18n.test.js). Shared by the server and the browser.
// A question or fault can be reworded for one category with a `${key}_${category}` entry (e.g. icloudOff_samsung).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  lang: 'en',
  switchTo: { code: 'ko', label: '한국어' },
  // Prices (L.price, L.currency…) come from money.js, merged in for each visitor's currency.
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

  cats: { iphone: 'iPhone', samsung: 'Samsung', ipad: 'iPad', macbook: 'MacBook', watch: 'Apple Watch' },
  brands: { apple: 'Apple', samsung: 'Samsung' },

  t: {
    // layout
    skip: 'Skip to content',
    titleDefault: 'Buy and sell used Apple and Samsung devices',
    descDefault: 'Sell or buy a used iPhone, Galaxy, iPad, MacBook or Apple Watch. Instant iPhone prices, condition reports, iCloud check, contact by phone or KakaoTalk.',
    back: 'Back', home: 'home', navMain: 'Main menu',
    navPhones: 'Devices', navPrices: 'Prices', navSaved: 'Saved', navMine: 'My listings',
    searchPh: 'Search, e.g. 15 Pro or S24', searchAria: 'Search devices', searchIcon: 'Search',
    sellCta: 'Sell a device', langSwitch: 'Change language', curSwitch: 'Change currency',
    prefsAria: 'Language and currency', langTitle: 'Language', curTitle: 'Currency',
    footerBlurb: 'A transparent marketplace for used iPhones, Galaxy phones, iPads, MacBooks and Apple Watches.',
    footerNav: 'More', footerPhones: 'Devices', footerSell: 'Sell a device', footerPrices: 'iPhone price guide', footerSafety: 'Safe trading', footerFaq: 'FAQ',
    footerNote: 'Prices are estimates based on what sellers report and don’t replace checking the device in person.',
    tabsAria: 'Bottom menu', tabHome: 'Home', tabPhones: 'Devices', tabSell: 'Sell', tabSaved: 'Saved', tabMine: 'My ads',

    // home
    eyebrow: 'Apple & Samsung devices · transparent prices',
    heroTitle: 'What’s your device worth? Find out in ', heroHighlight: '1 minute', heroTitleEnd: '',
    lead: 'Pick your device and describe its condition. iPhones get an instant price; listing is free for everything.',
    heroPh: 'e.g. 15 Pro or S24', heroAria: 'Device model', heroBtn: 'Get price', heroChipsAria: 'Choose a brand',
    pickTitle: (brand) => `Which ${brand} device are you selling?`, modelsN: (n) => `${n} models`,
    heroAltText: 'Looking to buy?', heroAltLink: (n) => `See ${n} listings`,
    demoLabel: 'Estimated price', demoFaceId: 'Face ID', demoWorks: 'works', demoScreen: 'Screen', demoNoScratches: 'no scratches', demoParts: 'Parts', demoOriginal: 'original',
    noListingsTitle: 'No listings yet', noListingsText: 'Be the first to list a device. It takes a minute and it’s free.',
    statTypes: 'device types',
    statsAria: 'In numbers', statListings: 'active listings', statModels: 'device models', statFreeValue: 'Free', statFree: 'to list', statTimeValue: '~1 min', statTime: 'to get a price',
    categoriesTitle: 'Browse by category', listingsN: (n) => (n === 1 ? '1 listing' : `${n} listings`),
    latestTitle: 'New listings', seeAll: 'See all',
    howTitle: 'How it works', howCta: 'Sell my device',
    steps: [
      ['Pick your device', 'iPhone, Galaxy, iPad, MacBook or Apple Watch, any model.'],
      ['Describe the condition', 'Simple questions: screen, body, battery, faults.'],
      ['See the price', 'iPhones get an instant price with every deduction shown; for other devices you set it.'],
      ['Post your listing', 'Add photos; buyers call you or message you on KakaoTalk.'],
    ],
    gradesTitle: 'Condition grades', gradesSub: 'Every listing uses the same scale, so buyers know exactly what they get.',
    safetyTitle: 'Safe trading',
    tips: [
      ['Account lock checked', 'Devices still locked to iCloud or a Samsung account can’t be listed.'],
      ['Check the IMEI', 'Dial *#06# on the phone: the number must match the box and Settings.'],
      ['Meet in a busy place', 'Check the device in your hands before you pay.'],
      ['Never pay in advance', '“I’ll deliver it, send the money first” is the most common scam.'],
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      ['How is the price calculated?', 'For iPhones we take the price for the model, storage and condition grade (A, A−, B+, B), then subtract a fixed amount for each fault: cracked glass, Face ID not working, replaced parts and so on. You see every line. For Galaxy, iPad, MacBook and Apple Watch there is no price list yet, so the seller sets the price; buyers still get the same condition grade and report.'],
      ['Does listing cost anything?', 'No. Getting a price and posting a listing are free, and you don’t need an account.'],
      ['Why must I sign out of iCloud or my Samsung account?', 'A device still linked to iCloud (Find My) or a Samsung/Google account stays locked for its new owner. Requiring sign-out also blocks stolen devices, so locked devices can’t be listed.'],
      ['Where do I find battery health?', 'iPhone: Settings → Battery → Battery Health → “Maximum Capacity”. Apple Watch: Settings → Battery → Battery Health. Mac: System Settings → Battery → Battery Health. For Galaxy and iPad, choose how long the battery lasts compared to new.'],
      ['Which devices can I sell?', 'iPhone (6 to 17 Pro Max, SE 2 and SE 3), Samsung Galaxy S, Z, A and Note, iPad, MacBook Air and Pro with Apple silicon, and Apple Watch. Automatic prices are available for iPhone; for other devices you set the price.'],
    ],
    ctaTitle: 'Want to sell your device?', ctaText: 'Getting a price is free and needs no sign-up.', ctaBtn: 'Get started',

    // catalogue
    allPhones: 'All devices', catSearchPh: 'Model, e.g. S24 Ultra', catSearchAria: 'Search', filter: 'Filters', sortAria: 'Sort',
    sorts: { new: 'Newest', cheap: 'Price: low to high', expensive: 'Price: high to low', battery: 'Best battery' },
    all: 'All', catAria: 'Device type', removeFilter: (t) => `Remove filter: ${t}`, clear: 'Clear',
    filtersTitle: 'Filters', close: 'Close', model: 'Model', allModels: 'All models', storage: 'Storage', condition: 'Condition',
    gradeOpts: { a: 'A · Ideal, excellent', b: 'B · Good, fair', c: 'C · Worn' },
    priceRange: (c) => `Price, ${c}`, from: 'from', to: 'to', minAria: 'Minimum price', maxAria: 'Maximum price',
    chipFrom: (v) => `from ${v}`, chipTo: (v) => `up to ${v}`, chipBattery: (b) => `Battery ${b}%+`,
    battery: 'Battery', batteryOpts: { '': 'Any', 80: '80% or more', 85: '85% or more', 90: '90% or more' },
    region: 'Region', allRegions: 'All of Korea', show: 'Show results',
    pagesAria: 'Pages', prev: 'Previous', next: 'Next',
    emptyTitle: 'Nothing found', emptyText: 'Try fewer filters or a different model.', emptyBtn: 'Clear filters',

    // cards + favourites
    save: 'Save', unsave: 'Remove from saved', saved: 'Saved', savedAdded: 'Saved', savedRemoved: 'Removed from saved',

    // listing
    posted: 'Your listing is live!', postedText: 'Share it with friends or manage it from “My listings”.', share: 'Share', linkCopied: 'Link copied',
    soldNotice: 'This device has been sold.',
    photosAria: 'Photos', photoAlt: (title, i) => `${title}, photo ${i}`, noPhotos: 'The seller hasn’t added photos yet',
    systemEst: 'System estimate:', howCalc: 'How the estimate was calculated', estTotal: 'System estimate',
    factCondition: 'Condition', factBattery: 'Battery', unknown: 'Unknown', factStorage: 'Storage', factColor: 'Color',
    factRam: 'Memory', factSize: 'Size', factMaterial: 'Case', factConnectivity: 'Connectivity', cycles: (n) => `${n} cycles`,
    reportTitle: 'Condition report', reportNote: 'Filled in by the seller. Check the device yourself when you meet.',
    basics: 'Basic checks', looksTitle: 'Body and screen', funcsTitle: 'Functions', partsTitle: 'Parts', repairTitle: 'Repairs',
    faultsN: (n) => `${n} fault${n > 1 ? 's' : ''}`, allWork: 'Everything works',
    rowIcloud: 'Account lock', signedOut: 'Removed', rowImei: 'IMEI', shown: 'Shown', notShown: 'Not shown',
    rowPowers: 'Turns on', yes: 'Yes', no: 'No', rowRefurb: 'Refurbished / demo',
    rowScreen: 'Screen surface', rowBody: 'Body', rowBack: 'Back glass', rowLens: 'Camera lens', rowBent: 'Bent', rowGlass: 'Screen glass', rowDisplay: 'Display',
    rowInner: 'Inner screen', rowRepair: 'Repair history',
    cantCheck: 'Can’t be checked', deadPhone: 'Doesn’t turn on', works: 'Works', broken: 'Not working',
    descTitle: 'Description', boxTitle: 'In the box', phoneOnly: 'Device only', views: (n) => `${n} views`,
    safeTitle: 'Safe buying',
    safeTips: ['Meet in a busy place and check the device in your hands.', 'For phones, dial *#06# to check the IMEI and compare it with the box.', 'Make sure the device is signed out of iCloud or its Samsung account.', 'Never pay in advance.'],
    manage: 'Manage listing', reactivate: 'Mark as available', markSold: 'Mark as sold', remove: 'Delete',
    confirmDelete: 'Delete this listing for good?', error: 'Something went wrong',
    call: 'Call', kakao: 'KakaoTalk', kakaoChat: 'Chat on KakaoTalk', kakaoId: (id) => `KakaoTalk ID: ${id}`,
    kakaoCopied: 'KakaoTalk ID copied. In KakaoTalk: Add friend → by ID, then paste it.', similar: 'Similar listings',
    metaDesc: (title, grade, battery, region, price) => `${title}, ${grade.toLowerCase()} condition${battery ? `, battery ${battery}%` : ''}. ${region}. ${price}.`,

    // sell
    sellTitle: 'Price and sell your device', sellDesc: 'Describe your device’s condition and list it for free. iPhones get an instant price.', sellHeader: 'Sell a device',
    stepNames: { model: 'Device', config: 'Specs & color', basic: 'Basic checks', looks: 'Body & glass', screen: 'Screen & battery', faults: 'Functions', parts: 'Parts', result: 'Price', details: 'Listing' },
    noscript: 'JavaScript must be enabled to sell a device.',
    change: 'Change', resultPending: 'Answer the questions above to see the result.',
    // example pictures behind the "?" on the screen and body questions
    exShow: 'Examples', exTitle: (q) => `${q}: examples`,
    exTip: {
      screen: 'Turn the screen off and tilt it under a lamp, then choose the picture closest to your device.',
      body: 'Look at the corners and edges under a light, then choose the picture closest to your device.',
    },
    exChoose: 'Choose this', exChosen: 'Selected', exDrawing: 'Illustration',
    exPhoto: (by, license) => `Photo: ${by}, ${license}`, exAlt: (grade, text) => `Example of grade ${grade}: ${text}`,
    whichPhone: 'What are you selling?', modelSearchPh: 'Search all models', modelSearchAria: 'Search models',
    seriesFilterAria: 'Filter by series', modelsAria: 'Models', noModel: 'No such model.',
    storageQ: 'Storage', ramQ: 'Memory (RAM)', ssdQ: 'Storage (SSD)', sizeQ: 'Case size', colorQ: 'Color', basicTitle: 'Basic checks',
    icloudBlockTitle: 'You can’t list the device until its account lock is removed.',
    icloudBlockText: 'Otherwise the new owner can’t use it. Follow the steps in the hint above, then come back.',
    looksTitle2: 'Body and glass', screenTitle: 'Screen and battery',
    batteryQ: 'Battery health (maximum capacity)', batteryHint: 'Settings → Battery → Battery Health → “Maximum Capacity”.', batteryAria: 'Battery percentage',
    batteryHints: { great: 'Excellent — no effect on the price.', good: 'Good. Below 90%, so the price drops slightly.', fair: 'Average. The price drops.', poor: 'Needs a new battery — the price drops noticeably.' },
    cyclesQ: 'Battery cycle count', cyclesHint: 'Apple menu → System Information → Power → Cycle Count. Leave empty if unsure.',
    faultsTitle: 'What doesn’t work?', faultsSub: 'Tick anything that doesn’t work. If everything works, just continue.',
    partsNote: '“Genuine part”: an Apple part fitted during a repair. “Unknown part”: the iPhone shows an “Unknown Part” message.',
    noAutoTitle: (cat) => `No automatic price for ${cat} yet`,
    noAutoText: 'Our price list covers iPhones only for now. Set your own price on the next step — buyers still see the condition grade and the full report.',
    setOwnPrice: 'Set your price — automatic estimates are iPhone-only for now.', barGrade: 'Condition',
    detailsTitle: 'Listing details', photos: 'Photos', photosUpTo: (n) => `(up to ${n})`,
    photosHint: 'Shoot the front, back, sides and the battery screen. Listings with photos sell faster.', addPhoto: 'Add photo',
    askPrice: 'Asking price', choose: 'Choose', name: 'Your name', namePh: 'e.g. Minjun', phone: 'Your phone number',
    kakaoLabel: 'KakaoTalk', kakaoPh: 'KakaoTalk ID or open chat link', optional: '(optional)', inBox: 'What’s in the box?', desc: 'Description',
    descPh: 'e.g. Always kept in a case, never opened for repair.',
    confirm: 'By tapping “Publish” you confirm the information is accurate.',
    summaryAria: 'Your choices', pickModel: 'Choose a device', estPrice: 'Estimated price',
    prevAria: 'Previous step', continue: 'Continue', postListing: 'Post listing', publish: 'Publish', publishing: 'Publishing…',
    barModelPrice: (name) => `${name} price`, barIcloud: 'Account lock is on', barNoPrice: 'Can’t be listed', barMax: 'Maximum price',
    toastIcloud: 'Remove the account lock first', toastAnswer: 'Please answer the question', toastFill: 'Please fill in the fields',
    resultRange: 'Negotiation range:', scrapDead: 'The phone was priced as parts because it doesn’t turn on.',
    scrapImei: 'The phone was priced as parts because no IMEI is shown.', floorNote: 'Many faults, so the parts value is shown.',
    resultNote: 'The price is based on your answers. The final price may change once a buyer sees the phone.',
    changeAnswers: 'Change answers', total: 'Total', quickAria: 'Quick pick', quickEst: 'Estimate',
    maxPhotos: (n) => `Up to ${n} photos`, badPhoto: 'Couldn’t open this photo', mainPhoto: 'Main', removePhoto: 'Remove photo',
    offline: 'No internet connection. Please try again.', saveFailed: 'Couldn’t save the listing',

    // other pages
    pricesTitle: 'iPhone prices', pricesDesc: 'Used iPhone prices in Korean won and US dollars for every model and storage size, in ideal and used condition.',
    pricesH1: 'Used iPhone prices', pricesSub: (date) => `Estimated prices in ideal (A) and used condition. Updated ${date}.`,
    rateNote: (r) => `Dollar prices use 1 USD = ${r} KRW.`,
    pricesSearch: 'Search models', colStorage: 'Storage', colIdeal: 'Ideal', colUsed: 'Used', exact: 'Get an exact price',
    pricesNote: '“Ideal”: no scratches, battery 90%+. “Used”: the base price whatever the grade. The exact price depends on faults and replaced parts. Automatic prices are available for iPhone only for now.',
    noModelShort: 'No such model.',
    savedTitle: 'Saved', savedEmptyTitle: 'Nothing saved yet', savedEmptyText: 'Tap ♡ on devices you like and they’ll be kept here.', browse: 'Browse devices', loading: 'Loading…',
    mineTitle: 'My listings', mineSub: 'Listings posted from this device. Open one to manage it.',
    mineEmptyTitle: 'You haven’t posted anything yet', mineEmptyText: 'Describe your device in a minute and list it for free.',
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
    powersOn: { title: 'Does it turn on?', opts: { yes: 'Yes, it turns on', no: 'No, it doesn’t' } },
    imeiOk: { title: 'Does the IMEI appear when you dial *#06#?', hint: 'Open the Phone app and dial *#06#.', opts: { yes: 'Yes, it appears', no: 'No, it doesn’t' } },
    imeiOk_ipad: { title: 'Is the IMEI shown in Settings?', hint: 'Settings → General → About → IMEI.' },
    icloudOff: { title: 'Have you signed out of iCloud (Find My)?', hint: 'Settings → your name → Find My → Find My iPhone → Off.', opts: { yes: 'Yes, signed out', no: 'Not yet' } },
    icloudOff_ipad: { hint: 'Settings → your name → Find My → Find My iPad → Off.' },
    icloudOff_macbook: { hint: 'System Settings → your name → iCloud → Find My Mac → Off, then sign out of iCloud.' },
    icloudOff_watch: { title: 'Have you unpaired it from your iPhone?', hint: 'iPhone Watch app → All Watches → ⓘ → Unpair Apple Watch. This removes Activation Lock.', opts: { yes: 'Yes, unpaired', no: 'Not yet' } },
    icloudOff_samsung: { title: 'Have you signed out of your Samsung and Google accounts?', hint: 'Settings → Accounts and backup → Manage accounts → remove both. Otherwise the phone stays locked after a reset (FRP).' },
    refurbished: { title: 'Is it a refurbished or demo unit?', opts: { no: 'No', yes: 'Yes' } },
    connectivity: { title: 'Connectivity', opts: { wifi: 'Wi‑Fi', cellular: 'Wi‑Fi + Cellular', gps: 'GPS' } },
    connectivity_watch: { opts: { cellular: 'GPS + Cellular' } },
    material: { title: 'Case material', opts: { aluminum: 'Aluminum', steel: 'Stainless steel', titanium: 'Titanium' } },
    screen: {
      title: 'Screen surface', hint: 'Turn the screen off and look at it under a light.',
      opts: { A: ['No scratches', 'Like new, no marks at all'], 'A-': ['Very fine scratches', 'Only visible up close under light'], B: ['Light scratches', 'Visible at a normal glance'], C: ['Deep or many scratches', 'You can feel them with a fingernail'] },
    },
    screen_macbook: { title: 'Display surface', hint: 'With the screen off, look for scratches, keyboard marks and worn anti-glare coating.' },
    body: {
      title: 'Body (frame and back)',
      opts: { A: ['Perfect', 'No scratches or dents'], 'A-': ['Fine scratches', 'No dents'], 'B+': ['1–2 small dents', 'On corners or edges'], B: ['2–3 dents', 'Or many visible scratches'], C: ['Heavily worn', 'Deep dents, chipped paint'] },
    },
    body_macbook: { title: 'Case and lid' },
    body_watch: { title: 'Case' },
    body_ipad: { title: 'Body (edges and back)' },
    backGlass: { title: 'Back glass', opts: { ok: 'Intact', cracked: 'Cracked or broken' } },
    backGlass_watch: { title: 'Back sensor glass' },
    lens: { title: 'Camera lens', opts: { ok: 'Clean and intact', scratched: 'Fine scratches', cracked: 'Cracked or stained inside' } },
    bent: { title: 'Is the body bent or swollen?', opts: { none: 'No', light: 'Slightly bent', severe: 'Badly bent or battery swollen' } },
    bent_macbook: { title: 'Is the case bent, or is the trackpad pushed up (swollen battery)?' },
    inner: {
      title: 'Inner (folding) screen',
      opts: { ok: ['Perfect', 'Protector intact, no marks'], minor: ['Visible crease or peeling protector', 'The display works normally'], damaged: ['Damaged', 'Lines, dead spots or broken'] },
    },
    glass: { title: 'Screen glass', opts: { ok: 'Intact', cracked: 'Cracked or broken' } },
    display: {
      title: 'How does the display look?', hint: 'Open a grey or white background to check.',
      opts: { ok: ['Perfect', 'No spots, lines or marks'], minor: ['Light marks or yellow tint', 'Ghost image (burn-in) or a slight color shift'], major: ['Faulty', 'Lines, black spots or poor touch response'] },
    },
    batteryLevel: {
      title: 'Battery condition', hint: 'Samsung Members → Diagnostics → Battery status, or think about how long it lasts compared to new.',
      opts: { good: ['Good', 'Lasts about like new'], ok: ['Average', 'Noticeably shorter than new'], weak: ['Weak', 'Needs a new battery'] },
    },
    batteryLevel_ipad: { hint: 'How long does it last on a charge compared to new?' },
    macBattery: { title: 'Battery condition', hint: 'System Settings → Battery → Battery Health.', opts: { normal: 'Normal', service: 'Service recommended' } },
    repair: { title: 'Has it ever been repaired?', opts: { none: 'Never', official: 'At an official service centre', thirdParty: 'At a third-party repair shop' } },
  },

  // q = seller question, s = short name in the buyer's report
  faults: {
    biometric: { q: { face: 'Face ID doesn’t work', touch: 'Touch ID or Home button doesn’t work' }, s: { face: 'Face ID', touch: 'Touch ID' } },
    fingerprint: { q: 'Fingerprint sensor doesn’t work', s: 'Fingerprint' },
    touchId: { q: 'Touch ID doesn’t work', s: 'Touch ID' },
    camera: { q: 'Camera doesn’t work or won’t focus', s: 'Camera' },
    camera_macbook: { q: 'FaceTime camera doesn’t work', s: 'Camera' },
    wifi: { q: 'Wi‑Fi, Bluetooth, compass or Apple Pay doesn’t work', s: 'Wi‑Fi, Bluetooth, Apple Pay' },
    wifi_samsung: { q: 'Wi‑Fi, Bluetooth, NFC or Samsung Pay doesn’t work', s: 'Wi‑Fi, Bluetooth, NFC' },
    wifi_ipad: { q: 'Wi‑Fi or Bluetooth doesn’t work', s: 'Wi‑Fi, Bluetooth' },
    wifi_macbook: { q: 'Wi‑Fi or Bluetooth doesn’t work', s: 'Wi‑Fi, Bluetooth' },
    wifi_watch: { q: 'Doesn’t pair or connect (Bluetooth / Wi‑Fi)', s: 'Pairing, Wi‑Fi' },
    mic: { q: 'Microphone or voice recording doesn’t work', s: 'Microphone' },
    speaker: { q: 'Speaker doesn’t work (no sound)', s: 'Speaker' },
    charging: { q: 'Doesn’t charge', s: 'Charging' },
    vibration: { q: 'No vibration', s: 'Vibration' },
    buttons: { q: 'Buttons don’t work (volume, power)', s: 'Buttons' },
    buttons_ipad: { q: 'Buttons don’t work (volume, top button)', s: 'Buttons' },
    buttons_watch: { q: 'Digital Crown or side button doesn’t work', s: 'Crown and button' },
    trueTone: { q: 'True Tone doesn’t work', s: 'True Tone' },
    cameraButton: { q: 'Camera Control button is faulty', s: 'Camera Control' },
    spen: { q: 'S Pen doesn’t work', s: 'S Pen' },
    hinge: { q: 'Hinge is loose, stiff or creaks', s: 'Hinge' },
    pencil: { q: 'Apple Pencil doesn’t connect or charge', s: 'Apple Pencil' },
    cellular: { q: 'Cellular / SIM doesn’t work', s: 'Cellular' },
    keyboard: { q: 'Some keys don’t work', s: 'Keyboard' },
    trackpad: { q: 'Trackpad doesn’t click or track', s: 'Trackpad' },
    ports: { q: 'A USB‑C / Thunderbolt port doesn’t work', s: 'Ports' },
    sensors: { q: 'Heart-rate or other sensors don’t work', s: 'Sensors' },
  },

  parts: {
    title: 'Replaced parts', hint: 'Settings → General → About → check “Parts and Service History”.',
    items: { screen: 'Screen', battery: 'Battery', camera: 'Camera' },
    opts: { none: 'Not replaced', genuine: 'Genuine part', unknown: 'Unknown part' },
  },
  extras: { box: 'Box', cable: 'Cable / charger', receipt: 'Receipt or papers', pencil: 'Apple Pencil', keyboard: 'Keyboard / case', band: 'Extra band' },
  verdict: { deal: 'Good deal', fair: 'Fair price', high: 'Above market', sold: 'Sold' },

  regions: {
    seoul: 'Seoul', busan: 'Busan', daegu: 'Daegu', incheon: 'Incheon', gwangju: 'Gwangju', daejeon: 'Daejeon', ulsan: 'Ulsan',
    sejong: 'Sejong', gyeonggi: 'Gyeonggi', gangwon: 'Gangwon', chungbuk: 'North Chungcheong', chungnam: 'South Chungcheong',
    jeonbuk: 'North Jeolla', jeonnam: 'South Jeolla', gyeongbuk: 'North Gyeongsang', gyeongnam: 'South Gyeongsang', jeju: 'Jeju',
  },

  colors: {
    black: 'Black', white: 'White', red: 'Red', silver: 'Silver', gold: 'Gold', gray: 'Space Gray', rose: 'Rose Gold', jet: 'Jet Black',
    blue: 'Blue', yellow: 'Yellow', coral: 'Coral', green: 'Green', purple: 'Purple', midgreen: 'Midnight Green', graphite: 'Graphite',
    pacific: 'Pacific Blue', midnight: 'Midnight', starlight: 'Starlight', pink: 'Pink', sierra: 'Sierra Blue', alpine: 'Alpine Green',
    deeppurple: 'Deep Purple', spaceblack: 'Space Black', natural: 'Natural Titanium', bluetitan: 'Blue Titanium', whitetitan: 'White Titanium',
    blacktitan: 'Black Titanium', deserttitan: 'Desert Titanium', teal: 'Teal', ultramarine: 'Ultramarine', lavender: 'Lavender', sage: 'Sage',
    mistblue: 'Mist Blue', cloud: 'Cloud White', lightgold: 'Light Gold', sky: 'Sky Blue', orange: 'Cosmic Orange', deepblue: 'Deep Blue',
    titaniumsilver: 'Titanium Silver', titaniumgray: 'Titanium Gray', navy: 'Navy', mint: 'Mint', violet: 'Violet', cream: 'Cream',
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
      default: return l.k;
    }
  },

  err: {
    notFound: 'Page not found', badRequest: 'Invalid request', tooLarge: 'Upload too large. Use fewer photos.',
    incomplete: 'Please answer all the condition questions.', modelNotFound: 'Model not found.', storage: 'Choose the specs.',
    icloud: 'A device with an account lock can’t be sold.', price: 'Enter a valid price.', region: 'Choose a region.', name: 'Enter your name.',
    phone: 'Enter a mobile number, e.g. 010-1234-5678.', kakao: 'Enter a KakaoTalk ID (4–20 letters, numbers, . _ -) or an open chat link.',
    photoFormat: 'Unsupported photo format.', photoSize: 'Photo is too large.', photoBroken: 'Photo file is damaged.',
    rate: 'Too many listings. Please try again later.', status: 'Invalid status.', forbidden: 'You can’t manage this listing.',
    server: 'Server error. Please try again shortly.',
  },
};
