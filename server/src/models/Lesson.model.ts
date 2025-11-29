import mongoose, { Document, Schema, Model } from 'mongoose';

// Vocabulary item within a lesson
export interface IVocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  example: string;
  exampleTranslation: string;
}

// Exercise within a lesson
export interface IExercise {
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  audioText?: string; // Text for TTS
}

// Content section within a lesson
export interface ILessonContent {
  type: 'text' | 'audio' | 'vocabulary' | 'dialogue' | 'grammar';
  title: string;
  content: string;
  audioText?: string; // Text for TTS generation
  vocabulary?: IVocabularyItem[];
  grammarPoints?: string[];
}

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  topic: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  order: number; // lesson order within a level
  
  // Lesson content
  objectives: string[];
  contents: ILessonContent[];
  exercises: IExercise[];
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ILessonModel extends Model<ILesson> {}

const vocabularyItemSchema = new Schema<IVocabularyItem>(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    pronunciation: { type: String },
    example: { type: String, required: true },
    exampleTranslation: { type: String, required: true },
  },
  { _id: false }
);

const exerciseSchema = new Schema<IExercise>(
  {
    type: {
      type: String,
      enum: ['multiple-choice', 'fill-blank', 'translation', 'listening', 'speaking'],
      required: true,
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
    audioText: { type: String },
  },
  { _id: false }
);

const lessonContentSchema = new Schema<ILessonContent>(
  {
    type: {
      type: String,
      enum: ['text', 'audio', 'vocabulary', 'dialogue', 'grammar'],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    audioText: { type: String },
    vocabulary: [vocabularyItemSchema],
    grammarPoints: [{ type: String }],
  },
  { _id: false }
);

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Lesson description is required'],
    },
    topic: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'spanish',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    order: {
      type: Number,
      required: true,
    },
    objectives: [{
      type: String,
    }],
    contents: [lessonContentSchema],
    exercises: [exerciseSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
lessonSchema.index({ language: 1, level: 1, order: 1 });
lessonSchema.index({ slug: 1 });

const Lesson = mongoose.model<ILesson, ILessonModel>('Lesson', lessonSchema);

export default Lesson;
