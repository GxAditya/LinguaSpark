import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import ProgressCard from '../components/ProgressCard';
import DailyStreakCard from '../components/DailyStreakCard';
import { ArrowRight, BookOpen, ChevronDown, Gamepad2, Globe, Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '../context';
import { userService } from '../services';
import { LEARNING_LANGUAGE_OPTIONS, type LearningLanguage, getLearningLanguageLabel, resolveLearningLanguage } from '../utils/languages';
import type { DashboardStats } from '../services';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-page hero-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-muted font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Get first name from full name
  const firstName = user.name.split(' ')[0];
  const learningLanguage = resolveLearningLanguage(user.currentLanguage);
  const learningLanguageLabel = getLearningLanguageLabel(learningLanguage);
  const currentLevel = dashboardStats?.currentLevel ?? 1;
  const targetLevel = dashboardStats?.targetLevel ?? 10;
  const lessonsCompleted = dashboardStats?.lessonsCompleted ?? 0;
  const practiceCompleted = dashboardStats?.practiceScenariosCompleted ?? 0;

  const streakInfo = useMemo(() => {
    const lastActivity = dashboardStats?.lastActivityDate;
    if (!lastActivity) {
      return { label: 'Today' };
    }
    const lastDate = new Date(lastActivity);
    if (Number.isNaN(lastDate.getTime())) {
      return { label: 'Recently' };
    }
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sameDay = lastDate.toDateString() === today.toDateString();
    const wasYesterday = lastDate.toDateString() === yesterday.toDateString();
    return {
      label: sameDay ? 'Today' : wasYesterday ? 'Yesterday' : lastDate.toLocaleDateString(),
    };
  }, [dashboardStats?.lastActivityDate]);

  useEffect(() => {
    let ignore = false;
    const loadStats = async () => {
      if (!user) return;
      setIsStatsLoading(true);
      setStatsError(null);
      try {
        const stats = await userService.getDashboardStats(learningLanguage);
        if (!ignore) {
          setDashboardStats(stats);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setStatsError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
        }
      } finally {
        if (!ignore) {
          setIsStatsLoading(false);
        }
      }
    };

    loadStats();
    return () => {
      ignore = true;
    };
  }, [learningLanguage, user]);

  const handleLanguageChange = async (value: string) => {
    const nextLanguage = resolveLearningLanguage(value) as LearningLanguage;
    if (nextLanguage === learningLanguage) return;

    setIsUpdatingLanguage(true);
    setLanguageError(null);

    try {
      const updatedUser = await userService.updateProfile({ currentLanguage: nextLanguage });
      updateUser(updatedUser);
    } catch (err: unknown) {
      setLanguageError(err instanceof Error ? err.message : 'Failed to update language');
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 hero-grid"></div>

      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-3">
              Welcome back, <span className="text-content-primary">{firstName}</span>!
            </h1>
            <p className="text-lg text-content-secondary">Ready to continue your language journey?</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ProgressCard
            currentLevel={currentLevel}
            targetLevel={targetLevel}
            language={learningLanguageLabel}
            lessonsCompleted={lessonsCompleted}
            practiceCompleted={practiceCompleted}
          />
          <DailyStreakCard
            currentStreak={dashboardStats?.currentStreak ?? user.streak ?? 0}
            longestStreak={dashboardStats?.longestStreak ?? user.streak ?? 0}
            lastActivityDate={streakInfo.label}
          />
          <div className="bg-surface-base rounded-xl shadow-sm p-8 border border-border-base hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg tone-brand border flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-content-primary">Learning language</p>
                  <p className="text-xs text-content-secondary">Switch your practice focus</p>
                </div>
              </div>
              {(isUpdatingLanguage || isStatsLoading) && <Loader2 className="w-4 h-4 text-content-secondary animate-spin" />}
            </div>

            <div className="relative group">
              <select
                id="dashboard-language-selector"
                value={learningLanguage}
                disabled={isUpdatingLanguage}
                onChange={(event) => handleLanguageChange(event.target.value)}
                className="appearance-none w-full rounded-xl border border-border-base bg-surface-base py-3 pl-4 pr-10 text-sm font-semibold text-content-primary shadow-sm cursor-pointer transition-all duration-200 hover:border-border-strong hover:shadow-md focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary-ring disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {LEARNING_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-center group-hover:bg-surface-muted transition-colors">
                <ChevronDown className="h-4 w-4 text-content-secondary" />
              </div>
            </div>

            {(languageError || statsError) && (
              <p className="mt-3 text-sm bg-warning-soft border border-warning rounded-lg px-3 py-2 text-warning">
                {languageError || statsError}
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-content-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/lessons" className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <ArrowRight className="w-5 h-5 text-content-tertiary group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Continue Lesson</h3>
            <p className="text-sm text-content-secondary mb-4">Pick up where you left off in {learningLanguageLabel}.</p>
            <div className="flex items-center gap-2">
              <div className="progress-bar h-2 bg-surface-muted rounded-full flex-grow overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-xs font-medium text-content-secondary">65%</span>
            </div>
          </Link>

          <Link to="/practice" className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <ArrowRight className="w-5 h-5 text-content-tertiary group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Practice Speaking</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="tone-brand border px-2 py-1 rounded-md text-xs font-medium">Café Ordering</span>
              <span className="text-xs text-content-secondary">+2 others</span>
            </div>
            <p className="text-sm text-content-secondary">Roleplay real-world scenarios with AI.</p>
          </Link>

          <Link to="/games" className="bg-surface-base p-6 rounded-xl border border-border-base shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 group block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6 text-accent" />
              </div>
              <ArrowRight className="w-5 h-5 text-content-tertiary group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-content-primary mb-2">Play Games</h3>
            <p className="text-sm text-content-secondary mb-4">Learn vocabulary through fun mini-games.</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full tone-brand border flex items-center justify-center text-[10px]">
                  {i}
                </div>
              ))}
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
