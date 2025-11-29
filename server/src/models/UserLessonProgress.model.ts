import mongoose, { Document, Schema, Model } from 'mongoose';

// Progress for individual exercises
export interface IExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  correct: boolean;
  attempts: number;
  lastAttemptAt: Date;
}

// Progress for individual content sections
export interface IContentProgress {
  contentIndex: number;
  completed: boolean;
  timeSpent: number; // in seconds
  completedAt?: Date;
}

export interface IUserLessonProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  
  // Progress tracking
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  
  // Detailed progress
  contentProgress: IContentProgress[];
  exerciseProgress: IExerciseProgress[];
  
  // Stats
  score: number; // percentage score on exercises
  timeSpent: number; // total time in seconds
  xpEarned: number;
  
  // Timestamps
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

interface IUserLessonProgressModel extends Model<IUserLessonProgress> {}

const contentProgressSchema = new Schema<IContentProgress>(
  {
    contentIndex: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { _id: false }
);

const exerciseProgressSchema = new Schema<IExerciseProgress>(
  {
    exerciseIndex: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    correct: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
  },
  { _id: false }
);

const userLessonProgressSchema = new Schema<IUserLessonProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    contentProgress: [contentProgressSchema],
    exerciseProgress: [exerciseProgressSchema],
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique user-lesson combination
userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
userLessonProgressSchema.index({ userId: 1, status: 1 });

const UserLessonProgress = mongoose.model<IUserLessonProgress, IUserLessonProgressModel>(
  'UserLessonProgress',
  userLessonProgressSchema
);

export default UserLessonProgress;
