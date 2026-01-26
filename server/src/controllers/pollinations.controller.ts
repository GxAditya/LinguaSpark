import { Request, Response } from 'express';
import { pollinationsApi } from '../services/pollinations.api.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import type { TextGenerationOptions, ImageGenerationOptions } from '../services/pollinations.api.service.js';

interface TextGenerationRequest {
  prompt: string;
  options?: TextGenerationOptions;
}

interface ImageGenerationRequest {
  prompt: string;
  options?: ImageGenerationOptions;
}

interface GameContentRequest {
  gameType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  targetLanguage: string;
  topic?: string;
}

/**
 * Generate text using Pollinations API
 * POST /api/pollinations/text
 */
export const generateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, options = {} } = req.body as TextGenerationRequest;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      sendError(res, 400, 'Prompt is required and must be a non-empty string');
      return;
    }

    const response = await pollinationsApi.generateTextWithRetry(prompt, options);

    sendSuccess(res, 200, 'Text generated successfully', response);
  } catch (error: any) {
    console.error('Text generation error:', error);
    
    // Handle specific API errors
    if (error.type === 'AUTHENTICATION') {
      sendError(res, 401, error.message);
    } else if (error.type === 'RATE_LIMIT') {
      sendError(res, 429, error.message);
    } else if (error.type === 'VALIDATION') {
      sendError(res, 400, error.message);
    } else {
      sendError(res, 500, 'Failed to generate text content');
    }
  }
};

/**
 * Generate image using Pollinations API
 * POST /api/pollinations/image
 */
export const generateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, options = {} } = req.body as ImageGenerationRequest;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      sendError(res, 400, 'Prompt is required and must be a non-empty string');
      return;
    }

    const response = await pollinationsApi.generateImageWithRetry(prompt, options);

    sendSuccess(res, 200, 'Image generated successfully', response);
  } catch (error: any) {
    console.error('Image generation error:', error);
    
    // Handle specific API errors
    if (error.type === 'AUTHENTICATION') {
      sendError(res, 401, error.message);
    } else if (error.type === 'RATE_LIMIT') {
      sendError(res, 429, error.message);
    } else if (error.type === 'VALIDATION') {
      sendError(res, 400, error.message);
    } else {
      sendError(res, 500, 'Failed to generate image');
    }
  }
};

/**
 * Generate game content using optimized prompts
 * POST /api/pollinations/game-content
 */
export const generateGameContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameType, difficulty, language, targetLanguage, topic } = req.body as GameContentRequest;

    if (!gameType || !difficulty || !language || !targetLanguage) {
      sendError(res, 400, 'gameType, difficulty, language, and targetLanguage are required');
      return;
    }

    // Import the game service function
    const { generateGameContent: generateContent } = await import('../services/game.service.js');
    
    const result = await generateContent({
      gameType: gameType as any,
      difficulty,
      language,
      targetLanguage,
      topic
    });

    sendSuccess(res, 200, 'Game content generated successfully', result.content);
  } catch (error: any) {
    console.error('Game content generation error:', error);
    sendError(res, 500, 'Failed to generate game content');
  }
};

/**
 * Check Pollinations API status
 * GET /api/pollinations/status
 */
export const checkApiStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAvailable = await pollinationsApi.validateConnection();

    sendSuccess(res, 200, 'API status checked', {
      available: isAvailable,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('API status check error:', error);
    sendError(res, 500, 'Failed to check API status');
  }
};