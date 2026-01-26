/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  progress: number; // 0-100
  stage: string;
  message: string;
  error?: string;
  startTime?: number;
  estimatedDuration?: number;
}

/**
 * Loading stage definitions for game content generation
 */
export const LOADING_STAGES = {
  INITIALIZING: {
    stage: 'initializing',
    message: 'Preparing your learning experience...',
    progress: 10,
    estimatedDuration: 500
  },
  GENERATING_CONTENT: {
    stage: 'generating',
    message: 'Creating personalized game content...',
    progress: 30,
    estimatedDuration: 3000
  },
  VALIDATING_CONTENT: {
    stage: 'validating',
    message: 'Ensuring content quality...',
    progress: 60,
    estimatedDuration: 1000
  },
  PROCESSING_IMAGES: {
    stage: 'images',
    message: 'Generating visual elements...',
    progress: 80,
    estimatedDuration: 2000
  },
  FINALIZING: {
    stage: 'finalizing',
    message: 'Almost ready to start learning!',
    progress: 95,
    estimatedDuration: 500
  },
  COMPLETE: {
    stage: 'complete',
    message: 'Ready to play!',
    progress: 100,
    estimatedDuration: 0
  }
} as const;

/**
 * Loading Service for managing loading states with progress indicators
 */
export class LoadingService {
  private listeners: Map<string, (state: LoadingState) => void> = new Map();
  private currentStates: Map<string, LoadingState> = new Map();
  private progressTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start loading process with progress simulation
   */
  startLoading(
    id: string, 
    stages: typeof LOADING_STAGES[keyof typeof LOADING_STAGES][] = [
      LOADING_STAGES.INITIALIZING,
      LOADING_STAGES.GENERATING_CONTENT,
      LOADING_STAGES.VALIDATING_CONTENT,
      LOADING_STAGES.FINALIZING,
      LOADING_STAGES.COMPLETE
    ]
  ): void {
    const initialState: LoadingState = {
      isLoading: true,
      progress: 0,
      stage: 'starting',
      message: 'Starting...',
      startTime: Date.now()
    };

    this.currentStates.set(id, initialState);
    this.notifyListeners(id, initialState);

    // Start progress simulation
    this.simulateProgress(id, stages);
  }

  /**
   * Update loading stage manually
   */
  updateStage(id: string, stage: typeof LOADING_STAGES[keyof typeof LOADING_STAGES]): void {
    const currentState = this.currentStates.get(id);
    if (!currentState || !currentState.isLoading) return;

    const updatedState: LoadingState = {
      ...currentState,
      stage: stage.stage,
      message: stage.message,
      progress: stage.progress
    };

    this.currentStates.set(id, updatedState);
    this.notifyListeners(id, updatedState);
  }

  /**
   * Set loading progress manually
   */
  setProgress(id: string, progress: number, message?: string): void {
    const currentState = this.currentStates.get(id);
    if (!currentState || !currentState.isLoading) return;

    const updatedState: LoadingState = {
      ...currentState,
      progress: Math.min(100, Math.max(0, progress)),
      message: message || currentState.message
    };

    this.currentStates.set(id, updatedState);
    this.notifyListeners(id, updatedState);
  }

  /**
   * Complete loading process
   */
  completeLoading(id: string, finalMessage?: string): void {
    const currentState = this.currentStates.get(id);
    if (!currentState) return;

    // Clear any existing timer
    const timer = this.progressTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.progressTimers.delete(id);
    }

    const completedState: LoadingState = {
      ...currentState,
      isLoading: false,
      progress: 100,
      stage: 'complete',
      message: finalMessage || 'Complete!',
      error: undefined
    };

    this.currentStates.set(id, completedState);
    this.notifyListeners(id, completedState);

    // Clean up after a delay
    setTimeout(() => {
      this.currentStates.delete(id);
    }, 2000);
  }

  /**
   * Set loading error
   */
  setError(id: string, error: string): void {
    const currentState = this.currentStates.get(id);
    if (!currentState) return;

    // Clear any existing timer
    const timer = this.progressTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.progressTimers.delete(id);
    }

    const errorState: LoadingState = {
      ...currentState,
      isLoading: false,
      error,
      message: 'Something went wrong'
    };

    this.currentStates.set(id, errorState);
    this.notifyListeners(id, errorState);
  }

  /**
   * Subscribe to loading state changes
   */
  subscribe(id: string, callback: (state: LoadingState) => void): () => void {
    this.listeners.set(id, callback);

    // Send current state if it exists
    const currentState = this.currentStates.get(id);
    if (currentState) {
      callback(currentState);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  /**
   * Get current loading state
   */
  getState(id: string): LoadingState | null {
    return this.currentStates.get(id) || null;
  }

  /**
   * Check if currently loading
   */
  isLoading(id: string): boolean {
    const state = this.currentStates.get(id);
    return state?.isLoading || false;
  }

  /**
   * Cancel loading process
   */
  cancelLoading(id: string): void {
    const timer = this.progressTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.progressTimers.delete(id);
    }

    const currentState = this.currentStates.get(id);
    if (currentState) {
      const cancelledState: LoadingState = {
        ...currentState,
        isLoading: false,
        message: 'Cancelled',
        error: 'Loading was cancelled'
      };

      this.currentStates.set(id, cancelledState);
      this.notifyListeners(id, cancelledState);
    }

    // Clean up
    setTimeout(() => {
      this.currentStates.delete(id);
    }, 1000);
  }

  /**
   * Simulate progress through stages
   */
  private simulateProgress(
    id: string, 
    stages: typeof LOADING_STAGES[keyof typeof LOADING_STAGES][]
  ): void {
    let currentStageIndex = 0;

    const processNextStage = () => {
      if (currentStageIndex >= stages.length) {
        this.completeLoading(id);
        return;
      }

      const stage = stages[currentStageIndex];
      this.updateStage(id, stage);

      // Schedule next stage
      const timer = setTimeout(() => {
        currentStageIndex++;
        processNextStage();
      }, stage.estimatedDuration);

      this.progressTimers.set(id, timer);
    };

    processNextStage();
  }

  /**
   * Notify all listeners for a specific ID
   */
  private notifyListeners(id: string, state: LoadingState): void {
    const listener = this.listeners.get(id);
    if (listener) {
      listener(state);
    }
  }

  /**
   * Get estimated time remaining
   */
  getEstimatedTimeRemaining(id: string): number {
    const state = this.currentStates.get(id);
    if (!state || !state.isLoading || !state.startTime) return 0;

    const elapsed = Date.now() - state.startTime;
    const progressRatio = state.progress / 100;
    
    if (progressRatio <= 0) return 0;
    
    const estimatedTotal = elapsed / progressRatio;
    const remaining = estimatedTotal - elapsed;
    
    return Math.max(0, remaining);
  }

  /**
   * Format time remaining as human-readable string
   */
  formatTimeRemaining(id: string): string {
    const remaining = this.getEstimatedTimeRemaining(id);
    
    if (remaining < 1000) return 'Almost done...';
    if (remaining < 10000) return 'A few seconds...';
    if (remaining < 30000) return 'About 30 seconds...';
    if (remaining < 60000) return 'About a minute...';
    
    const minutes = Math.ceil(remaining / 60000);
    return `About ${minutes} minute${minutes > 1 ? 's' : ''}...`;
  }
}

// Export singleton instance
export const loadingService = new LoadingService();

export default LoadingService;