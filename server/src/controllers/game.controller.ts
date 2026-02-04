import { Request, Response } from 'express';
import { GameSession, type GameType, type IGameSession } from '../models/index.js';
import { generateGameContent, calculateMaxScore, calculateTotalRounds } from '../services/game.service.js';
import { contentCache } from '../services/content.cache.service.js';
import { getUserRateLimitStatus, RATE_LIMITS } from '../middleware/rateLimit.middleware.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import type { IUser } from '../models/index.js';

interface StartGameBody {
  gameType: GameType;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  targetLanguage?: string;
  topic?: string;
  forceNew?: boolean;
}

interface UpdateProgressBody {
  currentRound: number;
  score: number;
  timeSpentSeconds: number;
}

interface CompleteGameBody {
  score: number;
  timeSpentSeconds: number;
}

/**
 * Start a new game session - generates AI content
 * POST /api/games/start
 */
export const startGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const {
      gameType,
      difficulty = 'beginner',
      language = 'english',
      targetLanguage = 'spanish',
      topic,
      forceNew = false,
    } = req.body as StartGameBody;

    if (!gameType) {
      sendError(res, 400, 'Game type is required');
      return;
    }

    // Check for any existing active session for this user and game type
    const existingSession = await GameSession.findOne({
      userId: user._id,
      gameType,
      status: 'active',
    });

    if (existingSession) {
      // Mark the existing session as abandoned
      existingSession.status = 'abandoned';
      existingSession.abandonedAt = new Date();
      await existingSession.save();
    }

    // Generate new game content using AI
    const { content, usedFallback, qualityScore, qualityIssues, fromCache, generationTime } = await generateGameContent({
      gameType,
      difficulty,
      language,
      targetLanguage,
      topic,
      forceNew,
    });

    // Calculate game metrics
    const maxScore = calculateMaxScore(content);
    const totalRounds = calculateTotalRounds(content);

    // Create new session
    const session = await GameSession.create({
      userId: user._id,
      gameType,
      status: 'active',
      content,
      currentRound: 0,
      totalRounds,
      score: 0,
      maxScore,
      startedAt: new Date(),
      timeSpentSeconds: 0,
    });

    sendSuccess(res, 201, 'Game started successfully', {
      sessionId: session._id,
      gameType,
      content,
      totalRounds,
      maxScore,
      usedFallback,
      qualityScore,
      qualityIssues,
      fromCache,
      generationTime,
    });
  } catch (error) {
    console.error('Start game error:', error);
    sendError(res, 500, 'Failed to start game');
  }
};

/**
 * Get current active session for a game type
 * GET /api/games/session/:gameType
 */
export const getActiveSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { gameType } = req.params;

    const session = await GameSession.findOne({
      userId: user._id,
      gameType,
      status: 'active',
    });

    if (!session) {
      sendError(res, 404, 'No active session found');
      return;
    }

    sendSuccess(res, 200, 'Session retrieved', {
      sessionId: session._id,
      gameType: session.gameType,
      content: session.content,
      currentRound: session.currentRound,
      totalRounds: session.totalRounds,
      score: session.score,
      maxScore: session.maxScore,
      timeSpentSeconds: session.timeSpentSeconds,
      startedAt: session.startedAt,
    });
  } catch (error) {
    console.error('Get active session error:', error);
    sendError(res, 500, 'Failed to get session');
  }
};

/**
 * Update game progress
 * PATCH /api/games/session/:sessionId/progress
 */
export const updateProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { sessionId } = req.params;
    const { currentRound, score, timeSpentSeconds } = req.body as UpdateProgressBody;

    const session = await GameSession.findOne({
      _id: sessionId,
      userId: user._id,
      status: 'active',
    });

    if (!session) {
      sendError(res, 404, 'Session not found or already completed');
      return;
    }

    // Update progress
    session.currentRound = currentRound;
    session.score = Math.min(score, session.maxScore); // Cap score at max
    session.timeSpentSeconds = timeSpentSeconds;
    await session.save();

    sendSuccess(res, 200, 'Progress updated', {
      sessionId: session._id,
      currentRound: session.currentRound,
      score: session.score,
      timeSpentSeconds: session.timeSpentSeconds,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    sendError(res, 500, 'Failed to update progress');
  }
};

/**
 * Complete a game session
 * POST /api/games/session/:sessionId/complete
 */
export const completeGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { sessionId } = req.params;
    const { score, timeSpentSeconds } = req.body as CompleteGameBody;

    const session = await GameSession.findOne({
      _id: sessionId,
      userId: user._id,
      status: 'active',
    });

    if (!session) {
      sendError(res, 404, 'Session not found or already completed');
      return;
    }

    // Mark as completed
    session.status = 'completed';
    session.completedAt = new Date();
    session.score = Math.min(score, session.maxScore);
    session.timeSpentSeconds = timeSpentSeconds;
    session.currentRound = session.totalRounds;
    await session.save();

    // Calculate stats
    const accuracy = session.maxScore > 0 ? Math.round((session.score / session.maxScore) * 100) : 0;

    sendSuccess(res, 200, 'Game completed!', {
      sessionId: session._id,
      gameType: session.gameType,
      score: session.score,
      maxScore: session.maxScore,
      accuracy,
      timeSpentSeconds: session.timeSpentSeconds,
      completedAt: session.completedAt,
    });
  } catch (error) {
    console.error('Complete game error:', error);
    sendError(res, 500, 'Failed to complete game');
  }
};

/**
 * Abandon a game session
 * POST /api/games/session/:sessionId/abandon
 */
export const abandonGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { sessionId } = req.params;

    const session = await GameSession.findOne({
      _id: sessionId,
      userId: user._id,
      status: 'active',
    });

    if (!session) {
      sendError(res, 404, 'Session not found or already completed');
      return;
    }

    // Mark as abandoned
    session.status = 'abandoned';
    session.abandonedAt = new Date();
    await session.save();

    sendSuccess(res, 200, 'Game session abandoned', {
      sessionId: session._id,
      status: 'abandoned',
    });
  } catch (error) {
    console.error('Abandon game error:', error);
    sendError(res, 500, 'Failed to abandon game');
  }
};

/**
 * Get user's game history
 * GET /api/games/history
 */
export const getGameHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { limit = 20, offset = 0, gameType } = req.query;

    const query: any = { userId: user._id, status: { $ne: 'active' } };
    if (gameType) {
      query.gameType = gameType;
    }

    const sessions = await GameSession.find(query)
      .select('gameType status score maxScore timeSpentSeconds completedAt abandonedAt createdAt')
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    const total = await GameSession.countDocuments(query);

    sendSuccess(res, 200, 'Game history retrieved', {
      sessions,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Get game history error:', error);
    sendError(res, 500, 'Failed to get game history');
  }
};

/**
 * Get user's game statistics
 * GET /api/games/stats
 */
export const getGameStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    // Aggregate stats by game type
    const stats = await GameSession.aggregate([
      { $match: { userId: user._id, status: 'completed' } },
      {
        $group: {
          _id: '$gameType',
          totalGames: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalMaxScore: { $sum: '$maxScore' },
          totalTime: { $sum: '$timeSpentSeconds' },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
        },
      },
    ]);

    // Overall stats
    const overall = await GameSession.aggregate([
      { $match: { userId: user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalMaxScore: { $sum: '$maxScore' },
          totalTime: { $sum: '$timeSpentSeconds' },
        },
      },
    ]);

    // Get rate limit status
    const rateLimitStatus = await getUserRateLimitStatus(
      user._id.toString(),
      RATE_LIMITS.GAME_GENERATION
    );

    sendSuccess(res, 200, 'Game stats retrieved', {
      byGameType: stats,
      overall: overall[0] || { totalGames: 0, totalScore: 0, totalMaxScore: 0, totalTime: 0 },
      rateLimit: rateLimitStatus,
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    sendError(res, 500, 'Failed to get game stats');
  }
};

/**
 * Check rate limit status for game generation
 * GET /api/games/rate-limit
 */
export const getRateLimitStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    const status = await getUserRateLimitStatus(
      user._id.toString(),
      RATE_LIMITS.GAME_GENERATION
    );

    sendSuccess(res, 200, 'Rate limit status', status);
  } catch (error) {
    console.error('Get rate limit status error:', error);
    sendError(res, 500, 'Failed to get rate limit status');
  }
};

/**
 * Get cache statistics
 * GET /api/games/cache/stats
 */
export const getCacheStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = contentCache.getStats();
    sendSuccess(res, 200, 'Cache statistics retrieved', stats);
  } catch (error) {
    console.error('Get cache stats error:', error);
    sendError(res, 500, 'Failed to get cache statistics');
  }
};

/**
 * Clear cache entries
 * DELETE /api/games/cache
 */
export const clearCache = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameType, difficulty, language, targetLanguage } = req.query;
    
    if (gameType || difficulty || language || targetLanguage) {
      // Partial invalidation
      const pattern: any = {};
      if (gameType) pattern.gameType = gameType;
      if (difficulty) pattern.difficulty = difficulty;
      if (language) pattern.language = language;
      if (targetLanguage) pattern.targetLanguage = targetLanguage;
      
      const invalidatedCount = await contentCache.invalidate(pattern);
      sendSuccess(res, 200, `Invalidated ${invalidatedCount} cache entries`, { invalidatedCount });
    } else {
      // Clear all cache
      await contentCache.clear();
      sendSuccess(res, 200, 'Cache cleared successfully');
    }
  } catch (error) {
    console.error('Clear cache error:', error);
    sendError(res, 500, 'Failed to clear cache');
  }
};
