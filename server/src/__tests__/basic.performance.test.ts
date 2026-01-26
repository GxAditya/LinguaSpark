import { describe, it, expect } from 'vitest';
import { requestOptimizer } from '../services/request.optimizer.service.js';
import { apiUsageMonitor } from '../services/api.usage.monitor.service.js';

describe('Basic Performance Tests', () => {
  describe('Request Optimizer', () => {
    it('should optimize text prompts', () => {
      const originalPrompt = 'Please can you generate some text for me';
      const optimized = requestOptimizer.optimizePrompt(originalPrompt, 'text');
      
      expect(optimized.length).toBeLessThan(originalPrompt.length);
      expect(optimized).not.toContain('please');
      expect(optimized).not.toContain('can you');
    });

    it('should optimize image prompts', () => {
      const originalPrompt = 'A very detailed and realistic image of a cat';
      const optimized = requestOptimizer.optimizePrompt(originalPrompt, 'image');
      
      expect(optimized).not.toContain('very');
      expect(optimized).not.toContain('detailed');
      expect(optimized).not.toContain('realistic');
    });

    it('should provide statistics', () => {
      const stats = requestOptimizer.getStats();
      
      expect(stats).toHaveProperty('deduplicatedRequests');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('promptOptimizations');
      expect(stats).toHaveProperty('parameterOptimizations');
    });
  });

  describe('API Usage Monitor', () => {
    it('should log API usage', () => {
      const usageEntry = {
        userId: 'test-user',
        endpoint: '/api/pollinations/text', // Use a proper endpoint that has cost
        method: 'POST',
        responseTime: 1000,
        statusCode: 200,
        requestSize: 100,
        responseSize: 200,
        model: 'nova-fast',
        tokens: 500,
        cached: false
      };

      apiUsageMonitor.logUsage(usageEntry);

      const stats = apiUsageMonitor.getStats();
      expect(stats.totalRequests).toBeGreaterThan(0);
      expect(stats.totalCost).toBeGreaterThan(0);
    });

    it('should provide usage statistics', () => {
      const stats = apiUsageMonitor.getStats();
      
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('totalCost');
      expect(stats).toHaveProperty('averageResponseTime');
      expect(stats).toHaveProperty('cacheHitRate');
      expect(stats).toHaveProperty('errorRate');
      expect(stats).toHaveProperty('topEndpoints');
      expect(stats).toHaveProperty('topUsers');
      expect(stats).toHaveProperty('modelUsage');
    });

    it('should reset statistics', () => {
      // Log some usage first
      apiUsageMonitor.logUsage({
        userId: 'test-user',
        endpoint: '/api/test',
        method: 'POST',
        responseTime: 1000,
        statusCode: 200,
        requestSize: 100,
        responseSize: 200,
        cached: false
      });

      let stats = apiUsageMonitor.getStats();
      expect(stats.totalRequests).toBeGreaterThan(0);

      // Reset and check
      apiUsageMonitor.resetStats();
      stats = apiUsageMonitor.getStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.totalCost).toBe(0);
    });
  });
});