import { api } from './api';

export type PracticeLanguage = 'spanish' | 'french' | 'hindi';
export type PracticeProvider = 'groq' | 'pollinations';
export type PracticeSessionStatus = 'active' | 'completed' | 'abandoned';

export interface PracticeScenarioSummary {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  language: PracticeLanguage;
}

export interface PracticeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: string;
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  language: PracticeLanguage;
  provider: PracticeProvider;
  status: PracticeSessionStatus;
  metadata?: {
    difficulty?: string;
    topic?: string;
  };
  messages: PracticeMessage[];
  lastInteractionAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PracticeScenariosResponse {
  scenarios: PracticeScenarioSummary[];
}

interface PracticeSessionResponse {
  session: PracticeSession;
}

class PracticeService {
  async getScenarios(): Promise<PracticeScenarioSummary[]> {
    const response = await api.get<PracticeScenariosResponse>('/practice/scenarios');
    if (!response.data?.scenarios) {
      return [];
    }
    return response.data.scenarios;
  }

  async startSession(payload: { scenarioId: string; provider?: PracticeProvider }): Promise<PracticeSession> {
    const response = await api.post<PracticeSessionResponse>('/practice/sessions', payload);
    if (!response.data?.session) {
      throw new Error('Practice session payload missing in response');
    }
    return response.data.session;
  }

  async sendMessage(sessionId: string, message: string): Promise<PracticeSession> {
    const response = await api.post<PracticeSessionResponse>(`/practice/sessions/${sessionId}/messages`, { message });
    if (!response.data?.session) {
      throw new Error('Updated session missing in response');
    }
    return response.data.session;
  }

  async completeSession(sessionId: string): Promise<PracticeSession> {
    const response = await api.post<PracticeSessionResponse>(`/practice/sessions/${sessionId}/complete`);
    if (!response.data?.session) {
      throw new Error('Practice session not returned after completion');
    }
    return response.data.session;
  }
}

export const practiceService = new PracticeService();
export default practiceService;
