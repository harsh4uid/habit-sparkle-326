import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useUIStore, type Task } from '@/stores/useHabitStore';
import { useCategories } from '@/hooks/useCategories';
import { getDaysInMonth, formatDate, isScheduledForDay, isPast, isToday } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HabitGridProps {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  onToggle: (date: string, taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function HabitGrid({ tasks, completionMap, onToggle, onEditTask, onDeleteTask }: HabitGridProps) {
  const { selectedMonth, selectedYear, selectedCategory } = useUIStore();
  const { categories } = useCategories();

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredTasks = tasks.filter((t) => {
    if (t.frequency !== 'daily') return false;
    if (selectedCategory === 'all') return true;
    return t.category_id === selectedCategory;
  });

  const today = new Date();
  const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  const todayDate = today.getDate();

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#3b82f6';
  };

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

        {/* Task rows */}
        {filteredTasks.map((task, index) => {
          const color = getCategoryColor(task.category_id);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className="flex items-center gap-0 group"
            >
              <div className="w-48 shrink-0 flex items-center gap-2 pr-3 py-1.5">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium text-foreground truncate">{task.name}</span>
              </div>

              {days.map((day) => {
                const date = formatDate(selectedYear, selectedMonth, day);
                const completed = !!completionMap[date]?.[task.id];
                const scheduled = isScheduledForDay(task, selectedYear, selectedMonth, day);
                const past = isPast(selectedYear, selectedMonth, day);
                const isTodayCell = isToday(selectedYear, selectedMonth, day);
                const isFuture = isCurrentMonth && day > todayDate;
                const missed = past && scheduled && !completed;

                return (
                  <div key={day} className="flex-1 min-w-[28px] flex items-center justify-center py-1">
                    {scheduled ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={isTodayCell ? { scale: 0.85 } : undefined}
                            disabled={!isTodayCell}
                            onClick={() => isTodayCell && onToggle(date, task.id)}
                            className={cn(
                              'h-6 w-6 rounded-md border transition-all duration-200',
                              completed
                                ? 'bg-accent border-accent shadow-sm shadow-accent/25'
                                : missed
                                  ? 'bg-destructive/20 border-destructive/50'
                                  : isFuture
                                    ? 'border-border/50 bg-transparent cursor-not-allowed opacity-30'
                                    : isTodayCell
                                      ? 'border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                                      : 'border-border/50 bg-transparent cursor-not-allowed opacity-50'
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {missed ? `Missed — ${task.name}` : `${task.name} — Day ${day}`}
                          {past && !completed && !missed ? '' : ''}
                          {!isTodayCell && !isFuture && !missed ? ' (locked)' : ''}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-muted/20 opacity-20" />
                    )}
                  </div>
                );
              })}

              <div className="w-16 shrink-0 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditTask(task)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDeleteTask(task.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
