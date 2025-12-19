
import React, { useState, useEffect } from 'react';

interface AdPopupProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AdPopup: React.FC<AdPopupProps> = ({ isOpen, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      return;
    }

    if (timeLeft === 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-8 text-center text-white">
          <div className="absolute top-4 right-4 bg-black/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            Advertisement
          </div>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h3 className="text-xl font-black mb-1">BR CLONE <span className="text-blue-200">PRO</span></h3>
          <p className="text-sm text-blue-100 opacity-80">Free Forever • Powered by Community Ads</p>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-slate-600 font-medium mb-6">
            Supporting your free content creation studio...
          </p>
          
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Countdown Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={226}
                strokeDashoffset={226 - (226 * (5 - timeLeft)) / 5}
                className="text-blue-600 transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-3xl font-black text-slate-800">{timeLeft}</span>
          </div>

          <p className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {timeLeft > 0 ? 'Your result is arriving shortly' : 'Starting generation...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
