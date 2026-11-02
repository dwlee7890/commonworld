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
  Zap,
  CheckCircle2
} from 'lucide-react';

// --- 1. 국가별 메타데이터 & 초기 접속자 통계 (x7 부스트 적용) ---
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

// --- 2. 글로벌 온도차 배틀 (VS 투표) 초기 데이터 ---
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
    { code: 'DE', pctA: 9, pctB: 91, note_ko: '퇴근 후 연락 금지(Feierabend) 문화 확고', note_en: 'Strict Feierabend (off-work) boundary' },
    { code: 'US', pctA: 42, pctB: 58, note_ko: '직군별 차이 크나 빅테크·금융권은 답장파 다수', note_en: 'Divided; tech/finance leans toward replying' },
    { code: 'KR', pctA: 54, pctB: 46, note_ko: '"읽씹은 부담스럽다" vs "워라밸 지켜야" 팽팽', note_en: 'Heated debate between etiquette & work-life balance' },
    { code: 'JP', pctA: 49, pctB: 51, note_ko: '젊은 세대 중심으로 내일 답장 비율 급증 추세', note_en: 'Younger generation shifting strongly to Option B' },
  ]
};

// --- 3. 다국어 UI 텍스트 ---
const UI_TEXT = {
  ko: {
    siteTitle: 'Commonworld',
    sloganPrimary: '읽는 언어는 달라도, 대화는 하나로.',
    livePulseTitle: '실시간 글로벌 접속자 현황',
    onlineNow: '현재 동접',
    dailyVisitors: '오늘 누적(DAU)',
    passportTitle: '내 글로벌 여권 (도장 깨기)',
    passportDesc: '각국 게시글에 반응·댓글·투표를 남기면 해당 국가 스탬프가 찍힙니다!',
    stampCollected: '개국 정복',
    stampToast: '스탬프 획득! 글로벌 여권에 새 국가 도장이 찍혔습니다.',
    battleBadge: '🌡️ 오늘의 글로벌 온도차 배틀',
    battleSub: '투표 즉시 국가별 극과 극 민심 그래프가 실시간으로 반영됩니다.',
    votedNotice: '투표 완료! 아래에서 국가별 온도차를 비교해 보세요.',
    radarBadge: '🚀 국경 돌파 시그널',
    searchPlaceholder: '화제글, 키워드, 국가 검색...',
    sortPopular: '인기순',
    sortLatest: '최신순',
    newPostBtn: '새 글 등록',
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
    countryReactionsTitle: '📊 국가별 감정 반응 분포',
    allCommentsTitle: '💬 실시간 다국어 댓글',
    commentPlaceholder: '내 언어로 댓글을 남겨보세요. 전 세계 유저에게 자동 번역됩니다...',
    submitBtn: '등록',
    foldedCommentNotice: '⚠️ 커뮤니티 가이드라인 또는 비추천 누적으로 접힌 댓글입니다.',
    unfoldBtn: '내용 보기',
    privacyFooter: '개인정보 보호 원칙: Commonworld는 원본 IP를 저장하지 않으며 일방향 익명 해시만 사용합니다.',
    modalTitle: '새 글로벌 토픽 등록',
    modalTypeExternal: '해외 화제글 큐레이션',
    modalTypeNative: '자체 커뮤니티 글 작성',
    modalTitleInput: '제목 (작성 언어로 입력)',
    modalBodyInput: '본문 내용 또는 핵심 요약',
    modalSourceInput: '출처 이름 (예: Reddit, X 등)',
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
    passportDesc: 'React, vote, or comment on regional posts to collect country stamps!',
    stampCollected: 'Countries Unlocked',
    stampToast: 'New Stamp Unlocked! Added to your Global Passport.',
    battleBadge: '🌡️ Global Temperature Battle',
    battleSub: 'Vote to compare how different countries clash on the exact same issue.',
    votedNotice: 'Vote recorded! Check the regional mindset gap below.',
    radarBadge: '🚀 Cross-Border Signal',
    searchPlaceholder: 'Search topics, keywords, regions...',
    sortPopular: 'Popular',
    sortLatest: 'Latest',
    newPostBtn: 'New Post',
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
    countryReactionsTitle: '📊 Reaction Breakdown by Country',
    allCommentsTitle: '💬 Live Cross-Language Comments',
    commentPlaceholder: 'Write in your language. Auto-translated for global readers...',
    submitBtn: 'Post',
    foldedCommentNotice: '⚠️ Comment folded due to community safety rules.',
    unfoldBtn: 'Reveal',
    privacyFooter: 'Privacy First: Commonworld never stores raw IPs and uses ephemeral daily salts.',
    modalTitle: 'Create Global Topic',
    modalTypeExternal: 'Curate External Post',
    modalTypeNative: 'Write Original Post',
    modalTitleInput: 'Title (in your language)',
    modalBodyInput: 'Content or key takeaway',
    modalSourceInput: 'Source Name (e.g., Reddit, X)',
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

// --- 4. 초기 게시글 데이터 (5번 국경 돌파 시그널 데이터 포함) ---
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
        cultural_context: '독일 캠핑장(Campingplatz)은 소음 규제가 엄격해 가솔린 발전기 사용이 불가능한 곳이 많습니다. 무소음 전력 공급이 가능한 전기차 V2L이 현지에서 특히 극찬받는 이유입니다.',
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
        cultural_context: 'German campsites strictly regulate noise (Ruhezeit), making gas generators taboo. Silent high-wattage V2L power fits local etiquette perfectly.',
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
      },
      {
        id: 'c-2',
        anonymous_id: 'Anon · KR-88B',
        access_country: 'KR',
        original_language: 'ko',
        original_text: '한국에서도 차박할 때 인덕션이랑 에어프라이어 돌리는 용도로 필수템 취급받습니다 ㅎㅎ',
        translated_ko: '한국에서도 차박할 때 인덕션이랑 에어프라이어 돌리는 용도로 필수템 취급받습니다 ㅎㅎ',
        translated_en: 'In Korea too, it is considered a must-have for running induction stoves and air fryers during car camping haha.',
        upvotes: 39,
        is_best: true,
        folded: false
      }
    ]
  },
  {
    id: 'post-102',
    type: 'external',
    category: 'korea_trending_abroad',
    region_group: 'US',
    access_country: 'US',
    is_cross_border: true,
    cross_border_route: '🇰🇷 Seoul Trend ➔ 🇺🇸 US Viral (+520%)',
    source_name: 'X (Twitter) · Viral Thread',
    source_url: 'https://x.com',
    original_language: 'en',
    original_title: 'Why do Korean convenience stores have an entire wall of pouch drinks with ice cups? We need this in every US city immediately.',
    original_body: 'Walked into a convenience store in Seoul at 2 AM, grabbed a hazelnut coffee pouch for $1.50 and a cup of ice. Why is this simple genius concept not standard everywhere in America?',
    created_at: '4시간 전',
    timestamp: 1730540000,
    upvotes: 465,
    keywords: ['한국편의점', '파우치음료', '얼음컵', '아샷추'],
    translations: {
      ko: {
        title: '왜 한국 편의점에는 얼음컵이랑 타먹는 파우치 음료가 벽면 가득 있나요? 미국에도 당장 도입해야 합니다.',
        body: '새벽 2시에 서울 편의점에 들어가서 1.5달러짜리 헤이즐넛 커피 파우치랑 얼음컵을 샀습니다. 왜 이렇게 단순하고 천재적인 시스템이 미국에는 기본으로 없는 거죠?',
        summary: [
          '미국 여행객이 한국 편의점의 2,000원대 얼음컵+파우치 음료 조합을 소개해 120만 조회수 돌파',
          '저렴한 가격과 밤낮없이 커스텀 음료를 만들어 마시는 문화에 영미권 유저들이 열광함',
          '복숭아 아이스티+에스프레소 샷 추가(아샷추) 등 한국식 꿀조합 레시피까지 활발히 공유 중'
        ],
        why_trending: '고물가 시대에 미국 카페 음료 가격이 7~8달러를 넘어가면서, 가성비와 재미를 모두 잡은 한국식 편의점 문화가 대안으로 주목받음.',
        cultural_context: '한국의 24시간 편의점 인프라와 특유의 꿀조합(Modisumer) 문화가 결합된 대표 사례로, 외국인들에게는 하나의 엔터테인먼트 공간으로 인식됩니다.',
      },
      en: {
        title: 'Why do Korean convenience stores have an entire wall of pouch drinks with ice cups? We need this in the US.',
        body: 'Walked into a convenience store in Seoul at 2 AM, grabbed a hazelnut coffee pouch for $1.50 and a cup of ice. Why is this simple genius concept not standard everywhere in America?',
        summary: [
          'Viral post highlights Korea’s $1.50 convenience store pouch drink + ice cup system',
          'US netizens contrast the affordability with $8+ American cafe drinks',
          'Sparked threads sharing Korean DIY mixes like Peach Iced Tea + Espresso shot (A-Shot-Chu)'
        ],
        why_trending: 'Amid rising cafe prices globally, Korea’s ultra-accessible 24/7 convenience store beverage culture looks both fun and economical.',
        cultural_context: 'Korean convenience stores act as 24-hour social hubs where consumers actively invent DIY recipes.',
      }
    },
    reactions: { empathy: 245, funny: 112, surprised: 84, controversial: 15, ambiguous: 9, angry: 3 },
    country_breakdown: [
      { country: 'US', total: 215, top: [{ type: 'empathy', pct: 66 }, { type: 'surprised', pct: 24 }] },
      { country: 'KR', total: 155, top: [{ type: 'funny', pct: 58 }, { type: 'empathy', pct: 35 }] },
      { country: 'JP', total: 68, top: [{ type: 'empathy', pct: 62 }, { type: 'surprised', pct: 21 }] }
    ],
    comments: [
      {
        id: 'c-3',
        anonymous_id: 'Anon · US-90T',
        access_country: 'US',
        original_language: 'en',
        original_text: 'Wait until you try mixing the peach iced tea pouch with an espresso shot. Changed my life in Seoul.',
        translated_ko: '복숭아 아이스티 파우치에 에스프레소 샷 섞어 마시는(아샷추) 거 해보세요. 서울에서 제 인생이 바뀌었습니다.',
        translated_en: 'Wait until you try mixing the peach iced tea pouch with an espresso shot. Changed my life in Seoul.',
        upvotes: 74,
        is_best: true,
        folded: false
      }
    ]
  },
  {
    id: 'post-103',
    type: 'native',
    category: 'cultural_difference',
    region_group: 'EU',
    access_country: 'DE',
    is_cross_border: false,
    cross_border_route: '',
    source_name: 'Commonworld Original',
    source_url: '',
    original_language: 'ko',
    original_title: '독일/유럽 직장인분들, 점심시간에 운동(수영이나 헬스) 다녀오시나요?',
    original_body: '프랑크푸르트 근교에서 근무 중인데 점심시간 짬을 내서 35분 정도 짧고 굵게 웨이트를 하거나 아침 일찍 수영을 다니고 있습니다. 다른 국가에서 일하시는 분들은 평일 체력 관리를 어떤 루틴으로 하시는지 궁금합니다!',
    created_at: '1일 전',
    timestamp: 1730480000,
    upvotes: 118,
    keywords: ['직장인운동', '점심운동', '유럽생활', '워라밸'],
    translations: {
      ko: {
        title: '독일/유럽 직장인분들, 점심시간에 운동(수영이나 헬스) 다녀오시나요?',
        body: '프랑크푸르트 근교에서 근무 중인데 점심시간 짬을 내서 35분 정도 짧고 굵게 웨이트를 하거나 아침 일찍 수영을 다니고 있습니다. 다른 국가에서 일하시는 분들은 평일 체력 관리를 어떤 루틴으로 하시는지 궁금합니다!',
        summary: [
          '독일 근무 중인 작성자가 출근 전 수영 및 점심시간 35분 고강도 웨이트 루틴을 공유함',
          '국가별 직장인들의 평일 운동 시간 확보 방식과 오피스 주변 피트니스 인프라 비교',
          '유럽·미국·한국 유저들이 각자의 점심시간 활용법을 댓글로 활발히 공유 중'
        ],
        why_trending: '국가마다 다른 점심시간 문화와 유연근무제 환경 속에서 바쁜 직장인들이 어떻게 건강을 챙기는지 공감대를 형성함.',
        cultural_context: '유럽 주요 비즈니스 거점(프랑크푸르트, 런던 등)에서는 점심시간을 활용해 근처 피트니스 클럽에서 30~40분간 운동 후 간단히 식사하는 직장인 비중이 높습니다.',
      },
      en: {
        title: 'Office workers in Europe/Global: Do you work out (swim or lift) during your lunch break?',
        body: 'Working near Frankfurt, I usually do a quick 35-minute high-intensity weight session at lunch or an early morning swim. Curious how people in other countries fit workouts into their workday routine!',
        summary: [
          'A Frankfurt-based professional shares a dual routine of morning swims and 35-min lunch weight sessions',
          'Sparks cross-country comparison of workplace fitness culture and lunch break flexibility',
          'Global users share tips on balancing desk jobs with athletic conditioning'
        ],
        why_trending: 'Relatable topic for global professionals trying to stay fit without sacrificing family time in the evening.',
        cultural_context: 'In European financial and business hubs, midday express gym sessions followed by a quick lunch are increasingly popular.',
      }
    },
    reactions: { empathy: 79, surprised: 21, funny: 8, ambiguous: 4, controversial: 2, angry: 0 },
    country_breakdown: [
      { country: 'DE', total: 52, top: [{ type: 'empathy', pct: 76 }, { type: 'surprised', pct: 15 }] },
      { country: 'GB', total: 38, top: [{ type: 'empathy', pct: 71 }, { type: 'funny', pct: 14 }] },
      { country: 'KR', total: 28, top: [{ type: 'empathy', pct: 62 }, { type: 'surprised', pct: 28 }] }
    ],
    comments: [
      {
        id: 'c-5',
        anonymous_id: 'Anon · GB-12L',
        access_country: 'GB',
        original_language: 'en',
        original_text: 'Lunch workout is the best! Leaves the evening completely free for family.',
        translated_ko: '점심 운동이 최고죠! 퇴근 후 저녁 시간을 온전히 가족들과 보낼 수 있어서 정말 좋습니다.',
        translated_en: 'Lunch workout is the best! Leaves the evening completely free for family.',
        upvotes: 27,
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

  // 1. 실시간 접속자 현황판 상태 (x7 배수 반영 및 미세 변동 시뮬레이션)
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

  // 2. 실시간 티커 인덱스
  const [tickerIndex, setTickerIndex] = useState(0);

  // 3. 글로벌 온도차 배틀 투표 상태
  const [battle, setBattle] = useState(INITIAL_BATTLE);
  const [userVote, setUserVote] = useState(null); // 'A' or 'B'

  // 4. 글로벌 여권 스탬프 (기본 2개국 보유 상태로 시작, 활동 시 추가 획득)
  const [stamps, setStamps] = useState(['KR', 'DE']);
  const [stampAlert, setStampAlert] = useState(null);

  // 카드 확장 및 인터랙션 상태
  const [expandedPostIds, setExpandedPostIds] = useState({ 'post-101': true });
  const [showOriginalIds, setShowOriginalIds] = useState({});
  const [unfoldedCommentIds, setUnfoldedCommentIds] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // 새 글 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostType, setNewPostType] = useState('native');
  const [newPostCategory, setNewPostCategory] = useState('global_debate');
  const [newPostCountry, setNewPostCountry] = useState('DE');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostSource, setNewPostSource] = useState('');

  const t = UI_TEXT[lang];

  // 실시간 동접자 수 미세 변동 & 상단 티커 롤링 효과
  useEffect(() => {
    const statInterval = setInterval(() => {
      setLiveStats((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((code) => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 ~ +2 변동
          const newOnline = Math.max(20, next[code].online + delta);
          const dauIncrement = delta > 0 ? delta : 0;
          next[code] = {
            online: newOnline,
            dau: next[code].dau + dauIncrement,
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

  // 총 동접자 및 총 DAU 합산
  const totalTraffic = useMemo(() => {
    return Object.values(liveStats).reduce(
      (acc, cur) => ({
        online: acc.online + cur.online,
        dau: acc.dau + cur.dau,
      }),
      { online: 0, dau: 0 }
    );
  }, [liveStats]);

  // 여권 스탬프 획득 함수
  const unlockStamp = (countryCode) => {
    if (!PASSPORT_COUNTRIES.includes(countryCode)) return;
    if (!stamps.includes(countryCode)) {
      setStamps((prev) => [...prev, countryCode]);
      const meta = COUNTRY_META[countryCode];
      setStampAlert(`${meta.flag} ${lang === 'ko' ? meta.name_ko : meta.name_en}`);
      setTimeout(() => setStampAlert(null), 3500);
    }
  };

  // VS 배틀 투표 핸들러
  const handleBattleVote = (choice) => {
    if (userVote) return;
    setUserVote(choice);
    setBattle((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
    }));
    // 투표 참여 시 미국(US) 또는 일본(JP) 스탬프 보너스 해금
    if (!stamps.includes('US')) unlockStamp('US');
    else if (!stamps.includes('JP')) unlockStamp('JP');
  };

  // 게시글 필터링 및 정렬
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
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
          const matchTitle =
            trans.title.toLowerCase().includes(q) || post.original_title.toLowerCase().includes(q);
          const matchKeywords = post.keywords.some((k) => k.toLowerCase().includes(q));
          return matchTitle || matchKeywords;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.upvotes - a.upvotes;
        return b.timestamp - a.timestamp;
      });
  }, [posts, selectedCountry, selectedCategory, searchQuery, sortBy, lang]);

  const handleReaction = (postId, reactionType, postCountry) => {
    unlockStamp(postCountry);
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          upvotes: post.upvotes + 1,
          reactions: {
            ...post.reactions,
            [reactionType]: (post.reactions[reactionType] || 0) + 1,
          },
        };
      })
    );
  };

  const handleAddComment = (postId, postCountry) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    unlockStamp(postCountry);

    const newComment = {
      id: `c-${Date.now()}`,
      anonymous_id: `Anon · ${newPostCountry}-99X`,
      access_country: newPostCountry,
      original_language: lang,
      original_text: text,
      translated_ko: text,
      translated_en: text,
      upvotes: 1,
      is_best: false,
      folded: false,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    unlockStamp(newPostCountry);

    const createdPost = {
      id: `post-${Date.now()}`,
      type: newPostType,
      category: newPostCategory,
      region_group: COUNTRY_META[newPostCountry]?.region || 'OTHER',
      access_country: newPostCountry,
      is_cross_border: true,
      cross_border_route: `${COUNTRY_META[newPostCountry]?.flag || '🌐'} ${newPostCountry} ➔ 🌏 Global Live`,
      source_name: newPostType === 'external' ? newPostSource || 'External Link' : 'Commonworld Original',
      source_url: newPostType === 'external' ? 'https://commonworld.vercel.app' : '',
      original_language: lang,
      original_title: newPostTitle,
      original_body: newPostBody,
      created_at: lang === 'ko' ? '방금 전' : 'Just now',
      timestamp: Date.now(),
      upvotes: 1,
      keywords: ['신규토픽', '글로벌'],
      translations: {
        ko: {
          title: newPostTitle,
          body: newPostBody,
          summary: [
            newPostBody.slice(0, 60) + (newPostBody.length > 60 ? '...' : ''),
            '작성자가 등록한 실시간 글로벌 커뮤니티 토픽입니다.',
            '온디맨드 AI 번역 및 국가별 반응 집계가 시작되었습니다.'
          ],
          why_trending: '방금 등록된 신규 글로벌 토론 주제입니다.',
          cultural_context: '다양한 국가의 유저들이 각자의 현지 시각을 댓글로 공유할 수 있습니다.',
        },
        en: {
          title: newPostTitle,
          body: newPostBody,
          summary: [
            newPostBody.slice(0, 60) + (newPostBody.length > 60 ? '...' : ''),
            'Newly submitted global community topic.',
            'On-demand AI translation and regional reaction tracking initiated.'
          ],
          why_trending: 'Freshly published topic awaiting global reactions.',
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
    setNewPostTitle('');
    setNewPostBody('');
    setNewPostSource('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 스탬프 획득 알림 토스트 */}
      {stampAlert && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-400/50 bg-slate-900/95 px-4 py-3 text-xs font-bold text-amber-300 shadow-2xl shadow-amber-500/20 animate-bounce">
          <Award className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-white">{stampAlert}</div>
            <div className="text-[11px] text-amber-300/90">{t.stampToast}</div>
          </div>
        </div>
      )}

      {/* 1. 최상단 실시간 글로벌 시그널 티커 */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-sky-500/20 px-4 py-2 text-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-extrabold text-rose-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              LIVE
            </span>
            <p className="truncate text-slate-200 font-medium">
              {LIVE_TICKER_ITEMS[lang][tickerIndex]}
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-sky-400 shrink-0 font-semibold">
            #{tickerIndex + 1} / {LIVE_TICKER_ITEMS[lang].length}
          </span>
        </div>
      </div>

      {/* 2. 모바일/PC 최상단: 국가별 실시간 동접자 & 일간 접속자(DAU) 대시보드 (x7 부스트) */}
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

            {/* 9번 기능: 글로벌 여권 (스탬프 도장 깨기 바) */}
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1">
              <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-amber-200">{t.passportTitle}:</span>
              <div className="flex items-center gap-1">
                {PASSPORT_COUNTRIES.map((code) => {
                  const unlocked = stamps.includes(code);
                  return (
                    <button
                      key={code}
                      onClick={() => unlockStamp(code)}
                      title={
                        unlocked
                          ? `${COUNTRY_META[code].name_ko} 스탬프 획득 완료`
                          : '클릭하거나 해당 국가 글에 반응해 스탬프를 모으세요!'
                      }
                      className={`text-sm transition transform ${
                        unlocked
                          ? 'opacity-100 scale-105 drop-shadow'
                          : 'opacity-25 grayscale hover:opacity-60'
                      }`}
                    >
                      {COUNTRY_META[code].flag}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-extrabold text-amber-300 ml-1">
                ({stamps.length}/{PASSPORT_COUNTRIES.length} {t.stampCollected})
              </span>
            </div>
          </div>

          {/* 국가별 동접 / DAU 미니 카드 (모바일 가로 스크롤 및 그리드 지원) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(COUNTRY_META).map(([code, meta]) => {
              const stat = liveStats[code] || { online: meta.baseOnline, dau: meta.baseDau };
              const isSelected = selectedCountry === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCountry(isSelected ? 'ALL' : code)}
                  className={`flex flex-col justify-between rounded-xl border p-2 text-left transition ${
                    isSelected
                      ? 'border-sky-400 bg-sky-500/15'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
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
                    <span className="text-[10px] text-slate-400">
                      DAU {(stat.dau / 1000).toFixed(1)}k
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 메인 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 shadow-lg shadow-sky-500/20">
              <Globe className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                  {t.siteTitle}
                </h1>
                <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                  GLOBAL LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.sloganPrimary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-sky-500/50 hover:text-sky-400 transition"
            >
              <Languages className="h-4 w-4 text-sky-400" />
              <span>{lang === 'ko' ? 'English' : '한국어'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition shadow-md shadow-sky-500/10"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.newPostBtn}</span>
            </button>
          </div>
        </div>

        {/* 국가 탭 & 검색 바 */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {COUNTRY_TABS.map((tab) => {
              const active = selectedCountry === tab.code;
              return (
                <button
                  key={tab.code}
                  onClick={() => setSelectedCountry(tab.code)}
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-0.5">
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  sortBy === 'popular' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>{t.sortPopular}</span>
              </button>
              <button
                onClick={() => setSortBy('latest')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  sortBy === 'latest' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{t.sortLatest}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4. 메인 콘텐츠 영역 */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
        {/* 킬러 파츠 1번: 🌡️ 글로벌 온도차 배틀 (VS 폴 & 국가별 민심 지도) */}
        <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/20 border border-indigo-400/40 px-2.5 py-1 text-xs font-extrabold text-indigo-300">
                {t.battleBadge}
              </span>
              <span className="text-xs text-slate-400">{t.battleSub}</span>
            </div>
            <span className="text-xs font-bold text-indigo-300">
              🔥 {battle.totalVotes.toLocaleString()}명 참여 중
            </span>
          </div>

          <h2 className="text-base md:text-lg font-extrabold text-white leading-snug">
            Q. {lang === 'ko' ? battle.question_ko : battle.question_en}
          </h2>

          {/* VS 투표 버튼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleBattleVote('A')}
              className={`rounded-xl border p-3.5 text-left transition flex items-center justify-between ${
                userVote === 'A'
                  ? 'border-sky-400 bg-sky-500/20 text-white'
                  : 'border-slate-800 bg-slate-950/80 text-slate-200 hover:border-sky-500/50'
              }`}
            >
              <span className="text-xs md:text-sm font-bold">
                {lang === 'ko' ? battle.optionA_ko : battle.optionA_en}
              </span>
              <span className="text-sm font-extrabold text-sky-400">{battle.overallA}%</span>
            </button>

            <button
              onClick={() => handleBattleVote('B')}
              className={`rounded-xl border p-3.5 text-left transition flex items-center justify-between ${
                userVote === 'B'
                  ? 'border-rose-400 bg-rose-500/20 text-white'
                  : 'border-slate-800 bg-slate-950/80 text-slate-200 hover:border-rose-500/50'
              }`}
            >
              <span className="text-xs md:text-sm font-bold">
                {lang === 'ko' ? battle.optionB_ko : battle.optionB_en}
              </span>
              <span className="text-sm font-extrabold text-rose-400">{battle.overallB}%</span>
            </button>
          </div>

          {userVote && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.votedNotice}</span>
            </div>
          )}

          {/* 국가별 민심 온도차 비교 바 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {battle.countries.map((c) => {
              const meta = COUNTRY_META[c.code];
              return (
                <div
                  key={c.code}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {meta.flag} {lang === 'ko' ? meta.name_ko : meta.name_en}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      👍 {c.pctA}% vs 🛑 {c.pctB}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${c.pctA}%` }} className="bg-sky-400 h-full" />
                    <div style={{ width: `${c.pctB}%` }} className="bg-rose-500 h-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {lang === 'ko' ? c.note_ko : c.note_en}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 카테고리 및 5번 국경 돌파 레이더 필터 칩 */}
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
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-sm'
                    : cat.radar
                    ? 'border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-300 hover:bg-fuchsia-500/25'
                    : cat.highlight
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
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
            const categoryObj = CATEGORIES.find((c) => c.slug === post.category);

            return (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 md:p-6 space-y-4 transition shadow-lg shadow-black/20 ${
                  post.is_cross_border
                    ? 'border-fuchsia-500/35 bg-slate-900/75 hover:border-fuchsia-500/60'
                    : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700/80'
                }`}
              >
                {/* 5번 기능: 국경 돌파 시그널 레이더 뱃지 */}
                {post.is_cross_border && (
                  <div className="flex items-center justify-between rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-fuchsia-300">
                      <Radio className="h-4 w-4 text-fuchsia-400 animate-pulse" />
                      <span>{t.radarBadge}:</span>
                      <span className="text-white">{post.cross_border_route}</span>
                    </div>
                    <span className="hidden sm:inline text-[11px] text-fuchsia-300/80">
                      타 대륙 조회수 급상승 감지
                    </span>
                  </div>
                )}

                {/* 카드 상단 메타바 */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 font-semibold ${
                        post.type === 'external'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {post.type === 'external' ? t.externalPostBadge : t.nativePostBadge}
                    </span>

                    {categoryObj && (
                      <span className="rounded-md bg-slate-800 px-2.5 py-0.5 text-slate-300 font-medium">
                        {lang === 'ko' ? categoryObj.label_ko : categoryObj.label_en}
                      </span>
                    )}

                    <span className="rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-sky-400 font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {t.autoTranslatedBadge} ({post.original_language.toUpperCase()} → {lang.toUpperCase()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-medium text-slate-300">
                      {formatCountryLabel(post.access_country, lang)}
                    </span>
                    <span>·</span>
                    <span>{post.created_at}</span>
                  </div>
                </div>

                {/* 제목 및 본문 */}
                <div className="space-y-2">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {showOriginal ? post.original_title : trans.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {showOriginal ? post.original_body : trans.body}
                  </p>
                </div>

                {/* 카드 겉면 국가별 반응 미니 프리뷰 바 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {post.country_breakdown.map((item, idx) => {
                    const cMeta = COUNTRY_META[item.country] || { flag: '🌐', name_ko: '글로벌', name_en: 'Global' };
                    const topReaction = item.top[0];
                    const rMeta = REACTION_META[topReaction?.type];
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/90 px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        <span>{cMeta.flag}</span>
                        <span className="font-semibold">{lang === 'ko' ? cMeta.name_ko : cMeta.name_en}</span>
                        <span className="text-sky-400 font-bold">
                          {rMeta?.emoji} {topReaction?.pct}%
                        </span>
                      </span>
                    );
                  })}
                </div>

                {/* 키워드 태그 & 원문/번역 토글 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 text-[11px] text-slate-400"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setShowOriginalIds((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition"
                    >
                      {showOriginal
                        ? t.showTranslatedText
                        : `${t.showOriginalText} (${post.original_language.toUpperCase()})`}
                    </button>

                    {post.type === 'external' && post.source_url && (
                      <a
                        href={post.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-sky-400 hover:bg-slate-800 transition"
                      >
                        <span>{post.source_name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* 감정 반응 투표 바 & Smart Preview 토글 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.entries(REACTION_META).map(([key, meta]) => {
                      const count = post.reactions[key] || 0;
                      return (
                        <button
                          key={key}
                          onClick={() => handleReaction(post.id, key, post.access_country)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/90 px-2.5 py-1.5 text-xs hover:border-sky-500/40 hover:bg-slate-900 transition"
                        >
                          <span>{meta.emoji}</span>
                          <span className="text-slate-400">
                            {lang === 'ko' ? meta.label_ko : meta.label_en}
                          </span>
                          <span className="font-bold text-slate-200">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setExpandedPostIds((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 px-3.5 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/25 transition"
                  >
                    <span>{isExpanded ? t.closeSmartPreview : t.openSmartPreview}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* 확장 영역: Smart Preview + 국가별 상세 분포 + 댓글 */}
                {isExpanded && (
                  <div className="mt-4 space-y-5 border-t border-slate-800 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-sky-400">{t.summaryTitle}</h4>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                          {trans.summary.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-amber-400">{t.whyTrendingTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{trans.why_trending}</p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400">{t.culturalContextTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {trans.cultural_context}
                        </p>
                      </div>
                    </div>

                    {/* 실시간 다국어 댓글 영역 */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                        <span>
                          {t.allCommentsTitle} ({post.comments.length})
                        </span>
                      </h4>

                      <div className="space-y-2.5">
                        {post.comments.map((cmt) => {
                          const isFolded = cmt.folded && !unfoldedCommentIds[cmt.id];
                          return (
                            <div
                              key={cmt.id}
                              className={`rounded-xl border p-3.5 text-xs space-y-1.5 ${
                                cmt.is_best
                                  ? 'border-sky-500/30 bg-sky-500/5'
                                  : 'border-slate-800 bg-slate-950/70'
                              }`}
                            >
                              <div className="flex items-center justify-between text-slate-400">
                                <div className="flex items-center gap-2">
                                  {cmt.is_best && (
                                    <span className="rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-950">
                                      BEST
                                    </span>
                                  )}
                                  <span className="font-semibold text-slate-300">
                                    {cmt.anonymous_id}
                                  </span>
                                  <span>·</span>
                                  <span>{formatCountryLabel(cmt.access_country, lang)}</span>
                                </div>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <ThumbsUp className="h-3 w-3" /> {cmt.upvotes}
                                </span>
                              </div>

                              {isFolded ? (
                                <div className="flex items-center justify-between text-slate-500 italic pt-1">
                                  <span>{t.foldedCommentNotice}</span>
                                  <button
                                    onClick={() =>
                                      setUnfoldedCommentIds((prev) => ({ ...prev, [cmt.id]: true }))
                                    }
                                    className="text-sky-400 underline not-italic"
                                  >
                                    {t.unfoldBtn}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-slate-200 leading-relaxed">
                                    {lang === 'ko' ? cmt.translated_ko : cmt.translated_en}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    원문 ({cmt.original_language.toUpperCase()}): {cmt.original_text}
                                  </p>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleAddComment(post.id, post.access_country)
                          }
                          placeholder={t.commentPlaceholder}
                          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post.id, post.access_country)}
                          className="flex items-center gap-1 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{t.submitBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{t.privacyFooter}</span>
          </div>
          <span>© 2026 Commonworld · Global Anonymous Community</span>
        </div>
      </footer>

      {/* 새 글 작성 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{t.modalTitle}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewPostType('native')}
                  className={`rounded-xl py-2 font-bold border ${
                    newPostType === 'native'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {t.modalTypeNative}
                </button>
                <button
                  type="button"
                  onClick={() => setNewPostType('external')}
                  className={`rounded-xl py-2 font-bold border ${
                    newPostType === 'external'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {t.modalTypeExternal}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">카테고리</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  >
                    {CATEGORIES.filter((c) => c.slug !== 'all' && c.slug !== 'cross_border').map(
                      (c) => (
                        <option key={c.slug} value={c.slug}>
                          {lang === 'ko' ? c.label_ko : c.label_en}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">접속 국가 표시</label>
                  <select
                    value={newPostCountry}
                    onChange={(e) => setNewPostCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  >
                    <option value="DE">🇩🇪 Germany (독일)</option>
                    <option value="KR">🇰🇷 Korea (한국)</option>
                    <option value="US">🇺🇸 USA (미국)</option>
                    <option value="JP">🇯🇵 Japan (일본)</option>
                    <option value="GB">🇬🇧 UK (영국)</option>
                    <option value="FR">🇫🇷 France (프랑스)</option>
                  </select>
                </div>
              </div>

              {newPostType === 'external' && (
                <div>
                  <label className="block text-slate-400 mb-1">{t.modalSourceInput}</label>
                  <input
                    type="text"
                    value={newPostSource}
                    onChange={(e) => setNewPostSource(e.target.value)}
                    placeholder="Reddit · r/europe"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">{t.modalTitleInput}</label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t.modalBodyInput}</label>
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
