import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useHabitStore, Habit } from '@/stores/useHabitStore';
import { getDaysInMonth, formatDate, categoryColors, isScheduledForDay } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HabitGridProps {
  onEditHabit: (habit: Habit) => void;
}

export function HabitGrid({ onEditHabit }: HabitGridProps) {
  const { habits, completions, selectedMonth, selectedYear, selectedCategory, toggleCompletion, deleteHabit } = useHabitStore();

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredHabits = habits.filter((h) => {
    if (h.frequency !== 'daily') return false;
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  const today = new Date();
  const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  const todayDate = today.getDate();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day headers */}
        <div className="flex items-center gap-0 mb-1">
          <div className="w-48 shrink-0" />
          {days.map((day) => (
            <div
              key={day}
              className={cn(
                'flex-1 min-w-[28px] text-center text-xs font-medium py-1.5',
                isCurrentMonth && day === todayDate
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground'
              )}
            >
              {day}
            </div>
          ))}
          <div className="w-16 shrink-0" />
        </div>

        {/* Habit rows */}
        {filteredHabits.map((habit, index) => {
          const colors = categoryColors[habit.category];
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className="flex items-center gap-0 group"
            >
              {/* Habit name */}
              <div className="w-48 shrink-0 flex items-center gap-2 pr-3 py-1.5">
                <div className={cn('h-2 w-2 rounded-full shrink-0', colors.dot)} />
                <span className="text-sm font-medium text-foreground truncate">{habit.name}</span>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const date = formatDate(selectedYear, selectedMonth, day);
                const completed = !!completions[date]?.[habit.id];
                const isFuture = isCurrentMonth && day > todayDate;

                return (
                  <div key={day} className="flex-1 min-w-[28px] flex items-center justify-center py-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          disabled={isFuture}
                          onClick={() => toggleCompletion(date, habit.id)}
                          className={cn(
                            'h-6 w-6 rounded-md border transition-all duration-200',
                            completed
                              ? 'bg-accent border-accent shadow-sm shadow-accent/25'
                              : isFuture
                                ? 'border-border/50 bg-transparent cursor-not-allowed opacity-30'
                                : 'border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {habit.name} — Day {day}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}

              {/* Actions */}
              <div className="w-16 shrink-0 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditHabit(habit)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteHabit(habit.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No habits found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
