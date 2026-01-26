/**
 * Enhanced error types for comprehensive API error handling
 */
export enum ApiErrorType {
  // Authentication & Authorization
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_KEY_EXPIRED = 'API_KEY_EXPIRED',
  
  // Rate Limiting & Quotas
  RATE_LIMIT = 'RATE_LIMIT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  DAILY_LIMIT_EXCEEDED = 'DAILY_LIMIT_EXCEEDED',
  
  // Network & Connectivity
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  DNS_ERROR = 'DNS_ERROR',
  
  // Server Errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
  OVERLOADED = 'OVERLOADED',
  
  // Validation & Content
  VALIDATION = 'VALIDATION',
  CONTENT_POLICY = 'CONTENT_POLICY',
  PROMPT_TOO_LONG = 'PROMPT_TOO_LONG',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  
  // Content Generation Specific
  GENERATION_FAILED = 'GENERATION_FAILED',
  QUALITY_CHECK_FAILED = 'QUALITY_CHECK_FAILED',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  
  // Legacy compatibility
  NETWORK_ERROR = 'NETWORK',
  API_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION',
  QUALITY_ERROR = 'QUALITY_CHECK_FAILED',
  TIMEOUT_ERROR = 'TIMEOUT',
  RATE_LIMIT_ERROR = 'RATE_LIMIT',
  AUTHENTICATION_ERROR = 'AUTHENTICATION',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Enhanced API error interface with comprehensive error information
 */
export interface ApiError {
  // Core error information
  type: ApiErrorType;
  message: string;
  userMessage: string;
  
  // Technical details
  statusCode?: number;
  errorCode?: string;
  technicalDetails?: string;
  
  // Retry information
  retryable: boolean;
  retryAfter?: number;
  maxRetries?: number;
  
  // Context information
  endpoint?: string;
  requestId?: string;
  timestamp: string;
  
  // User guidance
  suggestions: string[];
  recoveryActions: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  
  // Game context
  gameType?: string;
  operation?: string;
}

/**
 * Legacy interface for backward compatibility
 */
export interface ContentGenerationError extends ApiError {
  // Maintained for backward compatibility
}

/**
 * Comprehensive error message templates for different error types
 */
const ERROR_TEMPLATES: Record<ApiErrorType, {
  userMessage: string;
  suggestions: string[];
  retryable: boolean;
  maxRetries?: number;
  baseDelay?: number;
}> = {
  // Authentication & Authorization Errors
  [ApiErrorType.AUTHENTICATION]: {
    userMessage: "There's an issue with your account authentication.",
    suggestions: [
      "Try signing out and signing back in",
      "Clear your browser cache and cookies",
      "Contact support if the problem continues"
    ],
    retryable: false
  },
  [ApiErrorType.AUTHORIZATION]: {
    userMessage: "You don't have permission to access this feature.",
    suggestions: [
      "Check your account permissions",
      "Contact support for access",
      "Try a different account if available"
    ],
    retryable: false
  },
  [ApiErrorType.API_KEY_INVALID]: {
    userMessage: "The API key is invalid or has been revoked.",
    suggestions: [
      "Check the API key configuration",
      "Generate a new API key",
      "Contact the administrator"
    ],
    retryable: false
  },
  [ApiErrorType.API_KEY_EXPIRED]: {
    userMessage: "The API key has expired and needs to be renewed.",
    suggestions: [
      "Renew your API key",
      "Contact support for assistance",
      "Check your account status"
    ],
    retryable: false
  },

  // Rate Limiting & Quota Errors
  [ApiErrorType.RATE_LIMIT]: {
    userMessage: "You've reached the rate limit. Please wait before trying again.",
    suggestions: [
      "Wait a few minutes before generating new content",
      "Play existing games while you wait",
      "Consider upgrading for higher limits"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 60000
  },
  [ApiErrorType.QUOTA_EXCEEDED]: {
    userMessage: "You've used up your content generation quota.",
    suggestions: [
      "Your quota will reset according to your plan",
      "Play existing games in the meantime",
      "Consider upgrading for unlimited access"
    ],
    retryable: false
  },
  [ApiErrorType.INSUFFICIENT_BALANCE]: {
    userMessage: "Insufficient account balance to complete this request.",
    suggestions: [
      "Add credits to your account",
      "Check your billing information",
      "Contact support for assistance"
    ],
    retryable: false
  },
  [ApiErrorType.DAILY_LIMIT_EXCEEDED]: {
    userMessage: "You've reached your daily usage limit.",
    suggestions: [
      "Your limit will reset tomorrow",
      "Use existing content while you wait",
      "Upgrade your plan for higher limits"
    ],
    retryable: false
  },

  // Network & Connectivity Errors
  [ApiErrorType.NETWORK]: {
    userMessage: "We're having trouble connecting to our servers. Please check your internet connection.",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page",
      "Wait a moment and try again"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 2000
  },
  [ApiErrorType.TIMEOUT]: {
    userMessage: "The request is taking longer than expected.",
    suggestions: [
      "Try again with a simpler request",
      "Check your internet connection",
      "Our servers might be busy - try again shortly"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 5000
  },
  [ApiErrorType.CONNECTION_REFUSED]: {
    userMessage: "Unable to connect to the service.",
    suggestions: [
      "Check your internet connection",
      "The service might be temporarily down",
      "Try again in a few minutes"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 10000
  },
  [ApiErrorType.DNS_ERROR]: {
    userMessage: "Unable to resolve the service address.",
    suggestions: [
      "Check your DNS settings",
      "Try using a different network",
      "Contact your network administrator"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 5000
  },

  // Server Errors
  [ApiErrorType.SERVER_ERROR]: {
    userMessage: "Our content generation service is temporarily unavailable.",
    suggestions: [
      "Try again in a few moments",
      "Use a different game type if available",
      "Contact support if the problem persists"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 5000
  },
  [ApiErrorType.SERVICE_UNAVAILABLE]: {
    userMessage: "The service is temporarily unavailable.",
    suggestions: [
      "Try again in a few minutes",
      "Check our status page for updates",
      "Use offline features while waiting"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 30000
  },
  [ApiErrorType.MAINTENANCE]: {
    userMessage: "The service is under maintenance.",
    suggestions: [
      "Check our status page for updates",
      "Try again after the maintenance window",
      "Use existing content while waiting"
    ],
    retryable: true,
    maxRetries: 1,
    baseDelay: 300000 // 5 minutes
  },
  [ApiErrorType.OVERLOADED]: {
    userMessage: "The service is currently overloaded.",
    suggestions: [
      "Try again in a few minutes",
      "Use less resource-intensive features",
      "Try during off-peak hours"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 15000
  },

  // Validation & Content Errors
  [ApiErrorType.VALIDATION]: {
    userMessage: "The request contains invalid parameters.",
    suggestions: [
      "Check your input parameters",
      "Try with different settings",
      "Contact support if the issue persists"
    ],
    retryable: false
  },
  [ApiErrorType.CONTENT_POLICY]: {
    userMessage: "The content violates our usage policies.",
    suggestions: [
      "Try with different content",
      "Review our content guidelines",
      "Use more appropriate language"
    ],
    retryable: false
  },
  [ApiErrorType.PROMPT_TOO_LONG]: {
    userMessage: "The prompt is too long for processing.",
    suggestions: [
      "Try with a shorter prompt",
      "Break down complex requests",
      "Use more concise language"
    ],
    retryable: false
  },
  [ApiErrorType.INVALID_PARAMETERS]: {
    userMessage: "Some parameters are invalid or missing.",
    suggestions: [
      "Check all required parameters",
      "Verify parameter formats",
      "Try with default settings"
    ],
    retryable: false
  },

  // Content Generation Specific Errors
  [ApiErrorType.GENERATION_FAILED]: {
    userMessage: "Content generation failed unexpectedly.",
    suggestions: [
      "Try again with different parameters",
      "Use a different model if available",
      "Contact support if this persists"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 3000
  },
  [ApiErrorType.QUALITY_CHECK_FAILED]: {
    userMessage: "The generated content didn't meet our quality standards. We're trying again.",
    suggestions: [
      "This usually resolves automatically",
      "Try a different difficulty level",
      "Try a different topic if you specified one"
    ],
    retryable: true,
    maxRetries: 3,
    baseDelay: 1000
  },
  [ApiErrorType.MODEL_UNAVAILABLE]: {
    userMessage: "The requested AI model is currently unavailable.",
    suggestions: [
      "Try with a different model",
      "Wait for the model to become available",
      "Use fallback content for now"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 10000
  },

  // UNKNOWN_ERROR - only one that doesn't duplicate
  [ApiErrorType.UNKNOWN_ERROR]: {
    userMessage: "Something unexpected happened. We're working to fix it.",
    suggestions: [
      "Try refreshing the page",
      "Wait a moment and try again",
      "Contact support if this keeps happening"
    ],
    retryable: true,
    maxRetries: 2,
    baseDelay: 2000
  }
};

/**
 * Enhanced Error Service for comprehensive API error handling
 */
export class ErrorService {
  /**
   * Parse and classify an error from any API with comprehensive error detection
   */
  static parseError(error: any, context?: {
    gameType?: string;
    operation?: string;
    endpoint?: string;
    requestId?: string;
  }): ApiError {
    const timestamp = new Date().toISOString();
    let errorType = ApiErrorType.UNKNOWN_ERROR;
    let statusCode = error.status || error.statusCode;
    let technicalDetails = '';
    let errorCode = error.code || error.error_code;

    // Extract technical details
    if (error.message) {
      technicalDetails = error.message;
    }
    if (error.response?.data?.message) {
      technicalDetails += ` | Response: ${error.response.data.message}`;
    }
    if (statusCode) {
      technicalDetails += ` | Status: ${statusCode}`;
    }
    if (errorCode) {
      technicalDetails += ` | Code: ${errorCode}`;
    }

    // Classify error based on status code
    if (statusCode) {
      errorType = this.classifyByStatusCode(statusCode, error);
    }
    // Classify by error message content
    else if (error.message) {
      errorType = this.classifyByMessage(error.message);
    }
    // Classify by error name/type
    else if (error.name || error.type) {
      errorType = this.classifyByName(error.name || error.type);
    }
    // Classify by network conditions
    else {
      errorType = this.classifyByNetworkConditions(error);
    }

    const template = ERROR_TEMPLATES[errorType];
    const recoveryActions = this.createRecoveryPlan(errorType, context);
    
    return {
      type: errorType,
      message: error.message || 'Unknown error occurred',
      userMessage: template.userMessage,
      statusCode,
      errorCode,
      technicalDetails,
      retryable: template.retryable,
      retryAfter: error.retryAfter || error.retry_after,
      maxRetries: template.maxRetries || 3,
      endpoint: context?.endpoint,
      requestId: context?.requestId,
      timestamp,
      suggestions: template.suggestions,
      recoveryActions,
      gameType: context?.gameType,
      operation: context?.operation
    };
  }

  /**
   * Classify error by HTTP status code
   */
  private static classifyByStatusCode(statusCode: number, error: any): ApiErrorType {
    switch (statusCode) {
      // Authentication & Authorization
      case 401:
        if (error.message?.includes('expired')) return ApiErrorType.API_KEY_EXPIRED;
        if (error.message?.includes('invalid')) return ApiErrorType.API_KEY_INVALID;
        return ApiErrorType.AUTHENTICATION;
      case 403:
        return ApiErrorType.AUTHORIZATION;

      // Rate Limiting & Quotas
      case 402:
        if (error.message?.includes('balance')) return ApiErrorType.INSUFFICIENT_BALANCE;
        return ApiErrorType.QUOTA_EXCEEDED;
      case 429:
        if (error.message?.includes('daily')) return ApiErrorType.DAILY_LIMIT_EXCEEDED;
        return ApiErrorType.RATE_LIMIT;

      // Client Errors
      case 400:
        if (error.message?.includes('prompt') && error.message?.includes('long')) {
          return ApiErrorType.PROMPT_TOO_LONG;
        }
        if (error.message?.includes('parameter')) return ApiErrorType.INVALID_PARAMETERS;
        if (error.message?.includes('policy')) return ApiErrorType.CONTENT_POLICY;
        return ApiErrorType.VALIDATION;
      case 404:
        if (error.message?.includes('model')) return ApiErrorType.MODEL_UNAVAILABLE;
        return ApiErrorType.VALIDATION;
      case 422:
        return ApiErrorType.VALIDATION;

      // Server Errors
      case 500:
        return ApiErrorType.SERVER_ERROR;
      case 502:
      case 504:
        return ApiErrorType.SERVICE_UNAVAILABLE;
      case 503:
        if (error.message?.includes('maintenance')) return ApiErrorType.MAINTENANCE;
        if (error.message?.includes('overload')) return ApiErrorType.OVERLOADED;
        return ApiErrorType.SERVICE_UNAVAILABLE;

      default:
        if (statusCode >= 500) return ApiErrorType.SERVER_ERROR;
        if (statusCode >= 400) return ApiErrorType.VALIDATION;
        return ApiErrorType.UNKNOWN_ERROR;
    }
  }

  /**
   * Classify error by message content
   */
  private static classifyByMessage(message: string): ApiErrorType {
    const lowerMessage = message.toLowerCase();

    // Authentication
    if (lowerMessage.includes('authentication') || lowerMessage.includes('unauthorized')) {
      return ApiErrorType.AUTHENTICATION;
    }
    if (lowerMessage.includes('api key') && lowerMessage.includes('invalid')) {
      return ApiErrorType.API_KEY_INVALID;
    }
    if (lowerMessage.includes('api key') && lowerMessage.includes('expired')) {
      return ApiErrorType.API_KEY_EXPIRED;
    }

    // Rate limiting
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
      return ApiErrorType.RATE_LIMIT;
    }
    if (lowerMessage.includes('quota') || lowerMessage.includes('limit exceeded')) {
      return ApiErrorType.QUOTA_EXCEEDED;
    }
    if (lowerMessage.includes('insufficient') && lowerMessage.includes('balance')) {
      return ApiErrorType.INSUFFICIENT_BALANCE;
    }

    // Network
    if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
      return ApiErrorType.TIMEOUT;
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('failed to fetch')) {
      return ApiErrorType.NETWORK;
    }
    if (lowerMessage.includes('dns') || lowerMessage.includes('resolve')) {
      return ApiErrorType.DNS_ERROR;
    }

    // Content generation
    if (lowerMessage.includes('generation failed') || lowerMessage.includes('failed to generate')) {
      return ApiErrorType.GENERATION_FAILED;
    }
    if (lowerMessage.includes('quality') || lowerMessage.includes('validation')) {
      return ApiErrorType.QUALITY_CHECK_FAILED;
    }
    if (lowerMessage.includes('model') && lowerMessage.includes('unavailable')) {
      return ApiErrorType.MODEL_UNAVAILABLE;
    }

    // Server issues
    if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
      return ApiErrorType.SERVER_ERROR;
    }
    if (lowerMessage.includes('maintenance')) {
      return ApiErrorType.MAINTENANCE;
    }
    if (lowerMessage.includes('overload') || lowerMessage.includes('busy')) {
      return ApiErrorType.OVERLOADED;
    }

    return ApiErrorType.UNKNOWN_ERROR;
  }

  /**
   * Classify error by error name or type
   */
  private static classifyByName(name: string): ApiErrorType {
    switch (name) {
      case 'TimeoutError':
      case 'TIMEOUT':
        return ApiErrorType.TIMEOUT;
      case 'NetworkError':
      case 'TypeError':
        return ApiErrorType.NETWORK;
      case 'AbortError':
        return ApiErrorType.NETWORK;
      case 'ValidationError':
        return ApiErrorType.VALIDATION;
      case 'AuthenticationError':
        return ApiErrorType.AUTHENTICATION;
      case 'RateLimitError':
        return ApiErrorType.RATE_LIMIT;
      default:
        return ApiErrorType.UNKNOWN_ERROR;
    }
  }

  /**
   * Classify error by network conditions
   */
  private static classifyByNetworkConditions(error: any): ApiErrorType {
    // Check if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return ApiErrorType.NETWORK;
    }

    // Check error codes
    if (error.code) {
      switch (error.code) {
        case 'ENOTFOUND':
        case 'ENOENT':
          return ApiErrorType.DNS_ERROR;
        case 'ECONNREFUSED':
        case 'ECONNRESET':
          return ApiErrorType.CONNECTION_REFUSED;
        case 'ETIMEDOUT':
          return ApiErrorType.TIMEOUT;
        case 'ENETUNREACH':
        case 'EHOSTUNREACH':
          return ApiErrorType.NETWORK;
        default:
          return ApiErrorType.NETWORK;
      }
    }

    return ApiErrorType.UNKNOWN_ERROR;
  }

  /**
   * Get user-friendly error message with context
   */
  static getUserFriendlyMessage(error: ApiError): string {
    let message = error.userMessage;

    if (error.gameType) {
      message = message.replace('content', `${error.gameType} game content`);
    }

    if (error.retryAfter) {
      const minutes = Math.ceil(error.retryAfter / 60);
      message += ` Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
    }

    return message;
  }

  /**
   * Get contextual suggestions based on error and game type
   */
  static getContextualSuggestions(error: ApiError): string[] {
    const baseSuggestions = [...error.suggestions];

    // Add game-specific suggestions
    if (error.gameType) {
      switch (error.type) {
        case ApiErrorType.TIMEOUT:
          if (error.gameType === 'image-instinct') {
            baseSuggestions.unshift('Image generation can take longer - try a text-based game');
          }
          break;
        case ApiErrorType.QUALITY_CHECK_FAILED:
          baseSuggestions.unshift('Try adjusting the difficulty level or topic');
          break;
        case ApiErrorType.VALIDATION:
          if (error.gameType === 'conjugation-coach') {
            baseSuggestions.unshift('Try a different target language or difficulty');
          }
          break;
      }
    }

    // Add time-based suggestions
    const hour = new Date().getHours();
    if (error.type === ApiErrorType.SERVER_ERROR && (hour < 6 || hour > 22)) {
      baseSuggestions.push('Our servers may be under maintenance - try again in the morning');
    }

    return baseSuggestions;
  }

  /**
   * Determine if error should trigger fallback content
   */
  static shouldUseFallback(error: ApiError): boolean {
    return [
      ApiErrorType.QUALITY_CHECK_FAILED,
      ApiErrorType.VALIDATION,
      ApiErrorType.TIMEOUT,
      ApiErrorType.SERVER_ERROR,
      ApiErrorType.GENERATION_FAILED,
      ApiErrorType.MODEL_UNAVAILABLE,
      ApiErrorType.SERVICE_UNAVAILABLE,
      // Legacy compatibility
      ApiErrorType.QUALITY_ERROR,
      ApiErrorType.VALIDATION_ERROR,
      ApiErrorType.TIMEOUT_ERROR,
      ApiErrorType.API_ERROR
    ].includes(error.type);
  }

  /**
   * Get retry delay based on error type with exponential backoff
   */
  static getRetryDelay(error: ApiError, attemptNumber: number = 1): number {
    if (!error.retryable) return 0;

    if (error.retryAfter) return error.retryAfter * 1000;

    const template = ERROR_TEMPLATES[error.type];
    const baseDelay = template.baseDelay || 2000;

    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    
    return Math.min(exponentialDelay + jitter, 60000); // Cap at 60 seconds
  }

  /**
   * Implement retry logic with exponential backoff
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    context?: {
      gameType?: string;
      operation?: string;
      endpoint?: string;
      maxRetries?: number;
    }
  ): Promise<T> {
    const maxRetries = context?.maxRetries || 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (rawError) {
        const error = this.parseError(rawError, context);

        // Don't retry if error is not retryable or we've reached max retries
        if (!error.retryable || attempt === maxRetries) {
          throw error;
        }

        // Don't exceed the error's max retry limit
        if (error.maxRetries && attempt >= error.maxRetries) {
          throw error;
        }

        const delay = this.getRetryDelay(error, attempt);
        
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, {
          type: error.type,
          message: error.message,
          operation: context?.operation
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Format error for logging with comprehensive information
   */
  static formatForLogging(error: ApiError): string {
    return JSON.stringify({
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      endpoint: error.endpoint,
      requestId: error.requestId,
      gameType: error.gameType,
      operation: error.operation,
      technicalDetails: error.technicalDetails,
      timestamp: error.timestamp,
      retryable: error.retryable,
      retryAfter: error.retryAfter
    }, null, 2);
  }

  /**
   * Create a comprehensive recovery action plan
   */
  static createRecoveryPlan(errorType: ApiErrorType, context?: {
    gameType?: string;
    operation?: string;
  }): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  } {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    switch (errorType) {
      case ApiErrorType.NETWORK:
      case ApiErrorType.CONNECTION_REFUSED:
      case ApiErrorType.DNS_ERROR:
        immediate.push('Check internet connection', 'Refresh the page');
        shortTerm.push('Try again in a few minutes', 'Try a different network');
        longTerm.push('Contact your internet provider if issues persist');
        break;

      case ApiErrorType.AUTHENTICATION:
      case ApiErrorType.API_KEY_INVALID:
      case ApiErrorType.API_KEY_EXPIRED:
        immediate.push('Sign out and sign back in');
        shortTerm.push('Clear browser cache and cookies');
        longTerm.push('Contact support for account assistance');
        break;

      case ApiErrorType.RATE_LIMIT:
      case ApiErrorType.DAILY_LIMIT_EXCEEDED:
        immediate.push('Wait before trying again');
        shortTerm.push('Play existing games while waiting');
        longTerm.push('Consider upgrading your account');
        break;

      case ApiErrorType.QUOTA_EXCEEDED:
      case ApiErrorType.INSUFFICIENT_BALANCE:
        immediate.push('Use existing game content');
        shortTerm.push('Wait for quota reset or add credits');
        longTerm.push('Upgrade to unlimited plan');
        break;

      case ApiErrorType.SERVER_ERROR:
      case ApiErrorType.SERVICE_UNAVAILABLE:
        immediate.push('Try a different game type');
        shortTerm.push('Wait for service restoration');
        longTerm.push('Report persistent issues to support');
        break;

      case ApiErrorType.TIMEOUT:
        immediate.push('Try with simpler settings');
        shortTerm.push('Check internet speed');
        longTerm.push('Contact support if timeouts persist');
        break;

      case ApiErrorType.QUALITY_CHECK_FAILED:
      case ApiErrorType.GENERATION_FAILED:
        immediate.push('Try again with different parameters');
        shortTerm.push('Use fallback content');
        longTerm.push('Report quality issues to help us improve');
        break;

      case ApiErrorType.MODEL_UNAVAILABLE:
        immediate.push('Try a different game type');
        shortTerm.push('Wait for model to become available');
        longTerm.push('Use alternative features');
        break;

      default:
        immediate.push('Refresh and try again');
        shortTerm.push('Try different settings');
        longTerm.push('Contact support if needed');
    }

    // Add context-specific actions
    if (context?.gameType === 'image-instinct' && errorType === ApiErrorType.TIMEOUT) {
      immediate.unshift('Try a text-based game instead');
    }

    return { immediate, shortTerm, longTerm };
  }

  /**
   * Log error with appropriate level based on severity
   */
  static logError(error: ApiError, level: 'error' | 'warn' | 'info' = 'error'): void {
    const logData = {
      timestamp: error.timestamp,
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      endpoint: error.endpoint,
      gameType: error.gameType,
      operation: error.operation,
      retryable: error.retryable
    };

    switch (level) {
      case 'error':
        console.error('API Error:', logData);
        break;
      case 'warn':
        console.warn('API Warning:', logData);
        break;
      case 'info':
        console.info('API Info:', logData);
        break;
    }

    // Send to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).errorReporting) {
      (window as any).errorReporting.captureError(error);
    }
  }

  /**
   * Create error monitoring report
   */
  static createMonitoringReport(error: ApiError): {
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    tags: string[];
    metadata: Record<string, any>;
  } {
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    let category = 'api_error';
    const tags: string[] = [error.type];

    // Determine severity
    if ([
      ApiErrorType.AUTHENTICATION,
      ApiErrorType.API_KEY_INVALID,
      ApiErrorType.QUOTA_EXCEEDED
    ].includes(error.type)) {
      severity = 'critical';
    } else if ([
      ApiErrorType.SERVER_ERROR,
      ApiErrorType.SERVICE_UNAVAILABLE,
      ApiErrorType.RATE_LIMIT
    ].includes(error.type)) {
      severity = 'high';
    } else if ([
      ApiErrorType.TIMEOUT,
      ApiErrorType.NETWORK,
      ApiErrorType.GENERATION_FAILED
    ].includes(error.type)) {
      severity = 'medium';
    } else {
      severity = 'low';
    }

    // Categorize error
    if (error.type.includes('AUTHENTICATION') || error.type.includes('API_KEY')) {
      category = 'authentication';
    } else if (error.type.includes('RATE_LIMIT') || error.type.includes('QUOTA')) {
      category = 'rate_limiting';
    } else if (error.type.includes('NETWORK') || error.type.includes('TIMEOUT')) {
      category = 'connectivity';
    } else if (error.type.includes('SERVER') || error.type.includes('SERVICE')) {
      category = 'server_error';
    } else if (error.type.includes('GENERATION') || error.type.includes('QUALITY')) {
      category = 'content_generation';
    }

    // Add contextual tags
    if (error.gameType) tags.push(`game:${error.gameType}`);
    if (error.operation) tags.push(`operation:${error.operation}`);
    if (error.statusCode) tags.push(`status:${error.statusCode}`);

    return {
      severity,
      category,
      tags,
      metadata: {
        timestamp: error.timestamp,
        endpoint: error.endpoint,
        requestId: error.requestId,
        technicalDetails: error.technicalDetails,
        retryable: error.retryable,
        userMessage: error.userMessage
      }
    };
  }
}

export default ErrorService;