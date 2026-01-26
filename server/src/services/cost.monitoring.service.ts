import { apiUsageMonitor } from './api.usage.monitor.service.js';
import { costOptimizationService } from './cost.optimization.service.js';

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Alert types
 */
export enum AlertType {
  COST_THRESHOLD = 'cost_threshold',
  ERROR_RATE = 'error_rate',
  RESPONSE_TIME = 'response_time',
  USER_LIMIT = 'user_limit',
  SYSTEM_HEALTH = 'system_health',
  BUDGET_PROJECTION = 'budget_projection'
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  type: AlertType;
  severity: AlertSeverity;
  threshold: number;
  enabled: boolean;
  cooldownMinutes: number;
  recipients: string[];
  message: string;
}

/**
 * Alert instance
 */
export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Cost monitoring metrics
 */
export interface CostMonitoringMetrics {
  currentHourCost: number;
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  projectedMonthlyCost: number;
  budgetUtilization: number;
  costTrends: {
    hourly: Array<{ timestamp: Date; cost: number }>;
    daily: Array<{ date: string; cost: number }>;
  };
  topCostDrivers: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
  alerts: Alert[];
}

/**
 * Budget configuration
 */
export interface BudgetConfig {
  monthlyBudget: number;
  dailyBudget: number;
  hourlyBudget: number;
  alertThresholds: {
    warning: number; // Percentage of budget
    critical: number; // Percentage of budget
  };
}

/**
 * Cost Monitoring Service
 * Provides comprehensive cost monitoring, alerting, and budget tracking
 */
export class CostMonitoringService {
  private alerts: Alert[] = [];
  private alertConfigs: AlertConfig[] = [];
  private budgetConfig: BudgetConfig;
  private alertCooldowns: Map<string, Date> = new Map();
  private costHistory: Array<{ timestamp: Date; cost: number; category: string }> = [];

  constructor() {
    this.budgetConfig = this.getDefaultBudgetConfig();
    this.initializeAlertConfigs();
    
    // Start monitoring intervals
    this.startMonitoring();
  }

  /**
   * Get current cost monitoring metrics
   */
  getCostMonitoringMetrics(): CostMonitoringMetrics {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const oneDayAgo = new Date(now.getTime() - 24 * 3600000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 3600000);

    // Get cost data from API usage monitor
    const hourlyStats = apiUsageMonitor.getStatsForPeriod(oneHourAgo, now);
    const dailyStats = apiUsageMonitor.getStatsForPeriod(oneDayAgo, now);
    const weeklyStats = apiUsageMonitor.getStatsForPeriod(oneWeekAgo, now);
    const monthlyStats = apiUsageMonitor.getStatsForPeriod(oneMonthAgo, now);

    // Calculate projected monthly cost based on current trends
    const dailyAverage = dailyStats.totalCost;
    const projectedMonthlyCost = dailyAverage * 30;

    // Calculate budget utilization
    const budgetUtilization = (monthlyStats.totalCost / this.budgetConfig.monthlyBudget) * 100;

    // Get cost trends
    const costTrends = this.generateCostTrends();

    // Get top cost drivers
    const costBreakdown = apiUsageMonitor.getCostBreakdown(24);
    const topCostDrivers = [
      { category: 'Text Generation', cost: costBreakdown.textGeneration, percentage: (costBreakdown.textGeneration / costBreakdown.total) * 100 },
      { category: 'Image Generation', cost: costBreakdown.imageGeneration, percentage: (costBreakdown.imageGeneration / costBreakdown.total) * 100 },
      { category: 'Game Content', cost: costBreakdown.gameContent, percentage: (costBreakdown.gameContent / costBreakdown.total) * 100 }
    ].sort((a, b) => b.cost - a.cost);

    return {
      currentHourCost: hourlyStats.totalCost,
      dailyCost: dailyStats.totalCost,
      weeklyCost: weeklyStats.totalCost,
      monthlyCost: monthlyStats.totalCost,
      projectedMonthlyCost,
      budgetUtilization,
      costTrends,
      topCostDrivers,
      alerts: this.getActiveAlerts()
    };
  }

  /**
   * Check for cost alerts and trigger if necessary
   */
  checkCostAlerts(): void {
    const metrics = this.getCostMonitoringMetrics();
    const performanceMetrics = apiUsageMonitor.getPerformanceMetrics(1);

    // Check each alert configuration
    this.alertConfigs.forEach(config => {
      if (!config.enabled) return;

      let shouldAlert = false;
      let currentValue = 0;
      let alertMessage = config.message;

      switch (config.type) {
        case AlertType.COST_THRESHOLD:
          currentValue = metrics.currentHourCost;
          shouldAlert = currentValue > config.threshold;
          alertMessage = `Hourly cost threshold exceeded: $${currentValue.toFixed(2)} > $${config.threshold}`;
          break;

        case AlertType.ERROR_RATE:
          currentValue = performanceMetrics.errorRate;
          shouldAlert = currentValue > config.threshold;
          alertMessage = `Error rate threshold exceeded: ${currentValue.toFixed(1)}% > ${config.threshold}%`;
          break;

        case AlertType.RESPONSE_TIME:
          currentValue = performanceMetrics.averageResponseTime;
          shouldAlert = currentValue > config.threshold;
          alertMessage = `Response time threshold exceeded: ${currentValue}ms > ${config.threshold}ms`;
          break;

        case AlertType.BUDGET_PROJECTION:
          currentValue = metrics.budgetUtilization;
          shouldAlert = currentValue > config.threshold;
          alertMessage = `Budget utilization threshold exceeded: ${currentValue.toFixed(1)}% > ${config.threshold}%`;
          break;
      }

      if (shouldAlert && this.canTriggerAlert(config)) {
        this.triggerAlert(config, currentValue, alertMessage);
      }
    });
  }

  /**
   * Add custom alert configuration
   */
  addAlertConfig(config: Omit<AlertConfig, 'recipients'>): void {
    const alertConfig: AlertConfig = {
      ...config,
      recipients: ['admin@linguaspark.com'] // Default recipient
    };

    this.alertConfigs.push(alertConfig);
    console.log(`Added alert configuration: ${config.type} - ${config.severity}`);
  }

  /**
   * Update budget configuration
   */
  updateBudgetConfig(newConfig: Partial<BudgetConfig>): void {
    this.budgetConfig = { ...this.budgetConfig, ...newConfig };
    console.log('Budget configuration updated:', this.budgetConfig);
  }

  /**
   * Get budget status and recommendations
   */
  getBudgetStatus(): {
    current: BudgetConfig;
    utilization: {
      hourly: { used: number; limit: number; percentage: number };
      daily: { used: number; limit: number; percentage: number };
      monthly: { used: number; limit: number; percentage: number };
    };
    projections: {
      dailyProjection: number;
      monthlyProjection: number;
      budgetExhaustionDate?: Date;
    };
    recommendations: string[];
  } {
    const metrics = this.getCostMonitoringMetrics();
    
    const utilization = {
      hourly: {
        used: metrics.currentHourCost,
        limit: this.budgetConfig.hourlyBudget,
        percentage: (metrics.currentHourCost / this.budgetConfig.hourlyBudget) * 100
      },
      daily: {
        used: metrics.dailyCost,
        limit: this.budgetConfig.dailyBudget,
        percentage: (metrics.dailyCost / this.budgetConfig.dailyBudget) * 100
      },
      monthly: {
        used: metrics.monthlyCost,
        limit: this.budgetConfig.monthlyBudget,
        percentage: (metrics.monthlyCost / this.budgetConfig.monthlyBudget) * 100
      }
    };

    const projections = {
      dailyProjection: metrics.dailyCost,
      monthlyProjection: metrics.projectedMonthlyCost,
      budgetExhaustionDate: this.calculateBudgetExhaustionDate(metrics)
    };

    const recommendations = this.generateBudgetRecommendations(utilization, projections);

    return {
      current: this.budgetConfig,
      utilization,
      projections,
      recommendations
    };
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      console.log(`Alert acknowledged: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolvedAt) {
      alert.resolvedAt = new Date();
      console.log(`Alert resolved: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolvedAt);
  }

  /**
   * Get alert history
   */
  getAlertHistory(hours: number = 24): Alert[] {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    return this.alerts.filter(alert => alert.timestamp >= cutoffTime);
  }

  /**
   * Export cost monitoring data
   */
  exportCostData(startTime: Date, endTime: Date): {
    period: { startTime: string; endTime: string };
    summary: CostMonitoringMetrics;
    detailedHistory: Array<{ timestamp: Date; cost: number; category: string }>;
    alerts: Alert[];
    budgetConfig: BudgetConfig;
  } {
    const summary = this.getCostMonitoringMetrics();
    const detailedHistory = this.costHistory.filter(
      entry => entry.timestamp >= startTime && entry.timestamp <= endTime
    );
    const alerts = this.alerts.filter(
      alert => alert.timestamp >= startTime && alert.timestamp <= endTime
    );

    return {
      period: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      },
      summary,
      detailedHistory,
      alerts,
      budgetConfig: this.budgetConfig
    };
  }

  /**
   * Start monitoring intervals
   */
  private startMonitoring(): void {
    // Check alerts every 5 minutes
    setInterval(() => {
      this.checkCostAlerts();
    }, 300000);

    // Update cost history every hour
    setInterval(() => {
      this.updateCostHistory();
    }, 3600000);

    // Clean up old alerts daily
    setInterval(() => {
      this.cleanupOldAlerts();
    }, 24 * 3600000);

    console.log('Cost monitoring service started');
  }

  /**
   * Check if alert can be triggered (respects cooldown)
   */
  private canTriggerAlert(config: AlertConfig): boolean {
    const cooldownKey = `${config.type}_${config.severity}`;
    const lastTriggered = this.alertCooldowns.get(cooldownKey);
    
    if (!lastTriggered) return true;
    
    const cooldownExpiry = new Date(lastTriggered.getTime() + config.cooldownMinutes * 60000);
    return new Date() > cooldownExpiry;
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(config: AlertConfig, currentValue: number, message: string): void {
    const alert: Alert = {
      id: this.generateAlertId(),
      type: config.type,
      severity: config.severity,
      message,
      value: currentValue,
      threshold: config.threshold,
      timestamp: new Date(),
      acknowledged: false,
      metadata: {
        config: config.type,
        recipients: config.recipients
      }
    };

    this.alerts.push(alert);
    
    // Set cooldown
    const cooldownKey = `${config.type}_${config.severity}`;
    this.alertCooldowns.set(cooldownKey, new Date());

    // Log alert
    console.warn(`ALERT [${config.severity.toUpperCase()}]: ${message}`);

    // In a real implementation, this would send notifications
    this.sendAlertNotification(alert);
  }

  /**
   * Send alert notification (mock implementation)
   */
  private sendAlertNotification(alert: Alert): void {
    // In a real implementation, this would send emails, Slack messages, etc.
    console.log(`Alert notification sent: ${alert.message}`);
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update cost history
   */
  private updateCostHistory(): void {
    const stats = apiUsageMonitor.getStats();
    const costBreakdown = apiUsageMonitor.getCostBreakdown(1);
    
    const timestamp = new Date();
    
    // Add entries for each category
    this.costHistory.push(
      { timestamp, cost: costBreakdown.textGeneration, category: 'text_generation' },
      { timestamp, cost: costBreakdown.imageGeneration, category: 'image_generation' },
      { timestamp, cost: costBreakdown.gameContent, category: 'game_content' }
    );

    // Limit history size
    if (this.costHistory.length > 1000) {
      this.costHistory = this.costHistory.slice(-1000);
    }
  }

  /**
   * Generate cost trends
   */
  private generateCostTrends(): {
    hourly: Array<{ timestamp: Date; cost: number }>;
    daily: Array<{ date: string; cost: number }>;
  } {
    const hourly: Array<{ timestamp: Date; cost: number }> = [];
    const daily: Array<{ date: string; cost: number }> = [];

    // Generate hourly trends for last 24 hours
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(Date.now() - i * 3600000);
      const hourStart = new Date(timestamp.getTime() - 3600000);
      
      const hourCost = this.costHistory
        .filter(entry => entry.timestamp >= hourStart && entry.timestamp < timestamp)
        .reduce((sum, entry) => sum + entry.cost, 0);

      hourly.push({ timestamp, cost: hourCost });
    }

    // Generate daily trends for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 3600000);
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = new Date(date.getTime() - 24 * 3600000);
      
      const dayCost = this.costHistory
        .filter(entry => entry.timestamp >= dayStart && entry.timestamp < date)
        .reduce((sum, entry) => sum + entry.cost, 0);

      daily.push({ date: dateStr, cost: dayCost });
    }

    return { hourly, daily };
  }

  /**
   * Calculate budget exhaustion date
   */
  private calculateBudgetExhaustionDate(metrics: CostMonitoringMetrics): Date | undefined {
    if (metrics.dailyCost === 0) return undefined;
    
    const remainingBudget = this.budgetConfig.monthlyBudget - metrics.monthlyCost;
    const daysRemaining = remainingBudget / metrics.dailyCost;
    
    if (daysRemaining <= 0) return new Date(); // Already exhausted
    if (daysRemaining > 365) return undefined; // More than a year away
    
    return new Date(Date.now() + daysRemaining * 24 * 3600000);
  }

  /**
   * Generate budget recommendations
   */
  private generateBudgetRecommendations(utilization: any, projections: any): string[] {
    const recommendations: string[] = [];

    if (utilization.monthly.percentage > 80) {
      recommendations.push('Monthly budget utilization is high. Consider optimizing API usage or increasing budget.');
    }

    if (utilization.daily.percentage > 100) {
      recommendations.push('Daily budget exceeded. Implement stricter rate limiting or review usage patterns.');
    }

    if (projections.monthlyProjection > this.budgetConfig.monthlyBudget * 1.2) {
      recommendations.push('Projected monthly cost significantly exceeds budget. Review and optimize high-cost operations.');
    }

    if (projections.budgetExhaustionDate && projections.budgetExhaustionDate < new Date(Date.now() + 7 * 24 * 3600000)) {
      recommendations.push('Budget may be exhausted within a week. Take immediate action to reduce costs.');
    }

    return recommendations;
  }

  /**
   * Initialize default alert configurations
   */
  private initializeAlertConfigs(): void {
    this.alertConfigs = [
      {
        type: AlertType.COST_THRESHOLD,
        severity: AlertSeverity.HIGH,
        threshold: 5.0, // $5 per hour
        enabled: true,
        cooldownMinutes: 60,
        recipients: ['admin@linguaspark.com'],
        message: 'Hourly cost threshold exceeded'
      },
      {
        type: AlertType.ERROR_RATE,
        severity: AlertSeverity.MEDIUM,
        threshold: 10.0, // 10% error rate
        enabled: true,
        cooldownMinutes: 30,
        recipients: ['admin@linguaspark.com'],
        message: 'High error rate detected'
      },
      {
        type: AlertType.RESPONSE_TIME,
        severity: AlertSeverity.MEDIUM,
        threshold: 15000, // 15 seconds
        enabled: true,
        cooldownMinutes: 30,
        recipients: ['admin@linguaspark.com'],
        message: 'High response times detected'
      },
      {
        type: AlertType.BUDGET_PROJECTION,
        severity: AlertSeverity.CRITICAL,
        threshold: 90.0, // 90% of monthly budget
        enabled: true,
        cooldownMinutes: 120,
        recipients: ['admin@linguaspark.com'],
        message: 'Monthly budget utilization critical'
      }
    ];
  }

  /**
   * Get default budget configuration
   */
  private getDefaultBudgetConfig(): BudgetConfig {
    return {
      monthlyBudget: 100.0, // $100 per month
      dailyBudget: 5.0,     // $5 per day
      hourlyBudget: 1.0,    // $1 per hour
      alertThresholds: {
        warning: 75,  // 75% of budget
        critical: 90  // 90% of budget
      }
    };
  }

  /**
   * Clean up old alerts
   */
  private cleanupOldAlerts(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    const initialLength = this.alerts.length;
    
    this.alerts = this.alerts.filter(alert => 
      alert.timestamp >= sevenDaysAgo || !alert.resolvedAt
    );
    
    const removedCount = initialLength - this.alerts.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old alerts`);
    }
  }
}

// Export singleton instance
export const costMonitoringService = new CostMonitoringService();

export default CostMonitoringService;