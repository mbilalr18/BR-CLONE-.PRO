
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h2>
      </div>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <p className="text-lg text-slate-600 leading-relaxed">
            BR Clone Pro is developed and maintained by <span className="font-bold text-slate-900">M. Bilal</span>. 
            We respect your privacy and are committed to protecting it.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">📌</span> Data Collection
          </h3>
          <p className="text-slate-600">The app does not collect personal user data such as name, email, or phone number.</p>
          <p className="text-slate-600">Any text, links, or voice samples provided by the user are used only to perform the requested function (transcription or AI voice generation).</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">🎙️</span> Voice & Audio Processing
          </h3>
          <p className="text-slate-600">All voices generated in this app are AI-generated. The app does not replicate or impersonate real individuals without explicit user intent for content creation.</p>
          <p className="text-slate-600">Uploaded voice samples are processed temporarily and are not stored permanently by the app server.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">🎥</span> Video Links
          </h3>
          <p className="text-slate-600">TikTok and YouTube links are processed only to extract transcripts. The app does not download, store, or redistribute video content.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">🔐</span> Data Security
          </h3>
          <p className="text-slate-600">API requests are securely transmitted. No user content is shared with third parties beyond the required AI services used for processing.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">⚠️</span> User Responsibility
          </h3>
          <p className="text-slate-600">Users must ensure they have the legal right to use any text, voice, or video link submitted. The developer is not responsible for misuse of the app.</p>
        </section>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            <p className="font-bold">Contact Developer:</p>
            <p>Developer: M. Bilal</p>
            <a href="mailto:mbilalr18@gmail.com" className="text-blue-600 hover:underline">mbilalr18@gmail.com</a>
          </div>
          <p className="text-xs text-slate-400 italic">Last updated: May 2024</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
