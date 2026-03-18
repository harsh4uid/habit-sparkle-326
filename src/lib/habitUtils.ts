import type { Task } from '@/stores/useHabitStore';

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getTodayString(): string {
  const t = new Date();
  return formatDate(t.getFullYear(), t.getMonth(), t.getDate());
}

export function isToday(year: number, month: number, day: number): boolean {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

export function isPast(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function isScheduledForDay(task: Task, year: number, month: number, day: number): boolean {
  if (task.frequency !== 'daily') return true;
  if (!task.scheduled_days || task.scheduled_days.length === 0) return true;
  const dayOfWeek = new Date(year, month, day).getDay();
  return task.scheduled_days.includes(dayOfWeek);
}

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function clampToStartDate(startDate: string, loopDate: Date): boolean {
  const start = new Date(startDate + 'T00:00:00');
  const d = new Date(loopDate);
  d.setHours(0, 0, 0, 0);
  return d >= start;
}

export const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export function calculateCompletionRate(
  tasks: Task[],
  completionMap: Record<string, Record<string, string>>,
  month: number,
  year: number,
  frequency: 'daily' | 'weekly' = 'daily'
): number {
  const filteredTasks = tasks.filter((t) => t.frequency === frequency);
  if (filteredTasks.length === 0) return 0;

  const daysInMonth = getDaysInMonth(month, year);
  const today = new Date();
  const maxDay = year === today.getFullYear() && month === today.getMonth()
    ? today.getDate()
    : daysInMonth;

  let completed = 0;
  let total = 0;

  if (frequency === 'daily') {
    for (let day = 1; day <= maxDay; day++) {
      const date = formatDate(year, month, day);
      for (const task of filteredTasks) {
        if (!isScheduledForDay(task, year, month, day)) continue;
        total++;
        if (completionMap[date]?.[task.id]) completed++;
      }
    }
  } else {
    const weeks = Math.ceil(maxDay / 7);
    total = filteredTasks.length * weeks;
    for (let week = 0; week < weeks; week++) {
      const weekStart = week * 7 + 1;
      const weekEnd = Math.min(weekStart + 6, daysInMonth);
      for (const task of filteredTasks) {
        for (let day = weekStart; day <= weekEnd; day++) {
          const date = formatDate(year, month, day);
          if (completionMap[date]?.[task.id]) {
            completed++;
            break;
          }
        }
      }
    }
  }

  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export function getWeeklyCompletionRates(
  tasks: Task[],
  completionMap: Record<string, Record<string, string>>,
  month: number,
  year: number
): number[] {
  const dailyTasks = tasks.filter((t) => t.frequency === 'daily');
  if (dailyTasks.length === 0) return [0, 0, 0, 0];

  const daysInMonth = getDaysInMonth(month, year);
  const rates: number[] = [];

  for (let week = 0; week < 4; week++) {
    const start = week * 7 + 1;
    const end = Math.min(start + 6, daysInMonth);
    let completed = 0;
    let total = 0;

    for (let day = start; day <= end; day++) {
      const date = formatDate(year, month, day);
      for (const task of dailyTasks) {
        if (!isScheduledForDay(task, year, month, day)) continue;
        total++;
        if (completionMap[date]?.[task.id]) completed++;
      }
    }
    rates.push(total === 0 ? 0 : Math.round((completed / total) * 100));
  }

  return rates;
}

export function getDailyCompletionData(
  tasks: Task[],
  completionMap: Record<string, Record<string, string>>,
  month: number,
  year: number
): { day: number; rate: number }[] {
  const dailyTasks = tasks.filter((t) => t.frequency === 'daily');
  if (dailyTasks.length === 0) return [];

  const daysInMonth = getDaysInMonth(month, year);
  const data: { day: number; rate: number }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(year, month, day);
    const scheduled = dailyTasks.filter((t) => isScheduledForDay(t, year, month, day));
    if (scheduled.length === 0) {
      data.push({ day, rate: 0 });
      continue;
    }
    let completed = 0;
    for (const task of scheduled) {
      if (completionMap[date]?.[task.id]) completed++;
    }
    data.push({ day, rate: Math.round((completed / scheduled.length) * 100) });
  }

  return data;
}
