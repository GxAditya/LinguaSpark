import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ProgressCard from '../components/ProgressCard';
import DailyStreakCard from '../components/DailyStreakCard';
import DailyGoalCard from '../components/DailyGoalCard';
import { BookOpen, Zap, Gamepad2 } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'practice' | 'games'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} userName="John Doe" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
              <p className="text-lg text-gray-600">Continue your Spanish learning journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Continue Learning</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Resume your last lesson on verb conjugation</p>
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="text-sm font-semibold text-blue-700 mb-2">Lesson 12: Past Tense Verbs</div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Continue Lesson
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Practice Speaking</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Have real conversations with AI tutors</p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">Available Topics:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">Café Ordering</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">Travel</span>
                  </div>
                </div>
                <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                  Start Practice
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Play Games</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Learn while playing fun interactive games</p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">Popular Games:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Word Match</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Trivia</span>
                  </div>
                </div>
                <Link to="/games" className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
                  Play Now
                </Link>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { date: 'Today', activity: 'Completed Lesson 12: Past Tense Verbs', time: '2 hours ago' },
                  { date: 'Yesterday', activity: 'Practiced speaking with AI tutor', time: '1 day ago' },
                  { date: 'Nov 20', activity: 'Completed Lesson 11: Present Tense', time: '2 days ago' },
                  { date: 'Nov 19', activity: 'Played Word Match game', time: '3 days ago' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
                        <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
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
          </>
        )}

        {activeTab === 'lessons' && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lessons Coming Soon</h2>
            <p className="text-lg text-gray-600">Your personalized lessons will appear here</p>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Practice Coming Soon</h2>
            <p className="text-lg text-gray-600">Speaking and conversation practice modules</p>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Games Coming Soon</h2>
            <p className="text-lg text-gray-600">Fun interactive games to boost your learning</p>
          </div>
        )}
      </main>
    </div>
  );
}
