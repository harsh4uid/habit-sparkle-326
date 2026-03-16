import { useMemo } from 'react';
import type { Task } from '@/stores/useHabitStore';
import { useFocusSessions } from '@/hooks/useFocusSessions';
import { formatDate, isScheduledForDay } from '@/lib/habitUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Swords } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
}

function getWeekCompletionCount(tasks: Task[], completionMap: Record<string, Record<string, string>>): number {
  const today = new Date();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    for (const task of tasks) {
      if (completionMap[dateStr]?.[task.id]) count++;
    }
  }
  return count;
}

export function WeeklyChallenges({ tasks, completionMap }: Props) {
  const { totalFocusMinutesToday } = useFocusSessions();

  const weekCompletions = useMemo(
    () => getWeekCompletionCount(tasks, completionMap),
    [tasks, completionMap]
  );

  const challenges = [
    { title: 'Complete 30 tasks this week', current: weekCompletions, target: 30, reward: 100 },
    { title: 'Focus for 10 hours total', current: Math.round(totalFocusMinutesToday), target: 600, reward: 150 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Swords className="h-4 w-4" /> Weekly Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.map((c, i) => {
          const pct = Math.min(Math.round((c.current / c.target) * 100), 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground">{c.title}</span>
                <span className="text-muted-foreground">{c.current}/{c.target}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              {pct >= 100 && <span className="text-[10px] text-accent font-medium">✅ +{c.reward} XP</span>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
