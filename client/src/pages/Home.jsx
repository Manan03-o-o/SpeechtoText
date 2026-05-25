import React, { useState, useEffect } from 'react';
import { transcribeAudioFile, fetchTranscriptions, deleteTranscriptionById } from '../services/api';
import Navbar from '../components/Navbar';
import UploadBox from '../components/UploadBox';
import Recorder from '../components/Recorder';
import TranscriptionCard from '../components/TranscriptionCard';
import Loader from '../components/Loader';
import HistoryPanel from '../components/HistoryPanel';
import { FaCloudUploadAlt, FaMicrophone, FaPlay, FaExclamationTriangle } from 'react-icons/fa';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTranscription, setActiveTranscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'record'
  
  // Custom toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4500);
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetchTranscriptions();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load transcription history.', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      showToast('Please select or record an audio file first.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await transcribeAudioFile(selectedFile);
      if (res.success) {
        setActiveTranscription(res.data);
        showToast('Audio transcribed successfully!', 'success');
        setSelectedFile(null); // Clear selected file
        loadHistory(); // Refresh history list
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error occurred during transcription.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setActiveTranscription(item);
  };

  const handleDeleteHistoryItem = async (id) => {
    if (confirm('Are you sure you want to delete this transcription?')) {
      try {
        const res = await deleteTranscriptionById(id);
        if (res.success) {
          showToast('Transcription deleted.', 'success');
          // If deleted item is currently selected, clear active view
          if (activeTranscription && activeTranscription._id === id) {
            setActiveTranscription(null);
          }
          loadHistory();
        }
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to delete transcription.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col pb-12">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Welcome Banner */}
        <header className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Transcribe Speech with{' '}
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Convert voice notes, interviews, and meetings into text instantly. Upload audio files or record directly in your browser using OpenAI Whisper.
          </p>
        </header>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Transcription Inputs & Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input Controls */}
            <div className="glass-panel rounded-2xl p-6 border-slate-700/60 shadow-lg">
              
              {/* Tab Selector */}
              <div className="flex p-1.5 bg-slate-950/60 rounded-xl mb-6 border border-slate-800">
                <button
                  onClick={() => {
                    if (!isProcessing) {
                      setActiveTab('upload');
                      setSelectedFile(null);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'upload'
                      ? 'bg-brand-600 text-white shadow shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  disabled={isProcessing}
                >
                  <FaCloudUploadAlt className="text-base" />
                  Upload File
                </button>
                <button
                  onClick={() => {
                    if (!isProcessing) {
                      setActiveTab('record');
                      setSelectedFile(null);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'record'
                      ? 'bg-brand-600 text-white shadow shadow-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  disabled={isProcessing}
                >
                  <FaMicrophone className="text-base" />
                  Record Audio
                </button>
              </div>

              {/* Dynamic Content based on Tab */}
              <div className="space-y-6">
                {activeTab === 'upload' ? (
                  <UploadBox
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    clearSelectedFile={handleClearFile}
                    isProcessing={isProcessing}
                  />
                ) : (
                  <Recorder
                    onAudioRecorded={handleFileSelect}
                    isProcessing={isProcessing}
                  />
                )}

                {/* Submit Action Button */}
                {selectedFile && (
                  <button
                    onClick={handleTranscribe}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:from-brand-800 disabled:to-indigo-800 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.99] transition-all"
                  >
                    <FaPlay className="text-xs" />
                    Transcribe Selected Audio
                  </button>
                )}
              </div>
            </div>

            {/* Transcription Display Card or Loader */}
            {isProcessing ? (
              <Loader message="Uploading and transcribing file... Large audio files might take up to a minute." />
            ) : (
              <TranscriptionCard transcription={activeTranscription} />
            )}

          </div>

          {/* Right Column - History Panel */}
          <div className="lg:col-span-5">
            <HistoryPanel
              history={history}
              onItemSelect={handleSelectHistoryItem}
              onItemDelete={handleDeleteHistoryItem}
              selectedId={activeTranscription?._id}
              isLoading={historyLoading}
            />
          </div>

        </div>
      </main>

      {/* Floating custom Toast notification banner */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl animate-fade-in max-w-sm sm:max-w-md ${
          toast.type === 'error'
            ? 'bg-rose-950/85 border-rose-500/30 text-rose-300'
            : 'bg-emerald-950/85 border-emerald-500/30 text-emerald-300'
        }`}>
          {toast.type === 'error' && <FaExclamationTriangle className="flex-shrink-0 text-rose-400 text-lg" />}
          <p className="text-xs sm:text-sm font-medium pr-2">
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
