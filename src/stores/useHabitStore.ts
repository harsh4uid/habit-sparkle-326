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
  difficulty: 'easy' | 'medium' | 'hard';
  user_id: string;
  created_at: string;
}

export type Habit = Task;
export type HabitCategory = string;
export type HabitFrequency = 'daily' | 'weekly';

export interface Completion {
  id: string;
  task_id: string;
  completed_date: string;
  user_id: string;
}

export type MobileView = 'dashboard' | 'tasks' | 'focus' | 'tools' | 'profile';

interface UIState {
  selectedMonth: number;
  selectedYear: number;
  selectedCategory: string;
  weeklyPlanningEnabled: boolean;
  screenshotMode: boolean;
  focusModeOpen: boolean;
  scratchpadOpen: boolean;
  mobileView: MobileView;
  autoSchedulerOpen: boolean;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedCategory: (cat: string) => void;
  setWeeklyPlanningEnabled: (enabled: boolean) => void;
  setScreenshotMode: (enabled: boolean) => void;
  setFocusModeOpen: (open: boolean) => void;
  setScratchpadOpen: (open: boolean) => void;
  setMobileView: (view: MobileView) => void;
  setAutoSchedulerOpen: (open: boolean) => void;
}

const now = new Date();

export const useUIStore = create<UIState>((set) => ({
  selectedMonth: now.getMonth(),
  selectedYear: now.getFullYear(),
  selectedCategory: 'all',
  weeklyPlanningEnabled: true,
  screenshotMode: false,
  focusModeOpen: false,
  scratchpadOpen: false,
  mobileView: 'dashboard',
  autoSchedulerOpen: false,
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setWeeklyPlanningEnabled: (enabled) => set({ weeklyPlanningEnabled: enabled }),
  setScreenshotMode: (enabled) => set({ screenshotMode: enabled }),
  setFocusModeOpen: (open) => set({ focusModeOpen: open }),
  setScratchpadOpen: (open) => set({ scratchpadOpen: open }),
  setMobileView: (view) => set({ mobileView: view }),
  setAutoSchedulerOpen: (open) => set({ autoSchedulerOpen: open }),
}));

export const useHabitStore = useUIStore;
