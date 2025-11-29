import { Router } from 'express';
import { register, login, getMe, logout, googleAuth, githubAuth } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../middleware/validation.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// OAuth routes
router.post('/google', googleAuth);
router.post('/github', githubAuth);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
