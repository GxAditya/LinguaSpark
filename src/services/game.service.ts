import api from './api';

export type GameType =
  | 'transcription-station'
  | 'audio-jumble'
  | 'image-instinct'
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
   * Start a new game session with AI-generated content
   */
  async startGame(options: StartGameOptions): Promise<GameSession> {
    const response = await api.post<GameSession>('/games/start', options);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to start game');
    }
    return response.data;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      if (err.status === 404) {
        return null;
      }
      throw err;
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
    await api.patch(`/games/session/${sessionId}/progress`, progress);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>(`/games/session/${sessionId}/complete`, result);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to complete game');
    }
    return response.data;
  }

  /**
   * Abandon a game session
   */
  async abandonGame(sessionId: string): Promise<void> {
    await api.post(`/games/session/${sessionId}/abandon`);
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
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());
    if (options?.gameType) params.set('gameType', options.gameType);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<any>(`/games/history?${params.toString()}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get game history');
    }
    return response.data;
  }

  /**
   * Get game statistics
   */
  async getStats(): Promise<GameStats> {
    const response = await api.get<GameStats>('/games/stats');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get game stats');
    }
    return response.data;
  }

  /**
   * Get rate limit status
   */
  async getRateLimitStatus(): Promise<RateLimitStatus> {
    const response = await api.get<RateLimitStatus>('/games/rate-limit');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get rate limit status');
    }
    return response.data;
  }
}

export const gameService = new GameService();
export default gameService;
