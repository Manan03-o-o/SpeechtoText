import React, { useState } from 'react';
import { FaRegCopy, FaCheck, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

const TranscriptionCard = ({ transcription }) => {
  const [copied, setCopied] = useState(false);

  if (!transcription) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription.transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border-brand-500/20 shadow-xl shadow-brand-500/5 animate-fade-in space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-darkBorder pb-4">
        <div className="flex items-center gap-2.5 text-slate-300">
          <FaFileAlt className="text-brand-400 text-lg flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[240px] sm:max-w-[400px]">
              {transcription.filename}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <FaCalendarAlt className="text-[10px]" />
              <span>{formatDate(transcription.createdAt || new Date())}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:text-white hover:border-brand-500/40 hover:bg-slate-800/80'
          }`}
        >
          {copied ? (
            <>
              <FaCheck className="text-xs" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FaRegCopy className="text-xs" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      {/* Transcription content body */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">
          Transcription Text
        </label>
        <div className="w-full min-h-[140px] max-h-[300px] overflow-y-auto p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-brand-500/35">
          {transcription.transcription}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionCard;
