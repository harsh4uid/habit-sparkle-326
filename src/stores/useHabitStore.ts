import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HabitCategory = 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness';
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  createdAt: string;
}

export interface HabitState {
  habits: Habit[];
  completions: Record<string, Record<string, boolean>>; // { "YYYY-MM-DD": { habitId: true } }
  selectedMonth: number;
  selectedYear: number;
  selectedCategory: HabitCategory | 'all';
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (date: string, habitId: string) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedCategory: (category: HabitCategory | 'all') => void;
  isCompleted: (date: string, habitId: string) => boolean;
}

const now = new Date();

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [
        { id: '1', name: 'Morning Exercise', category: 'fitness', frequency: 'daily', createdAt: new Date().toISOString() },
        { id: '2', name: 'Read 30 Minutes', category: 'learning', frequency: 'daily', createdAt: new Date().toISOString() },
        { id: '3', name: 'Meditate', category: 'mindfulness', frequency: 'daily', createdAt: new Date().toISOString() },
        { id: '4', name: 'Drink 8 Glasses Water', category: 'health', frequency: 'daily', createdAt: new Date().toISOString() },
        { id: '5', name: 'Write Journal', category: 'productivity', frequency: 'daily', createdAt: new Date().toISOString() },
        { id: '6', name: 'Meal Planning', category: 'health', frequency: 'weekly', createdAt: new Date().toISOString() },
        { id: '7', name: 'Declutter Space', category: 'productivity', frequency: 'weekly', createdAt: new Date().toISOString() },
        { id: '8', name: 'Learn New Skill', category: 'learning', frequency: 'weekly', createdAt: new Date().toISOString() },
        { id: '9', name: 'Tech-free Evening', category: 'mindfulness', frequency: 'weekly', createdAt: new Date().toISOString() },
      ],
      completions: {},
      selectedMonth: now.getMonth(),
      selectedYear: now.getFullYear(),
      selectedCategory: 'all',

      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { ...habit, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      toggleCompletion: (date, habitId) =>
        set((state) => {
          const dayCompletions = { ...(state.completions[date] || {}) };
          if (dayCompletions[habitId]) {
            delete dayCompletions[habitId];
          } else {
            dayCompletions[habitId] = true;
          }
          return { completions: { ...state.completions, [date]: dayCompletions } };
        }),

      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      isCompleted: (date, habitId) => {
        const state = get();
        return !!state.completions[date]?.[habitId];
      },
    }),
    { name: 'pulse-habits' }
  )
);
