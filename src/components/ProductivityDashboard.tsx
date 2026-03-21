import { type Task } from '@/stores/useHabitStore';
import { useProductivityScore } from '@/hooks/useProductivityScore';
import { useGamification, xpForLevel } from '@/hooks/useGamification';
import { useFocusSessions } from '@/hooks/useFocusSessions';
import { CompletionRing } from './CompletionRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDate, isScheduledForDay, getCurrentLogicalDate, getTodayString } from '@/lib/habitUtils';
import { Flame, Target, Brain, Trophy, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  tasks: Task[];
  completionMap: Record<string, Record<string, string>>;
  streak: number;
}

function getWeekData(tasks: Task[], completionMap: Record<string, Record<string, string>>) {
  const today = getCurrentLogicalDate();
  const data: { day: string; rate: number }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
    const dailyTasks = tasks.filter(
      (t) => t.frequency === 'daily' && isScheduledForDay(t, d)
    );
    const completed = dailyTasks.filter((t) => completionMap[dateStr]?.[t.id]).length;
    const rate = dailyTasks.length > 0 ? Math.round((completed / dailyTasks.length) * 100) : 0;
    data.push({ day: dayNames[d.getDay()], rate });
  }
  return data;
}

export function ProductivityDashboard({ tasks, completionMap, streak }: Props) {
  const { totalFocusMinutesToday } = useFocusSessions();
  const scoreData = useProductivityScore(tasks, completionMap, totalFocusMinutesToday, streak);
  const { totalXP, level, progress, nextLevelXP } = useGamification();
  const weekData = getWeekData(tasks, completionMap);

  const logicalToday = getCurrentLogicalDate();
  const todayStr = getTodayString();
  const priorityTasks = tasks
    .filter(
      (t) =>
        t.frequency === 'daily' &&
        isScheduledForDay(t, logicalToday) &&
        !completionMap[todayStr]?.[t.id]
    )
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Productivity Score */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" /> Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <CompletionRing percentage={scoreData.score} size={100} strokeWidth={8} label={scoreData.tier} />
          <span className="text-xs font-semibold" style={{ color: scoreData.color }}>{scoreData.tier}</span>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" /> Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Completed</span>
            <span className="text-lg font-bold text-foreground">{scoreData.completedToday}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Scheduled</span>
            <span className="text-lg font-bold text-foreground">{scoreData.scheduledToday}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-destructive flex items-center gap-1"><XCircle className="h-3 w-3" /> Missed</span>
            <span className="text-lg font-bold text-destructive">{scoreData.missedToday}</span>
          </div>
        </CardContent>
      </Card>

      {/* Focus Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" /> Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{Math.round(totalFocusMinutesToday)}</span>
          <span className="text-xs text-muted-foreground">minutes today</span>
        </CardContent>
      </Card>

      {/* XP & Level */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" /> Level {level}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{totalXP} <span className="text-xs font-normal text-muted-foreground">XP</span></div>
          <Progress value={progress} className="h-2" />
          <span className="text-[10px] text-muted-foreground">Next: {nextLevelXP} XP</span>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" /> Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{streak}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </CardContent>
      </Card>

      {/* Priority Tasks */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          {priorityTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground">All done! 🎉</p>
          ) : (
            <ul className="space-y-1">
              {priorityTasks.map((t) => (
                <li key={t.id} className="text-xs text-foreground truncate">• {t.name}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Weekly Chart */}
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weekData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value}%`, 'Completion']}
              />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
