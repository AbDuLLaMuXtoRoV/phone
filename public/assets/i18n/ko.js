// 한국어 텍스트. en.js와 같은 키를 사용합니다. 서버와 브라우저에서 함께 사용합니다.

const money = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// 1만 단위로 줄여 표시: 2,975,000 → 298만
const man = (n) => `${money(Math.round(n / 10000))}만`;

export default {
  lang: 'ko',
  switchTo: { code: 'en', label: 'English' },
  currency: '숨',
  money,
  price: (n) => `${money(n)}숨`,
  range: (a, b) => `${man(a)}–${man(b)} 숨`,
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

  t: {
    // 레이아웃
    skip: '본문으로 건너뛰기',
    titleDefault: '중고 아이폰 사고팔기',
    descDefault: '중고 아이폰 시세를 1분 만에 확인하고 무료로 판매글을 올리세요. 투명한 가격, iCloud 확인, 전화·텔레그램 연락.',
    back: '뒤로', home: '홈', navMain: '주 메뉴',
    navPhones: '휴대폰', navPrices: '시세', navSaved: '찜', navMine: '내 판매글',
    searchPh: '모델 검색 (예: 13 Pro)', searchAria: '휴대폰 검색', searchIcon: '검색',
    sellCta: '휴대폰 팔기', langSwitch: '언어 변경',
    footerBlurb: '중고 아이폰을 위한 투명한 마켓. 가격은 휴대폰 상태에 따라 자동으로 계산됩니다.',
    footerNav: '더 보기', footerPhones: '휴대폰', footerSell: '휴대폰 팔기', footerPrices: '시세표', footerSafety: '안전 거래', footerFaq: '자주 묻는 질문',
    footerNote: '가격은 판매자가 입력한 정보를 바탕으로 한 예상가이며, 직접 확인을 대신하지 않습니다.',
    tabsAria: '하단 메뉴', tabHome: '홈', tabPhones: '휴대폰', tabSell: '팔기', tabSaved: '찜', tabMine: '내 판매',

    // 홈
    eyebrow: '휴대폰 전문 · 투명한 가격',
    heroTitle: '내 폰 시세, ', heroHighlight: '1분 만에', heroTitleEnd: ' 확인하세요',
    lead: '모델을 고르고 상태 질문에 답하면 바로 가격이 나옵니다. 판매글 등록은 무료입니다.',
    heroPh: '예: 13 Pro', heroAria: '휴대폰 모델', heroBtn: '시세 확인', heroChipsAria: '시리즈 선택',
    heroAltText: '구매하시나요?', heroAltLink: (n) => `판매글 ${n}개 보기`,
    demoLabel: '예상 가격', demoFaceId: 'Face ID', demoWorks: '정상', demoScreen: '액정', demoNoScratches: '스크래치 없음', demoParts: '부품', demoOriginal: '정품',
    statsAria: '숫자로 보기', statListings: '판매 중인 글', statModels: '아이폰 모델', statFreeValue: '무료', statFree: '판매글 등록', statTimeValue: '~1분', statTime: '시세 확인',
    seriesTitle: '시리즈별 보기', latestTitle: '새 판매글', seeAll: '전체 보기',
    howTitle: '이용 방법', howCta: '내 폰 시세 확인',
    steps: [
      ['모델 선택', '아이폰 42개 모델, 모든 용량.'],
      ['상태 입력', '액정, 외관, 배터리, 고장 여부 등 간단한 질문.'],
      ['가격 확인', '가격과 모든 차감 내역을 한 줄씩 보여드립니다.'],
      ['판매글 등록', '사진을 올리면 구매자가 전화나 텔레그램으로 연락합니다.'],
    ],
    gradesTitle: '상태 등급', gradesSub: '모든 판매글에 같은 기준을 적용해 구매자가 무엇을 사는지 정확히 알 수 있습니다.',
    safetyTitle: '안전 거래',
    tips: [
      ['iCloud 확인', 'iCloud에서 로그아웃하지 않은 휴대폰은 등록할 수 없습니다.'],
      ['IMEI 등록 여부 표시', '우즈베키스탄에 등록된 휴대폰인지 판매글에 표시됩니다.'],
      ['사람 많은 곳에서 거래', '직접 손에 들고 확인한 뒤 결제하세요.'],
      ['선입금 금지', '“배송해 드릴 테니 먼저 입금하세요”가 가장 흔한 사기입니다.'],
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      ['가격은 어떻게 계산되나요?', '모델, 용량, 상태 등급(A, A−, B+, B)에 따른 시세에서 고장마다 정해진 금액을 차감합니다. 액정 파손, Face ID 불량, 부품 교체 등이 해당되며 계산 내역을 모두 보여드립니다.'],
      ['판매글 등록은 유료인가요?', '아니요. 시세 확인과 판매글 등록 모두 무료이며 회원가입도 필요 없습니다.'],
      ['왜 iCloud에서 로그아웃해야 하나요?', 'iCloud(나의 찾기)에 연결된 휴대폰은 새 주인이 사용할 수 없습니다. 도난폰 거래도 막을 수 있어 이런 휴대폰은 등록할 수 없습니다.'],
      ['배터리 성능은 어디서 확인하나요?', '설정 → 배터리 → 배터리 성능 상태 및 충전 → “최대 용량”의 숫자를 입력하세요.'],
      ['IMEI 등록이 왜 중요한가요?', '우즈베키스탄에서는 IMEI가 등록되지 않은 휴대폰이 현지 유심에서 차단됩니다. 구매자는 판매글에서 등록 여부를 확인할 수 있습니다.'],
      ['어떤 휴대폰을 팔 수 있나요?', 'iPhone 6부터 iPhone 17 Pro Max까지, SE 2와 SE 3를 포함한 모든 아이폰입니다. 삼성과 샤오미도 곧 추가됩니다.'],
    ],
    ctaTitle: '휴대폰을 파시겠어요?', ctaText: '시세 확인은 무료이며 가입이 필요 없습니다.', ctaBtn: '시작하기',

    // 목록
    allPhones: '전체 휴대폰', catSearchPh: '모델 (예: 14 Pro Max)', catSearchAria: '검색', filter: '필터', sortAria: '정렬',
    sorts: { new: '최신순', cheap: '낮은 가격순', expensive: '높은 가격순', battery: '배터리 좋은 순' },
    all: '전체', removeFilter: (t) => `필터 해제: ${t}`, clear: '초기화',
    filtersTitle: '필터', close: '닫기', model: '모델', allModels: '전체 모델', storage: '용량', condition: '상태',
    gradeOpts: { a: 'A · 최상, 매우 좋음', b: 'B · 좋음, 보통', c: 'C · 사용감 많음' },
    priceRange: '가격 (숨)', from: '최소', to: '최대', minAria: '최소 가격', maxAria: '최대 가격',
    chipFrom: (v) => `${v}숨 이상`, chipTo: (v) => `${v}숨 이하`, chipBattery: (b) => `배터리 ${b}% 이상`,
    battery: '배터리', batteryOpts: { '': '상관없음', 80: '80% 이상', 85: '85% 이상', 90: '90% 이상' },
    region: '지역', allRegions: '우즈베키스탄 전체', show: '결과 보기',
    pagesAria: '페이지', prev: '이전', next: '다음',
    emptyTitle: '검색 결과가 없습니다', emptyText: '필터를 줄이거나 다른 모델을 검색해 보세요.', emptyBtn: '필터 초기화',

    // 카드 + 찜
    save: '찜하기', unsave: '찜 해제', saved: '찜함', savedAdded: '찜 목록에 추가했습니다', savedRemoved: '찜 목록에서 삭제했습니다',

    // 판매글
    posted: '판매글이 등록되었습니다!', postedText: '친구에게 공유하거나 “내 판매글”에서 관리하세요.', share: '공유', linkCopied: '링크를 복사했습니다',
    soldNotice: '판매가 완료된 휴대폰입니다.',
    photosAria: '사진', photoAlt: (title, i) => `${title}, 사진 ${i}`, noPhotos: '판매자가 아직 사진을 올리지 않았습니다',
    systemEst: '시스템 예상가:', howCalc: '예상가 계산 내역', estTotal: '시스템 예상가',
    factCondition: '상태', factBattery: '배터리', unknown: '알 수 없음', factStorage: '용량', factColor: '색상', factSim: 'SIM',
    factImei: 'IMEI 등록', regYes: '등록됨', regNo: '미등록',
    reportTitle: '상태 리포트', reportNote: '판매자가 직접 작성했습니다. 만나서 직접 확인하세요.',
    basics: '기본 점검', looksTitle: '외관 및 액정', funcsTitle: '기능', partsTitle: '부품',
    faultsN: (n) => `고장 ${n}개`, allWork: '모두 정상',
    rowIcloud: 'iCloud', signedOut: '로그아웃됨', rowImei: 'IMEI', shown: '표시됨', notShown: '표시 안 됨',
    rowPowers: '전원', yes: '켜짐', no: '안 켜짐', rowRefurb: '리퍼/전시폰',
    rowScreen: '액정 표면', rowBody: '외관', rowBack: '후면 유리', rowLens: '카메라 렌즈', rowBent: '휨', rowGlass: '액정 유리', rowDisplay: '디스플레이',
    cantCheck: '확인 불가', deadPhone: '전원이 켜지지 않음', works: '정상', broken: '불량',
    descTitle: '설명', boxTitle: '구성품', phoneOnly: '본체만', views: (n) => `조회 ${n}회`,
    safeTitle: '안전한 구매',
    safeTips: ['사람이 많은 곳에서 만나 직접 확인하세요.', '*#06#으로 IMEI를 확인하고 박스의 번호와 비교하세요.', '설정에서 iCloud 로그아웃 여부를 확인하세요.', '절대 선입금하지 마세요.'],
    manage: '판매글 관리', reactivate: '판매 중으로 변경', markSold: '판매 완료로 표시', remove: '삭제',
    confirmDelete: '판매글을 완전히 삭제할까요?', error: '오류가 발생했습니다',
    call: '전화하기', telegram: '텔레그램으로 연락', telegramShort: '텔레그램', similar: '비슷한 판매글',
    metaDesc: (title, grade, battery, region, price) => `${title}, 상태 ${grade}${battery ? `, 배터리 ${battery}%` : ''}. ${region}. ${price}.`,

    // 판매
    sellTitle: '내 폰 시세 확인 및 판매', sellDesc: '아이폰 상태를 입력하고 바로 가격을 확인하세요. 무료 등록.', sellHeader: '휴대폰 팔기',
    stepNames: { model: '모델', config: '용량·색상', basic: '기본 점검', looks: '외관', screen: '액정·배터리', faults: '기능', parts: '부품', result: '가격', details: '판매글' },
    noscript: '가격을 확인하려면 JavaScript를 켜 주세요.',
    whichPhone: '어떤 아이폰을 파시나요?', modelSearchPh: '예: 13 Pro Max', modelSearchAria: '모델 검색',
    seriesFilterAria: '시리즈 필터', modelsAria: '모델', noModel: '해당 모델이 없습니다. 현재는 아이폰만 시세를 확인할 수 있습니다.',
    storageQ: '용량', colorQ: '색상', basicTitle: '기본 점검',
    icloudBlockTitle: 'iCloud에서 로그아웃해야 판매글을 올릴 수 있습니다.',
    icloudBlockText: '그렇지 않으면 새 주인이 휴대폰을 사용할 수 없습니다. 설정 → 내 이름 → 나의 찾기 → 나의 iPhone 찾기를 끈 뒤 다시 돌아오세요.',
    looksTitle2: '외관 상태', screenTitle: '액정과 배터리',
    batteryQ: '배터리 성능 (최대 용량)', batteryHint: '설정 → 배터리 → 배터리 성능 상태 → “최대 용량”.', batteryAria: '배터리 퍼센트',
    batteryHints: { great: '아주 좋음 — 가격에 영향이 없습니다.', good: '좋음. 90% 미만이라 가격이 조금 내려갑니다.', fair: '보통. 가격이 내려갑니다.', poor: '배터리 교체가 필요합니다 — 가격이 크게 내려갑니다.' },
    faultsTitle: '작동하지 않는 기능이 있나요?', faultsSub: '작동하지 않는 항목을 선택하세요. 모두 정상이면 그냥 계속하세요.',
    partsNote: '“정품 부품”: 수리 시 애플 정품 부품으로 교체한 경우. “알 수 없는 부품”: 아이폰에 “알 수 없는 부품” 메시지가 표시되는 경우.',
    detailsTitle: '판매글 정보', photos: '사진', photosUpTo: (n) => `(최대 ${n}장)`,
    photosHint: '앞면, 뒷면, 옆면과 배터리 성능 화면을 찍어 주세요. 사진이 있는 판매글이 더 빨리 팔립니다.', addPhoto: '사진 추가',
    askPrice: '판매 가격', choose: '선택하세요', name: '이름', namePh: '예: Jasur', phone: '전화번호',
    telegramLabel: '텔레그램', optional: '(선택)', inBox: '구성품은 무엇인가요?', desc: '설명',
    descPh: '예: 항상 케이스를 끼워 사용했고 수리 이력이 없습니다.',
    confirm: '“등록”을 누르면 입력한 정보가 사실임을 확인하는 것입니다.',
    summaryAria: '선택 내용', pickModel: '모델을 선택하세요', estPrice: '예상 가격',
    prevAria: '이전 단계', continue: '계속', postListing: '판매글 올리기', publish: '등록', publishing: '등록 중…',
    barModelPrice: (name) => `${name} 시세`, barIcloud: 'iCloud 로그인 상태', barNoPrice: '시세 산정 불가', barMax: '최대 가격',
    toastIcloud: '먼저 iCloud에서 로그아웃하세요', toastAnswer: '질문에 답해 주세요', toastFill: '항목을 입력해 주세요',
    resultRange: '협상 범위:', scrapDead: '전원이 켜지지 않아 부품용으로 산정되었습니다.',
    scrapImei: 'IMEI가 표시되지 않아 부품용으로 산정되었습니다.', floorNote: '고장이 많아 부품용 가격으로 표시됩니다.',
    resultNote: '입력하신 답변을 기준으로 계산한 가격입니다. 구매자가 직접 확인한 뒤 최종 가격이 달라질 수 있습니다.',
    changeAnswers: '답변 수정', total: '합계', quickAria: '빠른 선택', quickEst: '예상가',
    maxPhotos: (n) => `사진은 최대 ${n}장까지 올릴 수 있습니다`, badPhoto: '이 사진을 열 수 없습니다', mainPhoto: '대표', removePhoto: '사진 삭제',
    offline: '인터넷 연결이 없습니다. 다시 시도해 주세요.', saveFailed: '판매글을 저장하지 못했습니다',

    // 기타 페이지
    pricesTitle: '아이폰 시세', pricesDesc: '모든 모델과 용량별 중고 아이폰 시세(우즈베키스탄 숨). 최상 상태와 사용 상태 가격.',
    pricesH1: '중고 아이폰 시세', pricesSub: (date) => `최상(A) 상태와 사용 상태의 예상 가격(우즈베키스탄 숨). 업데이트: ${date}.`,
    pricesSearch: '모델 검색', colStorage: '용량', colIdeal: '최상', colUsed: '사용감', exact: '정확한 시세 확인',
    pricesNote: '“최상”: 스크래치 없음, 배터리 90% 이상. “사용감”: 등급과 관계없는 기본 시세. 정확한 가격은 고장과 부품 교체 여부에 따라 달라집니다.',
    noModelShort: '해당 모델이 없습니다.',
    savedTitle: '찜 목록', savedEmptyTitle: '찜한 휴대폰이 없습니다', savedEmptyText: '마음에 드는 휴대폰의 ♡를 누르면 여기에 저장됩니다.', browse: '휴대폰 보기', loading: '불러오는 중…',
    mineTitle: '내 판매글', mineSub: '이 기기에서 올린 판매글입니다. 열어서 관리하세요.',
    mineEmptyTitle: '아직 올린 판매글이 없습니다', mineEmptyText: '1분 만에 시세를 확인하고 무료로 판매글을 올리세요.',
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
    icloudOff: { title: 'iCloud(나의 찾기)에서 로그아웃했나요?', hint: '설정 → 내 이름 → 나의 찾기 → 나의 iPhone 찾기 → 끔.', opts: { yes: '네, 로그아웃했습니다', no: '아직 안 했습니다' } },
    refurbished: { title: '리퍼폰 또는 전시(데모)폰인가요?', opts: { no: '아니요', yes: '네' } },
    sim: { title: 'SIM 종류', hint: '미국에서 판매된 iPhone 14 이후 모델은 유심 트레이가 없습니다.', opts: { sim: '유심 + eSIM', esim: 'eSIM 전용 (미국판)' } },
    screen: {
      title: '액정 표면', hint: '화면을 끄고 빛에 비춰 보세요.',
      opts: { A: ['스크래치 없음', '새것처럼 흔적이 전혀 없음'], 'A-': ['아주 미세한 스크래치', '빛에 비춰 가까이 봐야 보임'], B: ['가벼운 스크래치', '그냥 봐도 보임'], C: ['깊거나 많은 스크래치', '손톱에 걸리는 스크래치'] },
    },
    body: {
      title: '외관 (프레임과 뒷면)',
      opts: { A: ['완벽', '스크래치와 찍힘 없음'], 'A-': ['미세한 스크래치', '찍힘 없음'], 'B+': ['작은 찍힘 1–2개', '모서리나 테두리'], B: ['찍힘 2–3개', '또는 눈에 띄는 스크래치 다수'], C: ['사용감 많음', '깊은 찍힘, 도색 벗겨짐'] },
    },
    backGlass: { title: '후면 유리', opts: { ok: '정상', cracked: '금 가거나 깨짐' } },
    lens: { title: '카메라 렌즈', opts: { ok: '깨끗하고 정상', scratched: '미세한 스크래치 있음', cracked: '깨짐 또는 내부 얼룩' } },
    bent: { title: '본체가 휘었거나 부풀었나요?', opts: { none: '아니요', light: '약간 휨', severe: '심하게 휘었거나 배터리 부풂' } },
    glass: { title: '액정 유리', opts: { ok: '정상', cracked: '금 가거나 깨짐' } },
    display: {
      title: '화면 상태는 어떤가요?', hint: '회색이나 흰색 배경을 띄워 확인하세요.',
      opts: { ok: ['완벽', '얼룩, 줄, 잔상 없음'], minor: ['약한 잔상 또는 변색', '번인 잔상이나 약간의 색 변화'], major: ['불량', '줄, 검은 점 또는 터치 불량'] },
    },
    uzimei: { title: '우즈베키스탄에 IMEI가 등록되어 있나요?', hint: '등록되지 않은 휴대폰은 현지 유심 사용이 차단됩니다.', opts: { yes: '네', no: '아니요', unknown: '모르겠어요' } },
  },

  faults: {
    biometric: { q: { face: 'Face ID가 작동하지 않음', touch: 'Touch ID 또는 홈 버튼이 작동하지 않음' }, s: { face: 'Face ID', touch: 'Touch ID' } },
    camera: { q: '카메라가 작동하지 않거나 초점이 안 맞음', s: '카메라' },
    wifi: { q: '와이파이, 블루투스, 나침반 또는 애플페이가 작동하지 않음', s: '와이파이, 블루투스, 애플페이' },
    mic: { q: '마이크 또는 녹음이 작동하지 않음', s: '마이크' },
    speaker: { q: '스피커가 작동하지 않음 (소리 안 남)', s: '스피커' },
    charging: { q: '충전이 되지 않음', s: '충전' },
    vibration: { q: '진동이 없음', s: '진동' },
    buttons: { q: '버튼이 작동하지 않음 (음량, 전원)', s: '버튼' },
    trueTone: { q: '트루톤이 작동하지 않음', s: '트루톤' },
    cameraButton: { q: '카메라 컨트롤 버튼 불량', s: '카메라 컨트롤' },
  },

  parts: {
    title: '교체된 부품', hint: '설정 → 일반 → 정보 → “부품 및 서비스 내역”을 확인하세요.',
    items: { screen: '액정', battery: '배터리', camera: '카메라' },
    opts: { none: '교체 안 함', genuine: '정품 부품', unknown: '알 수 없는 부품' },
  },
  extras: { box: '박스', cable: '케이블 / 충전기', receipt: '영수증 또는 서류' },
  verdict: { deal: '저렴한 가격', fair: '적정 가격', high: '시세보다 높음', sold: '판매 완료' },

  regions: {
    'tashkent-city': '타슈켄트시', 'tashkent-region': '타슈켄트주', andijan: '안디잔', bukhara: '부하라', fergana: '페르가나',
    jizzakh: '지자흐', khorezm: '호레즘', namangan: '나망간', navoi: '나보이', kashkadarya: '카슈카다리야',
    karakalpakstan: '카라칼팍스탄', samarkand: '사마르칸트', syrdarya: '시르다리야', surkhandarya: '수르한다리야',
  },

  colors: {
    black: '블랙', white: '화이트', red: '레드', silver: '실버', gold: '골드', gray: '스페이스 그레이', rose: '로즈 골드', jet: '제트 블랙',
    blue: '블루', yellow: '옐로', coral: '코랄', green: '그린', purple: '퍼플', midgreen: '미드나이트 그린', graphite: '그래파이트',
    pacific: '퍼시픽 블루', midnight: '미드나이트', starlight: '스타라이트', pink: '핑크', sierra: '시에라 블루', alpine: '알파인 그린',
    deeppurple: '딥 퍼플', spaceblack: '스페이스 블랙', natural: '내추럴 티타늄', bluetitan: '블루 티타늄', whitetitan: '화이트 티타늄',
    blacktitan: '블랙 티타늄', deserttitan: '데저트 티타늄', teal: '틸', ultramarine: '울트라마린', lavender: '라벤더', sage: '세이지',
    mistblue: '미스트 블루', cloud: '클라우드 화이트', lightgold: '라이트 골드', sky: '스카이 블루', orange: '코스믹 오렌지', deepblue: '딥 블루',
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
      case 'refurbished': return '리퍼/전시폰';
      case 'esim': return 'eSIM 전용 모델';
      default: return l.k;
    }
  },

  err: {
    notFound: '페이지를 찾을 수 없습니다', badRequest: '잘못된 요청입니다', tooLarge: '업로드 용량이 너무 큽니다. 사진 수를 줄여 주세요.',
    incomplete: '상태 질문에 모두 답해 주세요.', modelNotFound: '모델을 찾을 수 없습니다.', storage: '용량을 선택하세요.',
    icloud: 'iCloud에 로그인된 휴대폰은 판매할 수 없습니다.', price: '올바른 가격을 입력하세요.', region: '지역을 선택하세요.', name: '이름을 입력하세요.',
    phone: '전화번호를 모두 입력하세요: +998 XX XXX XX XX.', telegram: '텔레그램 사용자 이름이 올바르지 않습니다.',
    photoFormat: '지원하지 않는 사진 형식입니다.', photoSize: '사진 용량이 너무 큽니다.', photoBroken: '사진 파일이 손상되었습니다.',
    rate: '판매글이 너무 많습니다. 잠시 후 다시 시도하세요.', status: '잘못된 상태입니다.', forbidden: '이 판매글을 관리할 권한이 없습니다.',
    server: '서버 오류입니다. 잠시 후 다시 시도하세요.',
  },
};
