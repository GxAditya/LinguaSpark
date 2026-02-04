import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ErrorService, ApiErrorType } from '../error.service.js';

describe('ErrorService', () => {
  describe('Error Classification', () => {
    it('should classify authentication errors correctly', () => {
      const error = { status: 401, message: 'Invalid API key' };
      const result = ErrorService.parseError(error);

      expect(result.type).toBe(ApiErrorType.AUTHENTICATION);
      expect(result.retryable).toBe(false);
      expect(result.statusCode).toBe(401);
    });

    it('should classify rate limit errors correctly', () => {
      const error = { status: 429, message: 'Rate limit exceeded', retryAfter: 60 };
      const result = ErrorService.parseError(error);

      expect(result.type).toBe(ApiErrorType.RATE_LIMIT);
      expect(result.retryable).toBe(true);
      expect(result.retryAfter).toBe(60);
    });

    it('should classify network errors correctly', () => {
      const error = { message: 'Failed to fetch' };
      const result = ErrorService.parseError(error);

      // Should classify as network error based on message content
      expect(result.type).toBe(ApiErrorType.NETWORK);
      expect(result.retryable).toBe(true);
    });

    it('should classify timeout errors correctly', () => {
      const error = { name: 'TimeoutError', message: 'Request timeout' };
      const result = ErrorService.parseError(error);

      expect(result.type).toBe(ApiErrorType.TIMEOUT);
      expect(result.retryable).toBe(true);
    });

    it('should classify server errors correctly', () => {
      const error = { status: 500, message: 'Internal server error' };
      const result = ErrorService.parseError(error);

      expect(result.type).toBe(ApiErrorType.SERVER_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('should classify quota exceeded errors correctly', () => {
      const error = { status: 402, message: 'Insufficient pollen balance' };
      const result = ErrorService.parseError(error);

      expect(result.type).toBe(ApiErrorType.INSUFFICIENT_BALANCE);
      expect(result.retryable).toBe(false);
    });
  });

  describe('Error Message Generation', () => {
    it('should generate user-friendly messages', () => {
      const error = ErrorService.parseError({ status: 401, message: 'Unauthorized' });
      const userMessage = ErrorService.getUserFriendlyMessage(error);

      expect(userMessage).toContain('authentication');
      expect(userMessage).not.toContain('401');
    });

    it('should include retry information when applicable', () => {
      const error = ErrorService.parseError({
        status: 429,
        message: 'Rate limit exceeded',
        retryAfter: 120
      });
      const userMessage = ErrorService.getUserFriendlyMessage(error);

      expect(userMessage).toContain('2 minute');
    });
  });

  describe('Fallback Detection', () => {
    it('should identify errors that should use fallback', () => {
      const qualityError = ErrorService.parseError({
        message: 'Quality check failed'
      });
      expect(ErrorService.shouldUseFallback(qualityError)).toBe(true);

      const authError = ErrorService.parseError({
        status: 401,
        message: 'Unauthorized'
      });
      expect(ErrorService.shouldUseFallback(authError)).toBe(false);
    });
  });

  describe('Retry Logic', () => {
    it('should calculate retry delays with exponential backoff', () => {
      const error = ErrorService.parseError({
        status: 500,
        message: 'Server error'
      });

      const delay1 = ErrorService.getRetryDelay(error, 1);
      const delay2 = ErrorService.getRetryDelay(error, 2);
      const delay3 = ErrorService.getRetryDelay(error, 3);

      expect(delay2).toBeGreaterThan(delay1);
      expect(delay3).toBeGreaterThan(delay2);
      expect(delay3).toBeLessThanOrEqual(60000); // Cap at 60 seconds
    });

    it('should return 0 delay for non-retryable errors', () => {
      const error = ErrorService.parseError({
        status: 401,
        message: 'Unauthorized'
      });

      const delay = ErrorService.getRetryDelay(error, 1);
      expect(delay).toBe(0);
    });
  });

  describe('Recovery Plans', () => {
    it('should create appropriate recovery plans', () => {
      const networkError = ErrorService.parseError({
        message: 'Network error'
      });

      const recoveryPlan = ErrorService.createRecoveryPlan(networkError.type);

      expect(recoveryPlan.immediate).toContain('Check internet connection');
      expect(recoveryPlan.shortTerm).toContain('Try again in a few minutes');
      expect(recoveryPlan.longTerm).toContain('Contact your internet provider if issues persist');
    });
  });

  describe('Error Monitoring', () => {
    it('should create monitoring reports with correct severity', () => {
      const criticalError = ErrorService.parseError({
        status: 401,
        message: 'Authentication failed'
      });

      const report = ErrorService.createMonitoringReport(criticalError);

      expect(report.severity).toBe('critical');
      expect(report.category).toBe('authentication');
      expect(report.tags).toContain('AUTHENTICATION');
    });

    it('should format errors for logging', () => {
      const error = ErrorService.parseError({
        status: 500,
        message: 'Server error'
      }, {
        gameType: 'word-drop-dash',
        operation: 'audio_generation'
      });

      const logString = ErrorService.formatForLogging(error);
      const logData = JSON.parse(logString);

      expect(logData.type).toBe('SERVER_ERROR');
      expect(logData.gameType).toBe('word-drop-dash');
      expect(logData.operation).toBe('audio_generation');
      expect(logData.timestamp).toBeDefined();
    });
  });

  describe('Retry with Backoff', () => {
    beforeEach(() => {
      // Mock setTimeout to make tests run faster
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should retry operations with exponential backoff', async () => {
      let attempts = 0;
      const maxRetries = 2;

      const operation = async () => {
        attempts++;
        if (attempts < maxRetries) {
          const error = new Error('Temporary failure');
          (error as any).status = 500; // Make it retryable
          throw error;
        }
        return 'success';
      };

      const retryPromise = ErrorService.retryWithBackoff(operation, {
        maxRetries,
        operation: 'test_operation'
      });

      // Fast-forward through the retry delays
      await vi.runAllTimersAsync();

      const result = await retryPromise;

      expect(result).toBe('success');
      expect(attempts).toBe(maxRetries);
    });

    it('should not retry non-retryable errors', async () => {
      let attempts = 0;

      const operation = async () => {
        attempts++;
        const error = new Error('Authentication failed');
        (error as any).status = 401;
        throw error;
      };

      await expect(ErrorService.retryWithBackoff(operation, {
        maxRetries: 3,
        operation: 'test_operation'
      })).rejects.toThrow();

      expect(attempts).toBe(1); // Should not retry
    });
  });
});
