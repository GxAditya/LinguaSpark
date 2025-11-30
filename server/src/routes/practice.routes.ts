import { Router } from 'express';
import { param } from 'express-validator';
import {
  listPracticeScenarios,
  startPracticeSession,
  getPracticeSessionById,
  sendPracticeMessage,
  completePracticeSession,
} from '../controllers/practice.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  startPracticeSessionValidation,
  practiceMessageValidation,
} from '../middleware/validation.middleware.js';

const router = Router();

router.use(protect);

router.get('/scenarios', listPracticeScenarios);
router.post('/sessions', startPracticeSessionValidation, startPracticeSession);
router.get('/sessions/:sessionId', param('sessionId').isMongoId().withMessage('Invalid session id'), getPracticeSessionById);
router.post(
  '/sessions/:sessionId/messages',
  [param('sessionId').isMongoId().withMessage('Invalid session id'), ...practiceMessageValidation],
  sendPracticeMessage,
);
router.post(
  '/sessions/:sessionId/complete',
  param('sessionId').isMongoId().withMessage('Invalid session id'),
  completePracticeSession,
);

export default router;
