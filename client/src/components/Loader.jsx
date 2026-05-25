import React from 'react';

const Loader = ({ message = 'Transcribing your audio... Please wait.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 glass-panel rounded-2xl max-w-md mx-auto text-center border-brand-500/20 shadow-lg shadow-brand-500/5">
      {/* Dynamic Sound Wave Animation */}
      <div className="flex items-end justify-center gap-1.5 h-16 w-full">
        <span className="w-1.5 bg-brand-500 rounded-full animate-[bounce_1s_infinite_100ms] h-8"></span>
        <span className="w-1.5 bg-violet-400 rounded-full animate-[bounce_1s_infinite_200ms] h-14"></span>
        <span className="w-1.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_300ms] h-10"></span>
        <span className="w-1.5 bg-purple-500 rounded-full animate-[bounce_1s_infinite_400ms] h-16"></span>
        <span className="w-1.5 bg-brand-400 rounded-full animate-[bounce_1s_infinite_500ms] h-11"></span>
        <span className="w-1.5 bg-violet-500 rounded-full animate-[bounce_1s_infinite_600ms] h-6"></span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-100 animate-pulse">
          Processing Audio
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          {message}
        </p>
      </div>

      {/* Modern Spinner */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700/60"></div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
