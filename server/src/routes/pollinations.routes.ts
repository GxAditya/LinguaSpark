import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.middleware.js';
import {
  generateText,
  generateImage,
  generateGameContent,
  checkApiStatus
} from '../controllers/pollinations.controller.js';

const router = Router();

// Apply authentication to all routes
router.use(protect);

/**
 * @route   POST /api/pollinations/text
 * @desc    Generate text using Pollinations API
 * @access  Private
 */
router.post('/text', rateLimitMiddleware(RATE_LIMITS.TEXT_GENERATION), generateText);

/**
 * @route   POST /api/pollinations/image
 * @desc    Generate image using Pollinations API
 * @access  Private
 */
router.post('/image', rateLimitMiddleware(RATE_LIMITS.IMAGE_GENERATION), generateImage);

/**
 * @route   POST /api/pollinations/game-content
 * @desc    Generate game content using optimized prompts
 * @access  Private
 */
router.post('/game-content', rateLimitMiddleware(RATE_LIMITS.GAME_GENERATION), generateGameContent);

/**
 * @route   GET /api/pollinations/status
 * @desc    Check Pollinations API status
 * @access  Private
 */
router.get('/status', checkApiStatus);

export default router;