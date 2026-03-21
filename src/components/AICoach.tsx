import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { formatDate, isScheduledForDay, getCurrentLogicalDate } from '@/lib/habitUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, TrendingUp, AlertTriangle, Flame, BarChart3 } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  streak: number;
  startDate?: string;
}

interface Insight {
  icon: typeof TrendingUp;
  message: string;
  type: 'positive' | 'warning' | 'neutral';
}

function analyzePatterns(tasks: Task[], completionMap: Record<string, Record<string, string>>, streak: number, startDate?: string): Insight[] {
  const startD = startDate ? new Date(startDate + 'T00:00:00') : null;
  const insights: Insight[] = [];
  const today = getCurrentLogicalDate();

  // Analyze last 14 days completion by time of day (morning vs evening tasks)
  let morningCompleted = 0, morningTotal = 0;
  let eveningCompleted = 0, eveningTotal = 0;

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (startD && d < startD) break;
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    const scheduled = tasks.filter(
      (t) => t.frequency === 'daily' && isScheduledForDay(t, d.getFullYear(), d.getMonth(), d.getDate())
    );
    const half = Math.ceil(scheduled.length / 2);
    const morning = scheduled.slice(0, half);
    const evening = scheduled.slice(half);

    morningTotal += morning.length;
    morningCompleted += morning.filter((t) => completionMap[dateStr]?.[t.id]).length;
    eveningTotal += evening.length;
    eveningCompleted += evening.filter((t) => completionMap[dateStr]?.[t.id]).length;
  }

  const morningRate = morningTotal > 0 ? morningCompleted / morningTotal : 0;
  const eveningRate = eveningTotal > 0 ? eveningCompleted / eveningTotal : 0;

  if (morningRate > eveningRate + 0.15 && morningTotal > 5) {
    insights.push({ icon: TrendingUp, message: "You're most productive earlier in the day. Consider front-loading tasks.", type: 'positive' });
  } else if (eveningRate > morningRate + 0.15 && eveningTotal > 5) {
    insights.push({ icon: TrendingUp, message: "You perform better later. Schedule important work in the afternoon.", type: 'positive' });
  }

  // Missed tasks analysis
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  const todayScheduled = tasks.filter(
    (t) => t.frequency === 'daily' && isScheduledForDay(t, today)
  );
  const missed = todayScheduled.filter((t) => !completionMap[todayStr]?.[t.id]).length;
  if (missed > 3) {
    insights.push({ icon: AlertTriangle, message: `You have ${missed} pending tasks today. Break them into smaller steps.`, type: 'warning' });
  }

  // Streak
  if (streak >= 7) {
    insights.push({ icon: Flame, message: `Amazing ${streak}-day streak! You're building strong momentum.`, type: 'positive' });
  } else if (streak >= 3) {
    insights.push({ icon: Flame, message: `${streak}-day streak going! Keep it up to hit 7 days.`, type: 'positive' });
  }

  // Category balance
  const categoryCompletions: Record<string, { done: number; total: number }> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (startD && d < startD) break;
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    for (const t of tasks) {
      if (t.frequency !== 'daily') continue;
      if (!categoryCompletions[t.category_id]) categoryCompletions[t.category_id] = { done: 0, total: 0 };
      categoryCompletions[t.category_id].total++;
      if (completionMap[dateStr]?.[t.id]) categoryCompletions[t.category_id].done++;
    }
  }
  const neglected = Object.entries(categoryCompletions).find(
    ([, v]) => v.total > 3 && v.done / v.total < 0.3
  );
  if (neglected) {
    insights.push({ icon: BarChart3, message: "Some categories are being neglected. Try balancing your workload.", type: 'warning' });
  }

  if (insights.length === 0) {
    insights.push({ icon: TrendingUp, message: "Keep going! Complete tasks consistently to see personalized insights.", type: 'neutral' });
  }

  return insights.slice(0, 3);
}

export function AICoach({ tasks, completionMap, streak, startDate }: Props) {
  const insights = useMemo(() => analyzePatterns(tasks, completionMap, streak, startDate), [tasks, completionMap, streak, startDate]);

  const colorMap = {
    positive: 'text-accent',
    warning: 'text-chart-4',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" /> AI Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="flex items-start gap-2.5">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorMap[insight.type]}`} />
              <p className="text-xs text-foreground leading-relaxed">{insight.message}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
