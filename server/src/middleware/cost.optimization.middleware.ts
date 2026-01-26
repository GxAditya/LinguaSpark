import { Request, Response, NextFunction } from 'express';
import { costOptimizationService } from '../services/cost.optimization.service.js';
import { apiUsageMonitor } from '../services/api.usage.monitor.service.js';
import type { IUser } from '../models/index.js';

/**
 * Middleware to enforce cost-aware rate limiting for game generation
 */
export function costAwareGameGenerationLimit() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser | undefined;
    const userId = user?._id.toString() || 'anonymous';

    try {
      // Estimate cost based on request type
      const estimatedCost = estimateRequestCost(req);

      // Check if user can make this request
      const result = await costOptimizationService.checkGameGenerationLimit(
        userId,
        req.body.gameType || 'unknown',
        estimatedCost
      );

      // Set cost-aware headers
      res.setHeader('X-Cost-Limit', result.costLimit);
      res.setHeader('X-Cost-Used', result.currentCost.toFixed(4));
      res.setHeader('X-Cost-Remaining', (result.costLimit - result.currentCost).toFixed(4));
      res.setHeader('X-User-Tier', result.tier);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfterSeconds || 3600);
        res.status(429).json({
          success: false,
          message: `Request blocked: ${result.reason}`,
          error: {
            type: 'RATE_LIMIT_EXCEEDED',
            reason: result.reason,
            tier: result.tier,
            limits: {
              cost: {
                used: result.currentCost,
                limit: result.costLimit,
                remaining: result.costLimit - result.currentCost
              },
              requests: {
                remaining: result.remaining,
                resetTime: result.resetTime.toISOString()
              }
            },
            retryAfterSeconds: result.retryAfterSeconds
          }
        });
        return;
      }

      // Store request info for post-processing
      req.costOptimization = {
        userId,
        estimatedCost,
        tier: result.tier,
        startTime: Date.now()
      };

      next();
    } catch (error) {
      console.error('Cost optimization middleware error:', error);
      // Don't block requests on middleware errors, just log and continue
      next();
    }
  };
}

/**
 * Middleware to record actual usage after request completion
 */
export function recordGameGenerationUsage() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalSend = res.send;

    res.send = function (data: any) {
      // Record usage after response is sent
      setImmediate(async () => {
        if (req.costOptimization) {
          const { userId, estimatedCost, tier, startTime } = req.costOptimization;
          const responseTime = Date.now() - startTime;

          try {
            // Calculate actual cost based on response
            const actualCost = calculateActualCost(req, res, data);

            // Record the usage
            await costOptimizationService.recordGameGeneration(userId, actualCost);

            // Log detailed usage information
            apiUsageMonitor.logUsage({
              userId,
              endpoint: req.path,
              method: req.method,
              responseTime,
              statusCode: res.statusCode,
              requestSize: JSON.stringify(req.body).length,
              responseSize: typeof data === 'string' ? data.length : JSON.stringify(data).length,
              model: req.body.model || 'unknown',
              tokens: extractTokenCount(data),
              cached: res.getHeader('X-Cache-Hit') === 'true'
            });

            console.log(`Game generation recorded: User ${userId} (${tier}) - Cost: $${actualCost.toFixed(4)} - Time: ${responseTime}ms`);
          } catch (error) {
            console.error('Error recording game generation usage:', error);
          }
        }
      });

      return originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Middleware to provide model recommendations based on use case
 */
export function modelOptimizationMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as IUser | undefined;
    const userTier = user ? 'free' : 'anonymous'; // Simplified tier detection

    // Get use case from request or default to cost optimization
    const useCase = req.body.optimization || req.query.optimization || 'cost';
    const contentType = req.path.includes('image') ? 'image' : 'text';

    try {
      const recommendation = costOptimizationService.getModelRecommendation(
        contentType as 'text' | 'image',
        useCase as 'speed' | 'quality' | 'cost',
        userTier
      );

      // Add recommendation to request for use by the service
      req.modelRecommendation = recommendation;

      // Set recommendation headers
      res.setHeader('X-Recommended-Model', recommendation.model);
      res.setHeader('X-Recommendation-Reason', recommendation.reason);
      res.setHeader('X-Cost-Multiplier', recommendation.costMultiplier.toString());

      // Override model in request body if not explicitly set
      if (!req.body.model) {
        req.body.model = recommendation.model;
      }

      next();
    } catch (error) {
      console.error('Model optimization middleware error:', error);
      next();
    }
  };
}

/**
 * Middleware to add cost analytics to responses
 */
export function costAnalyticsMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser | undefined;

    if (user && req.path.includes('/analytics')) {
      try {
        const analytics = await costOptimizationService.getUserCostAnalytics(
          user._id.toString(),
          parseInt(req.query.hours as string) || 24
        );

        res.json({
          success: true,
          data: analytics
        });
        return;
      } catch (error) {
        console.error('Cost analytics middleware error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve cost analytics'
        });
        return;
      }
    }

    next();
  };
}

/**
 * Estimate request cost based on request parameters
 */
function estimateRequestCost(req: Request): number {
  const baseGameCost = 0.05; // Base cost for game generation

  // Adjust based on game type
  const gameType = req.body.gameType;
  const gameTypeMultipliers: Record<string, number> = {

    'audio-jumble': 1.2,   // Higher cost due to TTS
    'translation-match': 1.0,
    'word-drop': 1.0,
    'context-connect': 1.1,
    'syntax-scrambler': 1.0,
    'conjugation-coach': 1.0,
    'transcription-station': 1.3,
    'secret-word': 1.0,
    'time-warp': 1.0
  };

  const multiplier = gameTypeMultipliers[gameType] || 1.0;

  // Adjust based on difficulty (more complex content = higher cost)
  const difficulty = req.body.difficulty || 'beginner';
  const difficultyMultipliers: Record<string, number> = {
    'beginner': 1.0,
    'intermediate': 1.2,
    'advanced': 1.4
  };

  const difficultyMultiplier = difficultyMultipliers[difficulty] || 1.0;

  return baseGameCost * multiplier * difficultyMultiplier;
}

/**
 * Calculate actual cost based on response data
 */
function calculateActualCost(req: Request, res: Response, responseData: any): number {
  const estimatedCost = req.costOptimization?.estimatedCost || 0.05;

  // If we have token information, calculate more precisely
  const tokens = extractTokenCount(responseData);
  if (tokens > 0) {
    const costPerToken = 0.000002; // $0.002 per 1000 tokens
    return tokens * costPerToken;
  }

  // If response indicates an error, reduce cost
  if (res.statusCode >= 400) {
    return estimatedCost * 0.1; // Minimal cost for failed requests
  }

  // If response was cached, reduce cost significantly
  if (res.getHeader('X-Cache-Hit') === 'true') {
    return estimatedCost * 0.01; // Very low cost for cached responses
  }

  return estimatedCost;
}

/**
 * Extract token count from response data
 */
function extractTokenCount(responseData: any): number {
  if (typeof responseData === 'string') {
    try {
      const parsed = JSON.parse(responseData);
      return parsed.usage?.total_tokens || 0;
    } catch {
      return 0;
    }
  }

  if (typeof responseData === 'object' && responseData.usage) {
    return responseData.usage.total_tokens || 0;
  }

  return 0;
}

// Extend Request interface to include cost optimization data
declare global {
  namespace Express {
    interface Request {
      costOptimization?: {
        userId: string;
        estimatedCost: number;
        tier: string;
        startTime: number;
      };
      modelRecommendation?: {
        model: string;
        reason: string;
        costMultiplier: number;
        expectedQuality: number;
        expectedSpeed: number;
      };
    }
  }
}

export default {
  costAwareGameGenerationLimit,
  recordGameGenerationUsage,
  modelOptimizationMiddleware,
  costAnalyticsMiddleware
};