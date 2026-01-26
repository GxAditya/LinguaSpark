import config from '../config/index.js';

export enum ApiErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER'
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
  retryAfter?: number;
}

export interface AuthenticationManager {
  validateApiKey(): Promise<boolean>;
  getAuthHeaders(): Record<string, string>;
  handleAuthError(error: any): ApiError;
}

/**
 * Pollinations Authentication Service
 * Handles Bearer token authentication for the new Pollinations API
 */
export class PollinationsAuth implements AuthenticationManager {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || config.pollinations.apiKey;
    this.baseUrl = baseUrl || config.pollinations.baseUrl;

    if (!this.apiKey) {
      throw new Error('Pollinations API key is required');
    }
  }

  /**
   * Get authentication headers for API requests
   * @returns Headers object with Bearer token
   */
  getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Validate API key by checking if it's properly formatted
   * Note: For production apps, you might want to make an actual API call,
   * but for development we'll just validate the format to save API credits
   * @returns Promise<boolean> - true if API key appears valid
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // Basic format validation - Pollinations keys start with 'pk_'
      if (!this.apiKey || !this.apiKey.startsWith('pk_')) {
        console.warn('Pollinations API key format invalid - should start with "pk_"');
        return false;
      }

      // Check minimum length (actual keys are longer)
      if (this.apiKey.length < 20) {
        console.warn('Pollinations API key appears too short');
        return false;
      }

      // For development, we'll assume the key is valid if format is correct
      // In production, you might want to make a minimal API call here
      console.log('Pollinations API key format validation passed');
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  /**
   * Validate API key by making an actual API call (use sparingly to save credits)
   * @returns Promise<boolean> - true if API key works with actual API
   */
  async validateApiKeyWithCall(): Promise<boolean> {
    try {
      // Make a minimal test request to validate the API key
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          model: config.pollinations.textModel,
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1
        })
      });

      // If we get 401, the API key is invalid
      if (response.status === 401) {
        return false;
      }

      // If we get 402, insufficient balance but API key is valid
      if (response.status === 402) {
        console.warn('Pollinations API: Insufficient pollen balance');
        return true; // API key is valid, just no balance
      }

      // Any 2xx response means the API key is valid
      return response.ok;
    } catch (error) {
      console.error('API key validation with call failed:', error);
      return false;
    }
  }

  /**
   * Handle authentication errors and convert them to standardized format
   * @param error - Raw error from API request
   * @returns Standardized ApiError object
   */
  handleAuthError(error: any): ApiError {
    // Handle HTTP status codes
    if (error.status || error.statusCode) {
      const status = error.status || error.statusCode;

      switch (status) {
        case 401:
          return {
            type: ApiErrorType.AUTHENTICATION,
            message: 'API key is invalid or expired. Please check your POLLINATIONS_API_KEY.',
            statusCode: 401,
            retryable: false
          };

        case 402:
          return {
            type: ApiErrorType.RATE_LIMIT,
            message: 'Insufficient pollen balance. Please top up your account.',
            statusCode: 402,
            retryable: false
          };

        case 403:
          return {
            type: ApiErrorType.AUTHENTICATION,
            message: 'Access forbidden. Please check your API key permissions.',
            statusCode: 403,
            retryable: false
          };

        case 429:
          return {
            type: ApiErrorType.RATE_LIMIT,
            message: 'Rate limit exceeded. Please try again later.',
            statusCode: 429,
            retryable: true,
            retryAfter: error.retryAfter || 60
          };

        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ApiErrorType.SERVER,
            message: 'Pollinations API server error. Please try again later.',
            statusCode: status,
            retryable: true
          };

        default:
          return {
            type: ApiErrorType.SERVER,
            message: error.message || `API request failed with status ${status}`,
            statusCode: status,
            retryable: status >= 500
          };
      }
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.name === 'TypeError') {
      return {
        type: ApiErrorType.NETWORK,
        message: 'Network error. Please check your internet connection.',
        retryable: true
      };
    }

    // Handle validation errors
    if (error.message && error.message.includes('validation')) {
      return {
        type: ApiErrorType.VALIDATION,
        message: error.message,
        retryable: false
      };
    }

    // Default error handling
    return {
      type: ApiErrorType.SERVER,
      message: error.message || 'An unexpected error occurred',
      retryable: false
    };
  }

  /**
   * Retry logic with exponential backoff
   * @param operation - Function to retry
   * @param maxRetries - Maximum number of retry attempts
   * @param baseDelay - Base delay in milliseconds
   * @returns Promise with the result of the operation
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const apiError = this.handleAuthError(error);

        // Don't retry if error is not retryable or we've reached max retries
        if (!apiError.retryable || attempt === maxRetries) {
          throw apiError;
        }

        // Calculate delay with exponential backoff
        const delay = apiError.retryAfter 
          ? apiError.retryAfter * 1000 
          : baseDelay * Math.pow(2, attempt - 1);

        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, apiError.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }
}

// Export singleton instance
export const pollinationsAuth = new PollinationsAuth();

export default PollinationsAuth;