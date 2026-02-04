import { ErrorService, ApiError } from './error.service.js';
import { errorMonitoringService } from './error-monitoring.service.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
  error?: {
    type: string;
    message: string;
    statusCode: number;
    retryable: boolean;
    retryAfter?: number;
    suggestions?: string[];
  };
}

class ApiService {
  private baseUrl: string;
  private requestCount = 0;
  private errorCount = 0;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const requestId = this.generateRequestId();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    this.requestCount++;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        this.errorCount++;
        
        // Create enhanced error object
        const errorInfo = {
          status: response.status,
          statusText: response.statusText,
          message: data.error?.message || data.message || 'An error occurred',
          type: data.error?.type || 'API_ERROR',
          retryable: data.error?.retryable || false,
          retryAfter: data.error?.retryAfter ?? data.error?.retryAfterSeconds,
          suggestions: data.error?.suggestions || [],
          errors: data.errors,
          requestId,
          endpoint,
          timestamp: new Date().toISOString()
        };

        // Parse and log the error
        const apiError = ErrorService.parseError(errorInfo, {
          endpoint,
          requestId,
          operation: this.getOperationFromEndpoint(endpoint)
        });

        // Log to monitoring service
        errorMonitoringService.logError(apiError, {
          url: `${this.baseUrl}${endpoint}`,
          requestId
        });

        throw apiError;
      }

      return data;
    } catch (error: unknown) {
      // Handle network and other errors
      if (error instanceof Error && !(error as any).type) {
        this.errorCount++;
        
        const apiError = ErrorService.parseError(error, {
          endpoint,
          requestId,
          operation: this.getOperationFromEndpoint(endpoint)
        });

        // Log to monitoring service
        errorMonitoringService.logError(apiError, {
          url: `${this.baseUrl}${endpoint}`,
          requestId
        });

        throw apiError;
      }
      
      // Re-throw already processed errors
      throw error;
    }
  }

  private getOperationFromEndpoint(endpoint: string): string {
    if (endpoint.includes('/pollinations/text')) return 'text_generation';
    if (endpoint.includes('/pollinations/image')) return 'image_generation';
    if (endpoint.includes('/pollinations/game-content')) return 'game_content_generation';
    if (endpoint.includes('/auth/')) return 'authentication';
    if (endpoint.includes('/games/')) return 'game_session';
    if (endpoint.includes('/lessons/')) return 'lesson_management';
    return 'api_request';
  }

  // GET request with enhanced error handling
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request with enhanced error handling
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request with enhanced error handling
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PATCH request with enhanced error handling
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request with enhanced error handling
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Request with retry logic
  async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<ApiResponse<T>> {
    return ErrorService.retryWithBackoff(
      () => this.request<T>(endpoint, options),
      {
        endpoint,
        operation: this.getOperationFromEndpoint(endpoint),
        maxRetries
      }
    );
  }

  // Batch requests with error handling
  async batchRequest<T>(
    requests: Array<{ endpoint: string; options?: RequestInit }>,
    options: { 
      maxConcurrent?: number;
      stopOnError?: boolean;
    } = {}
  ): Promise<Array<{ success: boolean; data?: T; error?: ApiError }>> {
    const { maxConcurrent = 5, stopOnError = false } = options;
    const results: Array<{ success: boolean; data?: T; error?: ApiError }> = [];
    
    // Process requests in batches
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async ({ endpoint, options = {} }) => {
        try {
          const response = await this.request<T>(endpoint, options);
          return { success: true, data: response.data };
        } catch (error) {
          const apiError = error as ApiError;
          if (stopOnError) {
            throw apiError;
          }
          return { success: false, error: apiError };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  // Health check with comprehensive status
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    metrics: {
      requestCount: number;
      errorCount: number;
      errorRate: number;
      uptime: number;
    };
    timestamp: string;
  }> {
    const startTime = Date.now();
    const services: Record<string, boolean> = {};
    
    // Test core endpoints
    const testEndpoints = [
      '/pollinations/status',
      '/auth/me',
      '/games/types'
    ];

    const serviceTests = testEndpoints.map(async (endpoint) => {
      try {
        await this.get(endpoint);
        services[endpoint] = true;
      } catch (error) {
        services[endpoint] = false;
      }
    });

    await Promise.allSettled(serviceTests);

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    const serviceHealthRatio = healthyServices / totalServices;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (serviceHealthRatio >= 0.8) {
      status = 'healthy';
    } else if (serviceHealthRatio >= 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;

    return {
      status,
      services,
      metrics: {
        requestCount: this.requestCount,
        errorCount: this.errorCount,
        errorRate,
        uptime: Date.now() - startTime
      },
      timestamp: new Date().toISOString()
    };
  }

  // Get API statistics
  getStats(): {
    requestCount: number;
    errorCount: number;
    errorRate: number;
    errorMetrics: any;
  } {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      errorMetrics: errorMonitoringService.getMetrics()
    };
  }

  // Reset statistics
  resetStats(): void {
    this.requestCount = 0;
    this.errorCount = 0;
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
