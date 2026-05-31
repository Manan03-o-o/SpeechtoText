import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token injection
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth API ---

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Registration failed';
    throw new Error(errorMsg);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Login failed';
    throw new Error(errorMsg);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch user';
    throw new Error(errorMsg);
  }
};

// --- Transcription API ---

export const transcribeAudioFile = async (audioFile) => {
  const formData = new FormData();
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

export default api;
