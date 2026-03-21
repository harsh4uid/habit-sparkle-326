import { useState } from 'react';
import { useDopamineLogs } from '@/hooks/useDopamineLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export function DopamineTracker() {
  const { logs, addLog, productiveMinutes, distractingMinutes, balanceScore } = useDopamineLogs();
  const [adding, setAdding] = useState(false);
  const [activity, setActivity] = useState('');
  const [type, setType] = useState<'productive' | 'distracting'>('productive');
  const [duration, setDuration] = useState('30');

  const handleAdd = () => {
    if (!activity.trim()) return;
    addLog.mutate({ activity: activity.trim(), type, duration_minutes: parseInt(duration) || 0 });
    setActivity('');
    setDuration('30');
    setAdding(false);
  };

  const balanceColor = balanceScore > 20 ? 'text-accent' : balanceScore < -20 ? 'text-destructive' : 'text-chart-4';

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Dopamine Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="flex items-center gap-1 text-accent">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-semibold">{productiveMinutes}m</span>
            </div>
            <span className="text-[9px] text-muted-foreground">Productive</span>
          </div>
          <div className={`text-2xl font-bold ${balanceColor}`}>{balanceScore > 0 ? '+' : ''}{balanceScore}%</div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span className="text-xs font-semibold">{distractingMinutes}m</span>
            </div>
            <span className="text-[9px] text-muted-foreground">Distracting</span>
          </div>
        </div>

        {balanceScore < -20 && (
          <p className="text-[10px] text-destructive/80 bg-destructive/5 rounded-lg p-2">
            ⚠️ You're consuming too much low-value dopamine. Try replacing a distracting activity with something productive.
          </p>
        )}

        {adding ? (
          <div className="space-y-2">
            <Input placeholder="Activity name" value={activity} onChange={(e) => setActivity(e.target.value)} className="text-xs" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={type === 'productive' ? 'default' : 'outline'}
                className="flex-1 text-xs"
                onClick={() => setType('productive')}
              >✅ Productive</Button>
              <Button
                size="sm"
                variant={type === 'distracting' ? 'destructive' : 'outline'}
                className="flex-1 text-xs"
                onClick={() => setType('distracting')}
              >📱 Distracting</Button>
            </div>
            <Input type="number" placeholder="Minutes" value={duration} onChange={(e) => setDuration(e.target.value)} className="text-xs" />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 text-xs" onClick={handleAdd}>Log</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full text-xs gap-1" onClick={() => setAdding(true)}>
            <Plus className="h-3 w-3" /> Log Activity
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
