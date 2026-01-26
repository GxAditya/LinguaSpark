/**
 * Error types for content generation
 */
export enum ContentErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  QUALITY_ERROR = 'QUALITY_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Content generation error interface
 */
export interface ContentGenerationError {
  type: ContentErrorType;
  message: string;
  userMessage: string;
  suggestions: string[];
  retryable: boolean;
  retryAfter?: number;
  technicalDetails?: string;
  gameType?: string;
}

/**
 * Error message templates for different error types
 */
const ERROR_MESSAGES: Record<ContentErrorType, {
  userMessage: string;
  suggestions: string[];
  retryable: boolean;
}> = {
  [ContentErrorType.NETWORK_ERROR]: {
    userMessage: "We're having trouble connecting to our servers. Please check your internet connection.",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page",
      "Wait a moment and try again"
    ],
    retryable: true
  },
  [ContentErrorType.API_ERROR]: {
    userMessage: "Our content generation service is temporarily unavailable.",
    suggestions: [
      "Try again in a few moments",
      "Use a different game type if available",
      "Contact support if the problem persists"
    ],
    retryable: true
  },
  [ContentErrorType.VALIDATION_ERROR]: {
    userMessage: "The generated content didn't meet our quality standards. We're trying again.",
    suggestions: [
      "This usually resolves automatically",
      "Try a different difficulty level",
      "Try a different topic if you specified one"
    ],
    retryable: true
  },
  [ContentErrorType.QUALITY_ERROR]: {
    userMessage: "We couldn't generate high-quality content for your request. Using our backup content instead.",
    suggestions: [
      "The backup content is still great for learning",
      "Try different settings for fresh content",
      "This helps us improve our content generation"
    ],
    retryable: true
  },
  [ContentErrorType.TIMEOUT_ERROR]: {
    userMessage: "Content generation is taking longer than expected.",
    suggestions: [
      "Try again with a simpler request",
      "Check your internet connection",
      "Our servers might be busy - try again shortly"
    ],
    retryable: true
  },
  [ContentErrorType.RATE_LIMIT_ERROR]: {
    userMessage: "You've reached the limit for content generation. Please wait before trying again.",
    suggestions: [
      "Wait a few minutes before generating new content",
      "Play existing games while you wait",
      "Consider upgrading for unlimited generation"
    ],
    retryable: true
  },
  [ContentErrorType.AUTHENTICATION_ERROR]: {
    userMessage: "There's an issue with your account authentication.",
    suggestions: [
      "Try signing out and signing back in",
      "Clear your browser cache and cookies",
      "Contact support if the problem continues"
    ],
    retryable: false
  },
  [ContentErrorType.QUOTA_EXCEEDED]: {
    userMessage: "You've used up your content generation quota for today.",
    suggestions: [
      "Your quota will reset tomorrow",
      "Play existing games in the meantime",
      "Consider upgrading for unlimited access"
    ],
    retryable: false
  },
  [ContentErrorType.UNKNOWN_ERROR]: {
    userMessage: "Something unexpected happened. We're working to fix it.",
    suggestions: [
      "Try refreshing the page",
      "Wait a moment and try again",
      "Contact support if this keeps happening"
    ],
    retryable: true
  }
};

/**
 * Error Service for handling content generation errors
 */
export class ErrorService {
  /**
   * Parse and classify an error from the API
   */
  static parseError(error: any, gameType?: string): ContentGenerationError {
    let errorType = ContentErrorType.UNKNOWN_ERROR;
    let technicalDetails = '';

    // Determine error type based on error properties
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      errorType = ContentErrorType.TIMEOUT_ERROR;
    } else if (error.status === 401 || error.message?.includes('authentication')) {
      errorType = ContentErrorType.AUTHENTICATION_ERROR;
    } else if (error.status === 402 || error.message?.includes('quota') || error.message?.includes('balance')) {
      errorType = ContentErrorType.QUOTA_EXCEEDED;
    } else if (error.status === 429 || error.message?.includes('rate limit')) {
      errorType = ContentErrorType.RATE_LIMIT_ERROR;
    } else if (error.message?.includes('validation')) {
      errorType = ContentErrorType.VALIDATION_ERROR;
    } else if (error.message?.includes('quality')) {
      errorType = ContentErrorType.QUALITY_ERROR;
    } else if (error.status >= 500 || error.message?.includes('server')) {
      errorType = ContentErrorType.API_ERROR;
    } else if (!navigator.onLine || error.message?.includes('network')) {
      errorType = ContentErrorType.NETWORK_ERROR;
    }

    // Extract technical details
    if (error.message) {
      technicalDetails = error.message;
    }
    if (error.status) {
      technicalDetails += ` (Status: ${error.status})`;
    }

    const template = ERROR_MESSAGES[errorType];
    
    return {
      type: errorType,
      message: error.message || 'Unknown error occurred',
      userMessage: template.userMessage,
      suggestions: template.suggestions,
      retryable: template.retryable,
      retryAfter: error.retryAfter,
      technicalDetails,
      gameType
    };
  }

  /**
   * Get user-friendly error message with context
   */
  static getUserFriendlyMessage(error: ContentGenerationError): string {
    let message = error.userMessage;

    if (error.gameType) {
      message = message.replace('content', `${error.gameType} game content`);
    }

    if (error.retryAfter) {
      const minutes = Math.ceil(error.retryAfter / 60000);
      message += ` Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
    }

    return message;
  }

  /**
   * Get contextual suggestions based on error and game type
   */
  static getContextualSuggestions(error: ContentGenerationError): string[] {
    const baseSuggestions = [...error.suggestions];

    // Add game-specific suggestions
    if (error.gameType) {
      switch (error.type) {
        case ContentErrorType.TIMEOUT_ERROR:
          if (error.gameType === 'image-instinct') {
            baseSuggestions.unshift('Image generation can take longer - try a text-based game');
          }
          break;
        case ContentErrorType.QUALITY_ERROR:
          baseSuggestions.unshift('Try adjusting the difficulty level or topic');
          break;
        case ContentErrorType.VALIDATION_ERROR:
          if (error.gameType === 'conjugation-coach') {
            baseSuggestions.unshift('Try a different target language or difficulty');
          }
          break;
      }
    }

    // Add time-based suggestions
    const hour = new Date().getHours();
    if (error.type === ContentErrorType.API_ERROR && (hour < 6 || hour > 22)) {
      baseSuggestions.push('Our servers may be under maintenance - try again in the morning');
    }

    return baseSuggestions;
  }

  /**
   * Determine if error should trigger fallback content
   */
  static shouldUseFallback(error: ContentGenerationError): boolean {
    return [
      ContentErrorType.QUALITY_ERROR,
      ContentErrorType.VALIDATION_ERROR,
      ContentErrorType.TIMEOUT_ERROR,
      ContentErrorType.API_ERROR
    ].includes(error.type);
  }

  /**
   * Get retry delay based on error type
   */
  static getRetryDelay(error: ContentGenerationError, attemptNumber: number = 1): number {
    if (!error.retryable) return 0;

    if (error.retryAfter) return error.retryAfter;

    // Exponential backoff with jitter
    const baseDelay = {
      [ContentErrorType.NETWORK_ERROR]: 1000,
      [ContentErrorType.API_ERROR]: 2000,
      [ContentErrorType.VALIDATION_ERROR]: 500,
      [ContentErrorType.QUALITY_ERROR]: 1000,
      [ContentErrorType.TIMEOUT_ERROR]: 3000,
      [ContentErrorType.RATE_LIMIT_ERROR]: 60000,
      [ContentErrorType.AUTHENTICATION_ERROR]: 0,
      [ContentErrorType.QUOTA_EXCEEDED]: 0,
      [ContentErrorType.UNKNOWN_ERROR]: 2000
    }[error.type] || 2000;

    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    
    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }

  /**
   * Format error for logging
   */
  static formatForLogging(error: ContentGenerationError): string {
    return JSON.stringify({
      type: error.type,
      gameType: error.gameType,
      message: error.message,
      technicalDetails: error.technicalDetails,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Create a recovery action plan
   */
  static createRecoveryPlan(error: ContentGenerationError): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  } {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    switch (error.type) {
      case ContentErrorType.NETWORK_ERROR:
        immediate.push('Check internet connection', 'Refresh the page');
        shortTerm.push('Try again in a few minutes');
        longTerm.push('Contact your internet provider if issues persist');
        break;

      case ContentErrorType.RATE_LIMIT_ERROR:
        immediate.push('Wait before trying again');
        shortTerm.push('Play existing games while waiting');
        longTerm.push('Consider upgrading your account');
        break;

      case ContentErrorType.QUOTA_EXCEEDED:
        immediate.push('Use existing game content');
        shortTerm.push('Wait for quota reset');
        longTerm.push('Upgrade to unlimited plan');
        break;

      case ContentErrorType.API_ERROR:
        immediate.push('Try a different game type');
        shortTerm.push('Wait for service restoration');
        longTerm.push('Report persistent issues to support');
        break;

      default:
        immediate.push('Refresh and try again');
        shortTerm.push('Try different settings');
        longTerm.push('Contact support if needed');
    }

    return { immediate, shortTerm, longTerm };
  }
}

export default ErrorService;