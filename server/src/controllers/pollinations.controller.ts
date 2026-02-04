import { Request, Response } from 'express';
import { pollinationsApi } from '../services/pollinations.api.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import { createApiError, asyncHandler } from '../middleware/error.middleware.js';
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
export const generateText = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { prompt, options = {} } = req.body as TextGenerationRequest;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw createApiError('Prompt is required and must be a non-empty string', 400, 'VALIDATION');
  }

  if (prompt.length > 4000) {
    throw createApiError('Prompt is too long. Maximum length is 4000 characters.', 400, 'PROMPT_TOO_LONG');
  }

  try {
    const response = await pollinationsApi.generateTextWithRetry(prompt, options);
    sendSuccess(res, 200, 'Text generated successfully', response);
  } catch (error: any) {
    console.error('Text generation error:', error);

    // Handle specific API errors with enhanced classification
    if (error.type === 'AUTHENTICATION' || error.statusCode === 401) {
      throw createApiError(
        'Authentication failed. Please check your API key.',
        401,
        'AUTHENTICATION'
      );
    } else if (error.type === 'RATE_LIMIT' || error.statusCode === 429) {
      throw createApiError(
        'Rate limit exceeded. Please wait before making more requests.',
        429,
        'RATE_LIMIT',
        error.retryAfter || 60
      );
    } else if (error.type === 'VALIDATION' || error.statusCode === 400) {
      throw createApiError(
        error.message || 'Invalid request parameters.',
        400,
        'VALIDATION'
      );
    } else if (error.statusCode === 402) {
      if (error.message?.includes('balance')) {
        throw createApiError(
          'Insufficient account balance. Please add credits.',
          402,
          'INSUFFICIENT_BALANCE'
        );
      } else {
        throw createApiError(
          'Quota exceeded. Please upgrade your plan or wait for reset.',
          402,
          'QUOTA_EXCEEDED'
        );
      }
    } else if (error.statusCode >= 500) {
      throw createApiError(
        'Text generation service is temporarily unavailable.',
        503,
        'SERVICE_UNAVAILABLE'
      );
    } else {
      throw createApiError(
        'Failed to generate text content. Please try again.',
        500,
        'GENERATION_FAILED'
      );
    }
  }
});

/**
 * Generate image using Pollinations API
 * POST /api/pollinations/image
 */
export const generateImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { prompt, options = {} } = req.body as ImageGenerationRequest;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw createApiError('Prompt is required and must be a non-empty string', 400, 'VALIDATION');
  }

  if (prompt.length > 1000) {
    throw createApiError('Image prompt is too long. Maximum length is 1000 characters.', 400, 'PROMPT_TOO_LONG');
  }

  // Validate image options
  if (options.width && (options.width < 64 || options.width > 1024)) {
    throw createApiError('Image width must be between 64 and 1024 pixels.', 400, 'INVALID_PARAMETERS');
  }

  if (options.height && (options.height < 64 || options.height > 1024)) {
    throw createApiError('Image height must be between 64 and 1024 pixels.', 400, 'INVALID_PARAMETERS');
  }

  try {
    const response = await pollinationsApi.generateImageWithRetry(prompt, options);
    sendSuccess(res, 200, 'Image generated successfully', response);
  } catch (error: any) {
    console.error('Image generation error:', error);

    // Handle specific API errors with enhanced classification
    if (error.type === 'AUTHENTICATION' || error.statusCode === 401) {
      throw createApiError(
        'Authentication failed. Please check your API key.',
        401,
        'AUTHENTICATION'
      );
    } else if (error.type === 'RATE_LIMIT' || error.statusCode === 429) {
      throw createApiError(
        'Rate limit exceeded. Please wait before generating more images.',
        429,
        'RATE_LIMIT',
        error.retryAfter || 60
      );
    } else if (error.statusCode === 400) {
      if (error.message?.includes('policy') || error.message?.includes('inappropriate')) {
        throw createApiError(
          'Image prompt violates content policy. Please use appropriate content.',
          400,
          'CONTENT_POLICY'
        );
      } else {
        throw createApiError(
          error.message || 'Invalid image generation parameters.',
          400,
          'VALIDATION'
        );
      }
    } else if (error.statusCode === 402) {
      if (error.message?.includes('balance')) {
        throw createApiError(
          'Insufficient account balance. Please add credits.',
          402,
          'INSUFFICIENT_BALANCE'
        );
      } else {
        throw createApiError(
          'Image generation quota exceeded. Please upgrade your plan.',
          402,
          'QUOTA_EXCEEDED'
        );
      }
    } else if (error.statusCode >= 500) {
      throw createApiError(
        'Image generation service is temporarily unavailable.',
        503,
        'SERVICE_UNAVAILABLE'
      );
    } else {
      throw createApiError(
        'Failed to generate image. Please try again.',
        500,
        'GENERATION_FAILED'
      );
    }
  }
});

/**
 * Generate game content using optimized prompts
 * POST /api/pollinations/game-content
 */
export const generateGameContent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { gameType, difficulty, language, targetLanguage, topic } = req.body as GameContentRequest;

  if (!gameType || !difficulty || !language || !targetLanguage) {
    throw createApiError(
      'gameType, difficulty, language, and targetLanguage are required',
      400,
      'VALIDATION'
    );
  }

  // Validate game type
  const validGameTypes = [
    'translation-match-up', 'conjugation-coach', 'word-drop-dash',
    'context-connect', 'syntax-scrambler', 'secret-word-solver',
  ];

  if (!validGameTypes.includes(gameType)) {
    throw createApiError(
      `Invalid game type. Must be one of: ${validGameTypes.join(', ')}`,
      400,
      'VALIDATION'
    );
  }

  // Validate difficulty
  if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
    throw createApiError(
      'Difficulty must be one of: beginner, intermediate, advanced',
      400,
      'VALIDATION'
    );
  }

  try {
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

    // Handle specific errors
    if (error.type === 'AUTHENTICATION' || error.statusCode === 401) {
      throw createApiError(
        'Authentication failed during content generation.',
        401,
        'AUTHENTICATION'
      );
    } else if (error.type === 'RATE_LIMIT' || error.statusCode === 429) {
      throw createApiError(
        'Rate limit exceeded for game content generation.',
        429,
        'RATE_LIMIT',
        error.retryAfter || 60
      );
    } else if (error.statusCode === 402) {
      throw createApiError(
        'Insufficient credits for game content generation.',
        402,
        'INSUFFICIENT_BALANCE'
      );
    } else if (error.message?.includes('quality') || error.message?.includes('validation')) {
      throw createApiError(
        'Generated content did not meet quality standards. Please try again.',
        422,
        'QUALITY_CHECK_FAILED'
      );
    } else if (error.statusCode >= 500) {
      throw createApiError(
        'Game content generation service is temporarily unavailable.',
        503,
        'SERVICE_UNAVAILABLE'
      );
    } else {
      throw createApiError(
        'Failed to generate game content. Please try again.',
        500,
        'GENERATION_FAILED'
      );
    }
  }
});

/**
 * Check Pollinations API status
 * GET /api/pollinations/status
 */
export const checkApiStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const isAvailable = await pollinationsApi.validateConnection();

    sendSuccess(res, 200, 'API status checked', {
      available: isAvailable,
      timestamp: new Date().toISOString(),
      service: 'pollinations',
      version: 'v1'
    });
  } catch (error: any) {
    console.error('API status check error:', error);

    // Even if status check fails, we should return a response
    sendSuccess(res, 200, 'API status check completed', {
      available: false,
      timestamp: new Date().toISOString(),
      service: 'pollinations',
      version: 'v1',
      error: error.message
    });
  }
});

/**
 * Get API usage statistics (if available)
 * GET /api/pollinations/usage
 */
export const getApiUsage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // This would typically call a usage tracking service
  // For now, return basic information
  sendSuccess(res, 200, 'API usage retrieved', {
    timestamp: new Date().toISOString(),
    message: 'Usage tracking not implemented yet',
    suggestions: [
      'Implement usage tracking service',
      'Add request counting middleware',
      'Monitor API costs'
    ]
  });
});

/**
 * Test API connectivity with minimal request
 * POST /api/pollinations/test
 */
export const testApiConnection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Make a minimal test request to verify API works
    const testResponse = await pollinationsApi.generateText('test', { max_tokens: 1 });

    sendSuccess(res, 200, 'API connection test successful', {
      connected: true,
      model: testResponse.model,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('API connection test failed:', error);

    // Classify the error for better user feedback
    let errorType = 'CONNECTION_FAILED';
    let statusCode = 503;

    if (error.statusCode === 401) {
      errorType = 'AUTHENTICATION';
      statusCode = 401;
    } else if (error.statusCode === 402) {
      errorType = 'INSUFFICIENT_BALANCE';
      statusCode = 402;
    } else if (error.statusCode === 429) {
      errorType = 'RATE_LIMIT';
      statusCode = 429;
    }

    throw createApiError(
      `API connection test failed: ${error.message}`,
      statusCode,
      errorType
    );
  }
});
