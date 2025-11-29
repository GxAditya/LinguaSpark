import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, undefined, { user });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed', errors.array());
      return;
    }

    const user = req.user;
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    const allowedUpdates = [
      'name',
      'avatar',
      'currentLanguage',
      'targetLanguages',
      'dailyGoal',
      'notificationsEnabled',
    ];

    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Server error');
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed', errors.array());
      return;
    }

    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      sendError(res, 401, 'Current password is incorrect');
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 500, 'Server error');
  }
};

// @desc    Update user stats (XP, streak, etc.)
// @route   PUT /api/users/stats
// @access  Private
export const updateStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    const { xpToAdd, updateStreak } = req.body;

    const updates: any = {
      lastActiveDate: new Date(),
    };

    // Add XP
    if (typeof xpToAdd === 'number' && xpToAdd > 0) {
      updates.$inc = { xp: xpToAdd };
    }

    // Update streak logic
    if (updateStreak) {
      const lastActive = user.lastActiveDate;
      const now = new Date();
      const lastActiveDay = new Date(lastActive).setHours(0, 0, 0, 0);
      const today = new Date(now).setHours(0, 0, 0, 0);
      const yesterday = today - 24 * 60 * 60 * 1000;

      if (lastActiveDay === yesterday) {
        // Consecutive day - increment streak
        updates.$inc = { ...updates.$inc, streak: 1 };
      } else if (lastActiveDay < yesterday) {
        // Streak broken - reset to 1
        updates.streak = 1;
      }
      // Same day - no streak change
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true }
    );

    if (!updatedUser) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Check for level up based on XP
    const newLevel = calculateLevel(updatedUser.xp);
    if (newLevel !== updatedUser.level) {
      updatedUser.level = newLevel;
      await updatedUser.save();
    }

    sendSuccess(res, 200, 'Stats updated successfully', {
      xp: updatedUser.xp,
      streak: updatedUser.streak,
      level: updatedUser.level,
    });
  } catch (error) {
    console.error('Update stats error:', error);
    sendError(res, 500, 'Server error');
  }
};

// Helper function to calculate level based on XP
function calculateLevel(xp: number): 'beginner' | 'intermediate' | 'advanced' {
  if (xp >= 5000) return 'advanced';
  if (xp >= 1000) return 'intermediate';
  return 'beginner';
}

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    await User.findByIdAndDelete(user._id);

    sendSuccess(res, 200, 'Account deleted successfully');
  } catch (error) {
    console.error('Delete account error:', error);
    sendError(res, 500, 'Server error');
  }
};
