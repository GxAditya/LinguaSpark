import { Request, Response, NextFunction } from 'express';
import { RateLimit } from '../models/index.js';
import type { IUser } from '../models/index.js';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  action: string;  // Action identifier
}

// Rate limit configurations for different actions
export const RATE_LIMITS = {
  GAME_GENERATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 games per hour
    action: 'game_generation',
  },
  GAME_SESSION_START: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 starts per minute (to prevent rapid session creation)
    action: 'game_session_start',
  },
  AI_API_CALL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 AI calls per minute
    action: 'ai_api_call',
  },
  TEXT_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 15, // 15 text generations per minute
    action: 'text_generation',
  },
  IMAGE_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 image generations per minute
    action: 'image_generation',
  },
} as const;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfterSeconds?: number;
}

/**
 * Check if a user is rate limited for a specific action
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Find or create rate limit entry for this window
  let entry = await RateLimit.findOne({
    userId,
    action: config.action,
    windowStart: { $gte: windowStart },
  }).sort({ windowStart: -1 });

  if (!entry) {
    // Create new entry for this window
    entry = await RateLimit.create({
      userId,
      action: config.action,
      count: 0,
      windowStart: now,
    });
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetTime = new Date(entry.windowStart.getTime() + config.windowMs);

  if (entry.count >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: remaining - 1, // Account for this request
    resetTime,
  };
}

/**
 * Increment the rate limit counter for a user action
 */
export async function incrementRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<void> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Try to increment existing entry or create new one
  const result = await RateLimit.findOneAndUpdate(
    {
      userId,
      action: config.action,
      windowStart: { $gte: windowStart },
    },
    {
      $inc: { count: 1 },
      $setOnInsert: { windowStart: now },
    },
    {
      upsert: true,
      new: true,
      sort: { windowStart: -1 },
    }
  );
}

/**
 * Express middleware factory for rate limiting
 */
export function rateLimitMiddleware(config: RateLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser | undefined;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required for this action',
      });
      return;
    }

    const result = await checkRateLimit(user._id.toString(), config);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());

    if (!result.allowed) {
      res.setHeader('Retry-After', result.retryAfterSeconds || 60);
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
        retryAfterSeconds: result.retryAfterSeconds,
        retryAfter: result.retryAfterSeconds,
        resetTime: result.resetTime.toISOString(),
      });
      return;
    }

    // Increment the counter
    await incrementRateLimit(user._id.toString(), config);

    next();
  };
}

/**
 * Get user's current rate limit status
 */
export async function getUserRateLimitStatus(
  userId: string,
  config: RateLimitConfig
): Promise<{
  used: number;
  limit: number;
  remaining: number;
  resetTime: Date;
}> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  const entry = await RateLimit.findOne({
    userId,
    action: config.action,
    windowStart: { $gte: windowStart },
  }).sort({ windowStart: -1 });

  const used = entry?.count || 0;
  const resetTime = entry 
    ? new Date(entry.windowStart.getTime() + config.windowMs)
    : new Date(now.getTime() + config.windowMs);

  return {
    used,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - used),
    resetTime,
  };
}
