import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { useFocusSessions } from '@/hooks/useFocusSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

export function BurnoutDetector({ tasks, completionMap }: Props) {
  const { totalFocusMinutesToday } = useFocusSessions();

  const analysis = useMemo(() => {
    const today = new Date();
    const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    const scheduledToday = tasks.filter(
      (t) => t.frequency === 'daily' && isScheduledForDay(t, today.getFullYear(), today.getMonth(), today.getDate())
    );
    const overloaded = scheduledToday.length > 8;

    let lowCompletionDays = 0;
    for (let i = 1; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
      const scheduled = tasks.filter(
        (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
      );
      if (scheduled.length === 0) continue;
      const completed = scheduled.filter((t) => completionMap[dateStr]?.[t.id]).length;
      if (completed / scheduled.length < 0.3) lowCompletionDays++;
    }

    const overworked = totalFocusMinutesToday > 180;

    const riskLevel =
      (overloaded ? 1 : 0) + (lowCompletionDays >= 2 ? 1 : 0) + (overworked ? 1 : 0);

    return { overloaded, lowCompletionDays, overworked, riskLevel, shouldShow: riskLevel >= 2 };
  }, [tasks, completionMap, totalFocusMinutesToday]);

  if (!analysis.shouldShow) return null;

  return (
    <Card className="border-chart-4/30 bg-chart-4/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-chart-4">
          <AlertTriangle className="h-4 w-4" /> Burnout Risk Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-foreground">You may be pushing too hard. Consider:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          {analysis.overloaded && <li>📋 You have 8+ tasks today — try reducing to 5-6</li>}
          {analysis.lowCompletionDays >= 2 && <li>📉 Low completion for {analysis.lowCompletionDays} days — take it easier</li>}
          {analysis.overworked && <li>⏱️ 3+ hours of focus without a break — rest up</li>}
          <li>💡 Quality over quantity — fewer tasks, better done</li>
        </ul>
      </CardContent>
    </Card>
  );
}
