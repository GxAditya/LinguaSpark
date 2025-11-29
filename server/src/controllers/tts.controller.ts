import { Request, Response } from 'express';
import { generateTTS, getTTSUrl, availableVoices, TTSProvider } from '../services/tts.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// @desc    Generate TTS audio
// @route   POST /api/tts/generate
// @access  Private
export const generateAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'alloy', provider = 'pollinations' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      sendError(res, 400, 'Text is required');
      return;
    }

    const result = await generateTTS({
      text: text.trim(),
      voice,
      provider: provider as TTSProvider,
    });

    if (result.error) {
      sendError(res, 500, result.error);
      return;
    }

    sendSuccess(res, 200, 'Audio generated successfully', {
      audioUrl: result.audioUrl,
      audioBase64: result.audioBase64,
      provider: result.provider,
    });
  } catch (error) {
    console.error('Generate TTS error:', error);
    sendError(res, 500, 'Failed to generate audio');
  }
};

// @desc    Get TTS URL for client-side playback
// @route   GET /api/tts/url
// @access  Private
export const getAudioUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'alloy' } = req.query;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      sendError(res, 400, 'Text is required');
      return;
    }

    const audioUrl = getTTSUrl(text.trim(), voice as string);

    sendSuccess(res, 200, undefined, { audioUrl });
  } catch (error) {
    console.error('Get TTS URL error:', error);
    sendError(res, 500, 'Failed to get audio URL');
  }
};

// @desc    Get available voices
// @route   GET /api/tts/voices
// @access  Private
export const getVoices = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, 200, undefined, { voices: availableVoices });
  } catch (error) {
    console.error('Get voices error:', error);
    sendError(res, 500, 'Failed to get voices');
  }
};
