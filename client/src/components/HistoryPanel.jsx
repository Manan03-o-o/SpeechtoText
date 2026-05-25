import React from 'react';
import { FaHistory, FaRegTrashAlt, FaChevronRight, FaHeadphones } from 'react-icons/fa';

const HistoryPanel = ({
  history,
  onItemSelect,
  onItemDelete,
  selectedId,
  isLoading,
}) => {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border-slate-700/60 shadow-lg flex flex-col h-full min-h-[400px]">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-darkBorder pb-4 mb-4">
        <FaHistory className="text-brand-400 text-lg" />
        <h3 className="text-base font-semibold text-slate-100">
          Transcription History
        </h3>
        {history.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
            {history.length}
          </span>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[500px] md:max-h-[550px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400">Loading history...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800/30 flex items-center justify-center mb-3 border border-slate-800/60">
              <FaHistory className="text-slate-500 text-lg" />
            </div>
            <p className="text-sm font-medium text-slate-400">No transcriptions yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
              Upload an audio file or record voice above to start.
            </p>
          </div>
        ) : (
          history.map((item) => {
            const isSelected = selectedId === item._id;
            return (
              <div
                key={item._id}
                onClick={() => onItemSelect(item)}
                className={`group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500/40 text-white shadow-md shadow-brand-500/5'
                    : 'bg-slate-900/30 border-slate-800/80 text-slate-300 hover:bg-slate-800/30 hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    <FaHeadphones className="text-sm" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p
                      className={`text-xs font-semibold truncate max-w-[140px] sm:max-w-[200px] ${
                        isSelected ? 'text-slate-100' : 'text-slate-300'
                      }`}
                    >
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemDelete(item._id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete item"
                  >
                    <FaRegTrashAlt className="text-xs" />
                  </button>
                  <FaChevronRight
                    className={`text-[10px] transition-transform ${
                      isSelected ? 'text-brand-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
