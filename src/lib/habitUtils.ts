import type { Task } from '@/stores/useHabitStore';

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getDayEndsAt(): string {
  if (typeof window === 'undefined') return '04:00';
  return localStorage.getItem('ws-day-ends-at') || '04:00';
}

export function parseTime(time: string): { hours: number; minutes: number } {
  const [hours = '0', minutes = '0'] = time.split(':');
  return { hours: Number(hours), minutes: Number(minutes) };
}

export function isBeforeDayEnd(baseDate: Date = new Date(), dayEndsAt: string = getDayEndsAt()): boolean {
  const { hours, minutes } = parseTime(dayEndsAt);
  return baseDate.getHours() < hours || (baseDate.getHours() === hours && baseDate.getMinutes() < minutes);
}

export function getCurrentLogicalDate(baseDate: Date = new Date()): Date {
  const logicalDate = new Date(baseDate);
  if (isBeforeDayEnd(baseDate)) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }
  logicalDate.setHours(0, 0, 0, 0);
  return logicalDate;
}

export function getCurrentLogicalDateString(): string {
  const t = getCurrentLogicalDate();
  return formatDate(t.getFullYear(), t.getMonth(), t.getDate());
}

export function getCurrentTimeString(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function isLateNight(baseDate: Date = new Date()): boolean {
  return isBeforeDayEnd(baseDate);
}

export function getTaskStatus(
  task: Task,
  date: string,
  completionMap: Record<string, Record<string, string>>,
  carriedTasks: string[] = []
): 'pending' | 'completed' | 'missed' | 'carried' {
  const completed = !!completionMap[date]?.[task.id];
  if (completed) return 'completed';
  if (carriedTasks.includes(task.id)) return 'carried';

  const currentDate = getCurrentLogicalDateString();
  if (date < currentDate) return 'missed';
  return 'pending';
}

export function getTodayString(): string {
  return getCurrentLogicalDateString();
}

export function isToday(year: number, month: number, day: number): boolean {
  const t = getCurrentLogicalDate();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

export function isPast(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const today = getCurrentLogicalDate();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function isScheduledForDay(
  task: Task,
  yearOrDate: number | Date,
  month?: number,
  day?: number
): boolean {
  if (task.frequency !== 'daily') return true;
  if (!task.scheduled_days || task.scheduled_days.length === 0) return true;

  let dayOfWeek: number;
  if (yearOrDate instanceof Date) {
    dayOfWeek = yearOrDate.getDay();
  } else {
    if (month === undefined || day === undefined) return false;
    dayOfWeek = new Date(yearOrDate, month, day).getDay();
  }

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
  const today = getCurrentLogicalDate();
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
