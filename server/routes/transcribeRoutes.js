import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  transcribeAudio,
  getTranscriptions,
  deleteTranscription,
} from '../controllers/transcribeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.post('/transcribe', protect, upload.single('audio'), transcribeAudio);
router.get('/transcriptions', protect, getTranscriptions);
router.delete('/transcriptions/:id', protect, deleteTranscription);

export default router;
