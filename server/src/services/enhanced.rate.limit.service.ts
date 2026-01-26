import { RateLimit } from '../models/index.js';
import type { IUser } from '../models/index.js';

/**
 * Enhanced rate limit configuration
 */
interface EnhancedRateLimitConfig {
  windowMs: number;
  maxRequests: number;
  action: string;
  burstLimit?: number; // Allow short bursts
  costPerRequest?: number; // Cost-based limiting
  userTierMultiplier?: Record<string, number>; // Different limits per user tier
}

/**
 * Rate limit result with enhanced information
 */
interface EnhancedRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfterSeconds?: number;
  costUsed?: number;
  costRemaining?: number;
  burstRemaining?: number;
  tier?: string;
}

/**
 * Rate limit statistics
 */
interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  averageRequestsPerMinute: number;
  topUsers: Array<{ userId: string; requests: number }>;
  costDistribution: Record<string, number>;
}

/**
 * Enhanced Rate Limit Configurations
 */
export const ENHANCED_RATE_LIMITS = {
  // Text generation with cost-based limiting
  TEXT_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    burstLimit: 5, // Allow 5 quick requests
    costPerRequest: 1,
    action: 'text_generation',
    userTierMultiplier: {
      'free': 1,
      'premium': 3,
      'enterprise': 10
    }
  },
  
  // Image generation with stricter limits
  IMAGE_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    burstLimit: 3,
    costPerRequest: 3, // Images cost more
    action: 'image_generation',
    userTierMultiplier: {
      'free': 1,
      'premium': 2,
      'enterprise': 5
    }
  },
  
  // Game content generation
  GAME_CONTENT_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 15,
    burstLimit: 4,
    costPerRequest: 2,
    action: 'game_content_generation',
    userTierMultiplier: {
      'free': 1,
      'premium': 2.5,
      'enterprise': 8
    }
  },
  
  // Overall API usage
  API_USAGE: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50,
    burstLimit: 15,
    costPerRequest: 1,
    action: 'api_usage',
    userTierMultiplier: {
      'free': 1,
      'premium': 4,
      'enterprise': 15
    }
  }
} as const;

/**
 * Enhanced Rate Limiting Service
 * Provides advanced rate limiting with burst handling, cost-based limits, and user tiers
 */
export class EnhancedRateLimitService {
  private burstCache = new Map<string, { count: number; resetTime: number }>();
  private stats: RateLimitStats = {
    totalRequests: 0,
    blockedRequests: 0,
    averageRequestsPerMinute: 0,
    topUsers: [],
    costDistribution: {}
  };

  constructor() {
    // Clean up burst cache periodically
    setInterval(() => this.cleanupBurstCache(), 60000); // Every minute
    
    // Update statistics periodically
    setInterval(() => this.updateStatistics(), 300000); // Every 5 minutes
  }

  /**
   * Check enhanced rate limit with burst handling and cost calculation
   */
  async checkEnhancedRateLimit(
    userId: string,
    config: EnhancedRateLimitConfig,
    userTier: string = 'free'
  ): Promise<EnhancedRateLimitResult> {
    this.stats.totalRequests++;

    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    // Apply user tier multiplier
    const tierMultiplier = (config.userTierMultiplier as Record<string, number>)?.[userTier] || 1;
    const effectiveMaxRequests = Math.floor(config.maxRequests * tierMultiplier);
    const effectiveBurstLimit = Math.floor((config.burstLimit || 0) * tierMultiplier);

    // Check burst limit first
    const burstResult = this.checkBurstLimit(userId, config.action, effectiveBurstLimit);
    
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

    const remaining = Math.max(0, effectiveMaxRequests - entry.count);
    const resetTime = new Date(entry.windowStart.getTime() + config.windowMs);

    // Calculate cost-based limits
    const costUsed = entry.count * (config.costPerRequest || 1);
    const maxCost = effectiveMaxRequests * (config.costPerRequest || 1);
    const costRemaining = Math.max(0, maxCost - costUsed);

    // Check if request should be blocked
    const isBlocked = entry.count >= effectiveMaxRequests || !burstResult.allowed;

    if (isBlocked) {
      this.stats.blockedRequests++;
      const retryAfterSeconds = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfterSeconds,
        costUsed,
        costRemaining: 0,
        burstRemaining: burstResult.remaining,
        tier: userTier
      };
    }

    return {
      allowed: true,
      remaining: remaining - 1, // Account for this request
      resetTime,
      costUsed,
      costRemaining: costRemaining - (config.costPerRequest || 1),
      burstRemaining: burstResult.remaining - 1,
      tier: userTier
    };
  }

  /**
   * Increment rate limit counter with enhanced tracking
   */
  async incrementEnhancedRateLimit(
    userId: string,
    config: EnhancedRateLimitConfig,
    userTier: string = 'free'
  ): Promise<void> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    // Increment main counter
    await RateLimit.findOneAndUpdate(
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

    // Increment burst counter
    this.incrementBurstCounter(userId, config.action);

    // Update cost distribution stats
    const cost = config.costPerRequest || 1;
    this.stats.costDistribution[config.action] = 
      (this.stats.costDistribution[config.action] || 0) + cost;
  }

  /**
   * Get user's current rate limit status across all actions
   */
  async getUserRateLimitStatus(
    userId: string,
    userTier: string = 'free'
  ): Promise<Record<string, {
    used: number;
    limit: number;
    remaining: number;
    resetTime: Date;
    costUsed: number;
    costLimit: number;
    tier: string;
  }>> {
    const now = new Date();
    const status: Record<string, any> = {};

    for (const [configName, config] of Object.entries(ENHANCED_RATE_LIMITS)) {
      const windowStart = new Date(now.getTime() - config.windowMs);
      const tierMultiplier = (config.userTierMultiplier as Record<string, number>)?.[userTier] || 1;
      const effectiveMaxRequests = Math.floor(config.maxRequests * tierMultiplier);

      const entry = await RateLimit.findOne({
        userId,
        action: config.action,
        windowStart: { $gte: windowStart },
      }).sort({ windowStart: -1 });

      const used = entry?.count || 0;
      const resetTime = entry 
        ? new Date(entry.windowStart.getTime() + config.windowMs)
        : new Date(now.getTime() + config.windowMs);

      const costUsed = used * (config.costPerRequest || 1);
      const costLimit = effectiveMaxRequests * (config.costPerRequest || 1);

      status[configName.toLowerCase()] = {
        used,
        limit: effectiveMaxRequests,
        remaining: Math.max(0, effectiveMaxRequests - used),
        resetTime,
        costUsed,
        costLimit,
        tier: userTier
      };
    }

    return status;
  }

  /**
   * Get rate limiting statistics
   */
  getStats(): RateLimitStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      averageRequestsPerMinute: 0,
      topUsers: [],
      costDistribution: {}
    };
  }

  /**
   * Check burst limit for rapid requests
   */
  private checkBurstLimit(
    userId: string,
    action: string,
    burstLimit: number
  ): { allowed: boolean; remaining: number } {
    if (burstLimit <= 0) {
      return { allowed: true, remaining: 0 };
    }

    const key = `${userId}:${action}`;
    const now = Date.now();
    const burstWindow = 10000; // 10 seconds burst window

    const existing = this.burstCache.get(key);
    
    if (!existing || now > existing.resetTime) {
      // Reset burst counter
      this.burstCache.set(key, {
        count: 0,
        resetTime: now + burstWindow
      });
      return { allowed: true, remaining: burstLimit - 1 };
    }

    if (existing.count >= burstLimit) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: burstLimit - existing.count - 1 };
  }

  /**
   * Increment burst counter
   */
  private incrementBurstCounter(userId: string, action: string): void {
    const key = `${userId}:${action}`;
    const existing = this.burstCache.get(key);
    
    if (existing) {
      existing.count++;
    }
  }

  /**
   * Clean up expired burst cache entries
   */
  private cleanupBurstCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.burstCache) {
      if (now > entry.resetTime) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.burstCache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired burst cache entries`);
    }
  }

  /**
   * Update statistics
   */
  private async updateStatistics(): Promise<void> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);

      // Calculate average requests per minute
      const recentEntries = await RateLimit.find({
        windowStart: { $gte: oneHourAgo }
      });

      const totalRecentRequests = recentEntries.reduce((sum, entry) => sum + entry.count, 0);
      this.stats.averageRequestsPerMinute = Math.round(totalRecentRequests / 60);

      // Find top users
      const userCounts = new Map<string, number>();
      recentEntries.forEach(entry => {
        const current = userCounts.get(entry.userId.toString()) || 0;
        userCounts.set(entry.userId.toString(), current + entry.count);
      });

      this.stats.topUsers = Array.from(userCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([userId, requests]) => ({ userId, requests }));

    } catch (error) {
      console.error('Failed to update rate limit statistics:', error);
    }
  }
}

// Export singleton instance
export const enhancedRateLimit = new EnhancedRateLimitService();

export default EnhancedRateLimitService;