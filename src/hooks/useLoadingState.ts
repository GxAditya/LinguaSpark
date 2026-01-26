import { useState, useEffect, useCallback } from 'react';
import { loadingService, LoadingState, LOADING_STAGES } from '../services/loading.service';

/**
 * Hook for managing loading states with progress indicators
 */
export function useLoadingState(id: string) {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);

  useEffect(() => {
    // Subscribe to loading state changes
    const unsubscribe = loadingService.subscribe(id, setLoadingState);

    // Get initial state
    const initialState = loadingService.getState(id);
    if (initialState) {
      setLoadingState(initialState);
    }

    return unsubscribe;
  }, [id]);

  const startLoading = useCallback((
    stages?: typeof LOADING_STAGES[keyof typeof LOADING_STAGES][]
  ) => {
    loadingService.startLoading(id, stages);
  }, [id]);

  const updateStage = useCallback((
    stage: typeof LOADING_STAGES[keyof typeof LOADING_STAGES]
  ) => {
    loadingService.updateStage(id, stage);
  }, [id]);

  const setProgress = useCallback((progress: number, message?: string) => {
    loadingService.setProgress(id, progress, message);
  }, [id]);

  const completeLoading = useCallback((finalMessage?: string) => {
    loadingService.completeLoading(id, finalMessage);
  }, [id]);

  const setError = useCallback((error: string) => {
    loadingService.setError(id, error);
  }, [id]);

  const cancelLoading = useCallback(() => {
    loadingService.cancelLoading(id);
  }, [id]);

  const getTimeRemaining = useCallback(() => {
    return loadingService.formatTimeRemaining(id);
  }, [id]);

  return {
    loadingState,
    isLoading: loadingState?.isLoading || false,
    progress: loadingState?.progress || 0,
    stage: loadingState?.stage || '',
    message: loadingState?.message || '',
    error: loadingState?.error,
    startLoading,
    updateStage,
    setProgress,
    completeLoading,
    setError,
    cancelLoading,
    getTimeRemaining
  };
}

/**
 * Hook specifically for game content generation loading
 */
export function useGameContentLoading(gameType: string) {
  const loadingId = `game-content-${gameType}`;
  const loadingHook = useLoadingState(loadingId);

  const startGameContentGeneration = useCallback(() => {
    const stages = [
      LOADING_STAGES.INITIALIZING,
      LOADING_STAGES.GENERATING_CONTENT,
      LOADING_STAGES.VALIDATING_CONTENT,

      LOADING_STAGES.FINALIZING,
      LOADING_STAGES.COMPLETE
    ];

    loadingHook.startLoading(stages);
  }, [gameType, loadingHook]);

  return {
    ...loadingHook,
    startGameContentGeneration
  };
}

export default useLoadingState;