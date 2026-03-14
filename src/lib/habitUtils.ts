import { Habit, HabitCategory } from '@/stores/useHabitStore';

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getWeekNumber(day: number): number {
  return Math.min(Math.ceil(day / 7), 4);
}

export const categoryColors: Record<HabitCategory, { bg: string; text: string; dot: string }> = {
  health: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  productivity: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  learning: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  fitness: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  mindfulness: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
};

export const categoryLabels: Record<HabitCategory, string> = {
  health: 'Health',
  productivity: 'Productivity',
  learning: 'Learning',
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
};

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function calculateCompletionRate(
  habits: Habit[],
  completions: Record<string, Record<string, boolean>>,
  month: number,
  year: number,
  frequency: 'daily' | 'weekly' = 'daily'
): number {
  const filteredHabits = habits.filter((h) => h.frequency === frequency);
  if (filteredHabits.length === 0) return 0;

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
      for (const habit of filteredHabits) {
        total++;
        if (completions[date]?.[habit.id]) completed++;
      }
    }
  } else {
    const weeks = Math.ceil(maxDay / 7);
    total = filteredHabits.length * weeks;
    for (let week = 0; week < weeks; week++) {
      const weekStart = week * 7 + 1;
      const weekEnd = Math.min(weekStart + 6, daysInMonth);
      for (const habit of filteredHabits) {
        for (let day = weekStart; day <= weekEnd; day++) {
          const date = formatDate(year, month, day);
          if (completions[date]?.[habit.id]) {
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
  habits: Habit[],
  completions: Record<string, Record<string, boolean>>,
  month: number,
  year: number
): number[] {
  const dailyHabits = habits.filter((h) => h.frequency === 'daily');
  if (dailyHabits.length === 0) return [0, 0, 0, 0];

  const daysInMonth = getDaysInMonth(month, year);
  const rates: number[] = [];

  for (let week = 0; week < 4; week++) {
    const start = week * 7 + 1;
    const end = Math.min(start + 6, daysInMonth);
    let completed = 0;
    let total = 0;

    for (let day = start; day <= end; day++) {
      const date = formatDate(year, month, day);
      for (const habit of dailyHabits) {
        total++;
        if (completions[date]?.[habit.id]) completed++;
      }
    }
    rates.push(total === 0 ? 0 : Math.round((completed / total) * 100));
  }

  return rates;
}

export function getDailyCompletionData(
  habits: Habit[],
  completions: Record<string, Record<string, boolean>>,
  month: number,
  year: number
): { day: number; rate: number }[] {
  const dailyHabits = habits.filter((h) => h.frequency === 'daily');
  if (dailyHabits.length === 0) return [];

  const daysInMonth = getDaysInMonth(month, year);
  const data: { day: number; rate: number }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(year, month, day);
    let completed = 0;
    for (const habit of dailyHabits) {
      if (completions[date]?.[habit.id]) completed++;
    }
    data.push({ day, rate: Math.round((completed / dailyHabits.length) * 100) });
  }

  return data;
}
