import { useHabitStore } from '@/stores/useHabitStore';
import { getWeeklyCompletionRates } from '@/lib/habitUtils';
import { CompletionRing } from './CompletionRing';

export function WeeklyStats() {
  const { habits, completions, selectedMonth, selectedYear } = useHabitStore();
  const rates = getWeeklyCompletionRates(habits, completions, selectedMonth, selectedYear);

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
