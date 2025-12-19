
import React, { useState } from 'react';
import { AppTab } from './types';
import TranscriptTool from './components/TranscriptTool';
import VoiceCloneTool from './components/VoiceCloneTool';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TRANSCRIPT);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(AppTab.TRANSCRIPT)}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">BR CLONE <span className="text-blue-600">PRO</span></h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI Content Studio</p>
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab(AppTab.TRANSCRIPT)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === AppTab.TRANSCRIPT
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="hidden sm:inline">Transcript</span>
                <span className="sm:hidden">📝</span>
              </button>
              <button
                onClick={() => setActiveTab(AppTab.VOICE_CLONE)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === AppTab.VOICE_CLONE
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="hidden sm:inline">Voice Clone</span>
                <span className="sm:hidden">🎙️</span>
              </button>
              <button
                onClick={() => setActiveTab(AppTab.PRIVACY)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === AppTab.PRIVACY
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="hidden sm:inline">Privacy</span>
                <span className="sm:hidden">🛡️</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full">
        {activeTab !== AppTab.PRIVACY && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {activeTab === AppTab.TRANSCRIPT ? 'TikTok & YouTube Transcript Tool' : 'Pro Voice Cloning'}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {activeTab === AppTab.TRANSCRIPT 
                ? 'Paste a link to any TikTok or YouTube video and get a professional-grade transcript with precision timestamps in seconds.' 
                : 'Upload a 10-30 second audio sample and our AI will clone your voice with incredible accuracy and emotion.'}
            </p>
          </div>
        )}

        {activeTab === AppTab.TRANSCRIPT && <TranscriptTool />}
        {activeTab === AppTab.VOICE_CLONE && <VoiceCloneTool />}
        {activeTab === AppTab.PRIVACY && <PrivacyPolicy />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium mb-2">© 2024 BR Clone Pro Studio. Powered by Gemini AI.</p>
          <button 
            onClick={() => setActiveTab(AppTab.PRIVACY)}
            className="text-blue-600 hover:underline text-xs font-bold uppercase tracking-widest"
          >
            Privacy Policy
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
