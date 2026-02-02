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
    <div className="bg-surface-base rounded-xl shadow-sm p-8 border border-border-base hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-content-primary">Current Progress</h3>
        <div className="w-12 h-12 tone-brand border rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold text-content-primary">Level {currentLevel}</span>
          <span className="text-content-secondary mb-1">/ {targetLevel}</span>
        </div>
        <div className="w-full bg-surface-muted rounded-full h-3">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-content-secondary mt-2">{currentLevelName} • {language}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-subtle border border-border-subtle rounded-lg p-4">
          <div className="text-2xl font-bold text-content-primary">{lessonsCompleted}</div>
          <div className="text-sm text-content-secondary">Lessons Completed</div>
        </div>
        <div className="bg-surface-subtle border border-border-subtle rounded-lg p-4">
          <div className="text-2xl font-bold text-content-primary">85%</div>
          <div className="text-sm text-content-secondary">Accuracy Rate</div>
        </div>
      </div>
    </div>
  );
}
