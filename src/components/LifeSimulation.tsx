import { useLifeStats } from '@/hooks/useLifeStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Swords } from 'lucide-react';

const ATTRIBUTES = [
  { key: 'discipline' as const, label: 'Discipline', emoji: '🎯', color: 'hsl(var(--chart-1))' },
  { key: 'focus' as const, label: 'Focus', emoji: '🧠', color: 'hsl(var(--chart-3))' },
  { key: 'knowledge' as const, label: 'Knowledge', emoji: '📚', color: 'hsl(var(--chart-4))' },
  { key: 'health' as const, label: 'Health', emoji: '💪', color: 'hsl(var(--chart-2))' },
];

export function LifeSimulation() {
  const { stats } = useLifeStats();
  const overallLevel = Math.floor((stats.discipline + stats.focus + stats.knowledge + stats.health) / 40);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" /> Life Simulation
          <span className="ml-auto text-xs text-muted-foreground">Lv. {overallLevel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ATTRIBUTES.map((attr) => (
          <div key={attr.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">{attr.emoji} {attr.label}</span>
              <span className="text-xs font-semibold text-muted-foreground">{stats[attr.key]}/100</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${stats[attr.key]}%`, backgroundColor: attr.color }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
