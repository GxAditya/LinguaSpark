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
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Daily Goal</h3>
          <p className="text-sm text-gray-600">{goalType}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Target className="w-6 h-6 text-blue-600" />
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{completedMinutes} / {goalMinutes} minutes</span>
          <span className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="text-sm font-semibold text-green-700">Daily goal completed!</div>
          <div className="text-xs text-green-600 mt-1">Great work! Come back tomorrow to maintain your streak.</div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-sm font-semibold text-blue-700">{goalMinutes - completedMinutes} minutes remaining</div>
          <div className="text-xs text-blue-600 mt-1">Keep going! You're almost there.</div>
        </div>
      )}
    </div>
  );
}
