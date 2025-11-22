import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressCardProps {
  currentLevel: number;
  targetLevel?: number;
  language?: string;
  lessonsCompleted?: number;
}

export default function ProgressCard({ currentLevel = 3, targetLevel = 10, language = 'Spanish', lessonsCompleted = 24 }: ProgressCardProps) {
  const progress = (currentLevel / targetLevel) * 100;

  const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Fluent'];
  const currentLevelName = levels[Math.min(currentLevel - 1, levels.length - 1)];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Learning Progress</h3>
          <p className="text-sm text-gray-600">{language}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-orange-600" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Level {currentLevel}</span>
          <span className="text-sm font-semibold text-orange-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Next level: {Math.ceil(targetLevel - currentLevel)} levels away</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-600">{lessonsCompleted}</div>
          <div className="text-sm text-gray-600">Lessons Done</div>
        </div>
        <div className="bg-pink-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-pink-600">{currentLevelName}</div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
      </div>
    </div>
  );
}
