import React from 'react';
import { LoadingState } from '../services/loading.service';

interface LoadingProgressProps {
  loadingState: LoadingState;
  showTimeRemaining?: boolean;
  showStage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Loading Progress Component
 * Displays a progress bar with stage information and estimated time
 */
export default function LoadingProgress({
  loadingState,
  showTimeRemaining = true,
  showStage = true,
  className = '',
  size = 'md'
}: LoadingProgressProps) {
  const { progress, message, stage, error, isLoading } = loadingState;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const containerClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (error) {
    return (
      <div className={`${className} ${containerClasses[size]}`}>
        <div className="flex items-center space-x-2 text-warning mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Error</span>
        </div>
        <p className="text-warning">{error}</p>
      </div>
    );
  }

  if (!isLoading) {
    return (
      <div className={`${className} ${containerClasses[size]}`}>
        <div className="flex items-center space-x-2 text-success mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Complete</span>
        </div>
        <p className="text-success">{message}</p>
      </div>
    );
  }

  return (
    <div className={`${className} ${containerClasses[size]}`}>
      {/* Loading message */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          <span className="font-medium text-primary">{message}</span>
        </div>
        {showTimeRemaining && (
          <span className="text-sm text-muted">
            {progress < 100 ? `${Math.round(progress)}%` : 'Finishing up...'}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface-3 rounded-full overflow-hidden">
        <div 
          className={`bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Stage information */}
      {showStage && stage && (
        <div className="mt-2 text-sm text-muted">
          <span className="capitalize">{stage.replace('-', ' ')}</span>
          {progress > 0 && progress < 100 && (
            <span className="ml-2">• {Math.round(progress)}% complete</span>
          )}
        </div>
      )}

      {/* Progress steps indicator */}
      <div className="mt-3 flex justify-between text-xs text-soft">
        <div className={`flex items-center ${progress >= 10 ? 'text-accent' : ''}`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${progress >= 10 ? 'bg-accent' : 'bg-surface-3'}`}></div>
          <span>Initialize</span>
        </div>
        <div className={`flex items-center ${progress >= 30 ? 'text-accent' : ''}`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${progress >= 30 ? 'bg-accent' : 'bg-surface-3'}`}></div>
          <span>Generate</span>
        </div>
        <div className={`flex items-center ${progress >= 60 ? 'text-accent' : ''}`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${progress >= 60 ? 'bg-accent' : 'bg-surface-3'}`}></div>
          <span>Validate</span>
        </div>
        <div className={`flex items-center ${progress >= 95 ? 'text-accent' : ''}`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${progress >= 95 ? 'bg-accent' : 'bg-surface-3'}`}></div>
          <span>Finalize</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple loading spinner component
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-accent ${sizeClasses[size]} ${className}`}></div>
  );
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({ 
  loadingState, 
  children 
}: { 
  loadingState: LoadingState; 
  children: React.ReactNode; 
}) {
  if (!loadingState.isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-surface bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-surface rounded-lg shadow-soft p-6 max-w-md w-full mx-4 border border-default">
          <LoadingProgress loadingState={loadingState} />
        </div>
      </div>
    </div>
  );
}