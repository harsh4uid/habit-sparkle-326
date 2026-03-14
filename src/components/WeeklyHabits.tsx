import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useHabitStore } from '@/stores/useHabitStore';
import { formatDate, getDaysInMonth, categoryColors } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';

export function WeeklyHabits() {
  const { habits, completions, selectedMonth, selectedYear, toggleCompletion } = useHabitStore();

  const weeklyHabits = habits.filter((h) => h.frequency === 'weekly');
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const weeks = Array.from({ length: 4 }, (_, i) => ({
    label: `Week ${i + 1}`,
    start: i * 7 + 1,
    end: Math.min((i + 1) * 7, daysInMonth),
  }));

  if (weeklyHabits.length === 0) return null;

  const isWeekCompleted = (habitId: string, weekStart: number, weekEnd: number) => {
    for (let d = weekStart; d <= weekEnd; d++) {
      if (completions[formatDate(selectedYear, selectedMonth, d)]?.[habitId]) return true;
    }
    return false;
  };

  const toggleWeek = (habitId: string, weekStart: number, weekEnd: number) => {
    const completed = isWeekCompleted(habitId, weekStart, weekEnd);
    // Toggle the first day of the week as representative
    const date = formatDate(selectedYear, selectedMonth, weekStart);
    if (completed) {
      // Find and untoggle the completed day
      for (let d = weekStart; d <= weekEnd; d++) {
        const dd = formatDate(selectedYear, selectedMonth, d);
        if (completions[dd]?.[habitId]) {
          toggleCompletion(dd, habitId);
          return;
        }
      }
    } else {
      toggleCompletion(date, habitId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Weekly Habits</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {weeklyHabits.map((habit) => {
          const colors = categoryColors[habit.category];
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-border bg-card p-4 pulse-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('h-2 w-2 rounded-full', colors.dot)} />
                <span className="text-sm font-medium text-foreground">{habit.name}</span>
              </div>
              <div className="space-y-2">
                {weeks.map((week) => {
                  const completed = isWeekCompleted(habit.id, week.start, week.end);
                  return (
                    <button
                      key={week.label}
                      onClick={() => toggleWeek(habit.id, week.start, week.end)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all',
                        completed
                          ? 'bg-accent/15 text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      <span>{week.label}</span>
                      {completed && <Check className="h-3.5 w-3.5 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
