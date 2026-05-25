import React, { useState, useRef } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaFileAudio, FaTimes } from 'react-icons/fa';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.mp4', '.webm', '.mpeg'];

const UploadBox = ({ onFileSelect, selectedFile, clearSelectedFile, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;

    // Check size
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. OpenAI Whisper limits files to 25MB.');
      return false;
    }

    // Check extension
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    if (!hasValidExt) {
      setError('Invalid file type. Please upload MP3, WAV, M4A, MP4, or WEBM.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const onButtonClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".mp3,.wav,.m4a,.mp4,.webm,audio/*"
        onChange={handleChange}
        disabled={isProcessing}
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center w-full min-h-[220px] p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/5Scale-[1.01]'
              : 'border-slate-700 bg-slate-900/30 hover:border-brand-500/60 hover:bg-slate-800/10'
          } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-slate-800/60 border border-slate-700/50 group-hover:border-brand-500/40">
            <IoMdCloudUpload className="text-3xl text-slate-400 group-hover:text-brand-400 transition-colors" />
          </div>
          <p className="mb-2 text-sm text-slate-200">
            <span className="font-semibold text-brand-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-400">
            MP3, WAV, M4A, MP4, or WEBM (Max 25MB)
          </p>

          {error && (
            <div className="mt-4 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg animate-fade-in">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between w-full p-4 border border-slate-700/60 rounded-xl bg-slate-900/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400">
              <FaFileAudio className="text-xl" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-[300px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelectedFile();
                setError('');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              title="Remove file"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
