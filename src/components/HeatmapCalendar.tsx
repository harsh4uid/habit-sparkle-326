import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  startDate?: string;
}

function getHeatmapData(tasks: Task[], completionMap: Record<string, Record<string, string>>, startDate?: string) {
  const startD = startDate ? new Date(startDate + 'T00:00:00') : null;
  const today = new Date();
  const data: { date: string; rate: number; day: Date }[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    if (startD && d < startD) {
      data.push({ date: dateStr, rate: -1, day: new Date(d) });
      continue;
    }
    const scheduled = tasks.filter(
      (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
    );
    if (scheduled.length === 0) {
      data.push({ date: dateStr, rate: -1, day: new Date(d) });
      continue;
    }
    const completed = scheduled.filter((t) => completionMap[dateStr]?.[t.id]).length;
    data.push({ date: dateStr, rate: Math.round((completed / scheduled.length) * 100), day: new Date(d) });
  }
  return data;
}

function getColor(rate: number): string {
  if (rate === -1) return 'bg-muted/30';
  if (rate >= 90) return 'bg-accent';
  if (rate >= 60) return 'bg-accent/60';
  if (rate >= 30) return 'bg-chart-4/60';
  if (rate > 0) return 'bg-destructive/40';
  return 'bg-destructive/20';
}

export function HeatmapCalendar({ tasks, completionMap }: Props) {
  const data = useMemo(() => getHeatmapData(tasks, completionMap), [tasks, completionMap]);

  // Group by week (columns)
  const weeks: typeof data[] = [];
  let currentWeek: typeof data = [];
  // Pad first week
  const firstDayOfWeek = data[0]?.day.getDay() || 0;
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', rate: -2, day: new Date() });
  }

  for (const d of data) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-0.5 overflow-x-auto">
          <div className="flex flex-col gap-0.5 mr-1">
            {dayLabels.map((l, i) => (
              <div key={i} className="h-3 w-3 flex items-center justify-center">
                <span className="text-[8px] text-muted-foreground">{i % 2 === 1 ? l : ''}</span>
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((d, di) => (
                d.rate === -2 ? (
                  <div key={di} className="h-3 w-3" />
                ) : (
                  <Tooltip key={di}>
                    <TooltipTrigger asChild>
                      <div className={`h-3 w-3 rounded-[2px] ${getColor(d.rate)} transition-colors`} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {d.date}: {d.rate === -1 ? 'No tasks' : `${d.rate}%`}
                    </TooltipContent>
                  </Tooltip>
                )
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2 justify-end">
          <span className="text-[9px] text-muted-foreground">Less</span>
          <div className="h-2.5 w-2.5 rounded-[2px] bg-destructive/20" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-destructive/40" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-chart-4/60" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/60" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
          <span className="text-[9px] text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
