import api from './api';
import { User } from './auth.service';

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  currentLanguage?: string;
  targetLanguages?: string[];
  dailyGoal?: number;
  notificationsEnabled?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateStatsData {
  xpToAdd?: number;
  updateStreak?: boolean;
}

export interface StatsResponse {
  xp: number;
  streak: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface DashboardStats {
  lessonsCompleted: number;
  practiceScenariosCompleted: number;
  totalLessons: number;
  totalPracticeScenarios: number;
  currentLevel: number;
  targetLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export const userService = {
  // Get user profile
  async getProfile(): Promise<User> {
    const response = await api.get<{ user: User }>('/users/profile');
    if (response.data) {
      return response.data.user;
    }
    throw new Error(response.message || 'Failed to get profile');
  },

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<{ user: User }>('/users/profile', data);
    if (response.data) {
      return response.data.user;
    }
    throw new Error(response.message || 'Failed to update profile');
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await api.put('/users/password', data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  },

  // Update stats (XP, streak)
  async updateStats(data: UpdateStatsData): Promise<StatsResponse> {
    const response = await api.put<StatsResponse>('/users/stats', data);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update stats');
  },

  async getDashboardStats(language?: string): Promise<DashboardStats> {
    const query = language ? `?language=${encodeURIComponent(language)}` : '';
    const response = await api.get<DashboardStats>(`/users/dashboard-stats${query}`);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to load dashboard stats');
  },

  // Delete account
  async deleteAccount(): Promise<void> {
    const response = await api.delete('/users/account');
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete account');
    }
    localStorage.removeItem('token');
  },
};

export default userService;
