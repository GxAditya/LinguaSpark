import type { IUser } from '../models/index.js';
import { RateLimit } from '../models/index.js';
import { apiUsageMonitor } from './api.usage.monitor.service.js';

/**
 * User tier configuration for rate limiting
 */
export interface UserTier {
  name: string;
  gameGenerationsPerHour: number;
  textGenerationsPerHour: number;
  imageGenerationsPerHour: number;
  maxCostPerHour: number;
  priority: number; // Higher priority gets better service
}

/**
 * Cost optimization configuration
 */
export interface CostOptimizationConfig {
  userTiers: Record<string, UserTier>;
  modelSelection: {
    textModels: Array<{
      name: string;
      costMultiplier: number;
      qualityScore: number;
      speedScore: number;
    }>;
    imageModels: Array<{
      name: string;
      costMultiplier: number;
      qualityScore: number;
      speedScore: number;
    }>;
  };
  alertThresholds: {
    userHourlyCost: number;
    systemHourlyCost: number;
    errorRate: number;
    responseTime: number;
  };
}

/**
 * Rate limit result with cost information
 */
export interface CostAwareRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfterSeconds?: number;
  currentCost: number;
  costLimit: number;
  tier: string;
  reason?: string;
}

/**
 * Model recommendation based on use case
 */
export interface ModelRecommendation {
  model: string;
  reason: string;
  costMultiplier: number;
  expectedQuality: number;
  expectedSpeed: number;
}

/**
 * Cost Optimization Service
 * Implements user-based rate limiting, cost monitoring, and model optimization
 */
export class CostOptimizationService {
  private config: CostOptimizationConfig;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Check if user can make a game generation request with cost awareness
   */
  async checkGameGenerationLimit(
    userId: string,
    gameType: string,
    estimatedCost: number = 0.05
  ): Promise<CostAwareRateLimitResult> {
    const user = await this.getUserById(userId);
    const tier = this.getUserTier(user);
    
    // Check rate limits
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Get current usage in the last hour
    const recentEntries = await RateLimit.find({
      userId,
      action: 'game_generation',
      windowStart: { $gte: oneHourAgo }
    });

    const currentCount = recentEntries.reduce((sum, entry) => sum + entry.count, 0);
    const remaining = Math.max(0, tier.gameGenerationsPerHour - currentCount);

    // Check cost limits
    const userStats = apiUsageMonitor.getUserStats(userId, 1);
    const currentCost = userStats.totalCost;
    const costRemaining = tier.maxCostPerHour - currentCost;

    const resetTime = new Date(now.getTime() + 3600000);

    // Check if request is allowed
    if (currentCount >= tier.gameGenerationsPerHour) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfterSeconds: Math.ceil((resetTime.getTime() - now.getTime()) / 1000),
        currentCost,
        costLimit: tier.maxCostPerHour,
        tier: tier.name,
        reason: 'Rate limit exceeded'
      };
    }

    if (currentCost + estimatedCost > tier.maxCostPerHour) {
      return {
        allowed: false,
        remaining,
        resetTime,
        retryAfterSeconds: Math.ceil((resetTime.getTime() - now.getTime()) / 1000),
        currentCost,
        costLimit: tier.maxCostPerHour,
        tier: tier.name,
        reason: 'Cost limit exceeded'
      };
    }

    return {
      allowed: true,
      remaining: remaining - 1,
      resetTime,
      currentCost,
      costLimit: tier.maxCostPerHour,
      tier: tier.name
    };
  }

  /**
   * Record game generation usage
   */
  async recordGameGeneration(userId: string, actualCost: number): Promise<void> {
    const now = new Date();
    
    // Update rate limit counter
    await RateLimit.findOneAndUpdate(
      {
        userId,
        action: 'game_generation',
        windowStart: { $gte: new Date(now.getTime() - 3600000) }
      },
      {
        $inc: { count: 1 },
        $setOnInsert: { windowStart: now }
      },
      {
        upsert: true,
        new: true,
        sort: { windowStart: -1 }
      }
    );

    // Log usage for cost tracking
    apiUsageMonitor.logUsage({
      userId,
      endpoint: '/api/game-content',
      method: 'POST',
      responseTime: 0, // Will be updated by middleware
      statusCode: 200,
      requestSize: 0,
      responseSize: 0,
      model: 'game-generation',
      cached: false
    });
  }

  /**
   * Get optimal model recommendation based on use case
   */
  getModelRecommendation(
    type: 'text' | 'image',
    useCase: 'speed' | 'quality' | 'cost',
    userTier: string = 'free'
  ): ModelRecommendation {
    const models = type === 'text' 
      ? this.config.modelSelection.textModels 
      : this.config.modelSelection.imageModels;

    let selectedModel;

    switch (useCase) {
      case 'speed':
        selectedModel = models.reduce((best, current) => 
          current.speedScore > best.speedScore ? current : best
        );
        break;
      case 'quality':
        selectedModel = models.reduce((best, current) => 
          current.qualityScore > best.qualityScore ? current : best
        );
        break;
      case 'cost':
      default:
        selectedModel = models.reduce((best, current) => 
          current.costMultiplier < best.costMultiplier ? current : best
        );
        break;
    }

    // For free tier users, always prefer cost-effective models
    if (userTier === 'free' && useCase !== 'cost') {
      const costEffectiveModel = models.reduce((best, current) => 
        current.costMultiplier < best.costMultiplier ? current : best
      );
      
      // Use cost-effective model if the quality difference is not significant
      if (costEffectiveModel.qualityScore >= selectedModel.qualityScore * 0.8) {
        selectedModel = costEffectiveModel;
      }
    }

    return {
      model: selectedModel.name,
      reason: this.getModelRecommendationReason(selectedModel, useCase, userTier),
      costMultiplier: selectedModel.costMultiplier,
      expectedQuality: selectedModel.qualityScore,
      expectedSpeed: selectedModel.speedScore
    };
  }

  /**
   * Get user's current cost and usage statistics
   */
  async getUserCostAnalytics(userId: string, hours: number = 24): Promise<{
    totalCost: number;
    totalRequests: number;
    averageResponseTime: number;
    tier: string;
    limits: {
      gameGenerations: { used: number; limit: number; remaining: number };
      hourlyCost: { used: number; limit: number; remaining: number };
    };
    recommendations: string[];
    alerts: string[];
  }> {
    const user = await this.getUserById(userId);
    const tier = this.getUserTier(user);
    const userStats = apiUsageMonitor.getUserStats(userId, hours);

    // Get current hour usage for limits
    const currentHourStats = apiUsageMonitor.getUserStats(userId, 1);
    const gameGenerationCount = await this.getGameGenerationCount(userId, 1);

    const limits = {
      gameGenerations: {
        used: gameGenerationCount,
        limit: tier.gameGenerationsPerHour,
        remaining: Math.max(0, tier.gameGenerationsPerHour - gameGenerationCount)
      },
      hourlyCost: {
        used: currentHourStats.totalCost,
        limit: tier.maxCostPerHour,
        remaining: Math.max(0, tier.maxCostPerHour - currentHourStats.totalCost)
      }
    };

    const recommendations = this.generateUserRecommendations(userStats, tier);
    const alerts = this.generateUserAlerts(userStats, tier);

    return {
      totalCost: userStats.totalCost,
      totalRequests: userStats.totalRequests,
      averageResponseTime: userStats.averageResponseTime,
      tier: tier.name,
      limits,
      recommendations,
      alerts
    };
  }

  /**
   * Get system-wide cost monitoring data
   */
  getSystemCostMonitoring(hours: number = 1): {
    totalCost: number;
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    topCostUsers: Array<{ userId: string; cost: number; requests: number }>;
    costBreakdown: {
      textGeneration: number;
      imageGeneration: number;
      gameContent: number;
    };
    alerts: string[];
    recommendations: string[];
  } {
    const stats = apiUsageMonitor.getStats();
    const costBreakdown = apiUsageMonitor.getCostBreakdown(hours);
    const performanceMetrics = apiUsageMonitor.getPerformanceMetrics(hours);

    const alerts = this.generateSystemAlerts(stats, performanceMetrics);
    const recommendations = this.generateSystemRecommendations(stats, costBreakdown);

    return {
      totalCost: stats.totalCost,
      totalRequests: stats.totalRequests,
      averageResponseTime: stats.averageResponseTime,
      errorRate: performanceMetrics.errorRate,
      topCostUsers: stats.topUsers,
      costBreakdown: {
        textGeneration: costBreakdown.textGeneration,
        imageGeneration: costBreakdown.imageGeneration,
        gameContent: costBreakdown.gameContent
      },
      alerts,
      recommendations
    };
  }

  /**
   * Update cost optimization configuration
   */
  updateConfiguration(newConfig: Partial<CostOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Cost optimization configuration updated');
  }

  /**
   * Get user tier based on user properties
   */
  private getUserTier(user: IUser | null): UserTier {
    if (!user) {
      return this.config.userTiers.anonymous;
    }

    // For now, all registered users get 'free' tier
    // In the future, this could be based on subscription, usage history, etc.
    return this.config.userTiers.free;
  }

  /**
   * Get user by ID (mock implementation)
   */
  private async getUserById(userId: string): Promise<IUser | null> {
    // In a real implementation, this would query the database
    // For now, return a mock user
    return {
      _id: userId as any,
      name: 'User',
      email: 'user@example.com',
      level: 'beginner',
      xp: 0,
      streak: 0
    } as IUser;
  }

  /**
   * Get game generation count for user in specified hours
   */
  private async getGameGenerationCount(userId: string, hours: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    
    const entries = await RateLimit.find({
      userId,
      action: 'game_generation',
      windowStart: { $gte: cutoffTime }
    });

    return entries.reduce((sum, entry) => sum + entry.count, 0);
  }

  /**
   * Generate model recommendation reason
   */
  private getModelRecommendationReason(
    model: any,
    useCase: string,
    userTier: string
  ): string {
    if (userTier === 'free' && useCase !== 'cost') {
      return `Optimized for cost-effectiveness while maintaining good ${useCase} for free tier users`;
    }

    switch (useCase) {
      case 'speed':
        return `Selected for fastest response time (${model.speedScore}/10)`;
      case 'quality':
        return `Selected for highest quality output (${model.qualityScore}/10)`;
      case 'cost':
      default:
        return `Selected for cost optimization (${model.costMultiplier}x base cost)`;
    }
  }

  /**
   * Generate user-specific recommendations
   */
  private generateUserRecommendations(userStats: any, tier: UserTier): string[] {
    const recommendations: string[] = [];

    if (userStats.totalCost > tier.maxCostPerHour * 0.8) {
      recommendations.push('You are approaching your hourly cost limit. Consider reducing game generation frequency.');
    }

    if (userStats.averageResponseTime > 5000) {
      recommendations.push('Response times are slow. Try using speed-optimized models for better performance.');
    }

    if (userStats.totalRequests > tier.gameGenerationsPerHour * 0.8) {
      recommendations.push('You are approaching your hourly request limit. Consider spacing out your game sessions.');
    }

    return recommendations;
  }

  /**
   * Generate user-specific alerts
   */
  private generateUserAlerts(userStats: any, tier: UserTier): string[] {
    const alerts: string[] = [];

    if (userStats.totalCost > tier.maxCostPerHour) {
      alerts.push('ALERT: Hourly cost limit exceeded. New requests may be throttled.');
    }

    if (userStats.averageResponseTime > 10000) {
      alerts.push('ALERT: Very slow response times detected. Check your connection or try again later.');
    }

    return alerts;
  }

  /**
   * Generate system-wide alerts
   */
  private generateSystemAlerts(stats: any, performanceMetrics: any): string[] {
    const alerts: string[] = [];

    if (stats.totalCost > this.config.alertThresholds.systemHourlyCost) {
      alerts.push(`SYSTEM ALERT: Hourly cost threshold exceeded: $${stats.totalCost.toFixed(2)}`);
    }

    if (performanceMetrics.errorRate > this.config.alertThresholds.errorRate) {
      alerts.push(`SYSTEM ALERT: High error rate: ${performanceMetrics.errorRate.toFixed(1)}%`);
    }

    if (performanceMetrics.averageResponseTime > this.config.alertThresholds.responseTime) {
      alerts.push(`SYSTEM ALERT: High response times: ${performanceMetrics.averageResponseTime}ms`);
    }

    return alerts;
  }

  /**
   * Generate system-wide recommendations
   */
  private generateSystemRecommendations(stats: any, costBreakdown: any): string[] {
    const recommendations: string[] = [];

    if (costBreakdown.imageGeneration > costBreakdown.total * 0.6) {
      recommendations.push('Image generation is the highest cost driver. Consider optimizing image sizes or caching.');
    }

    if (costBreakdown.textGeneration > costBreakdown.total * 0.6) {
      recommendations.push('Text generation is the highest cost driver. Consider using faster models or prompt optimization.');
    }

    if (stats.cacheHitRate < 30) {
      recommendations.push('Low cache hit rate detected. Consider increasing cache TTL or improving cache keys.');
    }

    return recommendations;
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): CostOptimizationConfig {
    return {
      userTiers: {
        anonymous: {
          name: 'Anonymous',
          gameGenerationsPerHour: 3,
          textGenerationsPerHour: 10,
          imageGenerationsPerHour: 5,
          maxCostPerHour: 0.10,
          priority: 1
        },
        free: {
          name: 'Free',
          gameGenerationsPerHour: 10,
          textGenerationsPerHour: 30,
          imageGenerationsPerHour: 15,
          maxCostPerHour: 0.50,
          priority: 2
        },
        premium: {
          name: 'Premium',
          gameGenerationsPerHour: 50,
          textGenerationsPerHour: 150,
          imageGenerationsPerHour: 75,
          maxCostPerHour: 5.00,
          priority: 3
        }
      },
      modelSelection: {
        textModels: [
          {
            name: 'nova-fast',
            costMultiplier: 1.0,
            qualityScore: 7,
            speedScore: 9
          },
          {
            name: 'nova-standard',
            costMultiplier: 1.5,
            qualityScore: 8,
            speedScore: 6
          },
          {
            name: 'nova-premium',
            costMultiplier: 2.0,
            qualityScore: 9,
            speedScore: 4
          }
        ],
        imageModels: [
          {
            name: 'zimage',
            costMultiplier: 1.0,
            qualityScore: 8,
            speedScore: 7
          },
          {
            name: 'zimage-hd',
            costMultiplier: 2.0,
            qualityScore: 9,
            speedScore: 5
          }
        ]
      },
      alertThresholds: {
        userHourlyCost: 1.0,
        systemHourlyCost: 20.0,
        errorRate: 5.0,
        responseTime: 8000
      }
    };
  }
}

// Export singleton instance
export const costOptimizationService = new CostOptimizationService();

export default CostOptimizationService;