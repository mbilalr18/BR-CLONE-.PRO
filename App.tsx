
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import TranscriptTool from './components/TranscriptTool';
import VoiceCloneTool from './components/VoiceCloneTool';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TRANSCRIPT);
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('isPro') === 'true';
  });

  const togglePro = () => {
    const newState = !isPro;
    setIsPro(newState);
    localStorage.setItem('isPro', newState.toString());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-24">
      {/* Top Bar - Minimal for APK */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
            </svg>
          </div>
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            BR CLONE <span className="text-blue-600">{isPro ? 'PRO+' : 'PRO'}</span>
          </h1>
        </div>
        
        <button 
          onClick={togglePro}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
            isPro 
            ? 'bg-emerald-500 text-white' 
            : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}
        >
          {isPro ? 'Pro Active' : 'Go Pro (Ad-Free)'}
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        {activeTab !== AppTab.PRIVACY && (
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {activeTab === AppTab.TRANSCRIPT ? 'Video Transcript' : 'AI Voice Lab'}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === AppTab.TRANSCRIPT 
                ? 'Extract accurate text from any social video.' 
                : 'Clone voices with professional precision.'}
            </p>
          </div>
        )}

        {activeTab === AppTab.TRANSCRIPT && <TranscriptTool isPro={isPro} />}
        {activeTab === AppTab.VOICE_CLONE && <VoiceCloneTool isPro={isPro} />}
        {activeTab === AppTab.PRIVACY && <PrivacyPolicy />}
      </main>

      {/* Bottom Navigation - Standard for Apps */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around items-center px-4 py-3 safe-bottom z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab(AppTab.TRANSCRIPT)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === AppTab.TRANSCRIPT ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Extract</span>
        </button>

        <button
          onClick={() => setActiveTab(AppTab.VOICE_CLONE)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === AppTab.VOICE_CLONE ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Clone</span>
        </button>

        <button
          onClick={() => setActiveTab(AppTab.PRIVACY)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === AppTab.PRIVACY ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Privacy</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
