import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.middleware.js';
import { handleValidation } from '../middleware/validation.middleware.js';
import {
  costAwareGameGenerationLimit,
  recordGameGenerationUsage,
  modelOptimizationMiddleware,
  costAnalyticsMiddleware
} from '../middleware/cost.optimization.middleware.js';
import {
  startGame,
  getActiveSession,
  updateProgress,
  completeGame,
  abandonGame,
  getGameHistory,
  getGameStats,
  getRateLimitStatus,
} from '../controllers/game.controller.js';

const router = Router();

const gameTypes = [
  'translation-matchup',
  'secret-word-solver',
  'word-drop-dash',
  'conjugation-coach',
  'context-connect',
  'syntax-scrambler',
];

// All routes require authentication
router.use(protect);

/**
 * @route POST /api/games/start
 * @desc Start a new game session with AI-generated content
 * @access Private
 */
router.post(
  '/start',
  rateLimitMiddleware(RATE_LIMITS.GAME_SESSION_START), // Burst protection
  costAwareGameGenerationLimit(), // Cost-aware rate limiting
  modelOptimizationMiddleware(), // Model optimization
  recordGameGenerationUsage(), // Usage recording
  [
    body('gameType')
      .isIn(gameTypes)
      .withMessage('Invalid game type'),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty'),
    body('language')
      .optional()
      .isString()
      .trim()
      .withMessage('Language must be a string'),
    body('targetLanguage')
      .optional()
      .isString()
      .trim()
      .withMessage('Target language must be a string'),
    body('topic')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Topic must be less than 100 characters'),
    body('forceNew')
      .optional()
      .isBoolean()
      .withMessage('forceNew must be a boolean'),
    body('optimization')
      .optional()
      .isIn(['speed', 'quality', 'cost'])
      .withMessage('Invalid optimization preference'),
  ],
  handleValidation,
  startGame
);

/**
 * @route GET /api/games/session/:gameType
 * @desc Get active session for a game type
 * @access Private
 */
router.get(
  '/session/:gameType',
  [
    param('gameType')
      .isIn(gameTypes)
      .withMessage('Invalid game type'),
  ],
  handleValidation,
  getActiveSession
);

/**
 * @route PATCH /api/games/session/:sessionId/progress
 * @desc Update game progress
 * @access Private
 */
router.patch(
  '/session/:sessionId/progress',
  [
    param('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('currentRound').isInt({ min: 0 }).withMessage('Invalid round number'),
    body('score').isInt({ min: 0 }).withMessage('Invalid score'),
    body('timeSpentSeconds').isInt({ min: 0 }).withMessage('Invalid time'),
  ],
  handleValidation,
  updateProgress
);

/**
 * @route POST /api/games/session/:sessionId/complete
 * @desc Complete a game session
 * @access Private
 */
router.post(
  '/session/:sessionId/complete',
  [
    param('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('score').isInt({ min: 0 }).withMessage('Invalid score'),
    body('timeSpentSeconds').isInt({ min: 0 }).withMessage('Invalid time'),
  ],
  handleValidation,
  completeGame
);

/**
 * @route POST /api/games/session/:sessionId/abandon
 * @desc Abandon a game session
 * @access Private
 */
router.post(
  '/session/:sessionId/abandon',
  [
    param('sessionId').isMongoId().withMessage('Invalid session ID'),
  ],
  handleValidation,
  abandonGame
);

/**
 * @route GET /api/games/history
 * @desc Get user's game history
 * @access Private
 */
router.get(
  '/history',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
    query('gameType')
      .optional()
      .isIn(gameTypes)
      .withMessage('Invalid game type'),
  ],
  handleValidation,
  getGameHistory
);

/**
 * @route GET /api/games/stats
 * @desc Get user's game statistics
 * @access Private
 */
router.get('/stats', getGameStats);

/**
 * @route GET /api/games/rate-limit
 * @desc Check rate limit status
 * @access Private
 */
router.get('/rate-limit', getRateLimitStatus);

/**
 * @route GET /api/games/cost-analytics
 * @desc Get user's cost analytics
 * @access Private
 */
router.get('/cost-analytics', costAnalyticsMiddleware);

export default router;
