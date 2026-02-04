import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { costOptimizationService } from '../services/cost.optimization.service.js';
import { modelSelectionService } from '../services/model.selection.service.js';
import { costMonitoringService } from '../services/cost.monitoring.service.js';
import { usageAnalyticsService } from '../services/usage.analytics.service.js';

// Mock the database models to avoid database connections in tests
vi.mock('../models/index.js', () => ({
  RateLimit: {
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    findOneAndUpdate: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    countDocuments: vi.fn().mockResolvedValue(0)
  }
}));

describe('Cost Optimization Services', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockGameType = 'word-drop-dash';

  beforeEach(() => {
    // Reset services before each test
  });

  afterEach(() => {
    // Clean up after each test
  });

  describe('CostOptimizationService', () => {
    it('should have proper configuration structure', () => {
      // Test that the service has the expected structure without database calls
      expect(typeof costOptimizationService).toBe('object');
      expect(typeof costOptimizationService.getModelRecommendation).toBe('function');
      expect(typeof costOptimizationService.getSystemCostMonitoring).toBe('function');
    });

    it('should get system cost monitoring data', () => {
      const monitoring = costOptimizationService.getSystemCostMonitoring(1);

      expect(monitoring).toHaveProperty('totalCost');
      expect(monitoring).toHaveProperty('totalRequests');
      expect(monitoring).toHaveProperty('averageResponseTime');
      expect(monitoring).toHaveProperty('errorRate');
      expect(monitoring).toHaveProperty('topCostUsers');
      expect(monitoring).toHaveProperty('costBreakdown');
      expect(monitoring).toHaveProperty('alerts');
      expect(monitoring).toHaveProperty('recommendations');
      expect(Array.isArray(monitoring.topCostUsers)).toBe(true);
      expect(Array.isArray(monitoring.alerts)).toBe(true);
      expect(Array.isArray(monitoring.recommendations)).toBe(true);
    });
  });

  describe('ModelSelectionService', () => {
    it('should select optimal text model based on use case', () => {
      const context = {
        gameType: mockGameType,
        difficulty: 'beginner' as const,
        language: 'english',
        targetLanguage: 'spanish',
        userTier: 'free',
        priority: 'cost' as const
      };

      const result = modelSelectionService.selectModel('text', context);

      expect(result).toHaveProperty('selectedModel');
      expect(result).toHaveProperty('reason');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('alternatives');
      expect(result).toHaveProperty('estimatedCost');
      expect(result).toHaveProperty('estimatedResponseTime');
      expect(result).toHaveProperty('estimatedQuality');
      expect(typeof result.selectedModel).toBe('string');
      expect(typeof result.reason).toBe('string');
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.alternatives)).toBe(true);
    });

    it('should select optimal image model based on use case', () => {
      const context = {
        gameType: mockGameType,
        difficulty: 'intermediate' as const,
        language: 'english',
        targetLanguage: 'spanish',
        userTier: 'free',
        priority: 'quality' as const
      };

      const result = modelSelectionService.selectModel('image', context);

      expect(result).toHaveProperty('selectedModel');
      expect(result.selectedModel).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should get model analytics', () => {
      const analytics = modelSelectionService.getModelAnalytics(24);

      expect(analytics).toHaveProperty('modelPerformance');
      expect(analytics).toHaveProperty('topPerformers');
      expect(analytics).toHaveProperty('usagePatterns');
      expect(analytics).toHaveProperty('recommendations');
      expect(Array.isArray(analytics.modelPerformance)).toBe(true);
      expect(Array.isArray(analytics.recommendations)).toBe(true);
    });

    it('should get scenario recommendations', () => {
      const scenarios = modelSelectionService.getScenarioRecommendations();

      expect(scenarios).toHaveProperty('scenarios');
      expect(Array.isArray(scenarios.scenarios)).toBe(true);
      expect(scenarios.scenarios.length).toBeGreaterThan(0);

      scenarios.scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('recommendedModels');
        expect(scenario).toHaveProperty('reasoning');
        expect(scenario.recommendedModels).toHaveProperty('text');
      });
    });
  });

  describe('CostMonitoringService', () => {
    it('should get cost monitoring metrics', () => {
      const metrics = costMonitoringService.getCostMonitoringMetrics();

      expect(metrics).toHaveProperty('currentHourCost');
      expect(metrics).toHaveProperty('dailyCost');
      expect(metrics).toHaveProperty('weeklyCost');
      expect(metrics).toHaveProperty('monthlyCost');
      expect(metrics).toHaveProperty('projectedMonthlyCost');
      expect(metrics).toHaveProperty('budgetUtilization');
      expect(metrics).toHaveProperty('costTrends');
      expect(metrics).toHaveProperty('topCostDrivers');
      expect(metrics).toHaveProperty('alerts');
      expect(typeof metrics.currentHourCost).toBe('number');
      expect(typeof metrics.budgetUtilization).toBe('number');
      expect(Array.isArray(metrics.topCostDrivers)).toBe(true);
      expect(Array.isArray(metrics.alerts)).toBe(true);
    });

    it('should get budget status', () => {
      const budgetStatus = costMonitoringService.getBudgetStatus();

      expect(budgetStatus).toHaveProperty('current');
      expect(budgetStatus).toHaveProperty('utilization');
      expect(budgetStatus).toHaveProperty('projections');
      expect(budgetStatus).toHaveProperty('recommendations');
      expect(budgetStatus.current).toHaveProperty('monthlyBudget');
      expect(budgetStatus.utilization).toHaveProperty('hourly');
      expect(budgetStatus.utilization).toHaveProperty('daily');
      expect(budgetStatus.utilization).toHaveProperty('monthly');
      expect(Array.isArray(budgetStatus.recommendations)).toBe(true);
    });

    it('should get active alerts', () => {
      const alerts = costMonitoringService.getActiveAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should get alert history', () => {
      const history = costMonitoringService.getAlertHistory(24);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('UsageAnalyticsService', () => {
    it('should analyze usage patterns', () => {
      const patterns = usageAnalyticsService.analyzeUsagePatterns(24);

      expect(Array.isArray(patterns)).toBe(true);
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('pattern');
        expect(pattern).toHaveProperty('frequency');
        expect(pattern).toHaveProperty('avgCost');
        expect(pattern).toHaveProperty('avgResponseTime');
        expect(pattern).toHaveProperty('successRate');
        expect(pattern).toHaveProperty('trend');
        expect(pattern).toHaveProperty('recommendation');
        expect(typeof pattern.pattern).toBe('string');
        expect(typeof pattern.frequency).toBe('number');
        expect(typeof pattern.avgCost).toBe('number');
      });
    });

    it('should get user behavior insights', () => {
      const insights = usageAnalyticsService.getUserBehaviorInsights(mockUserId, 7);

      expect(insights).toHaveProperty('userId');
      expect(insights).toHaveProperty('totalSessions');
      expect(insights).toHaveProperty('avgSessionDuration');
      expect(insights).toHaveProperty('preferredGameTypes');
      expect(insights).toHaveProperty('peakUsageHours');
      expect(insights).toHaveProperty('costEfficiency');
      expect(insights).toHaveProperty('learningProgress');
      expect(insights).toHaveProperty('recommendations');
      expect(insights.userId).toBe(mockUserId);
      expect(Array.isArray(insights.preferredGameTypes)).toBe(true);
      expect(Array.isArray(insights.peakUsageHours)).toBe(true);
      expect(Array.isArray(insights.recommendations)).toBe(true);
    });

    it('should get system optimization insights', () => {
      const insights = usageAnalyticsService.getSystemOptimizationInsights(24);

      expect(insights).toHaveProperty('totalUsers');
      expect(insights).toHaveProperty('totalSessions');
      expect(insights).toHaveProperty('totalCost');
      expect(insights).toHaveProperty('avgCostPerUser');
      expect(insights).toHaveProperty('avgCostPerSession');
      expect(insights).toHaveProperty('mostExpensiveOperations');
      expect(insights).toHaveProperty('inefficiencies');
      expect(insights).toHaveProperty('optimizationOpportunities');
      expect(typeof insights.totalUsers).toBe('number');
      expect(typeof insights.totalCost).toBe('number');
      expect(Array.isArray(insights.mostExpensiveOperations)).toBe(true);
      expect(Array.isArray(insights.inefficiencies)).toBe(true);
      expect(Array.isArray(insights.optimizationOpportunities)).toBe(true);
    });

    it('should generate predictive analytics', () => {
      const analytics = usageAnalyticsService.generatePredictiveAnalytics();

      expect(analytics).toHaveProperty('costProjections');
      expect(analytics).toHaveProperty('usageProjections');
      expect(analytics).toHaveProperty('seasonalTrends');
      expect(analytics).toHaveProperty('recommendations');
      expect(analytics.costProjections).toHaveProperty('nextHour');
      expect(analytics.costProjections).toHaveProperty('nextDay');
      expect(analytics.costProjections).toHaveProperty('nextWeek');
      expect(analytics.costProjections).toHaveProperty('nextMonth');
      expect(Array.isArray(analytics.seasonalTrends)).toBe(true);
      expect(Array.isArray(analytics.recommendations)).toBe(true);
    });

    it('should get optimization recommendations', () => {
      const recommendations = usageAnalyticsService.getOptimizationRecommendations();

      expect(Array.isArray(recommendations)).toBe(true);
      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('category');
        expect(rec).toHaveProperty('priority');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('estimatedSavings');
        expect(rec).toHaveProperty('implementationEffort');
        expect(rec).toHaveProperty('actions');
        expect(['high', 'medium', 'low']).toContain(rec.priority);
        expect(['low', 'medium', 'high']).toContain(rec.implementationEffort);
        expect(Array.isArray(rec.actions)).toBe(true);
      });
    });

    it('should record usage events', () => {
      // Test that recording usage doesn't throw errors
      expect(() => {
        usageAnalyticsService.recordUsageEvent(
          mockUserId,
          'game_generation',
          0.05,
          3000,
          true,
          { gameType: mockGameType, difficulty: 'beginner' }
        );
      }).not.toThrow();
    });

    it('should manage user sessions', () => {
      const sessionId = 'test-session-123';

      // Test starting session
      expect(() => {
        usageAnalyticsService.startUserSession(mockUserId, sessionId);
      }).not.toThrow();

      // Test ending session
      expect(() => {
        usageAnalyticsService.endUserSession(mockUserId, sessionId);
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should have all services properly initialized', () => {
      // Test that all services are properly initialized without database calls
      expect(typeof modelSelectionService).toBe('object');
      expect(typeof costMonitoringService).toBe('object');
      expect(typeof usageAnalyticsService).toBe('object');

      // Test that key methods exist
      expect(typeof modelSelectionService.selectModel).toBe('function');
      expect(typeof costMonitoringService.getCostMonitoringMetrics).toBe('function');
      expect(typeof usageAnalyticsService.analyzeUsagePatterns).toBe('function');
    });
  });
});
