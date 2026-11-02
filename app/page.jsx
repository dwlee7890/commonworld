'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const UI_TEXT = {
  ko: {
    siteTitle: 'Commonworld',
    sloganPrimary: '읽는 언어는 달라도, 대화는 하나로.',
    badge: '🚀 Commonworld Phase 1 배포 성공!',
    desc: '0원 무자본 글로벌 호스팅(Vercel)과 깃허브 연결이 완벽하게 완료되었습니다. 복잡한 경로 에러 없이 단일 구조로 깔끔하게 작동합니다.',
    previewTitle: '샘플 게시글 프리뷰',
    countryLabel: '🇩🇪 독일에서 작성',
    postTitle: '독일 캠핑장 정전 때 한국 전기차 V2L로 캠핑장을 구한 후기',
    postSummary: '전기차 V2L 어댑터 덕분에 커피머신과 냉장고를 문제없이 가동함.'
  },
  en: {
    siteTitle: 'Commonworld',
    sloganPrimary: 'Different languages to read, one conversation to share.',
    badge: '🚀 Commonworld Phase 1 Deployed!',
    desc: 'Zero-budget global hosting (Vercel) and GitHub integration are now live and working cleanly.',
    previewTitle: 'Sample Post Preview',
    countryLabel: '🇩🇪 Posted from Germany',
    postTitle: 'Power outage while camping: How a Korean EV V2L saved the camp',
    postSummary: 'Used EV V2L adapter to run coffee machine and fridge effortlessly.'
  }
};

export default function GlobalCommunityHomePage() {
  const [lang, setLang] = useState('ko');
  const t = UI_TEXT[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-slate-950 font-bold">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">{t.siteTitle}</h1>
              <p className="text-xs text-slate-400">{t.sloganPrimary}</p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-slate-700"
          >
            {lang === 'ko' ? 'English' : '한국어'}
          </button>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">{t.badge}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{t.desc}</p>
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">{t.previewTitle}</h3>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Reddit · r/Elektroautos</span>
                <span>{t.countryLabel}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{t.postTitle}</h4>
              <p className="text-xs text-slate-300">{t.postSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
