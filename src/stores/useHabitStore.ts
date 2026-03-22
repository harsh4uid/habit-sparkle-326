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
  brainToolsOpen: boolean;
  mobileView: MobileView;
  autoSchedulerOpen: boolean;
  dayEndsAt: string;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedCategory: (cat: string) => void;
  setWeeklyPlanningEnabled: (enabled: boolean) => void;
  setScreenshotMode: (enabled: boolean) => void;
  setFocusModeOpen: (open: boolean) => void;
  setScratchpadOpen: (open: boolean) => void;
  setBrainToolsOpen: (open: boolean) => void;
  setMobileView: (view: MobileView) => void;
  setAutoSchedulerOpen: (open: boolean) => void;
  setDayEndsAt: (time: string) => void;
  
  // Task specific local storage
  setTaskTime: (taskId: string, time: string) => void;
  getTaskTime: (taskId: string) => string;
  setCarriedTasks: (date: string, taskIds: string[]) => void;
  getCarriedTasks: (date: string) => string[];
}

const now = new Date();

const getInitialDayEndsAt = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ws-day-ends-at') || '04:00';
  }
  return '04:00';
};

export const useUIStore = create<UIState>((set, get) => ({
  selectedMonth: now.getMonth(),
  selectedYear: now.getFullYear(),
  selectedCategory: 'all',
  weeklyPlanningEnabled: true,
  screenshotMode: false,
  focusModeOpen: false,
  scratchpadOpen: false,
  brainToolsOpen: false,
  mobileView: 'dashboard',
  autoSchedulerOpen: false,
  dayEndsAt: getInitialDayEndsAt(),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setWeeklyPlanningEnabled: (enabled) => set({ weeklyPlanningEnabled: enabled }),
  setScreenshotMode: (enabled) => set({ screenshotMode: enabled }),
  setFocusModeOpen: (open) => set({ focusModeOpen: open }),
  setScratchpadOpen: (open) => set({ scratchpadOpen: open }),
  setBrainToolsOpen: (open) => set({ brainToolsOpen: open }),
  setMobileView: (view) => set({ mobileView: view }),
  setAutoSchedulerOpen: (open) => set({ autoSchedulerOpen: open }),
  setDayEndsAt: (time: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('ws-day-ends-at', time);
    set({ dayEndsAt: time });
  },
  
  setTaskTime: (taskId, time) => {
    if (typeof window === 'undefined') return;
    const times = JSON.parse(localStorage.getItem('ws-task-times') || '{}');
    times[taskId] = time;
    localStorage.setItem('ws-task-times', JSON.stringify(times));
  },
  getTaskTime: (taskId) => {
    if (typeof window === 'undefined') return '04:00';
    const times = JSON.parse(localStorage.getItem('ws-task-times') || '{}');
    return times[taskId] || '04:00';
  },
  setCarriedTasks: (date, taskIds) => {
    if (typeof window === 'undefined') return;
    const carried = JSON.parse(localStorage.getItem('ws-carried-tasks') || '{}');
    carried[date] = taskIds;
    localStorage.setItem('ws-carried-tasks', JSON.stringify(carried));
  },
  getCarriedTasks: (date) => {
    if (typeof window === 'undefined') return [];
    const carried = JSON.parse(localStorage.getItem('ws-carried-tasks') || '{}');
    return carried[date] || [];
  },
}));

export const useHabitStore = useUIStore;
