import { apiUsageMonitor } from './api.usage.monitor.service.js';
import { costOptimizationService } from './cost.optimization.service.js';
import { modelSelectionService } from './model.selection.service.js';

/**
 * Usage pattern analysis
 */
export interface UsagePattern {
  pattern: string;
  frequency: number;
  avgCost: number;
  avgResponseTime: number;
  successRate: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: string;
}

/**
 * User behavior insights
 */
export interface UserBehaviorInsights {
  userId: string;
  totalSessions: number;
  avgSessionDuration: number;
  preferredGameTypes: Array<{ gameType: string; frequency: number }>;
  peakUsageHours: number[];
  costEfficiency: number; // Cost per successful interaction
  learningProgress: {
    difficulty: string;
    language: string;
    targetLanguage: string;
    progressRate: number;
  };
  recommendations: string[];
}

/**
 * System optimization insights
 */
export interface SystemOptimizationInsights {
  totalUsers: number;
  totalSessions: number;
  totalCost: number;
  avgCostPerUser: number;
  avgCostPerSession: number;
  mostExpensiveOperations: Array<{
    operation: string;
    totalCost: number;
    avgCost: number;
    frequency: number;
  }>;
  inefficiencies: Array<{
    type: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
    potentialSavings: number;
  }>;
  optimizationOpportunities: Array<{
    opportunity: string;
    description: string;
    estimatedSavings: number;
    implementationEffort: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Predictive analytics
 */
export interface PredictiveAnalytics {
  costProjections: {
    nextHour: number;
    nextDay: number;
    nextWeek: number;
    nextMonth: number;
  };
  usageProjections: {
    expectedUsers: number;
    expectedSessions: number;
    expectedRequests: number;
  };
  seasonalTrends: Array<{
    period: string;
    expectedMultiplier: number;
    confidence: number;
  }>;
  recommendations: Array<{
    type: 'scaling' | 'optimization' | 'budgeting';
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

/**
 * A/B test results for optimization
 */
export interface ABTestResult {
  testName: string;
  variants: Array<{
    name: string;
    users: number;
    avgCost: number;
    avgResponseTime: number;
    successRate: number;
    userSatisfaction: number;
  }>;
  winner: string;
  confidence: number;
  recommendation: string;
}

/**
 * Usage Analytics Service
 * Provides comprehensive analytics and insights for cost optimization
 */
export class UsageAnalyticsService {
  private usageHistory: Array<{
    timestamp: Date;
    userId: string;
    action: string;
    cost: number;
    responseTime: number;
    success: boolean;
    metadata: Record<string, any>;
  }> = [];

  private userSessions: Map<string, Array<{
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    actions: number;
    totalCost: number;
    gameTypes: string[];
  }>> = new Map();

  constructor() {
    // Start analytics collection
    this.startAnalyticsCollection();
  }

  /**
   * Analyze usage patterns across the system
   */
  analyzeUsagePatterns(hours: number = 24): UsagePattern[] {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const recentUsage = this.usageHistory.filter(entry => entry.timestamp >= cutoffTime);

    // Group by action patterns
    const patterns = new Map<string, {
      frequency: number;
      totalCost: number;
      totalResponseTime: number;
      successes: number;
      total: number;
      timestamps: Date[];
    }>();

    recentUsage.forEach(entry => {
      const pattern = this.identifyPattern(entry);
      
      if (!patterns.has(pattern)) {
        patterns.set(pattern, {
          frequency: 0,
          totalCost: 0,
          totalResponseTime: 0,
          successes: 0,
          total: 0,
          timestamps: []
        });
      }

      const patternData = patterns.get(pattern)!;
      patternData.frequency++;
      patternData.totalCost += entry.cost;
      patternData.totalResponseTime += entry.responseTime;
      patternData.successes += entry.success ? 1 : 0;
      patternData.total++;
      patternData.timestamps.push(entry.timestamp);
    });

    // Convert to UsagePattern array
    return Array.from(patterns.entries()).map(([pattern, data]) => ({
      pattern,
      frequency: data.frequency,
      avgCost: data.totalCost / data.total,
      avgResponseTime: data.totalResponseTime / data.total,
      successRate: (data.successes / data.total) * 100,
      trend: this.calculateTrend(data.timestamps),
      recommendation: this.generatePatternRecommendation(pattern, data)
    })).sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get user behavior insights
   */
  getUserBehaviorInsights(userId: string, days: number = 7): UserBehaviorInsights {
    const cutoffTime = new Date(Date.now() - days * 24 * 3600000);
    const userUsage = this.usageHistory.filter(
      entry => entry.userId === userId && entry.timestamp >= cutoffTime
    );

    const userSessionData = this.userSessions.get(userId) || [];
    const recentSessions = userSessionData.filter(
      session => session.startTime >= cutoffTime
    );

    // Analyze game type preferences
    const gameTypeFreq = new Map<string, number>();
    userUsage.forEach(entry => {
      if (entry.metadata.gameType) {
        gameTypeFreq.set(
          entry.metadata.gameType,
          (gameTypeFreq.get(entry.metadata.gameType) || 0) + 1
        );
      }
    });

    const preferredGameTypes = Array.from(gameTypeFreq.entries())
      .map(([gameType, frequency]) => ({ gameType, frequency }))
      .sort((a, b) => b.frequency - a.frequency);

    // Analyze peak usage hours
    const hourlyUsage = new Array(24).fill(0);
    userUsage.forEach(entry => {
      hourlyUsage[entry.timestamp.getHours()]++;
    });

    const peakUsageHours = hourlyUsage
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    // Calculate cost efficiency
    const totalCost = userUsage.reduce((sum, entry) => sum + entry.cost, 0);
    const successfulInteractions = userUsage.filter(entry => entry.success).length;
    const costEfficiency = successfulInteractions > 0 ? totalCost / successfulInteractions : 0;

    // Calculate average session duration
    const completedSessions = recentSessions.filter(session => session.endTime);
    const avgSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => 
          sum + (session.endTime!.getTime() - session.startTime.getTime()), 0
        ) / completedSessions.length / 1000 / 60 // Convert to minutes
      : 0;

    // Generate recommendations
    const recommendations = this.generateUserRecommendations(
      userUsage,
      recentSessions,
      preferredGameTypes,
      costEfficiency
    );

    return {
      userId,
      totalSessions: recentSessions.length,
      avgSessionDuration,
      preferredGameTypes,
      peakUsageHours,
      costEfficiency,
      learningProgress: {
        difficulty: userUsage[0]?.metadata.difficulty || 'beginner',
        language: userUsage[0]?.metadata.language || 'english',
        targetLanguage: userUsage[0]?.metadata.targetLanguage || 'spanish',
        progressRate: this.calculateProgressRate(userUsage)
      },
      recommendations
    };
  }

  /**
   * Get system-wide optimization insights
   */
  getSystemOptimizationInsights(hours: number = 24): SystemOptimizationInsights {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const recentUsage = this.usageHistory.filter(entry => entry.timestamp >= cutoffTime);

    const uniqueUsers = new Set(recentUsage.map(entry => entry.userId)).size;
    const totalSessions = Array.from(this.userSessions.values())
      .flat()
      .filter(session => session.startTime >= cutoffTime).length;

    const totalCost = recentUsage.reduce((sum, entry) => sum + entry.cost, 0);
    const avgCostPerUser = uniqueUsers > 0 ? totalCost / uniqueUsers : 0;
    const avgCostPerSession = totalSessions > 0 ? totalCost / totalSessions : 0;

    // Find most expensive operations
    const operationCosts = new Map<string, { totalCost: number; count: number }>();
    recentUsage.forEach(entry => {
      const operation = entry.action;
      if (!operationCosts.has(operation)) {
        operationCosts.set(operation, { totalCost: 0, count: 0 });
      }
      const data = operationCosts.get(operation)!;
      data.totalCost += entry.cost;
      data.count++;
    });

    const mostExpensiveOperations = Array.from(operationCosts.entries())
      .map(([operation, data]) => ({
        operation,
        totalCost: data.totalCost,
        avgCost: data.totalCost / data.count,
        frequency: data.count
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10);

    // Identify inefficiencies
    const inefficiencies = this.identifyInefficiencies(recentUsage);

    // Find optimization opportunities
    const optimizationOpportunities = this.identifyOptimizationOpportunities(
      recentUsage,
      mostExpensiveOperations
    );

    return {
      totalUsers: uniqueUsers,
      totalSessions,
      totalCost,
      avgCostPerUser,
      avgCostPerSession,
      mostExpensiveOperations,
      inefficiencies,
      optimizationOpportunities
    };
  }

  /**
   * Generate predictive analytics
   */
  generatePredictiveAnalytics(): PredictiveAnalytics {
    const recentStats = apiUsageMonitor.getStats();
    const performanceMetrics = apiUsageMonitor.getPerformanceMetrics(24);

    // Simple trend-based projections (in a real system, this would use ML models)
    const hourlyTrend = recentStats.costPerMinute * 60;
    const dailyTrend = hourlyTrend * 24;

    const costProjections = {
      nextHour: hourlyTrend,
      nextDay: dailyTrend,
      nextWeek: dailyTrend * 7,
      nextMonth: dailyTrend * 30
    };

    const currentUsersPerHour = recentStats.requestsPerMinute * 60 / 10; // Estimate
    const usageProjections = {
      expectedUsers: Math.round(currentUsersPerHour * 24),
      expectedSessions: Math.round(currentUsersPerHour * 24 * 2), // Assume 2 sessions per user
      expectedRequests: Math.round(recentStats.requestsPerMinute * 60 * 24)
    };

    // Seasonal trends (simplified)
    const seasonalTrends = [
      { period: 'weekday_morning', expectedMultiplier: 1.2, confidence: 0.8 },
      { period: 'weekday_evening', expectedMultiplier: 1.5, confidence: 0.9 },
      { period: 'weekend', expectedMultiplier: 0.8, confidence: 0.7 },
      { period: 'holiday_season', expectedMultiplier: 2.0, confidence: 0.6 }
    ];

    const recommendations = this.generatePredictiveRecommendations(
      costProjections,
      usageProjections,
      performanceMetrics
    );

    return {
      costProjections,
      usageProjections,
      seasonalTrends,
      recommendations
    };
  }

  /**
   * Run A/B test analysis for optimization
   */
  analyzeABTest(testName: string): ABTestResult | null {
    // This is a simplified implementation
    // In a real system, this would analyze actual A/B test data
    
    const mockResults: ABTestResult = {
      testName,
      variants: [
        {
          name: 'Control (nova-fast)',
          users: 100,
          avgCost: 0.025,
          avgResponseTime: 3000,
          successRate: 95,
          userSatisfaction: 4.2
        },
        {
          name: 'Test (nova-standard)',
          users: 100,
          avgCost: 0.035,
          avgResponseTime: 4500,
          successRate: 98,
          userSatisfaction: 4.5
        }
      ],
      winner: 'Control (nova-fast)',
      confidence: 0.85,
      recommendation: 'Continue using nova-fast for cost optimization while monitoring quality metrics'
    };

    return mockResults;
  }

  /**
   * Get optimization recommendations based on analytics
   */
  getOptimizationRecommendations(): Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    estimatedSavings: number;
    implementationEffort: 'low' | 'medium' | 'high';
    actions: string[];
  }> {
    const systemInsights = this.getSystemOptimizationInsights(24);
    const usagePatterns = this.analyzeUsagePatterns(24);
    const modelAnalytics = modelSelectionService.getModelAnalytics(24);

    const recommendations = [];

    // Cost optimization recommendations
    if (systemInsights.avgCostPerUser > 0.5) {
      recommendations.push({
        category: 'Cost Optimization',
        priority: 'high' as const,
        description: 'High cost per user detected. Implement more aggressive caching and model optimization.',
        estimatedSavings: systemInsights.totalCost * 0.3,
        implementationEffort: 'medium' as const,
        actions: [
          'Increase cache TTL for game content',
          'Use faster models for simple operations',
          'Implement request deduplication'
        ]
      });
    }

    // Performance optimization recommendations
    const slowPatterns = usagePatterns.filter(p => p.avgResponseTime > 8000);
    if (slowPatterns.length > 0) {
      recommendations.push({
        category: 'Performance Optimization',
        priority: 'medium' as const,
        description: 'Slow response times detected in multiple usage patterns.',
        estimatedSavings: systemInsights.totalCost * 0.1,
        implementationEffort: 'low' as const,
        actions: [
          'Optimize slow API endpoints',
          'Implement response caching',
          'Use faster models for time-sensitive operations'
        ]
      });
    }

    // Model optimization recommendations
    const underperformingModels = modelAnalytics.modelPerformance.filter(m => m.successRate < 0.9);
    if (underperformingModels.length > 0) {
      recommendations.push({
        category: 'Model Optimization',
        priority: 'medium' as const,
        description: 'Some models have low success rates and may need replacement.',
        estimatedSavings: systemInsights.totalCost * 0.15,
        implementationEffort: 'high' as const,
        actions: [
          'Replace underperforming models',
          'Implement model fallback strategies',
          'Monitor model performance continuously'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Record usage event for analytics
   */
  recordUsageEvent(
    userId: string,
    action: string,
    cost: number,
    responseTime: number,
    success: boolean,
    metadata: Record<string, any> = {}
  ): void {
    this.usageHistory.push({
      timestamp: new Date(),
      userId,
      action,
      cost,
      responseTime,
      success,
      metadata
    });

    // Limit history size
    if (this.usageHistory.length > 10000) {
      this.usageHistory.shift();
    }
  }

  /**
   * Start session for user
   */
  startUserSession(userId: string, sessionId: string): void {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, []);
    }

    this.userSessions.get(userId)!.push({
      sessionId,
      startTime: new Date(),
      actions: 0,
      totalCost: 0,
      gameTypes: []
    });
  }

  /**
   * End session for user
   */
  endUserSession(userId: string, sessionId: string): void {
    const userSessionData = this.userSessions.get(userId);
    if (userSessionData) {
      const session = userSessionData.find(s => s.sessionId === sessionId);
      if (session && !session.endTime) {
        session.endTime = new Date();
      }
    }
  }

  /**
   * Start analytics collection
   */
  private startAnalyticsCollection(): void {
    // Clean up old data periodically
    setInterval(() => {
      this.cleanupOldData();
    }, 3600000); // Every hour

    console.log('Usage analytics service started');
  }

  /**
   * Identify usage pattern from entry
   */
  private identifyPattern(entry: any): string {
    const gameType = entry.metadata.gameType || 'unknown';
    const difficulty = entry.metadata.difficulty || 'unknown';
    const timeOfDay = this.getTimeOfDayCategory(entry.timestamp);
    
    return `${gameType}_${difficulty}_${timeOfDay}`;
  }

  /**
   * Calculate trend from timestamps
   */
  private calculateTrend(timestamps: Date[]): 'increasing' | 'decreasing' | 'stable' {
    if (timestamps.length < 2) return 'stable';

    const sortedTimestamps = timestamps.sort((a, b) => a.getTime() - b.getTime());
    const midpoint = Math.floor(sortedTimestamps.length / 2);
    
    const firstHalf = sortedTimestamps.slice(0, midpoint).length;
    const secondHalf = sortedTimestamps.slice(midpoint).length;

    if (secondHalf > firstHalf * 1.2) return 'increasing';
    if (secondHalf < firstHalf * 0.8) return 'decreasing';
    return 'stable';
  }

  /**
   * Generate pattern recommendation
   */
  private generatePatternRecommendation(pattern: string, data: any): string {
    if (data.avgCost > 0.1) {
      return 'High cost pattern - consider using more cost-effective models';
    }
    if (data.avgResponseTime > 10000) {
      return 'Slow response pattern - optimize for speed';
    }
    if (data.successes / data.total < 0.9) {
      return 'Low success rate - investigate and improve reliability';
    }
    return 'Pattern performing within acceptable parameters';
  }

  /**
   * Generate user recommendations
   */
  private generateUserRecommendations(
    userUsage: any[],
    sessions: any[],
    gameTypes: any[],
    costEfficiency: number
  ): string[] {
    const recommendations: string[] = [];

    if (costEfficiency > 0.1) {
      recommendations.push('Your cost per interaction is high. Try using speed-optimized settings.');
    }

    if (sessions.length > 0 && sessions[0].actions < 5) {
      recommendations.push('Consider longer practice sessions for better learning efficiency.');
    }

    if (gameTypes.length > 0 && gameTypes[0].frequency > userUsage.length * 0.8) {
      recommendations.push('Try diversifying your game types for more comprehensive learning.');
    }

    return recommendations;
  }

  /**
   * Identify system inefficiencies
   */
  private identifyInefficiencies(usage: any[]): Array<{
    type: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
    potentialSavings: number;
  }> {
    const inefficiencies = [];

    // High cost operations
    const highCostOps = usage.filter(entry => entry.cost > 0.1);
    if (highCostOps.length > usage.length * 0.1) {
      inefficiencies.push({
        type: 'High Cost Operations',
        description: 'More than 10% of operations have high costs',
        impact: 'high' as const,
        recommendation: 'Optimize expensive operations or use cheaper alternatives',
        potentialSavings: highCostOps.reduce((sum, op) => sum + op.cost, 0) * 0.5
      });
    }

    // Slow operations
    const slowOps = usage.filter(entry => entry.responseTime > 10000);
    if (slowOps.length > usage.length * 0.05) {
      inefficiencies.push({
        type: 'Slow Operations',
        description: 'More than 5% of operations are slow',
        impact: 'medium' as const,
        recommendation: 'Optimize slow endpoints and implement caching',
        potentialSavings: slowOps.length * 0.02 // Estimated savings from faster operations
      });
    }

    return inefficiencies;
  }

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities(
    usage: any[],
    expensiveOps: any[]
  ): Array<{
    opportunity: string;
    description: string;
    estimatedSavings: number;
    implementationEffort: 'low' | 'medium' | 'high';
  }> {
    const opportunities = [];

    // Caching opportunity
    const repeatableOps = usage.filter(entry => 
      usage.filter(e => e.action === entry.action).length > 1
    );
    
    if (repeatableOps.length > usage.length * 0.3) {
      opportunities.push({
        opportunity: 'Enhanced Caching',
        description: 'Many operations are repeated and could benefit from caching',
        estimatedSavings: repeatableOps.reduce((sum, op) => sum + op.cost, 0) * 0.8,
        implementationEffort: 'medium' as const
      });
    }

    // Model optimization opportunity
    if (expensiveOps.length > 0) {
      opportunities.push({
        opportunity: 'Model Optimization',
        description: 'Switch expensive operations to more cost-effective models',
        estimatedSavings: expensiveOps.reduce((sum, op) => sum + op.totalCost, 0) * 0.4,
        implementationEffort: 'low' as const
      });
    }

    return opportunities;
  }

  /**
   * Calculate progress rate for user
   */
  private calculateProgressRate(usage: any[]): number {
    // Simplified progress calculation based on success rate improvement over time
    if (usage.length < 10) return 0;

    const sortedUsage = usage.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const firstHalf = sortedUsage.slice(0, Math.floor(sortedUsage.length / 2));
    const secondHalf = sortedUsage.slice(Math.floor(sortedUsage.length / 2));

    const firstHalfSuccess = firstHalf.filter(entry => entry.success).length / firstHalf.length;
    const secondHalfSuccess = secondHalf.filter(entry => entry.success).length / secondHalf.length;

    return ((secondHalfSuccess - firstHalfSuccess) / firstHalfSuccess) * 100;
  }

  /**
   * Generate predictive recommendations
   */
  private generatePredictiveRecommendations(
    costProjections: any,
    usageProjections: any,
    performanceMetrics: any
  ): Array<{
    type: 'scaling' | 'optimization' | 'budgeting';
    description: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations = [];

    if (costProjections.nextMonth > 100) {
      recommendations.push({
        type: 'budgeting' as const,
        description: 'Projected monthly costs exceed $100. Consider budget adjustments or cost optimization.',
        priority: 'high' as const
      });
    }

    if (usageProjections.expectedUsers > 1000) {
      recommendations.push({
        type: 'scaling' as const,
        description: 'High user growth expected. Prepare for scaling infrastructure.',
        priority: 'medium' as const
      });
    }

    if (performanceMetrics.averageResponseTime > 5000) {
      recommendations.push({
        type: 'optimization' as const,
        description: 'Response times are degrading. Implement performance optimizations.',
        priority: 'high' as const
      });
    }

    return recommendations;
  }

  /**
   * Get time of day category
   */
  private getTimeOfDayCategory(timestamp: Date): string {
    const hour = timestamp.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Clean up old data
   */
  private cleanupOldData(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    
    // Clean usage history
    const initialUsageLength = this.usageHistory.length;
    this.usageHistory = this.usageHistory.filter(entry => entry.timestamp >= sevenDaysAgo);
    
    // Clean user sessions
    this.userSessions.forEach((sessions, userId) => {
      const filteredSessions = sessions.filter(session => session.startTime >= sevenDaysAgo);
      if (filteredSessions.length === 0) {
        this.userSessions.delete(userId);
      } else {
        this.userSessions.set(userId, filteredSessions);
      }
    });

    const removedUsageCount = initialUsageLength - this.usageHistory.length;
    if (removedUsageCount > 0) {
      console.log(`Cleaned up ${removedUsageCount} old usage analytics entries`);
    }
  }
}

// Export singleton instance
export const usageAnalyticsService = new UsageAnalyticsService();

export default UsageAnalyticsService;