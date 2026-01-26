/**
 * Error Monitoring Service
 * Handles error logging, reporting, and monitoring
 */

import { ApiError, ErrorService } from './error.service.js';

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByGameType: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  errorsByHour: Record<string, number>;
  retrySuccessRate: number;
  averageRetryAttempts: number;
  lastUpdated: string;
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  error: ApiError;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  resolved: boolean;
  resolvedAt?: string;
  retryAttempts: number;
  finalOutcome: 'success' | 'failure' | 'fallback';
}

export interface MonitoringConfig {
  enableConsoleLogging: boolean;
  enableLocalStorage: boolean;
  enableRemoteReporting: boolean;
  maxLogEntries: number;
  reportingEndpoint?: string;
  reportingApiKey?: string;
  batchSize: number;
  batchInterval: number;
}

/**
 * Error Monitoring Service
 */
export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  private config: MonitoringConfig;
  private errorLog: ErrorLogEntry[] = [];
  private metrics: ErrorMetrics;
  private reportingQueue: ErrorLogEntry[] = [];
  private batchTimer?: NodeJS.Timeout;

  private constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      enableConsoleLogging: true,
      enableLocalStorage: true,
      enableRemoteReporting: false,
      maxLogEntries: 1000,
      batchSize: 10,
      batchInterval: 30000, // 30 seconds
      ...config
    };

    this.metrics = this.initializeMetrics();
    this.loadFromLocalStorage();
    this.startBatchReporting();
  }

  static getInstance(config?: Partial<MonitoringConfig>): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService(config);
    }
    return ErrorMonitoringService.instance;
  }

  /**
   * Log an error with comprehensive tracking
   */
  logError(error: ApiError, context?: {
    userAgent?: string;
    url?: string;
    userId?: string;
    sessionId?: string;
    retryAttempts?: number;
  }): string {
    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error,
      userAgent: context?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
      url: context?.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      userId: context?.userId,
      sessionId: context?.sessionId || this.getSessionId(),
      resolved: false,
      retryAttempts: context?.retryAttempts || 0,
      finalOutcome: 'failure'
    };

    // Add to error log
    this.errorLog.push(logEntry);
    
    // Maintain max log size
    if (this.errorLog.length > this.config.maxLogEntries) {
      this.errorLog = this.errorLog.slice(-this.config.maxLogEntries);
    }

    // Update metrics
    this.updateMetrics(logEntry);

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }

    // Local storage
    if (this.config.enableLocalStorage) {
      this.saveToLocalStorage();
    }

    // Queue for remote reporting
    if (this.config.enableRemoteReporting) {
      this.queueForReporting(logEntry);
    }

    return logEntry.id;
  }

  /**
   * Mark an error as resolved
   */
  resolveError(errorId: string, outcome: 'success' | 'fallback'): void {
    const logEntry = this.errorLog.find(entry => entry.id === errorId);
    if (logEntry) {
      logEntry.resolved = true;
      logEntry.resolvedAt = new Date().toISOString();
      logEntry.finalOutcome = outcome;

      // Update metrics
      this.updateMetrics(logEntry);

      // Save to local storage
      if (this.config.enableLocalStorage) {
        this.saveToLocalStorage();
      }
    }
  }

  /**
   * Update retry attempt count for an error
   */
  updateRetryAttempts(errorId: string, attempts: number): void {
    const logEntry = this.errorLog.find(entry => entry.id === errorId);
    if (logEntry) {
      logEntry.retryAttempts = attempts;
      
      // Update metrics
      this.updateMetrics(logEntry);
    }
  }

  /**
   * Get current error metrics
   */
  getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  /**
   * Get error log entries with optional filtering
   */
  getErrorLog(filter?: {
    errorType?: string;
    gameType?: string;
    resolved?: boolean;
    since?: string;
    limit?: number;
  }): ErrorLogEntry[] {
    let filteredLog = [...this.errorLog];

    if (filter) {
      if (filter.errorType) {
        filteredLog = filteredLog.filter(entry => entry.error.type === filter.errorType);
      }
      if (filter.gameType) {
        filteredLog = filteredLog.filter(entry => entry.error.gameType === filter.gameType);
      }
      if (filter.resolved !== undefined) {
        filteredLog = filteredLog.filter(entry => entry.resolved === filter.resolved);
      }
      if (filter.since) {
        filteredLog = filteredLog.filter(entry => entry.timestamp >= filter.since!);
      }
      if (filter.limit) {
        filteredLog = filteredLog.slice(-filter.limit);
      }
    }

    return filteredLog;
  }

  /**
   * Get error trends over time
   */
  getErrorTrends(hours: number = 24): {
    hourly: Array<{ hour: string; count: number; types: Record<string, number> }>;
    summary: {
      totalErrors: number;
      mostCommonType: string;
      averagePerHour: number;
      peakHour: string;
    };
  } {
    const now = new Date();
    const startTime = new Date(now.getTime() - (hours * 60 * 60 * 1000));
    
    const recentErrors = this.errorLog.filter(entry => 
      new Date(entry.timestamp) >= startTime
    );

    const hourlyData: Record<string, { count: number; types: Record<string, number> }> = {};
    
    // Initialize hourly buckets
    for (let i = 0; i < hours; i++) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hourKey = hour.toISOString().substring(0, 13) + ':00:00.000Z';
      hourlyData[hourKey] = { count: 0, types: {} };
    }

    // Populate hourly data
    recentErrors.forEach(entry => {
      const hour = entry.timestamp.substring(0, 13) + ':00:00.000Z';
      if (hourlyData[hour]) {
        hourlyData[hour].count++;
        hourlyData[hour].types[entry.error.type] = (hourlyData[hour].types[entry.error.type] || 0) + 1;
      }
    });

    const hourly = Object.entries(hourlyData)
      .map(([hour, data]) => ({ hour, count: data.count, types: data.types }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Calculate summary
    const totalErrors = recentErrors.length;
    const typeCount: Record<string, number> = {};
    recentErrors.forEach(entry => {
      typeCount[entry.error.type] = (typeCount[entry.error.type] || 0) + 1;
    });

    const mostCommonType = Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    const peakHour = hourly
      .sort((a, b) => b.count - a.count)[0]?.hour || 'none';

    return {
      hourly,
      summary: {
        totalErrors,
        mostCommonType,
        averagePerHour: totalErrors / hours,
        peakHour
      }
    };
  }

  /**
   * Export error data for analysis
   */
  exportErrorData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'id', 'timestamp', 'errorType', 'message', 'statusCode', 
        'gameType', 'operation', 'endpoint', 'retryAttempts', 
        'resolved', 'finalOutcome', 'userAgent'
      ];
      
      const rows = this.errorLog.map(entry => [
        entry.id,
        entry.timestamp,
        entry.error.type,
        entry.error.message.replace(/"/g, '""'),
        entry.error.statusCode || '',
        entry.error.gameType || '',
        entry.error.operation || '',
        entry.error.endpoint || '',
        entry.retryAttempts,
        entry.resolved,
        entry.finalOutcome,
        entry.userAgent || ''
      ]);

      return [headers, ...rows].map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
    }

    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      metrics: this.metrics,
      errorLog: this.errorLog
    }, null, 2);
  }

  /**
   * Clear error log and reset metrics
   */
  clearErrorLog(): void {
    this.errorLog = [];
    this.metrics = this.initializeMetrics();
    
    if (this.config.enableLocalStorage) {
      localStorage.removeItem('linguaspark_error_log');
      localStorage.removeItem('linguaspark_error_metrics');
    }
  }

  /**
   * Configure monitoring settings
   */
  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart batch reporting if interval changed
    if (newConfig.batchInterval) {
      this.stopBatchReporting();
      this.startBatchReporting();
    }
  }

  /**
   * Initialize metrics object
   */
  private initializeMetrics(): ErrorMetrics {
    return {
      totalErrors: 0,
      errorsByType: {},
      errorsByGameType: {},
      errorsByEndpoint: {},
      errorsByHour: {},
      retrySuccessRate: 0,
      averageRetryAttempts: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Update metrics based on log entry
   */
  private updateMetrics(logEntry: ErrorLogEntry): void {
    this.metrics.totalErrors = this.errorLog.length;
    
    // Count by type
    this.metrics.errorsByType = {};
    this.metrics.errorsByGameType = {};
    this.metrics.errorsByEndpoint = {};
    this.metrics.errorsByHour = {};

    let totalRetryAttempts = 0;
    let resolvedWithRetry = 0;

    this.errorLog.forEach(entry => {
      // By type
      this.metrics.errorsByType[entry.error.type] = 
        (this.metrics.errorsByType[entry.error.type] || 0) + 1;

      // By game type
      if (entry.error.gameType) {
        this.metrics.errorsByGameType[entry.error.gameType] = 
          (this.metrics.errorsByGameType[entry.error.gameType] || 0) + 1;
      }

      // By endpoint
      if (entry.error.endpoint) {
        this.metrics.errorsByEndpoint[entry.error.endpoint] = 
          (this.metrics.errorsByEndpoint[entry.error.endpoint] || 0) + 1;
      }

      // By hour
      const hour = entry.timestamp.substring(0, 13);
      this.metrics.errorsByHour[hour] = 
        (this.metrics.errorsByHour[hour] || 0) + 1;

      // Retry statistics
      totalRetryAttempts += entry.retryAttempts;
      if (entry.resolved && entry.retryAttempts > 0) {
        resolvedWithRetry++;
      }
    });

    // Calculate retry success rate
    const totalRetriedErrors = this.errorLog.filter(entry => entry.retryAttempts > 0).length;
    this.metrics.retrySuccessRate = totalRetriedErrors > 0 
      ? (resolvedWithRetry / totalRetriedErrors) * 100 
      : 0;

    this.metrics.averageRetryAttempts = this.errorLog.length > 0 
      ? totalRetryAttempts / this.errorLog.length 
      : 0;

    this.metrics.lastUpdated = new Date().toISOString();
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(logEntry: ErrorLogEntry): void {
    const monitoringReport = ErrorService.createMonitoringReport(logEntry.error);
    
    const logData = {
      id: logEntry.id,
      type: logEntry.error.type,
      message: logEntry.error.message,
      gameType: logEntry.error.gameType,
      operation: logEntry.error.operation,
      retryable: logEntry.error.retryable,
      severity: monitoringReport.severity
    };

    switch (monitoringReport.severity) {
      case 'critical':
        console.error('🚨 Critical Error:', logData);
        break;
      case 'high':
        console.error('❌ High Priority Error:', logData);
        break;
      case 'medium':
        console.warn('⚠️ Medium Priority Error:', logData);
        break;
      case 'low':
        console.info('ℹ️ Low Priority Error:', logData);
        break;
    }
  }

  /**
   * Save error data to local storage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('linguaspark_error_log', JSON.stringify(this.errorLog.slice(-100))); // Keep last 100
      localStorage.setItem('linguaspark_error_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save error data to localStorage:', error);
    }
  }

  /**
   * Load error data from local storage
   */
  private loadFromLocalStorage(): void {
    try {
      const savedLog = localStorage.getItem('linguaspark_error_log');
      const savedMetrics = localStorage.getItem('linguaspark_error_metrics');

      if (savedLog) {
        this.errorLog = JSON.parse(savedLog);
      }

      if (savedMetrics) {
        this.metrics = JSON.parse(savedMetrics);
      } else {
        this.updateMetrics(this.errorLog[0]); // Recalculate metrics
      }
    } catch (error) {
      console.warn('Failed to load error data from localStorage:', error);
    }
  }

  /**
   * Queue error for remote reporting
   */
  private queueForReporting(logEntry: ErrorLogEntry): void {
    this.reportingQueue.push(logEntry);
  }

  /**
   * Start batch reporting timer
   */
  private startBatchReporting(): void {
    if (this.config.enableRemoteReporting && this.config.reportingEndpoint) {
      this.batchTimer = setInterval(() => {
        this.sendBatchReport();
      }, this.config.batchInterval);
    }
  }

  /**
   * Stop batch reporting timer
   */
  private stopBatchReporting(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = undefined;
    }
  }

  /**
   * Send batch report to remote endpoint
   */
  private async sendBatchReport(): Promise<void> {
    if (this.reportingQueue.length === 0) return;

    const batch = this.reportingQueue.splice(0, this.config.batchSize);
    
    try {
      const response = await fetch(this.config.reportingEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.reportingApiKey && {
            'Authorization': `Bearer ${this.config.reportingApiKey}`
          })
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'linguaspark-frontend',
          errors: batch
        })
      });

      if (!response.ok) {
        console.warn('Failed to send error report:', response.statusText);
        // Re-queue failed items
        this.reportingQueue.unshift(...batch);
      }
    } catch (error) {
      console.warn('Error reporting failed:', error);
      // Re-queue failed items
      this.reportingQueue.unshift(...batch);
    }
  }

  /**
   * Generate unique ID for log entries
   */
  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or generate session ID
   */
  private getSessionId(): string {
    if (typeof sessionStorage !== 'undefined') {
      let sessionId = sessionStorage.getItem('linguaspark_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('linguaspark_session_id', sessionId);
      }
      return sessionId;
    }
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const errorMonitoringService = ErrorMonitoringService.getInstance();

export default ErrorMonitoringService;