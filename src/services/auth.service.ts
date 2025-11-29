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

// OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
const REDIRECT_URI = window.location.origin;

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

  // Google OAuth
  initiateGoogleLogin(): void {
    const scope = 'email profile';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/auth/google/callback&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = googleAuthUrl;
  },

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { code });
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Google authentication failed');
  },

  // GitHub OAuth
  initiateGitHubLogin(): void {
    const scope = 'user:email';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/auth/github/callback&scope=${scope}`;
    window.location.href = githubAuthUrl;
  },

  // Handle GitHub OAuth callback
  async handleGitHubCallback(code: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/github', { code });
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'GitHub authentication failed');
  },
};

export default authService;
