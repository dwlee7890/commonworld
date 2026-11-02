'use client';

import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Send,
  Languages,
  X,
  Filter
} from 'lucide-react';

// --- 1. 다국어 UI 및 메타데이터 ---
const COUNTRY_META = {
  KR: { flag: '🇰🇷', name_ko: '한국', name_en: 'Korea', region: 'KR' },
  US: { flag: '🇺🇸', name_ko: '미국', name_en: 'USA', region: 'US' },
  JP: { flag: '🇯🇵', name_ko: '일본', name_en: 'Japan', region: 'JP' },
  DE: { flag: '🇩🇪', name_ko: '독일', name_en: 'Germany', region: 'EU' },
  GB: { flag: '🇬🇧', name_ko: '영국', name_en: 'UK', region: 'EU' },
  FR: { flag: '🇫🇷', name_ko: '프랑스', name_en: 'France', region: 'EU' },
  UNKNOWN: { flag: '🌐', name_ko: '글로벌', name_en: 'Global', region: 'OTHER' },
};

const COUNTRY_TABS = [
  { code: 'ALL', label_ko: '🌏 전체 국가', label_en: '🌏 All Regions' },
  { code: 'KR', label_ko: '🇰🇷 한국', label_en: '🇰🇷 Korea' },
  { code: 'US', label_ko: '🇺🇸 미국', label_en: '🇺🇸 USA' },
  { code: 'JP', label_ko: '🇯🇵 일본', label_en: '🇯🇵 Japan' },
  { code: 'EU', label_ko: '🇪🇺 유럽', label_en: '🇪🇺 Europe' },
];

const CATEGORIES = [
  { slug: 'all', label_ko: '전체 주제', label_en: 'All Topics' },
  { slug: 'korea_trending_abroad', label_ko: '🔥 해외에서 화제인 한국', label_en: '🔥 Korea Trending Abroad', highlight: true },
  { slug: 'korean_cars', label_ko: '🚗 한국 자동차', label_en: '🚗 Korean Cars' },
  { slug: 'korean_food', label_ko: '🍜 한국 음식', label_en: '🍜 Korean Food' },
  { slug: 'cultural_difference', label_ko: '🤝 국가별 문화 차이', label_en: '🤝 Cultural Differences' },
  { slug: 'global_debate', label_ko: '⚖️ 글로벌 논쟁', label_en: '⚖️ Global Debates' },
  { slug: 'tech', label_ko: '💻 기술 · IT', label_en: '💻 Tech & IT' },
  { slug: 'daily', label_ko: '☕ 일상 · 유머', label_en: '☕ Daily & Humor' },
];

const REACTION_META = {
  funny: { emoji: '😂', label_ko: '웃김', label_en: 'Funny' },
  empathy: { emoji: '❤️', label_ko: '공감', label_en: 'Empathy' },
  surprised: { emoji: '😮', label_ko: '놀라움', label_en: 'Surprised' },
  ambiguous: { emoji: '🤔', label_ko: '애매함', label_en: 'Mixed' },
  controversial: { emoji: '🌶️', label_ko: '논쟁적', label_en: 'Spicy' },
  angry: { emoji: '😡', label_ko: '화남', label_en: 'Angry' },
};

const UI_TEXT = {
  ko: {
    siteTitle: 'Commonworld',
    sloganPrimary: '읽는 언어는 달라도, 대화는 하나로.',
    sloganSecondary: '단순 번역을 넘어 전 세계의 맥락과 반응을 연결합니다.',
    prototypeBanner: 'Phase 1 프로토타입 작동 중 · 온디맨드 번역 및 국가별 반응 분석 엔진 활성화',
    searchPlaceholder: '전 세계 화제글, 키워드, 국가 반응 검색...',
    sortPopular: '인기순',
    sortLatest: '최신순',
    newPostBtn: '새 글 등록',
    autoTranslatedBadge: 'AI 자동번역',
    externalPostBadge: '외부 큐레이션',
    nativePostBadge: '자체 게시글',
    openSmartPreview: 'Smart Preview & 글로벌 반응 열기',
    closeSmartPreview: '접기',
    viewOriginalSource: '원문 출처 이동',
    showOriginalText: '원문 보기',
    showTranslatedText: '번역본 보기',
    summaryTitle: '⚡ 3줄 핵심 요약',
    whyTrendingTitle: '🔥 왜 지금 화제인가요?',
    culturalContextTitle: '💡 문화적 맥락 & 현지 표현 해설',
    countryReactionsTitle: '📊 국가별 감정 반응 분포',
    bestCommentsTitle: '🏆 글로벌 BEST 댓글',
    allCommentsTitle: '💬 실시간 다국어 댓글',
    commentPlaceholder: '내 언어로 댓글을 남겨보세요. 전 세계 유저에게 자동 번역됩니다...',
    submitBtn: '등록',
    foldedCommentNotice: '⚠️ 커뮤니티 가이드라인 또는 비추천 누적으로 접힌 댓글입니다.',
    unfoldBtn: '내용 보기',
    privacyFooter: '개인정보 보호 원칙: Commonworld는 원본 IP를 영구 저장하지 않으며 일방향 익명 해시만 사용합니다.',
    modalTitle: '새 글로벌 토픽 등록',
    modalTypeExternal: '해외 화제글 큐레이션 (링크)',
    modalTypeNative: '자체 커뮤니티 글 작성',
    modalTitleInput: '제목 (작성 언어로 입력)',
    modalBodyInput: '본문 내용 또는 핵심 요약',
    modalSourceInput: '출처 이름 (예: Reddit r/cars, X 등)',
    modalCancel: '취소',
    modalCreate: '토픽 발행하기',
  },
  en: {
    siteTitle: 'Commonworld',
    sloganPrimary: 'Different languages to read, one conversation to share.',
    sloganSecondary: 'Beyond translation: connecting global context and regional reactions.',
    prototypeBanner: 'Phase 1 Prototype Active · On-Demand Translation & Regional Reaction Engine Live',
    searchPlaceholder: 'Search global topics, keywords, regional reactions...',
    sortPopular: 'Popular',
    sortLatest: 'Latest',
    newPostBtn: 'New Post',
    autoTranslatedBadge: 'AI Translated',
    externalPostBadge: 'Curated',
    nativePostBadge: 'Community Original',
    openSmartPreview: 'Open Smart Preview & Reactions',
    closeSmartPreview: 'Collapse',
    viewOriginalSource: 'Original Source',
    showOriginalText: 'Show Original',
    showTranslatedText: 'Show Translation',
    summaryTitle: '⚡ 3-Line Executive Summary',
    whyTrendingTitle: '🔥 Why is this trending?',
    culturalContextTitle: '💡 Cultural Context & Nuance',
    countryReactionsTitle: '📊 Reaction Breakdown by Country',
    bestCommentsTitle: '🏆 Global BEST Comments',
    allCommentsTitle: '💬 Live Cross-Language Comments',
    commentPlaceholder: 'Write in your language. Auto-translated for global readers...',
    submitBtn: 'Post',
    foldedCommentNotice: '⚠️ Comment folded due to community safety rules or downvotes.',
    unfoldBtn: 'Reveal',
    privacyFooter: 'Privacy First: Commonworld never stores raw IPs and uses ephemeral daily salts.',
    modalTitle: 'Create Global Topic',
    modalTypeExternal: 'Curate External Post',
    modalTypeNative: 'Write Original Post',
    modalTitleInput: 'Title (in your language)',
    modalBodyInput: 'Content or key takeaway',
    modalSourceInput: 'Source Name (e.g., Reddit, X, Local Forum)',
    modalCancel: 'Cancel',
    modalCreate: 'Publish Topic',
  },
};

function formatCountryLabel(code, lang) {
  const meta = COUNTRY_META[code] || COUNTRY_META.UNKNOWN;
  return lang === 'ko'
    ? `${meta.flag} ${meta.name_ko}에서 작성`
    : `${meta.flag} Posted from ${meta.name_en}`;
}

// --- 2. 초기 샘플 데이터 (풍부한 검증용 시나리오 4건) ---
const INITIAL_POSTS = [
  {
    id: 'post-101',
    type: 'external',
    category: 'korean_cars',
    region_group: 'EU',
    access_country: 'DE',
    source_name: 'Reddit · r/Elektroautos',
    source_url: 'https://www.reddit.com',
    original_language: 'de',
    original_title: 'Stromausfall beim Camping im Schwarzwald: V2L am koreanischen E-Auto hat unser Wochenende gerettet',
    original_body: 'Letztes Wochenende hatten wir auf dem Campingplatz einen kompletten Stromausfall. Dank V2L-Adapter (3,6 kW) konnten wir Kaffeemaschine, Kühlschrank und sogar den Elektrogrill der Nachbarn problemlos stundenlang weiterbetreiben. Der Akku hat kaum 8% verloren.',
    author_anonymous_id: 'Curator · DE-91A',
    created_at: '2시간 전',
    timestamp: 1730550000,
    upvotes: 284,
    keywords: ['V2L', '전기차', '독일캠핑', '아웃도어'],
    translations: {
      ko: {
        title: '독일 블랙포레스트 캠핑장 정전 사태 때 한국 전기차 V2L 기능으로 주말을 구한 후기',
        body: '지난 주말 캠핑장 전체에 정전이 발생했습니다. 다행히 차량의 V2L 어댑터(3.6kW 출력)를 연결해 커피머신, 냉장고는 물론 옆 텐트 이웃의 전기그릴까지 몇 시간 동안 아무 문제 없이 가동했습니다. 배터리는 고작 8%밖에 줄지 않았네요.',
        summary: [
          '독일 캠핑장 정전 상황에서 한국 전기차의 3.6kW V2L 기능을 비상 발전기처럼 활용함',
          '커피머신·냉장고·전기그릴 등 고출력 가전을 동시 가동하고도 배터리 소모는 8%에 불과',
          '유럽 현지 네티즌들 사이에서 실용적인 아웃도어 전력 솔루션으로 큰 호평을 받음'
        ],
        why_trending: '유럽 내 캠핑·차박 문화 확산과 맞물려 별도 파워뱅크 없이 일반 220V 가전을 바로 꽂아 쓰는 고출력 V2L의 실사용 가치가 화제가 됨.',
        cultural_context: '독일 캠핑장(Campingplatz)은 소음 규제가 매우 엄격해 가솔린 발전기 사용이 불가능한 곳이 많습니다. 무소음 전력 공급이 가능한 전기차 V2L이 현지에서 특히 극찬받는 이유입니다.',
        discussion_prompt: '야외 활동이나 비상 상황에서 차량의 전력을 유용하게 써본 경험이 있으신가요?'
      },
      en: {
        title: 'Power outage while camping in the Black Forest: Korean EV V2L saved our weekend',
        body: 'Last weekend our campsite had a complete blackout. Thanks to the 3.6kW V2L adapter, we ran our coffee maker, fridge, and even our neighbor’s electric grill for hours. The battery barely dropped 8%.',
        summary: [
          'Used a Korean EV’s 3.6kW V2L adapter during a German campsite blackout',
          'Powered high-wattage appliances (fridge, coffee machine, grill) using only 8% battery',
          'Praised across European EV forums as a game-changer for quiet outdoor living'
        ],
        why_trending: 'Highlights real-world utility of bi-directional high-output charging in European outdoor culture without expensive portable power stations.',
        cultural_context: 'German campsites strictly regulate noise (Ruhezeit), making gas generators taboo. Silent high-wattage V2L power fits local camping etiquette.',
        discussion_prompt: 'Have you ever used vehicle-to-load (V2L) power for outdoor activities or emergencies?'
      }
    },
    reactions: { empathy: 132, surprised: 89, funny: 24, controversial: 12, ambiguous: 8, angry: 3 },
    country_breakdown: [
      { country: 'DE', total: 110, top: [{ type: 'empathy', pct: 58 }, { type: 'surprised', pct: 31 }] },
      { country: 'KR', total: 95, top: [{ type: 'empathy', pct: 64 }, { type: 'funny', pct: 20 }] },
      { country: 'US', total: 63, top: [{ type: 'surprised', pct: 52 }, { type: 'empathy', pct: 35 }] }
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
        upvotes: 45,
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
        upvotes: 31,
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
    source_name: 'X (Twitter) · Viral Thread',
    source_url: 'https://x.com',
    original_language: 'en',
    original_title: 'Why do Korean convenience stores have an entire wall of pouch drinks with ice cups? We need this in every US city immediately.',
    original_body: 'Walked into a convenience store in Seoul at 2 AM, grabbed a hazelnut coffee pouch for $1.50 and a cup of ice. Why is this simple genius concept not standard everywhere in America?',
    author_anonymous_id: 'Curator · US-33F',
    created_at: '5시간 전',
    timestamp: 1730540000,
    upvotes: 412,
    keywords: ['한국편의점', '파우치음료', '얼음컵', 'K컬처'],
    translations: {
      ko: {
        title: '왜 한국 편의점에는 얼음컵이랑 타먹는 파우치 음료가 벽면 가득 있나요? 미국에도 당장 도입해야 합니다.',
        body: '새벽 2시에 서울 편의점에 들어가서 1.5달러짜리 헤이즐넛 커피 파우치랑 얼음컵을 샀습니다. 왜 이렇게 단순하고 천재적인 시스템이 미국에는 기본으로 없는 거죠?',
        summary: [
          '미국 여행객이 한국 편의점의 2,000원대 얼음컵+파우치 음료 조합을 소개해 100만 조회수 돌파',
          '저렴한 가격과 밤낮없이 커스텀 음료를 만들어 마시는 문화에 영미권 유저들이 열광함',
          '현재 복숭아 아이스티+샷 추가(아샷추) 등 한국식 편의점 꿀조합 레시피까지 공유되는 중'
        ],
        why_trending: '고물가 시대에 미국 카페 음료 가격이 7~8달러를 넘어가면서, 가성비와 재미를 모두 잡은 한국식 편의점 문화가 대안으로 주목받음.',
        cultural_context: '한국의 촘촘한 24시간 편의점 인프라와 특유의 ‘꿀조합(Modisumer)’ 문화가 결합된 대표 사례로, 외국인들에게는 하나의 엔터테인먼트 공간으로 인식됩니다.',
        discussion_prompt: '외국 친구들에게 가장 추천하고 싶은 나만의 편의점 꿀조합이 있다면 무엇인가요?'
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
        cultural_context: 'Korean convenience stores act as 24-hour social hubs where consumers actively invent DIY recipes ("Modisumers").',
        discussion_prompt: 'What is your favorite convenience store hack or drink combo?'
      }
    },
    reactions: { empathy: 215, funny: 94, surprised: 76, controversial: 15, ambiguous: 9, angry: 3 },
    country_breakdown: [
      { country: 'US', total: 190, top: [{ type: 'empathy', pct: 65 }, { type: 'surprised', pct: 25 }] },
      { country: 'KR', total: 140, top: [{ type: 'funny', pct: 55 }, { type: 'empathy', pct: 38 }] },
      { country: 'JP', total: 52, top: [{ type: 'empathy', pct: 60 }, { type: 'surprised', pct: 20 }] }
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
        upvotes: 68,
        is_best: true,
        folded: false
      },
      {
        id: 'c-4',
        anonymous_id: 'Anon · XX-001',
        access_country: 'UNKNOWN',
        original_language: 'en',
        original_text: 'Just make coffee at home, stop hyping plastic waste.',
        translated_ko: '그냥 집에서 커피 타 마셔라, 플라스틱 쓰레기 좀 그만 찬양하고.',
        translated_en: 'Just make coffee at home, stop hyping plastic waste.',
        upvotes: 2,
        is_best: false,
        folded: true
      }
    ]
  },
  {
    id: 'post-103',
    type: 'native',
    category: 'cultural_difference',
    region_group: 'EU',
    access_country: 'DE',
    source_name: 'Commonworld Original',
    source_url: '',
    original_language: 'ko',
    original_title: '독일/유럽 직장인분들, 점심시간에 운동(수영이나 헬스) 다녀오시나요?',
    original_body: '프랑크푸르트 근교에서 근무 중인데 점심시간 짬을 내서 35분 정도 짧고 굵게 웨이트를 하거나 아침 일찍 수영을 다니고 있습니다. 다른 국가에서 일하시는 분들은 평일 체력 관리를 어떤 루틴으로 하시는지 궁금합니다!',
    author_anonymous_id: 'Writer · DE-77W',
    created_at: '1일 전',
    timestamp: 1730480000,
    upvotes: 96,
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
        cultural_context: '유럽 오피스 밀집 지역(프랑크푸르트, 런던 등)에서는 점심시간(Lunch break)을 활용해 근처 짐에서 30~40분간 운동 후 간단히 샐러드나 프로틴으로 식사하는 직장인 비중이 높습니다.',
        discussion_prompt: '평일 일과 중 가장 선호하는 운동 시간대(출근 전 / 점심 / 퇴근 후)는 언제인가요?'
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
        cultural_context: 'In European financial and business hubs, midday express gym sessions followed by a quick desk lunch are increasingly popular.',
        discussion_prompt: 'When do you prefer to work out on weekdays: early morning, lunch break, or after work?'
      }
    },
    reactions: { empathy: 64, surprised: 18, funny: 6, ambiguous: 4, controversial: 2, angry: 0 },
    country_breakdown: [
      { country: 'DE', total: 42, top: [{ type: 'empathy', pct: 74 }, { type: 'surprised', pct: 16 }] },
      { country: 'KR', total: 35, top: [{ type: 'empathy', pct: 60 }, { type: 'surprised', pct: 28 }] }
    ],
    comments: [
      {
        id: 'c-5',
        anonymous_id: 'Anon · GB-12L',
        access_country: 'GB',
        original_language: 'en',
        original_text: 'Lunch workout is the best! Leaves the evening completely free for family and kids.',
        translated_ko: '점심 운동이 최고죠! 퇴근 후 저녁 시간을 온전히 가족들과 보낼 수 있어서 정말 좋습니다.',
        translated_en: 'Lunch workout is the best! Leaves the evening completely free for family and kids.',
        upvotes: 22,
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

  // 각 카드별 상태 관리 (Smart Preview 열림 여부, 원문 보기 토글, 접힌 댓글 펼침 여부)
  const [expandedPostIds, setExpandedPostIds] = useState({ 'post-101': true });
  const [showOriginalIds, setShowOriginalIds] = useState({});
  const [unfoldedCommentIds, setUnfoldedCommentIds] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // 새 글 작성 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostType, setNewPostType] = useState('native');
  const [newPostCategory, setNewPostCategory] = useState('global_debate');
  const [newPostCountry, setNewPostCountry] = useState('DE');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostSource, setNewPostSource] = useState('');

  const t = UI_TEXT[lang];

  // 필터링 및 정렬된 게시글 목록
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (selectedCountry !== 'ALL') {
          if (selectedCountry === 'EU' && post.region_group !== 'EU') return false;
          if (selectedCountry !== 'EU' && post.access_country !== selectedCountry) return false;
        }
        if (selectedCategory !== 'all' && post.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const trans = post.translations[lang];
          const matchTitle = trans.title.toLowerCase().includes(q) || post.original_title.toLowerCase().includes(q);
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

  // 인터랙션 핸들러
  const toggleExpand = (postId) => {
    setExpandedPostIds((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleOriginal = (postId) => {
    setShowOriginalIds((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReaction = (postId, reactionType) => {
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

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

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
      prev.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post))
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    const createdPost = {
      id: `post-${Date.now()}`,
      type: newPostType,
      category: newPostCategory,
      region_group: COUNTRY_META[newPostCountry]?.region || 'OTHER',
      access_country: newPostCountry,
      source_name: newPostType === 'external' ? newPostSource || 'External Link' : 'Commonworld Original',
      source_url: newPostType === 'external' ? 'https://commonworld.vercel.app' : '',
      original_language: lang,
      original_title: newPostTitle,
      original_body: newPostBody,
      author_anonymous_id: `Anon · ${newPostCountry}-NEW`,
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
          discussion_prompt: '이 주제에 대해 여러분의 국가에서는 어떻게 생각하나요?'
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
          discussion_prompt: 'How is this viewed in your country?'
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
      {/* 상단 프로토타입 상태 배너 */}
      <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 text-center text-xs text-sky-300 flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
        <span>{t.prototypeBanner}</span>
      </div>

      {/* 메인 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 shadow-lg shadow-sky-500/20">
              <Globe className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">{t.siteTitle}</h1>
                <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                  BETA
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.sloganPrimary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* 언어 전환 버튼 */}
            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-sky-500/50 hover:text-sky-400 transition"
            >
              <Languages className="h-4 w-4 text-sky-400" />
              <span>{lang === 'ko' ? 'English' : '한국어'}</span>
            </button>

            {/* 새 글 등록 버튼 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition shadow-md shadow-sky-500/10"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.newPostBtn}</span>
            </button>
          </div>
        </div>

        {/* 국가별 탭 & 검색창 바 */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
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
            <div className="relative flex-1 md:w-64">
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

      {/* 본문 레이아웃 */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
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
                className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 md:p-6 space-y-4 hover:border-slate-700/80 transition shadow-lg shadow-black/20"
              >
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

                {/* 제목 및 본문 영역 */}
                <div className="space-y-2">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {showOriginal ? post.original_title : trans.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {showOriginal ? post.original_body : trans.body}
                  </p>
                </div>

                {/* 키워드 태그 & 원문/번역 토글 바 */}
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
                      onClick={() => toggleOriginal(post.id)}
                      className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition"
                    >
                      {showOriginal ? t.showTranslatedText : `${t.showOriginalText} (${post.original_language.toUpperCase()})`}
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

                {/* 감정 반응 투표 바 & Smart Preview 열기 버튼 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.entries(REACTION_META).map(([key, meta]) => {
                      const count = post.reactions[key] || 0;
                      return (
                        <button
                          key={key}
                          onClick={() => handleReaction(post.id, key)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/90 px-2.5 py-1.5 text-xs hover:border-sky-500/40 hover:bg-slate-900 transition"
                        >
                          <span>{meta.emoji}</span>
                          <span className="text-slate-400">{lang === 'ko' ? meta.label_ko : meta.label_en}</span>
                          <span className="font-bold text-slate-200">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 px-3.5 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/25 transition"
                  >
                    <span>{isExpanded ? t.closeSmartPreview : t.openSmartPreview}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* --- 확장 영역: Smart Preview + 국가별 반응 비교 + 다국어 댓글 --- */}
                {isExpanded && (
                  <div className="mt-4 space-y-5 border-t border-slate-800 pt-5 animate-fadeIn">
                    {/* 1. AI Smart Preview 카드 */}
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
                        <p className="text-xs text-slate-300 leading-relaxed">{trans.cultural_context}</p>
                      </div>
                    </div>

                    {/* 2. 국가별 감정 반응 비교 바 */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-white">{t.countryReactionsTitle}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {post.country_breakdown.map((item, idx) => {
                          const cMeta = COUNTRY_META[item.country] || COUNTRY_META.UNKNOWN;
                          return (
                            <div
                              key={idx}
                              className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3 flex flex-col justify-between gap-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-200">
                                  {cMeta.flag} {lang === 'ko' ? cMeta.name_ko : cMeta.name_en}
                                </span>
                                <span className="text-slate-400">{item.total}명 참여</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.top.map((r, rIdx) => {
                                  const rMeta = REACTION_META[r.type];
                                  return (
                                    <span
                                      key={rIdx}
                                      className="rounded-md bg-slate-950 px-2 py-1 text-[11px] text-slate-300 border border-slate-800"
                                    >
                                      {rMeta?.emoji} {lang === 'ko' ? rMeta?.label_ko : rMeta?.label_en} <b>{r.pct}%</b>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. 실시간 다국어 댓글 영역 */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                        <span>{t.allCommentsTitle} ({post.comments.length})</span>
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
                                  <span className="font-semibold text-slate-300">{cmt.anonymous_id}</span>
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

                      {/* 댓글 입력 폼 */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          placeholder={t.commentPlaceholder}
                          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
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

      {/* 하단 프라이버시 & 아키텍처 푸터 */}
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
                    {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {lang === 'ko' ? c.label_ko : c.label_en}
                      </option>
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
                    <option value="DE">🇩🇪 Germany (독일)</option>
                    <option value="KR">🇰🇷 Korea (한국)</option>
                    <option value="US">🇺🇸 USA (미국)</option>
                    <option value="JP">🇯🇵 Japan (일본)</option>
                    <option value="GB">🇬🇧 UK (영국)</option>
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
