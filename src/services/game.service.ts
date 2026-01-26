import api from './api';
import { loadingService, LOADING_STAGES } from './loading.service';
import { ErrorService } from './error.service';

export type GameType =
  | 'transcription-station'
  | 'audio-jumble'

  | 'translation-matchup'
  | 'secret-word-solver'
  | 'word-drop-dash'
  | 'conjugation-coach'
  | 'context-connect'
  | 'syntax-scrambler'
  | 'time-warp-tagger';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GameSession {
  sessionId: string;
  gameType: GameType;
  content: unknown;
  currentRound: number;
  totalRounds: number;
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  startedAt: string;
  usedFallback?: boolean;
  qualityScore?: number;
  qualityIssues?: string[];
  fromCache?: boolean;
  generationTime?: number;
}

export interface GameHistoryItem {
  _id: string;
  gameType: GameType;
  status: 'completed' | 'abandoned';
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  completedAt?: string;
  abandonedAt?: string;
  createdAt: string;
}

export interface GameStats {
  byGameType: Array<{
    _id: GameType;
    totalGames: number;
    totalScore: number;
    totalMaxScore: number;
    totalTime: number;
    avgScore: number;
    bestScore: number;
  }>;
  overall: {
    totalGames: number;
    totalScore: number;
    totalMaxScore: number;
    totalTime: number;
  };
  rateLimit: RateLimitStatus;
}

export interface RateLimitStatus {
  used: number;
  limit: number;
  remaining: number;
  resetTime: string;
}

export interface StartGameOptions {
  gameType: GameType;
  difficulty?: Difficulty;
  language?: string;
  targetLanguage?: string;
  topic?: string;
}

class GameService {
  /**
   * Start a new game session with enhanced loading and error handling
   */
  async startGame(options: StartGameOptions): Promise<GameSession> {
    const loadingId = `game-start-${options.gameType}`;

    try {
      // Start loading process
      loadingService.startLoading(loadingId, [
        LOADING_STAGES.INITIALIZING,
        LOADING_STAGES.GENERATING_CONTENT,
        LOADING_STAGES.VALIDATING_CONTENT,

        LOADING_STAGES.FINALIZING
      ]);

      const response = await api.post<GameSession>('/games/start', options);

      if (!response.success || !response.data) {
        const error = ErrorService.parseError(
          new Error(response.message || 'Failed to start game'),
          { gameType: options.gameType }
        );

        loadingService.setError(loadingId, ErrorService.getUserFriendlyMessage(error));
        throw error;
      }

      loadingService.completeLoading(loadingId, 'Game ready!');
      return response.data;

    } catch (error: any) {
      const parsedError = ErrorService.parseError(error, { gameType: options.gameType });
      const userMessage = ErrorService.getUserFriendlyMessage(parsedError);

      loadingService.setError(loadingId, userMessage);

      // Log error for debugging
      console.error('Game start error:', ErrorService.formatForLogging(parsedError));

      throw parsedError;
    }
  }

  /**
   * Get an active session for a specific game type
   */
  async getActiveSession(gameType: GameType): Promise<GameSession | null> {
    try {
      const response = await api.get<GameSession>(`/games/session/${gameType}`);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error: unknown) {
      const err = error as any;
      if (err.status === 404) {
        return null;
      }

      const parsedError = ErrorService.parseError(err, { gameType });
      console.error('Get active session error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Update game progress
   */
  async updateProgress(
    sessionId: string,
    progress: {
      currentRound: number;
      score: number;
      timeSpentSeconds: number;
    }
  ): Promise<void> {
    try {
      await api.patch(`/games/session/${sessionId}/progress`, progress);
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Update progress error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Complete a game session
   */
  async completeGame(
    sessionId: string,
    result: {
      score: number;
      timeSpentSeconds: number;
    }
  ): Promise<{
    score: number;
    maxScore: number;
    accuracy: number;
    timeSpentSeconds: number;
  }> {
    try {
      const response = await api.post<any>(`/games/session/${sessionId}/complete`, result);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to complete game');
      }
      return response.data;
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Complete game error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Abandon a game session
   */
  async abandonGame(sessionId: string): Promise<void> {
    try {
      await api.post(`/games/session/${sessionId}/abandon`);
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Abandon game error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Get game history
   */
  async getHistory(options?: {
    limit?: number;
    offset?: number;
    gameType?: GameType;
  }): Promise<{
    sessions: GameHistoryItem[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', options.limit.toString());
      if (options?.offset) params.set('offset', options.offset.toString());
      if (options?.gameType) params.set('gameType', options.gameType);

      const response = await api.get<any>(`/games/history?${params.toString()}`);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get game history');
      }
      return response.data;
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Get game history error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Get game statistics
   */
  async getStats(): Promise<GameStats> {
    try {
      const response = await api.get<GameStats>('/games/stats');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get game stats');
      }
      return response.data;
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Get game stats error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Get rate limit status
   */
  async getRateLimitStatus(): Promise<RateLimitStatus> {
    try {
      const response = await api.get<RateLimitStatus>('/games/rate-limit');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get rate limit status');
      }
      return response.data;
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Get rate limit status error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    try {
      const response = await api.get<any>('/games/cache/stats');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get cache stats');
      }
      return response.data;
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Get cache stats error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }

  /**
   * Clear cache
   */
  async clearCache(pattern?: {
    gameType?: GameType;
    difficulty?: string;
    language?: string;
    targetLanguage?: string;
  }): Promise<{ invalidatedCount: number }> {
    try {
      const params = new URLSearchParams();
      if (pattern?.gameType) params.set('gameType', pattern.gameType);
      if (pattern?.difficulty) params.set('difficulty', pattern.difficulty);
      if (pattern?.language) params.set('language', pattern.language);
      if (pattern?.targetLanguage) params.set('targetLanguage', pattern.targetLanguage);

      const url = `/games/cache${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.delete<any>(url);

      if (!response.success) {
        throw new Error(response.message || 'Failed to clear cache');
      }

      return response.data || { invalidatedCount: 0 };
    } catch (error: any) {
      const parsedError = ErrorService.parseError(error);
      console.error('Clear cache error:', ErrorService.formatForLogging(parsedError));
      throw parsedError;
    }
  }
}

export const gameService = new GameService();
export default gameService;
