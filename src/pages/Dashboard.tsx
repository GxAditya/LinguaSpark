import { Link, Navigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import ProgressCard from '../components/ProgressCard';
import DailyStreakCard from '../components/DailyStreakCard';
import DailyGoalCard from '../components/DailyGoalCard';
import { BookOpen, Gamepad2, Loader2, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../context';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();

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

  // Calculate level progress (assuming 1000 XP per level)
  const xpPerLevel = 1000;
  const currentLevel = Math.floor(user.xp / xpPerLevel) + 1;
  const lessonsCompleted = Math.floor(user.xp / 50); // Estimate based on XP

  return (
    <div className="min-h-screen bg-surface-base relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 hero-grid"></div>

      <DashboardHeader userName={user.name} userAvatar={user.avatar} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-3">
            Welcome back, <span className="text-content-primary">{firstName}</span>!
          </h1>
          <p className="text-lg text-content-secondary">Ready to continue your language journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ProgressCard
            currentLevel={currentLevel}
            targetLevel={10}
            language={user.currentLanguage.charAt(0).toUpperCase() + user.currentLanguage.slice(1)}
            lessonsCompleted={lessonsCompleted}
          />
          <DailyStreakCard
            currentStreak={user.streak}
            longestStreak={user.streak} // Could be a separate field
            lastActivityDate={user.lastActiveDate ? new Date(user.lastActiveDate).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(user.lastActiveDate).toLocaleDateString() : 'Today'}
          />
          <DailyGoalCard
            goalMinutes={user.dailyGoal}
            completedMinutes={Math.floor(user.dailyGoal * 0.6)} // Placeholder - would come from activity tracking
            goalType="Learning Time"
          />
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
            <p className="text-sm text-content-secondary mb-4">Pick up where you left off in Spanish Basics.</p>
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
