import { Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import ProgressCard from '../components/ProgressCard';
import DailyStreakCard from '../components/DailyStreakCard';
import DailyGoalCard from '../components/DailyGoalCard';
import { BookOpen, Zap, Gamepad2, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      
      <DashboardHeader userName="John Doe" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Welcome back, <span className="text-gradient-brand">John!</span>
          </h1>
          <p className="text-lg text-gray-600">Continue your Spanish learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ProgressCard
            currentLevel={3}
            targetLevel={10}
            language="Spanish"
            lessonsCompleted={24}
          />
          <DailyStreakCard
            currentStreak={7}
            longestStreak={14}
            lastActivityDate="Today"
          />
          <DailyGoalCard
            goalMinutes={30}
            completedMinutes={18}
            goalType="Learning Time"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/lessons" className="card-interactive p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Continue Learning</h3>
              <div className="icon-container-blue w-12 h-12 group-hover:scale-110">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Resume your last lesson on verb conjugation</p>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="text-sm font-semibold text-blue-700 mb-2">Lesson 12: Past Tense Verbs</div>
              <div className="progress-bar h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Continue Lesson <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/practice" className="card-interactive p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Practice Speaking</h3>
              <div className="icon-container-pink w-12 h-12 group-hover:scale-110">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Have real conversations with AI tutors</p>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">Available Topics:</div>
              <div className="flex flex-wrap gap-2">
                <span className="badge-pink">Café Ordering</span>
                <span className="badge-pink">Travel</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Start Practice <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/games" className="card-interactive p-6 group block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Play Games</h3>
              <div className="icon-container-purple w-12 h-12 group-hover:scale-110">
                <Gamepad2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Learn while playing fun interactive games</p>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">Popular Games:</div>
              <div className="flex flex-wrap gap-2">
                <span className="badge-purple">Word Match</span>
                <span className="badge-purple">Trivia</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Play Now <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Activity</h2>
          <div className="space-y-4">
            {[
              { activity: 'Completed Lesson 12: Past Tense Verbs', time: '2 hours ago', color: 'orange' },
              { activity: 'Practiced speaking with AI tutor', time: '1 day ago', color: 'pink' },
              { activity: 'Completed Lesson 11: Present Tense', time: '2 days ago', color: 'blue' },
              { activity: 'Played Word Match game', time: '3 days ago', color: 'purple' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    item.color === 'orange' ? 'bg-gradient-to-br from-orange-100 to-pink-100' :
                    item.color === 'pink' ? 'bg-gradient-to-br from-pink-100 to-rose-100' :
                    item.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
                    'bg-gradient-to-br from-purple-100 to-indigo-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      item.color === 'orange' ? 'bg-orange-600' :
                      item.color === 'pink' ? 'bg-pink-600' :
                      item.color === 'blue' ? 'bg-blue-600' :
                      'bg-purple-600'
                    }`}></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
