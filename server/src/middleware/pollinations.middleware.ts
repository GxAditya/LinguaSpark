import { Request, Response, NextFunction } from 'express';
import { pollinationsApi } from '../services/pollinations.api.service.js';
import { ApiError, ApiErrorType } from '../services/pollinations.auth.service.js';

/**
 * Middleware to validate Pollinations API connection
 * This middleware ensures the Pollinations API is accessible before processing requests
 */
export async function validatePollinationsConnection(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    // Check if the API connection is valid
    const isValid = await pollinationsApi.validateConnection();
    
    if (!isValid) {
      res.status(503).json({
        success: false,
        message: 'AI services are temporarily unavailable. Please try again later.',
        error: {
          type: 'SERVICE_UNAVAILABLE',
          code: 'POLLINATIONS_API_UNAVAILABLE'
        }
      });
      return;
    }

    // Connection is valid, proceed to next middleware
    next();
  } catch (error: any) {
    console.error('Pollinations API validation failed:', error);
    
    // Handle different error types
    if (error.type === ApiErrorType.AUTHENTICATION) {
      res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please contact support.',
        error: {
          type: 'CONFIGURATION_ERROR',
          code: 'INVALID_API_KEY'
        }
      });
      return;
    }

    if (error.type === ApiErrorType.RATE_LIMIT) {
      res.status(503).json({
        success: false,
        message: 'AI services are temporarily limited. Please try again later.',
        error: {
          type: 'RATE_LIMITED',
          code: 'INSUFFICIENT_BALANCE'
        }
      });
      return;
    }

    // Generic error response
    res.status(503).json({
      success: false,
      message: 'AI services are temporarily unavailable. Please try again later.',
      error: {
        type: 'SERVICE_ERROR',
        code: 'API_CONNECTION_FAILED'
      }
    });
  }
}

/**
 * Middleware to handle Pollinations API errors consistently
 * This middleware catches and formats API errors for client responses
 */
export function handlePollinationsErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Only handle Pollinations API errors
  if (!error.type || !Object.values(ApiErrorType).includes(error.type)) {
    next(error);
    return;
  }

  const apiError = error as ApiError;

  // Log the error for debugging
  console.error('Pollinations API Error:', {
    type: apiError.type,
    message: apiError.message,
    statusCode: apiError.statusCode,
    endpoint: req.path,
    method: req.method
  });

  // Map API error types to HTTP status codes and user-friendly messages
  switch (apiError.type) {
    case ApiErrorType.AUTHENTICATION:
      res.status(500).json({
        success: false,
        message: 'AI service authentication failed. Please contact support.',
        error: {
          type: 'AUTHENTICATION_ERROR',
          code: 'API_AUTH_FAILED'
        }
      });
      break;

    case ApiErrorType.RATE_LIMIT:
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: {
          type: 'RATE_LIMITED',
          code: 'TOO_MANY_REQUESTS',
          retryAfter: apiError.retryAfter
        }
      });
      break;

    case ApiErrorType.VALIDATION:
      res.status(400).json({
        success: false,
        message: 'Invalid request parameters.',
        error: {
          type: 'VALIDATION_ERROR',
          code: 'INVALID_PARAMETERS',
          details: apiError.message
        }
      });
      break;

    case ApiErrorType.NETWORK:
      res.status(503).json({
        success: false,
        message: 'AI services are temporarily unavailable due to network issues.',
        error: {
          type: 'NETWORK_ERROR',
          code: 'CONNECTION_FAILED'
        }
      });
      break;

    case ApiErrorType.SERVER:
    default:
      res.status(apiError.statusCode || 500).json({
        success: false,
        message: 'AI services encountered an error. Please try again later.',
        error: {
          type: 'SERVER_ERROR',
          code: 'API_SERVER_ERROR'
        }
      });
      break;
  }
}

/**
 * Middleware to add Pollinations API service to request object
 * This makes the API service available in route handlers
 */
export function attachPollinationsService(
  req: Request & { pollinationsApi?: typeof pollinationsApi },
  res: Response,
  next: NextFunction
): void {
  req.pollinationsApi = pollinationsApi;
  next();
}

/**
 * Rate limiting middleware for Pollinations API requests
 * Prevents excessive API usage per user/IP
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

export function pollinationsRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });

  // Initialize or get current rate limit data
  if (!rateLimitStore[clientId]) {
    rateLimitStore[clientId] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }

  const clientData = rateLimitStore[clientId];

  // Reset if window has expired
  if (clientData.resetTime < now) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  // Check if limit exceeded
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    const resetIn = Math.ceil((clientData.resetTime - now) / 1000);
    
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded for AI services. Please try again later.',
      error: {
        type: 'RATE_LIMITED',
        code: 'CLIENT_RATE_LIMIT_EXCEEDED',
        retryAfter: resetIn
      }
    });
    return;
  }

  // Increment counter and proceed
  clientData.count++;
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': (RATE_LIMIT_MAX_REQUESTS - clientData.count).toString(),
    'X-RateLimit-Reset': Math.ceil(clientData.resetTime / 1000).toString()
  });

  next();
}

export default {
  validatePollinationsConnection,
  handlePollinationsErrors,
  attachPollinationsService,
  pollinationsRateLimit
};