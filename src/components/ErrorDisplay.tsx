import React, { useState } from 'react';
import { ContentGenerationError, ErrorService } from '../services/error.service';

interface ErrorDisplayProps {
  error: ContentGenerationError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showTechnicalDetails?: boolean;
  className?: string;
}

/**
 * Error Display Component
 * Shows user-friendly error messages with suggestions and recovery options
 */
export default function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
  className = ''
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRecoveryPlan, setShowRecoveryPlan] = useState(false);

  const userMessage = ErrorService.getUserFriendlyMessage(error);
  const suggestions = ErrorService.getContextualSuggestions(error);
  const recoveryPlan = ErrorService.createRecoveryPlan(error);

  const getErrorIcon = () => {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'RATE_LIMIT_ERROR':
      case 'QUOTA_EXCEEDED':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'AUTHENTICATION_ERROR':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'QUALITY_ERROR':
      case 'VALIDATION_ERROR':
        return 'yellow'; // Warning
      case 'RATE_LIMIT_ERROR':
      case 'QUOTA_EXCEEDED':
        return 'blue'; // Info
      default:
        return 'red'; // Error
    }
  };

  const color = getErrorColor();
  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      text: 'text-red-700',
      button: 'bg-red-100 text-red-800 hover:bg-red-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
      button: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      text: 'text-blue-700',
      button: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-lg border ${classes.bg} ${classes.border} p-4 ${className}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${classes.icon}`}>
          {getErrorIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${classes.title}`}>
            {error.type === 'QUALITY_ERROR' ? 'Using Backup Content' : 'Something went wrong'}
          </h3>
          <div className={`mt-2 text-sm ${classes.text}`}>
            <p>{userMessage}</p>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3">
              <h4 className={`text-sm font-medium ${classes.title} mb-2`}>What you can do:</h4>
              <ul className={`text-sm ${classes.text} space-y-1`}>
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${classes.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            )}

            {suggestions.length > 3 && (
              <button
                onClick={() => setShowRecoveryPlan(!showRecoveryPlan)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${classes.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Help
              </button>
            )}

            {showTechnicalDetails && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${classes.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Technical Details
              </button>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${classes.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                Dismiss
              </button>
            )}
          </div>

          {/* Recovery plan */}
          {showRecoveryPlan && (
            <div className={`mt-4 p-3 rounded-md bg-white border ${classes.border}`}>
              <h4 className={`text-sm font-medium ${classes.title} mb-3`}>Recovery Plan</h4>
              
              <div className="space-y-3">
                <div>
                  <h5 className={`text-xs font-medium ${classes.title} uppercase tracking-wide mb-1`}>
                    Try Now
                  </h5>
                  <ul className={`text-sm ${classes.text} space-y-1`}>
                    {recoveryPlan.immediate.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`text-xs font-medium ${classes.title} uppercase tracking-wide mb-1`}>
                    If Problem Persists
                  </h5>
                  <ul className={`text-sm ${classes.text} space-y-1`}>
                    {recoveryPlan.shortTerm.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`text-xs font-medium ${classes.title} uppercase tracking-wide mb-1`}>
                    Long-term Solution
                  </h5>
                  <ul className={`text-sm ${classes.text} space-y-1`}>
                    {recoveryPlan.longTerm.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Technical details */}
          {showDetails && error.technicalDetails && (
            <div className={`mt-4 p-3 rounded-md bg-gray-50 border border-gray-200`}>
              <h4 className="text-sm font-medium text-gray-800 mb-2">Technical Details</h4>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {error.technicalDetails}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple error message component for inline errors
 */
export function InlineError({ 
  message, 
  className = '' 
}: { 
  message: string; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center text-red-600 text-sm ${className}`}>
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}