import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.utils.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import config from '../config/index.js';
import { recordLoginDay } from '../services/login.activity.service.js';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface GitHubUserInfo {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

async function safeRecordLoginDay(userId: string): Promise<void> {
  try {
    await recordLoginDay(userId);
  } catch (error) {
    console.error('recordLoginDay error:', error);
  }
}

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
    await safeRecordLoginDay(user._id.toString());

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
    await safeRecordLoginDay(user._id.toString());

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

    await safeRecordLoginDay(user._id.toString());

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

// @desc    Google OAuth - Exchange code for tokens and user info
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      sendError(res, 400, 'Authorization code is required');
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: `${config.clientUrl}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens: GoogleTokenResponse = await tokenResponse.json() as GoogleTokenResponse;

    if (tokens.error || !tokens.access_token) {
      console.error('Google token error:', tokens.error);
      sendError(res, 400, 'Failed to exchange authorization code');
      return;
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userInfoResponse.json() as GoogleUserInfo;

    if (!googleUser.email) {
      sendError(res, 400, 'Could not retrieve email from Google');
      return;
    }

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // Update existing user with Google info if not already set
      if (user.provider === 'local') {
        user.provider = 'google';
        user.providerId = googleUser.id;
      }
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }
      user.lastActiveDate = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: 'google',
        providerId: googleUser.id,
      });
    }

    await safeRecordLoginDay(user._id.toString());

    // Generate JWT token
    const token = generateToken(user._id.toString());

    sendSuccess(res, 200, 'Google authentication successful', {
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
    console.error('Google auth error:', error);
    sendError(res, 500, 'Server error during Google authentication');
  }
};

// @desc    GitHub OAuth - Exchange code for tokens and user info
// @route   POST /api/auth/github
// @access  Public
export const githubAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      sendError(res, 400, 'Authorization code is required');
      return;
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: `${config.clientUrl}/auth/github/callback`,
      }),
    });

    const tokens = await tokenResponse.json() as GitHubTokenResponse;

    if (tokens.error || !tokens.access_token) {
      console.error('GitHub token error:', tokens.error);
      sendError(res, 400, 'Failed to exchange authorization code');
      return;
    }

    // Get user info from GitHub
    const userInfoResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/json',
      },
    });

    const githubUser = await userInfoResponse.json() as GitHubUserInfo;

    // GitHub may not return email in user info, fetch from emails endpoint
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: 'application/json',
        },
      });

      const emails = await emailsResponse.json() as GitHubEmail[];
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      email = primaryEmail?.email || emails[0]?.email;
    }

    if (!email) {
      sendError(res, 400, 'Could not retrieve email from GitHub. Please make sure your email is public or add a verified email.');
      return;
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with GitHub info if not already set
      if (user.provider === 'local') {
        user.provider = 'github';
        user.providerId = String(githubUser.id);
      }
      if (!user.avatar && githubUser.avatar_url) {
        user.avatar = githubUser.avatar_url;
      }
      user.lastActiveDate = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email,
        avatar: githubUser.avatar_url,
        provider: 'github',
        providerId: String(githubUser.id),
      });
    }

    await safeRecordLoginDay(user._id.toString());

    // Generate JWT token
    const token = generateToken(user._id.toString());

    sendSuccess(res, 200, 'GitHub authentication successful', {
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
    console.error('GitHub auth error:', error);
    sendError(res, 500, 'Server error during GitHub authentication');
  }
};
