
import React, { useState } from 'react';
import { fetchTranscript } from '../services/geminiService';
import { TranscriptResult } from '../types';
import AdPopup from './AdPopup';

interface Props {
  isPro?: boolean;
}

const TranscriptTool: React.FC<Props> = ({ isPro }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartProcess = () => {
    if (!url.trim()) return;
    setResult(null);
    setError(null);
    
    if (isPro) {
      executeGeneration();
    } else {
      setShowAd(true);
    }
  };

  const executeGeneration = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const data = await fetchTranscript(url);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch transcript. Check your URL.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.fullText);
      alert('Copied!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdPopup isOpen={showAd} onComplete={executeGeneration} />
      
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Video Link</label>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Paste TikTok or YouTube link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleStartProcess}
            disabled={loading || !url}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg shadow-blue-100 ${
              loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Extract Transcript'}
          </button>
        </div>
        {error && <p className="mt-3 text-red-500 text-xs font-bold">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 max-h-[400px] overflow-y-auto no-scrollbar">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Timestamps</h3>
            <div className="space-y-4">
              {result.withTimestamps.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg shrink-0">{item.timestamp}</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Full Text</h3>
              <button onClick={copyToClipboard} className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Copy All</button>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-h-[300px] overflow-y-auto no-scrollbar">{result.fullText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptTool;
