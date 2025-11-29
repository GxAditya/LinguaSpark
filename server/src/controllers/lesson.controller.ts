import { Request, Response } from 'express';
import { Lesson, UserLessonProgress } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// @desc    Get all lessons for a language
// @route   GET /api/lessons
// @access  Private
export const getLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { language = 'spanish', level } = req.query;

    // Build query
    const query: Record<string, unknown> = { 
      language, 
      isActive: true 
    };
    
    if (level && ['beginner', 'intermediate', 'advanced'].includes(level as string)) {
      query.level = level;
    }

    const lessons = await Lesson.find(query)
      .select('title slug description topic language level duration order')
      .sort({ level: 1, order: 1 });

    // Get user progress for these lessons
    const lessonIds = lessons.map(l => l._id);
    const userProgress = await UserLessonProgress.find({
      userId,
      lessonId: { $in: lessonIds },
    }).select('lessonId status progress score');

    // Create a map of lesson progress
    const progressMap = new Map(
      userProgress.map(p => [p.lessonId.toString(), p])
    );

    // Combine lessons with progress
    const levelPriority: Record<string, number> = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
    };

    const lessonsWithProgress = lessons.map(lesson => {
      const progress = progressMap.get(lesson._id.toString());
      return {
        id: lesson._id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        topic: lesson.topic,
        language: lesson.language,
        level: lesson.level,
        duration: lesson.duration,
        order: lesson.order,
        status: progress?.status || 'not-started',
        progress: progress?.progress || 0,
        score: progress?.score || 0,
      };
    }).sort((a, b) => {
      const levelDiff = (levelPriority[a.level] ?? 0) - (levelPriority[b.level] ?? 0);
      if (levelDiff !== 0) return levelDiff;
      return a.order - b.order;
    });

    sendSuccess(res, 200, undefined, { lessons: lessonsWithProgress });
  } catch (error) {
    console.error('Get lessons error:', error);
    sendError(res, 500, 'Failed to fetch lessons');
  }
};

// @desc    Get single lesson by slug
// @route   GET /api/lessons/:slug
// @access  Private
export const getLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { slug } = req.params;

    const lesson = await Lesson.findOne({ slug, isActive: true });

    if (!lesson) {
      sendError(res, 404, 'Lesson not found');
      return;
    }

    // Get or create user progress
    let userProgress = await UserLessonProgress.findOne({
      userId,
      lessonId: lesson._id,
    });

    if (!userProgress) {
      userProgress = await UserLessonProgress.create({
        userId,
        lessonId: lesson._id,
        status: 'not-started',
        progress: 0,
        contentProgress: lesson.contents.map((_, index) => ({
          contentIndex: index,
          completed: false,
          timeSpent: 0,
        })),
        exerciseProgress: lesson.exercises.map((_, index) => ({
          exerciseIndex: index,
          completed: false,
          correct: false,
          attempts: 0,
        })),
      });
    }

    sendSuccess(res, 200, undefined, {
      lesson: {
        id: lesson._id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        topic: lesson.topic,
        language: lesson.language,
        level: lesson.level,
        duration: lesson.duration,
        objectives: lesson.objectives,
        contents: lesson.contents,
        exercises: lesson.exercises,
      },
      progress: {
        status: userProgress.status,
        progress: userProgress.progress,
        score: userProgress.score,
        timeSpent: userProgress.timeSpent,
        contentProgress: userProgress.contentProgress,
        exerciseProgress: userProgress.exerciseProgress,
        startedAt: userProgress.startedAt,
        completedAt: userProgress.completedAt,
      },
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    sendError(res, 500, 'Failed to fetch lesson');
  }
};

// @desc    Start a lesson
// @route   POST /api/lessons/:slug/start
// @access  Private
export const startLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { slug } = req.params;

    const lesson = await Lesson.findOne({ slug, isActive: true });

    if (!lesson) {
      sendError(res, 404, 'Lesson not found');
      return;
    }

    // Find or create progress
    let userProgress = await UserLessonProgress.findOne({
      userId,
      lessonId: lesson._id,
    });

    if (!userProgress) {
      userProgress = await UserLessonProgress.create({
        userId,
        lessonId: lesson._id,
        status: 'in-progress',
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        contentProgress: lesson.contents.map((_, index) => ({
          contentIndex: index,
          completed: false,
          timeSpent: 0,
        })),
        exerciseProgress: lesson.exercises.map((_, index) => ({
          exerciseIndex: index,
          completed: false,
          correct: false,
          attempts: 0,
        })),
      });
    } else if (userProgress.status === 'not-started') {
      userProgress.status = 'in-progress';
      userProgress.startedAt = new Date();
      userProgress.lastAccessedAt = new Date();
      await userProgress.save();
    } else {
      userProgress.lastAccessedAt = new Date();
      await userProgress.save();
    }

    sendSuccess(res, 200, 'Lesson started', {
      progress: {
        status: userProgress.status,
        progress: userProgress.progress,
        startedAt: userProgress.startedAt,
      },
    });
  } catch (error) {
    console.error('Start lesson error:', error);
    sendError(res, 500, 'Failed to start lesson');
  }
};

// @desc    Update content progress
// @route   POST /api/lessons/:slug/content/:contentIndex
// @access  Private
export const updateContentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { slug, contentIndex } = req.params;
    const { completed, timeSpent } = req.body;

    const lesson = await Lesson.findOne({ slug, isActive: true });

    if (!lesson) {
      sendError(res, 404, 'Lesson not found');
      return;
    }

    const index = parseInt(contentIndex);
    if (index < 0 || index >= lesson.contents.length) {
      sendError(res, 400, 'Invalid content index');
      return;
    }

    const userProgress = await UserLessonProgress.findOne({
      userId,
      lessonId: lesson._id,
    });

    if (!userProgress) {
      sendError(res, 404, 'Progress not found. Start the lesson first.');
      return;
    }

    // Update content progress
    const contentProgress = userProgress.contentProgress.find(
      cp => cp.contentIndex === index
    );

    if (contentProgress) {
      if (completed !== undefined) {
        contentProgress.completed = completed;
        if (completed) {
          contentProgress.completedAt = new Date();
        }
      }
      if (timeSpent !== undefined) {
        contentProgress.timeSpent += timeSpent;
        userProgress.timeSpent += timeSpent;
      }
    }

    // Recalculate overall progress
    const totalItems = lesson.contents.length + lesson.exercises.length;
    const completedContent = userProgress.contentProgress.filter(cp => cp.completed).length;
    const completedExercises = userProgress.exerciseProgress.filter(ep => ep.completed).length;
    userProgress.progress = Math.round(((completedContent + completedExercises) / totalItems) * 100);

    userProgress.lastAccessedAt = new Date();
    await userProgress.save();

    sendSuccess(res, 200, 'Progress updated', {
      progress: userProgress.progress,
      contentProgress: userProgress.contentProgress,
    });
  } catch (error) {
    console.error('Update content progress error:', error);
    sendError(res, 500, 'Failed to update progress');
  }
};

// @desc    Submit exercise answer
// @route   POST /api/lessons/:slug/exercise/:exerciseIndex
// @access  Private
export const submitExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { slug, exerciseIndex } = req.params;
    const { answer } = req.body;

    const lesson = await Lesson.findOne({ slug, isActive: true });

    if (!lesson) {
      sendError(res, 404, 'Lesson not found');
      return;
    }

    const index = parseInt(exerciseIndex);
    if (index < 0 || index >= lesson.exercises.length) {
      sendError(res, 400, 'Invalid exercise index');
      return;
    }

    const exercise = lesson.exercises[index];
    const isCorrect = answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();

    const userProgress = await UserLessonProgress.findOne({
      userId,
      lessonId: lesson._id,
    });

    if (!userProgress) {
      sendError(res, 404, 'Progress not found. Start the lesson first.');
      return;
    }

    // Update exercise progress
    const exerciseProgress = userProgress.exerciseProgress.find(
      ep => ep.exerciseIndex === index
    );

    if (exerciseProgress) {
      exerciseProgress.attempts += 1;
      exerciseProgress.lastAttemptAt = new Date();
      
      if (isCorrect && !exerciseProgress.completed) {
        exerciseProgress.completed = true;
        exerciseProgress.correct = true;
      }
    }

    // Recalculate score
    const completedExercises = userProgress.exerciseProgress.filter(ep => ep.completed);
    const correctExercises = userProgress.exerciseProgress.filter(ep => ep.correct);
    
    if (completedExercises.length > 0) {
      userProgress.score = Math.round((correctExercises.length / lesson.exercises.length) * 100);
    }

    // Recalculate overall progress
    const totalItems = lesson.contents.length + lesson.exercises.length;
    const completedContent = userProgress.contentProgress.filter(cp => cp.completed).length;
    userProgress.progress = Math.round(((completedContent + completedExercises.length) / totalItems) * 100);

    // Check if lesson is complete
    if (userProgress.progress === 100 && userProgress.status !== 'completed') {
      userProgress.status = 'completed';
      userProgress.completedAt = new Date();
      
      // Calculate XP earned (base 100 + bonus for score)
      userProgress.xpEarned = 100 + Math.round(userProgress.score / 2);
    }

    userProgress.lastAccessedAt = new Date();
    await userProgress.save();

    sendSuccess(res, 200, isCorrect ? 'Correct!' : 'Incorrect', {
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      progress: userProgress.progress,
      score: userProgress.score,
      exerciseProgress: userProgress.exerciseProgress,
    });
  } catch (error) {
    console.error('Submit exercise error:', error);
    sendError(res, 500, 'Failed to submit answer');
  }
};

// @desc    Complete a lesson
// @route   POST /api/lessons/:slug/complete
// @access  Private
export const completeLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { slug } = req.params;

    const lesson = await Lesson.findOne({ slug, isActive: true });

    if (!lesson) {
      sendError(res, 404, 'Lesson not found');
      return;
    }

    const userProgress = await UserLessonProgress.findOne({
      userId,
      lessonId: lesson._id,
    });

    if (!userProgress) {
      sendError(res, 404, 'Progress not found');
      return;
    }

    // Mark as completed
    userProgress.status = 'completed';
    userProgress.progress = 100;
    userProgress.completedAt = new Date();
    
    // Mark all content as completed
    userProgress.contentProgress.forEach(cp => {
      cp.completed = true;
      cp.completedAt = new Date();
    });

    // Calculate final XP
    if (userProgress.xpEarned === 0) {
      userProgress.xpEarned = 100 + Math.round(userProgress.score / 2);
    }

    await userProgress.save();

    sendSuccess(res, 200, 'Lesson completed!', {
      status: userProgress.status,
      progress: userProgress.progress,
      score: userProgress.score,
      xpEarned: userProgress.xpEarned,
      completedAt: userProgress.completedAt,
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    sendError(res, 500, 'Failed to complete lesson');
  }
};
