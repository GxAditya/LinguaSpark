import React from 'react';
import { Flame } from 'lucide-react';

interface DailyStreakCardProps {
  currentStreak?: number;
  longestStreak?: number;
  lastActivityDate?: string;
}

export default function DailyStreakCard({ currentStreak = 7, longestStreak = 14, lastActivityDate = 'Today' }: DailyStreakCardProps) {
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const isActive = i < currentStreak;
    return { id: i, isActive };
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Daily Streak</h3>
          <p className="text-sm text-gray-600">Last activity: {lastActivityDate}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
          <Flame className="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div className="mb-8">
        <div className="text-5xl font-bold text-orange-600 mb-2">{currentStreak}</div>
        <p className="text-sm text-gray-600">Days in a row</p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {streakDays.map((day) => (
          <div
            key={day.id}
            className={`aspect-square rounded-lg flex items-center justify-center font-semibold transition-all duration-200 ${
              day.isActive
                ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {day.id + 1}
          </div>
        ))}
      </div>

      <div className="bg-purple-50 rounded-xl p-4">
        <div className="text-lg font-bold text-purple-600">{longestStreak} days</div>
        <div className="text-sm text-gray-600">Longest streak</div>
      </div>
    </div>
  );
}
