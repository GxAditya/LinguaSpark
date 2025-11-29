import { Router } from 'express';
import {
  getLessons,
  getLesson,
  startLesson,
  updateContentProgress,
  submitExercise,
  completeLesson,
} from '../controllers/lesson.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Get all lessons
router.get('/', getLessons);

// Get single lesson
router.get('/:slug', getLesson);

// Start a lesson
router.post('/:slug/start', startLesson);

// Update content progress
router.post('/:slug/content/:contentIndex', updateContentProgress);

// Submit exercise answer
router.post('/:slug/exercise/:exerciseIndex', submitExercise);

// Complete lesson
router.post('/:slug/complete', completeLesson);

export default router;
