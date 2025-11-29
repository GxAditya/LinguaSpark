import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.utils.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed', errors.array());
      return;
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 400, 'User with this email already exists');
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    sendSuccess(res, 201, 'Registration successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currentLanguage: user.currentLanguage,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        dailyGoal: user.dailyGoal,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 500, 'Server error during registration');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed', errors.array());
      return;
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Update last active date
    user.lastActiveDate = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currentLanguage: user.currentLanguage,
        targetLanguages: user.targetLanguages,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        dailyGoal: user.dailyGoal,
        lastActiveDate: user.lastActiveDate,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Server error during login');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, undefined, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currentLanguage: user.currentLanguage,
        targetLanguages: user.targetLanguages,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        dailyGoal: user.dailyGoal,
        lastActiveDate: user.lastActiveDate,
        notificationsEnabled: user.notificationsEnabled,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    sendError(res, 500, 'Server error');
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint exists for consistency and future session management
  sendSuccess(res, 200, 'Logout successful');
};
