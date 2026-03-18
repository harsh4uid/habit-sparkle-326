import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  startDate?: string;
}

export function FailureRecovery({ tasks, completionMap }: Props) {
  const analysis = useMemo(() => {
    const today = new Date();
    let consecutiveMissedDays = 0;

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
      const scheduled = tasks.filter(
        (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
      );
      if (scheduled.length === 0) continue;
      const completed = scheduled.filter((t) => completionMap[dateStr]?.[t.id]).length;
      const rate = completed / scheduled.length;
      if (rate < 0.3) consecutiveMissedDays++;
      else break;
    }

    return { consecutiveMissedDays, shouldShow: consecutiveMissedDays >= 3 };
  }, [tasks, completionMap]);

  if (!analysis.shouldShow) return null;

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
          <ShieldAlert className="h-4 w-4" /> Recovery Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-foreground">
          You've had {analysis.consecutiveMissedDays} tough days in a row. That's okay — here's how to bounce back:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>🎯 Pick just 1-2 tasks for today</li>
          <li>⏱️ Start with a 5-minute focus session</li>
          <li>📊 Consider reducing your daily task count</li>
        </ul>
        <Button size="sm" variant="outline" className="w-full text-xs">
          Start Small — Pick One Task
        </Button>
      </CardContent>
    </Card>
  );
}
