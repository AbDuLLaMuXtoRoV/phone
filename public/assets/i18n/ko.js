// 한국어 텍스트. en.js와 같은 키를 사용합니다(test/i18n.test.js에서 확인). 서버와 브라우저에서 함께 사용합니다.

export default {
  lang: 'ko',
  switchTo: { code: 'en', label: 'English' },
  // 금액 표시(L.price, L.currency…)는 money.js에서 방문자의 통화에 맞춰 합쳐집니다.
  date: (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`,
  ago(ts, now = Date.now()) {
    const s = Math.max(0, (now - ts) / 1000);
    if (s < 60) return '방금 전';
    if (s < 3600) return `${Math.floor(s / 60)}분 전`;
    if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
    if (s < 172800) return '어제';
    if (s < 7 * 86400) return `${Math.floor(s / 86400)}일 전`;
    const d = new Date(ts);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  },

  cats: { iphone: '아이폰', samsung: '갤럭시', ipad: '아이패드', macbook: '맥북', watch: '애플워치' },
  brands: { apple: '애플', samsung: '삼성' },

  t: {
    // 레이아웃
    skip: '본문으로 건너뛰기',
    titleDefault: '중고 애플·삼성 기기 사고팔기',
    descDefault: '중고 아이폰, 갤럭시, 아이패드, 맥북, 애플워치를 사고파세요. 아이폰 즉시 시세, 상태 리포트, iCloud 확인, 전화·카카오톡 연락.',
    back: '뒤로', home: '홈', navMain: '주 메뉴',
    navPhones: '기기', navPrices: '시세', navSaved: '찜', navMine: '내 판매글',
    searchPh: '검색 (예: 15 Pro, S24)', searchAria: '기기 검색', searchIcon: '검색',
    sellCta: '기기 팔기', langSwitch: '언어 변경', curSwitch: '통화 변경',
    prefsAria: '언어 및 통화', langTitle: '언어', curTitle: '통화',
    footerBlurb: '중고 아이폰, 갤럭시, 아이패드, 맥북, 애플워치를 위한 투명한 마켓.',
    footerNav: '더 보기', footerPhones: '기기', footerSell: '기기 팔기', footerPrices: '아이폰 시세표', footerSafety: '안전 거래', footerFaq: '자주 묻는 질문',
    footerNote: '가격은 판매자가 입력한 정보를 바탕으로 한 예상가이며, 직접 확인을 대신하지 않습니다.',
    tabsAria: '하단 메뉴', tabHome: '홈', tabPhones: '기기', tabSell: '팔기', tabSaved: '찜', tabMine: '내 판매',

    // 홈
    eyebrow: '애플·삼성 기기 전문 · 투명한 가격',
    heroTitle: '내 기기 시세, ', heroHighlight: '1분 만에', heroTitleEnd: ' 확인하세요',
    lead: '기기를 고르고 상태를 입력하세요. 아이폰은 즉시 시세를 알려 드리고, 모든 기기의 판매글 등록은 무료입니다.',
    heroPh: '예: 15 Pro, S24', heroAria: '기기 모델', heroBtn: '시세 확인', heroChipsAria: '브랜드 선택',
    pickTitle: (brand) => `어떤 ${brand} 기기를 파시나요?`, modelsN: (n) => `모델 ${n}개`,
    heroAltText: '구매하시나요?', heroAltLink: (n) => `판매글 ${n}개 보기`,
    demoLabel: '예상 가격', demoFaceId: 'Face ID', demoWorks: '정상', demoScreen: '액정', demoNoScratches: '스크래치 없음', demoParts: '부품', demoOriginal: '정품',
    noListingsTitle: '아직 판매글이 없습니다', noListingsText: '첫 판매글을 올려 보세요. 1분이면 충분하고 무료입니다.',
    statTypes: '기기 종류',
    statsAria: '숫자로 보기', statListings: '판매 중인 글', statModels: '기기 모델', statFreeValue: '무료', statFree: '판매글 등록', statTimeValue: '~1분', statTime: '시세 확인',
    categoriesTitle: '카테고리별 보기', listingsN: (n) => `판매글 ${n}개`,
    latestTitle: '새 판매글', seeAll: '전체 보기',
    howTitle: '이용 방법', howCta: '내 기기 팔기',
    steps: [
      ['기기 선택', '아이폰, 갤럭시, 아이패드, 맥북, 애플워치의 모든 모델.'],
      ['상태 입력', '액정, 외관, 배터리, 고장 여부 등 간단한 질문.'],
      ['가격 확인', '아이폰은 차감 내역과 함께 즉시 시세를 보여 드리고, 다른 기기는 직접 가격을 정합니다.'],
      ['판매글 등록', '사진을 올리면 구매자가 전화나 카카오톡으로 연락합니다.'],
    ],
    gradesTitle: '상태 등급', gradesSub: '모든 판매글에 같은 기준을 적용해 구매자가 무엇을 사는지 정확히 알 수 있습니다.',
    safetyTitle: '안전 거래',
    tips: [
      ['계정 잠금 확인', 'iCloud나 삼성 계정이 잠겨 있는 기기는 등록할 수 없습니다.'],
      ['IMEI 확인', '휴대폰에서 *#06#을 눌러 IMEI가 박스와 설정 화면의 번호와 같은지 확인하세요.'],
      ['사람 많은 곳에서 거래', '직접 손에 들고 확인한 뒤 결제하세요.'],
      ['선입금 금지', '“배송해 드릴 테니 먼저 입금하세요”가 가장 흔한 사기입니다.'],
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      ['가격은 어떻게 계산되나요?', '아이폰은 모델, 용량, 상태 등급(A, A−, B+, B)에 따른 시세에서 고장마다 정해진 금액을 차감하며 계산 내역을 모두 보여 드립니다. 갤럭시, 아이패드, 맥북, 애플워치는 아직 시세표가 없어 판매자가 가격을 정하지만, 구매자는 같은 상태 등급과 리포트를 확인할 수 있습니다.'],
      ['판매글 등록은 유료인가요?', '아니요. 시세 확인과 판매글 등록 모두 무료이며 회원가입도 필요 없습니다.'],
      ['왜 iCloud나 삼성 계정에서 로그아웃해야 하나요?', 'iCloud(나의 찾기)나 삼성·구글 계정에 연결된 기기는 새 주인이 사용할 수 없습니다. 도난 기기 거래도 막을 수 있어 잠긴 기기는 등록할 수 없습니다.'],
      ['배터리 성능은 어디서 확인하나요?', '아이폰: 설정 → 배터리 → 배터리 성능 상태 → “최대 용량”. 애플워치: 설정 → 배터리 → 배터리 성능 상태. 맥: 시스템 설정 → 배터리 → 배터리 성능 상태. 갤럭시와 아이패드는 새 제품과 비교해 얼마나 오래가는지 선택하세요.'],
      ['어떤 기기를 팔 수 있나요?', '아이폰(6부터 17 Pro Max, SE 2·SE 3), 삼성 갤럭시 S·Z·A·노트, 아이패드, 애플 실리콘 맥북 에어·프로, 애플워치입니다. 자동 시세는 아이폰만 지원하며, 다른 기기는 직접 가격을 정합니다.'],
    ],
    ctaTitle: '기기를 파시겠어요?', ctaText: '시세 확인은 무료이며 가입이 필요 없습니다.', ctaBtn: '시작하기',

    // 목록
    allPhones: '전체 기기', catSearchPh: '모델 (예: S24 Ultra)', catSearchAria: '검색', filter: '필터', sortAria: '정렬',
    sorts: { new: '최신순', cheap: '낮은 가격순', expensive: '높은 가격순', battery: '배터리 좋은 순' },
    all: '전체', catAria: '기기 종류', removeFilter: (t) => `필터 해제: ${t}`, clear: '초기화',
    filtersTitle: '필터', close: '닫기', model: '모델', allModels: '전체 모델', storage: '용량', condition: '상태',
    gradeOpts: { a: 'A · 최상, 매우 좋음', b: 'B · 좋음, 보통', c: 'C · 사용감 많음' },
    priceRange: (c) => `가격 (${c})`, from: '최소', to: '최대', minAria: '최소 가격', maxAria: '최대 가격',
    chipFrom: (v) => `${v} 이상`, chipTo: (v) => `${v} 이하`, chipBattery: (b) => `배터리 ${b}% 이상`,
    battery: '배터리', batteryOpts: { '': '상관없음', 80: '80% 이상', 85: '85% 이상', 90: '90% 이상' },
    region: '지역', allRegions: '전국', show: '결과 보기',
    pagesAria: '페이지', prev: '이전', next: '다음',
    emptyTitle: '검색 결과가 없습니다', emptyText: '필터를 줄이거나 다른 모델을 검색해 보세요.', emptyBtn: '필터 초기화',

    // 카드 + 찜
    save: '찜하기', unsave: '찜 해제', saved: '찜함', savedAdded: '찜 목록에 추가했습니다', savedRemoved: '찜 목록에서 삭제했습니다',

    // 판매글
    posted: '판매글이 등록되었습니다!', postedText: '친구에게 공유하거나 “내 판매글”에서 관리하세요.', share: '공유', linkCopied: '링크를 복사했습니다',
    soldNotice: '판매가 완료된 기기입니다.',
    photosAria: '사진', photoAlt: (title, i) => `${title}, 사진 ${i}`, noPhotos: '판매자가 아직 사진을 올리지 않았습니다',
    systemEst: '시스템 예상가:', howCalc: '예상가 계산 내역', estTotal: '시스템 예상가',
    factCondition: '상태', factBattery: '배터리', unknown: '알 수 없음', factStorage: '용량', factColor: '색상',
    factRam: '메모리', factSize: '크기', factMaterial: '케이스', factConnectivity: '통신', cycles: (n) => `${n}회 충전`,
    reportTitle: '상태 리포트', reportNote: '판매자가 직접 작성했습니다. 만나서 직접 확인하세요.',
    basics: '기본 점검', looksTitle: '외관 및 액정', funcsTitle: '기능', partsTitle: '부품', repairTitle: '수리 이력',
    faultsN: (n) => `고장 ${n}개`, allWork: '모두 정상',
    rowIcloud: '계정 잠금', signedOut: '해제됨', rowImei: 'IMEI', shown: '표시됨', notShown: '표시 안 됨',
    rowPowers: '전원', yes: '켜짐', no: '안 켜짐', rowRefurb: '리퍼/전시 제품',
    rowScreen: '액정 표면', rowBody: '외관', rowBack: '후면 유리', rowLens: '카메라 렌즈', rowBent: '휨', rowGlass: '액정 유리', rowDisplay: '디스플레이',
    rowInner: '내부 화면', rowRepair: '수리 이력',
    cantCheck: '확인 불가', deadPhone: '전원이 켜지지 않음', works: '정상', broken: '불량',
    descTitle: '설명', boxTitle: '구성품', phoneOnly: '본체만', views: (n) => `조회 ${n}회`,
    safeTitle: '안전한 구매',
    safeTips: ['사람이 많은 곳에서 만나 직접 확인하세요.', '휴대폰은 *#06#으로 IMEI를 확인하고 박스의 번호와 비교하세요.', 'iCloud나 삼성 계정 로그아웃 여부를 확인하세요.', '절대 선입금하지 마세요.'],
    manage: '판매글 관리', reactivate: '판매 중으로 변경', markSold: '판매 완료로 표시', remove: '삭제',
    confirmDelete: '판매글을 완전히 삭제할까요?', error: '오류가 발생했습니다',
    call: '전화하기', kakao: '카카오톡', kakaoChat: '카카오톡 오픈채팅', kakaoId: (id) => `카카오톡 ID: ${id}`,
    kakaoCopied: '카카오톡 ID를 복사했어요. 카카오톡 → 친구 추가 → ID로 추가에서 붙여넣으세요.', similar: '비슷한 판매글',
    metaDesc: (title, grade, battery, region, price) => `${title}, 상태 ${grade}${battery ? `, 배터리 ${battery}%` : ''}. ${region}. ${price}.`,

    // 판매
    sellTitle: '내 기기 시세 확인 및 판매', sellDesc: '기기 상태를 입력하고 무료로 판매글을 올리세요. 아이폰은 즉시 시세를 알려 드립니다.', sellHeader: '기기 팔기',
    stepNames: { model: '기기', config: '사양·색상', basic: '기본 점검', looks: '외관', screen: '액정·배터리', faults: '기능', parts: '부품', result: '가격', details: '판매글' },
    noscript: '기기를 팔려면 JavaScript를 켜 주세요.',
    change: '변경', resultPending: '위 질문에 답하면 결과가 표시됩니다.',
    // 화면·외관 질문의 "?" 예시 사진
    exShow: '예시 보기', exTitle: (q) => `${q} 예시`,
    exTip: {
      screen: '화면을 끄고 스탠드 불빛 아래에서 기울여 본 뒤, 내 기기와 가장 비슷한 사진을 고르세요.',
      body: '불빛 아래에서 모서리와 테두리를 살펴본 뒤, 내 기기와 가장 비슷한 사진을 고르세요.',
    },
    exChoose: '이걸로 선택', exChosen: '선택됨', exDrawing: '일러스트',
    exPhoto: (by, license) => `사진: ${by}, ${license}`, exAlt: (grade, text) => `${grade} 등급 예시: ${text}`,
    whichPhone: '무엇을 파시나요?', modelSearchPh: '전체 모델 검색', modelSearchAria: '모델 검색',
    seriesFilterAria: '시리즈 필터', modelsAria: '모델', noModel: '해당 모델이 없습니다.',
    storageQ: '용량', ramQ: '메모리 (RAM)', ssdQ: '저장 공간 (SSD)', sizeQ: '케이스 크기', colorQ: '색상', basicTitle: '기본 점검',
    icloudBlockTitle: '계정 잠금을 해제해야 판매글을 올릴 수 있습니다.',
    icloudBlockText: '그렇지 않으면 새 주인이 기기를 사용할 수 없습니다. 위 안내에 따라 해제한 뒤 다시 돌아오세요.',
    looksTitle2: '외관 상태', screenTitle: '액정과 배터리',
    batteryQ: '배터리 성능 (최대 용량)', batteryHint: '설정 → 배터리 → 배터리 성능 상태 → “최대 용량”.', batteryAria: '배터리 퍼센트',
    batteryHints: { great: '아주 좋음 — 가격에 영향이 없습니다.', good: '좋음. 90% 미만이라 가격이 조금 내려갑니다.', fair: '보통. 가격이 내려갑니다.', poor: '배터리 교체가 필요합니다 — 가격이 크게 내려갑니다.' },
    cyclesQ: '배터리 사이클 수', cyclesHint: 'Apple 메뉴 → 시스템 정보 → 전원 → 사이클 수. 모르면 비워 두세요.',
    faultsTitle: '작동하지 않는 기능이 있나요?', faultsSub: '작동하지 않는 항목을 선택하세요. 모두 정상이면 그냥 계속하세요.',
    partsNote: '“정품 부품”: 수리 시 애플 정품 부품으로 교체한 경우. “알 수 없는 부품”: 아이폰에 “알 수 없는 부품” 메시지가 표시되는 경우.',
    // 은/는: 은 after a final consonant (맥북은), 는 otherwise (갤럭시는).
    noAutoTitle: (cat) => `${cat}${(cat.charCodeAt(cat.length - 1) - 0xac00) % 28 ? "은" : "는"} 아직 자동 시세가 없습니다`,
    noAutoText: '현재 시세표는 아이폰만 지원합니다. 다음 단계에서 직접 가격을 정해 주세요. 구매자는 상태 등급과 전체 리포트를 그대로 확인할 수 있습니다.',
    setOwnPrice: '직접 가격을 정해 주세요 — 자동 시세는 현재 아이폰만 지원합니다.', barGrade: '상태',
    detailsTitle: '판매글 정보', photos: '사진', photosUpTo: (n) => `(최대 ${n}장)`,
    photosHint: '앞면, 뒷면, 옆면과 배터리 화면을 찍어 주세요. 사진이 있는 판매글이 더 빨리 팔립니다.', addPhoto: '사진 추가',
    askPrice: '판매 가격', choose: '선택하세요', name: '이름', namePh: '예: 김민준', phone: '전화번호',
    kakaoLabel: '카카오톡', kakaoPh: '카카오톡 ID 또는 오픈채팅 링크', optional: '(선택)', inBox: '구성품은 무엇인가요?', desc: '설명',
    descPh: '예: 항상 케이스를 끼워 사용했고 수리 이력이 없습니다.',
    confirm: '“등록”을 누르면 입력한 정보가 사실임을 확인하는 것입니다.',
    summaryAria: '선택 내용', pickModel: '기기를 선택하세요', estPrice: '예상 가격',
    prevAria: '이전 단계', continue: '계속', postListing: '판매글 올리기', publish: '등록', publishing: '등록 중…',
    barModelPrice: (name) => `${name} 시세`, barIcloud: '계정 잠금 상태', barNoPrice: '등록 불가', barMax: '최대 가격',
    toastIcloud: '먼저 계정 잠금을 해제하세요', toastAnswer: '질문에 답해 주세요', toastFill: '항목을 입력해 주세요',
    resultRange: '협상 범위:', scrapDead: '전원이 켜지지 않아 부품용으로 산정되었습니다.',
    scrapImei: 'IMEI가 표시되지 않아 부품용으로 산정되었습니다.', floorNote: '고장이 많아 부품용 가격으로 표시됩니다.',
    resultNote: '입력하신 답변을 기준으로 계산한 가격입니다. 구매자가 직접 확인한 뒤 최종 가격이 달라질 수 있습니다.',
    changeAnswers: '답변 수정', total: '합계', quickAria: '빠른 선택', quickEst: '예상가',
    maxPhotos: (n) => `사진은 최대 ${n}장까지 올릴 수 있습니다`, badPhoto: '이 사진을 열 수 없습니다', mainPhoto: '대표', removePhoto: '사진 삭제',
    offline: '인터넷 연결이 없습니다. 다시 시도해 주세요.', saveFailed: '판매글을 저장하지 못했습니다',

    // 기타 페이지
    pricesTitle: '아이폰 시세', pricesDesc: '모든 모델과 용량별 중고 아이폰 시세(원화, 달러). 최상 상태와 사용 상태 가격.',
    pricesH1: '중고 아이폰 시세', pricesSub: (date) => `최상(A) 상태와 사용 상태의 예상 가격. 업데이트: ${date}.`,
    rateNote: (r) => `달러 가격은 1달러 = ${r}원 기준입니다.`,
    pricesSearch: '모델 검색', colStorage: '용량', colIdeal: '최상', colUsed: '사용감', exact: '정확한 시세 확인',
    pricesNote: '“최상”: 스크래치 없음, 배터리 90% 이상. “사용감”: 등급과 관계없는 기본 시세. 정확한 가격은 고장과 부품 교체 여부에 따라 달라집니다. 자동 시세는 현재 아이폰만 지원합니다.',
    noModelShort: '해당 모델이 없습니다.',
    savedTitle: '찜 목록', savedEmptyTitle: '찜한 기기가 없습니다', savedEmptyText: '마음에 드는 기기의 ♡를 누르면 여기에 저장됩니다.', browse: '기기 보기', loading: '불러오는 중…',
    mineTitle: '내 판매글', mineSub: '이 기기에서 올린 판매글입니다. 열어서 관리하세요.',
    mineEmptyTitle: '아직 올린 판매글이 없습니다', mineEmptyText: '1분 만에 기기 상태를 입력하고 무료로 판매글을 올리세요.',
    notFoundTitle: '페이지를 찾을 수 없습니다', notFoundText: '판매글이 삭제되었거나 링크가 잘못되었을 수 있습니다.',
  },

  grades: {
    A: { name: '최상', desc: '스크래치, 찍힘, 카메라 손상, 액정 잔상이 없습니다. 배터리 90% 이상.' },
    'A-': { name: '매우 좋음', desc: '아주 미세한 스크래치, 찍힘 없음. 배터리 90% 이상.' },
    'B+': { name: '좋음', desc: '액정에 미세한 스크래치, 모서리에 작은 찍힘 1–2개. 배터리 85% 이상.' },
    B: { name: '보통', desc: '액정에 가벼운 스크래치, 모서리 찍힘 2–3개. 배터리 81% 이상.' },
    C: { name: '사용감 많음', desc: '깊은 스크래치, 찍힘이 많거나 유리 파손.' },
  },

  q: {
    powersOn: { title: '전원이 켜지나요?', opts: { yes: '네, 켜집니다', no: '아니요, 안 켜집니다' } },
    imeiOk: { title: '*#06#을 누르면 IMEI가 표시되나요?', hint: '전화 앱에서 *#06#을 입력하세요.', opts: { yes: '네, 표시됩니다', no: '아니요, 안 나옵니다' } },
    imeiOk_ipad: { title: '설정에 IMEI가 표시되나요?', hint: '설정 → 일반 → 정보 → IMEI.' },
    icloudOff: { title: 'iCloud(나의 찾기)에서 로그아웃했나요?', hint: '설정 → 내 이름 → 나의 찾기 → 나의 iPhone 찾기 → 끔.', opts: { yes: '네, 로그아웃했습니다', no: '아직 안 했습니다' } },
    icloudOff_ipad: { hint: '설정 → 내 이름 → 나의 찾기 → 나의 iPad 찾기 → 끔.' },
    icloudOff_macbook: { hint: '시스템 설정 → 내 이름 → iCloud → 나의 Mac 찾기 → 끔, 그다음 iCloud에서 로그아웃하세요.' },
    icloudOff_watch: { title: '아이폰과의 페어링을 해제했나요?', hint: '아이폰 Watch 앱 → 모든 Watch → ⓘ → Apple Watch 페어링 해제. 활성화 잠금이 해제됩니다.', opts: { yes: '네, 해제했습니다', no: '아직 안 했습니다' } },
    icloudOff_samsung: { title: '삼성 계정과 구글 계정에서 로그아웃했나요?', hint: '설정 → 계정 및 백업 → 계정 관리에서 두 계정을 삭제하세요. 그렇지 않으면 초기화 후 잠깁니다(FRP).' },
    refurbished: { title: '리퍼 또는 전시(데모) 제품인가요?', opts: { no: '아니요', yes: '네' } },
    connectivity: { title: '통신 방식', opts: { wifi: 'Wi‑Fi', cellular: 'Wi‑Fi + 셀룰러', gps: 'GPS' } },
    connectivity_watch: { opts: { cellular: 'GPS + 셀룰러' } },
    material: { title: '케이스 소재', opts: { aluminum: '알루미늄', steel: '스테인리스 스틸', titanium: '티타늄' } },
    screen: {
      title: '액정 표면', hint: '화면을 끄고 빛에 비춰 보세요.',
      opts: { A: ['스크래치 없음', '새것처럼 흔적이 전혀 없음'], 'A-': ['아주 미세한 스크래치', '빛에 비춰 가까이 봐야 보임'], B: ['가벼운 스크래치', '그냥 봐도 보임'], C: ['깊거나 많은 스크래치', '손톱에 걸리는 스크래치'] },
    },
    screen_macbook: { title: '디스플레이 표면', hint: '화면을 끄고 스크래치, 키보드 자국, 반사 방지 코팅 벗겨짐을 확인하세요.' },
    body: {
      title: '외관 (프레임과 뒷면)',
      opts: { A: ['완벽', '스크래치와 찍힘 없음'], 'A-': ['미세한 스크래치', '찍힘 없음'], 'B+': ['작은 찍힘 1–2개', '모서리나 테두리'], B: ['찍힘 2–3개', '또는 눈에 띄는 스크래치 다수'], C: ['사용감 많음', '깊은 찍힘, 도색 벗겨짐'] },
    },
    body_macbook: { title: '본체와 상판' },
    body_watch: { title: '케이스' },
    body_ipad: { title: '외관 (테두리와 뒷면)' },
    backGlass: { title: '후면 유리', opts: { ok: '정상', cracked: '금 가거나 깨짐' } },
    backGlass_watch: { title: '후면 센서 유리' },
    lens: { title: '카메라 렌즈', opts: { ok: '깨끗하고 정상', scratched: '미세한 스크래치 있음', cracked: '깨짐 또는 내부 얼룩' } },
    bent: { title: '본체가 휘었거나 부풀었나요?', opts: { none: '아니요', light: '약간 휨', severe: '심하게 휘었거나 배터리 부풂' } },
    bent_macbook: { title: '본체가 휘었거나 트랙패드가 들떴나요(배터리 부풂)?' },
    inner: {
      title: '내부(폴더블) 화면',
      opts: { ok: ['완벽', '보호필름 정상, 흔적 없음'], minor: ['주름이 보이거나 보호필름 들뜸', '화면은 정상 작동'], damaged: ['손상', '줄, 불량 화소 또는 파손'] },
    },
    glass: { title: '액정 유리', opts: { ok: '정상', cracked: '금 가거나 깨짐' } },
    display: {
      title: '화면 상태는 어떤가요?', hint: '회색이나 흰색 배경을 띄워 확인하세요.',
      opts: { ok: ['완벽', '얼룩, 줄, 잔상 없음'], minor: ['약한 잔상 또는 변색', '번인 잔상이나 약간의 색 변화'], major: ['불량', '줄, 검은 점 또는 터치 불량'] },
    },
    batteryLevel: {
      title: '배터리 상태', hint: 'Samsung Members → 진단 → 배터리 상태를 확인하거나, 새 제품과 비교해 얼마나 오래가는지 생각해 보세요.',
      opts: { good: ['좋음', '새 제품과 비슷하게 오래감'], ok: ['보통', '새 제품보다 눈에 띄게 짧음'], weak: ['약함', '배터리 교체 필요'] },
    },
    batteryLevel_ipad: { hint: '새 제품과 비교해 한 번 충전으로 얼마나 오래가나요?' },
    macBattery: { title: '배터리 상태', hint: '시스템 설정 → 배터리 → 배터리 성능 상태.', opts: { normal: '정상', service: '서비스 권장' } },
    repair: { title: '수리한 적이 있나요?', opts: { none: '없음', official: '공식 서비스센터에서 수리', thirdParty: '사설 수리점에서 수리' } },
  },

  faults: {
    biometric: { q: { face: 'Face ID가 작동하지 않음', touch: 'Touch ID 또는 홈 버튼이 작동하지 않음' }, s: { face: 'Face ID', touch: 'Touch ID' } },
    fingerprint: { q: '지문 인식이 작동하지 않음', s: '지문 인식' },
    touchId: { q: 'Touch ID가 작동하지 않음', s: 'Touch ID' },
    camera: { q: '카메라가 작동하지 않거나 초점이 안 맞음', s: '카메라' },
    camera_macbook: { q: 'FaceTime 카메라가 작동하지 않음', s: '카메라' },
    wifi: { q: '와이파이, 블루투스, 나침반 또는 애플페이가 작동하지 않음', s: '와이파이, 블루투스, 애플페이' },
    wifi_samsung: { q: '와이파이, 블루투스, NFC 또는 삼성페이가 작동하지 않음', s: '와이파이, 블루투스, NFC' },
    wifi_ipad: { q: '와이파이 또는 블루투스가 작동하지 않음', s: '와이파이, 블루투스' },
    wifi_macbook: { q: '와이파이 또는 블루투스가 작동하지 않음', s: '와이파이, 블루투스' },
    wifi_watch: { q: '페어링 또는 연결이 안 됨 (블루투스·와이파이)', s: '페어링, 와이파이' },
    mic: { q: '마이크 또는 녹음이 작동하지 않음', s: '마이크' },
    speaker: { q: '스피커가 작동하지 않음 (소리 안 남)', s: '스피커' },
    charging: { q: '충전이 되지 않음', s: '충전' },
    vibration: { q: '진동이 없음', s: '진동' },
    buttons: { q: '버튼이 작동하지 않음 (음량, 전원)', s: '버튼' },
    buttons_ipad: { q: '버튼이 작동하지 않음 (음량, 상단 버튼)', s: '버튼' },
    buttons_watch: { q: '디지털 크라운 또는 측면 버튼이 작동하지 않음', s: '크라운·버튼' },
    trueTone: { q: '트루톤이 작동하지 않음', s: '트루톤' },
    cameraButton: { q: '카메라 컨트롤 버튼 불량', s: '카메라 컨트롤' },
    spen: { q: 'S펜이 작동하지 않음', s: 'S펜' },
    hinge: { q: '힌지가 헐겁거나 뻑뻑하거나 소리가 남', s: '힌지' },
    pencil: { q: '애플펜슬이 연결되거나 충전되지 않음', s: '애플펜슬' },
    cellular: { q: '셀룰러·유심이 작동하지 않음', s: '셀룰러' },
    keyboard: { q: '일부 키가 작동하지 않음', s: '키보드' },
    trackpad: { q: '트랙패드 클릭 또는 인식 불량', s: '트랙패드' },
    ports: { q: 'USB‑C·썬더볼트 포트가 작동하지 않음', s: '포트' },
    sensors: { q: '심박 센서 등 센서가 작동하지 않음', s: '센서' },
  },

  parts: {
    title: '교체된 부품', hint: '설정 → 일반 → 정보 → “부품 및 서비스 내역”을 확인하세요.',
    items: { screen: '액정', battery: '배터리', camera: '카메라' },
    opts: { none: '교체 안 함', genuine: '정품 부품', unknown: '알 수 없는 부품' },
  },
  extras: { box: '박스', cable: '케이블 / 충전기', receipt: '영수증 또는 서류', pencil: '애플펜슬', keyboard: '키보드 / 케이스', band: '추가 밴드' },
  verdict: { deal: '저렴한 가격', fair: '적정 가격', high: '시세보다 높음', sold: '판매 완료' },

  regions: {
    seoul: '서울', busan: '부산', daegu: '대구', incheon: '인천', gwangju: '광주', daejeon: '대전', ulsan: '울산',
    sejong: '세종', gyeonggi: '경기', gangwon: '강원', chungbuk: '충북', chungnam: '충남',
    jeonbuk: '전북', jeonnam: '전남', gyeongbuk: '경북', gyeongnam: '경남', jeju: '제주',
  },

  colors: {
    black: '블랙', white: '화이트', red: '레드', silver: '실버', gold: '골드', gray: '스페이스 그레이', rose: '로즈 골드', jet: '제트 블랙',
    blue: '블루', yellow: '옐로', coral: '코랄', green: '그린', purple: '퍼플', midgreen: '미드나이트 그린', graphite: '그래파이트',
    pacific: '퍼시픽 블루', midnight: '미드나이트', starlight: '스타라이트', pink: '핑크', sierra: '시에라 블루', alpine: '알파인 그린',
    deeppurple: '딥 퍼플', spaceblack: '스페이스 블랙', natural: '내추럴 티타늄', bluetitan: '블루 티타늄', whitetitan: '화이트 티타늄',
    blacktitan: '블랙 티타늄', deserttitan: '데저트 티타늄', teal: '틸', ultramarine: '울트라마린', lavender: '라벤더', sage: '세이지',
    mistblue: '미스트 블루', cloud: '클라우드 화이트', lightgold: '라이트 골드', sky: '스카이 블루', orange: '코스믹 오렌지', deepblue: '딥 블루',
    titaniumsilver: '티타늄 실버', titaniumgray: '티타늄 그레이', navy: '네이비', mint: '민트', violet: '바이올렛', cream: '크림',
  },

  line(l, model) {
    switch (l.k) {
      case 'gradePrice': return `${l.g}등급 시세`;
      case 'battBelow': return `${l.g}등급, 배터리 ${l.min}% 미만`;
      case 'gradeAtBattery': return `${l.g}등급 시세 (배터리 ${l.battery}%)`;
      case 'base': return '기본 시세';
      case 'baseBelowB': return '기본 시세 (B등급 미만)';
      case 'baseBattery': return `기본 시세 (배터리 ${l.battery}%)`;
      case 'scrapDead': return '전원 불량 (부품용 시세)';
      case 'scrapImei': return 'IMEI 미표시 (부품용 시세)';
      case 'display': return '액정 불량';
      case 'glass': return '액정 유리 파손';
      case 'displayMinor': return '액정 잔상·경미한 얼룩';
      case 'backGlass': return '후면 유리 파손';
      case 'lens': return '카메라 렌즈 파손·얼룩';
      case 'bentLight': return '본체 약간 휨';
      case 'bentSevere': return '본체 심한 휨·배터리 부풂';
      case 'fault': return {
        biometric: model?.bio === 'touch' ? 'Touch ID 불량' : 'Face ID 불량', camera: '카메라 불량',
        wifi: '와이파이·블루투스·나침반 불량', mic: '마이크 불량', trueTone: '트루톤 불량',
        speaker: '스피커 불량', charging: '충전 불량', vibration: '진동 불량', buttons: '버튼 불량',
        cameraButton: '카메라 컨트롤 불량',
      }[l.f];
      case 'genuine': return `정품 부품 교체 (${l.n}개)`;
      case 'unknown': return `알 수 없는 부품 메시지 (${l.n}개)`;
      case 'seItems': return `부품 교체·배터리 성능 미달 (${l.n}개)`;
      case 'refurbished': return '리퍼/전시 제품';
      default: return l.k;
    }
  },

  err: {
    notFound: '페이지를 찾을 수 없습니다', badRequest: '잘못된 요청입니다', tooLarge: '업로드 용량이 너무 큽니다. 사진 수를 줄여 주세요.',
    incomplete: '상태 질문에 모두 답해 주세요.', modelNotFound: '모델을 찾을 수 없습니다.', storage: '사양을 선택하세요.',
    icloud: '계정 잠금이 걸린 기기는 판매할 수 없습니다.', price: '올바른 가격을 입력하세요.', region: '지역을 선택하세요.', name: '이름을 입력하세요.',
    phone: '휴대폰 번호를 입력하세요 (예: 010-1234-5678).', kakao: '카카오톡 ID(영문·숫자·. _ - 4–20자) 또는 오픈채팅 링크를 입력하세요.',
    photoFormat: '지원하지 않는 사진 형식입니다.', photoSize: '사진 용량이 너무 큽니다.', photoBroken: '사진 파일이 손상되었습니다.',
    rate: '판매글이 너무 많습니다. 잠시 후 다시 시도하세요.', status: '잘못된 상태입니다.', forbidden: '이 판매글을 관리할 권한이 없습니다.',
    server: '서버 오류입니다. 잠시 후 다시 시도하세요.',
  },
};
