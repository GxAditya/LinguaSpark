import mongoose, { Document, Schema } from 'mongoose';

export type GameType =
  | 'transcription-station'
  | 'audio-jumble'

  | 'translation-matchup'
  | 'secret-word-solver'
  | 'word-drop-dash'
  | 'conjugation-coach'
  | 'context-connect'
  | 'syntax-scrambler';

export type GameStatus = 'active' | 'completed' | 'abandoned';

// Base interface for all game content types
export interface IBaseGameContent {
  type: GameType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  targetLanguage: string;
}

// Transcription Station
export interface ITranscriptionContent extends IBaseGameContent {
  type: 'transcription-station';
  rounds: Array<{
    audioText: string;
    correctAnswer: string;
    hint?: string;
  }>;
}

// Audio Jumble
export interface IAudioJumbleContent extends IBaseGameContent {
  type: 'audio-jumble';
  rounds: Array<{
    sentence: string;
    words: string[];
    correctOrder: number[];
  }>;
}



// Translation Match-Up
export interface ITranslationMatchUpContent extends IBaseGameContent {
  type: 'translation-matchup';
  pairs: Array<{
    original: string;
    translation: string;
  }>;
}

// Secret Word Solver
export interface ISecretWordContent extends IBaseGameContent {
  type: 'secret-word-solver';
  words: Array<{
    word: string;
    hint: string;
    category: string;
  }>;
}

// Word Drop Dash
export interface IWordDropContent extends IBaseGameContent {
  type: 'word-drop-dash';
  rounds: Array<{
    words: Array<{
      word: string;
      translation: string;
      emoji: string;
    }>;
    timeLimit: number;
  }>;
}

// Conjugation Coach
export interface IConjugationContent extends IBaseGameContent {
  type: 'conjugation-coach';
  questions: Array<{
    sentence: string;
    blankedSentence?: string;
    answer?: string;
    verb: string;
    tense: string;
    subject: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

// Context Connect
export interface IContextConnectContent extends IBaseGameContent {
  type: 'context-connect';
  passages: Array<{
    text: string;
    blanks: Array<{
      position: number;
      correctWord: string;
      options: string[];
    }>;
  }>;
}

// Syntax Scrambler
export interface ISyntaxScramblerContent extends IBaseGameContent {
  type: 'syntax-scrambler';
  sentences: Array<{
    scrambled: string[];
    correct: string;
    translation: string;
  }>;
}

export type GameContent =
  | ITranscriptionContent
  | IAudioJumbleContent

  | ITranslationMatchUpContent
  | ISecretWordContent
  | IWordDropContent
  | IConjugationContent
  | IContextConnectContent
  | ISyntaxScramblerContent;

export interface IGameSession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  gameType: GameType;
  status: GameStatus;
  content: GameContent;
  currentRound: number;
  totalRounds: number;
  score: number;
  maxScore: number;
  startedAt: Date;
  completedAt?: Date;
  abandonedAt?: Date;
  timeSpentSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gameType: {
      type: String,
      required: true,
      enum: [
        'transcription-station',
        'audio-jumble',

        'translation-matchup',
        'secret-word-solver',
        'word-drop-dash',
        'conjugation-coach',
        'context-connect',
        'syntax-scrambler',
      ],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    currentRound: {
      type: Number,
      default: 0,
    },
    totalRounds: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    abandonedAt: {
      type: Date,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
gameSessionSchema.index({ userId: 1, gameType: 1, status: 1 });
gameSessionSchema.index({ userId: 1, createdAt: -1 });

export const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema);
