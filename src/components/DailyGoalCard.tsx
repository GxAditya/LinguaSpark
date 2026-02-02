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
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${isCompleted ? 'bg-success-soft border-success' : 'tone-brand border-accent'
          }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <Target className="w-6 h-6 text-accent" />
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-content-primary">{completedMinutes} / {goalMinutes} minutes</span>
          <span className={`text-sm font-semibold ${isCompleted ? 'text-success' : 'text-accent'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full bg-surface-muted rounded-full h-4 overflow-hidden border border-border-subtle">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted
              ? 'bg-success'
              : 'bg-accent'
              }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-success-soft rounded-lg p-4 border border-success">
          <div className="text-sm font-semibold text-success">Daily goal completed!</div>
          <div className="text-xs text-success mt-1">Great work! Come back tomorrow to maintain your streak.</div>
        </div>
      ) : (
        <div className="tone-brand border border-accent rounded-lg p-4">
          <div className="text-sm font-semibold text-accent">{goalMinutes - completedMinutes} minutes remaining</div>
          <div className="text-xs text-accent mt-1">Keep going! You're almost there.</div>
        </div>
      )}
    </div>
  );
}
