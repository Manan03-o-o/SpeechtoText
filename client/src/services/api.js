import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2-minute timeout for larger audio files transcribing via OpenAI
});

export const transcribeAudioFile = async (audioFile) => {
  const formData = new FormData();
  // Key must match multer's expected field name: 'audio'
  formData.append('audio', audioFile);

  try {
    const response = await api.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Error occurred during transcription';
    throw new Error(errorMsg);
  }
};

export const fetchTranscriptions = async () => {
  try {
    const response = await api.get('/transcriptions');
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Error fetching history';
    throw new Error(errorMsg);
  }
};

export const deleteTranscriptionById = async (id) => {
  try {
    const response = await api.delete(`/transcriptions/${id}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Error deleting transcription';
    throw new Error(errorMsg);
  }
};

export default {
  transcribeAudioFile,
  fetchTranscriptions,
  deleteTranscriptionById,
};
