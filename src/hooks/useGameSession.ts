import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context';
import { gameService, GameType, Difficulty, GameSession } from '../services/game.service';
import { resolveLearningLanguage } from '../utils/languages';

interface UseGameSessionOptions {
  gameType: GameType;
  difficulty?: Difficulty;
  targetLanguage?: string;
  topic?: string;
}

interface UseGameSessionReturn {
  // Session state
  session: GameSession | null;
  loading: boolean;
  error: string | null;

  // Game content
  content: unknown;
  currentRound: number;
  totalRounds: number;
  score: number;
  maxScore: number;

  // Time tracking
  timeSpent: number;

  // Actions
  startNewGame: () => Promise<void>;
  submitAnswer: (answer: unknown) => Promise<void>;
  updateScore: (newScore: number) => void;
  nextRound: () => void;
  completeGame: () => Promise<void>;
  abandonGame: () => Promise<void>;

  // State helpers
  isComplete: boolean;
  hasActiveSession: boolean;

  // Confirmation dialog state
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  confirmExit: () => Promise<void>;
  cancelExit: () => void;
  
  // Language info
  targetLanguage: string;

  // Game state management helpers
  gameState: {
    feedback: 'correct' | 'incorrect' | null;
    setFeedback: (feedback: 'correct' | 'incorrect' | null) => void;
    selectedAnswer: unknown;
    setSelectedAnswer: (answer: unknown) => void;
    resetRoundState: () => void;
  };

  // Enhanced error handling
  retryLastAction: () => Promise<void>;
  clearError: () => void;
}

export function useGameSession(optionsOrGameType: UseGameSessionOptions | GameType): UseGameSessionReturn {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Support both string (gameType) and object (options) parameters
  const options: UseGameSessionOptions = typeof optionsOrGameType === 'string'
    ? { gameType: optionsOrGameType }
    : optionsOrGameType;

  // Get language from Dashboard selection first, then URL query param, then options/default
  const urlLanguage = searchParams.get('language');
  const { gameType, difficulty = 'beginner', targetLanguage: optionsLanguage, topic } = options;
  const targetLanguage = resolveLearningLanguage(user?.currentLanguage ?? urlLanguage ?? optionsLanguage);

  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Game state management
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const lastActionRef = useRef<(() => Promise<void>) | null>(null);

  // Game state helpers
  const resetRoundState = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
  }, []);

  // Enhanced error handling
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryLastAction = useCallback(async () => {
    if (lastActionRef.current) {
      clearError();
      try {
        await lastActionRef.current();
      } catch (err) {
        console.error('Retry failed:', err);
        setError(err instanceof Error ? err.message : 'Action failed. Please try again.');
      }
    }
  }, [clearError]);

  // Start timer when session becomes active
  useEffect(() => {
    if (session && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [session]);

  // Auto-save progress periodically
  useEffect(() => {
    if (session && sessionIdRef.current) {
      const saveInterval = setInterval(async () => {
        try {
          await gameService.updateProgress(sessionIdRef.current!, {
            currentRound,
            score,
            timeSpentSeconds: timeSpent,
          });
        } catch (err: unknown) {
          console.error('Failed to save progress:', err);
        }
      }, 30000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [session, currentRound, score, timeSpent]);

  // Initialize game session
  const startNewGame = useCallback(async () => {
    const action = async () => {
      setLoading(true);
      setError(null);

      try {
        const newSession = await gameService.startGame({
          gameType,
          difficulty,
          targetLanguage,
          topic,
        });

        setSession(newSession);
        sessionIdRef.current = newSession.sessionId;
        setCurrentRound(0);
        setScore(0);
        setTimeSpent(0);
        resetRoundState();
      } catch (err: unknown) {
        console.error('Failed to start game:', err);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any; // Temporary cast for accessing properties
        if (error.status === 429) {
          setError(`Rate limit exceeded. Please try again in ${error.retryAfterSeconds || 60} seconds.`);
        } else {
          setError(error.message || 'Failed to start game. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    lastActionRef.current = action;
    await action();
  }, [gameType, difficulty, targetLanguage, topic, resetRoundState]);

  // Check for existing active session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const existingSession = await gameService.getActiveSession(gameType);
        if (existingSession) {
          const existingTargetLanguage = (existingSession.content as { targetLanguage?: string } | null)?.targetLanguage;
          const resolvedExistingTargetLanguage = resolveLearningLanguage(existingTargetLanguage);

          // If the user changed their learning language on the dashboard, restart with the new language
          if (resolvedExistingTargetLanguage !== targetLanguage) {
            await startNewGame();
            return;
          }

          setSession(existingSession);
          sessionIdRef.current = existingSession.sessionId;
          setCurrentRound(existingSession.currentRound);
          setScore(existingSession.score);
          setTimeSpent(existingSession.timeSpentSeconds);
          setLoading(false);
        } else {
          // No existing session, start a new one
          await startNewGame();
        }
      } catch (err) {
        console.error('Failed to check existing session:', err);
        // Start a new game anyway
        await startNewGame();
      }
    };

    checkExistingSession();
  }, [gameType, startNewGame, targetLanguage]);

  const completeGame = useCallback(async () => {
    if (!sessionIdRef.current) return;

    try {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await gameService.completeGame(sessionIdRef.current, {
        score,
        timeSpentSeconds: timeSpent,
      });
    } catch (err) {
      console.error('Failed to complete game:', err);
    }
  }, [score, timeSpent]);

  const abandonGame = useCallback(async () => {
    if (!sessionIdRef.current) {
      navigate('/games');
      return;
    }

    try {
      await gameService.abandonGame(sessionIdRef.current);
    } catch (err) {
      console.error('Failed to abandon game:', err);
    } finally {
      navigate('/games');
    }
  }, [navigate]);

  const confirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    await abandonGame();
  }, [abandonGame]);

  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  const submitAnswer = useCallback(async () => {
    // This method is a convenience for updating progress after an answer
    // The actual score/round update should be handled by the game component
    if (!sessionIdRef.current) return;

    try {
      await gameService.updateProgress(sessionIdRef.current, {
        currentRound,
        score,
        timeSpentSeconds: timeSpent,
      });
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  }, [currentRound, score, timeSpent]);

  const updateScore = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const nextRound = useCallback(() => {
    setCurrentRound((prev) => prev + 1);
    resetRoundState();
  }, [resetRoundState]);

  // Calculate derived state
  const totalRounds = session?.totalRounds || 0;
  const maxScore = session?.maxScore || 100;
  const isComplete = currentRound >= totalRounds && totalRounds > 0;
  const hasActiveSession = !!session;

  return {
    session,
    loading,
    error,
    content: session?.content || null,
    currentRound,
    totalRounds,
    score,
    maxScore,
    timeSpent,
    startNewGame,
    submitAnswer,
    updateScore,
    nextRound,
    completeGame,
    abandonGame,
    isComplete,
    hasActiveSession,
    showExitConfirm,
    setShowExitConfirm,
    confirmExit,
    cancelExit,
    targetLanguage,
    gameState: {
      feedback,
      setFeedback,
      selectedAnswer,
      setSelectedAnswer,
      resetRoundState,
    },
    retryLastAction,
    clearError,
  };
}
