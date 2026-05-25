import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  transcribeAudio,
  getTranscriptions,
  deleteTranscription,
} from '../controllers/transcribeController.js';

const router = express.Router();

// Route for transcription: takes an audio file (key: 'audio')
router.post('/transcribe', upload.single('audio'), transcribeAudio);

// Route for fetching all transcriptions
router.get('/transcriptions', getTranscriptions);

// Route for deleting a specific transcription
router.delete('/transcriptions/:id', deleteTranscription);

export default router;
