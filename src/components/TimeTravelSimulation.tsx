import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { useGamification, calculateLevel, xpForLevel } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, TrendingDown } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function TimeTravelSimulation({ tasks, completionMap }: Props) {
  const { totalXP, level } = useGamification();

  const projection = useMemo(() => {
    const today = new Date();
    let totalScheduled = 0;
    let totalCompleted = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
      const scheduled = tasks.filter(
        (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
      );
      totalScheduled += scheduled.length;
      totalCompleted += scheduled.filter((t) => completionMap[dateStr]?.[t.id]).length;
    }

    const rate = totalScheduled > 0 ? totalCompleted / totalScheduled : 0;
    const avgTasksPerDay = totalScheduled / 7;
    const avgCompletedPerDay = totalCompleted / 7;

    // 30-day positive projection
    const projected30Tasks = Math.round(avgCompletedPerDay * 30);
    const projectedXPGain = Math.round(avgCompletedPerDay * 25 * 30); // ~25 avg XP per task
    const projectedTotalXP = totalXP + projectedXPGain;
    const projectedLevel = calculateLevel(projectedTotalXP);

    // Negative projection (0% completion)
    const negativeLevel = level; // no change
    const negativeTasks = 0;

    return {
      rate: Math.round(rate * 100),
      projected30Tasks,
      projectedXPGain,
      projectedLevel,
      negativeLevel,
      negativeTasks,
    };
  }, [tasks, completionMap, totalXP, level]);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" /> Time Travel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[10px] text-muted-foreground">If you continue at {projection.rate}% for 30 days:</p>

        <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 space-y-1">
          <p className="text-xs text-accent font-semibold">✅ Positive Scenario</p>
          <p className="text-[10px] text-foreground">📊 {projection.projected30Tasks} tasks completed</p>
          <p className="text-[10px] text-foreground">⚡ +{projection.projectedXPGain} XP → Level {projection.projectedLevel}</p>
        </div>

        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1">
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-destructive" />
            <p className="text-xs text-destructive font-semibold">If you stop now</p>
          </div>
          <p className="text-[10px] text-foreground">📊 0 tasks completed</p>
          <p className="text-[10px] text-foreground">⚡ 0 XP gained — Stay at Level {projection.negativeLevel}</p>
        </div>
      </CardContent>
    </Card>
  );
}
