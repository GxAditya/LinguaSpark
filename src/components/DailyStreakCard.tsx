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
    <div className="bg-surface-base rounded-xl shadow-sm p-8 border border-border-base hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-content-primary mb-1">Daily Streak</h3>
          <p className="text-sm text-content-secondary">Last activity: {lastActivityDate}</p>
        </div>
        <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center">
          <Flame className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="mb-8">
        <div className="text-5xl font-bold text-content-primary mb-2">{currentStreak}</div>
        <p className="text-sm text-content-secondary">Days in a row</p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {streakDays.map((day) => (
          <div
            key={day.id}
            className={`aspect-square rounded-md flex items-center justify-center font-semibold transition-all duration-200 text-sm border ${day.isActive
              ? 'tone-brand border-accent text-accent'
              : 'bg-surface-2 border-default text-soft'
              }`}
          >
            {day.id + 1}
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border border-default rounded-lg p-4">
        <div className="text-lg font-bold text-content-primary">{longestStreak} days</div>
        <div className="text-sm text-content-secondary">Longest streak</div>
      </div>
    </div>
  );
}
