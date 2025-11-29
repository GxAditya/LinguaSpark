import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updateStats,
  deleteAccount,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  updateProfileValidation,
  changePasswordValidation,
} from '../middleware/validation.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);

// Password change
router.put('/password', changePasswordValidation, changePassword);

// Stats update (XP, streak)
router.put('/stats', updateStats);

// Delete account
router.delete('/account', deleteAccount);

export default router;
