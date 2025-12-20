
import React, { useState, useRef, useMemo } from 'react';
import { generateClonedVoice } from '../services/geminiService';
import { decodeBase64, decodeAudioData, createWavBlob } from '../utils/audioUtils';
import { AVAILABLE_VOICES, JOKER_MODES } from '../types';
import AdPopup from './AdPopup';

interface Props {
  isPro?: boolean;
}

const VoiceCloneTool: React.FC<Props> = ({ isPro }) => {
  const [text, setText] = useState('');
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState(AVAILABLE_VOICES[0].id);
  const [selectedJokerMode, setSelectedJokerMode] = useState('calm');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const MAX_WORDS = isPro ? 10000 : 1000;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVoiceFile(e.target.files[0]);
    }
  };

  const handleStartProcess = () => {
    if (!text.trim()) return;
    if (wordCount > MAX_WORDS) {
      setError(`Free limit: ${MAX_WORDS} words. Go Pro for 10k!`);
      return;
    }
    setAudioUrl(null);
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
    setError(null);

    try {
      const selectedVoice = AVAILABLE_VOICES.find(v => v.id === selectedVoiceId);
      let voiceDescription = selectedVoice?.description || "narrator";
      
      if (selectedVoiceId === 'Joker') {
        const modeData = JOKER_MODES.find(m => m.id === selectedJokerMode);
        voiceDescription += `. Style: ${modeData?.description}.`;
      }

      if (voiceFile) {
        voiceDescription = `Clone sample: ${voiceFile.name}. Blend with: ${voiceDescription}`;
      }

      const base64Audio = await generateClonedVoice(text, voiceDescription, selectedVoiceId);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioCtx);
      const wavBlob = createWavBlob(audioBuffer);
      setAudioUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      setError('Failed. Try shorter text.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <AdPopup isOpen={showAd} onComplete={executeGeneration} />

      <div className="flex flex-col gap-6">
        {/* Sample Selection */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference Sample</label>
          <div className="relative h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center group overflow-hidden">
            <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600 px-4 truncate">{voiceFile ? voiceFile.name : 'Tap to upload audio sample'}</p>
            </div>
          </div>
        </div>

        {/* Model Selection - Horizontal Scroll on Mobile */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Voice Profile</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
            {AVAILABLE_VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoiceId(voice.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl border text-sm font-bold transition-all ${
                  selectedVoiceId === voice.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {voice.name}
              </button>
            ))}
          </div>
        </div>

        {selectedVoiceId === 'Joker' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-red-500">Joker Emotion</label>
             <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
               {JOKER_MODES.map((mode) => (
                 <button
                   key={mode.id}
                   onClick={() => setSelectedJokerMode(mode.id)}
                   className={`flex-shrink-0 px-4 py-3 rounded-2xl border flex items-center gap-2 transition-all ${
                     selectedJokerMode === mode.id ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'bg-slate-50 border-slate-100 text-slate-600'
                   }`}
                 >
                   <span>{mode.icon}</span>
                   <span className="text-xs font-black uppercase">{mode.label}</span>
                 </button>
               ))}
             </div>
          </div>
        )}

        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col gap-4">
          <textarea
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[200px]"
            placeholder="Paste text for synthesis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleStartProcess}
            disabled={loading || !text}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all shadow-xl ${
              loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Synthesizing...' : 'Generate Voice'}
          </button>
          {error && <p className="text-center text-red-500 text-xs font-bold">{error}</p>}
        </div>

        {audioUrl && (
          <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
            <audio ref={audioRef} controls src={audioUrl} className="w-full h-10 invert brightness-100" />
            <a href={audioUrl} download="clone.wav" className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-lg">Download File</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCloneTool;
