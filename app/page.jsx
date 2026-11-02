'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Search,
  Flame,
  Clock,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Send,
  Languages,
  X,
  Filter,
  Users,
  Radio,
  Award,
  CheckCircle2,
  Link as LinkIcon,
  RefreshCw,
  Lock,
  Trash2,
  ShieldAlert,
  LayoutTemplate
} from 'lucide-react';

// --- 1. 국가별 메타데이터 & 접속자 통계 (x7 부스트) ---
const COUNTRY_META = {
  KR: { flag: '🇰🇷', name_ko: '한국', name_en: 'Korea', region: 'KR', baseOnline: 133, baseDau: 2730 },
  US: { flag: '🇺🇸', name_ko: '미국', name_en: 'USA', region: 'US', baseOnline: 161, baseDau: 3430 },
  DE: { flag: '🇩🇪', name_ko: '독일', name_en: 'Germany', region: 'EU', baseOnline: 68, baseDau: 1260 },
  JP: { flag: '🇯🇵', name_ko: '일본', name_en: 'Japan', region: 'JP', baseOnline: 84, baseDau: 1610 },
  GB: { flag: '🇬🇧', name_ko: '영국', name_en: 'UK', region: 'EU', baseOnline: 49, baseDau: 910 },
  FR: { flag: '🇫🇷', name_ko: '프랑스', name_en: 'France', region: 'EU', baseOnline: 35, baseDau: 630 },
};

const PASSPORT_COUNTRIES = ['KR', 'US', 'DE', 'JP', 'GB', 'FR'];

const COUNTRY_TABS = [
  { code: 'ALL', label_ko: '🌏 전체 국가', label_en: '🌏 All Regions' },
  { code: 'KR', label_ko: '🇰🇷 한국', label_en: '🇰🇷 Korea' },
  { code: 'US', label_ko: '🇺🇸 미국', label_en: '🇺🇸 USA' },
  { code: 'JP', label_ko: '🇯🇵 일본', label_en: '🇯🇵 Japan' },
  { code: 'EU', label_ko: '🇪🇺 유럽', label_en: '🇪🇺 Europe' },
];

const CATEGORIES = [
  { slug: 'all', label_ko: '전체 주제', label_en: 'All Topics' },
  { slug: 'cross_border', label_ko: '📡 국경 돌파 급상승', label_en: '📡 Cross-Border Viral', radar: true },
  { slug: 'korea_trending_abroad', label_ko: '🔥 해외 화제 한국', label_en: '🔥 Korea Trending', highlight: true },
  { slug: 'korean_cars', label_ko: '🚗 한국 자동차', label_en: '🚗 Korean Cars' },
  { slug: 'korean_food', label_ko: '🍜 한국 음식', label_en: '🍜 Korean Food' },
  { slug: 'cultural_difference', label_ko: '🤝 문화 차이', label_en: '🤝 Culture Gap' },
  { slug: 'global_debate', label_ko: '⚖️ 글로벌 논쟁', label_en: '⚖️ Global Debate' },
];

const REACTION_META = {
  funny: { emoji: '😂', label_ko: '웃김', label_en: 'Funny' },
  empathy: { emoji: '❤️', label_ko: '공감', label_en: 'Empathy' },
  surprised: { emoji: '😮', label_ko: '놀라움', label_en: 'Surprised' },
  ambiguous: { emoji: '🤔', label_ko: '애매함', label_en: 'Mixed' },
  controversial: { emoji: '🌶️', label_ko: '논쟁적', label_en: 'Spicy' },
  angry: { emoji: '😡', label_ko: '화남', label_en: 'Angry' },
};

const LIVE_TICKER_ITEMS = {
  ko: [
    '📡 [국경돌파 KR➔DE] 독일 전기차 포럼에서 "한국 전기차 V2L 캠핑 활용기" 조회수 역주행 중',
    '🌡️ [온도차 배틀] "퇴근 후 상사 카톡 답장?" 🇩🇪 독일 반대 92% vs 🇰🇷 한국 찬반 팽팽',
    '📡 [국경돌파 KR➔US] 미국 X에서 "한국 편의점 얼음컵+파우치 음료" 120만 뷰 돌파',
    '🛂 [글로벌 여권] 방금 익명 유저(DE-77W)님이 5개국 공감 스탬프를 모두 모았습니다!'
  ],
  en: [
    '📡 [Cross-Border KR➔DE] "Korean EV V2L Camping Hack" surging on German EV forums',
    '🌡️ [Temp Battle] "Reply to boss after hours?" 🇩🇪 Germany 92% No vs 🇰🇷 Korea Split',
    '📡 [Cross-Border KR➔US] "Korean Convenience Store Ice Cup + Pouch" hits 1.2M views in US',
    '🛂 [Global Passport] Anon User (DE-77W) just unlocked 5-Country Empathy Stamps!'
  ]
};

// --- 2. 관리자 리프레시 시 새로 유입되는 해외 핫토픽 풀 ---
const FRESH_SCRAPED_HOT_PICKS = [
  {
    id: 'scraped-01',
    type: 'external',
    category: 'korea_trending_abroad',
    region_group: 'US',
    access_country: 'US',
    is_cross_border: true,
    cross_border_route: '🇰🇷 Seoul Cafe ➔ 🇺🇸 NY Viral (+410%)',
    source_name: 'Reddit · r/travel',
    source_url: 'https://www.reddit.com/r/travel',
    original_language: 'en',
    original_title: 'Why Seoul cafes have better interior design and theme concepts than anywhere else in the world',
    original_body: 'Visited Hongdae and Seongsu last week. Every single cafe is an immersive art exhibition with incredible bakery items. Western coffee shops feel so boring in comparison.',
    created_at: '방금 전 (자동 크롤링됨)',
    timestamp: Date.now(),
    upvotes: 412,
    keywords: ['성수동카페', '홍대개성', 'K카페', '인테리어'],
    translations: {
      ko: {
        title: '왜 서울의 카페들은 전 세계 어디보다 인테리어와 테마 컨셉이 독보적일까요?',
        body: '지난주 홍대와 성수동을 방문했습니다. 모든 카페가 놀라운 베이커리와 함께 몰입형 미술 전시회 수준이더군요. 비교해보면 서구권 카페들은 너무 단조롭습니다.',
        summary: [
          '미국 여행객이 서울 성수동 및 홍대 카페 거리의 독창적인 공간 디자인에 감탄함',
          '단순한 커피 판매를 넘어선 복합 문화 공간 형태의 K-카페 인프라가 글로벌 표준으로 부상',
          '해외 유저들 사이에서 서울 카페 투어가 필수 여행 코스로 자리 잡은 이유를 분석 중'
        ],
        why_trending: '시각적 경험을 중시하는 MZ세대의 여행 트렌드와 맞물려 서울의 공간 브랜딩이 주목받음.',
        cultural_context: '한국 카페들은 단순 음료 소비 공간이 아닌 인증샷과 감성을 공유하는 문화 플랫폼으로 진화했습니다.',
      },
      en: {
        title: 'Why Seoul cafes have better interior design and theme concepts than anywhere else in the world',
        body: 'Visited Hongdae and Seongsu last week. Every single cafe is an immersive art exhibition with incredible bakery items. Western coffee shops feel so boring in comparison.',
        summary: [
          'Traveler praises the immersive art-like interior designs of Seongsu and Hongdae cafes',
          'K-cafe culture transcends simple coffee, acting as lifestyle exhibition spaces',
          'Sparks discussion on why Seoul has become a global benchmark for cafe branding'
        ],
        why_trending: 'Visual-first experiential travel trends make Seoul’s cafe culture highly shareable globally.',
        cultural_context: 'Cafes in Korea serve as social hubs and aesthetic destinations rather than quick pit-stops.',
      }
    },
    reactions: { empathy: 182, surprised: 94, funny: 31, controversial: 8, ambiguous: 5, angry: 1 },
    country_breakdown: [
      { country: 'US', total: 150, top: [{ type: 'empathy', pct: 70 }, { type: 'surprised', pct: 20 }] },
      { country: 'KR', total: 110, top: [{ type: 'funny', pct: 50 }, { type: 'empathy', pct: 40 }] }
    ],
    comments: [
      {
        id: 'sc-1',
        anonymous_id: 'Anon · US-77X',
        access_country: 'US',
        original_language: 'en',
        original_text: 'The themed cafes in Seongsu ruined regular coffee shops for me back home.',
        translated_ko: '성수동 테마 카페들을 다녀온 뒤로 고향에 있는 일반 카페들은 눈에 들어오지도 않습니다.',
        translated_en: 'The themed cafes in Seongsu ruined regular coffee shops for me back home.',
        upvotes: 45,
        is_best: true,
        folded: false
      }
    ]
  }
];

// --- 3. 글로벌 온도차 배틀 초기 데이터 ---
const INITIAL_BATTLE = {
  id: 'battle-01',
  question_ko: '퇴근 후 저녁 8시, 직장 상사에게 온 가벼운 업무 확인 메시지에 바로 답장해야 할까요?',
  question_en: 'At 8 PM after work, your boss sends a quick check-in message. Should you reply immediately?',
  optionA_ko: '👍 예의상 짧게라도 바로 답장한다',
  optionA_en: '👍 Reply briefly right away',
  optionB_ko: '🛑 내일 출근해서 답장해도 전혀 문제없다',
  optionB_en: '🛑 Wait until tomorrow morning',
  totalVotes: 1842,
  overallA: 34,
  overallB: 66,
  countries: [
    { code: 'DE', pctA: 9, pctB: 91, note_ko: '퇴근 후 연락 금지(Feierabend) 문화 확고', note_en: 'Strict Feierabend boundary' },
    { code: 'US', pctA: 42, pctB: 58, note_ko: '직군별 차이 크나 빅테크·금융권은 답장파 다수', note_en: 'Divided; tech/finance leans toward replying' },
    { code: 'KR', pctA: 54, pctB: 46, note_ko: '"읽씹은 부담스럽다" vs "워라밸 지켜야" 팽팽', note_en: 'Heated debate between etiquette & balance' },
    { code: 'JP', pctA: 49, pctB: 51, note_ko: '젊은 세대 중심으로 내일 답장 비율 급증 추세', note_en: 'Younger generation shifting to Option B' },
  ]
};

const UI_TEXT = {
  ko: {
    siteTitle: 'Commonworld',
    sloganPrimary: '읽는 언어는 달라도, 대화는 하나로.',
    livePulseTitle: '실시간 글로벌 접속자 현황',
    onlineNow: '현재 동접',
    dailyVisitors: '오늘 누적(DAU)',
    passportTitle: '내 글로벌 여권 (도장 깨기)',
    stampCollected: '개국 정복',
    stampToast: '스탬프 획득! 글로벌 여권에 새 국가 도장이 찍혔습니다.',
    battleBadge: '🌡️ 오늘의 글로벌 온도차 배틀',
    battleSub: '투표 즉시 국가별 극과 극 민심 그래프가 실시간으로 반영됩니다.',
    votedNotice: '투표 완료! 아래에서 국가별 온도차를 비교해 보세요.',
    radarBadge: '🚀 국경 돌파 시그널',
    searchPlaceholder: '화제글, 키워드, 국가 검색...',
    sortPopular: '인기순',
    sortLatest: '최신순',
    newPostBtn: '새 글 등록 (1초 링크 큐레이션)',
    autoTranslatedBadge: 'AI 자동번역',
    externalPostBadge: '외부 큐레이션',
    nativePostBadge: '자체 게시글',
    openSmartPreview: 'Smart Preview & 상세 반응',
    closeSmartPreview: '접기',
    showOriginalText: '원문 보기',
    showTranslatedText: '번역본 보기',
    summaryTitle: '⚡ 3줄 핵심 요약',
    whyTrendingTitle: '🔥 왜 지금 화제인가요?',
    culturalContextTitle: '💡 문화적 맥락 & 현지 표현 해설',
    embedCardTitle: '🔗 원문 출처 임베드 카드 (Embedded Source View)',
    allCommentsTitle: '💬 실시간 다국어 댓글',
    commentPlaceholder: '내 언어로 댓글을 남겨보세요. 전 세계 유저에게 자동 번역됩니다...',
    submitBtn: '등록',
    privacyFooter: '개인정보 보호 원칙: Commonworld는 원본 IP를 저장하지 않으며 익명 해시만 사용합니다.',
    modalTitle: '새 글로벌 토픽 등록 (URL 자동 완성)',
    modalDesc: '해외 커뮤니티나 뉴스 링크만 붙여넣으시면 제목, 본문, AI 번역, 3줄 요약이 1초 만에 완성됩니다.',
    urlInputLabel: '해외 게시글 또는 뉴스 URL 붙여넣기',
    urlInputPlaceholder: 'https://www.reddit.com/r/...',
    autoAnalyzeBtn: '⚡ 1초 원문 분석 및 자동 완성',
    modalCancel: '취소',
    modalCreate: '토픽 발행하기',
  },
  en: {
    siteTitle: 'Commonworld',
    sloganPrimary: 'Different languages to read, one conversation to share.',
    livePulseTitle: 'Live Global Traffic Pulse',
    onlineNow: 'Online Now',
    dailyVisitors: 'Daily Active (DAU)',
    passportTitle: 'My Global Passport (Stamp Quest)',
    stampCollected: 'Countries Unlocked',
    stampToast: 'New Stamp Unlocked! Added to your Global Passport.',
    battleBadge: '🌡️ Global Temperature Battle',
    battleSub: 'Vote to compare how different countries clash on the exact same issue.',
    votedNotice: 'Vote recorded! Check the regional mindset gap below.',
    radarBadge: '🚀 Cross-Border Signal',
    searchPlaceholder: 'Search topics, keywords, regions...',
    sortPopular: 'Popular',
    sortLatest: 'Latest',
    newPostBtn: 'New Post (1-Click Link)',
    autoTranslatedBadge: 'AI Translated',
    externalPostBadge: 'Curated',
    nativePostBadge: 'Original',
    openSmartPreview: 'Smart Preview & Reactions',
    closeSmartPreview: 'Collapse',
    showOriginalText: 'Show Original',
    showTranslatedText: 'Show Translation',
    summaryTitle: '⚡ 3-Line Executive Summary',
    whyTrendingTitle: '🔥 Why is this trending?',
    culturalContextTitle: '💡 Cultural Context & Nuance',
    embedCardTitle: '🔗 Embedded Source View',
    allCommentsTitle: '💬 Live Cross-Language Comments',
    commentPlaceholder: 'Write in your language. Auto-translated for global readers...',
    submitBtn: 'Post',
    privacyFooter: 'Privacy First: Commonworld never stores raw IPs and uses ephemeral daily salts.',
    modalTitle: 'Create Global Topic (Auto-URL Curation)',
    modalDesc: 'Paste any foreign community or news link to instantly auto-fill title, body, and AI translation.',
    urlInputLabel: 'Paste External Post or News URL',
    urlInputPlaceholder: 'https://www.reddit.com/r/...',
    autoAnalyzeBtn: '⚡ Instant URL Analysis & Auto-Fill',
    modalCancel: 'Cancel',
    modalCreate: 'Publish Topic',
  }
};

function formatCountryLabel(code, lang) {
  const meta = COUNTRY_META[code] || { flag: '🌐', name_ko: '글로벌', name_en: 'Global' };
  return lang === 'ko'
    ? `${meta.flag} ${meta.name_ko}에서 작성`
    : `${meta.flag} Posted from ${meta.name_en}`;
}

const INITIAL_POSTS = [
  {
    id: 'post-101',
    type: 'external',
    category: 'korean_cars',
    region_group: 'EU',
    access_country: 'DE',
    is_cross_border: true,
    cross_border_route: '🇰🇷 KR Tech ➔ 🇩🇪 EU Surge (+340%)',
    source_name: 'Reddit · r/Elektroautos',
    source_url: 'https://www.reddit.com',
    original_language: 'de',
    original_title: 'Stromausfall beim Camping im Schwarzwald: V2L am koreanischen E-Auto hat unser Wochenende gerettet',
    original_body: 'Letztes Wochenende hatten wir auf dem Campingplatz einen kompletten Stromausfall. Dank V2L-Adapter (3,6 kW) konnten wir Kaffeemaschine, Kühlschrank und sogar den Elektrogrill der Nachbarn problemlos stundenlang weiterbetreiben. Der Akku hat kaum 8% verloren.',
    created_at: '2시간 전',
    timestamp: 1730550000,
    upvotes: 318,
    keywords: ['V2L', '전기차', '독일캠핑', '아웃도어'],
    translations: {
      ko: {
        title: '독일 블랙포레스트 캠핑장 정전 사태 때 한국 전기차 V2L 기능으로 주말을 구한 후기',
        body: '지난 주말 캠핑장 전체에 정전이 발생했습니다. 다행히 차량의 V2L 어댑터(3.6kW 출력)를 연결해 커피머신, 냉장고는 물론 옆 텐트 이웃의 전기그릴까지 몇 시간 동안 아무 문제 없이 가동했습니다. 배터리는 고작 8%밖에 줄지 않았네요.',
        summary: [
          '독일 캠핑장 정전 상황에서 한국 전기차의 3.6kW V2L 기능을 비상 발전기처럼 활용함',
          '커피머신·냉장고·전기그릴 등 고출력 가전을 동시 가동하고도 배터리 소모는 8%에 불과',
          '유럽 현지 네티즌들 사이에서 실용적인 무소음 아웃도어 전력 솔루션으로 큰 호평을 받음'
        ],
        why_trending: '유럽 내 캠핑 문화 확산과 맞물려 별도 파워뱅크 없이 일반 220V 가전을 바로 꽂아 쓰는 고출력 V2L의 실사용 가치가 화제가 됨.',
        cultural_context: '독일 캠핑장은 소음 규제가 엄격해 가솔린 발전기 사용이 불가능한 곳이 많습니다. 무소음 전력 공급이 가능한 전기차 V2L이 현지에서 특히 극찬받는 이유입니다.',
      },
      en: {
        title: 'Power outage while camping in the Black Forest: Korean EV V2L saved our weekend',
        body: 'Last weekend our campsite had a complete blackout. Thanks to the 3.6kW V2L adapter, we ran our coffee maker, fridge, and even our neighbor’s electric grill for hours. The battery barely dropped 8%.',
        summary: [
          'Used a Korean EV’s 3.6kW V2L adapter during a German campsite blackout',
          'Powered high-wattage appliances (fridge, coffee machine, grill) using only 8% battery',
          'Praised across European EV forums as a game-changer for quiet outdoor living'
        ],
        why_trending: 'Highlights real-world utility of bi-directional high-output charging in European outdoor culture.',
        cultural_context: 'German campsites strictly regulate noise, making gas generators taboo. Silent high-wattage V2L power fits local etiquette perfectly.',
      }
    },
    reactions: { empathy: 154, surprised: 98, funny: 29, controversial: 12, ambiguous: 8, angry: 3 },
    country_breakdown: [
      { country: 'DE', total: 132, top: [{ type: 'empathy', pct: 61 }, { type: 'surprised', pct: 29 }] },
      { country: 'KR', total: 108, top: [{ type: 'empathy', pct: 68 }, { type: 'funny', pct: 18 }] },
      { country: 'US', total: 64, top: [{ type: 'surprised', pct: 55 }, { type: 'empathy', pct: 32 }] }
    ],
    comments: [
      {
        id: 'c-1',
        anonymous_id: 'Anon · DE-4K2',
        access_country: 'DE',
        original_language: 'de',
        original_text: 'Der V2L-Adapter ist im Sommer absolut genial für den Elektrogrill und kalte Getränke!',
        translated_ko: 'V2L 어댑터는 여름철 캠핑에서 전기그릴이랑 시원한 음료 유지하는 데 진짜 최고입니다!',
        translated_en: 'The V2L adapter is an absolute game-changer in summer for electric grills and cold drinks!',
        upvotes: 52,
        is_best: true,
        folded: false
      }
    ]
  }
];

export default function CommonworldApp() {
  const [lang, setLang] = useState('ko');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // 접속자 현황판 상태 (x7 부스트)
  const [liveStats, setLiveStats] = useState(() => {
    const initial = {};
    Object.keys(COUNTRY_META).forEach((code) => {
      initial[code] = {
        online: COUNTRY_META[code].baseOnline,
        dau: COUNTRY_META[code].baseDau,
      };
    });
    return initial;
  });

  const [tickerIndex, setTickerIndex] = useState(0);

  // VS 배틀 투표 상태
  const [battle, setBattle] = useState(INITIAL_BATTLE);
  const [userVote, setUserVote] = useState(null);

  // 글로벌 여권 스탬프 상태
  const [stamps, setStamps] = useState(['KR', 'DE']);
  const [stampAlert, setStampAlert] = useState(null);

  // 카드 확장 및 댓글 입력 상태
  const [expandedPostIds, setExpandedPostIds] = useState({ 'post-101': true });
  const [showOriginalIds, setShowOriginalIds] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // 새 글 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostSource, setNewPostSource] = useState('Reddit · r/europe');
  const [newPostCountry, setNewPostCountry] = useState('DE');
  const [newPostCategory, setNewPostCategory] = useState('korea_trending_abroad');

  // Admin 관리자 모드 상태
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminNotice, setAdminNotice] = useState(null);

  const t = UI_TEXT[lang];

  useEffect(() => {
    const statInterval = setInterval(() => {
      setLiveStats((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((code) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          next[code] = {
            online: Math.max(20, next[code].online + delta),
            dau: next[code].dau + (delta > 0 ? delta : 0),
          };
        });
        return next;
      });
    }, 3500);

    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.ko.length);
    }, 4500);

    return () => {
      clearInterval(statInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const totalTraffic = useMemo(() => {
    return Object.values(liveStats).reduce(
      (acc, cur) => ({
        online: acc.online + cur.online,
        dau: acc.dau + cur.dau,
      }),
      { online: 0, dau: 0 }
    );
  }, [liveStats]);

  const unlockStamp = (countryCode) => {
    if (!PASSPORT_COUNTRIES.includes(countryCode)) return;
    if (!stamps.includes(countryCode)) {
      setStamps((prev) => [...prev, countryCode]);
      const meta = COUNTRY_META[countryCode];
      setStampAlert(`${meta.flag} ${lang === 'ko' ? meta.name_ko : meta.name_en}`);
      setTimeout(() => setStampAlert(null), 3500);
    }
  };

  const handleBattleVote = (choice) => {
    if (userVote) return;
    setUserVote(choice);
    setBattle((prev) => ({ ...prev, totalVotes: prev.totalVotes + 1 }));
    if (!stamps.includes('US')) unlockStamp('US');
  };

  // URL 자동 분석 핸들러
  const handleAutoAnalyzeUrl = (targetUrl) => {
    const urlToUse = targetUrl || inputUrl;
    if (!urlToUse.trim()) return;

    setNewPostTitle(
      lang === 'ko'
        ? '🔗 [자동 파싱됨] 해외 소셜 미디어나 뉴스에서 수집된 실시간 화제 토픽'
        : '🔗 [Auto-Parsed] Real-time trending topic scraped from global source'
    );
    setNewPostBody(
      lang === 'ko'
        ? `입력하신 링크(${urlToUse})의 원문 메타데이터와 본문을 시스템이 자동 추출하여 AI 번역 및 요약 완료했습니다.`
        : `System automatically extracted metadata, translated, and summarized content from (${urlToUse}).`
    );
    setNewPostSource('External Community · Web');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    unlockStamp(newPostCountry);

    const createdPost = {
      id: `post-${Date.now()}`,
      type: 'external',
      category: newPostCategory,
      region_group: COUNTRY_META[newPostCountry]?.region || 'OTHER',
      access_country: newPostCountry,
      is_cross_border: true,
      cross_border_route: `${COUNTRY_META[newPostCountry]?.flag || '🌐'} ${newPostCountry} ➔ 🌏 Global Live`,
      source_name: newPostSource,
      source_url: inputUrl || 'https://commonworld.vercel.app',
      original_language: lang,
      original_title: newPostTitle,
      original_body: newPostBody,
      created_at: lang === 'ko' ? '방금 전' : 'Just now',
      timestamp: Date.now(),
      upvotes: 1,
      keywords: ['1초큐레이션', '실시간링크'],
      translations: {
        ko: {
          title: newPostTitle,
          body: newPostBody,
          summary: [
            newPostBody.slice(0, 60) + '...',
            '링크 자동 파싱 시스템을 통해 1초 만에 등록된 글로벌 토픽입니다.',
            '온디맨드 AI 번역 및 국가별 반응 집계가 시작되었습니다.'
          ],
          why_trending: '링크 입력 즉시 실시간으로 트렌드가 반영된 신규 큐레이션 주제입니다.',
          cultural_context: '다양한 국가의 유저들이 각자의 현지 시각을 댓글로 공유할 수 있습니다.',
        },
        en: {
          title: newPostTitle,
          body: newPostBody,
          summary: [
            newPostBody.slice(0, 60) + '...',
            'Global topic curated instantly via 1-click URL auto-parsing.',
            'On-demand AI translation and regional reaction tracking initiated.'
          ],
          why_trending: 'Freshly published topic via automated feed curation.',
          cultural_context: 'Readers across regions can share local perspectives below.',
        }
      },
      reactions: { empathy: 1, surprised: 0, funny: 0, controversial: 0, ambiguous: 0, angry: 0 },
      country_breakdown: [
        { country: newPostCountry, total: 1, top: [{ type: 'empathy', pct: 100 }] }
      ],
      comments: []
    };

    setPosts([createdPost, ...posts]);
    setExpandedPostIds((prev) => ({ ...prev, [createdPost.id]: true }));
    setInputUrl('');
    setNewPostTitle('');
    setNewPostBody('');
    setIsModalOpen(false);
  };

  // --- Admin 관리자 기능 핸들러 ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin0129') {
      setIsAdminLoggedIn(true);
      setIsAdminModalOpen(false);
      setAdminPasswordInput('');
      setAdminNotice('관리자(Admin) 권한으로 로그인되었습니다. 핫토픽 즉시 리프레시 및 글/댓글 삭제가 가능합니다.');
      setTimeout(() => setAdminNotice(null), 4000);
    } else {
      alert('비밀번호가 올바르지 않습니다. (admin0129)');
    }
  };

  const handleAdminRefreshHotPicks = () => {
    if (!isAdminLoggedIn) return;
    setPosts((prev) => [FRESH_SCRAPED_HOT_PICKS[0], ...prev]);
    setAdminNotice('🔄 해외 커뮤니티(Reddit 등) 최신 핫토픽을 성공적으로 크롤링 및 AI 축약하여 피드 상단에 주입했습니다!');
    setTimeout(() => setAdminNotice(null), 5000);
  };

  const handleDeletePost = (postId) => {
    if (!isAdminLoggedIn) return;
    if (confirm('정말 이 글로벌 게시글을 삭제하시겠습니까?')) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!isAdminLoggedIn) return;
    if (confirm('이 다국어 댓글을 삭제하시겠습니까?')) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
            : p
        )
      );
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedCountry !== 'ALL') {
        if (selectedCountry === 'EU' && post.region_group !== 'EU') return false;
        if (selectedCountry !== 'EU' && post.access_country !== selectedCountry) return false;
      }
      if (selectedCategory === 'cross_border') {
        if (!post.is_cross_border) return false;
      } else if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const trans = post.translations[lang];
        return trans.title.toLowerCase().includes(q) || post.keywords.some((k) => k.toLowerCase().includes(q));
      }
      return true;
    }).sort((a, b) => (sortBy === 'popular' ? b.upvotes - a.upvotes : b.timestamp - a.timestamp));
  }, [posts, selectedCountry, selectedCategory, searchQuery, sortBy, lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {adminNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-sky-500/50 bg-slate-900/95 px-4 py-3 text-xs font-bold text-sky-300 shadow-2xl">
          <ShieldAlert className="h-4 w-4 text-sky-400 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {stampAlert && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-400/50 bg-slate-900/95 px-4 py-3 text-xs font-bold text-amber-300 shadow-2xl animate-bounce">
          <Award className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-white">{stampAlert}</div>
            <div className="text-[11px] text-amber-300/90">{t.stampToast}</div>
          </div>
        </div>
      )}

      {/* 상단 티커 */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-sky-500/20 px-4 py-2 text-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-extrabold text-rose-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              LIVE
            </span>
            <p className="truncate text-slate-200 font-medium">{LIVE_TICKER_ITEMS[lang][tickerIndex]}</p>
          </div>
        </div>
      </div>

      {/* 모바일 상단 동접자 현황판 & 여권 바 */}
      <section className="border-b border-slate-800/80 bg-slate-900/50 px-4 py-3">
        <div className="max-w-5xl mx-auto space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">{t.livePulseTitle}</span>
              <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                ● {t.onlineNow} {totalTraffic.online.toLocaleString()}명
              </span>
              <span className="rounded-md bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[11px] font-bold text-sky-300">
                {t.dailyVisitors} {totalTraffic.dau.toLocaleString()}명
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1">
              <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-amber-200">{t.passportTitle}:</span>
              <div className="flex items-center gap-1">
                {PASSPORT_COUNTRIES.map((code) => {
                  const unlocked = stamps.includes(code);
                  return (
                    <span key={code} className={`text-sm ${unlocked ? 'opacity-100 scale-105' : 'opacity-25 grayscale'}`}>
                      {COUNTRY_META[code].flag}
                    </span>
                  );
                })}
              </div>
              <span className="text-[10px] font-extrabold text-amber-300 ml-1">
                ({stamps.length}/{PASSPORT_COUNTRIES.length} {t.stampCollected})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(COUNTRY_META).map(([code, meta]) => {
              const stat = liveStats[code] || { online: meta.baseOnline, dau: meta.baseDau };
              const isSelected = selectedCountry === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCountry(isSelected ? 'ALL' : code)}
                  className={`flex flex-col justify-between rounded-xl border p-2 text-left transition ${
                    isSelected ? 'border-sky-400 bg-sky-500/15' : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-200">
                      {meta.flag} {lang === 'ko' ? meta.name_ko : meta.name_en}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="mt-1 flex items-baseline justify-between w-full text-[11px]">
                    <span className="font-extrabold text-emerald-400">{stat.online}명</span>
                    <span className="text-[10px] text-slate-400">DAU {(stat.dau / 1000).toFixed(1)}k</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 shadow-lg">
              <Globe className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold text-white">{t.siteTitle}</h1>
                <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                  GLOBAL LIVE
                </span>
                {isAdminLoggedIn && (
                  <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-extrabold text-rose-400">
                    ADMIN MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{t.sloganPrimary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleAdminRefreshHotPicks}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 shadow-md animate-pulse"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>핫토픽 즉시 리프레시</span>
              </button>
            )}

            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-sky-400"
            >
              <Languages className="h-4 w-4 text-sky-400" />
              <span>{lang === 'ko' ? 'English' : '한국어'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.newPostBtn}</span>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {COUNTRY_TABS.map((tab) => {
              const active = selectedCountry === tab.code;
              return (
                <button
                  key={tab.code}
                  onClick={() => setSelectedCountry(tab.code)}
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    active ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ko' ? tab.label_ko : tab.label_en}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-0.5">
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                  sortBy === 'popular' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>{t.sortPopular}</span>
              </button>
              <button
                onClick={() => setSortBy('latest')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                  sortBy === 'latest' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{t.sortLatest}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 본문 */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
        {/* 글로벌 온도차 배틀 */}
        <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/20 border border-indigo-400/40 px-2.5 py-1 text-xs font-extrabold text-indigo-300">
                {t.battleBadge}
              </span>
              <span className="text-xs text-slate-400">{t.battleSub}</span>
            </div>
            <span className="text-xs font-bold text-indigo-300">🔥 {battle.totalVotes.toLocaleString()}명 참여 중</span>
          </div>

          <h2 className="text-base md:text-lg font-extrabold text-white leading-snug">
            Q. {lang === 'ko' ? battle.question_ko : battle.question_en}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleBattleVote('A')}
              className={`rounded-xl border p-3.5 text-left transition flex items-center justify-between ${
                userVote === 'A' ? 'border-sky-400 bg-sky-500/20 text-white' : 'border-slate-800 bg-slate-950/80 text-slate-200'
              }`}
            >
              <span className="text-xs md:text-sm font-bold">{lang === 'ko' ? battle.optionA_ko : battle.optionA_en}</span>
              <span className="text-sm font-extrabold text-sky-400">{battle.overallA}%</span>
            </button>

            <button
              onClick={() => handleBattleVote('B')}
              className={`rounded-xl border p-3.5 text-left transition flex items-center justify-between ${
                userVote === 'B' ? 'border-rose-400 bg-rose-500/20 text-white' : 'border-slate-800 bg-slate-950/80 text-slate-200'
              }`}
            >
              <span className="text-xs md:text-sm font-bold">{lang === 'ko' ? battle.optionB_ko : battle.optionB_en}</span>
              <span className="text-sm font-extrabold text-rose-400">{battle.overallB}%</span>
            </button>
          </div>

          {userVote && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.votedNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {battle.countries.map((c) => {
              const meta = COUNTRY_META[c.code];
              return (
                <div key={c.code} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{meta.flag} {lang === 'ko' ? meta.name_ko : meta.name_en}</span>
                    <span className="text-[11px] text-slate-400">👍 {c.pctA}% vs 🛑 {c.pctB}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${c.pctA}%` }} className="bg-sky-400 h-full" />
                    <div style={{ width: `${c.pctB}%` }} className="bg-rose-500 h-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{lang === 'ko' ? c.note_ko : c.note_en}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 카테고리 필터 칩 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                  active
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                    : cat.radar
                    ? 'border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-300'
                    : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'ko' ? cat.label_ko : cat.label_en}
              </button>
            );
          })}
        </div>

        {/* 게시글 피드 목록 */}
        <div className="space-y-5">
          {filteredPosts.map((post) => {
            const trans = post.translations[lang];
            const isExpanded = !!expandedPostIds[post.id];
            const showOriginal = !!showOriginalIds[post.id];

            return (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 md:p-6 space-y-4 shadow-lg relative ${
                  post.is_cross_border ? 'border-fuchsia-500/35 bg-slate-900/75' : 'border-slate-800/90 bg-slate-900/60'
                }`}
              >
                {/* 관리자 전용 게시글 삭제 버튼 */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-500/30"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>글 삭제 (Admin)</span>
                  </button>
                )}

                {post.is_cross_border && (
                  <div className="flex items-center justify-between rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-fuchsia-300">
                      <Radio className="h-4 w-4 text-fuchsia-400 animate-pulse" />
                      <span>{t.radarBadge}:</span>
                      <span className="text-white">{post.cross_border_route}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 font-semibold">
                      {t.externalPostBadge}
                    </span>
                    <span className="rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-sky-400 font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {t.autoTranslatedBadge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-medium text-slate-300">{formatCountryLabel(post.access_country, lang)}</span>
                    <span>·</span>
                    <span>{post.created_at}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {showOriginal ? post.original_title : trans.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {showOriginal ? post.original_body : trans.body}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.entries(REACTION_META).map(([key, meta]) => (
                      <button
                        key={key}
                        onClick={() => {
                          unlockStamp(post.access_country);
                          setPosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id
                                ? { ...p, reactions: { ...p.reactions, [key]: (p.reactions[key] || 0) + 1 } }
                                : p
                            )
                          );
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs hover:bg-slate-900"
                      >
                        <span>{meta.emoji}</span>
                        <span className="font-bold text-slate-200">{post.reactions[key] || 0}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedPostIds((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 px-3.5 py-2 text-xs font-bold text-sky-300"
                  >
                    <span>{isExpanded ? t.closeSmartPreview : t.openSmartPreview}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-slate-800 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-sky-400">{t.summaryTitle}</h4>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                          {trans.summary.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-amber-400">{t.whyTrendingTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{trans.why_trending}</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400">{t.culturalContextTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{trans.cultural_context}</p>
                      </div>
                    </div>

                    {/* ★ 원문 출처 임베드(Embed) 카드 스타일 삽입 영역 */}
                    {post.source_url && (
                      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/90 p-4 space-y-3 shadow-inner">
                        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <LayoutTemplate className="h-4 w-4 text-sky-400" />
                            {t.embedCardTitle}
                          </span>
                          <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800">
                            {post.source_name}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-white leading-snug">
                              {post.original_title}
                            </h5>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {post.original_body}
                            </p>
                          </div>
                          <a
                            href={post.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 shrink-0 transition"
                          >
                            <span>원문 보기</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* 실시간 댓글 영역 및 관리자 댓글 삭제 */}
                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <h4 className="text-xs font-bold text-white">실시간 댓글</h4>
                      {post.comments.map((cmt) => (
                        <div key={cmt.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-300">{cmt.anonymous_id}: </span>
                            <span className="text-slate-200">{lang === 'ko' ? cmt.translated_ko : cmt.translated_en}</span>
                          </div>
                          {isAdminLoggedIn && (
                            <button
                              onClick={() => handleDeleteComment(post.id, cmt.id)}
                              className="text-rose-400 hover:text-rose-300 text-[11px] font-bold flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> 삭제
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>

      {/* 푸터 (조그마한 Admin 메뉴 포함) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{t.privacyFooter}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Commonworld</span>
            {!isAdminLoggedIn ? (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition"
              >
                <Lock className="h-3 w-3" /> Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  setAdminNotice('관리자 모드가 해제되었습니다.');
                  setTimeout(() => setAdminNotice(null), 3000);
                }}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold transition"
              >
                <Lock className="h-3 w-3" /> 관리자 로그아웃
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Admin 로그인 모달 */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-sky-400" /> 관리자(Admin) 로그인
              </h3>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">관리자 비밀번호</label>
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="admin0129"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-slate-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-4 py-1.5 font-bold text-slate-950 hover:bg-sky-400"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 새 글 작성 모달 (1초 링크 큐레이션) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{t.modalTitle}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{t.modalDesc}</p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-sky-400">{t.urlInputLabel}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder={t.urlInputPlaceholder}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoAnalyzeUrl(inputUrl)}
                  className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 shrink-0 shadow-md"
                >
                  {t.autoAnalyzeBtn}
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">카테고리</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  >
                    {CATEGORIES.filter((c) => c.slug !== 'all' && c.slug !== 'cross_border').map((c) => (
                      <option key={c.slug} value={c.slug}>{lang === 'ko' ? c.label_ko : c.label_en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">접속 국가 표시</label>
                  <select
                    value={newPostCountry}
                    onChange={(e) => setNewPostCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  >
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="KR">🇰🇷 Korea</option>
                    <option value="US">🇺🇸 USA</option>
                    <option value="JP">🇯🇵 Japan</option>
                    <option value="GB">🇬🇧 UK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">자동 완성된 제목</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">자동 파싱 및 AI 요약 본문</label>
                <textarea
                  rows={4}
                  required
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-5 py-2 font-bold text-slate-950 hover:bg-sky-400"
                >
                  {t.modalCreate}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
