
import React, { useState, useRef, useMemo } from 'react';
import { generateClonedVoice } from '../services/geminiService';
import { decodeBase64, decodeAudioData, createWavBlob } from '../utils/audioUtils';
import { AVAILABLE_VOICES, JOKER_MODES } from '../types';
import AdPopup from './AdPopup';

const VoiceCloneTool: React.FC = () => {
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

  const MAX_WORDS = 10000;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVoiceFile(e.target.files[0]);
    }
  };

  const handleStartProcess = () => {
    if (!text.trim()) return;
    if (wordCount > MAX_WORDS) {
      setError(`Text exceeds the maximum limit of ${MAX_WORDS} words.`);
      return;
    }
    setAudioUrl(null);
    setError(null);
    setShowAd(true);
  };

  const executeGeneration = async () => {
    setShowAd(false);
    setLoading(true);
    setError(null);

    try {
      const selectedVoice = AVAILABLE_VOICES.find(v => v.id === selectedVoiceId);
      
      let voiceDescription = selectedVoice?.description || "a professional narrator";
      
      if (selectedVoiceId === 'Joker') {
        const modeData = JOKER_MODES.find(m => m.id === selectedJokerMode);
        voiceDescription += `. Act in ${modeData?.label} style: ${modeData?.description}.`;
      }

      if (voiceFile) {
        voiceDescription = `Clone the specific pitch and vocal texture from the sample: ${voiceFile.name}. Blend it with: ${voiceDescription}`;
      }

      const base64Audio = await generateClonedVoice(text, voiceDescription, selectedVoiceId);
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioCtx);
      
      const wavBlob = createWavBlob(audioBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (err) {
      setError('Voice synthesis failed. Please try a shorter text or check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <AdPopup isOpen={showAd} onComplete={executeGeneration} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Reference Voice</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                  voiceFile ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}>
                  <svg className={`w-8 h-8 mb-2 ${voiceFile ? 'text-blue-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                  <p className="text-xs font-medium text-slate-600 text-center truncate w-full">
                    {voiceFile ? voiceFile.name : 'Upload sample (10-30s)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Voice Model</label>
              <div className="space-y-2">
                {AVAILABLE_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoiceId(voice.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      selectedVoiceId === voice.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${selectedVoiceId === voice.id ? 'text-blue-700' : 'text-slate-700'}`}>
                        {voice.name}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{voice.description}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      voice.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 
                      voice.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {voice.gender}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {selectedVoiceId === 'Joker' && (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  Joker Personality Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {JOKER_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedJokerMode(mode.id)}
                      title={mode.description}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                        selectedJokerMode === mode.id
                          ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="text-lg">{mode.icon}</span>
                      <span className="text-[10px] font-black uppercase">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Text Input & Generation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Content Editor</label>
              <span className={`text-xs font-bold ${wordCount > MAX_WORDS ? 'text-red-500' : 'text-slate-400'}`}>
                {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
              </span>
            </div>
            
            <textarea
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none min-h-[400px] text-slate-700 leading-relaxed"
              placeholder="Paste up to 10,000 words here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={handleStartProcess}
              disabled={loading || !text || wordCount > MAX_WORDS}
              className={`w-full py-4 rounded-2xl font-black text-white text-lg tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-xl shadow-blue-200'
              }`}
            >
              {loading ? (
                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM13 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM14.243 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z"></path></svg>
                  Generate Voice Synthesis
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in shake-1 duration-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="mt-2 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.414 0A5.982 5.982 0 0115 10a5.982 5.982 0 01-1.757 4.243 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.414 0A5.982 5.982 0 0115 10a5.982 5.982 0 01-1.757 4.243 1 1 0 01-1.414-1.414A3.982 3.982 0 0013 10a3.982 3.982 0 00-1.172-2.828a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </div>
                  <audio ref={audioRef} controls src={audioUrl} className="flex-1 h-10 custom-audio-player" />
                </div>
                <div className="flex gap-3 w-full">
                  <a
                    href={audioUrl}
                    download="cloned_voice.wav"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-blue-200 rounded-xl text-sm font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download WAV HD
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCloneTool;
