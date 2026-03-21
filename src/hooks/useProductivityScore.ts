import type { Task } from '@/stores/useHabitStore';
import { getCurrentLogicalDate, getTodayString, isScheduledForDay } from '@/lib/habitUtils';

interface ScoreResult {
  score: number;
  tier: string;
  color: string;
  completedToday: number;
  scheduledToday: number;
  missedToday: number;
}

export function useProductivityScore(
  tasks: Task[],
  completionMap: Record<string, Record<string, string>>,
  focusMinutesToday: number,
  currentStreak: number
): ScoreResult {
  const logicalToday = getCurrentLogicalDate();
  const todayStr = getTodayString();
  const dailyTasks = tasks.filter((t) => t.frequency === 'daily');

  const scheduledToday = dailyTasks.filter((t) =>
    isScheduledForDay(t, logicalToday)
  );

  const completedToday = scheduledToday.filter(
    (t) => completionMap[todayStr]?.[t.id]
  ).length;

  const completionRate = scheduledToday.length > 0 ? (completedToday / scheduledToday.length) * 100 : 100;
  const focusScore = Math.min(focusMinutesToday / 120, 1) * 100;
  const streakScore = Math.min(currentStreak / 7, 1) * 100;

  const score = Math.round(completionRate * 0.4 + focusScore * 0.3 + streakScore * 0.3);

  let tier: string;
  let color: string;
  if (score >= 90) { tier = 'Elite'; color = 'hsl(var(--chart-2))'; }
  else if (score >= 70) { tier = 'Good'; color = 'hsl(var(--primary))'; }
  else if (score >= 50) { tier = 'Average'; color = 'hsl(var(--chart-4))'; }
  else { tier = 'Weak'; color = 'hsl(var(--destructive))'; }

  return {
    score,
    tier,
    color,
    completedToday,
    scheduledToday: scheduledToday.length,
    missedToday: scheduledToday.length - completedToday,
  };
}
