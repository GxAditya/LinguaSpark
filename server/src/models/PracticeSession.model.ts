import mongoose, { Document, Schema } from 'mongoose';

export type PracticeMessageRole = 'user' | 'assistant';

export interface IPracticeMessage {
  _id?: mongoose.Types.ObjectId;
  role: PracticeMessageRole;
  content: string;
  feedback?: string;
  createdAt: Date;
}

export interface IPracticeSession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  scenarioId: string;
  scenarioTitle: string;
  language: string;
  provider: 'groq' | 'pollinations';
  status: 'active' | 'completed' | 'abandoned';
  systemPrompt: string;
  sessionSeed: string;
  conversationId?: string;
  messages: IPracticeMessage[];
  metadata?: {
    difficulty?: string;
    topic?: string;
  };
  lastInteractionAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const practiceMessageSchema = new Schema<IPracticeMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const practiceSessionSchema = new Schema<IPracticeSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scenarioId: {
      type: String,
      required: true,
      index: true,
    },
    scenarioTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'spanish',
    },
    provider: {
      type: String,
      enum: ['groq', 'pollinations'],
      default: 'groq',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    sessionSeed: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
      default: '',
    },
    messages: {
      type: [practiceMessageSchema],
      default: [],
    },
    metadata: {
      difficulty: String,
      topic: String,
    },
    lastInteractionAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

practiceSessionSchema.index({ userId: 1, scenarioId: 1, status: 1 });
practiceSessionSchema.index({ userId: 1, updatedAt: -1 });

const PracticeSession = mongoose.model<IPracticeSession>('PracticeSession', practiceSessionSchema);

export default PracticeSession;
