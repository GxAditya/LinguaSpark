import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  type?: string;
  code?: string;
  retryAfter?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.type = 'VALIDATION';
  next(error);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorType = err.type || 'SERVER_ERROR';
  let errorCode = err.code;
  let retryAfter = err.retryAfter;

  // Enhanced error classification
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorType = 'VALIDATION';
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err as any).keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errorType = 'VALIDATION';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values((err as any).errors).map(
      (val: any) => val.message
    );
    message = messages.join(', ');
    errorType = 'VALIDATION';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorType = 'AUTHENTICATION';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorType = 'API_KEY_EXPIRED';
  }

  // Rate limiting errors
  if (err.name === 'RateLimitError' || message.includes('rate limit')) {
    statusCode = 429;
    errorType = 'RATE_LIMIT';
    retryAfter = 60; // Default 60 seconds
  }

  // Network and timeout errors
  if (err.name === 'TimeoutError' || message.includes('timeout')) {
    statusCode = 408;
    errorType = 'TIMEOUT';
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    errorType = 'SERVICE_UNAVAILABLE';
  }

  // Pollinations API specific errors
  if (message.includes('pollen') || message.includes('balance')) {
    statusCode = 402;
    errorType = 'INSUFFICIENT_BALANCE';
  }

  if (message.includes('quota')) {
    statusCode = 402;
    errorType = 'QUOTA_EXCEEDED';
  }

  if (message.includes('model') && message.includes('unavailable')) {
    statusCode = 503;
    errorType = 'MODEL_UNAVAILABLE';
  }

  // Content generation errors
  if (message.includes('generation failed') || message.includes('quality')) {
    statusCode = 422;
    errorType = 'GENERATION_FAILED';
  }

  if (message.includes('content policy') || message.includes('inappropriate')) {
    statusCode = 400;
    errorType = 'CONTENT_POLICY';
  }

  // Log error with context
  const errorContext = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: (req as any).user?.id,
    requestId: req.get('X-Request-ID') || generateRequestId(),
    errorType,
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  // Log based on severity
  if (statusCode >= 500) {
    console.error('Server Error:', errorContext);
  } else if (statusCode >= 400) {
    console.warn('Client Error:', errorContext);
  } else {
    console.info('Request Error:', errorContext);
  }

  // Send comprehensive error response
  const errorResponse: any = {
    success: false,
    error: {
      type: errorType,
      message,
      statusCode,
      timestamp: errorContext.timestamp,
      requestId: errorContext.requestId
    }
  };

  // Add retry information for retryable errors
  const retryableErrors = [
    'RATE_LIMIT', 'TIMEOUT', 'SERVICE_UNAVAILABLE', 
    'SERVER_ERROR', 'NETWORK', 'OVERLOADED'
  ];

  if (retryableErrors.includes(errorType)) {
    errorResponse.error.retryable = true;
    if (retryAfter) {
      errorResponse.error.retryAfter = retryAfter;
    }
  } else {
    errorResponse.error.retryable = false;
  }

  // Add error code if available
  if (errorCode) {
    errorResponse.error.code = errorCode;
  }

  // Add development details
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = {
      originalMessage: err.message,
      originalType: err.type,
      originalCode: err.code
    };
  }

  // Add user-friendly suggestions based on error type
  errorResponse.error.suggestions = getUserFriendlySuggestions(errorType, statusCode);

  res.status(statusCode).json(errorResponse);
};

/**
 * Get user-friendly suggestions based on error type
 */
function getUserFriendlySuggestions(errorType: string, statusCode: number): string[] {
  const suggestions: Record<string, string[]> = {
    'AUTHENTICATION': [
      'Check your API credentials',
      'Try signing in again',
      'Contact support if the issue persists'
    ],
    'API_KEY_EXPIRED': [
      'Renew your API key',
      'Check your account status',
      'Contact support for assistance'
    ],
    'RATE_LIMIT': [
      'Wait before making more requests',
      'Consider upgrading your plan',
      'Implement request throttling'
    ],
    'QUOTA_EXCEEDED': [
      'Wait for quota reset',
      'Upgrade your plan',
      'Monitor your usage'
    ],
    'INSUFFICIENT_BALANCE': [
      'Add credits to your account',
      'Check your billing information',
      'Contact support'
    ],
    'TIMEOUT': [
      'Try again with a simpler request',
      'Check your internet connection',
      'Try again later'
    ],
    'SERVICE_UNAVAILABLE': [
      'Try again in a few minutes',
      'Check our status page',
      'Use alternative features'
    ],
    'VALIDATION': [
      'Check your request parameters',
      'Verify required fields',
      'Review the API documentation'
    ],
    'GENERATION_FAILED': [
      'Try with different parameters',
      'Use simpler prompts',
      'Try again later'
    ],
    'CONTENT_POLICY': [
      'Review content guidelines',
      'Use appropriate language',
      'Try different content'
    ]
  };

  return suggestions[errorType] || [
    'Try refreshing the page',
    'Check your internet connection',
    'Contact support if the problem continues'
  ];
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create error for API responses
 */
export function createApiError(
  message: string, 
  statusCode: number = 500, 
  type?: string,
  retryAfter?: number
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.type = type;
  error.retryAfter = retryAfter;
  error.isOperational = true;
  return error;
}

/**
 * Async error handler wrapper
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
