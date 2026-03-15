import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { useCategories } from '@/hooks/useCategories';
import { formatDate, getDaysInMonth, isToday } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';

interface WeeklyHabitsProps {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  onToggle: (date: string, taskId: string) => void;
}

export function WeeklyHabits({ tasks, completionMap, onToggle }: WeeklyHabitsProps) {
  const { selectedMonth, selectedYear, weeklyPlanningEnabled } = useUIStore();
  const { categories } = useCategories();

  const weeklyTasks = tasks.filter((t) => t.frequency === 'weekly');
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const weeks = Array.from({ length: 4 }, (_, i) => ({
    label: `Week ${i + 1}`,
    start: i * 7 + 1,
    end: Math.min((i + 1) * 7, daysInMonth),
  }));

  if (!weeklyPlanningEnabled || weeklyTasks.length === 0) return null;

  const isWeekCompleted = (taskId: string, weekStart: number, weekEnd: number) => {
    for (let d = weekStart; d <= weekEnd; d++) {
      if (completionMap[formatDate(selectedYear, selectedMonth, d)]?.[taskId]) return true;
    }
    return false;
  };

  const isCurrentWeek = (weekStart: number, weekEnd: number) => {
    const today = new Date();
    if (today.getFullYear() !== selectedYear || today.getMonth() !== selectedMonth) return false;
    return today.getDate() >= weekStart && today.getDate() <= weekEnd;
  };

  const toggleWeek = (taskId: string, weekStart: number, weekEnd: number) => {
    if (!isCurrentWeek(weekStart, weekEnd)) return;
    const completed = isWeekCompleted(taskId, weekStart, weekEnd);
    if (completed) {
      for (let d = weekStart; d <= weekEnd; d++) {
        const dd = formatDate(selectedYear, selectedMonth, d);
        if (completionMap[dd]?.[taskId]) {
          // Only toggle if it's today's date
          if (isToday(selectedYear, selectedMonth, d)) {
            onToggle(dd, taskId);
          }
          return;
        }
      }
    } else {
      // Mark today
      const today = new Date();
      const date = formatDate(selectedYear, selectedMonth, today.getDate());
      onToggle(date, taskId);
    }
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#3b82f6';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Weekly Tasks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {weeklyTasks.map((task) => {
          const color = getCategoryColor(task.category_id);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-border bg-card p-4 pulse-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium text-foreground">{task.name}</span>
              </div>
              <div className="space-y-2">
                {weeks.map((week) => {
                  const completed = isWeekCompleted(task.id, week.start, week.end);
                  const current = isCurrentWeek(week.start, week.end);
                  return (
                    <button
                      key={week.label}
                      onClick={() => toggleWeek(task.id, week.start, week.end)}
                      disabled={!current}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all',
                        completed
                          ? 'bg-accent/15 text-accent-foreground'
                          : current
                            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                            : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
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
