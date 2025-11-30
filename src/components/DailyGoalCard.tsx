import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface DailyGoalCardProps {
  goalMinutes?: number;
  completedMinutes?: number;
  goalType?: string;
}

export default function DailyGoalCard({ goalMinutes = 30, completedMinutes = 18, goalType = 'Learning Time' }: DailyGoalCardProps) {
  const progressPercent = (completedMinutes / goalMinutes) * 100;
  const isCompleted = completedMinutes >= goalMinutes;

  return (
    <div className="bg-surface-base rounded-xl shadow-sm p-8 border border-border-base hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-content-primary mb-1">Daily Goal</h3>
          <p className="text-sm text-content-secondary">{goalType}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${isCompleted ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
          }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Target className="w-6 h-6 text-orange-600" />
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-content-primary">{completedMinutes} / {goalMinutes} minutes</span>
          <span className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full bg-surface-muted rounded-full h-4 overflow-hidden border border-border-subtle">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted
              ? 'bg-green-500'
              : 'bg-orange-500'
              }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="text-sm font-semibold text-green-700">Daily goal completed!</div>
          <div className="text-xs text-green-600 mt-1">Great work! Come back tomorrow to maintain your streak.</div>
        </div>
      ) : (
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="text-sm font-semibold text-orange-700">{goalMinutes - completedMinutes} minutes remaining</div>
          <div className="text-xs text-orange-600 mt-1">Keep going! You're almost there.</div>
        </div>
      )}
    </div>
  );
}
