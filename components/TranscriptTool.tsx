
import React, { useState } from 'react';
import { fetchTranscript } from '../services/geminiService';
import { TranscriptResult } from '../types';
import AdPopup from './AdPopup';

const TranscriptTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartProcess = () => {
    if (!url.trim()) return;
    setResult(null);
    setError(null);
    setShowAd(true);
  };

  const executeGeneration = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const data = await fetchTranscript(url);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch transcript. Please ensure the TikTok or YouTube URL is valid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.fullText);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdPopup isOpen={showAd} onComplete={executeGeneration} />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL (TikTok or YouTube)</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="https://www.tiktok.com/... or https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleStartProcess}
            disabled={loading || !url}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center min-w-[200px] ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : 'Generate Transcript'}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Supports TikTok shorts, long-form YouTube videos, and YouTube Shorts.</p>
        {error && <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
            <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              With Timestamps
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {result.withTimestamps.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-blue-600 font-mono text-sm bg-blue-50 px-2 py-1 rounded h-fit shrink-0">{item.timestamp}</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Full Transcript
              </h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy Text
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.fullText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptTool;
