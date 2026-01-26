import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requestCache } from '../services/request.cache.service.js';
import { requestOptimizer } from '../services/request.optimizer.service.js';
import { enhancedRateLimit } from '../services/enhanced.rate.limit.service.js';
import { apiUsageMonitor } from '../services/api.usage.monitor.service.js';

describe('Performance Optimizations', () => {
  beforeEach(() => {
    // Clear caches and reset stats before each test
    requestCache.clear();
    requestOptimizer.resetStats();
    enhancedRateLimit.resetStats();
    apiUsageMonitor.resetStats();
  });

  describe('Request Cache Service', () => {
    it('should cache and retrieve text generation requests', async () => {
      const cacheKey = {
        type: 'text' as const,
        prompt: 'test prompt',
        options: { temperature: 0.7 }
      };

      const mockResponse = { content: 'test response', model: 'nova-fast' };
      
      // First request should generate and cache
      const result1 = await requestCache.getOrGenerate(
        cacheKey,
        async () => mockResponse
      );

      expect(result1.data).toEqual(mockResponse);
      expect(result1.fromCache).toBe(false);

      // Second request should come from cache
      const result2 = await requestCache.getOrGenerate(
        cacheKey,
        async () => ({ content: 'different response', model: 'nova-fast' })
      );

      expect(result2.data).toEqual(mockResponse);
      expect(result2.fromCache).toBe(true);
    });

    it('should provide cache statistics', () => {
      const stats = requestCache.getStats();
      
      expect(stats).toHaveProperty('memoryEntries');
      expect(stats).toHaveProperty('localStorageEntries');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('totalHits');
      expect(stats).toHaveProperty('totalMisses');
    });

    it('should invalidate cache entries by pattern', async () => {
      const cacheKey1 = {
        type: 'text' as const,
        prompt: 'test prompt 1',
        options: {}
      };

      const cacheKey2 = {
        type: 'image' as const,
        prompt: 'test prompt 2',
        options: {}
      };

      // Cache some entries
      await requestCache.set(cacheKey1, { content: 'response 1' });
      await requestCache.set(cacheKey2, { imageUrl: 'image 1' });

      // Invalidate text entries
      const invalidated = await requestCache.invalidate({ type: 'text' });
      
      expect(invalidated).toBeGreaterThan(0);
      
      // Text entry should be gone, image entry should remain
      const textResult = await requestCache.get(cacheKey1);
      const imageResult = await requestCache.get(cacheKey2);
      
      expect(textResult).toBeNull();
      expect(imageResult).toBeTruthy();
    });
  });

  describe('Request Optimizer Service', () => {
    it('should optimize text prompts', () => {
      const originalPrompt = 'Please can you generate some text for me, make sure to be very detailed and realistic';
      const optimized = requestOptimizer.optimizePrompt(originalPrompt, 'text');
      
      expect(optimized.length).toBeLessThan(originalPrompt.length);
      expect(optimized).not.toContain('please');
      expect(optimized).not.toContain('can you');
      expect(optimized).not.toContain('make sure to');
    });

    it('should optimize image prompts', () => {
      const originalPrompt = 'A very detailed and realistic high quality image of a cat';
      const optimized = requestOptimizer.optimizePrompt(originalPrompt, 'image');
      
      expect(optimized).not.toContain('very');
      expect(optimized).not.toContain('detailed');
      expect(optimized).not.toContain('realistic');
      expect(optimized).not.toContain('high quality');
    });

    it('should optimize text generation parameters', () => {
      const originalOptions = {
        temperature: 1.5, // Too high
        max_tokens: 5000   // Too high
      };

      const optimized = requestOptimizer.optimizeParameters(originalOptions, 'text');
      
      expect(optimized.temperature).toBeLessThanOrEqual(1.0);
      expect(optimized.max_tokens).toBeLessThanOrEqual(4000);
    });

    it('should optimize image generation parameters', () => {
      const originalOptions = {
        width: 2048, // Too large
        height: 2048, // Too large
        enhance: undefined
      };

      const optimized = requestOptimizer.optimizeParameters(originalOptions, 'image');
      
      expect(optimized.width).toBeLessThanOrEqual(1024);
      expect(optimized.height).toBeLessThanOrEqual(1024);
      expect(optimized.enhance).toBe(false);
    });

    it('should deduplicate identical requests', async () => {
      const requestKey = 'test-request-key';
      let callCount = 0;

      const mockRequestFn = async () => {
        callCount++;
        return { result: 'test' };
      };

      // Make multiple identical requests simultaneously
      const promises = [
        requestOptimizer.deduplicateRequest(requestKey, mockRequestFn),
        requestOptimizer.deduplicateRequest(requestKey, mockRequestFn),
        requestOptimizer.deduplicateRequest(requestKey, mockRequestFn)
      ];

      const results = await Promise.all(promises);

      // All should return the same result
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual({ result: 'test' });
      });

      // But the function should only be called once
      expect(callCount).toBe(1);

      const stats = requestOptimizer.getStats();
      expect(stats.deduplicatedRequests).toBe(2); // 2 requests were deduplicated
    });

    it('should provide optimization statistics', () => {
      const stats = requestOptimizer.getStats();
      
      expect(stats).toHaveProperty('deduplicatedRequests');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('promptOptimizations');
      expect(stats).toHaveProperty('parameterOptimizations');
    });
  });

  describe('Enhanced Rate Limit Service', () => {
    it('should provide enhanced rate limiting with user tiers', async () => {
      const config = {
        windowMs: 60000,
        maxRequests: 10,
        action: 'test_action',
        userTierMultiplier: { free: 1, premium: 2 }
      };

      // Test free tier user
      const freeResult = await enhancedRateLimit.checkEnhancedRateLimit(
        'user1',
        config,
        'free'
      );

      expect(freeResult.allowed).toBe(true);
      expect(freeResult.tier).toBe('free');

      // Test premium tier user should have higher limits
      const premiumResult = await enhancedRateLimit.checkEnhancedRateLimit(
        'user2',
        config,
        'premium'
      );

      expect(premiumResult.allowed).toBe(true);
      expect(premiumResult.tier).toBe('premium');
      expect(premiumResult.remaining).toBeGreaterThan(freeResult.remaining);
    });

    it('should provide rate limit statistics', () => {
      const stats = enhancedRateLimit.getStats();
      
      expect(stats).toHaveProperty('deduplicatedRequests');
      expect(stats).toHaveProperty('totalRequests');
    });
  });

  describe('API Usage Monitor Service', () => {
    it('should log API usage', () => {
      const usageEntry = {
        userId: 'test-user',
        endpoint: '/api/test',
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
      expect(stats.totalRequests).toBe(1);
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

    it('should calculate cost breakdown', () => {
      // Log some usage entries
      apiUsageMonitor.logUsage({
        userId: 'user1',
        endpoint: '/api/pollinations/text',
        method: 'POST',
        responseTime: 1000,
        statusCode: 200,
        requestSize: 100,
        responseSize: 200,
        tokens: 1000,
        cached: false
      });

      apiUsageMonitor.logUsage({
        userId: 'user1',
        endpoint: '/api/pollinations/image',
        method: 'POST',
        responseTime: 2000,
        statusCode: 200,
        requestSize: 150,
        responseSize: 5000,
        cached: false
      });

      const breakdown = apiUsageMonitor.getCostBreakdown(1);
      
      expect(breakdown).toHaveProperty('textGeneration');
      expect(breakdown).toHaveProperty('imageGeneration');
      expect(breakdown).toHaveProperty('gameContent');
      expect(breakdown).toHaveProperty('total');
      expect(breakdown).toHaveProperty('breakdown');
      
      expect(breakdown.textGeneration).toBeGreaterThan(0);
      expect(breakdown.imageGeneration).toBeGreaterThan(0);
      expect(breakdown.total).toBe(breakdown.textGeneration + breakdown.imageGeneration + breakdown.gameContent);
    });

    it('should provide performance metrics', () => {
      // Log some usage entries with different response times
      apiUsageMonitor.logUsage({
        userId: 'user1',
        endpoint: '/api/test',
        method: 'GET',
        responseTime: 100,
        statusCode: 200,
        requestSize: 50,
        responseSize: 100,
        cached: true
      });

      apiUsageMonitor.logUsage({
        userId: 'user1',
        endpoint: '/api/test',
        method: 'GET',
        responseTime: 500,
        statusCode: 200,
        requestSize: 50,
        responseSize: 100,
        cached: false
      });

      apiUsageMonitor.logUsage({
        userId: 'user1',
        endpoint: '/api/test',
        method: 'GET',
        responseTime: 200,
        statusCode: 500,
        requestSize: 50,
        responseSize: 100,
        cached: false
      });

      const metrics = apiUsageMonitor.getPerformanceMetrics(1);
      
      expect(metrics).toHaveProperty('averageResponseTime');
      expect(metrics).toHaveProperty('p95ResponseTime');
      expect(metrics).toHaveProperty('p99ResponseTime');
      expect(metrics).toHaveProperty('errorRate');
      expect(metrics).toHaveProperty('cacheHitRate');
      expect(metrics).toHaveProperty('requestsPerMinute');
      
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
      expect(metrics.errorRate).toBeGreaterThan(0); // We logged one error
      expect(metrics.cacheHitRate).toBeGreaterThan(0); // We logged one cached request
    });
  });

  describe('Integration Tests', () => {
    it('should work together - cache, optimize, and monitor', async () => {
      // Test the full pipeline
      const originalPrompt = 'Please generate a very detailed text for me';
      const originalOptions = { temperature: 1.5, max_tokens: 5000 };

      // Optimize
      const optimizedPrompt = requestOptimizer.optimizePrompt(originalPrompt, 'text');
      const optimizedOptions = requestOptimizer.optimizeParameters(originalOptions, 'text');

      expect(optimizedPrompt.length).toBeLessThan(originalPrompt.length);
      expect(optimizedOptions.temperature).toBeLessThanOrEqual(1.0);

      // Cache
      const cacheKey = {
        type: 'text' as const,
        prompt: optimizedPrompt,
        options: optimizedOptions
      };

      const mockResponse = { content: 'optimized response', model: 'nova-fast' };
      
      const result = await requestCache.getOrGenerate(
        cacheKey,
        async () => mockResponse
      );

      expect(result.data).toEqual(mockResponse);
      expect(result.fromCache).toBe(false);

      // Monitor
      apiUsageMonitor.logUsage({
        userId: 'test-user',
        endpoint: '/api/pollinations/text',
        method: 'POST',
        responseTime: result.responseTime || 1000,
        statusCode: 200,
        requestSize: optimizedPrompt.length,
        responseSize: JSON.stringify(mockResponse).length,
        model: mockResponse.model,
        tokens: 500,
        cached: result.fromCache
      });

      // Verify all systems are working
      const cacheStats = requestCache.getStats();
      const optimizerStats = requestOptimizer.getStats();
      const monitorStats = apiUsageMonitor.getStats();

      expect(cacheStats.totalRequests).toBeGreaterThan(0);
      expect(optimizerStats.promptOptimizations).toBeGreaterThan(0);
      expect(monitorStats.totalRequests).toBeGreaterThan(0);
    });
  });
});