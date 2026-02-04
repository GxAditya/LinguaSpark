import mongoose from 'mongoose';
import { UserLoginDay } from '../models/index.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizeToUtcDay(date: Date = new Date()): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

export async function recordLoginDay(userId: mongoose.Types.ObjectId | string, date: Date = new Date()): Promise<void> {
  const day = normalizeToUtcDay(date);
  await UserLoginDay.updateOne(
    { userId, date: day },
    { $setOnInsert: { userId, date: day } },
    { upsert: true }
  );
}

export async function getLoginStreakStats(userId: mongoose.Types.ObjectId | string, now: Date = new Date()): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
}> {
  const loginDays = await UserLoginDay.find({ userId })
    .sort({ date: 1 })
    .select('date');

  if (loginDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dayValues = loginDays
    .map((entry) => normalizeToUtcDay(entry.date).getTime())
    .sort((a, b) => a - b);

  let currentRun = 1;
  let longestRun = 1;

  for (let i = 1; i < dayValues.length; i += 1) {
    const diff = dayValues[i] - dayValues[i - 1];
    if (diff === DAY_MS) {
      currentRun += 1;
    } else if (diff > 0) {
      currentRun = 1;
    }
    if (currentRun > longestRun) {
      longestRun = currentRun;
    }
  }

  const lastDay = dayValues[dayValues.length - 1];
  const today = normalizeToUtcDay(now).getTime();
  const yesterday = today - DAY_MS;
  const currentStreak = lastDay === today || lastDay === yesterday ? currentRun : 0;

  return {
    currentStreak,
    longestStreak: longestRun,
    lastActivityDate: new Date(lastDay),
  };
}
