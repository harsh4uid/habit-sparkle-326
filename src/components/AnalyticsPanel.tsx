import { useUIStore, type Task } from '@/stores/useHabitStore';
import { calculateCompletionRate } from '@/lib/habitUtils';
import { CompletionRing } from './CompletionRing';
import { WeeklyStats } from './WeeklyStats';
import { ProgressChart } from './ProgressChart';
import { AchievementBadges } from './AchievementBadges';
import { Goals } from './Goals';
import { HeatmapCalendar } from './HeatmapCalendar';
import { useGamification, xpForLevel } from '@/hooks/useGamification';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface AnalyticsPanelProps {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function AnalyticsPanel({ tasks, completionMap }: AnalyticsPanelProps) {
  const { selectedMonth, selectedYear } = useUIStore();
  const overallRate = calculateCompletionRate(tasks, completionMap, selectedMonth, selectedYear, 'daily');
  const { totalXP, level, progress, nextLevelXP } = useGamification();

  return (
    <aside className="w-72 shrink-0 border-l border-border bg-card p-5 space-y-6 hidden xl:block overflow-y-auto">
      {/* XP & Level */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Level {level}</span>
          <span className="text-xs text-muted-foreground ml-auto">{totalXP} XP</span>
        </div>
        <Progress value={progress} className="h-2" />
        <span className="text-[10px] text-muted-foreground">Next level: {nextLevelXP} XP</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Overall Completion</h3>
        <div className="flex justify-center">
          <CompletionRing percentage={overallRate} size={140} strokeWidth={10} />
        </div>
      </div>

      <WeeklyStats tasks={tasks} completionMap={completionMap} />
      <ProgressChart tasks={tasks} completionMap={completionMap} />

      <HeatmapCalendar tasks={tasks} completionMap={completionMap} />

      <AchievementBadges />
      <Goals />
    </aside>
  );
}
