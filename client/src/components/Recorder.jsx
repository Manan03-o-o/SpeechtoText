import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaCheck } from 'react-icons/fa';

const Recorder = ({ onAudioRecorded, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Clean up timer and media streams on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setAudioUrl(null);
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine supported mime type
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/ogg' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Turn off microphone tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // get chunks every 250ms
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const useRecording = () => {
    if (audioBlob) {
      const extension = audioBlob.type.includes('ogg') ? 'ogg' : 'webm';
      const file = new File(
        [audioBlob],
        `voice-recording-${Date.now()}.${extension}`,
        { type: audioBlob.type }
      );
      onAudioRecorded(file);
      deleteRecording(); // Clear recorder state on select
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-slate-700/60 bg-slate-900/20 rounded-2xl w-full">
      {/* Visual State Indicators */}
      {!isRecording && !audioUrl && (
        <div className="flex flex-col items-center py-4">
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/40 shadow-lg shadow-rose-500/5 hover:shadow-rose-500/10 transition-all duration-300 transform hover:scale-105"
          >
            <FaMicrophone className="text-2xl" />
          </button>
          <span className="mt-3 text-sm text-slate-300 font-medium">
            Start Voice Recording
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Tap mic to capture voice note
          </span>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col items-center py-4 w-full">
          {/* Pulsing visual animation */}
          <div className="relative flex items-center justify-center mb-6">
            <span className="absolute inline-flex h-16 w-16 rounded-full bg-rose-500 opacity-20 animate-ping"></span>
            <button
              onClick={stopRecording}
              className="relative flex items-center justify-center w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 transition-all"
            >
              <FaStop className="text-xl" />
            </button>
          </div>

          <span className="text-2xl font-semibold text-slate-100 tabular-nums">
            {formatTime(recordingTime)}
          </span>
          <span className="text-xs text-rose-400 flex items-center gap-1.5 mt-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Recording... Click to stop
          </span>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex flex-col items-center py-2 w-full">
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
            className="hidden"
          />

          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Delete button */}
            <button
              onClick={deleteRecording}
              className="p-3 text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/20 rounded-xl transition-all"
              title="Discard Recording"
            >
              <FaTrash className="text-base" />
            </button>

            {/* Play/Pause button */}
            <button
              onClick={togglePlayback}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/25 transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg ml-0.5" />}
            </button>

            {/* Accept / Select Button */}
            <button
              onClick={useRecording}
              className="p-3 text-slate-400 hover:text-emerald-400 bg-slate-800/60 hover:bg-emerald-500/10 border border-slate-700/50 hover:border-emerald-500/20 rounded-xl transition-all"
              title="Apply Recording"
            >
              <FaCheck className="text-base" />
            </button>
          </div>

          <span className="text-sm font-medium text-slate-300">
            Voice Note Captured
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Play back or click checkmark to prepare transcription
          </span>
        </div>
      )}
    </div>
  );
};

export default Recorder;
