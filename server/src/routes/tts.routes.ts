import { Router } from 'express';
import { generateAudio, getAudioUrl, getVoices } from '../controllers/tts.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Generate TTS audio
router.post('/generate', generateAudio);

// Get TTS URL
router.get('/url', getAudioUrl);

// Get available voices
router.get('/voices', getVoices);

export default router;
