import { create } from 'zustand';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Category {
  id: string;
  name: string;
  color: string;
  position: number;
  user_id: string;
}

export interface Task {
  id: string;
  name: string;
  category_id: string;
  frequency: 'daily' | 'weekly';
  scheduled_days: number[];
  user_id: string;
  created_at: string;
}

// Keep Habit as alias for backward compat
export type Habit = Task;
export type HabitCategory = string;
export type HabitFrequency = 'daily' | 'weekly';

export interface Completion {
  id: string;
  task_id: string;
  completed_date: string;
  user_id: string;
}

interface UIState {
  selectedMonth: number;
  selectedYear: number;
  selectedCategory: string; // category id or 'all'
  weeklyPlanningEnabled: boolean;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedCategory: (cat: string) => void;
  setWeeklyPlanningEnabled: (enabled: boolean) => void;
}

const now = new Date();

export const useUIStore = create<UIState>((set) => ({
  selectedMonth: now.getMonth(),
  selectedYear: now.getFullYear(),
  selectedCategory: 'all',
  weeklyPlanningEnabled: true,
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setWeeklyPlanningEnabled: (enabled) => set({ weeklyPlanningEnabled: enabled }),
}));

// Re-export for backward compat
export const useHabitStore = useUIStore;
