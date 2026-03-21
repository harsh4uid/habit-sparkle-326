import { useUIStore, type Task } from '@/stores/useHabitStore';
import { getWeeklyCompletionRates } from '@/lib/habitUtils';
import { CompletionRing } from './CompletionRing';

interface WeeklyStatsProps {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function WeeklyStats({ tasks, completionMap }: WeeklyStatsProps) {
  const { selectedMonth, selectedYear } = useUIStore();
  const rates = getWeeklyCompletionRates(tasks, completionMap, selectedMonth, selectedYear);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Weekly Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        {rates.map((rate, i) => (
          <CompletionRing key={i} percentage={rate} size={80} strokeWidth={6} label={`Week ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
