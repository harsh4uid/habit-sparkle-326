import { useState, useEffect } from 'react';
import { Header } from './Header';
import { CategorySidebar } from './CategorySidebar';
import { HabitGrid } from './HabitGrid';
import { HabitForm } from './HabitForm';
import { AnalyticsPanel } from './AnalyticsPanel';
import { WeeklyHabits } from './WeeklyHabits';
import { CompletionRing } from './CompletionRing';
import { WeeklyStats } from './WeeklyStats';
import { ProgressChart } from './ProgressChart';
import { useHabitStore, Habit } from '@/stores/useHabitStore';
import { calculateCompletionRate } from '@/lib/habitUtils';

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pulse-dark-mode') === 'true';
    }
    return false;
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { habits, completions, selectedMonth, selectedYear } = useHabitStore();
  const overallRate = calculateCompletionRate(habits, completions, selectedMonth, selectedYear, 'daily');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pulse-dark-mode', String(darkMode));
  }, [darkMode]);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingHabit(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onAddHabit={() => setFormOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Habit Grid Card */}
          <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
            <h2 className="text-sm font-semibold text-foreground mb-4">Daily Habits</h2>
            <HabitGrid onEditHabit={handleEditHabit} />
          </div>

          {/* Mobile/Tablet Analytics */}
          <div className="xl:hidden space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
              <h3 className="text-sm font-semibold text-foreground mb-4">Analytics</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <CompletionRing percentage={overallRate} size={120} strokeWidth={8} label="Overall" />
                <div className="flex-1 w-full">
                  <WeeklyStats />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
              <ProgressChart />
            </div>
          </div>

          {/* Weekly Habits */}
          <div className="rounded-xl border border-border bg-card p-5 pulse-shadow">
            <WeeklyHabits />
          </div>
        </main>

        <AnalyticsPanel />
      </div>

      <HabitForm open={formOpen} onClose={handleCloseForm} editingHabit={editingHabit} />
    </div>
  );
}
