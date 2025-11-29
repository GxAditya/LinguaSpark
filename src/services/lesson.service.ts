import api from './api';

// Types
export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  example: string;
  exampleTranslation: string;
}

export interface Exercise {
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  audioText?: string;
}

export interface LessonContent {
  type: 'text' | 'audio' | 'vocabulary' | 'dialogue' | 'grammar';
  title: string;
  content: string;
  audioText?: string;
  vocabulary?: VocabularyItem[];
  grammarPoints?: string[];
}

export interface LessonSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  topic: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  order: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  score: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  topic: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  objectives: string[];
  contents: LessonContent[];
  exercises: Exercise[];
}

export interface ContentProgress {
  contentIndex: number;
  completed: boolean;
  timeSpent: number;
  completedAt?: string;
}

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  correct: boolean;
  attempts: number;
  lastAttemptAt?: string;
}

export interface LessonProgress {
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  score: number;
  timeSpent: number;
  contentProgress: ContentProgress[];
  exerciseProgress: ExerciseProgress[];
  startedAt?: string;
  completedAt?: string;
}

export interface ExerciseResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  progress: number;
  score: number;
  exerciseProgress: ExerciseProgress[];
}

export const lessonService = {
  // Get all lessons
  async getLessons(language: string = 'spanish', level?: string): Promise<LessonSummary[]> {
    const params = new URLSearchParams({ language });
    if (level) params.append('level', level);
    
    const response = await api.get<{ lessons: LessonSummary[] }>(`/lessons?${params}`);
    if (response.data) {
      return response.data.lessons;
    }
    throw new Error(response.message || 'Failed to fetch lessons');
  },

  // Get single lesson by slug
  async getLesson(slug: string): Promise<{ lesson: LessonDetail; progress: LessonProgress }> {
    const response = await api.get<{ lesson: LessonDetail; progress: LessonProgress }>(`/lessons/${slug}`);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch lesson');
  },

  // Start a lesson
  async startLesson(slug: string): Promise<{ status: string; progress: number; startedAt: string }> {
    const response = await api.post<{ progress: { status: string; progress: number; startedAt: string } }>(`/lessons/${slug}/start`);
    if (response.data) {
      return response.data.progress;
    }
    throw new Error(response.message || 'Failed to start lesson');
  },

  // Update content progress
  async updateContentProgress(
    slug: string,
    contentIndex: number,
    data: { completed?: boolean; timeSpent?: number }
  ): Promise<{ progress: number; contentProgress: ContentProgress[] }> {
    const response = await api.post<{ progress: number; contentProgress: ContentProgress[] }>(
      `/lessons/${slug}/content/${contentIndex}`,
      data
    );
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update progress');
  },

  // Submit exercise answer
  async submitExercise(slug: string, exerciseIndex: number, answer: string): Promise<ExerciseResult> {
    const response = await api.post<ExerciseResult>(
      `/lessons/${slug}/exercise/${exerciseIndex}`,
      { answer }
    );
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to submit answer');
  },

  // Complete lesson
  async completeLesson(slug: string): Promise<{
    status: string;
    progress: number;
    score: number;
    xpEarned: number;
    completedAt: string;
  }> {
    const response = await api.post<{
      status: string;
      progress: number;
      score: number;
      xpEarned: number;
      completedAt: string;
    }>(`/lessons/${slug}/complete`);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to complete lesson');
  },
};

export default lessonService;
