import { useUIStore, type Task } from '@/stores/useHabitStore';
import { calculateCompletionRate } from '@/lib/habitUtils';
import { CompletionRing } from './CompletionRing';
import { WeeklyStats } from './WeeklyStats';
import { ProgressChart } from './ProgressChart';

interface AnalyticsPanelProps {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function AnalyticsPanel({ tasks, completionMap }: AnalyticsPanelProps) {
  const { selectedMonth, selectedYear } = useUIStore();
  const overallRate = calculateCompletionRate(tasks, completionMap, selectedMonth, selectedYear, 'daily');

  return (
    <aside className="w-72 shrink-0 border-l border-border bg-card p-5 space-y-8 hidden xl:block overflow-y-auto">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Overall Completion</h3>
        <div className="flex justify-center">
          <CompletionRing percentage={overallRate} size={140} strokeWidth={10} />
        </div>
      </div>
      <WeeklyStats tasks={tasks} completionMap={completionMap} />
      <ProgressChart tasks={tasks} completionMap={completionMap} />
    </aside>
  );
}
