import type { IUser } from '../models/index.js';

/**
 * API usage entry
 */
interface ApiUsageEntry {
  userId: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  cost: number;
  model?: string;
  tokens?: number;
  cached: boolean;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Usage statistics
 */
interface UsageStats {
  totalRequests: number;
  totalCost: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  requestsPerMinute: number;
  costPerMinute: number;
  topEndpoints: Array<{ endpoint: string; count: number; cost: number }>;
  topUsers: Array<{ userId: string; requests: number; cost: number }>;
  modelUsage: Record<string, { requests: number; cost: number; tokens: number }>;
}

/**
 * Cost configuration
 */
interface CostConfig {
  textGeneration: {
    baseRate: number; // per 1000 tokens
    models: Record<string, number>; // multiplier per model
  };
  imageGeneration: {
    baseRate: number; // per image
    sizeMultiplier: Record<string, number>; // multiplier per size
  };
  gameContent: {
    baseRate: number; // per game content generation
  };
}

/**
 * Alert configuration
 */
interface AlertConfig {
  costThreshold: number; // Alert when cost exceeds this per hour
  errorRateThreshold: number; // Alert when error rate exceeds this percentage
  responseTimeThreshold: number; // Alert when avg response time exceeds this (ms)
  userCostThreshold: number; // Alert when single user exceeds this cost per hour
}

/**
 * API Usage Monitoring Service
 * Comprehensive monitoring and logging of API usage with cost tracking and alerting
 */
export class ApiUsageMonitorService {
  private usageLog: ApiUsageEntry[] = [];
  private readonly maxLogEntries = 10000; // Keep last 10k entries in memory
  private stats: UsageStats = this.initializeStats();
  
  // Cost configuration
  private costConfig: CostConfig = {
    textGeneration: {
      baseRate: 0.002, // $0.002 per 1000 tokens
      models: {
        'nova-fast': 1.0,
        'nova-standard': 1.5,
        'nova-premium': 2.0
      }
    },
    imageGeneration: {
      baseRate: 0.02, // $0.02 per image
      sizeMultiplier: {
        '256x256': 1.0,
        '512x512': 2.0,
        '1024x1024': 4.0
      }
    },
    gameContent: {
      baseRate: 0.01 // $0.01 per game content generation
    }
  };

  // Alert configuration
  private alertConfig: AlertConfig = {
    costThreshold: 10.0, // $10 per hour
    errorRateThreshold: 5.0, // 5% error rate
    responseTimeThreshold: 10000, // 10 seconds
    userCostThreshold: 5.0 // $5 per user per hour
  };

  constructor() {
    // Update statistics periodically
    setInterval(() => this.updateStatistics(), 60000); // Every minute
    
    // Check for alerts periodically
    setInterval(() => this.checkAlerts(), 300000); // Every 5 minutes
    
    // Clean up old log entries periodically
    setInterval(() => this.cleanupOldEntries(), 3600000); // Every hour
  }

  /**
   * Log API usage
   */
  logUsage(entry: Omit<ApiUsageEntry, 'timestamp' | 'cost'>): void {
    const timestamp = new Date();
    const cost = this.calculateCost(entry);

    const usageEntry: ApiUsageEntry = {
      ...entry,
      timestamp,
      cost
    };

    // Add to in-memory log
    this.usageLog.push(usageEntry);

    // Maintain log size limit
    if (this.usageLog.length > this.maxLogEntries) {
      this.usageLog.shift();
    }

    // Update real-time stats
    this.updateRealTimeStats(usageEntry);

    console.log(`API Usage: ${entry.method} ${entry.endpoint} - ${entry.responseTime}ms - $${cost.toFixed(4)}`);
  }

  /**
   * Get usage statistics
   */
  getStats(): UsageStats {
    return { ...this.stats };
  }

  /**
   * Get usage statistics for a specific time period
   */
  getStatsForPeriod(startTime: Date, endTime: Date): UsageStats {
    const periodEntries = this.usageLog.filter(
      entry => entry.timestamp >= startTime && entry.timestamp <= endTime
    );

    return this.calculateStatsFromEntries(periodEntries);
  }

  /**
   * Get usage statistics for a specific user
   */
  getUserStats(userId: string, hours: number = 24): {
    totalRequests: number;
    totalCost: number;
    averageResponseTime: number;
    endpointBreakdown: Record<string, { requests: number; cost: number }>;
    hourlyUsage: Array<{ hour: string; requests: number; cost: number }>;
  } {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const userEntries = this.usageLog.filter(
      entry => entry.userId === userId && entry.timestamp >= cutoffTime
    );

    const totalRequests = userEntries.length;
    const totalCost = userEntries.reduce((sum, entry) => sum + entry.cost, 0);
    const averageResponseTime = userEntries.length > 0
      ? userEntries.reduce((sum, entry) => sum + entry.responseTime, 0) / userEntries.length
      : 0;

    // Endpoint breakdown
    const endpointBreakdown: Record<string, { requests: number; cost: number }> = {};
    userEntries.forEach(entry => {
      if (!endpointBreakdown[entry.endpoint]) {
        endpointBreakdown[entry.endpoint] = { requests: 0, cost: 0 };
      }
      endpointBreakdown[entry.endpoint].requests++;
      endpointBreakdown[entry.endpoint].cost += entry.cost;
    });

    // Hourly usage
    const hourlyUsage: Array<{ hour: string; requests: number; cost: number }> = [];
    const hourlyMap = new Map<string, { requests: number; cost: number }>();

    userEntries.forEach(entry => {
      const hour = entry.timestamp.toISOString().substring(0, 13) + ':00:00';
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { requests: 0, cost: 0 });
      }
      const hourData = hourlyMap.get(hour)!;
      hourData.requests++;
      hourData.cost += entry.cost;
    });

    hourlyMap.forEach((data, hour) => {
      hourlyUsage.push({ hour, ...data });
    });

    hourlyUsage.sort((a, b) => a.hour.localeCompare(b.hour));

    return {
      totalRequests,
      totalCost,
      averageResponseTime: Math.round(averageResponseTime),
      endpointBreakdown,
      hourlyUsage
    };
  }

  /**
   * Get cost breakdown by category
   */
  getCostBreakdown(hours: number = 24): {
    textGeneration: number;
    imageGeneration: number;
    gameContent: number;
    total: number;
    breakdown: Array<{ category: string; cost: number; percentage: number }>;
  } {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const recentEntries = this.usageLog.filter(entry => entry.timestamp >= cutoffTime);

    let textGeneration = 0;
    let imageGeneration = 0;
    let gameContent = 0;

    recentEntries.forEach(entry => {
      if (entry.endpoint.includes('/text')) {
        textGeneration += entry.cost;
      } else if (entry.endpoint.includes('/image')) {
        imageGeneration += entry.cost;
      } else if (entry.endpoint.includes('/game-content')) {
        gameContent += entry.cost;
      }
    });

    const total = textGeneration + imageGeneration + gameContent;

    const breakdown = [
      { 
        category: 'Text Generation', 
        cost: textGeneration, 
        percentage: total > 0 ? (textGeneration / total) * 100 : 0 
      },
      { 
        category: 'Image Generation', 
        cost: imageGeneration, 
        percentage: total > 0 ? (imageGeneration / total) * 100 : 0 
      },
      { 
        category: 'Game Content', 
        cost: gameContent, 
        percentage: total > 0 ? (gameContent / total) * 100 : 0 
      }
    ];

    return {
      textGeneration,
      imageGeneration,
      gameContent,
      total,
      breakdown
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(hours: number = 1): {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
    requestsPerMinute: number;
    slowestEndpoints: Array<{ endpoint: string; averageTime: number }>;
  } {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const recentEntries = this.usageLog.filter(entry => entry.timestamp >= cutoffTime);

    if (recentEntries.length === 0) {
      return {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        cacheHitRate: 0,
        requestsPerMinute: 0,
        slowestEndpoints: []
      };
    }

    // Response time metrics
    const responseTimes = recentEntries.map(entry => entry.responseTime).sort((a, b) => a - b);
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);
    const p95ResponseTime = responseTimes[p95Index] || 0;
    const p99ResponseTime = responseTimes[p99Index] || 0;

    // Error rate
    const errorCount = recentEntries.filter(entry => entry.statusCode >= 400).length;
    const errorRate = (errorCount / recentEntries.length) * 100;

    // Cache hit rate
    const cacheHits = recentEntries.filter(entry => entry.cached).length;
    const cacheHitRate = (cacheHits / recentEntries.length) * 100;

    // Requests per minute
    const requestsPerMinute = recentEntries.length / (hours * 60);

    // Slowest endpoints
    const endpointTimes = new Map<string, number[]>();
    recentEntries.forEach(entry => {
      if (!endpointTimes.has(entry.endpoint)) {
        endpointTimes.set(entry.endpoint, []);
      }
      endpointTimes.get(entry.endpoint)!.push(entry.responseTime);
    });

    const slowestEndpoints = Array.from(endpointTimes.entries())
      .map(([endpoint, times]) => ({
        endpoint,
        averageTime: times.reduce((a, b) => a + b, 0) / times.length
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 5);

    return {
      averageResponseTime: Math.round(averageResponseTime),
      p95ResponseTime: Math.round(p95ResponseTime),
      p99ResponseTime: Math.round(p99ResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      requestsPerMinute: Math.round(requestsPerMinute * 100) / 100,
      slowestEndpoints
    };
  }

  /**
   * Export usage data for analysis
   */
  exportUsageData(startTime: Date, endTime: Date): ApiUsageEntry[] {
    return this.usageLog.filter(
      entry => entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }

  /**
   * Update cost configuration
   */
  updateCostConfig(newConfig: Partial<CostConfig>): void {
    this.costConfig = { ...this.costConfig, ...newConfig };
    console.log('Cost configuration updated');
  }

  /**
   * Update alert configuration
   */
  updateAlertConfig(newConfig: Partial<AlertConfig>): void {
    this.alertConfig = { ...this.alertConfig, ...newConfig };
    console.log('Alert configuration updated');
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = this.initializeStats();
    this.usageLog = [];
    console.log('API usage monitor statistics reset');
  }

  /**
   * Calculate cost for an API usage entry
   */
  private calculateCost(entry: Omit<ApiUsageEntry, 'timestamp' | 'cost'>): number {
    let cost = 0;

    if (entry.endpoint.includes('/text')) {
      const tokens = entry.tokens || 1000; // Default estimate
      const modelMultiplier = this.costConfig.textGeneration.models[entry.model || 'nova-fast'] || 1.0;
      cost = (tokens / 1000) * this.costConfig.textGeneration.baseRate * modelMultiplier;
    } else if (entry.endpoint.includes('/image')) {
      const sizeKey = '256x256'; // Default size, could be extracted from request
      const sizeMultiplier = this.costConfig.imageGeneration.sizeMultiplier[sizeKey] || 1.0;
      cost = this.costConfig.imageGeneration.baseRate * sizeMultiplier;
    } else if (entry.endpoint.includes('/game-content')) {
      cost = this.costConfig.gameContent.baseRate;
    }

    return cost;
  }

  /**
   * Initialize statistics
   */
  private initializeStats(): UsageStats {
    return {
      totalRequests: 0,
      totalCost: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      requestsPerMinute: 0,
      costPerMinute: 0,
      topEndpoints: [],
      topUsers: [],
      modelUsage: {}
    };
  }

  /**
   * Update real-time statistics
   */
  private updateRealTimeStats(entry: ApiUsageEntry): void {
    this.stats.totalRequests++;
    this.stats.totalCost += entry.cost;
  }

  /**
   * Update comprehensive statistics
   */
  private updateStatistics(): void {
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentEntries = this.usageLog.filter(entry => entry.timestamp >= oneHourAgo);

    this.stats = this.calculateStatsFromEntries(recentEntries);
  }

  /**
   * Calculate statistics from entries
   */
  private calculateStatsFromEntries(entries: ApiUsageEntry[]): UsageStats {
    if (entries.length === 0) {
      return this.initializeStats();
    }

    const totalRequests = entries.length;
    const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0);
    const averageResponseTime = entries.reduce((sum, entry) => sum + entry.responseTime, 0) / totalRequests;
    const cacheHits = entries.filter(entry => entry.cached).length;
    const cacheHitRate = (cacheHits / totalRequests) * 100;
    const errors = entries.filter(entry => entry.statusCode >= 400).length;
    const errorRate = (errors / totalRequests) * 100;

    // Calculate per-minute rates
    const timeSpan = Math.max(1, (Date.now() - entries[0].timestamp.getTime()) / 60000); // minutes
    const requestsPerMinute = totalRequests / timeSpan;
    const costPerMinute = totalCost / timeSpan;

    // Top endpoints
    const endpointCounts = new Map<string, { count: number; cost: number }>();
    entries.forEach(entry => {
      if (!endpointCounts.has(entry.endpoint)) {
        endpointCounts.set(entry.endpoint, { count: 0, cost: 0 });
      }
      const data = endpointCounts.get(entry.endpoint)!;
      data.count++;
      data.cost += entry.cost;
    });

    const topEndpoints = Array.from(endpointCounts.entries())
      .map(([endpoint, data]) => ({ endpoint, count: data.count, cost: data.cost }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top users
    const userCounts = new Map<string, { requests: number; cost: number }>();
    entries.forEach(entry => {
      if (!userCounts.has(entry.userId)) {
        userCounts.set(entry.userId, { requests: 0, cost: 0 });
      }
      const data = userCounts.get(entry.userId)!;
      data.requests++;
      data.cost += entry.cost;
    });

    const topUsers = Array.from(userCounts.entries())
      .map(([userId, data]) => ({ userId, requests: data.requests, cost: data.cost }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);

    // Model usage
    const modelUsage: Record<string, { requests: number; cost: number; tokens: number }> = {};
    entries.forEach(entry => {
      if (entry.model) {
        if (!modelUsage[entry.model]) {
          modelUsage[entry.model] = { requests: 0, cost: 0, tokens: 0 };
        }
        modelUsage[entry.model].requests++;
        modelUsage[entry.model].cost += entry.cost;
        modelUsage[entry.model].tokens += entry.tokens || 0;
      }
    });

    return {
      totalRequests,
      totalCost,
      averageResponseTime: Math.round(averageResponseTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerMinute: Math.round(requestsPerMinute * 100) / 100,
      costPerMinute: Math.round(costPerMinute * 10000) / 10000,
      topEndpoints,
      topUsers,
      modelUsage
    };
  }

  /**
   * Check for alerts
   */
  private checkAlerts(): void {
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentEntries = this.usageLog.filter(entry => entry.timestamp >= oneHourAgo);

    if (recentEntries.length === 0) return;

    const stats = this.calculateStatsFromEntries(recentEntries);

    // Cost threshold alert
    if (stats.totalCost > this.alertConfig.costThreshold) {
      console.warn(`ALERT: Hourly cost threshold exceeded: $${stats.totalCost.toFixed(2)} > $${this.alertConfig.costThreshold}`);
    }

    // Error rate alert
    if (stats.errorRate > this.alertConfig.errorRateThreshold) {
      console.warn(`ALERT: Error rate threshold exceeded: ${stats.errorRate}% > ${this.alertConfig.errorRateThreshold}%`);
    }

    // Response time alert
    if (stats.averageResponseTime > this.alertConfig.responseTimeThreshold) {
      console.warn(`ALERT: Response time threshold exceeded: ${stats.averageResponseTime}ms > ${this.alertConfig.responseTimeThreshold}ms`);
    }

    // User cost alert
    stats.topUsers.forEach(user => {
      if (user.cost > this.alertConfig.userCostThreshold) {
        console.warn(`ALERT: User cost threshold exceeded: User ${user.userId} - $${user.cost.toFixed(2)} > $${this.alertConfig.userCostThreshold}`);
      }
    });
  }

  /**
   * Clean up old log entries
   */
  private cleanupOldEntries(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 3600000);
    const initialLength = this.usageLog.length;
    
    this.usageLog = this.usageLog.filter(entry => entry.timestamp >= twentyFourHoursAgo);
    
    const removedCount = initialLength - this.usageLog.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old usage log entries`);
    }
  }
}

// Export singleton instance
export const apiUsageMonitor = new ApiUsageMonitorService();

export default ApiUsageMonitorService;