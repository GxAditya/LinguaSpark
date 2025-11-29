import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentLanguage: string;
  targetLanguages?: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  streak: number;
  dailyGoal: number;
  lastActiveDate?: string;
  notificationsEnabled?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Register a new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  },

  // Get current user
  async getMe(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    if (response.data) {
      return response.data.user;
    }
    throw new Error(response.message || 'Failed to get user');
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export default authService;
