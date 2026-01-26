import { Request, Response, NextFunction } from 'express';
import { apiUsageMonitor } from '../services/api.usage.monitor.service.js';
import type { IUser } from '../models/index.js';

/**
 * Extended request interface with usage tracking
 */
interface UsageRequest extends Request {
  startTime?: number;
  requestSize?: number;
}

/**
 * API Usage Monitoring Middleware
 * Tracks API usage, response times, and costs
 */
export function apiUsageMiddleware() {
  return (req: UsageRequest, res: Response, next: NextFunction): void => {
    // Record start time
    req.startTime = Date.now();
    
    // Calculate request size
    req.requestSize = JSON.stringify(req.body || {}).length + 
                     JSON.stringify(req.query || {}).length + 
                     JSON.stringify(req.params || {}).length;

    // Override res.json to capture response data
    const originalJson = res.json;
    let responseSize = 0;
    let responseData: any = null;

    res.json = function(data: any) {
      responseData = data;
      responseSize = JSON.stringify(data || {}).length;
      return originalJson.call(this, data);
    };

    // Log usage when response finishes
    res.on('finish', () => {
      const user = req.user as IUser | undefined;
      const endTime = Date.now();
      const responseTime = req.startTime ? endTime - req.startTime : 0;

      // Extract model and token information from response
      let model: string | undefined;
      let tokens: number | undefined;

      if (responseData?.data) {
        model = responseData.data.model;
        tokens = responseData.data.usage?.total_tokens;
      }

      // Determine if response was cached
      const cached = res.getHeader('X-Cache-Status') === 'HIT' || 
                    responseData?.fromCache === true;

      // Log the usage
      apiUsageMonitor.logUsage({
        userId: user?._id.toString() || 'anonymous',
        endpoint: req.path,
        method: req.method,
        responseTime,
        statusCode: res.statusCode,
        requestSize: req.requestSize || 0,
        responseSize,
        model,
        tokens,
        cached,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress
      });
    });

    next();
  };
}

/**
 * Enhanced rate limiting middleware with usage monitoring
 */
export function enhancedRateLimitMiddleware(config: {
  windowMs: number;
  maxRequests: number;
  action: string;
  costPerRequest?: number;
}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser | undefined;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required for this action',
      });
      return;
    }

    try {
      // Import here to avoid circular dependencies
      const { enhancedRateLimit } = await import('../services/enhanced.rate.limit.service.js');
      
      const userTier = (user as any).tier || 'free';
      const result = await enhancedRateLimit.checkEnhancedRateLimit(
        user._id.toString(),
        config,
        userTier
      );

      // Set enhanced rate limit headers
      res.setHeader('X-RateLimit-Limit', result.remaining + (result.allowed ? 1 : 0));
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetTime.toISOString());
      res.setHeader('X-RateLimit-Cost-Used', result.costUsed?.toFixed(4) || '0');
      res.setHeader('X-RateLimit-Cost-Remaining', result.costRemaining?.toFixed(4) || '0');
      res.setHeader('X-RateLimit-Tier', result.tier || 'free');

      if (result.burstRemaining !== undefined) {
        res.setHeader('X-RateLimit-Burst-Remaining', result.burstRemaining);
      }

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfterSeconds || 60);
        res.status(429).json({
          success: false,
          message: 'Rate limit exceeded. Please try again later.',
          retryAfterSeconds: result.retryAfterSeconds,
          resetTime: result.resetTime.toISOString(),
          costUsed: result.costUsed,
          tier: result.tier
        });
        return;
      }

      // Increment the counter
      await enhancedRateLimit.incrementEnhancedRateLimit(
        user._id.toString(),
        config,
        userTier
      );

      next();
    } catch (error) {
      console.error('Enhanced rate limiting error:', error);
      // Fall back to allowing the request if rate limiting fails
      next();
    }
  };
}

/**
 * Cache status middleware
 * Adds cache status headers for monitoring
 */
export function cacheStatusMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Override res.json to add cache status
    const originalJson = res.json;

    res.json = function(data: any) {
      // Check if response indicates cache hit
      if (data?.fromCache === true) {
        res.setHeader('X-Cache-Status', 'HIT');
      } else {
        res.setHeader('X-Cache-Status', 'MISS');
      }

      // Add performance headers
      if (data?.responseTime) {
        res.setHeader('X-Response-Time', `${data.responseTime}ms`);
      }

      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Performance monitoring middleware
 * Adds performance metrics to responses
 */
export function performanceMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Add performance headers when response finishes
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      res.setHeader('X-Timestamp', new Date().toISOString());
    });

    next();
  };
}

/**
 * Cost tracking middleware
 * Adds cost information to responses
 */
export function costTrackingMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json;

    res.json = function(data: any) {
      // Add cost information if available
      if (data?.cost !== undefined) {
        res.setHeader('X-Request-Cost', data.cost.toFixed(4));
      }

      // Add model information if available
      if (data?.data?.model) {
        res.setHeader('X-Model-Used', data.data.model);
      }

      // Add token usage if available
      if (data?.data?.usage?.total_tokens) {
        res.setHeader('X-Tokens-Used', data.data.usage.total_tokens.toString());
      }

      return originalJson.call(this, data);
    };

    next();
  };
}

export default {
  apiUsageMiddleware,
  enhancedRateLimitMiddleware,
  cacheStatusMiddleware,
  performanceMiddleware,
  costTrackingMiddleware
};